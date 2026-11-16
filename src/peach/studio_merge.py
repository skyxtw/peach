"""人工确认后的厂牌实体合并：搬走关联并把源名称统一到目标。"""
from __future__ import annotations

from . import entities, feeds
from .user_messages import UserValueError


def merge(contract, body) -> dict:
    target_value = body.get("target")
    source_value = body.get("source")
    if target_value in (None, "") or source_value in (None, ""):
        raise ValueError("target and source are required")
    with contract.database.write_transaction() as connection:
        def resolve(value):
            if isinstance(value, int) or (isinstance(value, str) and value.isdigit()):
                row = connection.execute("SELECT id,canonical_name,kind FROM entity WHERE id=?",
                                         (int(value),)).fetchone()
            else:
                rows = connection.execute(
                    "SELECT id,canonical_name,kind FROM entity WHERE kind='studio'"
                    " AND (canonical_name=? COLLATE NOCASE OR id IN ("
                    " SELECT entity_id FROM entity_alias WHERE alias=? COLLATE NOCASE)) LIMIT 2",
                    (str(value), str(value))).fetchall()
                if len(rows) != 1:
                    raise UserValueError("api.feeds.studioMergeAmbiguous")
                row = rows[0]
            if row is None or row["kind"] != "studio":
                raise UserValueError("api.feeds.studioOnly")
            return int(row["id"]), str(row["canonical_name"])

        target_id, target_name = resolve(target_value)
        source_id, source_name = resolve(source_value)
        moved = entities.merge_entity(connection, target_id=target_id, source_id=source_id,
                                      source_name=source_name, alias_source="user:studio-merge")
        assets = connection.execute("UPDATE asset SET studio=? WHERE studio=?",
                                    (target_name, source_name)).rowcount
        discoveries = connection.execute("UPDATE feed_discovery SET studio=? WHERE studio=?",
                                         (target_name, source_name)).rowcount
    contract.cache_bust()
    return {"ok": True, "target_id": target_id, "source_id": source_id,
            "target": target_name, "source": source_name,
            "assets": assets, "discoveries": discoveries, "moved": moved}


def duplicate_groups(connection) -> list[list[int]]:
    """按已知 DMM 厂牌名与规范化名称找重复 studio；返回每组实体 id。"""
    known = {}
    rows = connection.execute("SELECT id,canonical_name FROM entity WHERE kind='studio'").fetchall()
    names = {}
    for row in rows:
        names[int(row["id"])] = [str(row["canonical_name"] or "")]
    for row in connection.execute(
            "SELECT a.entity_id,a.alias FROM entity_alias a JOIN entity e ON e.id=a.entity_id"
            " WHERE e.kind='studio'"):
        names.setdefault(int(row["entity_id"]), []).append(str(row["alias"] or ""))
    by_key = {}
    for entity_id, aliases in names.items():
        for name in aliases:
            key = entities.studio_name_key(name)
            if key:
                by_key.setdefault(key, set()).add(entity_id)
    for ids in by_key.values():
        if len(ids) > 1:
            known.setdefault(frozenset(ids), None)
    for aliases in feeds.KNOWN_DMM_STUDIOS.values():
        ids = set()
        for name in aliases:
            ids |= by_key.get(entities.studio_name_key(name), set())
        if len(ids) > 1:
            known[frozenset(ids)] = None
    return [sorted(ids) for ids in known]


def duplicate_studios(contract) -> list[dict]:
    with contract.read_connection() as connection:
        return _describe_groups(connection, duplicate_groups(connection))


def _describe_groups(connection, groups: list[list[int]]) -> list[dict]:
    result = []
    for ids in groups:
        names = {int(row[0]): str(row[1]) for row in connection.execute(
            "SELECT id,canonical_name FROM entity WHERE id IN (" + ",".join("?" * len(ids)) + ")", ids)}
        counts = {}
        for entity_id in ids:
            count = connection.execute(
                "SELECT (SELECT count(*) FROM asset_entity WHERE entity_id=?)"
                " + (SELECT count(*) FROM asset WHERE studio=?)",
                (entity_id, names.get(entity_id, ""))).fetchone()[0]
            counts[entity_id] = count
        result.append({"target": max(ids, key=lambda entity_id: (counts[entity_id], -entity_id)),
                       "sources": [entity_id for entity_id in ids
                                   if entity_id != max(ids, key=lambda entity_id: (counts[entity_id], -entity_id))],
                       "names": names, "assets": counts})
    return result


def merge_duplicates(contract) -> dict:
    merged = []
    with contract.database.write_transaction() as connection:
        groups = _describe_groups(connection, duplicate_groups(connection))
        for group in groups:
            target = int(group["target"])
            target_name = group["names"][target]
            for source in group["sources"]:
                source_name = group["names"][source]
                moved = entities.merge_entity(connection, target_id=target, source_id=source,
                                              source_name=source_name, alias_source="user:studio-auto-merge")
                assets = connection.execute("UPDATE asset SET studio=? WHERE studio=?",
                                            (target_name, source_name)).rowcount
                connection.execute("UPDATE feed_discovery SET studio=? WHERE studio=?",
                                   (target_name, source_name))
                merged.append({"target": target, "source": source, "assets": assets, "moved": moved})
    if merged:
        contract.cache_bust()
    return {"ok": True, "merged": merged, "groups": len(groups)}

