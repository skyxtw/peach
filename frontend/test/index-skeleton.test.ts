/* 索引五页的进页骨架。
 *
 * 骨架里的字形走壳 `index.html` 那张 sprite（`<use href="#i-…">`），写了表里没有的名字不会报错，
 * 只是那一格空着：页签上「艺人」「卖家」写成 `user` 时，骨架里只剩「在线」带图标。 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { expect, it } from 'vitest';

import { indexParams, indexPlaceholderHtml, type IndexPageKind } from '../src/index-skeleton';
import { tagSkeletonHtml } from '../src/tag-skeleton';

const sprite = new Set(
  [...readFileSync(resolve(__dirname, '../../web/index.html'), 'utf8').matchAll(/<symbol id="i-([^"]+)"/g)]
    .map((match) => match[1]));

const PAGES: [IndexPageKind, string][] = [
  ['performers', ''], ['performers', '?scope=online'], ['creators', ''],
  ['studios', ''], ['agencies', ''], ['series', ''], ['tags', ''], ['tags', '?scope=online&view=cloud'],
];

it.each(['cloud', 'alphabet'])('%s 标签占位按页大小预留正文与分页', mode => {
  for (const pageSize of [50, 100, 200]) {
    const host = document.createElement('div');
    host.innerHTML = tagSkeletonHtml({ mode, pageSize });
    expect(host.querySelectorAll('[data-tag-skeleton-cell]')).toHaveLength(pageSize);
    expect(host.querySelector('[data-tag-pagination-skeleton]')).not.toBeNull();
    expect(host.querySelector('[aria-busy="true"]')?.getAttribute('role')).toBe('status');
  }
});

it.each(PAGES)('%s%s 骨架里的每个字形都在 sprite 里', (kind, search) => {
  for (const layout of ['big', 'compact'] as const) {
    const html = indexPlaceholderHtml(indexParams(kind, search), layout);
    const used = [...html.matchAll(/href="#i-([^"]+)"/g)].map((match) => match[1]);
    expect(used.length).toBeGreaterThan(0);
    expect(used.filter((name) => !sprite.has(name))).toEqual([]);
  }
});

it('地址上的排序参数归一：艺人名册认白名单，其他名册与错值回到作品数降序', () => {
  expect(indexParams('performers', '?sort=cup&dir=asc')).toMatchObject({ sort: 'cup', dir: 'asc' });
  expect(indexParams('performers', '?sort=cup')).toMatchObject({ sort: 'cup', dir: 'asc' });
  expect(indexParams('performers', '?sort=debut&dir=sideways')).toMatchObject({ sort: 'debut', dir: 'desc' });
  expect(indexParams('performers', '?sort=bogus')).toMatchObject({ sort: 'n', dir: 'desc' });
  expect(indexParams('tags', '?sort=cup&dir=asc')).toMatchObject({ sort: 'n', dir: 'desc' });
});
