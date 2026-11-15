"""JavDB 账号登录：把本机凭据换成作品资料接口要求的登录令牌。

2026-11-10 起，匿名接口的请求签名照旧被接受，业务状态却改成 `success=0`、
`action=JWTVerificationError`、`message`「請登錄帳號」。域名与签名都没有变，Peach 原来
的匿名读取因此整体不可用；补上账号后，资料请求带 `authorization` 头才能继续读。

凭据只从 `secrets/follow/javdb.json` 读（与「来源凭据」同一个仓库），登录令牌只留在
内存：密码不进日志、不回显、不写 ledger，也不跨机同步。登录被拒后冷却一段时间再试，
免得错密码时每打开一个详情页就打一次登录接口。

账号请求的节奏由 `javdb_public` 管：带令牌的请求按配置的间隔与每小时上限发。站点一旦
回「瀏覽速度遠超正常用戶」这类停用说明，这里记住恢复时间，停用期内不再尝试登录。
"""
from __future__ import annotations

import hashlib
import logging
import re
import threading
import time
from datetime import datetime

from . import interface_text, peach_proxy
from .follow_secrets import CredentialError, CredentialStore
from .source_page_words import JAVDB_SUSPENSION_MARKERS

LOGGER = logging.getLogger(__name__)

#: 「来源凭据」里的 provider 名；字段名由 `follow_secrets.CREDENTIAL_GUIDE` 声明。
PROVIDER = "javdb"
LOGIN_PATH = "/api/v1/sessions"
#: 登录被拒后多久才再打一次登录接口。密码错了重试得再快也没用，只会多几次失败登录。
REJECTED_COOLDOWN = 300.0
#: 站点判定「异常采集」并临时停用时的说明特征。2026-11-15 实测账号被停用的原话是
#: 「帳號已被臨時停用：系統檢測到該帳號的瀏覽速度遠超正常用戶，判定為異常採集行為」。
SUSPENSION_MARKERS = JAVDB_SUSPENSION_MARKERS
#: 停用说明里的恢复时间，形如 2026-11-16 22:34。
_RECOVERY_TIME = re.compile(r"(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})")
#: 停用说明里没写恢复时间时，按站点惯例先停一天。
RESTRICTED_SECONDS = 24 * 3600.0

_LOCK = threading.Lock()
_STATE = {"token": "", "fingerprint": "", "rejected_until": 0.0, "reason": "",
          "restricted_until": 0.0, "restricted_text": "", "restricted_reason": ""}


class AccountUnavailable(RuntimeError):
    """这台机器上的 JavDB 账号不可用：登录被拒、没有回执或回执里没有令牌。"""


def _secrets_root():
    return peach_proxy.secrets_root()


def load(root=None) -> tuple[str, str] | None:
    """返回 (username, password)；没配、读不出或缺字段时返回 None，不抛异常。"""
    try:
        credential = CredentialStore(root or _secrets_root()).load(PROVIDER)
    except (CredentialError, OSError, ValueError):
        return None
    if credential is None:
        return None
    username = str(credential.values.get("username") or "").strip()
    password = str(credential.values.get("password") or "")
    return (username, password) if username and password else None


def configured() -> bool:
    return load() is not None


def _fingerprint(username: str, password: str) -> str:
    return hashlib.sha256((username + "\0" + password).encode("utf-8")).hexdigest()


def reset() -> None:
    """丢掉内存里的令牌与拒绝冷却。凭据变化后由调用方决定要不要重新登录。"""
    with _LOCK:
        _STATE.update(token="", fingerprint="", rejected_until=0.0, reason="",
                      restricted_until=0.0, restricted_text="", restricted_reason="")


def token(*, client=None) -> str | None:
    """当前登录令牌；没配账号返回 None，登录被拒抛 `AccountUnavailable`。"""
    with _LOCK:
        restricted = _STATE["restricted_until"] > time.monotonic()
    if restricted:
        raise AccountUnavailable(_suspended_message())
    account = load()
    if account is None:
        return None
    fingerprint = _fingerprint(*account)
    with _LOCK:
        if _STATE["token"] and _STATE["fingerprint"] == fingerprint:
            return str(_STATE["token"])
        if _STATE["fingerprint"] == fingerprint and _STATE["rejected_until"] > time.monotonic():
            raise AccountUnavailable(str(_STATE["reason"]))
    return _login(*account, fingerprint=fingerprint, client=client)


def is_suspended(message: str) -> bool:
    """站点这句说明是不是「异常采集、账号临时停用」。"""
    text = str(message or "").casefold()
    return any(marker.casefold() in text for marker in SUSPENSION_MARKERS)


def recovery_at(message: str):
    """从停用说明里读恢复时间；读不到返回 None。"""
    found = _RECOVERY_TIME.search(str(message or ""))
    if not found:
        return None
    try:
        return datetime(*[int(part) for part in found.groups()])
    except ValueError:
        return None


def restricted_text() -> str:
    """账号还在停用期时返回站点给出的恢复时间文字，否则空串。"""
    with _LOCK:
        if _STATE["restricted_until"] <= time.monotonic():
            return ""
        return str(_STATE["restricted_text"] or "")


def restrict(message: str) -> str:
    """记下停用状态与恢复时间，返回给界面的恢复时间文字。"""
    until = recovery_at(message)
    if until is not None:
        seconds = max(600.0, (until - datetime.now()).total_seconds() + 300)
    else:
        seconds = RESTRICTED_SECONDS
    text = until.strftime("%Y-%m-%d %H:%M") if until else ""
    with _LOCK:
        _STATE.update(token="", rejected_until=0.0,
                      restricted_until=time.monotonic() + seconds,
                      restricted_text=text, restricted_reason=str(message or ""))
    LOGGER.warning("JavDB account restricted by source; recovery at %s", text or "unknown")
    return text


def _suspended_message() -> str:
    with _LOCK:
        reason = str(_STATE["restricted_reason"] or "")
        until = str(_STATE["restricted_text"] or "")
    if until:
        return interface_text.text("server:errors.javdbAccount.suspended",
                                   {"reason": reason, "until": until})
    return interface_text.text("server:errors.javdbAccount.suspendedNoTime", {"reason": reason})


def refresh(*, client=None) -> str | None:
    """丢掉当前令牌重新登录；返回新令牌。没配账号返回 None。停用期不重登。"""
    with _LOCK:
        _STATE.update(token="", rejected_until=0.0)
    return token(client=client)


def _login(username: str, password: str, *, fingerprint: str, client=None) -> str:
    from .javdb_public import APP_HEADERS, APP_QUERY, API_HOSTS, signature_header

    form = {
        **APP_QUERY,
        "username": username,
        "password": password,
        "device_uuid": "peach",
        "device_name": "Peach",
        "device_model": "Peach",
        "app_version": "web",
        "app_version_number": "1.0.0",
    }
    owned = client is None
    if owned:
        client = peach_proxy.http_client(timeout=20)
    payload = None
    try:
        for host in API_HOSTS:
            try:
                response = client.post(host + LOGIN_PATH, data=form,
                                       headers={"accept": "application/json", **signature_header(),
                                                **APP_HEADERS})
            except Exception as error:  # 一家没连上就换下一家，与资料请求同一套主机顺序
                LOGGER.warning("JavDB login request failed for %s: %s", host, type(error).__name__)
                continue
            try:
                payload = response.json()
            except ValueError:
                continue
            break
    finally:
        if owned:
            client.close()
    if not isinstance(payload, dict):
        raise AccountUnavailable(interface_text.text("server:errors.javdbAccount.noResponse"))
    if payload.get("success") != 1:
        reason = str(payload.get("message") or payload.get("action")
                     or interface_text.text("server:errors.javdbAccount.rejectedUnknown"))
        if is_suspended(reason):
            # 账号被站点判定异常采集：别再用它打接口，等恢复时间过了再说。
            restrict(reason)
            raise AccountUnavailable(_suspended_message())
        message = interface_text.text("server:errors.javdbAccount.rejected", {"reason": reason})
        with _LOCK:
            _STATE.update(token="", fingerprint=fingerprint,
                          rejected_until=time.monotonic() + REJECTED_COOLDOWN, reason=message)
        raise AccountUnavailable(message)
    data = payload.get("data")
    value = str(data.get("token") or "") if isinstance(data, dict) else str(data or "")
    if not value:
        raise AccountUnavailable(interface_text.text("server:errors.javdbAccount.noToken"))
    with _LOCK:
        _STATE.update(token=value, fingerprint=fingerprint, rejected_until=0.0, reason="",
                      restricted_until=0.0, restricted_text="", restricted_reason="")
    return value
