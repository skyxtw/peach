/* 人物索引的排序词表：有哪几列、每列的默认方向和 URL 归一。
 *
 * 后端白名单在 `src/peach/web_entity.py` 的 `INDEX_PERSON_SORTS`：键与默认方向要和这里一致；
 * 别的名册、认不出的列或方向都由页面归一一次、后端再兜一次，不把错参数带进请求。
 * 缺资料的项由后端排最后，格子上的读数据此说「资料未取得」，不补零也不猜。 */
import { t } from './i18n';

export type PeopleSortDir = 'asc' | 'desc';

export interface PeopleSortOption {
  key: string;
  label: string;
  defaultDir: PeopleSortDir;
}

/** 顺序就是页面上那一排排序键的先后。默认方向与后端 `INDEX_PERSON_SORTS` 一致。 */
export const PEOPLE_SORTS: readonly PeopleSortOption[] = [
  { key: 'n', label: t('catalog:peopleIndex.sortVideoCount'), defaultDir: 'desc' },
  { key: 'debut', label: t('catalog:peopleIndex.sortDebut'), defaultDir: 'desc' },
  { key: 'cup', label: t('catalog:peopleIndex.sortCup'), defaultDir: 'asc' },
  { key: 'bust', label: t('catalog:peopleIndex.sortBust'), defaultDir: 'desc' },
  { key: 'height', label: t('catalog:peopleIndex.sortHeight'), defaultDir: 'desc' },
  { key: 'birth', label: t('catalog:peopleIndex.sortBirth'), defaultDir: 'desc' },
  { key: 'kana', label: t('catalog:peopleIndex.sortKana'), defaultDir: 'asc' },
];

/** 出厂排序：作品数从多到少，同值由后端的实体 id 兜底。 */
export const DEFAULT_PEOPLE_SORT = { sort: 'n', dir: 'desc' } as const;

export const peopleSortOption = (key: string | undefined): PeopleSortOption | undefined =>
  PEOPLE_SORTS.find((option) => option.key === key);

/** 本地艺人名册的排序：其他名册不认排序键；方向认不出时用该列的默认。 */
export function normalizePeopleSort(kind: string, sort: unknown, dir: unknown): { sort: string; dir: PeopleSortDir } {
  if (kind !== 'performers') return { ...DEFAULT_PEOPLE_SORT };
  const option = typeof sort === 'string' ? peopleSortOption(sort) : undefined;
  if (!option) return { ...DEFAULT_PEOPLE_SORT };
  return { sort: option.key, dir: dir === 'asc' || dir === 'desc' ? dir : option.defaultDir };
}

export const isDefaultPeopleSort = (sort: string, dir: string): boolean =>
  sort === DEFAULT_PEOPLE_SORT.sort && dir === DEFAULT_PEOPLE_SORT.dir;

/** 点未选中的列＝换成该列并取默认方向；点已选中的列＝翻方向。同资料页那排排序键。 */
export function nextPeopleSort(key: string, sort: string, dir: string): { sort: string; dir: PeopleSortDir } {
  const option = peopleSortOption(key);
  if (!option) return { sort, dir: dir === 'asc' ? 'asc' : 'desc' };
  if (key !== sort) return { sort: key, dir: option.defaultDir };
  return { sort: key, dir: dir === 'asc' ? 'desc' : 'asc' };
}

export const peopleSortDirWord = (dir: PeopleSortDir): string =>
  t(dir === 'asc' ? 'catalog:peopleIndex.sortAscending' : 'catalog:peopleIndex.sortDescending');

/** 无障碍名称播报点下去会得到什么，与资料页那一排是同一句。 */
export function peopleSortAria(key: string, sort: string, dir: string): string {
  const option = peopleSortOption(key);
  if (!option) return '';
  return t('shell:entitySort.ariaLabel', {
    label: option.label, direction: peopleSortDirWord(nextPeopleSort(key, sort, dir).dir),
  });
}
