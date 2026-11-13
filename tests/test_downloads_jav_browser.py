"""JAV 用户脚本请求、持久队列与真实云下载服务的隔离回归。"""
from __future__ import annotations

import base64
import hashlib
import io
import json
import shutil
import subprocess
import tempfile
import threading
import time
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from unittest.mock import Mock, patch

from fastapi.testclient import TestClient

from peach import downloads as dl
from peach.api import create_app
from peach.config import PROJECT_ROOT, PeachSettings
from peach.jav_browser import CREDENTIAL, JavBrowser, code_key, identify_source, source_page, source_sites
from support.ledger import fresh_ledger
from support.conditions import missing_prerequisite
from support.browser import chrome_executable

HASH = "c9e15763f722f23e98a29decdfae341b98d53056"
MAGNET = f"magnet:?xt=urn:btih:{HASH}&dn=ABC-123"
PAGE = "https://missav.ws/cn/abc-123"


class BrowserTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.app = create_app(PeachSettings(
            db_path=fresh_ledger(self.root), configured=True, token="admin-secret",
            follow_state_root=self.root / "state", secrets_root=self.root / "secrets"))
        self.addCleanup(self.app.state.http_transport.close)
        self.service = self.app.state.jav_browser
        self.downloads = self.app.state.downloads
        self.remote = Mock()
        self.remote.submit.return_value = dl.RemoteStatus(dl.RUNNING, "remote-1", "ABC-123")
        self.downloads.providers = lambda key: self.remote
        self.downloads.channel_catalog = lambda: {
            "providers": [self.downloads._provider_state(key) for key in dl.PROVIDER_LABELS], "problems": []}
        self.downloads.config = dl.DownloadConfig("http://127.0.0.1:19798", {"115": "/115/Movies"})
        self.downloads.credentials.save(dl.CLOUDDRIVE_CREDENTIAL, {"token": "cloud-secret"})
        self.service.search = Mock(return_value={"items": [{"name": "ABC-123 1080p", "uri": MAGNET}]})
        self.client = TestClient(self.app, client=("127.0.0.1", 12345))
        self.headers = {"X-Token": "admin-secret"}
        response = self.configure("enable")
        self.assertEqual(response.status_code, 200, response.text)
        self.token = response.json()["token"]
        self.script_headers = {"Authorization": "Bearer " + self.token, "Origin": "https://missav.ws"}

    def configure(self, action, provider="115", **extra):
        return self.client.post("/api/configuration/jav-browser", headers=self.headers,
                                json={"action": action, "provider": provider, **extra})

    def add(self, code="ABC-123", **extra):
        return self.client.post("/api/jav-browser", headers=self.script_headers,
                                json={"code": code, "source_url": PAGE, **extra})

    def status(self):
        return self.client.get("/api/jav-browser", params={"code": "ABC-123"}, headers=self.script_headers)

    def test_temporary_search_retries_persist_and_wait_until_due(self):
        now = [1_800_000_000.0]
        self.downloads.clock = lambda: now[0]
        self.service.search.return_value = {'state': 'error', 'items': [], 'error': '请求超时', 'retry_after': 120.0}
        self.add()
        self.service.process_one()
        status = self.status().json()
        self.assertEqual((status['state'], status['retry_attempt']), ('queued', 1))
        restored = JavBrowser(self.service.contract, search=self.service.search)
        self.assertFalse(restored.process_one())
        self.assertEqual(self.service.search.call_count, 1)
        now[0] += 120
        self.service.search.return_value = {'items': [{'name': 'ABC-123 1080p', 'uri': MAGNET}]}
        self.assertTrue(restored.process_one())
        self.assertEqual(restored.status('ABC-123')['state'], 'submitted')
        self.remote.submit.assert_called_once()

    def test_permanent_search_failure_is_not_automatically_requeued(self):
        self.service.search.return_value = {'state': 'unavailable', 'items': [], 'error': '需要配置索引器'}
        self.add()
        self.service.process_one()
        self.assertEqual(self.status().json()['state'], 'failed')
        self.assertFalse(self.service.process_one())

    def test_postprocess_retry_is_dispatched_by_the_download_scheduler_after_restart(self):
        now = [1_800_000_000.0]
        self.downloads.clock = lambda: now[0]
        task = self.downloads.store.save(dl.DownloadTask(id=0, info_hash=HASH, provider='115', source_uri=MAGNET,
            display_name='ABC-123', target='/115/Movies', state=dl.INGESTED, postprocess_state=dl.POSTPROCESS_PENDING))
        self.downloads.store.fail_postprocess(task.id, TimeoutError('暂时超时'), now=now[0])
        restored = dl.DownloadStore(self.downloads.store.database)
        self.assertEqual(restored.pending_postprocess(now[0]), [])
        self.assertEqual(self.downloads.poll_once(), 0)
        self.downloads.after_ingest = lambda value: self.downloads.store.postprocess(value.id, dl.POSTPROCESS_QUEUED)
        now[0] += 60
        self.assertEqual(self.downloads.poll_once(), 1)
        self.assertEqual(restored.get(task.id).postprocess_state, dl.POSTPROCESS_QUEUED)
        self.remote.submit.assert_not_called()

    def test_queued_request_searches_then_uses_the_cloud_download_contract(self):
        self.assertEqual(self.status().json()["state"], "idle")
        response = self.add()
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["state"], "queued")
        self.service.search.assert_not_called()
        self.assertTrue(self.service.process_one())
        result = self.status().json()
        self.assertEqual(result["state"], "submitted")
        self.assertTrue(result["task_id"])
        self.remote.submit.assert_called_once()
        task = self.downloads.store.get(result["task_id"])
        self.assertEqual((task.provider, task.target, task.code, task.origin),
                         ("115", "/115/Movies", "ABC-123", "browser:" + PAGE))
        self.assertEqual(self.downloads.store.submissions(task.id)[0]["outcome"], "submitted")

    def test_auto_pick_preferences_are_saved_and_used_when_searching(self):
        response = self.configure("preferences", min_resolution=1080,
                                  edition_keywords=["新模型无码破解", "LTX", "无码"])
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual((response.json()["min_resolution"], response.json()["edition_keywords"]),
                         (1080, ["新模型无码破解", "LTX", "无码"]))
        self.add()
        self.service.search.reset_mock()
        self.assertTrue(self.service.process_one())
        args = self.service.search.call_args.args[1]
        self.assertEqual((args["min_resolution"], args["edition_keywords"]),
                         (1080, ["新模型无码破解", "LTX", "无码"]))

    def test_auto_pick_preferences_reject_invalid_values(self):
        self.configure("preferences", min_resolution=2160, edition_keywords=["LTX"])
        for body in ({"min_resolution": 720}, {"min_resolution": "abc"},
                     {"edition_keywords": ["长" * 41]}, {"edition_keywords": ["A"] * 9}):
            with self.subTest(body=body):
                response = self.configure("preferences", **body)
                self.assertEqual(response.status_code, 400, response.text)
        self.assertEqual(self.service.preferences, {"min_resolution": 2160, "edition_keywords": ["LTX"]})

    def test_auto_pick_preferences_survive_token_rotation_and_disable(self):
        self.configure("preferences", min_resolution=2160, edition_keywords=["LTX"])
        self.assertEqual(self.configure("rotate").status_code, 200)
        self.assertEqual(self.service.preferences, {"min_resolution": 2160, "edition_keywords": ["LTX"]})
        self.assertEqual(self.configure("disable").status_code, 200)
        self.assertEqual(self.service.preferences, {"min_resolution": 2160, "edition_keywords": ["LTX"]})

    def test_manual_number_queues_without_sending_the_source_page(self):
        response = self.client.post('/api/jav-browser', headers=self.script_headers,
                                    json={'code': 'ABC-123', 'manual': True})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()['state'], 'queued')
        self.assertEqual(self.service.rows['ABC-123']['source_url'], '')
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()['task_id'])
        self.assertEqual(task.origin, 'browser:manual')

    def test_manual_number_rejects_source_urls_and_invalid_codes(self):
        for body in ({'code': 'ABC-123', 'manual': True, 'source_url': 'https://example.org/private'},
                     {'code': 'not a code', 'manual': True},
                     {'code': 'ABC-123', 'manual': 'true'}):
            response = self.client.post('/api/jav-browser', headers=self.script_headers, json=body)
            self.assertEqual(response.status_code, 400, response.text)
        self.assertEqual(self.service.rows, {})

    def test_people_reads_local_names_and_avatar_without_starting_source_requests(self):
        from PIL import Image
        from peach.entities import upsert_asset_entity
        contract = self.app.state.web_contract
        contract.avatar_root = self.root / 'avatars'
        contract.cover_root = self.root / 'covers'
        self.app.state.preview_service.avatar_root = contract.avatar_root
        with contract.database.write_transaction() as connection:
            asset_id = connection.execute(
                'INSERT INTO asset(path,name,location,medium,code) VALUES(?,?,?,?,?)',
                ('R:\\Media\\ABC-123.mp4', 'ABC-123.mp4', 'local', 'video', 'ABC-123')).lastrowid
            person = upsert_asset_entity(connection, asset_id=asset_id, kind='performer', name='测试演员',
                                         role='performer', source='user:test')
        contract.avatar_root.mkdir(parents=True, exist_ok=True)
        Image.new('RGB', (80, 80), 'gray').save(contract.avatar_root / f'performer-{person}.img', format='JPEG')
        with patch('peach.javdb_public.PUBLIC_API.movie', side_effect=AssertionError('不能联网')):
            response = self.client.get('/api/jav-browser/people', params={'codes': 'ABC-123,XYZ-999'},
                                       headers=self.script_headers)
        self.assertEqual(response.status_code, 200, response.text)
        result = response.json()
        self.assertEqual(result['source'], 'local-cache')
        self.assertEqual(result['items']['XYZ-999'], [])
        self.assertEqual(result['items']['ABC-123'][0]['name'], '测试演员')
        self.assertTrue(result['items']['ABC-123'][0]['avatar'].startswith('data:image/jpeg;base64,'))
        self.assertEqual(self.service.rows, {})
        self.service.search.assert_not_called()

    def test_people_matches_detail_page_performers_for_a_title_outside_the_library(self):
        from PIL import Image
        from peach.entities import upsert_asset_entity
        contract = self.app.state.web_contract
        contract.avatar_root = self.root / 'avatars'
        contract.cover_root = self.root / 'covers'
        self.app.state.preview_service.avatar_root = contract.avatar_root
        with contract.database.write_transaction() as connection:
            asset_id = connection.execute(
                'INSERT INTO asset(path,name,location,medium,code) VALUES(?,?,?,?,?)',
                ('R:\\Media\\ABC-123.mp4', 'ABC-123.mp4', 'local', 'video', 'ABC-123')).lastrowid
            person = upsert_asset_entity(connection, asset_id=asset_id, kind='performer', name='河北彩花',
                                         role='performer', source='user:test')
        contract.avatar_root.mkdir(parents=True, exist_ok=True)
        Image.new('RGB', (80, 80), 'gray').save(contract.avatar_root / f'performer-{person}.img', format='JPEG')
        response = self.client.get('/api/jav-browser/people', headers=self.script_headers, params={
            'codes': 'XYZ-999', 'performers': ['河北彩花（河北彩伽）', '未登记女优♀', '男优♂']})
        self.assertEqual(response.status_code, 200, response.text)
        people = response.json()['items']['XYZ-999']
        self.assertEqual([(row['id'], row['name']) for row in people], [(person, '河北彩花'), (None, '未登记女优')])
        self.assertTrue(people[0]['avatar'].startswith('data:image/jpeg;base64,'))
        for params in ({'codes': 'ABC-123,XYZ-999', 'performers': ['河北彩花']},
                       {'codes': 'XYZ-999', 'performers': ['女优'] * 11},
                       {'codes': 'XYZ-999', 'performers': ['长' * 61]}):
            self.assertEqual(self.client.get('/api/jav-browser/people', params=params,
                                             headers=self.script_headers).status_code, 400)
        self.assertEqual(self.service.rows, {})

    def test_people_of_an_owned_title_ignore_a_different_stage_name_on_the_detail_page(self):
        # 素人作品入库后账本按资料站认出真名，详情页仍写店铺艺名；不能把艺名再算成第二个人。
        from peach.entities import upsert_asset_entity
        contract = self.app.state.web_contract
        with contract.database.write_transaction() as connection:
            asset_id = connection.execute(
                'INSERT INTO asset(path,name,location,medium,code) VALUES(?,?,?,?,?)',
                ('R:\\Media\\390JAC-059.mp4', '390JAC-059.mp4', 'local', 'video', '390JAC-059')).lastrowid
            person = upsert_asset_entity(connection, asset_id=asset_id, kind='performer', name='夏希栗',
                                         role='performer', source='user:test')
        response = self.client.get('/api/jav-browser/people', headers=self.script_headers,
                                   params={'codes': '390JAC-059', 'performers': ['れいか']})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual([(row['id'], row['name']) for row in response.json()['items']['390JAC-059']], [(person, '夏希栗')])

    def test_people_avatar_is_framed_on_the_recorded_face(self):
        from PIL import Image
        from peach.entities import upsert_asset_entity
        contract = self.app.state.web_contract
        contract.avatar_root = self.root / 'avatars'
        contract.cover_root = self.root / 'covers'
        self.app.state.preview_service.avatar_root = contract.avatar_root
        with contract.database.write_transaction() as connection:
            asset_id = connection.execute(
                'INSERT INTO asset(path,name,location,medium,code) VALUES(?,?,?,?,?)',
                (r'R:\Media\ABC-123.mp4', 'ABC-123.mp4', 'local', 'video', 'ABC-123')).lastrowid
            person = upsert_asset_entity(connection, asset_id=asset_id, kind='performer', name='测试演员',
                                         role='performer', source='user:test')
        contract.avatar_root.mkdir(parents=True, exist_ok=True)
        portrait = Image.new('RGB', (400, 800), 'white')
        portrait.paste((220, 0, 0), (180, 100, 220, 140))
        portrait.save(contract.avatar_root / f'performer-{person}.img', format='JPEG')

        def centre():
            response = self.client.get('/api/jav-browser/people', params={'codes': 'ABC-123'}, headers=self.script_headers)
            data = response.json()['items']['ABC-123'][0]['avatar'].split(',', 1)[1]
            with Image.open(io.BytesIO(base64.b64decode(data))) as avatar:
                return avatar.convert('RGB').getpixel((32, 32))

        self.assertGreater(centre()[1], 200)
        (contract.avatar_root / f'performer-{person}.face.json').write_text(json.dumps({
            'face': {'cx': 0.5, 'cy': 0.15, 'w': 0.1}, 'px': [400, 800], 'focus': {'axis': 'y', 'pct': 10}}), encoding='utf-8')
        red, green, blue = centre()
        self.assertGreater(red, 150)
        self.assertLess(green, 90)

    def test_people_rejects_unpaired_or_invalid_queries_and_leaves_missing_avatar_empty(self):
        self.assertEqual(self.client.get('/api/jav-browser/people', params={'codes':'ABC-123'}).status_code, 401)
        for codes in ('bad code', ','.join(['ABC-123']*51)):
            self.assertEqual(self.client.get('/api/jav-browser/people', params={'codes':codes},
                                              headers=self.script_headers).status_code, 400)
        contract = self.app.state.web_contract
        contract.cover_root = self.root / 'covers'
        snapshot = contract.cover_root.parent / 'jav-discovery-metadata.json'
        snapshot.parent.mkdir(parents=True, exist_ok=True)
        snapshot.write_text(json.dumps({'version':1,'records':{'ABC-123':{'movie':{'actors':[{'name':'测试女优','gender':'female'}]}}}}),encoding='utf-8')
        snapshot.with_suffix('.job.json').write_text(json.dumps({'status':'running','codes':['ABC-123']}),encoding='utf-8')
        with patch('peach.jav_discovery_metadata.DiscoveryMetadata', side_effect=AssertionError('不能恢复后台抓取')):
            result = self.client.get('/api/jav-browser/people', params={'codes':'ABC-123'}, headers=self.script_headers).json()
        self.assertEqual(result['items']['ABC-123'], [{'id':None,'name':'测试女优'}])

    def test_alias_clicks_and_service_restart_keep_one_job_and_one_cloud_submission(self):
        self.add("abc123")
        self.add("ABC-0123")
        restored = JavBrowser(self.app.state.web_contract, search=self.service.search)
        self.assertEqual(restored.status("ABC-123")["state"], "queued")
        restored.process_one()
        self.add()
        self.assertTrue(self.service.process_one())
        self.assertFalse(self.service.process_one())
        self.remote.submit.assert_called_once()
        self.service.search.assert_called_once()

    def test_searching_job_is_recovered_as_queued(self):
        self.add()
        self.service.rows["ABC-123"]["state"] = "searching"
        self.service._save()
        restored = JavBrowser(self.app.state.web_contract, search=self.service.search)
        self.assertEqual(restored.status("ABC-123")["state"], "queued")

    def test_owned_video_is_not_queued_or_searched(self):
        with self.app.state.web_contract.database.write_transaction() as connection:
            connection.execute("INSERT INTO asset(path,name,location,medium,code) VALUES(?,?,?,?,?)",
                               ("R:\\Media\\ABC-123.mp4", "ABC-123.mp4", "local", "video", "ABC-123"))
        result = self.add().json()
        self.assertEqual(result["state"], "owned")
        self.assertTrue(result["asset_id"])
        self.assertFalse(self.service.process_one())
        self.service.search.assert_not_called()
        self.remote.submit.assert_not_called()

    def test_existing_download_by_code_is_adopted_before_search(self):
        task = dl.submit_offline_download(self.downloads, magnet=MAGNET, provider="115", code="ABC-123")["task"]
        result = self.add().json()
        self.assertEqual((result["state"], result["task_id"]), ("submitted", task["id"]))
        self.service.search.assert_not_called()
        self.remote.submit.assert_called_once()

    def test_candidates_require_matching_code_and_full_video(self):
        self.service.search.return_value = {"items": [
            {"name": "XYZ-999 4K", "uri": MAGNET}, {"name": "ABC-123 sample", "uri": MAGNET},
            {"name": "unknown", "uri": MAGNET}, {"name": "ABC-123", "uri": "https://bad.test/file.torrent"}]}
        self.add()
        self.service.process_one()
        self.assertEqual(self.status().json()["state"], "no_match")
        self.remote.submit.assert_not_called()

    def test_no_match_requires_an_explicit_retry(self):
        self.service.search.return_value = {"items": []}
        self.add()
        self.service.process_one()
        self.assertFalse(self.service.process_one())
        self.status()
        self.assertEqual(self.service.search.call_count, 1)
        self.assertEqual(self.add().json()["state"], "queued")
        self.service.process_one()
        self.assertEqual(self.service.search.call_count, 2)

    def test_magnet_failure_can_switch_to_the_next_magnet_until_none_are_left(self):
        other_hash = "b" * 40
        other = f"magnet:?xt=urn:btih:{other_hash}&dn=ABC-123"
        self.service.search.return_value = {"items": [{"name": "ABC-123 1080p", "uri": MAGNET},
                                                      {"name": "ABC-123 720p", "uri": other}]}
        self.remote.submit.side_effect = dl.DownloadError("no_source", "没有可用下载源")
        self.add()
        self.service.process_one()
        failed = self.status().json()
        self.assertEqual((failed["state"], failed["failure"], failed["cause"]), ("failed", "no_source", "magnet"))
        self.assertEqual(self.add(switch="yes").status_code, 400)
        self.remote.submit.side_effect = None
        self.assertEqual(self.add(switch=True).json()["state"], "queued")
        self.service.process_one()
        self.assertEqual(self.service.search.call_args.args[1]["skip"], [HASH])
        switched = self.status().json()
        self.assertEqual(switched["state"], "submitted")
        self.assertNotEqual(switched["task_id"], failed["task_id"])
        self.assertEqual(self.downloads.store.get(switched["task_id"]).info_hash, other_hash)
        task = self.downloads.store.get(switched["task_id"])
        task.state, task.failure = dl.FAILED, "invalid_link"
        self.downloads.store.save(task)
        self.assertEqual(self.add(switch=True).json()["state"], "queued")
        self.service.process_one()
        exhausted = self.status().json()
        self.assertEqual((exhausted["state"], exhausted["message"]), ("no_match", "没有其他可用磁力，可在 Peach 手动选择资源"))

    def test_tasks_the_cloud_never_listed_count_as_cloud_problems_including_legacy_rows(self):
        self.add()
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()["task_id"])
        task.remote_id = task.remote_name = task.progress = None
        for failure, detail in (("not_accepted", "网盘没有收下这个任务"),
                                ("no_source", "远端任务列表里找不到这个任务，目标目录里也没有文件")):
            task.state, task.failure, task.failure_detail = dl.FAILED, failure, detail
            self.downloads.store.save(task)
            self.assertEqual(self.status().json()["cause"], "cloud")
        task.failure, task.failure_detail = "no_source", "没有可用下载源"
        self.downloads.store.save(task)
        self.assertEqual(self.status().json()["cause"], "magnet")

    def test_script_can_retry_a_failed_organization_but_nothing_else(self):
        self.add()
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()["task_id"])
        task.state, task.asset_id = dl.INGESTED, 42
        self.downloads.store.save(task)
        retry = lambda headers=None: self.client.post("/api/jav-browser/postprocess", json={"code": "ABC-123"},
                                                      headers=self.script_headers if headers is None else headers)
        self.assertEqual(retry().status_code, 400)
        self.downloads.store.postprocess(task.id, dl.POSTPROCESS_FAILED, detail="文件整理未完成")
        self.assertEqual(retry({}).status_code, 401)
        # 派发后继由任务中心同一入口负责，这里只核对交给了它。
        with patch.object(self.downloads, "_dispatch_postprocess") as dispatch:
            response = retry()
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["state"], "ingested")
        self.assertEqual(response.json()["download"]["postprocess_state"], dl.POSTPROCESS_PENDING)
        self.assertEqual(dispatch.call_args.args[0].id, task.id)

    def test_cloud_failure_is_visible_and_a_manual_retry_uses_existing_task(self):
        self.remote.submit.side_effect = dl.DownloadError("config", "请更新网盘账号")
        self.add()
        self.service.process_one()
        failed = self.status().json()
        self.assertEqual(failed["state"], "failed")
        self.assertEqual((failed["failure"], failed["cause"]), ("config", "cloud"))
        self.assertEqual(failed["message"], "请更新网盘账号")
        self.remote.submit.side_effect = None
        self.add()
        self.service.process_one()
        result = self.status().json()
        self.assertEqual((result["state"], result["task_id"]), ("submitted", failed["task_id"]))

    def test_ingested_and_cancelled_states_follow_the_download_task(self):
        self.add()
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()["task_id"])
        task.state, task.asset_id = dl.INGESTED, 42
        self.downloads.store.save(task)
        self.assertEqual(self.status().json()["state"], "ingested")
        self.assertEqual(self.status().json()["asset_id"], 42)
        task.state = dl.CANCELLED
        self.downloads.store.save(task)
        self.assertEqual(self.status().json()["state"], "failed")

    def test_library_ownership_keeps_the_latest_unfinished_postprocessing_visible_without_queue_cache(self):
        self.add()
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()['task_id'])
        with self.downloads.store.database.write_transaction() as connection:
            asset_id = connection.execute('INSERT INTO asset(path,name,location,medium,code) VALUES(?,?,?,?,?)',
                (r'C:\Media\ABC-123.mp4', 'ABC-123.mp4', 'local', 'video', 'ABC-123')).lastrowid
        task.state, task.asset_id = dl.INGESTED, asset_id
        self.downloads.store.save(task)
        self.downloads.store.postprocess(task.id, dl.POSTPROCESS_FAILED, detail='需要检查挂载')
        self.service.rows.clear()
        status = self.status().json()
        self.assertEqual((status['state'], status['task_id'], status['download']['postprocess_state']),
                         ('ingested', task.id, dl.POSTPROCESS_FAILED))
        self.assertEqual(self.service.active()['items'][0]['download']['postprocess_state'], dl.POSTPROCESS_FAILED)
        self.downloads.store.fail_postprocess(task.id, TimeoutError('暂时断开'))
        self.assertEqual(self.status().json()['retry_attempt'], 1)
        self.downloads.store.postprocess(task.id, dl.POSTPROCESS_COMPLETE)
        self.assertEqual(self.status().json()['state'], 'owned')

    def test_status_projects_remote_progress_and_postprocessing_without_private_task_fields(self):
        self.add()
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()["task_id"])
        for state, progress, label in ((dl.REMOTE_RUNNING, .425, "网盘下载中"),
                                       (dl.REMOTE_RUNNING, None, "网盘下载中"),
                                       (dl.REMOTE_DONE, 1.0, "网盘下载完成"),
                                       (dl.LANDED, 1.0, "文件已可访问"),
                                       (dl.INGESTED, 1.0, "已入库")):
            task.state, task.progress = state, progress
            task.postprocess_state = dl.POSTPROCESS_RUNNING
            self.downloads.store.save(task)
            status = self.status().json()
            detail = status["download"]
            self.assertEqual((detail["state"], detail["progress"], detail["label"]), (state, progress, label))
            self.assertEqual(detail["postprocess_label"], "整理中")
            self.assertEqual(detail["phase"], "organize" if state == dl.INGESTED else "ingest"
                             if state in {dl.REMOTE_DONE, dl.LANDED} else "download")
            self.assertEqual(set(detail), {"state", "label", "phase", "progress", "postprocess_state", "postprocess_label", "updated_at"})
        tracked = self.service.rows.copy()
        self.service.rows.clear()
        task.state = dl.REMOTE_RUNNING
        self.downloads.store.save(task)
        self.assertEqual(self.status().json()["download"]["progress"], 1.0)
        self.service.rows.update(tracked)
        task.state, task.remote_done_at = dl.FAILED, "2026-10-24T13:25:00+00:00"
        self.downloads.store.save(task)
        self.assertEqual(self.status().json()["download"]["phase"], "ingest")

    def test_active_lists_running_and_recently_finished_tasks_for_every_window(self):
        def listed():
            response = self.client.get("/api/jav-browser/active", headers=self.script_headers)
            self.assertEqual(response.status_code, 200, response.text)
            self.assertEqual(response.headers["cache-control"], "no-store")
            return {item["code"]: item for item in response.json()["items"]}

        self.assertEqual(listed(), {})
        self.add()
        self.assertEqual(listed()["ABC-123"]["state"], "queued")
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()["task_id"])
        task.state, task.progress = dl.REMOTE_RUNNING, .5
        self.downloads.store.save(task)
        # 不经浏览器队列的同番号云下载也列出：清掉队列行后按下载任务找到。
        self.service.rows.clear()
        self.assertEqual(listed()["ABC-123"]["download"]["progress"], .5)
        task.state, task.postprocess_state = dl.INGESTED, dl.POSTPROCESS_RUNNING
        self.downloads.store.save(task)
        self.assertEqual(listed()["ABC-123"]["download"]["postprocess_state"], dl.POSTPROCESS_RUNNING)
        task.postprocess_state, task.postprocessed_at = dl.POSTPROCESS_COMPLETE, dl.iso(time.time())
        self.downloads.store.save(task)
        self.assertEqual(listed()["ABC-123"]["state"], "ingested")
        old = "2026-01-01T00:00:00+00:00"
        task.updated_at = task.finished_at = task.postprocessed_at = old
        self.downloads.store.save(task)
        self.assertEqual(listed(), {})
        self.assertEqual(self.client.get("/api/jav-browser/active").status_code, 401)

    def test_finished_browser_tasks_stay_listed_until_dismissed(self):
        def listed():
            response = self.client.get("/api/jav-browser/active", headers=self.script_headers)
            self.assertEqual(response.status_code, 200, response.text)
            return {item["code"]: item for item in response.json()["items"]}

        def dismiss(body):
            return self.client.post("/api/jav-browser/dismiss", json=body, headers=self.script_headers)

        self.add()
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()["task_id"])
        self.assertTrue(task.origin.startswith("browser:"))
        self.service.ended["since"] = "2026-01-01T00:00:00+00:00"
        # 结束早已超过 10 分钟，没确认就一直列出。
        task.state, task.postprocess_state = dl.INGESTED, dl.POSTPROCESS_COMPLETE
        task.updated_at = task.postprocessed_at = "2026-06-01T00:00:00+00:00"
        self.downloads.store.save(task)
        item = listed()["ABC-123"]
        self.assertEqual((item["ended_key"], item["dismissed"]), (f"{task.id}@2026-06-01T00:00:00+00:00", False))
        # 之后又改了 updated_at（如停滞复查），结束键不变。
        task.updated_at = dl.iso(time.time() - 3600)
        self.downloads.store.save(task)
        self.assertEqual(listed()["ABC-123"]["ended_key"], item["ended_key"])
        self.assertEqual(dismiss({"keys": ["../ABC-123"]}).status_code, 400)
        self.assertEqual(dismiss({"keys": [item["ended_key"]]}).status_code, 200)
        self.assertEqual(listed(), {})
        # 重试整理后再次结束是新的结束键，重新列出。
        task.postprocessed_at = "2026-07-01T00:00:00+00:00"
        self.downloads.store.save(task)
        self.assertFalse(listed()["ABC-123"]["dismissed"])
        response = dismiss({"all": True})
        self.assertEqual((response.status_code, response.json()["items"]), (200, []))
        self.assertEqual(json.loads(self.service.ended_path.read_text(encoding="utf-8"))["dismissed"], [])
        # 刚结束、已被别的窗口确认的仍列出 10 分钟，只标 dismissed，本页状态照旧读得到。
        task.postprocessed_at = task.updated_at = dl.iso(time.time() - 5)
        self.downloads.store.save(task)
        self.assertTrue(listed()["ABC-123"]["dismissed"])
        # 不是浏览器添加的任务结束后不留存。
        self.service.ended["since"] = "2026-01-01T00:00:00+00:00"
        task.origin, task.postprocessed_at, task.updated_at = "wishlist:1", "2026-08-01T00:00:00+00:00", "2026-08-01T00:00:00+00:00"
        self.downloads.store.save(task)
        self.assertEqual(listed(), {})

    def test_disable_and_rotation_revoke_tokens(self):
        rotated = self.configure("rotate").json()["token"]
        self.assertEqual(self.status().status_code, 401)
        self.assertNotEqual(rotated, self.token)
        self.script_headers["Authorization"] = "Bearer " + rotated
        self.assertEqual(self.status().status_code, 200)
        self.add()
        self.configure("disable")
        self.assertEqual(self.status().status_code, 401)
        self.assertFalse(self.service.process_one())
        self.assertEqual(self.service.rows["ABC-123"]["state"], "failed")
        self.remote.submit.assert_not_called()

    def test_disable_during_search_prevents_cloud_submission(self):
        self.add()
        started, finish = threading.Event(), threading.Event()
        def search(*args):
            started.set()
            if not finish.wait(5):
                raise RuntimeError("test search did not finish")
            return {"items": [{"name": "ABC-123", "uri": MAGNET}]}
        self.service.search = search
        worker = threading.Thread(target=self.service.process_one)
        worker.start()
        try:
            self.assertTrue(started.wait(5))
            self.configure("disable")
        finally:
            finish.set()
            worker.join(5)
        self.assertFalse(worker.is_alive())
        self.remote.submit.assert_not_called()

    def test_missing_cloud_configuration_refuses_before_search(self):
        self.downloads.credentials.clear(dl.CLOUDDRIVE_CREDENTIAL)
        self.assertEqual(self.add().status_code, 400)
        self.assertEqual(self.configure("enable").status_code, 400)
        self.service.search.assert_not_called()

    def test_add_queues_without_remote_channel_probe_and_worker_validates(self):
        self.downloads.channel_catalog = Mock(side_effect=ValueError("channel unavailable"))
        self.assertEqual(self.add().json()["state"], "queued")
        self.downloads.channel_catalog.assert_not_called()
        self.service.process_one()
        self.assertEqual(self.status().json()["state"], "failed")
        self.service.search.assert_not_called()
        self.remote.submit.assert_not_called()

    def test_slow_submission_allows_status_and_retains_inflight_task_when_disabled(self):
        self.add()
        started, finish, queried = threading.Event(), threading.Event(), threading.Event()
        states = []
        def submit(*args):
            started.set()
            if not finish.wait(10):
                raise RuntimeError("submission fixture did not finish")
            return dl.RemoteStatus(dl.RUNNING, "remote-1", "ABC-123")
        def query():
            states.append(self.service.status("ABC-123")["state"])
            queried.set()
        self.remote.submit.side_effect = submit
        worker = threading.Thread(target=self.service.process_one)
        reader = threading.Thread(target=query)
        worker.start()
        try:
            self.assertTrue(started.wait(5))
            reader.start()
            self.assertTrue(queried.wait(2), "status waited for remote submission")
            self.assertEqual(states, ["searching"])
            self.assertEqual(self.service.status("ABC-123")["stage"], "submitting")
            self.assertEqual(self.add().json()["state"], "searching")
            self.assertEqual(self.configure("disable").status_code, 200)
        finally:
            finish.set()
            worker.join(5)
            if reader.ident is not None:
                reader.join(5)
        self.assertFalse(worker.is_alive())
        self.assertFalse(reader.is_alive())
        status = self.service.status("ABC-123")
        self.assertEqual(status["state"], "submitted")
        self.remote.submit.assert_called_once()
        self.assertEqual(len(self.downloads.store.submissions(status["task_id"])), 1)

    def report(self, events, **kwargs):
        return self.client.post("/api/jav-browser/errors", headers=self.script_headers,
                                json={"events": events}, **kwargs)

    def diagnostic(self, **changes):
        return {"id": "7d58618d-b9b9-430e-bc28-1e9a81aa2e11", "at": "2026-10-24T13:25:00Z",
                "kind": "timeout", "operation": "POST", "site": "missav", "code": "ABC-123",
                "script_version": "0.4.1", "elapsed_ms": 60000, "status": 0, **changes}

    def test_script_reports_are_scoped_bounded_deduplicated_and_use_local_logs(self):
        import io
        import zipfile
        from peach import error_reporting, support_bundle
        from peach.settings_file import PeachConfig
        clock = patch("peach.jav_browser_diagnostics.time", Mock(monotonic=lambda: 100.0))
        clock.start()
        self.addCleanup(clock.stop)
        path = "/api/jav-browser/errors"
        self.assertEqual(self.client.post(path, json={"events": [self.diagnostic()]}).status_code, 401)
        self.assertEqual(self.client.post(path, headers=self.script_headers, content=b"x" * 17000).status_code, 413)
        with patch.object(error_reporting, "_log_dir", self.root / "logs"), patch("peach.remote_reporting.capture") as remote:
            row = self.diagnostic(message="private-message", token="private-token", source_url=PAGE)
            self.assertEqual(self.report([row]).json(), {"recorded": 1})
            self.assertEqual(self.report([row]).json(), {"recorded": 0})
            remote.assert_not_called()
            log = next((self.root / "logs").glob("errors-*.log"))
            text = log.read_text(encoding="utf-8")
            value = json.loads(text)
            self.assertEqual((value["stage"], value["kind"], value["code"], value["elapsed_ms"]),
                             ("userscript", "timeout", "ABC-123", 60000))
            for private in ("private-message", "private-token", PAGE, self.token, "cloud-secret"):
                self.assertNotIn(private, text)
            config = PeachConfig(self.root, self.root / "config.toml")
            with zipfile.ZipFile(io.BytesIO(support_bundle.bundle_bytes(config=config))) as archive:
                content = archive.read(next(name for name in archive.namelist() if name.endswith(log.name))).decode()
                self.assertIn('"stage": "userscript"', content)
        for change in ({"kind": []}, {"site": "https://private.example"}, {"code": "not a code"},
                       {"elapsed_ms": True}, {"status": 999}, {"script_version": "secret"}, {"at": "yesterday"}):
            self.assertEqual(self.report([self.diagnostic(**change)]).status_code, 400)
        self.assertEqual(self.report([self.diagnostic()] * 11).status_code, 400)
        with patch.object(error_reporting, "local_event", return_value=self.root / "log") as event:
            for number in range(20):
                row = self.diagnostic(id=f"00000000-0000-4000-8000-{number:012d}")
                response = self.report([row])
                if number < 19:
                    self.assertEqual(response.status_code, 200)
                else:
                    self.assertEqual(response.status_code, 429)
            self.assertEqual(event.call_count, 19)

    def test_read_only_instance_cannot_accept_jobs(self):
        self.downloads.available = False
        self.assertEqual(self.add().status_code, 403)
        self.assertEqual(self.configure("enable").status_code, 400)
        self.assertFalse(self.service.process_one())

    def test_special_token_grants_no_other_api_or_settings_access(self):
        response = self.client.get("/api/downloads", headers=self.script_headers)
        self.assertEqual(response.status_code, 401)
        response = self.client.post("/api/configuration/jav-browser", headers=self.script_headers,
                                    json={"action": "disable"})
        self.assertEqual(response.status_code, 403)
        response = self.client.post("/api/jav-browser", headers={"X-Token": "admin-secret"},
                                    json={"code": "ABC-123", "source_url": PAGE})
        self.assertEqual(response.status_code, 401)

    def test_settings_require_local_and_same_origin_calls(self):
        remote = TestClient(self.app, client=("192.0.2.10", 12345))
        self.assertEqual(remote.get("/api/configuration/jav-browser", headers=self.headers).status_code, 403)
        headers = {**self.headers, "Origin": "https://missav.ws"}
        response = self.client.post("/api/configuration/jav-browser", headers=headers,
                                    json={"action": "enable", "provider": "115"})
        self.assertEqual(response.status_code, 403)

    def test_credentials_are_scoped_and_never_returned_by_reads(self):
        stored = self.downloads.credentials.load(CREDENTIAL).values
        self.assertEqual(stored["token_hash"], hashlib.sha256(self.token.encode()).hexdigest())
        public = self.client.get("/api/configuration/jav-browser", headers=self.headers)
        self.assertEqual(public.status_code, 200)
        for secret in (self.token, stored["token_hash"], "cloud-secret"):
            self.assertNotIn(secret, public.text + self.status().text)
        self.assertEqual(public.headers["cache-control"], "no-store")

    def test_invalid_codes_and_source_pages_cannot_enqueue(self):
        for code in ("", "VIDEO-2025", "ABC-123 some title", "ABC-123 XYZ-999", "x" * 100):
            self.assertEqual(self.add(code).status_code, 400, code)
        for page in ("http://missav.ws/abc-123", "https://missav.ws.evil.test/abc-123",
                     PAGE + "?token=secret", PAGE + "#secret", "https://user:secret@missav.ws/a"):
            self.assertEqual(self.add(source_url=page).status_code, 400, page)
        self.assertFalse(self.service.rows)

    def test_fc2_code_and_supported_site_urls_use_existing_normalization(self):
        self.assertEqual(code_key("fc2ppv1234567"), "FC2-PPV-1234567")
        self.assertEqual(source_page("https://jable.tv/videos/abc-123/"), "https://jable.tv/videos/abc-123/")

    def test_search_errors_stop_without_automatic_resubmission(self):
        self.service.search.side_effect = RuntimeError("upstream unavailable")
        self.add()
        with self.assertLogs("peach.jav_browser", level="ERROR"):
            self.service.process_one()
        self.assertEqual(self.status().json()["state"], "failed")
        self.assertFalse(self.service.process_one())
        self.remote.submit.assert_not_called()

    def test_pikpak_selection_uses_the_saved_account_and_target(self):
        self.downloads.credentials.save(dl.PIKPAK_CREDENTIAL, {"refresh_token": "pikpak-secret"})
        self.downloads.config = dl.DownloadConfig(targets={"pikpak": "/Movies"}, pikpak_root="A:\\")
        response = self.configure("enable", "pikpak")
        self.assertEqual(response.status_code, 200, response.text)
        self.script_headers["Authorization"] = "Bearer " + response.json()["token"]
        self.add()
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()["task_id"])
        self.assertEqual((task.provider, task.target), ("pikpak", "/Movies"))

    def test_rejected_search_reports_a_failure_instead_of_no_match(self):
        self.service.search.return_value = {"items": [], "state": "error", "error": "source unavailable"}
        self.add()
        self.service.process_one()
        self.assertEqual(self.status().json()["state"], "failed")

    def test_library_cloud_channel_submits_to_its_mapped_target(self):
        key = "clouddrive:guangya:test-library"
        self.downloads.channel_catalog = lambda: {"providers": [{
            "key": key, "label": "收藏 · 光鸭云盘", "configured": True, "target": "/duck/收藏"}], "problems": []}
        response = self.configure("rotate", key)
        self.assertEqual(response.status_code, 200, response.text)
        self.script_headers["Authorization"] = "Bearer " + response.json()["token"]
        self.add()
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()["task_id"])
        self.assertEqual((task.provider, task.target), (key, "/duck/收藏"))
        self.assertEqual(self.downloads.snapshot()["tasks"][0]["provider_label"], "收藏 · 光鸭云盘")
        with self.assertRaisesRegex(ValueError, "所选媒体库"):
            self.downloads.submit(source=MAGNET, provider=key, target="/other")

    def test_empty_or_removed_library_channel_does_not_choose_a_fixed_provider(self):
        self.downloads.channel_catalog = lambda: {"providers": [], "problems": []}
        state = self.service.settings()
        self.assertEqual((state["provider"], state["providers"], state["active_provider"]), ("", [], "115"))
        self.assertEqual(self.configure("rotate", "115").status_code, 400)

    def test_product_identity_uses_the_registered_domains_and_detail_pattern(self):
        dmm = dict(next(site for site in source_sites() if site["id"] == "dmm"))
        dmm["domains"] = ["publisher.example"]
        with patch("peach.jav_browser.source_sites", return_value=[dmm]):
            self.assertEqual(identify_source("https://video.publisher.example/av/content/?id=ssis00519"), "SSIS-519")
            self.assertEqual(identify_source("https://publisher.example/digital/videoa/-/detail/=/cid=ssis00519/"), "SSIS-519")
            with self.assertRaises(ValueError):
                identify_source("https://publisher.example/unrelated/ssis00519")

    def test_installer_is_available_without_an_admin_token(self):
        response = self.client.get("/integrations/peach-jav.user.js")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.text.startswith("// ==UserScript=="))
        self.assertIn("application/javascript", response.headers["content-type"])
        self.assertNotIn(self.token, response.text)
        self.assertNotIn("__PEACH_JAV_SITES__", response.text)
        self.assertNotIn("__PEACH_JAV_MATCHES__", response.text)
        for host in ("javdb.com", "javbus.com", "javlibrary.com", "dmm.co.jp"):
            self.assertIn(f"// @match        https://{host}/*", response.text)
        directory = PROJECT_ROOT / "web" / "integrations"
        release = json.loads((directory / "jav-userscript-release.json").read_text(encoding="utf-8"))
        self.assertEqual(hashlib.sha256(response.content).hexdigest(), release["files"]["peach-jav.user.js"])
        self.assertEqual(hashlib.sha256((directory / "jav-sites.json").read_bytes()).hexdigest(),
                         release["files"]["jav-sites.json"])

    def test_official_product_identification_is_read_only_and_uses_catalog_rules(self):
        cases = {
            "https://video.dmm.co.jp/av/content/?id=ssis00519": "SSIS-519",
            "https://video.dmm.co.jp/av/content/?id=1dandy00899": "DANDY-899",
            "https://video.dmm.co.jp/av/content/?id=1fns00061": "FNS-061",
            "https://video.dmm.co.jp/av/content/?id=1ssis00519": "SSIS-519",
            "https://video.dmm.co.jp/av/content/?id=118abw00220": "ABW-220",
            "https://video.dmm.co.jp/av/content/?id=1dandy00851c": "DANDY-851C",
            "https://video.dmm.co.jp/av/content/?id=48midv00012ai": "MIDV-012AI",
            "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=ssis00057/": "SSIS-057",
            "https://www.dmm.co.jp/mono/dvd/-/detail/=/cid=h_086iqqq00026/": "IQQQ-026",
            "https://www.mgstage.com/product/product_detail/300MIUM-1239/": "300MIUM-1239",
            "https://www.mgstage.com/product/product_detail/259LUXU-1475/": "259LUXU-1475",
            "https://www.mgstage.com/product/product_detail/104DANDY-851C/": "104DANDY-851C",
            # 素人作品页与 FC2 内容市场商品页：地址里只有商品号或数字编号。
            "https://video.dmm.co.jp/amateur/content/?id=mfc288": "MFC-288",
            "https://adult.contents.fc2.com/article/4900901/": "FC2-PPV-4900901",
        }
        for source, expected in cases.items():
            with self.subTest(source=source):
                self.assertEqual(identify_source(source), expected)
                result = self.client.get("/api/jav-browser/identify", params={"source_url": source}, headers=self.script_headers)
                self.assertEqual(result.status_code, 200, result.text)
                self.assertEqual(result.json()["code"], expected)
                self.assertEqual(result.json()["state"], "idle")
        self.service.search.assert_not_called()
        self.remote.submit.assert_not_called()
        self.assertEqual(self.service.rows, {})
        for source in ("https://video.dmm.co.jp/av/content/?id=opaque_cid", "https://video.dmm.co.jp/av/content/?id=ssis00519&id=abw00123",
                       "https://unrelated.invalid/av/content/?id=ssis00519", "https://www.mgstage.com/search/?q=300MIUM-1239"):
            with self.subTest(source=source):
                result = self.client.get("/api/jav-browser/identify", params={"source_url": source}, headers=self.script_headers)
                self.assertEqual(result.status_code, 400, result.text)
        self.assertEqual(self.client.get("/api/jav-browser/identify", params={"source_url": next(iter(cases))}).status_code, 401)

    def test_product_page_number_must_agree_with_the_registered_product(self):
        source = "https://video.dmm.co.jp/av/content/?id=1dandy00899"
        for hint, status in (("DANDY-899", 200), ("DANDY-899C", 400), ("ABW-899", 400)):
            result = self.client.get("/api/jav-browser/identify", headers=self.script_headers,
                                     params={"source_url": source, "code": hint})
            self.assertEqual(result.status_code, status, result.text)
        self.assertFalse(self.service.rows)
        self.service.search.assert_not_called()
        self.remote.submit.assert_not_called()

    def test_mgstage_store_prefix_finds_the_owned_plain_release(self):
        source = "https://www.mgstage.com/product/product_detail/107STZY-019/"
        with self.app.state.web_contract.database.write_transaction() as connection:
            connection.execute("INSERT INTO asset(path,name,location,medium,code) VALUES(?,?,?,?,?)",
                               ("R:\\Media\\STZY-019.mp4", "STZY-019.mp4", "local", "video", "STZY-019"))
        result = self.client.get("/api/jav-browser/identify", headers=self.script_headers,
                                 params={"source_url": source, "code": "107STZY-019"})
        self.assertEqual(result.status_code, 200, result.text)
        self.assertEqual((result.json()["code"], result.json()["state"]), ("STZY-019", "owned"))
        self.assertEqual(self.add("107STZY-019").json()["state"], "owned")
        self.assertFalse(self.service.process_one())
        self.service.search.assert_not_called()

    def test_mgstage_store_prefix_searches_and_submits_the_plain_release(self):
        self.service.search.return_value = {"items": [{"name": "STZY-019 1080p", "uri": MAGNET}]}
        self.assertEqual(self.add("107STZY-019").json()["code"], "STZY-019")
        self.service.process_one()
        self.assertEqual(self.service.rows["STZY-019"]["state"], "submitted")
        self.service.search.assert_called_once_with(
            self.app.state.web_contract,
            {"code": "STZY-019", "goal": "quality", "min_resolution": 0, "edition_keywords": []})
        self.assertEqual(self.downloads.store.get(self.service.rows["STZY-019"]["task_id"]).code, "STZY-019")

    def test_queue_rows_saved_under_a_store_prefix_move_to_the_plain_release(self):
        self.service.path.parent.mkdir(parents=True, exist_ok=True)
        self.service.path.write_text(json.dumps({
            "107STZY-019": {"state": "no_match", "provider": "115", "source_url": ""},
            "107STARS-325": {"state": "no_match", "provider": "115", "source_url": ""},
            "STARS-325": {"state": "queued", "provider": "115", "source_url": ""}}), encoding="utf-8")
        restored = JavBrowser(self.app.state.web_contract, search=self.service.search)
        self.assertEqual({key: row["state"] for key, row in restored.rows.items()},
                         {"STZY-019": "no_match", "STARS-325": "queued"})

    def test_explicit_product_suffix_is_preserved_through_the_download_submission(self):
        code = "104DANDY-851C"
        self.service.search.return_value = {"items": [
            {"name": "104DANDY-851 1080p", "uri": MAGNET},
            {"name": "104DANDY-851CH 1080p", "uri": MAGNET},
            {"name": "104DANDY-851C 1080p", "uri": MAGNET}]}
        self.assertEqual(self.add(code).status_code, 200)
        self.service.process_one()
        self.assertEqual(self.service.rows[code]["state"], "submitted")
        self.service.search.assert_called_once_with(
            self.app.state.web_contract,
            {"code": code, "goal": "quality", "min_resolution": 0, "edition_keywords": []})
        self.assertEqual(self.downloads.store.get(self.service.rows[code]["task_id"]).code, code)

    def test_explicit_product_suffix_does_not_adopt_the_plain_release(self):
        self.service.search.return_value = {"items": [{"name": "DANDY-851 1080p", "uri": MAGNET}]}
        self.add("DANDY-851C")
        self.service.process_one()
        self.assertEqual(self.service.rows["DANDY-851C"]["state"], "no_match")
        self.remote.submit.assert_not_called()

    def test_resource_identity_keeps_the_date_separator(self):
        self.service.search.return_value = {"items": [{"name": "092415-001 1080p", "uri": MAGNET}]}
        self.add("092415_001")
        self.service.process_one()
        self.assertEqual(self.service.rows["092415_001"]["state"], "no_match")
        self.remote.submit.assert_not_called()

    def test_resource_title_does_not_override_a_conflicting_primary_number(self):
        self.service.search.return_value = {"items": [{"name": "XYZ-999 DANDY-851C 1080p", "uri": MAGNET}]}
        self.add("DANDY-851C")
        self.service.process_one()
        self.assertEqual(self.service.rows["DANDY-851C"]["state"], "no_match")
        self.remote.submit.assert_not_called()

    def test_supported_explicit_numbers_use_the_same_status_contract(self):
        for code in ("MKBD-S123", "MKD-S123", "092415_01", "092415_0001", "DANDY-851C", "MIDV-012AI"):
            response = self.client.get("/api/jav-browser", params={"code": code}, headers=self.script_headers)
            self.assertEqual(response.status_code, 200, response.text)
            self.assertEqual(response.json()["code"], code)

    def test_complete_userscript_uses_the_real_identification_endpoint(self):
        node, chrome = shutil.which("node"), chrome_executable()
        if not node or not chrome or not (PROJECT_ROOT / "frontend/node_modules/playwright-core").is_dir():
            missing_prerequisite("用户脚本联合验收需要 Node、Chrome 和前端锁定依赖")
        client, headers = self.client, self.script_headers

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                if not self.path.startswith("/api/jav-browser/identify?"):
                    self.send_error(404)
                    return
                response = client.get(self.path, headers=headers)
                self.send_response(response.status_code)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(response.content)

            def log_message(self, *_args):
                pass

        server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        worker = threading.Thread(target=server.serve_forever, daemon=True)
        worker.start()
        try:
            result = subprocess.run([node, str(PROJECT_ROOT / "frontend/e2e/jav-userscript-contract.mjs"),
                                     f"http://127.0.0.1:{server.server_port}",
                                     str(PROJECT_ROOT / "web/integrations/peach-jav.user.js"), chrome],
                                    capture_output=True, text=True, encoding="utf-8", timeout=120)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        finally:
            server.shutdown()
            server.server_close()
            worker.join(timeout=5)
        self.assertFalse(self.service.rows)
        self.service.search.assert_not_called()
        self.remote.submit.assert_not_called()

    def test_userscript_bridge_requires_the_peach_session_and_contains_no_credential(self):
        path = "/integrations/peach-userscript-bridge"
        self.assertEqual(self.client.get(path).status_code, 401)
        response = self.client.get(path, headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["cache-control"], "no-store")
        self.assertEqual(response.headers["x-frame-options"], "SAMEORIGIN")
        self.assertNotIn(self.token, response.text)
        self.assertNotIn("admin-secret", response.text)

    def test_shutdown_waits_for_search_and_leaves_a_resumable_job(self):
        self.add()
        started, finish = threading.Event(), threading.Event()
        def search(*args):
            started.set()
            if not finish.wait(5):
                raise RuntimeError("test search did not finish")
            return {"items": [{"name": "ABC-123", "uri": MAGNET}]}
        self.service.search = search
        self.service.start()
        stopper = threading.Thread(target=self.service.stop)
        try:
            self.assertTrue(started.wait(5))
            stopper.start()
            self.assertTrue(self.service._stop.wait(5))
        finally:
            finish.set()
            if stopper.ident is not None:
                stopper.join(5)
            self.service.stop()
        self.assertFalse(stopper.is_alive())
        self.assertEqual(self.service.status("ABC-123")["state"], "queued")
        self.remote.submit.assert_not_called()

    def test_another_entry_submitting_a_different_hash_during_lookup_is_adopted(self):
        self.add()
        candidate_uri = "magnet:?xt=urn:btih:" + "a" * 40 + "&dn=ABC-123"
        self.service.search.return_value = {"items": [{"name": "ABC-123", "uri": candidate_uri}]}
        original = self.service._existing
        checked, proceed = threading.Event(), threading.Event()
        lookup_count = 0
        def existing(code):
            nonlocal lookup_count
            result = original(code)
            lookup_count += 1
            if lookup_count == 2:
                checked.set()
                if not proceed.wait(5):
                    raise RuntimeError("test lookup did not resume")
            return result
        self.service._existing = existing
        worker = threading.Thread(target=self.service.process_one)
        worker.start()
        try:
            self.assertTrue(checked.wait(5))
            submitted = dl.submit_offline_download(self.downloads, magnet=MAGNET, provider="115", code="abc123")
        finally:
            proceed.set()
            worker.join(5)
        self.assertFalse(worker.is_alive())
        self.assertEqual(self.status().json()["task_id"], submitted["task"]["id"])
        self.remote.submit.assert_called_once()
        self.assertEqual(self.downloads.store.recent()[0].info_hash, HASH)

    def test_shutdown_does_not_requeue_a_disabled_job(self):
        self.add()
        started, finish = threading.Event(), threading.Event()
        def search(*args):
            started.set()
            if not finish.wait(5):
                raise RuntimeError("test search did not finish")
            return {"items": [{"name": "ABC-123", "uri": MAGNET}]}
        self.service.search = search
        self.service.start()
        stopper = threading.Thread(target=self.service.stop)
        try:
            self.assertTrue(started.wait(5))
            self.configure("disable")
            stopper.start()
            self.assertTrue(self.service._stop.wait(5))
        finally:
            finish.set()
            if stopper.ident is not None:
                stopper.join(5)
            self.service.stop()
        self.assertEqual(self.service.status("ABC-123")["state"], "failed")
        self.remote.submit.assert_not_called()

    def test_database_and_official_source_pages_keep_only_registered_work_identifiers(self):
        pages = ("https://javdb.com/v/AbCd12", "https://www.javbus.com/ABC-123",
                 "https://www.javlibrary.com/cn/?v=javabc123", "https://video.dmm.co.jp/av/content/?id=ssis00057")
        for page in pages:
            with self.subTest(page=page):
                self.assertEqual(source_page(page), page)
        for query in ("v=javabc123&token=secret", "v=javabc123&v=javxyz456", "v=https%3A%2F%2Fevil.test"):
            with self.subTest(query=query):
                with self.assertRaises(ValueError):
                    source_page("https://www.javlibrary.com/cn/?" + query)

    def test_javdb_addition_uses_the_same_cloud_pipeline(self):
        self.assertEqual(self.add(source_url="https://javdb.com/v/AbCd12").json()["state"], "queued")
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()["task_id"])
        self.assertEqual(task.origin, "browser:https://javdb.com/v/AbCd12")
        self.remote.submit.assert_called_once()

    def test_registered_mirror_and_online_source_use_the_cloud_pipeline(self):
        for page in ("https://missav123.com/cn/abc-123", "https://www.busfan.casa/ABC-123",
                     "https://javgo.to/zh/v/abc-123", "https://netflav5.com/video/abc-123",
                     "https://www.av01.media/video/abc-123"):
            with self.subTest(page=page):
                self.assertEqual(source_page(page), page)
        page = "https://netflav5.com/video/abc-123"
        self.assertEqual(self.add(source_url=page).json()["state"], "queued")
        self.service.process_one()
        task = self.downloads.store.get(self.status().json()["task_id"])
        self.assertEqual(task.origin, f"browser:{page}")
        self.remote.submit.assert_called_once()

    def test_site_inventory_exposes_automatic_and_selected_code_modes(self):
        sites = source_sites()
        self.assertGreaterEqual(len(sites), 50)
        by_id = {site["id"]: site for site in sites}
        self.assertEqual(by_id["javdb"]["mode"], "automatic")
        self.assertEqual(by_id["javlibrary"]["mode"], "automatic")
        self.assertTrue(any(site["mode"] == "selection" for site in sites))
        response = self.client.get("/api/configuration/jav-browser", headers=self.headers)
        self.assertEqual(len(response.json()["sites"]), len(sites))
