"""资源搜索的只读 Web 契约；下载仍由云下载写入口接收。"""
from .javdb_public import public_cache_scope
from .magnet_chain import HIGH_QUALITY, rank_candidates, search as direct_search
from .resource_search import Filters, Indexers, Search, preference_filters

_SEARCH = Search()


def q_resource_search(contract, args) -> dict:
    service = getattr(contract, "downloads", None)
    if service is None:
        raise ValueError("云下载服务没有启用")
    try:
        filters = Filters(min_size=int(args.get("min_size") or 0),
                          max_size=int(args.get("max_size") or 1024 ** 4),
                          goal=str(args.get("goal") or "quality"))
    except (TypeError, OverflowError):
        raise ValueError("体积区间必须是字节数") from None
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
            max_size=filters.max_size, goal=filters.goal, stop_on_preferred=not skip)
    direct["items"] = [row for row in direct["items"] if row["info_hash"] not in excluded]
    # manko.fun 给出高清候选时按用户指定的优先级短路，不再消耗后备索引器请求。
    if not skip and direct["items"] and direct["items"][0]["source"] == "manko.fun" \
            and direct["items"][0]["resolution"] >= HIGH_QUALITY:
        return {"ok": True, "state": "ready", **direct}
    indexed = _SEARCH.run(Indexers(service.credentials).load(), code, filters, sorted(excluded))
    combined = list(direct["items"])
    for row in indexed.get("items", ()):
        combined.append({
            **row, "size_text": "", "files": "", "file_count": 0, "file_list": [],
            "promo_files": 0, "source_url": "", "watermark_check": "pending",
        })
    warnings = list(direct["warnings"]) + list(indexed.get("warnings") or ())
    if min_resolution:
        qualified = [row for row in combined if int(row.get("resolution") or 0) >= min_resolution]
        if qualified:
            combined = qualified
        else:
            warnings.append(f"没有 ≥{min_resolution}p 的资源，已按不限清晰度排序")
    return {
        "ok": bool(direct["items"]) or indexed.get("ok", False),
        "state": "ready" if direct["items"] or indexed.get("state") == "ready" else indexed.get("state", "error"),
        "items": rank_candidates(combined, filters.goal, edition_keywords=tuple(edition_keywords)),
        "warnings": warnings,
        "filters": {"min_resolution": min_resolution, "edition_keywords": edition_keywords},
        "trace": direct["trace"] + (["索引器后备：已查询"] if indexed.get("state") != "unavailable" else []),
        "next_sources": direct["next_sources"], "reference_only": direct["reference_only"],
        "error": "" if direct["items"] or indexed.get("ok") else indexed.get("error", ""),
        "retry_after": max((value for value in (direct.get('retry_after'), indexed.get('retry_after'))
                            if value is not None), default=None),
    }
