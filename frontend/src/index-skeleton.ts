/* 索引五页（艺人、卖家、厂牌、事务所、标签）的进页骨架与地址解析。
 *
 * 页头此刻就能给出最终样子：标题、读数的占位、版式开关、收藏入口、过滤框、页面级 Tabs 与本地艺人的身份分类，
 * 等的只有下面那块内容。
 * React 页取回首屏后整块换掉它，键和文字同页面那一份一致，换的那一下页头不跳。这里的控件不接线：骨架只在
 * 取数那一段露面。两处铺它：壳在冷启动落在索引页时先铺一遍（`renderInitialSurfaceLoading`），路由树的索引元素
 * 每次打开前再铺；屏幕上已经是同一张骨架就不重画。
 *
 * 版式偏好由调用方读好交进来：这个模块壳与 React 包各带一份，设置 store 只能有一份。 */
import { boardTabsHtml, fitSkeleton, iconSwitchHtml, indexSkeletonHtml } from '@peach/legacy/ui';
import { identityFilterSkeletonHtml } from './identity-filter';
import { islandButton, islandShortcutsEntry, islandSearchInput } from './island-skeleton';
import { normalizePeopleSort } from './people-sort';
import { t } from './i18n';

export type IndexPageKind = 'performers' | 'creators' | 'studios' | 'agencies' | 'series' | 'tags';

/** 地址栏上的那几项。 */
export interface IndexParams {
  kind: IndexPageKind;
  q: string;
  scope: 'local' | 'online';
  view: 'alphabet' | 'cloud';
  category: string;
  /** 本地艺人名册的排序键与方向；其他名册归一成作品数降序。 */
  sort: string;
  dir: 'asc' | 'desc';
}

export const INDEX_TITLES: Readonly<Record<IndexPageKind, string>> = {
  performers: t('catalog:shared.performers'), creators: t('catalog:shared.sellers'), studios: t('catalog:shared.studios'), agencies: t('catalog:shared.agencies'), series: t('catalog:shared.series'), tags: t('catalog:shared.tags'),
};

/** 页名放进句子里的写法：英文在句中要小写（Filter performers），中文与标题相同。 */
export const INDEX_NOUNS: Readonly<Record<IndexPageKind, string>> = {
  performers: t('catalog:peopleIndex.nounPerformers'), creators: t('catalog:peopleIndex.nounSellers'), studios: t('catalog:peopleIndex.nounStudios'),
  agencies: t('catalog:peopleIndex.nounAgencies'), series: t('catalog:peopleIndex.nounSeries'), tags: t('catalog:peopleIndex.nounTags'),
};

/* 艺人索引版式，思路同 JAV 大图：列宽不变、只把图从圆框拉成竖幅，一屏里的人数不变而每张脸更大；紧凑就是
   圆头像那一屏。资料页的名册读的是同一个设置值。 */
const PEOPLE_LAYOUTS =[['big', t('catalog:peopleIndex.layoutLargePortrait'), 'maximize'], ['compact', t('catalog:peopleIndex.layoutCompactRound'), 'layout-grid']] as const;
/* 公司那一格摆的是方形标识而不是脸，说法跟着换；档位仍是同一个设置值。 */
const COMPANY_LAYOUTS = [['big', t('catalog:peopleIndex.layoutLargeLogo'), 'maximize'], ['compact', t('catalog:peopleIndex.layoutCompactLogo'), 'layout-grid']] as const;
const SERIES_LAYOUTS = [['big', t('catalog:peopleIndex.layoutLargeSeries'), 'maximize'], ['compact', t('catalog:peopleIndex.layoutCompactSeries'), 'layout-grid']] as const;
const MAKER_INDEX_KINDS = [['studios', t('catalog:shared.studios'), 'clapperboard'], ['series', t('catalog:shared.series'), 'file-stack'], ['agencies', t('catalog:shared.agencies'), 'briefcase']] as const;
const INDEX_SCOPES = [['local', t('catalog:shared.localLabel'), 'hard-drive'], ['online', t('catalog:shared.online'), 'rss']] as const;
const PEOPLE_INDEX_TABS = [['performers', t('catalog:shared.performers'), 'user-round'], ['creators', t('catalog:shared.sellers'), 'user-round'], ['online', t('catalog:shared.online'), 'rss']] as const;
const TAG_VIEWS = [['cloud', t('catalog:peopleIndex.tagCloud'), 'tags'], ['alphabet', t('catalog:peopleIndex.alphabetical'), 'text-aa']] as const;

/** 存着的版式偏好，认不出的回到大图。 */
export const peopleLayoutOf = (saved: unknown): 'big' | 'compact' => (saved === 'compact' ? 'compact' : 'big');

/** 地址栏上的那几项。范围与视图只认两个值；类型由页面按这一套词表核对，认不出的回到全部。 */
export function indexParams(kind: IndexPageKind, search: string): IndexParams {
  const params = new URLSearchParams(search);
  const ordered = normalizePeopleSort(kind, params.get('sort'), params.get('dir'));
  return {
    kind, q: params.get('q') || '', scope: params.get('scope') === 'online' ? 'online' : 'local',
    view: params.get('view') === 'cloud' ? 'cloud' : 'alphabet', category: params.get('category') || 'all',
    sort: ordered.sort, dir: ordered.dir,
  };
}

type Choices = readonly (readonly [string, string, string])[];
const tabs = (items: Choices, active: string, label: string) => boardTabsHtml(
  items.map(([value, text, symbol]) => ({ value, label: text, symbol })), { active, label, className: 'indextabs' });

/* 标签页 Tabs 下面还有一块两排的筛选玻璃（React 的 `FilterGlassRows`）：上排是类型药丸，下排是读数、按首字
   跳转和视图切换。药丸有哪几枚、读数多少、有哪些首字都要等数据，视图切换此刻就是最终那一档；块高与下边距同
   旧 `.board-filter-frame`，页面落地时它原地换成真的那一块，下面的内容不下跳。 */
const tagFilterSkeletonHtml = (view: string) => `<div class="peach-react contents"><div data-filter-glass data-glass-pane class="sticky top-topbar z-10 mb-5.5 flex flex-col">
    <div class="flex h-12 min-w-0 items-center gap-1.75 overflow-x-auto overscroll-x-contain px-3 py-2" data-filter-row="top" data-skeleton-tier="filter-pill" aria-label="${t('catalog:tagFilters.tagType')}"></div>
    <div class="flex min-h-11.5 min-w-0 items-center gap-3 px-3 py-2" data-filter-row="bottom"><span class="countskeleton"></span>
      <span class="ml-auto">${iconSwitchHtml('tag-view', t('catalog:tagFilters.tagView'), TAG_VIEWS, view, { className:'tag-skeleton-view' })}</span></div></div></div>`;

export function indexPlaceholderHtml({ kind, q, scope, view, category }: IndexParams, layout: 'big' | 'compact'): string {
  const title = INDEX_TITLES[kind] || t('catalog:shared.tags'), people = kind !== 'tags', company = kind === 'studios' || kind === 'agencies' || kind === 'series';
  const noun = INDEX_NOUNS[kind] || t('catalog:peopleIndex.nounTags');
  const switcher = people
    ? iconSwitchHtml('people-layout', t('catalog:peopleIndex.layout', { title: noun }), kind === 'series' ? SERIES_LAYOUTS : company ? COMPANY_LAYOUTS : PEOPLE_LAYOUTS, layout) : '';
  return `<div class="ihead peach-react" data-index-head>
      <h2 class="disp indexheading">${title}</h2>
      ${people ? '<span class="mono" id="indexCount"><span class="countskeleton"></span></span>' : ''}${switcher}
      ${islandShortcutsEntry('default')}
      ${kind === 'tags' ? islandButton({variant: 'ghost', glyph: 'pencil', attrs: `data-tag-mode data-skeleton-action disabled tabindex="-1" aria-label="${t('catalog:peopleIndex.manageTags')}"` }) : ''}
      <div data-index-search class="ml-auto min-w-0 max-w-80 flex-1">${islandSearchInput('', q, t('catalog:peopleIndex.filterTitle', { title: noun }))}</div>
    </div>
    ${kind === 'tags' ? tabs(INDEX_SCOPES, scope, t('catalog:peopleIndex.tagScope')) : kind === 'performers' || kind === 'creators'
      ? tabs(PEOPLE_INDEX_TABS, kind === 'performers' && scope === 'online' ? 'online' : kind, t('catalog:peopleIndex.roster'))
      : company ? tabs(MAKER_INDEX_KINDS, kind, t('catalog:peopleIndex.companyType')) : ''}
    ${kind === 'tags' ? tagFilterSkeletonHtml(view) : ''}
    ${kind === 'performers' && scope !== 'online' ? identityFilterSkeletonHtml(category) : ''}
    ${indexSkeletonHtml({ kind, layout, mode: view })}`;
}

const skeletonKeyOf = (html: string) => html.match(/data-skeleton="([^"]*)"/)?.[1] || '';

/** 把这一页的骨架铺进容器。屏幕上已经是同一张骨架就别重画：深链冷启动时首屏骨架先铺过一遍，innerHTML 换
 *  新节点会把 shimmer 从头放一遍。 */
export function paintIndexSkeleton(container: HTMLElement, params: IndexParams, layout: 'big' | 'compact'): void {
  const placeholder = indexPlaceholderHtml(params, layout);
  if (container.querySelector<HTMLElement>('[data-skeleton]')?.dataset.skeleton !== skeletonKeyOf(placeholder)) {
    container.innerHTML = placeholder;
    fitSkeleton(container);
  }
}
