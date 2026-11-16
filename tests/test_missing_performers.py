"""缺演员诊断的口径、单条现状与只读 CLI 回归。"""
from __future__ import annotations

import io
import json
import sqlite3
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path

from support.ledger import fresh_ledger

from peach import missing_performers
from scripts import audit_missing_performers


class MissingPerformerDiagnosticsTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.db = fresh_ledger(Path(self.tmp.name).resolve())
        self.connection = sqlite3.connect(self.db)
        self.connection.row_factory = sqlite3.Row
        self.addCleanup(self.connection.close)
        self._asset_seq = 0

    def asset(self, code: str | None, *, studio: str = 'Studio A',
              release_date: str | None = '2026-01-01', title: str = '',
              owners: str | None = None, disposal: str | None = None) -> int:
        self._asset_seq += 1
        stem = code or f'unknown-{self._asset_seq}'
        asset_id = int(self.connection.execute(
            "INSERT INTO asset(location,path,name,medium,code,studio,release_date,"
            "catalog_title,field_owners,disposal) VALUES('local',?,?, 'video',?,?,?,?,?,?)",
            (f'R:\\Media\\{stem}.mp4', f'{stem}.mp4',
             code, studio, release_date, title, owners, disposal)).lastrowid)
        self.connection.commit()
        return asset_id

    def performer(self, asset_id: int, name: str = 'Performer') -> int:
        entity_id = int(self.connection.execute(
            "INSERT INTO entity(kind,canonical_name,normalized_name,created_at,updated_at) "
            "VALUES('performer',?,?,'2026-01-01','2026-01-01')",
            (name, name.lower())).lastrowid)
        self.connection.execute(
            "INSERT INTO asset_entity(asset_id,entity_id,role,source) VALUES(?,?,'performer','test')",
            (asset_id, entity_id))
        self.connection.commit()
        return entity_id

    def test_two_scopes_groups_and_filters(self):
        first = self.asset('SIVR-001', studio='Studio A', release_date='2026-01-01')
        self.asset('ABC-002', studio='Studio B', release_date=None)
        third = self.asset('ABC-003', studio='Studio A', release_date='2026-01-02')
        self.performer(third)
        self.asset('XYZ-004', studio='Studio B', release_date=None)
        report = missing_performers.summary(self.connection, limit=10)
        self.assertEqual(report['counts'], {
            'videos': 4, 'with_code': 4, 'with_code_and_release': 2,
            'missing_all_videos': 3, 'missing_all_videos_active': 3,
            'missing_with_code': 3, 'missing_with_code_and_release': 1,
            'missing_with_code_and_release_active': 1,
            'filtered_missing_with_code_and_release': 1,
        })
        self.assertEqual(report['by_prefix'], [{'prefix': 'SIVR', 'n': 1}])
        self.assertEqual(report['by_studio'], [{'studio': 'Studio A', 'n': 1}])
        self.assertEqual(report['all_by_studio'][0], {'studio': 'Studio B', 'n': 2})
        self.assertEqual([row['id'] for row in report['rows']], [first])
        filtered = missing_performers.summary(self.connection, studio='Studio A', prefix='ABC')
        self.assertEqual(filtered['counts']['filtered_missing_with_code_and_release'], 0)

    def test_active_only_excludes_vanished_but_keeps_trash(self):
        self.asset('SIVR-020', studio='Studio A')
        self.asset('SIVR-021', studio='Studio A', disposal='vanished')
        self.asset('ABC-022', studio='Studio B', disposal='trash')
        report = missing_performers.summary(self.connection, active_only=True, limit=10)
        self.assertEqual(report['counts']['missing_with_code_and_release'], 3)
        self.assertEqual(report['counts']['missing_with_code_and_release_active'], 2)
        self.assertEqual([row['code'] for row in report['rows']], ['SIVR-020', 'ABC-022'])
        self.assertEqual(report['by_studio'], [{'studio': 'Studio A', 'n': 1}, {'studio': 'Studio B', 'n': 1}])
        self.assertTrue(report['filters']['active_only'])
        output = io.StringIO()
        with redirect_stdout(output):
            code = audit_missing_performers.main([
                '--db', str(self.db), '--json', '--limit', '10', '--active',
            ])
        self.assertEqual(code, 0)
        payload = json.loads(output.getvalue())
        self.assertTrue(payload['filters']['active_only'])
        self.assertEqual([row['code'] for row in payload['rows']], ['SIVR-020', 'ABC-022'])

    def test_empty_code_and_release_only_count_in_all_scope(self):
        self.asset(None, release_date=None)
        self.asset('', release_date='')
        report = missing_performers.summary(self.connection)
        self.assertEqual(report['counts']['with_code'], 0)
        self.assertEqual(report['counts']['with_code_and_release'], 0)
        self.assertEqual(report['counts']['missing_all_videos'], 2)
        self.assertEqual(report['counts']['missing_with_code_and_release'], 0)

    def test_diagnose_explains_no_entity_and_route_without_guessing(self):
        asset_id = self.asset('ROYD-190', studio='HHH', release_date='2024-08-27',
                              title='ROYD title',
                              owners='{"code":"scan:filename","catalog_title":"auto:makers",'
                                     '"studio":"auto:makers","release_date":"auto:makers"}')
        self.connection.execute(
            "INSERT INTO asset_tag(asset_id,tag,source) VALUES(?,?,?)",
            (asset_id, '学生', 'javinizer:makers:tag'))
        self.connection.commit()
        report = missing_performers.diagnose(self.connection, 'ROYD-190')
        self.assertTrue(report['found'])
        self.assertEqual(report['diagnosis'], 'no_performer_entity_no_review_record')
        self.assertEqual(report['performer_entities'], [])
        self.assertIn('auto:makers', report['observed_sources'])
        self.assertIn('makers', report['route']['sources'])
        self.assertEqual(report['field_owners']['catalog_title'], 'auto:makers')
        self.assertFalse(report['title_used_to_guess_performer'])

    def test_existing_review_decision_changes_diagnosis(self):
        self.asset('ROYD-191', title='not used')
        self.connection.execute(
            "INSERT INTO review_decision(category,item_key,status,note,updated_at) "
            "VALUES('metadata_fields','ROYD-191:tags','rejected','{}','2026-01-01')")
        self.connection.commit()
        report = missing_performers.diagnose(self.connection, 'ROYD-191')
        self.assertEqual(report['diagnosis'], 'review_record_present_no_performer')
        self.assertEqual(len(report['review_decisions']), 1)

    def test_cli_is_read_only_and_json_has_both_views(self):
        self.asset('SIVR-010')
        before = self.connection.execute('SELECT count(*) FROM asset_tag').fetchone()[0]
        output = io.StringIO()
        with redirect_stdout(output):
            code = audit_missing_performers.main([
                '--db', str(self.db), '--json', '--limit', '5',
            ])
        self.assertEqual(code, 0)
        payload = json.loads(output.getvalue())
        self.assertIn('counts', payload)
        self.assertEqual(payload['counts']['missing_with_code_and_release'], 1)
        output = io.StringIO()
        with redirect_stdout(output):
            code = audit_missing_performers.main([
                '--db', str(self.db), '--json', '--code', 'SIVR-010',
            ])
        self.assertEqual(code, 0)
        single = json.loads(output.getvalue())
        self.assertEqual(single['code'], 'SIVR-010')
        self.assertIn('diagnosis', single)
        after = self.connection.execute('SELECT count(*) FROM asset_tag').fetchone()[0]
        self.assertEqual((before, after), (0, 0))


if __name__ == '__main__':
    unittest.main()
