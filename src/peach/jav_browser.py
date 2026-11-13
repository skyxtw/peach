"""浏览器 JAV 添加队列：按番号查磁力，交给现有云下载与入库链路。"""
from __future__ import annotations

import hashlib
import hmac
import json
import logging
import math
import re
import secrets
import threading
import time
from functools import lru_cache
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit

from .catalog_rules import (
    is_jav_code, normalise_code_key, release_code_from_product, same_release_code, without_store_prefix,
)
from .config import PROJECT_ROOT
from .downloads import (
    CLOUDDRIVE_CREDENTIAL, INGESTED, POSTPROCESS_FAILED, POSTPROCESS_PENDING, POSTPROCESS_QUEUED,
    POSTPROCESS_RUNNING, REMOTE_RUNNING, RESUBMITTABLE_STATES, STATE_LABELS, TRACKED_STATES, iso,
    never_seen, submit_offline_download, parse_magnet,
    parse_iso, DownloadError,
)
from .task_retry import RETRY_DELAYS, RetryableTaskError, retry_delay
from .follow_secrets import CredentialError
from .feeds import scan_code
from .fsutil import atomic_write_text
from .resource_search import preference_filters
from .sources.dmm import code_from_cid

LOGGER = logging.getLogger(__name__)
CREDENTIAL = "jav-browser"
#: 自动挑选偏好：最低清晰度与版本优先关键词，和令牌无关，关闭/更新令牌都不清。
PREFERENCES = "jav-browser-preferences.json"
DEFAULT_PREFERENCES = {"min_resolution": 0, "edition_keywords": []}
ACTIVE = {"queued", "searching"}
#: 共享进度列表的上限，与持久队列同为 200；结束的任务保留 10 分钟，供各窗口看到完成。
ACTIVE_LIMIT = 200
RECENT_SECONDS = 600
#: 浏览器添加的任务结束后一直留在列表里，直到用户在脚本里标为已读；键是「任务编号@结束时间」。
ENDED_KEY = re.compile(r"^[1-9][0-9]{0,11}@[0-9T:+.\-]{19,32}$")
ENDED_DISMISSED_LIMIT = 1000
#: 结束时间：整理完成的取整理时间，失败、取消、停滞取结束时间；停滞复查只改 updated_at，不让任务重新冒出来。
ENDED_AT = "coalesce(nullif(postprocessed_at,''), nullif(finished_at,''), updated_at)"
MESSAGES = {
    "idle": "可以加入 Peach 馆藏", "queued": "等待搜索磁力", "searching": "正在搜索磁力",
    "submitted": "云下载进行中", "ingested": "已加入 Peach 馆藏", "owned": "馆藏已有该番号影片",
    "failed": "添加失败，可重试", "no_match": "未找到可自动下载的磁力，可重试",
}
#: 下载失败按原因分给用户脚本：磁力本身的问题换一个磁力，网盘一侧的问题修好后重试同一个磁力。
MAGNET_FAILURES = frozenset({"rejected", "invalid_link", "no_source", "mismatch"})
CLOUD_FAILURES = frozenset({"config", "quota", "network", "not_landed", "duplicate", "not_accepted", "removed"})
NO_OTHER_MAGNET = "没有其他可用磁力，可在 Peach 手动选择资源"
#: 细分之前「列表里找不到」统一记为 no_source 的原文；这些旧任务从没被网盘列出过，按网盘问题处理。
LEGACY_MISSING = "远端任务列表里找不到这个任务"


@lru_cache(maxsize=1)
def source_sites() -> list[dict]:
    payload = json.loads((PROJECT_ROOT / "web" / "integrations" / "jav-sites.json").read_text(encoding="utf-8"))
    sites = payload.get("sites")
    if payload.get("version") != 1 or not isinstance(sites, list) or not sites:
        raise ValueError("JAV 站点清单无法读取")
    ids, domains = set(), set()
    for site in sites:
        if (not isinstance(site, dict) or not site.get("id") or site["id"] in ids
                or not site.get("label") or not site.get("kind")
                or site.get("mode") not in {"automatic", "selection"}
                or not isinstance(site.get("domains"), list) or not site["domains"]):
            raise ValueError("JAV 站点清单包含无效条目")
        ids.add(site["id"])
        if site.get("identity") is not None and (site["identity"] != "peach" or site["mode"] != "automatic"
                or not isinstance(site.get("detail_pattern"), str) or not site["detail_pattern"].startswith("^")
                or len(site.get("query_keys", ())) > 1):
            raise ValueError("发行商品号识别配置无效")
        for host in site["domains"]:
            if not isinstance(host, str) or not re.fullmatch(r"[a-z0-9-]+(?:\.[a-z0-9-]+)+", host) or host in domains:
                raise ValueError("JAV 站点清单包含无效域名")
            domains.add(host)
    return sites


def source_site(host: str) -> dict | None:
    return next((site for site in source_sites() if any(
        host == name or host.endswith("." + name) for name in site["domains"])), None)


def code_key(value: object) -> str:
    raw = str(value or "").strip()
    code = release_code_from_product(raw) if len(raw) <= 80 else None
    if not code or not is_jav_code(code) or normalise_code_key(raw) != normalise_code_key(code):
        raise ValueError("请提供一个明确的 JAV 番号")
    # 店铺商品号（`107STZY-019`）在账本与资源站都是裸番号，查询、搜索与入库统一用它。
    return without_store_prefix(code)


def source_page(value: object) -> str:
    raw = str(value or "")
    try:
        parsed = urlsplit(raw)
        host = (parsed.hostname or "").lower()
        site = source_site(host)
        if (len(raw) > 2048 or parsed.scheme != "https" or site is None or parsed.username
                or parsed.password or parsed.port not in {None, 443} or parsed.fragment):
            raise ValueError
        parameters = parse_qsl(parsed.query, keep_blank_values=True, max_num_fields=16)
        if (len({key for key, _value in parameters}) != len(parameters) or any(
                key not in site.get("query_keys", ()) or not re.fullmatch(r"[A-Za-z0-9_-]{1,100}", value)
                for key, value in parameters)):
            raise ValueError
    except ValueError:
        raise ValueError("请从支持的 JAV 影片详情页添加") from None
    return parsed._replace(query=urlencode(parameters), fragment="").geturl()


def identify_source(value: object, hint: str = "") -> str:
    """从已登记发行平台的详情地址提取商品号，复用编目规则确认番号。"""
    source = source_page(value)
    url = urlsplit(source)
    site = source_site(url.hostname or "")
    product = ""
    if site and site.get("identity") == "peach":
        match = re.fullmatch(site["detail_pattern"], url.path, re.IGNORECASE)
        if match:
            product = (match.group(1) if match.lastindex else "") or next(
                (dict(parse_qsl(url.query)).get(key, "") for key in site.get("query_keys", ())), "")
    if not product:
        raise ValueError("未识别到作品番号，请选中页面的完整番号后加入 Peach")
    # DMM 的商品号按编目规则拆出番号；FC2 内容市场的商品页地址里只有数字编号，番号是 FC2-PPV-<编号>。
    code = code_key(code_from_cid(product) if site["id"] == "dmm"
                    else f"FC2-PPV-{product}" if site["id"] == "fc2-market" else product)
    if hint and not same_release_code(code, code_key(hint)):
        raise ValueError("页面番号与商品号不一致，请核对作品详情")
    return code


def _download_candidate(items, code, skip=frozenset()):
    """搜索结果里第一个番号相符的正片磁力；`skip` 是换磁力时排除的 infohash。"""
    for item in items:
        name = str(item.get("name") or "")
        matches = (same_release_code(scan_code(name), code)
                   or same_release_code(scan_code(name, product=True), code))
        if not matches or re.search(r"(?i)\b(?:sample|trailer|preview)\b|予告|预告|預告", name):
            continue
        try:
            magnet = parse_magnet(str(item.get("uri") or ""))
        except ValueError:
            continue
        if magnet.info_hash in skip:
            continue
        return item
    return None


def _postprocess_retry_status(task) -> dict:
    """后处理的等待与耗尽状态，投影成浏览器可读的重试回执。"""
    if task.postprocess_state == POSTPROCESS_PENDING and task.next_check_at:
        return {'retry_at': task.next_check_at, 'retry_attempt': task.postprocess_retries,
                'retry_limit': len(RETRY_DELAYS)}
    if task.postprocess_state == 'failed' and task.postprocess_retries >= len(RETRY_DELAYS):
        return {'retry_exhausted': True, 'retry_attempt': task.postprocess_retries, 'retry_limit': len(RETRY_DELAYS)}
    return {}


class JavBrowser:
    """本机持久队列；搜索完成前退出时，下一次启动继续处理。"""

    def __init__(self, contract, *, search):
        self.contract = contract
        self.downloads = contract.downloads
        self.credentials = self.downloads.credentials
        self.path = Path(contract.follow_state_root) / "jav-browser-queue.json"
        self.ended_path = Path(contract.follow_state_root) / "jav-browser-ended.json"
        self.preferences_path = Path(contract.follow_state_root) / PREFERENCES
        self.preferences = self._load_preferences()
        self.search = search
        self._lock = threading.RLock()
        self._wake = threading.Event()
        self._stop = threading.Event()
        self._thread = None
        self._submitting = set()
        from .jav_browser_diagnostics import BrowserDiagnostics
        self.diagnostics = BrowserDiagnostics()
        self.rows = self._load()
        self.ended = self._load_ended()

    def _load(self) -> dict:
        if not self.path.exists():
            return {}
        payload = json.loads(self.path.read_text(encoding="utf-8"))
        if not isinstance(payload, dict) or len(payload) > 200:
            raise ValueError("浏览器添加队列无法读取")
        rows = {}
        for key, row in payload.items():
            if not isinstance(row, dict) or normalise_code_key(key) != key or row.get("state") not in MESSAGES:
                raise ValueError("浏览器添加队列无法读取")
            if 'retry_attempt' in row and (type(row['retry_attempt']) is not int or not 0 <= row['retry_attempt'] <= len(RETRY_DELAYS)):
                raise ValueError('浏览器添加重试次数无效')
            if 'retry_at' in row and (not isinstance(row['retry_at'], str) or parse_iso(row['retry_at']) is None):
                raise ValueError('浏览器添加重试时间无效')
            if row["state"] == "searching":
                row["state"] = "queued"
            # 店铺前缀归一之前记下的行（`107STZY-019`）改记到裸番号下，裸番号已有记录时以它为准。
            canonical = code_key(key)
            if canonical == key or canonical not in rows:
                rows[canonical] = row
        return rows

    def _save(self):
        atomic_write_text(self.path, json.dumps(self.rows, ensure_ascii=False, indent=2) + "\n")

    def _load_preferences(self) -> dict:
        """自动挑选偏好读本机状态；文件坏或格式不对时按默认值，不挡住浏览器添加。"""
        try:
            payload = json.loads(self.preferences_path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            return dict(DEFAULT_PREFERENCES)
        except (OSError, ValueError):
            LOGGER.warning("浏览器添加偏好读不出来，按默认值跑：%s", self.preferences_path)
            return dict(DEFAULT_PREFERENCES)
        if not isinstance(payload, dict):
            return dict(DEFAULT_PREFERENCES)
        try:
            min_resolution, keywords = preference_filters(payload)
        except ValueError:
            LOGGER.warning("浏览器添加偏好不合规则，按默认值跑：%s", self.preferences_path)
            return dict(DEFAULT_PREFERENCES)
        return {"min_resolution": min_resolution, "edition_keywords": keywords}

    def _save_preferences(self, body: dict) -> dict:
        min_resolution, keywords = preference_filters(body)
        preferences = {"min_resolution": min_resolution, "edition_keywords": keywords}
        atomic_write_text(self.preferences_path,
                          json.dumps(preferences, ensure_ascii=False, indent=2) + "\n")
        self.preferences = preferences
        return preferences

    def _load_ended(self) -> dict:
        """结束留存的确认记录：`since` 之前结束的都算确认过，之后的逐条记在 `dismissed` 里。

        文件不存在时从 10 分钟前起算并立即落盘，启用之前早已结束的任务不会一下子涌进浮卡。
        """
        try:
            payload = json.loads(self.ended_path.read_text(encoding="utf-8"))
            since, dismissed = payload["since"], payload["dismissed"]
            if (not isinstance(since, str) or not isinstance(dismissed, list)
                    or not all(isinstance(key, str) and ENDED_KEY.match(key) for key in dismissed)):
                raise ValueError
            return {"since": since, "dismissed": dismissed[-ENDED_DISMISSED_LIMIT:]}
        except FileNotFoundError:
            ended = {"since": iso(time.time() - RECENT_SECONDS), "dismissed": []}
        except (ValueError, KeyError, TypeError):
            LOGGER.warning("浏览器添加的结束确认记录无法读取，从现在起重新计")
            ended = {"since": iso(time.time()), "dismissed": []}
        atomic_write_text(self.ended_path, json.dumps(ended, ensure_ascii=False, indent=2) + "\n")
        return ended

    def dismiss(self, body: dict) -> dict:
        """确认已结束的任务：`all` 确认到此刻为止结束的全部，`keys` 逐条确认 `active()` 给出的键。"""
        keys = body.get("keys", [])
        if body.get("all") not in (None, False, True) or not isinstance(keys, list) or len(keys) > ACTIVE_LIMIT \
                or not all(isinstance(key, str) and ENDED_KEY.match(key) for key in keys):
            raise ValueError("确认参数无效")
        with self._lock:
            since = iso(time.time()) if body.get("all") is True else self.ended["since"]
            dismissed = [key for key in dict.fromkeys([*self.ended["dismissed"], *keys])
                         if key.split("@", 1)[1] >= since]
            self.ended = {"since": since, "dismissed": dismissed[-ENDED_DISMISSED_LIMIT:]}
            atomic_write_text(self.ended_path, json.dumps(self.ended, ensure_ascii=False, indent=2) + "\n")
        return self.active()

    def _config(self) -> dict:
        credential = self.credentials.load(CREDENTIAL)
        return dict(credential.values) if credential else {}

    def settings(self) -> dict:
        config = self._config()
        release = json.loads((PROJECT_ROOT / "web/integrations/jav-userscript-release.json").read_text(encoding="utf-8"))
        catalog = self.downloads.channel_snapshot() if self.downloads.available else {"providers": [], "problems": []}
        providers = catalog["providers"]
        preferred = config.get("provider", "")
        selected = preferred if any(row["key"] == preferred for row in providers) else (
            providers[0]["key"] if providers else "")
        return {"enabled": bool(config.get("token_hash")), "provider": selected,
                "active_provider": preferred, "available": self.downloads.available,
                "min_resolution": self.preferences["min_resolution"],
                "edition_keywords": list(self.preferences["edition_keywords"]), **catalog,
                "userscript": {"version": release["version"],
                               "minimum_version": release.get("bridge_min_version", release["version"]),
                               "install_url": release.get("install_url", "/integrations/peach-jav.user.js")},
                "sites": [{key: site[key] for key in ("id", "label", "kind", "domains", "mode")}
                          for site in source_sites()]}

    def configure(self, body: dict) -> dict:
        action = body.get("action")
        if action not in {"enable", "rotate", "disable", "preferences"}:
            raise ValueError("请选择启用、更新令牌或关闭")
        if not self.downloads.available:
            raise ValueError("浏览器添加只在允许修改数据库的设备上可用")
        if action == "preferences":
            self._save_preferences(body)
            return self.settings()
        provider = str(body.get("provider") or "")
        if action != "disable":
            self._ready(provider)
        token = None
        with self._lock:
            if action == "disable":
                self.credentials.clear(CREDENTIAL)
                for code, row in self.rows.items():
                    if row["state"] in ACTIVE and code not in self._submitting:
                        row.update(state="failed", message="浏览器添加已关闭")
                self._save()
            else:
                token = secrets.token_urlsafe(32)
                self.credentials.save(CREDENTIAL, {
                    "token_hash": hashlib.sha256(token.encode()).hexdigest(), "provider": provider})
        return {**self.settings(), **({"token": token} if token else {})}

    def authorized(self, supplied: str) -> bool:
        try:
            expected = self._config().get("token_hash", "")
        except CredentialError:
            return False
        return bool(expected and supplied and len(supplied) <= 256 and hmac.compare_digest(
            expected, hashlib.sha256(supplied.encode()).hexdigest()))

    def _ready(self, provider: str, *, remote=True):
        if not self.downloads.available:
            raise ValueError("浏览器添加只在允许修改数据库的设备上可用")
        if remote:
            state = next((row for row in self.downloads.channel_snapshot()["providers"] if row["key"] == provider), None)
        elif provider in {"115", "pikpak"}:
            state = self.downloads._provider_state(provider)
        else:
            state = {"target": provider.startswith("clouddrive:"), "configured": bool(
                self.downloads.config.clouddrive_address and "token" in
                self.credentials.describe(CLOUDDRIVE_CREDENTIAL)["fields"])}
        if not state or not state["configured"] or not state["target"]:
            raise ValueError("请先在下载渠道配置网盘账号和目标目录")

    def _existing(self, code: str) -> dict | None:
        with self.contract.database.read_connection() as connection:
            row = connection.execute(
                "SELECT id FROM asset WHERE normalise_code_key(code)=? AND medium='video' "
                "AND disposal IS NULL ORDER BY id LIMIT 1", (code,)).fetchone()
            tasks = connection.execute(
                "SELECT id,state,postprocess_state FROM download_task WHERE normalise_code_key(code)=? "
                "ORDER BY id DESC", (code,)).fetchall()
        if tasks and tasks[0]['state'] == INGESTED and tasks[0]['postprocess_state'] in {
                POSTPROCESS_PENDING, POSTPROCESS_QUEUED, POSTPROCESS_RUNNING, POSTPROCESS_FAILED}:
            return {'state': 'ingested', 'task_id': tasks[0]['id']}
        if row:
            return {"state": "owned", "asset_id": row[0]}
        for task in tasks:
            if task["state"] not in RESUBMITTABLE_STATES:
                return {"state": "ingested" if task["state"] == INGESTED else "submitted", "task_id": task["id"]}
        return None

    def status(self, value: object) -> dict:
        code = code_key(value)
        with self._lock:
            row = dict(self.rows.get(code, {}))
            if not row.get("task_id") and code not in self._submitting:
                row.update(self._existing(code) or {})
            task = self.downloads.store.get(row["task_id"]) if row.get("task_id") else None
            detail = {}
            if task is not None:
                state = "ingested" if task.state == INGESTED else (
                    "failed" if task.state in RESUBMITTABLE_STATES or task.blocked_at else "submitted")
                row.update(state=state, message=task.failure_detail or MESSAGES[state])
                if state == "failed":
                    detail["failure"] = task.failure or ""
                    # 旧任务把「列表里找不到」记成 no_source；从没被网盘列出过的按网盘问题处理。
                    legacy_unseen = (task.failure == "no_source" and never_seen(task)
                                     and (task.failure_detail or "").startswith(LEGACY_MISSING))
                    detail["cause"] = ("magnet" if task.blocked_at
                                       else "cloud" if legacy_unseen or task.failure in CLOUD_FAILURES
                                       else "magnet" if task.failure in MAGNET_FAILURES else "")
                if task.asset_id:
                    row["asset_id"] = task.asset_id
                progress = task.progress
                detail["download"] = {"state": task.state, "label": STATE_LABELS.get(task.state, ""),
                    "phase": "organize" if task.state == INGESTED else "ingest" if task.remote_done_at
                        or task.state in {"remote_done", "landed"} else "download",
                    "progress": min(1.0, max(0.0, progress)) if task.state in {REMOTE_RUNNING, "remote_done", "landed", INGESTED}
                        and type(progress) in (int, float) and math.isfinite(progress) else None,
                    "postprocess_state": task.postprocess_state,
                    "postprocess_label": task.postprocess_label,
                    "updated_at": task.updated_at}
                row.update(_postprocess_retry_status(task))
            state = row.get("state", "idle")
            return {"ok": True, "code": code, **row, **detail, "state": state,
                    "stage": "submitting" if code in self._submitting else state,
                    "message": row.get("message") or MESSAGES[state]}

    def retry_postprocess(self, value: object) -> dict:
        """重试这个番号入库后失败的整理，与任务中心的「重试整理」同一入口。"""
        status = self.status(value)
        task_id = status.get("task_id")
        if not task_id or status["state"] != "ingested" or status.get("download", {}).get("postprocess_state") != "failed":
            raise ValueError("这个番号没有失败的整理可以重试")
        self.downloads.retry_postprocess(int(task_id))
        return self.status(value)

    def active(self) -> dict:
        """进行中与最近结束的任务，供用户脚本的各个窗口共享同一份进度。

        进行中与脚本 `tracking()` 同一判据：排队、搜索、云下载，或已入库但整理未结束。
        最近 `RECENT_SECONDS` 内结束的任务带着终态留在列表里，脚本据此看到「进行中 → 完成」。
        浏览器添加（来处 `browser:`）的任务结束后一直留着，直到 `dismiss()` 确认。结束项带 `ended_key`
        与 `dismissed`：确认过的在 10 分钟内仍然列出、只标 `dismissed`，各窗口的本页状态照旧读得到。
        """
        cutoff = iso(time.time() - RECENT_SECONDS)
        tracked = sorted(TRACKED_STATES)
        organizing = (POSTPROCESS_PENDING, POSTPROCESS_QUEUED, POSTPROCESS_RUNNING)
        with self._lock:
            since, dismissed = self.ended["since"], set(self.ended["dismissed"])
        with self.contract.database.read_connection() as connection:
            codes = [row[0] for row in connection.execute(
                "SELECT normalise_code_key(code) AS key FROM download_task WHERE code IS NOT NULL AND code<>'' AND ("
                f"state IN ({','.join('?' * len(tracked))}) OR (state=? AND postprocess_state IN (?,?,?)) "
                "OR max(updated_at, coalesce(postprocessed_at,''), coalesce(finished_at,''))>=? "
                f"OR (origin LIKE 'browser:%' AND {ENDED_AT}>=?)) "
                "GROUP BY key ORDER BY max(id) DESC LIMIT ?",
                (*tracked, INGESTED, *organizing, cutoff, since, ACTIVE_LIMIT))]
        with self._lock:
            queued = [code for code, row in self.rows.items() if row["state"] in ACTIVE or code in self._submitting]
        items = []
        for code in dict.fromkeys([*queued, *codes]):
            try:
                status = self.status(code)
            except ValueError:
                continue
            if status["state"] == "idle":
                continue
            task = self.downloads.store.get(status["task_id"]) if status.get("task_id") else None
            if task is not None and task.state not in TRACKED_STATES and not (
                    task.state == INGESTED and task.postprocess_state in organizing):
                ended_at = task.postprocessed_at or task.finished_at or task.updated_at
                key = f"{task.id}@{ended_at}"
                acknowledged = ended_at < since or key in dismissed
                recent = max(task.updated_at or "", task.postprocessed_at or "", task.finished_at or "") >= cutoff
                if not recent and (acknowledged or not (task.origin or "").startswith("browser:")):
                    continue
                status.update(ended_key=key, dismissed=acknowledged)
            items.append(status)
        return {"ok": True, "items": items[:ACTIVE_LIMIT]}

    def add(self, body: dict) -> dict:
        code = code_key(body.get("code"))
        if body.get("manual") is True:
            if body.get("source_url") not in (None, ""):
                raise ValueError("手动添加不接受来源网页地址")
            page = ""
        else:
            page = source_page(body.get("source_url"))
        with self._lock:
            config = self._config()
            if not config.get("token_hash"):
                raise ValueError("请先启用浏览器添加")
            status = self.status(code)
            if status["state"] in ACTIVE | {"owned", "submitted", "ingested"}:
                return status
            if body.get("switch") not in (None, False, True):
                raise ValueError("换磁力参数无效")
            # 换磁力：把上一次提交的磁力记入跳过名单，重新搜索时取下一个。
            previous = self.rows.get(code, {})
            skip = list(previous.get("skip", ()))
            if body.get("switch") is True and previous.get("task_id"):
                task = self.downloads.store.get(previous["task_id"])
                if task is not None and task.info_hash and task.info_hash not in skip:
                    skip.append(task.info_hash)
            self._ready(config.get("provider", ""), remote=False)
            if code not in self.rows and len(self.rows) >= 200:
                completed = next((key for key, row in self.rows.items() if row["state"] not in ACTIVE), None)
                if completed is None:
                    raise ValueError("添加队列已满，请等待当前任务结束")
                del self.rows[completed]
            self.rows[code] = {"state": "queued", "provider": config["provider"], "source_url": page,
                               **({"skip": skip[-20:]} if skip else {})}
            self._save()
            self._wake.set()
            return self.status(code)

    def process_one(self) -> bool:
        with self._lock:
            if self._stop.is_set() or not self.downloads.available or not self._config().get("token_hash"):
                return False
            code = next((key for key, row in self.rows.items() if row["state"] == "queued"
                         and (not row.get('retry_at') or parse_iso(row['retry_at']) <= self.downloads.clock())), None)
            if code is None:
                return False
            row = self.rows[code]
            existing = self._existing(code)
            if existing:
                row.update(existing)
                self._save()
                return True
            row["state"] = "searching"
            row.pop('retry_at', None)
            self._save()
            provider = row["provider"]
        try:
            self._ready(provider)
            skip = list(row.get("skip", ()))
            preferences = self.preferences
            result = self.search(self.contract, {
                "code": code, "goal": "quality",
                "min_resolution": preferences["min_resolution"],
                "edition_keywords": list(preferences["edition_keywords"]),
                **({"skip": skip} if skip else {}),
            })
            candidate = _download_candidate(result.get("items", ()), code, frozenset(row.get("skip", ())))
            should_submit = False
            with self._lock:
                if row["state"] != "searching" or not self._config().get("token_hash"):
                    return True
                elif self._stop.is_set():
                    row["state"] = "queued"
                elif existing := self._existing(code):
                    row.update(existing)
                elif candidate is None:
                    self._empty_search_result(row, result)
                else:
                    self._submitting.add(code)
                    should_submit = True
                self._save()
            if should_submit:
                try:
                    submitted = submit_offline_download(
                        self.downloads, magnet=candidate["uri"], provider=provider, code=code,
                        origin="browser:" + (row["source_url"] or "manual"), dedupe_code=True)
                    task = submitted["task"]
                    with self._lock:
                        row.update(state="failed" if submitted["outcome"] in {"failed", "refused"} else "submitted",
                                   task_id=task["id"])
                        self._save()
                finally:
                    with self._lock:
                        self._submitting.discard(code)
        except Exception as error:
            LOGGER.error("JAV 浏览器添加失败：%s (%s)", code, type(error).__name__)
            with self._lock:
                self._submitting.discard(code)
                if row["state"] == "searching":
                    retry_error = RetryableTaskError(error.detail) if isinstance(error, DownloadError) and error.retryable else error
                    self._schedule_retry(row, retry_error)
                    self._save()
        return True

    def _empty_search_result(self, row: dict, result: dict) -> None:
        """搜索没有正片磁力时，分别结算无命中、可恢复故障与永久故障。"""
        failed = result.get('state') in {'error', 'unavailable'} or bool(result.get('error'))
        message = ('资源搜索暂不可用，请在 Peach 检查来源后重试' if failed
                   else NO_OTHER_MAGNET if row.get('skip') else MESSAGES['no_match'])
        after = result.get('retry_after')
        if failed and type(after) in (int, float) and math.isfinite(after) and after >= 0:
            self._schedule_retry(row, RetryableTaskError(message, after=after))
        else:
            row.update(state='failed' if failed else 'no_match', message=message)

    def _schedule_retry(self, row: dict, error: Exception) -> None:
        attempt = row.get('retry_attempt', 0)
        delay = retry_delay(error, attempt)
        if delay is None:
            prefix = f'自动重试 {attempt} 次后仍未完成；' if attempt == len(RETRY_DELAYS) else ''
            row.update(state='failed', message=prefix + '搜索或云下载提交失败，请在 Peach 检查来源和下载渠道后重试')
            row['retry_exhausted'] = attempt == len(RETRY_DELAYS)
            return
        row.update(state='queued', retry_attempt=attempt + 1, retry_limit=len(RETRY_DELAYS),
                   retry_at=iso(self.downloads.clock() + delay), message='暂时不可用，等待自动重试')

    def start(self):
        if not self.downloads.available or self._thread is not None:
            return
        self._stop.clear()
        self._thread = threading.Thread(target=self._loop, name="PeachJavBrowser", daemon=True)
        self._thread.start()

    def _loop(self):
        while not self._stop.is_set():
            self._wake.clear()
            if not self.process_one():
                self._wake.wait(30)

    def stop(self):
        self._stop.set()
        self._wake.set()
        if self._thread is not None:
            self._thread.join()
            self._thread = None
