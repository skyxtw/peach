import { expect, it } from 'vitest';

import {
  catalogSortPage, defaultSortDir, JAV_RELEASE_SORT, nextSortState, normalizePageSort, normalizePageSorts,
  pageSortPreference, preferredDirection, SORT_ALIASES, SORT_KEYS, sortDirWord, SORTS,
} from '../src/sort-preferences';

it('随机无方向，首页偏好与其他排序分别解析', () => {
  expect(preferredDirection('seed', 'seed', 'asc')).toBe('');
  expect(preferredDirection('new', 'new', 'asc')).toBe('asc');
  expect(preferredDirection('rating', 'new', 'asc')).toBe('desc');
});

it('可翻转的列从 desc 起，随机没有方向；发行时间只在 JAV 语境出现但也是合法键', () => {
  expect([defaultSortDir('new'), defaultSortDir('seed'), defaultSortDir('unknown')]).toEqual(['desc', '', '']);
  expect(SORT_KEYS).toEqual(['seed', 'rating', 'o', 'plays', 'dur', 'size', 'new', 'played', 'release']);
  expect([sortDirWord('dur', 'asc'), sortDirWord('dur', 'desc'), sortDirWord('seed', 'asc')]).toEqual(['从短到长', '从长到短', '']);
  /* 列名中性，方向词按列各说各的：同一个 desc 在时间列上是「从新到旧」，在时长上是「从长到短」。 */
  expect([...SORTS.map(([, label]) => label), JAV_RELEASE_SORT[1]])
    .toEqual(['随机', '评分', '高潮计数', '观看次数', '时长', '体积', '入库时间', '观看时间', '发行时间']);
  expect(['new', 'played'].map((key) => [sortDirWord(key, 'desc'), sortDirWord(key, 'asc')]))
    .toEqual([['从新到旧', '从旧到新'], ['从近到远', '从远到近']]);
});

it('地址栏与书签里把方向写进键名的旧键照旧认', () => {
  expect(SORT_ALIASES).toEqual({ big: ['size', 'desc'], short: ['dur', 'asc'], long: ['dur', 'desc'] });
});

it('页面身份按目录地址算：首页的 JAV 馆藏另算一页，其余目录页跟首页', () => {
  expect([
    catalogSortPage('/', '?jav=1'), catalogSortPage('/', ''), catalogSortPage('/unseen', '?jav=1'), catalogSortPage('/wall', ''),
  ]).toEqual(['jav', 'home', 'home', 'home']);
});

it('存过的页取自己那份，没存过的页回全局默认；随机没有方向', () => {
  const preferences = {
    defaultSort: 'new', defaultSortDirection: 'asc',
    pageSorts: { home: { sort: 'rating', dir: 'desc' }, jav: { sort: 'release', dir: 'asc' } },
  };
  expect([pageSortPreference(preferences, 'home'), pageSortPreference(preferences, 'jav')])
    .toEqual([{ sort: 'rating', dir: 'desc' }, { sort: 'release', dir: 'asc' }]);
  expect(pageSortPreference({ defaultSort: 'new', defaultSortDirection: 'asc' }, 'home')).toEqual({ sort: 'new', dir: 'asc' });
  expect(pageSortPreference({ defaultSort: 'seed' }, 'jav')).toEqual({ sort: 'seed', dir: '' });
});

it('pageSorts 只留已知页面与合法列，方向按列归一', () => {
  const raw = {
    home: { sort: 'rating', dir: 'sideways' }, jav: { sort: 'seed', dir: 'asc' },
    people: { sort: 'rating', dir: 'desc' }, wall: { sort: 'size', dir: 'desc' }, trash: 'rating',
  };
  expect(normalizePageSorts(raw)).toEqual({ home: { sort: 'rating', dir: 'desc' }, jav: { sort: 'seed', dir: '' } });
  expect(normalizePageSort('unknown')).toBeNull();
  expect(normalizePageSorts(['home'])).toEqual({});
});

it('点未选中项换列取默认方向，点选中项翻方向，随机重复点什么都不做', () => {
  expect(nextSortState('rating', 'new', 'asc')).toEqual({ sort: 'rating', dir: 'desc' });
  expect(nextSortState('new', 'new', 'desc')).toEqual({ sort: 'new', dir: 'asc' });
  expect(nextSortState('new', 'new', 'asc')).toEqual({ sort: 'new', dir: 'desc' });
  expect(nextSortState('seed', 'seed', '')).toBeNull();
  /* 换一张词表就是另一页的排序：热度那一列只在关注页上可翻转。 */
  const words = { heat: ['从热到冷', '从冷到热'] } as const;
  expect(nextSortState('heat', 'heat', 'desc', words)).toEqual({ sort: 'heat', dir: 'asc' });
  expect(nextSortState('new', 'heat', 'desc', words)).toEqual({ sort: 'new', dir: '' });
});
