"""资源搜索的只读 Web 契约；下载仍由云下载写入口接收。"""
from . import interface_text
from .coded_text import parallel
from .javdb_public import public_cache_scope
from .magnet_chain import HIGH_QUALITY, rank_candidates, search as direct_search
from .resource_search import Filters, Indexers, Search, preference_filters
from .user_messages import UserValueError

_SEARCH = Search()


def _merged_error(direct: dict, indexed: dict) -> dict:
    """两路都没给出结果时用后备索引器那一句报错，连同它的 code 一起交给界面；有结果时报错为空。"""
    if direct["items"] or indexed.get("ok"):
        return {"error": ""}
    return {"error": indexed.get("error", ""),
            **{key: indexed[key] for key in ("error_code", "error_params") if key in indexed}}


def _rank_with_preferences(combined, warnings, filters, min_resolution, edition_keywords):
    """按用户偏好挑候选：先按最低清晰度过滤（全不达标就退回不限），再按版本关键词排序。"""
    if min_resolution:
        qualified = [row for row in combined if int(row.get("resolution") or 0) >= min_resolution]
        if qualified:
            combined = qualified
        else:
            warnings.append(interface_text.text("server:labels.resourceSearch.resolutionFallback",
                                               {"min": min_resolution}))
    return rank_candidates(combined, filters.goal, edition_keywords=tuple(edition_keywords)), warnings


def _manko_hd_shortcut(direct: dict, skip, edition_keywords) -> bool:
    """第一来源给出高清结果时能否直接结束；有版本偏好或换磁力时都必须把后备来源查完。"""
    return bool(
        not edition_keywords
        and not skip
        and direct["items"]
        and direct["items"][0]["source"] == "manko.fun"
        and direct["items"][0]["resolution"] >= HIGH_QUALITY
    )


def _preferred_in_items(items, keywords) -> bool:
    """候选里是否已有标题命中用户版本优先词的条目，命中就不必再问后备索引器。"""
    return bool(keywords) and any(
        keyword in str(row.get("name") or "").casefold()
        for row in items for keyword in keywords)


def q_resource_search(contract, args) -> dict:
    service = getattr(contract, "downloads", None)
    if service is None:
        raise UserValueError("api.resourceSearch.downloadsDisabled")
    try:
        filters = Filters(min_size=int(args.get("min_size") or 0),
                          max_size=int(args.get("max_size") or 1024 ** 4),
                          goal=str(args.get("goal") or "quality"))
    except (TypeError, OverflowError):
        raise UserValueError("api.resourceSearch.invalidSizeRange") from None
    min_resolution, edition_keywords = preference_filters(args)
    with contract.database.read_connection() as connection:
        blocked = [row[0] for row in connection.execute(
            "SELECT info_hash FROM download_task WHERE blocked_at IS NOT NULL")]
    # 浏览器添加换磁力时传入已失败的 infohash：它们和违规拦截一样不再作为候选，
    # 而且不能在 manko.fun 那一步短路——被跳过的往往正是那条高清结果，短路会让其他来源一条都不查。
    skip = [str(value) for value in args.get("skip") or () if isinstance(args.get("skip"), (list, tuple))]
    excluded = set(blocked) | set(skip)
    code = str(args.get("code") or "")
    with public_cache_scope(contract.cover_root.parent / 'jav-public'):
        direct = direct_search(
            contract.follow_secrets_root, code, min_size=filters.min_size,
            max_size=filters.max_size, goal=filters.goal,
            stop_on_preferred=not skip and not edition_keywords,
            preferred_keywords=tuple(edition_keywords))
    direct["items"] = [row for row in direct["items"] if row["info_hash"] not in excluded]
    # 有版本优先关键词时必须把后备来源也查完，不能因为 manko.fun 的一条高清结果
    # 就短路：用户明确想要的 Reducing Mosaic 等版本往往正在 sukebei 上，而不是第一来源。
    if _manko_hd_shortcut(direct, skip, edition_keywords):
        return {"ok": True, "state": "ready", **direct}
    keywords = tuple(str(word).strip().casefold() for word in edition_keywords if str(word).strip())
    if _preferred_in_items(direct["items"], keywords):
        indexed = {"ok": True, "state": "ready", "items": [], "warnings": [], "error": ""}
    else:
        indexed = _SEARCH.run(Indexers(service.credentials).load(), code, filters, sorted(excluded))
    combined = list(direct["items"])
    for row in indexed.get("items", ()):
        combined.append({
            **row, "size_text": "", "files": "", "file_count": 0, "file_list": [],
            "promo_files": 0, "source_url": "", "watermark_check": "pending",
        })
    warnings = direct["warnings"] + list(indexed.get("warnings") or ())
    ranked, warnings = _rank_with_preferences(combined, warnings, filters, min_resolution, edition_keywords)
    return {
        "ok": bool(direct["items"]) or indexed.get("ok", False),
        "state": "ready" if direct["items"] or indexed.get("state") == "ready" else indexed.get("state", "error"),
        "items": ranked,
        "warnings": warnings,
        "filters": {"min_resolution": min_resolution, "edition_keywords": edition_keywords},
        **parallel("warning", warnings),
        "trace": direct["trace"] + (["indexer fallback: queried"] if indexed.get("state") != "unavailable" else []),
        "next_sources": direct["next_sources"], "reference_only": direct["reference_only"],
        # 后备索引器答复了也补不上直连来源没查成的那部分：浏览器添加据此等来源恢复，不记成无资源。
        "unfetched_sources": list(direct.get("unfetched_sources") or ()),
        **_merged_error(direct, indexed),
        "retry_after": max((value for value in (direct.get('retry_after'), indexed.get('retry_after'))
                            if value is not None), default=None),
    }
