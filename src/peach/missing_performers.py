"""缺演员诊断：只读统计、分组与单条现状，不猜演员、不写账本。"""
from __future__ import annotations

import json

from . import metadata_routes
from .field_owners import parse_owners


NO_PERFORMER = (
    "NOT EXISTS (SELECT 1 FROM asset_entity ae JOIN entity e ON e.id=ae.entity_id "
    "WHERE ae.asset_id=a.id AND ae.role='performer' AND e.kind='performer')"
)
VIDEO = "a.medium='video'"
CODE = "COALESCE(NULLIF(TRIM(a.code),''),'')<>''"
RELEASE = "COALESCE(NULLIF(TRIM(a.release_date),''),'')<>''"
PREFIX = ("CASE WHEN instr(a.code,'-')>0 "
          "THEN upper(substr(a.code,1,instr(a.code,'-')-1)) ELSE upper(a.code) END")
STUDIO = "COALESCE(NULLIF(TRIM(a.studio),''),'（未知）')"
DEFAULT_CODE = 'ROYD-190'


def _count(connection, where: str, params=()) -> int:
    return int(connection.execute(
        f'SELECT count(*) FROM asset a WHERE {where}', tuple(params)).fetchone()[0])


def summary(connection, *, studio: str = '', prefix: str = '', limit: int = 20) -> dict:
    """两个口径的全局计数，以及按 studio/番号前缀的分组；filters 只收窄分组与列表。"""
    if limit < 1:
        raise ValueError('limit 必须大于 0')
    missing_all = _count(connection, f'{VIDEO} AND {NO_PERFORMER}')
    code_all = _count(connection, f'{VIDEO} AND {CODE}')
    code_date_all = _count(connection, f'{VIDEO} AND {CODE} AND {RELEASE}')
    missing_code = _count(connection, f'{VIDEO} AND {CODE} AND {NO_PERFORMER}')
    missing_code_date = _count(connection, f'{VIDEO} AND {CODE} AND {RELEASE} AND {NO_PERFORMER}')
    active = "COALESCE(a.disposal,'')<>'vanished'"
    missing_all_active = _count(connection, f'{VIDEO} AND {NO_PERFORMER} AND {active}')
    missing_code_date_active = _count(connection, f'{VIDEO} AND {CODE} AND {RELEASE} AND {NO_PERFORMER} AND {active}')

    where = f'{VIDEO} AND {CODE} AND {RELEASE} AND {NO_PERFORMER}'
    params: list = []
    if studio:
        where += ' AND ' + STUDIO + '=? COLLATE NOCASE'
        params.append(studio)
    if prefix:
        where += ' AND ' + PREFIX + '=? COLLATE NOCASE'
        params.append(prefix.upper())

    by_studio = connection.execute(
        f'SELECT {STUDIO} studio,count(*) n FROM asset a WHERE {where} '
        'GROUP BY 1 ORDER BY n DESC,studio LIMIT ?', [*params, limit]).fetchall()
    by_prefix = connection.execute(
        f'SELECT {PREFIX} prefix,count(*) n FROM asset a WHERE {where} '
        'GROUP BY 1 ORDER BY n DESC,prefix LIMIT ?', [*params, limit]).fetchall()
    all_by_studio = connection.execute(
        f'SELECT {STUDIO} studio,count(*) n FROM asset a WHERE {VIDEO} AND {NO_PERFORMER} '
        'GROUP BY 1 ORDER BY n DESC,studio LIMIT ?', (limit,)).fetchall()
    rows = connection.execute(
        f'SELECT a.id,a.code,a.name,a.catalog_title,a.studio,a.release_date,{PREFIX} prefix '
        f'FROM asset a WHERE {where} ORDER BY a.id LIMIT ?', [*params, limit]).fetchall()
    filtered = _count(connection, where, params)
    return {
        'counts': {
            'videos': _count(connection, VIDEO),
            'with_code': code_all,
            'with_code_and_release': code_date_all,
            'missing_all_videos': missing_all,
            'missing_all_videos_active': missing_all_active,
            'missing_with_code': missing_code,
            'missing_with_code_and_release': missing_code_date,
            'missing_with_code_and_release_active': missing_code_date_active,
            'filtered_missing_with_code_and_release': filtered,
        },
        'filters': {'studio': studio, 'prefix': prefix.upper() if prefix else '', 'limit': limit},
        'by_studio': [dict(row) for row in by_studio],
        'by_prefix': [dict(row) for row in by_prefix],
        'all_by_studio': [dict(row) for row in all_by_studio],
        'rows': [dict(row) for row in rows],
    }


def _asset_rows(connection, code: str):
    return connection.execute(
        'SELECT a.id,a.code,a.name,a.path,a.catalog_title,a.studio,a.release_date,'
        ' a.field_owners,a.location '
        'FROM asset a WHERE a.medium=\'video\' AND upper(a.code)=upper(?) ORDER BY a.id',
        (code,)).fetchall()


def _performer_entities(connection, asset_id: int) -> list[dict]:
    return [dict(row) for row in connection.execute(
        'SELECT e.id,e.canonical_name,e.kind,ae.role,ae.source FROM asset_entity ae '
        'JOIN entity e ON e.id=ae.entity_id WHERE ae.asset_id=? AND ae.role=\'performer\' '
        'ORDER BY e.canonical_name', (asset_id,))]


def _tags(connection, asset_id: int) -> list[dict]:
    return [dict(row) for row in connection.execute(
        'SELECT tag,source FROM asset_tag WHERE asset_id=? ORDER BY tag', (asset_id,))]


def _reviews(connection, code: str) -> list[dict]:
    return [dict(row) for row in connection.execute(
        "SELECT category,item_key,status,note,updated_at FROM review_decision "
        "WHERE category='metadata_fields' AND item_key LIKE ? ORDER BY item_key",
        (f'{code}:%',))]


def _discoveries(connection, code: str) -> list[dict]:
    try:
        rows = connection.execute(
            'SELECT title,performers,studio,release_date,discovered_at '
            'FROM feed_discovery WHERE upper(code)=upper(?) ORDER BY id', (code,)).fetchall()
    except Exception:
        return []
    return [dict(row) for row in rows]


def diagnose(connection, code: str = DEFAULT_CODE) -> dict:
    """给定番号的只读现状；不根据标题推断演员。"""
    code = str(code or DEFAULT_CODE).strip().upper()
    assets = [dict(row) for row in _asset_rows(connection, code)]
    if not assets:
        return {'code': code, 'found': False, 'diagnosis': 'asset_not_found'}
    primary = assets[0]
    performers = _performer_entities(connection, primary['id'])
    reviews = _reviews(connection, code)
    discoveries = _discoveries(connection, code)
    tags = _tags(connection, primary['id'])
    owners = parse_owners(primary['field_owners'])
    observed = set(owners.values()) | {str(tag.get('source') or '') for tag in tags}
    performer_text = next((str(row.get('performers') or '').strip()
                           for row in discoveries if str(row.get('performers') or '').strip()), '')
    if performers:
        diagnosis = 'has_performer'
    elif performer_text:
        diagnosis = 'scraped_performer_text_not_reviewed'
    elif reviews:
        diagnosis = 'review_record_present_no_performer'
    else:
        diagnosis = 'no_performer_entity_no_review_record'
    route = metadata_routes.route_for_code(
        code, primary['path'], primary['name'], primary['studio'])
    content_type = metadata_routes.classify(code, primary['path'], primary['name'], primary['studio'])
    return {
        'code': code,
        'found': True,
        'assets': [dict(row) for row in assets],
        'primary_asset_id': int(primary['id']),
        'title': primary['catalog_title'],
        'studio': primary['studio'],
        'release_date': primary['release_date'],
        'tags': tags,
        'field_owners': owners,
        'performer_entities': performers,
        'review_decisions': reviews,
        'discoveries': discoveries,
        'observed_sources': sorted(value for value in observed if value),
        'route': {'content_type': content_type, 'sources': list(route)},
        'diagnosis': diagnosis,
        'title_used_to_guess_performer': False,
    }


def format_summary(report: dict, *, sample: int = 0) -> str:
    c = report['counts']
    lines = [
        f"视频 {c['videos']}，有番号 {c['with_code']}，有番号+发行日 {c['with_code_and_release']}。",
        f"无 performer：所有视频 {c['missing_all_videos']}（未消失 {c['missing_all_videos_active']}）；"
        f"有番号 {c['missing_with_code']}；有番号+发行日 {c['missing_with_code_and_release']}"
        f"（未消失 {c['missing_with_code_and_release_active']}，当前筛选 "
        f"{c['filtered_missing_with_code_and_release']}）。",
    ]
    if report['by_studio']:
        lines.append('缺演员 TOP studio：')
        for row in report['by_studio']:
            lines.append(f"  {row['studio']}: {row['n']}")
    if report['by_prefix']:
        lines.append('缺演员 TOP 番号前缀：')
        for row in report['by_prefix']:
            lines.append(f"  {row['prefix']}: {row['n']}")
    if sample and report['rows']:
        lines.append('样例：')
        for row in report['rows'][:sample]:
            lines.append(f"  #{row['id']} {row['code']} {row['studio'] or '（未知）'} {row['release_date'] or ''}")
    return '\n'.join(lines)


def format_diagnosis(report: dict) -> str:
    if not report.get('found'):
        return f"{report['code']}：账本里没有这条视频。"
    lines = [
        f"{report['code']}：asset #{report['primary_asset_id']}，诊断 {report['diagnosis']}",
        f"  title: {report['title'] or ''}",
        f"  studio: {report['studio'] or ''} / release_date: {report['release_date'] or ''}",
        f"  field_owners: {json.dumps(report['field_owners'], ensure_ascii=False)}",
        f"  tags: {', '.join(tag['tag'] for tag in report['tags']) or '（无）'}",
        f"  performer: {', '.join(e['canonical_name'] for e in report['performer_entities']) or '（无）'}",
        f"  review_decisions: {len(report['review_decisions'])} 条",
        f"  route: {report['route']['content_type']} -> {' > '.join(report['route']['sources']) or '（空）'}",
        f"  observed_sources: {', '.join(report['observed_sources']) or '（无）'}",
        '  标题没有用来猜演员。',
    ]
    return '\n'.join(lines)
