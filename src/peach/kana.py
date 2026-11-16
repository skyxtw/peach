"""五十音行归并：资料站读音首字 → a/k/s/t/n/h/m/y/r/w/other。

`performer_profile.kana` 约覆盖三分之二，写法有平假名、片假名与罗马字。索引页只需要
把认得出的读音归到行；空值、罗马字、汉字等认不出的一律 `other`，不把「没有读音」
混进某个假名组。前端 `frontend/src/identity-filter.ts` 的 `KANA_ROWS` 与这里的键、
顺序必须一致。
"""
from __future__ import annotations

import unicodedata

#: 行键与顺序；`other` 收空值与认不出的读音。
KANA_ROWS = ("a", "k", "s", "t", "n", "h", "m", "y", "r", "w", "other")

#: 一行一串：基础假名、浊音／半浊音、小写与历史假名都并到本行。
_ROWS: dict[str, str] = {}
for _row, _characters in (
    ("a", "あぁいぃうぅゔえぇおぉ"),
    ("k", "かゕがきぎくぐけゖげこご"),
    ("s", "さざしじすずせぜそぞ"),
    ("t", "たちっつづてでとど"),
    ("n", "なにぬねの"),
    ("h", "はばぱひびぴふぶぷへべぺほぼぽ"),
    ("m", "まみむめも"),
    ("y", "やゃゆゅよょ"),
    ("r", "らりるれろ"),
    ("w", "わゎゐゑをん"),
):
    for _character in _characters:
        _ROWS[_character] = _row
del _row, _characters, _character


def normalize_kana(value) -> str:
    """NFKC、去首尾空白，片假名转平假名；返回可比较的首字，空串表示没有读音。"""
    text = unicodedata.normalize("NFKC", str(value or "")).strip()
    if not text:
        return ""
    first = text[0]
    code = ord(first)
    # 全角片假名区间；NFKC 已把半角片假名并进来。
    if 0x30A1 <= code <= 0x30F6:
        first = chr(code - 0x60)
    # ヷヸヹヺ 不在连续区间里（减 0x60 会落到组合浊点），按 わ行历史假名归。
    elif 0x30F7 <= code <= 0x30FA:
        first = chr(0x308F + code - 0x30F7)
    return first


def kana_row(value) -> str:
    """读音首字归行；空值、罗马字、汉字等认不出的都归 `other`。"""
    return _ROWS.get(normalize_kana(value), "other")
