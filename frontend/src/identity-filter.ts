/* 艺人页本地名册的身份分类：一组按身份筛名册的小号键，React 页（`react/index/index-page.tsx`）与
 * 进页骨架（`index-skeleton.ts`）共用这一张词表。
 *
 * 换分类只改地址，不等数据，所以骨架里就是最终长相：地址栏那一档是 primary、其余 secondary，
 * 只是还不接线。哪几类有人要等计数，计数到之前整排都摆出来，到了再收掉空的那几类。 */
import { islandButton } from './island-skeleton';
import { t } from './i18n';

export const IDENTITY_CATEGORIES: readonly (readonly [string, string])[] = [
  ['all', t('catalog:shared.all')], ['japanese_av', t('catalog:shared.actresses')], ['amateur', t('catalog:identityFilter.amateur')], ['western', t('catalog:identityFilter.western')], ['blogger', t('catalog:identityFilter.influencers')], ['animation', t('catalog:identityFilter.animators')],
];

/** 五十音行：键与后端 `peach.kana.KANA_ROWS` 一致；`all` 只在前端表示不筛选。 */
export const KANA_ROWS: readonly (readonly [string, string])[] = [
  ['all', t('catalog:shared.all')], ['a', t('catalog:peopleIndex.kanaA')], ['k', t('catalog:peopleIndex.kanaK')],
  ['s', t('catalog:peopleIndex.kanaS')], ['t', t('catalog:peopleIndex.kanaT')], ['n', t('catalog:peopleIndex.kanaN')],
  ['h', t('catalog:peopleIndex.kanaH')], ['m', t('catalog:peopleIndex.kanaM')], ['y', t('catalog:peopleIndex.kanaY')],
  ['r', t('catalog:peopleIndex.kanaR')], ['w', t('catalog:peopleIndex.kanaW')], ['other', t('catalog:peopleIndex.kanaOther')],
];

/** 页面那一行的容器类，骨架与页面同一串。 */
export const IDENTITY_ROW_CLASS = 'mb-4 flex flex-wrap gap-2';

/** 本地艺人名册的五十音行：其他名册、在线名册与认不出的值都回空（不筛选）。 */
export function normalizeKanaRow(kind: string, scope: string, kana: unknown): string {
  if (kind !== 'performers' || scope !== 'local' || typeof kana !== 'string') return '';
  return kana !== 'all' && KANA_ROWS.some(([key]) => key === kana) ? kana : '';
}

export function identityFilterSkeletonHtml(category: string): string {
  const known = IDENTITY_CATEGORIES.some(([key]) => key === category) ? category : 'all';
  const buttons = IDENTITY_CATEGORIES.map(([key, label]) => islandButton({
    variant: key === known ? 'primary' : 'secondary', size: 'small', label, attrs: `aria-pressed="${key === known}"`,
  })).join('');
  return `<div class="peach-react"><div aria-label="${t('catalog:peopleIndex.identityCategory')}" class="${IDENTITY_ROW_CLASS}">${buttons}</div></div>`;
}

/** 五十音那一行的骨架：键与最终长相一致，选中态照地址；不接线，只占位。 */
export function kanaFilterSkeletonHtml(kana: string): string {
  const known = KANA_ROWS.some(([key]) => key === kana) ? kana : 'all';
  const buttons = KANA_ROWS.map(([key, label]) => islandButton({
    variant: key === known ? 'primary' : 'secondary', size: 'small', label,
    attrs: `data-kana-row="${key}" aria-pressed="${key === known}"`,
  })).join('');
  return `<div class="peach-react"><div aria-label="${t('catalog:peopleIndex.kanaRow')}" class="${IDENTITY_ROW_CLASS}">${buttons}</div></div>`;
}
