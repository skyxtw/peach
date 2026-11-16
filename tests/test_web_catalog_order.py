"""每日轮换排序不能把旧模数的零点钉在首屏。"""
from __future__ import annotations

import sqlite3
import unittest
from contextlib import closing
from unittest.mock import patch

from peach import web_catalog


class DailyOrderTests(unittest.TestCase):
    def _order(self, day: str) -> str:
        with patch.object(web_catalog.time, "strftime", return_value=day):
            return web_catalog._catalog_order({"sort": "daily"})

    def _ids(self, sql: str, ids: tuple[int, ...]) -> list[int]:
        with closing(sqlite3.connect(":memory:")) as connection:
            connection.execute("CREATE TABLE asset(id INTEGER)")
            connection.executemany("INSERT INTO asset VALUES (?)", [(value,) for value in ids])
            return [row[0] for row in connection.execute(f"SELECT id FROM asset a ORDER BY {sql}")]

    def test_old_modulus_zero_point_is_not_always_first(self):
        ids = (99991, 7, 100, 200, 99990, 42)
        sql = self._order("20261116")
        self.assertNotEqual(self._ids(sql, ids)[0], 99991)
        self.assertEqual(self._ids(sql, ids), self._ids(sql, ids))

    def test_next_day_changes_the_daily_seed(self):
        self.assertNotEqual(self._order("20261116"), self._order("20261117"))
