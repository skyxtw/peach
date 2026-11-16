#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Read-only missing-performer diagnostics. Default: both scopes; --code [code]: one asset."""
from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT_ROOT / 'src'
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from peach.config import DATABASE_PATH
from peach.missing_performers import (
    DEFAULT_CODE, diagnose, format_diagnosis, format_summary, summary,
)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Read-only missing-performer diagnostics (no writes)')
    parser.add_argument('--db', type=Path, default=DATABASE_PATH)
    parser.add_argument('--studio', default='')
    parser.add_argument('--prefix', default='')
    parser.add_argument('--limit', type=int, default=20)
    parser.add_argument('--active', action='store_true', help='Exclude vanished records')
    parser.add_argument('--code', nargs='?', const=DEFAULT_CODE, default=None,
                        help=f'One code; omit the value for {DEFAULT_CODE}')
    parser.add_argument('--json', action='store_true')
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    path = args.db.resolve()
    if not path.is_file():
        raise SystemExit(f'ledger not found: {path}')
    connection = sqlite3.connect(f'file:{path.as_posix()}?mode=ro', uri=True)
    connection.row_factory = sqlite3.Row
    try:
        if args.code is not None:
            report = diagnose(connection, args.code)
        else:
            report = summary(connection, studio=args.studio, prefix=args.prefix, limit=args.limit,
                              active_only=args.active)
    finally:
        connection.close()
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    elif args.code is not None:
        print(format_diagnosis(report))
    else:
        print(format_summary(report, sample=args.limit))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
