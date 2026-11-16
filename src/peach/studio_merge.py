"""人工确认后的厂牌实体合并：搬走关联并把源名称统一到目标。"""
from __future__ import annotations

from . import entities
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
