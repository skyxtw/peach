"""VR 标签补救的规则与 dry-run 回归；所有账本都是临时库。"""
from __future__ import annotations

import io
import json
import sqlite3
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path

from support.ledger import fresh_ledger

from peach import vr_tags
from scripts import audit_vr_tags


class VrTagRuleTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name).resolve()
        self.db = fresh_ledger(self.root)
        self.connection = sqlite3.connect(self.db)
        self.connection.row_factory = sqlite3.Row
        self.addCleanup(self.connection.close)

    def asset(self, code: str, *, name: str = '', path: str = '', title: str = '',
              disposal: str | None = None) -> int:
        path = path or rf'R:\\VR\\{code}\\{code}.mp4'
        asset_id = int(self.connection.execute(
            "INSERT INTO asset(location,path,name,medium,code,catalog_title,disposal) "
            "VALUES('local',?,?, 'video',?,?,?)",
            (path, name or f'{code}.mp4', code, title, disposal)).lastrowid)
        self.connection.commit()
        return asset_id

    def tag(self, asset_id: int, tag: str = 'VR', source: str = 'test') -> None:
        self.connection.execute(
            'INSERT INTO asset_tag(asset_id,tag,confidence,source) VALUES(?,?,1.0,?)',
            (asset_id, tag, source))
        self.connection.commit()

    def plan(self, **kwargs):
        return vr_tags.plan(self.connection, batch='auto:vr-tags@test', **kwargs)

    def test_prefix_and_title_are_the_only_two_evidence_classes(self):
        only_prefix = self.asset('SIVR-001', name='sivr001.mp4')
        both = self.asset('VRKM-002', name='vrkm002_8k.mp4',
                          title='【8KVR】作品')
        title_only = self.asset('ABC-003', title='［ＶＲ180］作品')
        false_substring = self.asset('XYZ-004', name='holiday_vr_clip.mp4')
        tagged = self.asset('SIVR-005')
        self.tag(tagged)
        report = self.plan(chunk_size=2)
        ids = {item['asset_id'] for item in report['candidates']}
        self.assertEqual(ids, {only_prefix, both})
        self.assertEqual(report['by_prefix']['SIVR-001'.split('-')[0]]['tagged'], 1)
        self.assertEqual(report['title_only'][0]['asset_id'], title_only)
        self.assertNotIn(false_substring, ids)
        self.assertEqual(report['summary']['false_vr_substring'], 1)
        both_item = next(item for item in report['candidates'] if item['asset_id'] == both)
        self.assertEqual(both_item['evidence'], ['prefix', 'title'])
        self.assertNotIn(tagged, ids)

    def test_existing_vr_tag_from_entity_storage_is_not_rewritten(self):
        from peach.entities import upsert_asset_entity

        asset_id = self.asset('KAVR-010')
        upsert_asset_entity(self.connection, kind='tag', name='VR', asset_id=asset_id,
                            role='tag', source='test')
        self.connection.commit()
        self.assertEqual(self.plan()['candidates'], [])

    def test_dry_run_has_no_writes_and_batches_are_source_prefixed(self):
        first = self.asset('SIVR-021')
        second = self.asset('VRKM-022')
        third = self.asset('MDVR-023')
        before = self.connection.execute('SELECT count(*) FROM asset_tag').fetchone()[0]
        report = self.plan(chunk_size=2)
        after = self.connection.execute('SELECT count(*) FROM asset_tag').fetchone()[0]
        self.assertEqual((before, after), (0, 0))
        self.assertEqual([chunk['count'] for chunk in report['chunks']], [2, 1])
        self.assertTrue(all(item['batch'].startswith('auto:vr-tags@test:') for item in report['candidates']))
        self.assertEqual((first, second, third), (1, 2, 3))
        with self.assertRaises(ValueError):
            vr_tags.plan(self.connection, batch='wrong')

    def test_title_markers_are_strict(self):
        for text in ('【VR】作品', '[8KVR]作品', '［ＶＲ180］作品', '（VR）作品', '8KVR', 'VR180'):
            self.assertTrue(vr_tags.is_vr_title(text), text)
        for text in ('普通のVR作品', 'holiday_vr_clip.mp4', 'VR', 'my_vr.mp4'):
            self.assertFalse(vr_tags.is_vr_title(text), text)

    def test_active_only_excludes_vanished(self):
        keep = self.asset('SIVR-041')
        gone = self.asset('SIVR-042', disposal='vanished')
        default = self.plan()
        self.assertIn(gone, {item['asset_id'] for item in default['candidates']})
        report = self.plan(active_only=True)
        ids = {item['asset_id'] for item in report['candidates']}
        self.assertEqual(ids, {keep})
        self.assertEqual(report['summary']['scanned'], 1)
        self.assertTrue(report['summary']['active_only'])
        output = io.StringIO()
        with redirect_stdout(output):
            code = audit_vr_tags.main(['--db', str(self.db), '--json', '--active',
                                       '--batch', 'auto:vr-tags@test-active'])
        self.assertEqual(code, 0)
        payload = json.loads(output.getvalue())
        self.assertTrue(payload['summary']['active_only'])
        self.assertEqual({item['asset_id'] for item in payload['candidates']}, {keep})

    def test_script_runs_read_only_and_does_not_write(self):
        self.asset('SIVR-031')
        before = self.connection.execute('SELECT count(*) FROM asset_tag').fetchone()[0]
        output = io.StringIO()
        with redirect_stdout(output):
            code = audit_vr_tags.main(['--db', str(self.db), '--json',
                                       '--batch', 'auto:vr-tags@cli-test'])
        self.assertEqual(code, 0)
        after = self.connection.execute('SELECT count(*) FROM asset_tag').fetchone()[0]
        self.assertEqual((before, after), (0, 0))
        self.assertIn('SIVR-031', output.getvalue())


if __name__ == '__main__':
    unittest.main()
