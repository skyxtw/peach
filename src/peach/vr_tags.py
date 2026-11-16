"""本地 VR 标签补救：只做只读审计与 dry-run 计划（ADR-0052 的写入路径留给下一轮）。

规则只接受两类证据：
1. 番号前缀在本文件列出的高置信 VR 厂牌里；
2. 标题、文件夹名或文件名带完整的 VR 标记（【VR】、[8KVR]、［ＶＲ180］ 等）。

任意文件名里的 `VR` 子串不算证据。已有 VR 标签（asset_tag 或 asset_entity 的 tag）的行
直接排除。这里不提供 apply，调用方只应使用只读连接。
"""
from __future__ import annotations

import re
from collections import Counter, defaultdict
from pathlib import PureWindowsPath

#: 本轮启用的高置信 VR 厂牌前缀。其余在预览库里带 VR 字样的前缀只列进 discovered，
#: 不自动进入候选；SAVR/PXVR/JUVR 等下一轮评审后再决定是否扩表。
VR_PREFIXES = frozenset({
    'SIVR', 'VRKM', 'DVRT', 'CAVR', 'KAVR', 'SVR', 'VRB', 'MDVR', 'IPVR',
})
VR_SOURCE = 'auto:vr-tags'
VR_TAG = 'VR'

#: 必须由标题分隔符括起来，或者整词是 8KVR/VR180；不能靠路径里的 VR 子串命中。
_VR_TITLE = re.compile(
    r'(?:【|\[|\(|（|［)\s*(?:(?:[48]\s*K\s*)?(?:VR|ＶＲ)(?:\s*180)?)\s*(?:】|\]|\)|）|］)'
    r'|\b(?:8KVR|VR180)\b',
    re.I,
)


def code_prefix(code: str | None) -> str:
    """番号前缀；SIVR-001 与 SIVR001 都归 SIVR。"""
    match = re.match(r'^\s*([A-Za-z]+)', str(code or ''))
    return match.group(1).upper() if match else ''


def is_vr_title(text: str | None) -> bool:
    """标题/目录名里的完整 VR 标记；不接受普通的 VR 子串。"""
    return bool(_VR_TITLE.search(str(text or '')))


def _title_texts(name: str | None, path: str | None, catalog_title: str | None):
    texts = [catalog_title, name]
    try:
        parent = PureWindowsPath(str(path or '')).parent.name
    except (TypeError, ValueError):
        parent = ''
    if parent:
        texts.append(parent)
    return [str(value) for value in texts if value]


def _row_title_evidence(row) -> bool:
    return any(is_vr_title(value) for value in _title_texts(
        row['name'], row['path'], row['catalog_title']))


def _title_only_text(row) -> str:
    return next((value for value in _title_texts(
        row['name'], row['path'], row['catalog_title']) if is_vr_title(value)), '')


def _rows(connection):
    return connection.execute(
        'SELECT a.id,a.code,a.name,a.path,a.catalog_title,a.studio,'
        ' EXISTS(SELECT 1 FROM asset_tag t WHERE t.asset_id=a.id AND t.tag=?) AS tag_row,'
        ' EXISTS(SELECT 1 FROM asset_entity ae JOIN entity e ON e.id=ae.entity_id'
        '        WHERE ae.asset_id=a.id AND ae.role=\'tag\' AND e.canonical_name=?) AS tag_entity'
        ' FROM asset a WHERE a.medium=\'video\' AND a.code IS NOT NULL AND a.code<>\'\''
        ' ORDER BY a.id', (VR_TAG, VR_TAG)).fetchall()


def plan(connection, *, batch: str | None = None, chunk_size: int = 200,
         generated_at: str | None = None) -> dict:
    """只读扫描并返回 dry-run 计划；调用方负责把连接设成只读。"""
    if chunk_size < 1:
        raise ValueError('chunk_size 必须大于 0')
    batch = batch or f'{VR_SOURCE}@dry-run'
    if not batch.startswith(VR_SOURCE + '@'):
        raise ValueError(f'批次号必须以 {VR_SOURCE}@ 开头')
    rows = _rows(connection)
    by_prefix = defaultdict(lambda: {'assets': 0, 'tagged': 0, 'missing': 0, 'title_hit': 0})
    discovered = defaultdict(lambda: {'assets': 0, 'tagged': 0, 'missing': 0, 'title_hit': 0})
    candidates = []
    title_only = []
    title_only_by_prefix = Counter()
    false_substring = 0
    for row in rows:
        prefix = code_prefix(row['code'])
        tagged = bool(row['tag_row'] or row['tag_entity'])
        title_hit = _row_title_evidence(row)
        if prefix in VR_PREFIXES:
            item = by_prefix[prefix]
            item['assets'] += 1
            item['tagged'] += int(tagged)
            if tagged:
                continue
            item['missing'] += 1
            item['title_hit'] += int(title_hit)
            candidates.append({
                'asset_id': int(row['id']), 'code': row['code'], 'prefix': prefix,
                'studio': row['studio'], 'name': row['name'], 'path': row['path'],
                'catalog_title': row['catalog_title'], 'title_evidence': title_hit,
                'title_text': _title_only_text(row) if title_hit else '',
                'evidence': ['prefix'] + (['title'] if title_hit else []),
            })
        elif not tagged and title_hit:
            title_only.append({
                'asset_id': int(row['id']), 'code': row['code'], 'prefix': prefix,
                'studio': row['studio'], 'name': row['name'], 'path': row['path'],
                'catalog_title': row['catalog_title'], 'title_text': _title_only_text(row),
            })
            title_only_by_prefix[prefix] += 1
            if ('VR' in prefix) or ('VR' in str(row['studio'] or '').upper()):
                item = discovered[prefix]
                item['assets'] += 1
                item['tagged'] += int(tagged)
                item['missing'] += int(not tagged)
                item['title_hit'] += int(title_hit)
        elif not tagged and (('VR' in prefix) or ('VR' in str(row['studio'] or '').upper())):
            item = discovered[prefix]
            item['assets'] += 1
            item['tagged'] += int(tagged)
            item['missing'] += int(not tagged)
            item['title_hit'] += int(title_hit)
        elif not tagged and re.search(r'vr', f"{row['name'] or ''} {row['path'] or ''}", re.I):
            false_substring += 1

    chunks = []
    if candidates:
        for index in range(0, len(candidates), chunk_size):
            chunk = candidates[index:index + chunk_size]
            chunk_batch = f'{batch}:{index // chunk_size + 1:03d}'
            for item in chunk:
                item['batch'] = chunk_batch
            chunks.append({'batch': chunk_batch, 'count': len(chunk),
                           'asset_ids': [item['asset_id'] for item in chunk]})
    summary = {
        'scanned': len(rows),
        'prefix_assets': sum(item['assets'] for item in by_prefix.values()),
        'prefix_tagged': sum(item['tagged'] for item in by_prefix.values()),
        'prefix_missing': len(candidates),
        'prefix_missing_title_evidence': sum(1 for item in candidates if item['title_evidence']),
        'prefix_missing_prefix_only': sum(1 for item in candidates if not item['title_evidence']),
        'title_only_outside_prefix': len(title_only),
        'discovered_prefixes': len(discovered),
        'discovered_assets': sum(item['assets'] for item in discovered.values()),
        'discovered_missing': sum(item['missing'] for item in discovered.values()),
        'false_vr_substring': false_substring,
        'chunks': len(chunks),
    }
    return {
        'generated_at': generated_at or '',
        'source': VR_SOURCE, 'batch': batch, 'chunk_size': chunk_size,
        'prefixes': sorted(VR_PREFIXES),
        'summary': summary,
        'by_prefix': {key: value for key, value in sorted(by_prefix.items())},
        'by_discovered_prefix': {key: value for key, value in sorted(discovered.items())},
        'chunks': chunks,
        'candidates': candidates,
        'title_only': title_only,
        'title_only_by_prefix': dict(sorted(title_only_by_prefix.items())),
    }


def format_summary(report: dict, *, sample: int = 8) -> str:
    """命令行的紧凑摘要；详情用 --json。"""
    summary = report['summary']
    lines = [
        f"VR dry-run：扫描 {summary['scanned']} 条视频，已知 VR 前缀 "
        f"{summary['prefix_assets']} 条，已有 VR 标签 {summary['prefix_tagged']} 条，"
        f"缺标签 {summary['prefix_missing']} 条（标题证据 "
        f"{summary['prefix_missing_title_evidence']}，仅前缀 "
        f"{summary['prefix_missing_prefix_only']}）。",
        f"仅标题证据的前缀外候选 {summary['title_only_outside_prefix']} 条；"
        f"待评审 VR 线索前缀 {summary['discovered_prefixes']} 个（缺标签 "
        f"{summary['discovered_missing']} 条）；普通 VR 子串不命中 "
        f"{summary['false_vr_substring']} 条。",
        f"建议批次 {report['batch']}，{summary['chunks']} 组；本命令只读，不写账本。",
    ]
    for prefix, item in report['by_prefix'].items():
        lines.append(f"  {prefix}: {item['assets']} 条，已有 {item['tagged']}，"
                     f"缺 {item['missing']}（标题 {item['title_hit']}）")
    for prefix, item in list(report['by_discovered_prefix'].items())[:sample]:
        lines.append(f"  待评审 {prefix}: {item['assets']} 条，已有 {item['tagged']}，"
                     f"缺 {item['missing']}（标题 {item['title_hit']}）")
    for item in report['candidates'][:sample]:
        title = ' / 标题证据' if item['title_evidence'] else ' / 仅前缀'
        lines.append(f"  #{item['asset_id']} {item['code']} {title}")
    if report['title_only'][:sample]:
        lines.append('  前缀外标题证据样例：')
        for item in report['title_only'][:sample]:
            lines.append(f"  #{item['asset_id']} {item['code']} {item['title_text']}")
    return '\n'.join(lines)
