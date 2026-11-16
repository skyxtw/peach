"""群体研究的同意、只读投影、周期限制和独立传输回归。"""
import gzip
import json
import os
import tempfile
import threading
import unittest
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace
from unittest import mock

from peach import capacity_history, library_sharing as sharing
from peach.repository import LedgerDatabase
from peach.settings_file import PeachConfig
from support.ledger import fresh_ledger

DSN = 'https://public@o123.ingest.us.sentry.io/789'


class CapacityHistoryTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.config = PeachConfig(self.root, self.root / 'config.toml')
        self.today = date(2026, 11, 7)
        self.enterContext(mock.patch.object(capacity_history, '_today', side_effect=lambda: self.today))

    def test_absent_history_is_read_only_and_does_not_manufacture_thirty_days(self):
        value = capacity_history.project(self.config)
        self.assertEqual(value['state'], 'unavailable')
        self.assertFalse(self.config.directory('state').exists())
        self.assertTrue(capacity_history.sample_due(self.config))
        row = value['windows']['30d']
        self.assertEqual((row['observed_days'], row['activity_observed_days']), (0, 0))
        self.assertIsNone(row['active_days'])
        self.assertIsNone(row['data']['current_bytes'])
        self.assertIsNone(row['cleaned_bytes'])

    def test_sample_due_requires_both_actual_measurements_and_resets_at_utc_day_boundary(self):
        capacity_history.record_sample(self.config, None, 50)
        self.assertTrue(capacity_history.sample_due(self.config))
        capacity_history.record_sample(self.config, 100, None)
        self.assertFalse(capacity_history.sample_due(self.config))
        self.today += timedelta(days=1)
        self.assertTrue(capacity_history.sample_due(self.config))
        capacity_history.record_sample(self.config, 0, 0)
        self.assertFalse(capacity_history.sample_due(self.config))

    def test_daily_peaks_growth_and_cleaning_use_observed_samples_inside_each_window(self):
        now = self.today
        self.today = now - timedelta(days=8)
        capacity_history.record_sample(self.config, 100, 50)
        capacity_history.record_activity(self.config)
        self.today = now - timedelta(days=6)
        capacity_history.record_sample(self.config, 120, 60)
        capacity_history.record_sample(self.config, 150, 45, cleaned_bytes=20)
        capacity_history.record_activity(self.config)
        self.today = now
        capacity_history.record_sample(self.config, 140, 70, cleaned_bytes=5)
        self.assertTrue(capacity_history.record_activity(self.config))
        before = capacity_history._path(self.config).read_bytes()
        self.assertFalse(capacity_history.record_activity(self.config))
        self.assertEqual(capacity_history._path(self.config).read_bytes(), before)
        value = capacity_history.project(self.config)
        short, long = (value['windows'][key] for key in ('7d', '30d'))
        self.assertEqual((short['observed_days'], long['observed_days']), (2, 3))
        self.assertEqual((short['active_days'], long['active_days']), (2, 3))
        self.assertEqual((short['activity_observed_days'], long['activity_observed_days']), (7, 9))
        self.assertEqual(short['data'], {'observed_days': 2, 'current_bytes': 140, 'peak_bytes': 150,
                                       'positive_growth_bytes': 30, 'growth_observations': 2})
        self.assertEqual((short['cache']['positive_growth_bytes'], long['cache']['positive_growth_bytes']), (25, 35))
        self.assertEqual(long['data']['positive_growth_bytes'], 50)
        self.assertEqual(short['cleaned_bytes'], 25)
        self.assertTrue(capacity_history.valid_projection(value))

    def test_capacity_samples_do_not_establish_playback_activity_coverage(self):
        now = self.today
        self.today = now - timedelta(days=10)
        capacity_history.record_sample(self.config, 100, 50)
        self.today = now
        self.assertEqual(capacity_history.project(self.config)['windows']['30d']['activity_observed_days'], 0)
        capacity_history.record_activity(self.config)
        row = capacity_history.project(self.config)['windows']['30d']
        self.assertEqual((row['activity_observed_days'], row['active_days']), (1, 1))
        self.assertIsNone(row['data']['positive_growth_bytes'])

    def test_history_is_bounded_and_keeps_the_start_of_recorded_activity(self):
        first = self.today - timedelta(days=capacity_history.RETENTION_DAYS)
        for index in range(capacity_history.RETENTION_DAYS + 1):
            self.today = first + timedelta(days=index)
            capacity_history.record_sample(self.config, index, index)
            capacity_history.record_activity(self.config)
        value = capacity_history._read(self.config)
        self.assertEqual(len(value['days']), capacity_history.RETENTION_DAYS)
        self.assertEqual(value['activity_started'], first.isoformat())
        self.assertNotIn(first.isoformat(), value['days'])

    def test_invalid_or_unknown_history_remains_a_failure_without_scanning_or_disclosing_it(self):
        path = capacity_history._path(self.config)
        path.parent.mkdir(parents=True)
        path.write_text(json.dumps({'private_path': 'R:/private-person', 'schema': 1}))
        value = capacity_history.project(self.config)
        self.assertEqual(value['state'], 'failed')
        self.assertNotIn('private', json.dumps(value))
        with self.assertRaises(ValueError):
            capacity_history.sample_due(self.config)
        with self.assertRaises(ValueError):
            capacity_history.record_sample(self.config, 10, 5)

    def test_sample_values_reject_booleans_nonfinite_negatives_and_excessive_sizes(self):
        for value in (True, -1, 1.5, float('nan'), float('inf'), capacity_history.MAX_BYTES + 1):
            with self.subTest(value=value), self.assertRaises(ValueError):
                capacity_history.record_sample(self.config, value, 0)
        self.assertFalse(capacity_history.record_sample(self.config, None, None))
        self.assertFalse(capacity_history._path(self.config).exists())

    def test_playback_hooks_only_record_explicit_success_and_never_initialize_network_clients(self):
        from peach import web_activity, web_follow
        database = LedgerDatabase(fresh_ledger(self.root))
        with database.write_transaction() as connection:
            connection.execute("INSERT INTO asset(location,path,name) VALUES('local','sample','sample')")
        contract = SimpleNamespace(upgrade_config=self.config, database=database,
            write_transaction=database.write_transaction, cache_bust=mock.Mock(),
            playback_committed=lambda: None)
        with mock.patch('peach.remote_reporting._new_client') as network:
            web_activity.w_play(contract, {'id': 1})
            network.assert_not_called()
        self.assertEqual(capacity_history.project(self.config)['windows']['7d']['active_days'], 1)
        capacity_history._path(self.config).unlink()
        web_activity.w_play(contract, {'id': 999})
        self.assertFalse(capacity_history._path(self.config).exists())
        with mock.patch.object(web_follow, '_store', return_value=SimpleNamespace(record_playback=lambda _item: 'seen')):
            self.assertEqual(web_follow.w_follow_play(contract, {'item': 1})['status'], 'seen')
        self.assertEqual(capacity_history.project(self.config)['windows']['7d']['active_days'], 1)
        with mock.patch.object(capacity_history, 'record_activity', side_effect=OSError('private path')), \
                self.assertLogs('peach.capacity_history', level='WARNING') as logs:
            self.assertTrue(web_activity.w_play(contract, {'id': 1})['ok'])
        self.assertNotIn('private path', ' '.join(logs.output))


class ResearchParticipationTests(unittest.TestCase):
    def setUp(self):
        from peach import research_participation
        self.participation = research_participation
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.config = PeachConfig(self.root, self.root / 'config.toml')
        self.now = datetime(2026, 11, 7, 12, tzinfo=timezone.utc)
        self.enterContext(mock.patch.object(research_participation, '_now', side_effect=lambda: self.now))
        clock = self.enterContext(mock.patch.object(sharing, 'datetime', wraps=datetime))
        clock.now.side_effect = lambda *_args, **_kwargs: self.now
        self.enterContext(mock.patch('peach.remote_reporting._disabled', False))
        self.enterContext(mock.patch.dict(os.environ, {'PEACH_SENTRY_DSN': '', 'PEACH_LIBRARY_SENTRY_DSN': DSN}))
        self.service = sharing.Service(self.config, SimpleNamespace())
        self.addCleanup(self.service.stop)
        self.sent = []

    def client(self, _target, *, envelope_gate, delivery_callback):
        def capture(envelope):
            if not envelope_gate(envelope):
                delivery_callback({'status': 'blocked', 'reason': 'consent'})
                return
            self.assertEqual([item.type for item in envelope.items], ['log'])
            self.sent.append(json.loads(envelope.items[0].payload.get_bytes()))
            delivery_callback({'status': 'accepted', 'status_code': 200})
        return SimpleNamespace(transport=SimpleNamespace(capture_envelope=capture),
                               capture_event=mock.Mock(side_effect=AssertionError('状态不得占用错误事件')),
                               flush=lambda **_kwargs: None, close=lambda **_kwargs: None)

    def envelope(self, record):
        from sentry_sdk.envelope import Envelope, Item, PayloadRef
        result = Envelope(headers={'sent_at': 'now', 'private': 'must-not-send'})
        result.add_item(Item(type='log', payload=PayloadRef(json={'version': 2,
            'items': [self.participation._log(record)]})))
        return result

    def test_daily_contact_contains_bounded_snapshot_evidence_and_closing_omits_it(self):
        sharing.save_choice(self.config, True)
        revision = sharing.consent(self.config)['revision']
        sharing._state_path(self.config).write_text(json.dumps({'schema': sharing.SCHEMA, 'period': sharing._period(),
            'revision': revision, 'attempt_id': 'b' * 32, 'status': 'accepted', 'attempted': True,
            'raw_bytes': 12000, 'compressed_bytes': 3000, 'private': 'must-not-send'}))
        record = self.service.participation._prepare()
        self.assertTrue(self.participation.valid_payload(record['payload']))
        evidence = record['payload']['snapshot']
        self.assertEqual(evidence['snapshot_id'], 'b' * 32)
        self.assertNotIn('revision', evidence)
        self.assertNotIn('private', evidence)
        attributes = self.participation._log(record)['attributes']
        self.assertEqual(attributes['snapshot_raw_bytes']['value'], 12000)
        self.assertEqual(attributes['snapshot_id']['value'], 'b' * 32)
        self.assertNotIn('snapshot', attributes)
        sharing.save_choice(self.config, False)
        closing = self.service.participation._prepare()
        self.assertNotIn('snapshot', closing['payload'])
        self.assertTrue(self.participation.valid_payload(closing['payload']))

    def test_snapshot_evidence_rejects_unknown_fields_and_oversized_values(self):
        value = {'snapshot_id': 'a' * 32, 'period': '2026-W45', 'status': 'failed', 'attempted': False}
        self.assertTrue(self.participation.valid_snapshot(value))
        for extra in ({'path': 'private'}, {'raw_bytes': True}, {'compressed_bytes': sharing.MAX_BYTES + 1},
                      {'status': 'accepted'}, {'reason': 'private error'}):
            self.assertFalse(self.participation.valid_snapshot({**value, **extra}))

    def test_old_scope_and_explicit_disable_without_new_scope_do_not_send_or_initialize_clients(self):
        path = sharing._path(self.config)
        path.parent.mkdir(parents=True)
        for value in ({'schema': 4, 'enabled': True, 'revision': 'a' * 32},
                      {'schema': 5, 'enabled': True, 'revision': 'a' * 32}, {'schema': 4, 'enabled': False}):
            path.write_text(json.dumps(value))
            with mock.patch('peach.remote_reporting._new_client') as client:
                self.service.participation.attempt()
                sharing.save_choice(self.config, False)
                self.service.participation.attempt()
            client.assert_not_called()

    def test_enable_and_daily_contact_only_emit_one_log_and_reenable_rotates_research_identity(self):
        with mock.patch('peach.remote_reporting._new_client', side_effect=self.client) as client:
            sharing.save_choice(self.config, True)
            client.assert_not_called()
            first = sharing.consent(self.config)['research_instance']
            self.service.participation.attempt()
            self.service.participation.attempt()
            self.assertEqual(len(self.sent), 1)
            self.now += timedelta(days=1)
            self.service.participation.attempt()
            self.assertEqual(len(self.sent), 2)
            sharing.save_choice(self.config, False)
            self.assertEqual(sharing.snapshot(self.config)['participation']['pending_state'], 'disabled')
            self.service.participation.attempt()
            self.service.participation.attempt()
            self.assertEqual(len(self.sent), 3)
            self.now += timedelta(days=1)
            self.service.participation.attempt()
            self.assertEqual(len(self.sent), 3)
            sharing.save_choice(self.config, True)
            second = sharing.consent(self.config)['research_instance']
            self.assertNotEqual(first, second)
            self.service.participation.attempt()
        attrs = [{key: value['value'] for key, value in item['items'][0]['attributes'].items()} for item in self.sent]
        self.assertEqual([row['kind'] for row in attrs], ['enabled', 'heartbeat', 'disabled', 'enabled'])
        self.assertTrue(all(row['purpose'] == 'population-research-participation' for row in attrs))
        self.assertEqual(attrs[2]['research_instance'], first)
        self.assertEqual(attrs[3]['research_instance'], second)
        self.assertEqual(sharing.snapshot(self.config)['participation']['status'], 'accepted')
        for private in ('library', 'capacity', 'preferences', 'authorization', 'revision', str(self.root), 'server_name'):
            self.assertNotIn(private, json.dumps(self.sent))

    def test_unknown_network_attempt_is_not_success_or_disable_and_is_not_retried_that_day(self):
        sharing.save_choice(self.config, True)
        def uncertain(_target, *, envelope_gate, delivery_callback):
            def capture(envelope):
                self.assertTrue(envelope_gate(envelope))
            return SimpleNamespace(transport=SimpleNamespace(capture_envelope=capture),
                                   flush=lambda **_kwargs: None, close=lambda **_kwargs: None)
        with mock.patch('peach.remote_reporting._new_client', side_effect=uncertain) as client:
            self.service.participation.attempt()
            self.service.participation.attempt()
        self.assertEqual(client.call_count, 1)
        result = sharing.snapshot(self.config)
        self.assertEqual(result['consent_state'], 'enabled')
        self.assertEqual(result['participation']['status'], 'unknown')
        self.assertTrue(result['participation']['attempted'])
        self.assertEqual(result['participation']['state'], 'enabled')

    def test_transport_missing_is_failure_and_requeue_preserves_log_message_identifier(self):
        sharing.save_choice(self.config, True)
        client = SimpleNamespace(transport=None, close=lambda **_kwargs: None)
        with mock.patch('peach.remote_reporting._new_client', return_value=client):
            self.service.participation.attempt()
        first = self.participation._load(self.config)
        self.assertEqual((first['status'], first['attempted']), ('failed', False))
        with mock.patch('peach.remote_reporting._new_client', side_effect=self.client):
            self.service.participation.attempt()
        second = self.participation._load(self.config)
        self.assertEqual(first['event_id'], second['event_id'])
        self.assertNotEqual(first['dispatch_id'], second['dispatch_id'])
        self.assertEqual(second['status'], 'accepted')

    def test_existing_consent_preserves_identity_and_can_send_contact_and_closing(self):
        for schema in (5, 6):
            with self.subTest(schema=schema):
                sharing.save_choice(self.config, True)
                path = sharing._path(self.config)
                choice = json.loads(path.read_text())
                choice.pop('consent_schema', None)
                choice['schema'] = schema
                path.write_text(json.dumps(choice))
                original = path.read_bytes()
                with mock.patch('peach.remote_reporting._new_client', side_effect=self.client):
                    self.service.participation.attempt()
                    self.assertEqual(self.sent[-1]['items'][0]['attributes']['research_instance']['value'],
                                     choice['research_instance'])
                    self.assertEqual(path.read_bytes(), original)
                    sharing.save_choice(self.config, False)
                    self.service.participation.attempt()
                attributes = self.sent[-1]['items'][0]['attributes']
                self.assertEqual(attributes['kind']['value'], 'disabled')
                self.assertEqual(attributes['research_instance']['value'], choice['research_instance'])

    def test_pending_old_contact_uses_current_format_and_preserves_daily_budget(self):
        sharing.save_choice(self.config, True)
        record = self.service.participation._prepare()
        record['payload']['schema'] = 5
        path = self.participation._path(self.config)
        path.write_text(json.dumps(record))
        with mock.patch('peach.remote_reporting._new_client', side_effect=self.client):
            self.service.participation.attempt()
        self.assertEqual(len(self.sent), 1)
        current = self.participation._load(self.config)
        self.assertEqual(current['payload']['schema'], sharing.SCHEMA)
        self.assertEqual(current['event_id'], record['event_id'])
        self.assertEqual(current['revision'], record['revision'])
        current['payload']['schema'] = 5
        path.write_text(json.dumps(current))
        original = path.read_bytes()
        with mock.patch('peach.remote_reporting._new_client') as client:
            self.service.participation.attempt()
        client.assert_not_called()
        self.assertEqual(path.read_bytes(), original)

    def test_closed_old_or_stopped_generation_cannot_send_and_stale_callback_cannot_change_new_receipt(self):
        sharing.save_choice(self.config, True)
        first = self.service.participation._prepare()
        queued = self.envelope(first)
        sharing.save_choice(self.config, False)
        self.assertFalse(self.service.participation._gate(first, queued))
        closing = self.service.participation._prepare()
        closed = self.envelope(closing)
        sharing.save_choice(self.config, True)
        self.assertFalse(self.service.participation._gate(closing, closed))
        current = self.service.participation._prepare()
        before = self.participation._path(self.config).read_bytes()
        self.service.participation._delivery(first, {'status': 'accepted'})
        self.assertEqual(self.participation._path(self.config).read_bytes(), before)
        self.service._stop.set()
        self.assertFalse(self.service.participation._gate(current, self.envelope(current)))

    def test_only_exact_log_fields_pass_and_attachments_or_error_events_are_rejected(self):
        from copy import deepcopy
        from sentry_sdk.envelope import Envelope
        sharing.save_choice(self.config, True)
        record = self.service.participation._prepare()
        event = Envelope()
        event.add_event({'message': 'must-not-send'})
        self.assertFalse(self.service.participation._gate(record, event))
        bad = self.envelope(record)
        raw = deepcopy(bad.items[0].payload.json)
        raw['items'][0]['attributes']['path'] = {'type': 'string', 'value': 'R:/private'}
        from sentry_sdk.envelope import PayloadRef
        bad.items[0].payload = PayloadRef(json=raw)
        self.assertFalse(self.service.participation._gate(record, bad))
        good = self.envelope(record)
        self.assertTrue(self.service.participation._gate(record, good))
        self.assertNotIn('private', good.headers)
        self.assertFalse(self.service.participation._gate(record, good))

    def test_stale_dispatch_does_not_consume_a_requeued_daily_contact(self):
        sharing.save_choice(self.config, True)
        first = self.service.participation._prepare()
        second = self.service.participation._prepare()
        self.assertEqual(first['event_id'], second['event_id'])
        self.assertFalse(self.service.participation._gate(first, self.envelope(first)))
        self.service.participation._delivery(first, {'status': 'accepted'})
        self.assertTrue(self.service.participation._gate(second, self.envelope(second)))

    def test_real_sdk_wire_uses_log_category_with_no_error_event_or_attachment(self):
        from sentry_sdk.transport import HttpTransport
        sharing.save_choice(self.config, True)
        wire = []
        with mock.patch.object(HttpTransport, '_send_envelope', side_effect=lambda envelope: wire.append(envelope)):
            self.service.participation.attempt()
        self.assertEqual(len(wire), 1)
        self.assertEqual([item.type for item in wire[0].items], ['log'])
        self.assertEqual(wire[0].items[0].data_category, 'log_item')
        attrs = json.loads(wire[0].items[0].payload.get_bytes())['items'][0]['attributes']
        self.assertEqual(attrs['purpose']['value'], 'population-research-participation')
        self.assertEqual(attrs['research_instance']['value'], sharing.consent(self.config)['research_instance'])
        for private in ('library', 'preferences', 'capacity', 'server_name', 'contexts', str(self.root), 'revision'):
            self.assertNotIn(private, wire[0].serialize().decode())
        self.assertEqual(self.participation.snapshot(self.config)['status'], 'unknown')

    def test_corrupt_state_is_a_visible_local_failure_and_is_not_forwarded_to_diagnostics(self):
        path = self.participation._path(self.config)
        path.parent.mkdir(parents=True)
        path.write_text('{')
        with mock.patch('peach.remote_reporting.capture') as diagnostics:
            state = sharing.snapshot(self.config)['participation']
        self.assertEqual(state, {'status': 'failed', 'reason': 'state', 'attempted': None})
        diagnostics.assert_not_called()


class LibrarySharingTests(unittest.TestCase):
    def setUp(self):
        self.enterContext(mock.patch('peach.remote_reporting._disabled', False))
        holder = tempfile.TemporaryDirectory()
        self.addCleanup(holder.cleanup)
        self.root = Path(holder.name).resolve()
        self.config = PeachConfig(self.root, self.root / 'config.toml')
        self.database = LedgerDatabase(fresh_ledger(self.root))
        self.contract = SimpleNamespace(read_connection=self.database.read_connection,
                                        taste_history_store=self.root / 'taste/history.sqlite', upgrade_config=self.config)
        self.service = sharing.Service(self.config, self.contract)
        self.addCleanup(self.service.stop)
        patcher = mock.patch.dict(os.environ, {'PEACH_SENTRY_DSN': '', 'PEACH_LIBRARY_SENTRY_DSN': DSN})
        patcher.start()
        self.addCleanup(patcher.stop)

    def enable(self):
        preview = self.service.preview()
        return self.service.save({'enabled': True, 'schema': sharing.SCHEMA,
                                  'consent': True, 'preview_token': preview['token']})

    def add_work(self):
        with self.database.write_transaction() as connection:
            connection.execute("INSERT INTO asset(location,path,name,code) VALUES('local','work','title','EXM-001')")

    def attempt_state(self):
        return sharing.remote_reporting._read(sharing._state_path(self.config))

    def envelope(self, data=None):
        from sentry_sdk.envelope import Envelope
        from sentry_sdk.attachments import Attachment
        envelope = Envelope()
        envelope.add_event({'message': 'Peach research'})
        wire = sharing.compressed(sharing.collect(self.contract)[1]) if data is None else data
        envelope.add_item(Attachment(bytes=wire, filename=sharing.FILENAME).to_envelope_item())
        return envelope

    def test_disabled_and_missing_endpoint_do_not_read_library_or_construct_sdk(self):
        with mock.patch.object(sharing, 'collect') as collect, \
                mock.patch('peach.remote_reporting._new_client') as client:
            self.service.attempt()
            collect.assert_not_called()
            client.assert_not_called()
        self.enable()
        with mock.patch.object(sharing, 'target', return_value=''), mock.patch.object(sharing, 'collect') as collect:
            self.service.attempt()
            collect.assert_not_called()

    def test_enable_requires_preview_explicit_consent_and_current_schema(self):
        for body in ({'enabled': True}, {'enabled': 'true'}, {'enabled': True, 'consent': True, 'schema': sharing.SCHEMA}):
            with self.assertRaises(ValueError):
                self.service.save(body)
        preview = self.service.preview()
        with self.assertRaises(ValueError):
            self.service.save({'enabled': True, 'schema': sharing.SCHEMA, 'preview_token': preview['token']})
        self.assertTrue(self.enable()['enabled'])
        with mock.patch.object(sharing, 'SCHEMA', sharing.SCHEMA + 1):
            self.assertTrue(sharing.snapshot(self.config)['enabled'])
        with mock.patch.object(sharing, 'CONSENT_SCHEMA', sharing.CONSENT_SCHEMA + 1):
            self.assertFalse(sharing.snapshot(self.config)['enabled'])
        self.assertFalse(self.service.save({'enabled': False})['enabled'])

    def test_preview_expires_and_cannot_be_reused(self):
        preview = self.service.preview()
        body = {'enabled': True, 'consent': True, 'schema': sharing.SCHEMA, 'preview_token': preview['token']}
        with mock.patch.object(sharing.time, 'monotonic', return_value=10**20), self.assertRaises(ValueError):
            self.service.save(body)
        self.service.save(body)
        with self.assertRaises(ValueError):
            self.service.save(body)

    def test_work_signals_are_deduplicated_and_collection_is_read_only(self):
        with self.database.write_transaction() as connection:
            for code, path in (('EXM-001', 'R:/private-person/movie-a.mp4'), ('EXM-001', 'R:/private-person/movie-b.mp4')):
                connection.execute("INSERT INTO asset(location,path,name,code,medium,rating,play_count,watch_ratio,duration) "
                                   "VALUES('local',?,'private-title',?,'video',80,2,.5,600)", (path, code))
            connection.execute("INSERT INTO asset_tag(asset_id,tag,source) VALUES(1,'口交','web-user')")
            connection.execute("INSERT INTO asset_tag(asset_id,tag,source) VALUES(1,'私人的备注','web-user')")
            connection.execute("INSERT INTO asset_tag(asset_id,tag,source) VALUES(2,'720P','metadata')")
            connection.execute("INSERT INTO asset_tag(asset_id,tag,source) VALUES(1,'已隐藏标签','web-user')")
            connection.execute("INSERT INTO asset_tag_preference(profile_id,asset_id,normalized_tag,hidden,updated_at) "
                               "VALUES('local-default',1,'已隐藏标签',1,'now')")
            connection.execute("INSERT INTO asset_preference(profile_id,asset_id,liked,updated_at) VALUES('local-default',1,1,'2026-10-18')")
        before = self.database.db_path.read_bytes()
        payload, data = sharing.collect(self.contract)
        self.assertEqual(self.database.db_path.read_bytes(), before)
        self.assertFalse((self.contract.taste_history_store.parent / 'preference-cache.json').exists())
        self.assertFalse((self.contract.taste_history_store.parent / 'browser-preference-cache.json').exists())
        self.assertEqual(set(payload), {'schema', 'peach', 'period', 'library', 'preferences', 'coverage', 'capacity'})
        self.assertEqual(len(payload['library']), 1)
        work = payload['library'][0]
        self.assertEqual(work['code'], 'EXM-001')
        self.assertEqual(work['manual_tags'], ['口交'])
        self.assertEqual(work['rating'], 80)
        self.assertTrue(work['liked'])
        self.assertEqual(work['play_count'], 4)
        self.assertEqual(work['watch_ratio'], .5)
        self.assertEqual(payload['coverage'], {'active_files': 2, 'coded_files': 2, 'coded_works': 1, 'uncoded_items': 0})
        self.assertEqual(payload['preferences']['tag'][0]['works']['collected'], 1)
        self.assertEqual(payload['preferences']['tag'][0]['works']['ratings'], {'80.0': 1})
        self.assertTrue(sharing.valid_payload(payload))
        for private in ('private-person', 'private-title', 'movie-a', 'movie-b', 'asset_id', 'visited_at', 'last_played',
                        'profile_id', 'fingerprint', 'R:/', '720P', '已隐藏标签', '私人的备注', 'duration_seconds', 'entities'):
            self.assertNotIn(private, data.decode())

    def test_entity_distributions_include_uncoded_signals_and_explicit_favorites(self):
        from peach.entities import upsert_asset_entity
        with self.database.write_transaction() as connection:
            for code in ('EXM-001', 'EXM-001', None):
                connection.execute("INSERT INTO asset(location,path,name,code,medium,rating,play_count,duration,release_date) "
                                   "VALUES('local',?,'title',?,'video',60,1,2400,'2021-01-01')", (str(code) + str(connection.total_changes), code))
            for aid in (1, 2, 3):
                for kind in ('performer', 'creator', 'studio', 'series'):
                    upsert_asset_entity(connection, asset_id=aid, kind=kind, role=kind, name='名称-' + kind, source='test', confidence=1)
            eid = connection.execute("SELECT id FROM entity WHERE kind='performer'").fetchone()[0]
            connection.execute("UPDATE profile SET settings_json=? WHERE id='local-default'",
                               (json.dumps({'libraryShortcuts': {'favorites': [{'entity_id': eid}]}}),))
            connection.execute("UPDATE asset SET feedback='dislike',feedback_at=5,rating=100 WHERE id=2")
            connection.execute("UPDATE asset SET disposal='trash' WHERE id=3")
            connection.execute("INSERT INTO asset(location,path,name,medium,rating) VALUES('local','uncoded','title','image',20)")
            upsert_asset_entity(connection, asset_id=4, kind='performer', role='performer', name='名称-performer', source='test', confidence=1)
            connection.execute("INSERT INTO watch_queue(profile_id,asset_id,added_at,source) VALUES('local-default',1,'now','web')")
        payload, _ = sharing.collect(self.contract)
        self.assertEqual(payload['coverage'], {'active_files': 3, 'coded_files': 2, 'coded_works': 1, 'uncoded_items': 1})
        self.assertEqual(payload['library'], [{'code': 'EXM-001', 'rating': 80, 'watch_later': True,
                                              'play_count': 2, 'feedback': 'dislike'}])
        performer = payload['preferences']['performer'][0]
        self.assertEqual(performer, {'name': '名称-performer',
            'works': {'collected': 1, 'liked': 0, 'disliked': 1, 'watched': 1, 'ratings': {'80.0': 1}},
            'uncoded': {'collected': 1, 'liked': 0, 'disliked': 0, 'watched': 0, 'ratings': {'20.0': 1}}, 'favorite': True})
        self.assertEqual(payload['preferences']['era'][0]['name'], '2020')
        self.assertEqual(payload['preferences']['length'][0]['name'], '1')
        self.assertEqual(payload['preferences']['tag'], [])
        self.assertTrue(sharing.valid_payload(payload))

    def test_large_population_projection_uses_lossless_compression(self):
        count = 12000
        with self.database.write_transaction() as connection:
            connection.executemany("INSERT INTO asset(location,path,name,code) VALUES('local',?,'title',?)",
                                   ((str(i), f'EXM-{i:05}') for i in range(count)))
        payload, data = sharing.collect(self.contract)
        wire = sharing.compressed(data)
        self.assertLess(len(wire), sharing.MAX_BYTES)
        self.assertEqual(gzip.decompress(wire), data)
        self.assertEqual(len(json.loads(gzip.decompress(wire))['library']), count)
        self.assertTrue(sharing.valid_payload(payload))
        self.assertEqual(wire[3:8], bytes(5), 'gzip 不含文件名或生成时间')

    def test_research_project_must_be_separate_from_diagnostics(self):
        with mock.patch.dict(os.environ, {'PEACH_SENTRY_DSN': DSN}):
            self.assertEqual(sharing.target(), '')

    def test_schema_three_consent_does_not_authorize_population_projection(self):
        self.enable()
        path = self.config.directory('state') / 'library-sharing.json'
        state = json.loads(path.read_text())
        state.pop('consent_schema', None)
        path.write_text(json.dumps({**state, 'schema': 3}))
        with mock.patch.object(sharing, 'collect') as collect:
            self.service.attempt()
            collect.assert_not_called()
        self.assertFalse(sharing.snapshot(self.config)['enabled'])

    def test_existing_consent_keeps_identity_and_authorizes_current_attachment_with_weekly_budget(self):
        self.add_work()
        self.enable()
        path = sharing._path(self.config)
        choice = json.loads(path.read_text())
        choice.pop('consent_schema', None)
        for schema in (5, 6):
            with self.subTest(schema=schema):
                path.write_text(json.dumps({**choice, 'schema': schema}))
                original = path.read_bytes()
                self.assertEqual(sharing.consent(self.config)['research_instance'], choice['research_instance'])
                self.assertEqual(sharing.consent(self.config)['revision'], choice['revision'])
                self.assertEqual(sharing.snapshot(self.config)['consent_state'], 'enabled')
                self.assertTrue(self.service._gate(choice['revision'], self.envelope()))
                sharing._state_path(self.config).write_text(json.dumps({
                    'schema': 5, 'period': sharing._period(), 'attempted': True, 'status': 'accepted'}))
                with mock.patch.object(sharing, 'collect') as collect:
                    self.service.attempt()
                collect.assert_not_called()
                self.assertEqual(path.read_bytes(), original)

    def test_schema_four_consent_requires_review_and_is_distinct_from_manual_disable(self):
        self.enable()
        path = self.config.directory('state') / 'library-sharing.json'
        state = json.loads(path.read_text())
        state.pop('consent_schema', None)
        path.write_text(json.dumps({**state, 'schema': 4}))
        with mock.patch.object(sharing, 'collect') as collect, mock.patch('peach.remote_reporting._new_client') as client:
            self.service.attempt()
        collect.assert_not_called()
        client.assert_not_called()
        self.assertEqual(sharing.snapshot(self.config)['consent_state'], 'needs-consent')
        self.assertFalse(sharing.snapshot(self.config)['enabled'])
        sharing.save_choice(self.config, False)
        self.assertEqual(sharing.snapshot(self.config)['consent_state'], 'disabled')
        path.unlink()
        self.assertEqual(sharing.snapshot(self.config)['consent_state'], 'not-selected')
        self.assertEqual(self.enable()['consent_state'], 'enabled')

    def test_capacity_projection_reads_only_local_history_and_keeps_missing_values_unknown(self):
        capacity_history.record_sample(self.config, 1234, None)
        before = capacity_history._path(self.config).read_bytes()
        payload, _ = sharing.collect(self.contract)
        self.assertEqual(capacity_history._path(self.config).read_bytes(), before)
        self.assertEqual(payload['capacity']['windows']['30d']['data']['current_bytes'], 1234)
        self.assertIsNone(payload['capacity']['windows']['30d']['cache']['current_bytes'])
        self.assertEqual(payload['capacity']['windows']['30d']['observed_days'], 1)
        self.assertIsNone(payload['capacity']['windows']['30d']['active_days'])
        self.assertTrue(sharing.valid_payload(payload))
        self.assertTrue(sharing.useful_payload(payload))

    def test_background_daily_capacity_sampling_requires_current_consent_and_stops_after_complete_sample(self):
        from peach import storage_budget
        with mock.patch.object(storage_budget, 'data_usage') as data, mock.patch.object(storage_budget, 'cache_usage') as cache:
            self.service.sample_capacity()
        data.assert_not_called()
        cache.assert_not_called()
        sharing.save_choice(self.config, True)
        history = capacity_history._path(self.config)
        with mock.patch.object(storage_budget, 'data_usage', return_value=100) as data, \
                mock.patch.object(storage_budget, 'cache_usage', return_value={'managed_cache_bytes': 30}) as cache, \
                mock.patch('peach.remote_reporting._new_client') as network:
            self.service.sample_capacity()
            self.service.sample_capacity()
        self.assertEqual(data.call_count, 1)
        self.assertEqual(cache.call_count, 1)
        network.assert_not_called()
        self.assertTrue(history.exists())
        self.assertFalse(capacity_history.sample_due(self.config))
        value = capacity_history.project(self.config)['windows']['7d']
        self.assertEqual((value['data']['current_bytes'], value['cache']['current_bytes']), (100, 30))

    def test_background_sample_reuses_physical_allocation_roots_without_reading_media_contents(self):
        from peach import storage_budget
        sharing.save_choice(self.config, True)
        media = self.root / 'generated/transcodes/sample.mp4'
        media.parent.mkdir(parents=True)
        media.write_bytes(b'not opened during capacity scan')
        with mock.patch.object(storage_budget, 'allocated_bytes', return_value=16), \
                mock.patch.object(storage_budget, 'data_roots', return_value=[media.parent]) as data_roots, \
                mock.patch.object(storage_budget, 'cache_roots', return_value=[media.parent]) as cache_roots, \
                mock.patch.object(Path, 'read_bytes', side_effect=AssertionError('不得读取媒体正文')):
            self.service.sample_capacity()
        data_roots.assert_called_once_with(self.config)
        cache_roots.assert_called_once_with(self.config)
        row = capacity_history.project(self.config)['windows']['7d']
        self.assertEqual((row['data']['current_bytes'], row['cache']['current_bytes']), (16, 16))

    def test_background_sample_does_not_run_for_old_scope_or_overwrite_history_after_revocation(self):
        from peach import storage_budget
        sharing.save_choice(self.config, True)
        current = json.loads(sharing._path(self.config).read_text())
        current.pop('consent_schema', None)
        sharing._path(self.config).write_text(json.dumps({**current, 'schema': 4}))
        with mock.patch.object(storage_budget, 'data_usage') as data:
            self.service.sample_capacity()
        data.assert_not_called()
        sharing.save_choice(self.config, True)
        def scan(_config, *, check):
            sharing.save_choice(self.config, False)
            check()
            return 100
        with mock.patch.object(storage_budget, 'data_usage', side_effect=scan), \
                mock.patch.object(storage_budget, 'cache_usage') as cache:
            self.service.sample_capacity()
        cache.assert_not_called()
        self.assertFalse(capacity_history._path(self.config).exists())

    def test_bad_research_history_does_not_scan_or_trigger_diagnostic_telemetry(self):
        from peach import storage_budget
        sharing.save_choice(self.config, True)
        capacity_history._path(self.config).write_text('{')
        with mock.patch.object(storage_budget, 'data_usage') as data, \
                mock.patch('peach.remote_reporting.capture') as reporting, \
                self.assertLogs('peach.storage_budget', level='WARNING'):
            self.service.sample_capacity()
        data.assert_not_called()
        reporting.assert_not_called()

    def test_capacity_payload_rejects_private_fields_and_invalid_numeric_relationships(self):
        from copy import deepcopy
        capacity_history.record_sample(self.config, 100, 50)
        payload, _ = sharing.collect(self.contract)
        cases = []
        for key, value in (('path', 'R:/private'), ('account', 'private'), ('days', 31),
                           ('observed_days', True), ('active_days', 8), ('cleaned_bytes', float('nan'))):
            invalid = deepcopy(payload)
            invalid['capacity']['windows']['7d'][key] = value
            cases.append(invalid)
        for key, value in (('current_bytes', -1), ('peak_bytes', 0), ('positive_growth_bytes', 20),
                           ('growth_observations', float('inf'))):
            invalid = deepcopy(payload)
            invalid['capacity']['windows']['7d']['data'][key] = value
            cases.append(invalid)
        invalid = deepcopy(payload)
        invalid['capacity']['state'] = []
        cases.append(invalid)
        for invalid in cases:
            self.assertFalse(sharing.valid_payload(invalid))

    def test_transport_rejects_invalid_signal_and_distribution_values(self):
        from copy import deepcopy
        with self.database.write_transaction() as connection:
            connection.execute("INSERT INTO asset(location,path,name,code,rating) VALUES('local','a','title','EXM-001',80)")
        payload, _ = sharing.collect(self.contract)
        self.assertTrue(sharing.valid_payload(payload))
        for key, invalid in [('rating', float('nan')), ('rating', 101), ('rating', True),
                             ('liked', 'yes'), ('manual_tags', ['R:/private']), ('play_count', -1),
                             ('watch_ratio', 1.1), ('entities', {'performer': ['name']}), ('tags', ['720P'])]:
            altered = deepcopy(payload)
            altered['library'][0][key] = invalid
            self.assertFalse(sharing.valid_payload(altered), (key, invalid))
        altered = deepcopy(payload)
        altered['preferences']['tag'] = [{'name': 'tag', 'works': {'collected': 1, 'liked': 0, 'disliked': 0,
                                         'watched': 0, 'ratings': {'80': 2}}}]
        self.assertFalse(sharing.valid_payload(altered))

    def test_installer_saves_explicit_selection_without_reading_or_sending(self):
        import runpy
        entry = runpy.run_path(str(Path(__file__).resolve().parents[1] / 'scripts/build_app_entry.py'))
        with mock.patch('peach.settings_file.active', return_value=self.config), \
                mock.patch.object(sharing, 'collect') as collect, \
                mock.patch('peach.remote_reporting._new_client') as client, \
                mock.patch('peach.remote_reporting._disabled', False):
            for argument in ('1', '0'):
                self.assertEqual(entry['main'](['Peach.exe', '--installer-library-sharing', argument]), 0)
                self.assertEqual(bool(sharing.consent(self.config)), argument == '1')
            self.assertEqual(entry['main'](['Peach.exe', '--installer-library-sharing', 'true']), 2)
            collect.assert_not_called()
            client.assert_not_called()

    def test_real_sdk_sends_only_research_event_and_reviewed_attachment_once_per_week(self):
        from sentry_sdk.transport import HttpTransport
        self.add_work()
        self.enable()
        sent = []
        with mock.patch.object(HttpTransport, '_send_envelope', side_effect=lambda envelope: sent.append(envelope)):
            self.service.attempt()
            sharing.Service(self.config, self.contract).attempt()
        self.assertEqual(len(sent), 1)
        envelope = sent[0]
        self.assertEqual([item.type for item in envelope.items], ['event', 'attachment'])
        event = envelope.items[0].get_event()
        self.assertNotIn('extra', event)
        self.assertNotIn('server_name', event)
        self.assertNotIn('user', event)
        self.assertEqual(event['release'], sharing.remote_reporting.event_metadata('research')['release'])
        self.assertEqual(event['environment'], sharing.remote_reporting.event_metadata('research')['environment'])
        self.assertEqual(event['tags']['runtime'], sharing.remote_reporting.event_metadata('research')['tags']['runtime'])
        self.assertEqual(event['tags']['purpose'], 'population-research')
        self.assertEqual(event['tags']['research_instance'], sharing.consent(self.config)['research_instance'])
        self.assertEqual(event['tags']['snapshot_id'], self.attempt_state()['attempt_id'])
        self.assertEqual(int(event['tags']['compressed_bytes']), len(envelope.items[1].payload.get_bytes()))
        self.assertEqual(int(event['tags']['raw_bytes']), len(gzip.decompress(envelope.items[1].payload.get_bytes())))
        attachment = json.loads(gzip.decompress(envelope.items[1].payload.get_bytes()))
        self.assertEqual(attachment['schema'], sharing.SCHEMA)
        self.assertEqual(envelope.items[1].headers['filename'], sharing.FILENAME)
        self.assertIn('library', attachment)
        self.assertIn('preferences', attachment)

    def test_disable_invalidates_queued_attachment(self):
        from sentry_sdk.envelope import Envelope
        from sentry_sdk.attachments import Attachment
        self.add_work()
        self.enable()
        previous = sharing.consent(self.config)['revision']
        envelope = Envelope()
        envelope.headers['trace'] = {'release': 'private-build', 'user_segment': 'private-user'}
        envelope.add_event({'message': 'Peach research', 'tags': {'private': 'name'}})
        envelope.add_item(Attachment(bytes=sharing.compressed(sharing.collect(self.contract)[1]), filename=sharing.FILENAME).to_envelope_item())
        self.assertTrue(self.service._gate(previous, envelope))
        self.assertNotIn('trace', envelope.headers)
        self.assertNotIn('private', envelope.items[0].get_event()['tags'])
        self.service.save({'enabled': False})
        self.assertFalse(self.service._gate(previous, envelope))

    def test_transport_rejects_unreviewed_fields_even_with_correct_filename(self):
        from sentry_sdk.envelope import Envelope
        from sentry_sdk.attachments import Attachment
        self.enable()
        revision = sharing.consent(self.config)['revision']
        payload, _ = sharing.collect(self.contract)
        for invalid in ({**payload, 'library': [{'code': 'EXM-001', 'path': 'R:/private'}]},
                        {**payload, 'user_id': 'private'},
                        {**payload, 'preferences': {'private': []}},
                        {'schema': sharing.SCHEMA, 'summary': []}):
            envelope = Envelope()
            envelope.add_event({'message': 'private'})
            envelope.add_item(Attachment(bytes=gzip.compress(json.dumps(invalid).encode()), filename=sharing.FILENAME).to_envelope_item())
            self.assertFalse(self.service._gate(revision, envelope))

    def test_transport_rejects_corrupt_and_oversized_compressed_data(self):
        from sentry_sdk.envelope import Envelope
        from sentry_sdk.attachments import Attachment
        self.enable()
        revision = sharing.consent(self.config)['revision']
        for raw in (b'not gzip', gzip.compress(b'x' * 4096), gzip.compress(b'{}')[:-3]):
            envelope = Envelope()
            envelope.add_event({'message': 'private'})
            envelope.add_item(Attachment(bytes=raw, filename=sharing.FILENAME).to_envelope_item())
            with mock.patch.object(sharing, 'MAX_RAW_BYTES', 2048):
                self.assertFalse(self.service._gate(revision, envelope))

    def test_oversized_snapshot_is_rejected_without_partial_upload(self):
        with mock.patch.object(sharing, 'MAX_RAW_BYTES', 1), self.assertRaises(ValueError):
            self.service.preview()
        self.assertFalse(sharing.snapshot(self.config)['enabled'])
        self.add_work()
        self.enable()
        with mock.patch.object(sharing, 'MAX_BYTES', 1), mock.patch('peach.remote_reporting._new_client') as client:
            self.service.attempt()
            client.assert_not_called()
        self.assertEqual(self.attempt_state()['status'], 'failed')
        self.assertEqual(self.attempt_state()['reason'], 'compression')
        self.assertFalse(self.attempt_state()['attempted'])

    def test_empty_and_uncoded_without_preferences_wait_for_data(self):
        self.enable()
        with mock.patch('peach.remote_reporting._new_client') as client:
            self.service.attempt()
            with self.database.write_transaction() as connection:
                connection.execute("INSERT INTO asset(location,path,name) VALUES('local','uncoded','title')")
            self.service.attempt()
            client.assert_not_called()
        self.assertEqual(self.attempt_state()['status'], 'waiting-data')
        self.assertFalse(self.attempt_state()['attempted'])
        self.assertFalse(self.service._gate(sharing.consent(self.config)['revision'], self.envelope()))

    def test_uncoded_preference_group_can_be_sent(self):
        with self.database.write_transaction() as connection:
            connection.execute("INSERT INTO asset(location,path,name) VALUES('local','uncoded','title')")
            connection.execute("INSERT INTO asset_tag(asset_id,tag,source) VALUES(1,'口交','web-user')")
        self.enable()
        with mock.patch('peach.remote_reporting._new_client') as client:
            self.service.attempt()
            client.assert_called_once()

    def test_collection_failure_does_not_spend_weekly_network_attempt(self):
        self.enable()
        with mock.patch.object(sharing, 'collect', side_effect=OSError('private path')):
            self.service.attempt()
        self.assertEqual(self.attempt_state()['status'], 'failed')
        self.assertEqual(self.attempt_state()['reason'], 'collection')
        self.assertFalse(self.attempt_state()['attempted'])
        self.assertNotIn('private path', json.dumps(self.attempt_state()))
        self.add_work()
        with mock.patch('peach.remote_reporting._new_client') as client:
            self.service.attempt()
            client.assert_called_once()

    def test_disable_during_collection_prevents_queueing(self):
        self.add_work()
        self.enable()
        collect = sharing.collect
        def disable_then_collect(contract):
            sharing.save_choice(self.config, False)
            return collect(contract)
        with mock.patch.object(sharing, 'collect', side_effect=disable_then_collect), \
                mock.patch('peach.remote_reporting._new_client') as client:
            self.service.attempt()
            client.assert_not_called()
        self.assertFalse(sharing.snapshot(self.config)['enabled'])

    def test_queue_failure_does_not_spend_network_attempt(self):
        self.add_work()
        self.enable()
        def make_client(*_args, envelope_gate, delivery_callback):
            def capture(*_args, **_kwargs):
                delivery_callback({'status': 'failed', 'reason': 'queue_full'})
            return SimpleNamespace(capture_event=capture, flush=lambda **_kw: None, close=lambda **_kw: None)
        with mock.patch('peach.remote_reporting._new_client', side_effect=make_client) as client:
            self.service.attempt()
            self.service.attempt()
            self.assertEqual(client.call_count, 2)
        self.assertEqual(self.attempt_state()['status'], 'failed')
        self.assertEqual(self.attempt_state()['reason'], 'queue_full')
        self.assertFalse(self.attempt_state()['attempted'])

    def test_delivery_receipts_record_only_status_and_safe_details(self):
        self.add_work()
        self.enable()
        for result in ({'status': 'accepted', 'status_code': 200},
                       {'status': 'failed', 'status_code': 403, 'reason': 'http_status'},
                       {'status': 'unknown', 'reason': 'network'}):
            sharing._state_path(self.config).unlink(missing_ok=True)
            def make_client(*_args, envelope_gate, delivery_callback, result=result):
                def capture(*_args, **_kwargs):
                    self.assertTrue(envelope_gate(self.envelope()))
                    delivery_callback({**result, 'url': 'private-url', 'detail': 'private-content'})
                return SimpleNamespace(capture_event=capture, flush=lambda **_kw: None, close=lambda **_kw: None)
            with mock.patch('peach.remote_reporting._new_client', side_effect=make_client):
                self.service.attempt()
                self.enable()
                self.service.attempt()
            state = self.attempt_state()
            self.assertEqual(state['status'], result['status'])
            self.assertTrue(state['attempted'])
            if result['status'] == 'accepted':
                self.assertEqual(sharing.snapshot(self.config)['last_sent_at'], state['last_sent_at'])
                self.assertTrue(state['last_sent_at'])
            else:
                self.assertNotIn('last_sent_at', state)
            if 'reason' in result:
                self.assertEqual(state['reason'], result['reason'])
            self.assertNotIn('private', json.dumps(state))

    def test_missing_receipt_is_unknown_and_does_not_retry_network(self):
        self.add_work()
        self.enable()
        callbacks = []
        def make_client(*_args, envelope_gate, delivery_callback):
            callbacks.append(delivery_callback)
            def capture(*_args, **_kwargs):
                self.assertTrue(envelope_gate(self.envelope()))
                self.assertEqual(self.attempt_state()['status'], 'queued')
            return SimpleNamespace(capture_event=capture, flush=lambda **_kw: None, close=lambda **_kw: None)
        with mock.patch('peach.remote_reporting._new_client', side_effect=make_client) as client:
            self.service.attempt()
            self.assertEqual(self.attempt_state()['status'], 'unknown')
            self.service.attempt()
            client.assert_called_once()
        callbacks[0]({'status': 'accepted', 'status_code': 200})
        self.assertEqual(self.attempt_state()['status'], 'accepted')
        self.assertNotIn('reason', self.attempt_state())

    def test_real_sdk_http_receipt_controls_local_research_status(self):
        self.add_work()
        self.enable()
        for status, headers, expected in ((200, {}, 'accepted'), (413, {}, 'failed'), (429, {}, 'failed'),
                (200, {'x-sentry-rate-limits': '60:error:organization'}, 'unknown'), (None, {}, 'unknown')):
            with self.subTest(status=status, headers=headers):
                sharing._state_path(self.config).unlink(missing_ok=True)
                response = SimpleNamespace(status_code=status, headers=headers, close=mock.Mock(), content=b'private')
                with mock.patch.dict(os.environ, {'PEACH_REPORTING_TEST_MODE': '0'}), \
                        mock.patch('peach.reporting_transport.http_client') as factory:
                    request = factory.return_value.__enter__.return_value.request
                    request.return_value = response
                    request.side_effect = OSError('private proxy') if status is None else None
                    self.service.attempt()
                    self.service.attempt()
                    request.assert_called_once()
                state = self.attempt_state()
                self.assertEqual(state['status'], expected)
                self.assertTrue(state['attempted'])
                if status is not None:
                    self.assertEqual(state['status_code'], status)
                self.assertNotIn('private', json.dumps(state))

    def test_cross_week_receipt_cannot_overwrite_new_attempt(self):
        self.add_work()
        self.enable()
        callbacks = []
        def make_client(*_args, envelope_gate, delivery_callback):
            callbacks.append(delivery_callback)
            return mock.Mock()
        with mock.patch('peach.remote_reporting._new_client', side_effect=make_client):
            self.service.attempt()
            with mock.patch.object(sharing, '_period', return_value='2099-W01'):
                self.service.attempt()
            state = self.attempt_state()
            callbacks[0]({'status': 'accepted', 'status_code': 200})
            self.assertEqual(self.attempt_state(), state)

    def test_legacy_attempt_is_unknown_and_conserves_weekly_budget(self):
        self.enable()
        sharing._state_path(self.config).write_text(json.dumps(
            {'schema': sharing.SCHEMA, 'period': sharing._period(), 'status': 'attempted'}))
        self.assertEqual(sharing.snapshot(self.config)['last_attempt']['status'], 'unknown')
        with mock.patch.object(sharing, 'collect') as collect:
            self.service.attempt()
            collect.assert_not_called()

    def test_settings_snapshot_only_exposes_the_current_week_without_changing_receipts(self):
        self.enable()
        for status in ('failed', 'unknown', 'waiting-data', 'accepted'):
            with self.subTest(status=status):
                state = {'schema': sharing.SCHEMA, 'period': sharing._period(),
                         'revision': sharing.consent(self.config)['revision'], 'attempt_id': 'a' * 32,
                         'status': status, 'attempted': True, 'raw_bytes': 400, 'compressed_bytes': 200}
                sharing._state_path(self.config).write_text(json.dumps(state))
                self.assertEqual(sharing.snapshot(self.config)['last_attempt'], {
                    'snapshot_id': 'a' * 32, 'period': state['period'], 'status': status, 'attempted': True,
                    'raw_bytes': 400, 'compressed_bytes': 200})
                with mock.patch.object(sharing, '_period', return_value='2099-W01'):
                    self.assertEqual(sharing.snapshot(self.config)['last_attempt'], {})
                self.assertEqual(self.attempt_state(), state)

    def test_concurrent_services_allow_only_one_network_reservation(self):
        self.add_work()
        self.enable()
        sent, errors = [], []
        def make_client(*_args, envelope_gate, delivery_callback):
            def capture(*_args, **_kwargs):
                if envelope_gate(self.envelope()):
                    sent.append(True)
                    delivery_callback({'status': 'accepted', 'status_code': 200})
            return SimpleNamespace(capture_event=capture, flush=lambda **_kw: None, close=lambda **_kw: None)
        def run():
            try:
                sharing.Service(self.config, self.contract).attempt()
            except Exception as error:
                errors.append(error)
        with mock.patch('peach.remote_reporting._new_client', side_effect=make_client):
            threads = [threading.Thread(target=run) for _ in range(5)]
            for thread in threads:
                thread.start()
            for thread in threads:
                thread.join(timeout=10)
            self.assertFalse(any(thread.is_alive() for thread in threads))
        self.assertEqual(errors, [])
        self.assertEqual(len(sent), 1)

    def test_obsolete_delivery_cannot_overwrite_current_attempt(self):
        self.add_work()
        self.enable()
        callbacks = []
        def make_client(*_args, envelope_gate, delivery_callback):
            callbacks.append(delivery_callback)
            return mock.Mock()
        with mock.patch('peach.remote_reporting._new_client', side_effect=make_client):
            self.service.attempt()
            first = self.attempt_state()
            self.service.attempt()
            second = self.attempt_state()
            self.assertNotEqual(first['attempt_id'], second['attempt_id'])
            callbacks[0]({'status': 'accepted', 'status_code': 200})
            self.assertEqual(self.attempt_state(), second)
            self.enable()
            callbacks[1]({'status': 'accepted', 'status_code': 200})
            self.assertEqual(self.attempt_state(), second)

    def test_queued_gate_rechecks_consent_and_version(self):
        self.add_work()
        self.enable()
        gates = []
        def make_client(*_args, envelope_gate, delivery_callback):
            gates.append(envelope_gate)
            self.service.save({'enabled': False})
            return mock.Mock()
        with mock.patch('peach.remote_reporting._new_client', side_effect=make_client):
            self.service.attempt()
        self.assertFalse(gates[0](self.envelope()))
        self.assertEqual(self.attempt_state()['status'], 'blocked')
        self.assertFalse(self.attempt_state()['attempted'])

    def test_queued_gate_rejects_expired_schema_and_period(self):
        self.add_work()
        self.enable()
        def make_client(*_args, envelope_gate, delivery_callback):
            def capture(*_args, **_kwargs):
                envelope = self.envelope()
                with mock.patch.object(sharing, 'SCHEMA', sharing.SCHEMA + 1):
                    self.assertFalse(envelope_gate(envelope))
                with mock.patch.object(sharing, '_period', return_value='2099-W01'):
                    self.assertFalse(envelope_gate(envelope))
                delivery_callback({'status': 'blocked', 'reason': 'consent'})
            return SimpleNamespace(capture_event=capture, flush=lambda **_kw: None, close=lambda **_kw: None)
        with mock.patch('peach.remote_reporting._new_client', side_effect=make_client):
            self.service.attempt()
        self.assertEqual(self.attempt_state()['status'], 'blocked')
        self.assertFalse(self.attempt_state()['attempted'])

    def test_preview_and_consent_api_are_local_authenticated_and_same_origin(self):
        import asyncio
        import httpx
        from fastapi import FastAPI
        from peach.routes_configuration import router, require_auth
        app = FastAPI()
        app.include_router(router)
        app.state.library_sharing = self.service
        app.dependency_overrides[require_auth] = lambda: {}

        async def request(method, path, peer='127.0.0.1', origin='http://test', body=None):
            async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app, client=(peer, 1234)),
                                         base_url='http://test') as client:
                return await client.request(method, path, json=body, headers={'Origin': origin})
        endpoint = '/api/configuration/library-sharing'
        response = asyncio.run(request('GET', endpoint + '/preview'))
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.headers['cache-control'], 'no-store')
        token = response.json()['token']
        body = {'enabled': True, 'schema': sharing.SCHEMA, 'consent': True, 'preview_token': token}
        for peer, origin in (('198.51.100.7', 'http://test'), ('127.0.0.1', 'https://external.invalid')):
            self.assertEqual(asyncio.run(request('GET', endpoint + '/preview', peer, origin)).status_code, 403)
            self.assertEqual(asyncio.run(request('POST', endpoint, peer, origin, body)).status_code, 403)
        self.assertFalse(sharing.snapshot(self.config)['enabled'])
        self.assertEqual(asyncio.run(request('POST', endpoint, body=body)).status_code, 200)
