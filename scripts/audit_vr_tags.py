#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""VR 标签补救的 dry-run 审计。默认只读，不提供 apply；写入要下一轮按 ADR-0052 接。"""
from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT_ROOT / 'src'
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from peach.config import DATABASE_PATH
from peach.vr_tags import format_summary, plan


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='VR 标签补救 dry-run（默认零写入）')
    parser.add_argument('--db', type=Path, default=DATABASE_PATH)
    parser.add_argument('--batch', default=None, help='预期的批次号；默认 auto:vr-tags@dry-run')
    parser.add_argument('--chunk-size', type=int, default=200)
    parser.add_argument('--active', action='store_true', help='排除 vanished（回收站/消失）')
    parser.add_argument('--sample', type=int, default=8)
    parser.add_argument('--json', action='store_true', help='输出完整计划')
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    path = args.db.resolve()
    if not path.is_file():
        raise SystemExit(f'账本不存在：{path}')
    # 只读 URI：这条命令没有写分支，也不会顺手创建 -wal/-shm。
    connection = sqlite3.connect(f'file:{path.as_posix()}?mode=ro', uri=True)
    connection.row_factory = sqlite3.Row
    try:
        now = datetime.now(timezone.utc)
        generated = now.isoformat()
        batch = args.batch or f"auto:vr-tags@{now.strftime('%Y%m%dT%H%M%S')}"
        report = plan(connection, batch=batch, chunk_size=args.chunk_size,
                      generated_at=generated, active_only=args.active)
    finally:
        connection.close()
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(format_summary(report, sample=args.sample))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
