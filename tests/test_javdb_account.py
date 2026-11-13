"""JavDB 账号登录与资料请求的授权头。"""
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from peach import javdb_account
from peach.follow_secrets import CREDENTIAL_GUIDE
from peach.http import HttpResponse
from peach.javdb_public import (APP_SIGNATURE, PublicAPI, PublicSourceAuthRequired,
                                PublicSourceUnavailable)
from peach.javdb_account import AccountUnavailable


class FakeResponse:
    """登录接口的最小回执替身：只需要 `json()`。"""

    status_code = 200

    def __init__(self, payload):
        self._payload = payload

    def json(self):
        return self._payload


def write_credential(secrets_root: Path, username: str = "buyer", password: str = "secret"):
    path = secrets_root / "follow" / "javdb.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"username": username, "password": password}), encoding="utf-8")
    return path


def json_transport(payloads):
    requests = []

    def transport(request, timeout, max_bytes):
        requests.append(request)
        body = payloads[min(len(requests) - 1, len(payloads) - 1)]
        return HttpResponse(200, {}, json.dumps(body).encode("utf-8"))

    return transport, requests


class AccountCredentialTests(unittest.TestCase):
    def setUp(self):
        javdb_account.reset()

    def tearDown(self):
        javdb_account.reset()

    def test_guide_declares_the_account_fields(self):
        guide = CREDENTIAL_GUIDE["javdb"]
        self.assertEqual(guide["fields"], ["username", "password"])
        self.assertEqual(guide["requirement"], "optional")
        self.assertEqual(guide["syncable"], [])
        self.assertEqual(guide["label"], "JavDB")

    def test_login_sends_the_account_and_reuses_the_token(self):
        with tempfile.TemporaryDirectory() as tmp:
            secrets = Path(tmp) / "secrets"
            write_credential(secrets)
            client = Mock()
            client.post.return_value = FakeResponse({"success": 1, "data": {"token": "TOKEN"}})
            with patch.object(javdb_account, "_secrets_root", return_value=secrets):
                self.assertEqual(javdb_account.token(client=client), "TOKEN")
                self.assertEqual(javdb_account.token(client=client), "TOKEN")
        self.assertEqual(client.post.call_count, 1)
        url = client.post.call_args.args[0]
        self.assertTrue(url.endswith("/api/v1/sessions"))
        self.assertEqual(client.post.call_args.kwargs["data"]["username"], "buyer")
        self.assertEqual(client.post.call_args.kwargs["data"]["password"], "secret")
        self.assertIn("jdsignature", client.post.call_args.kwargs["headers"])

    def test_missing_account_reads_none_without_calling_the_source(self):
        with tempfile.TemporaryDirectory() as tmp:
            secrets = Path(tmp) / "secrets"
            secrets.mkdir(parents=True)
            client = Mock()
            with patch.object(javdb_account, "_secrets_root", return_value=secrets):
                self.assertIsNone(javdb_account.token(client=client))
        self.assertEqual(client.post.call_count, 0)

    def test_rejected_login_reports_the_reason_and_cools_down(self):
        with tempfile.TemporaryDirectory() as tmp:
            secrets = Path(tmp) / "secrets"
            write_credential(secrets)
            client = Mock()
            client.post.return_value = FakeResponse(
                {"success": 0, "action": "NonExistentUser", "message": "帳號不存在"})
            with patch.object(javdb_account, "_secrets_root", return_value=secrets):
                with self.assertRaises(AccountUnavailable) as rejected:
                    javdb_account.token(client=client)
                self.assertIn("帳號不存在", str(rejected.exception))
                self.assertIn("来源凭据", str(rejected.exception))
                with self.assertRaises(AccountUnavailable):
                    javdb_account.token(client=client)
        self.assertEqual(client.post.call_count, 1)


class AuthorizedRequestTests(unittest.TestCase):
    def test_request_carries_the_token_and_is_retried_once_after_refresh(self):
        transport, requests = json_transport([
            {"success": 0, "action": "JWTVerificationError", "message": "請登錄帳號"},
            {"success": 1, "data": {"movies": []}},
        ])
        api = PublicAPI(transport, sleeper=lambda _: None,
                        token_provider=lambda: "TOKEN-1", token_refresh=lambda: "TOKEN-2")
        with patch.object(api, "_signature", return_value=APP_SIGNATURE):
            self.assertEqual(api._json("/v2/search", {"q": "ABF-288"}), {"movies": []})
        self.assertEqual([request.headers.get("authorization") for request in requests],
                         ["TOKEN-1", "TOKEN-2"])

    def test_missing_account_reports_the_configure_hint(self):
        transport, requests = json_transport([
            {"success": 0, "action": "JWTVerificationError", "message": "請登錄帳號"},
        ])
        api = PublicAPI(transport, sleeper=lambda _: None,
                        token_provider=lambda: "", token_refresh=lambda: "")
        with patch.object(api, "_signature", return_value=APP_SIGNATURE):
            with self.assertRaises(PublicSourceAuthRequired) as raised:
                api._json("/v2/search", {"q": "ABF-288"})
        self.assertIn("来源凭据", str(raised.exception))
        self.assertEqual(requests[0].headers.get("authorization"), None)

    def test_other_business_failure_keeps_the_retry_later_message(self):
        transport, requests = json_transport([
            {"success": 0, "action": "ParameterInvalid", "message": "參數錯誤"},
        ])
        api = PublicAPI(transport, sleeper=lambda _: None, token_provider=lambda: "")
        with patch.object(api, "_signature", return_value=APP_SIGNATURE):
            with self.assertRaises(PublicSourceUnavailable) as raised:
                api._json("/v2/search", {"q": "ABF-288"})
        self.assertEqual(str(raised.exception), "作品资料未取得，请稍后重试")
        self.assertEqual(len(requests), 1)


if __name__ == "__main__":
    unittest.main()
