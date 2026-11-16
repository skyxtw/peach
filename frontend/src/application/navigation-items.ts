/** 应用导航的完整词表；默认可见顺序由 sidebar 的持久偏好决定。名称取当前界面语言的译文（`resources/locales/<语言>/navigation.json`）。 */
import { t } from '../i18n';

export type SidebarKey = '' | 'performers' | 'studios' | 'tags' | 'jav' | 'flagged' | 'playlists'
  | 'follow' | 'immerse' | 'manage' | 'stats' | 'taste' | 'review' | 'data-cleanup' | 'trash'
  | 'follow-manage' | 'quality' | 'activity';
export type ManagementKey = 'stats' | 'taste' | 'review' | 'cleanup' | 'trash' | 'follow'
  | 'quality' | 'activity' | 'configuration';
export type NavigationItem<Key extends string = string> = readonly [key: Key, label: string, glyph: string];

export const SIDEBAR_ITEMS = [
  ['', t('navigation:sidebar.home'), 'home'],
  ['performers', t('navigation:sidebar.performers'), 'user-round'],
  ['studios', t('navigation:sidebar.studios'), 'clapperboard'],
  ['tags', t('navigation:sidebar.tags'), 'tags'],
  ['jav', t('navigation:sidebar.jav'), 'jav'],
  ['flagged', t('navigation:sidebar.flagged'), 'bookmark'],
  ['playlists', t('navigation:sidebar.playlists'), 'playlist'],
  ['follow', t('navigation:sidebar.following'), 'rss'],
  ['immerse', t('navigation:sidebar.immerse'), 'gallery-vertical-end'],
  ['manage', t('navigation:sidebar.manage'), 'wrench'],
] as const satisfies readonly NavigationItem<SidebarKey>[];

export const MANAGE_SECTIONS = [
  ['stats', t('navigation:manage.stats'), 'chart'],
  ['taste', t('navigation:manage.taste'), 'heart'],
  ['review', t('navigation:manage.review'), 'square-check-big'],
  ['cleanup', t('navigation:manage.cleanup'), 'hard-drive'],
  ['trash', t('navigation:manage.trash'), 'trash'],
  ['follow', t('navigation:manage.subscriptions'), 'rss'],
  ['quality', t('navigation:manage.quality'), 'sparkles'],
  ['activity', t('navigation:manage.activity'), 'history'],
  ['configuration', t('navigation:manage.configuration'), 'folder-cog'],
] as const satisfies readonly NavigationItem<ManagementKey>[];

export const MANAGE_MENU_SECTIONS: readonly ManagementKey[] = ['stats', 'taste', 'cleanup', 'follow', 'activity', 'configuration'];
export function normalizeManageOrder(raw: unknown): ManagementKey[] {
  const entries = Array.isArray(raw) ? raw : [];
  return [...new Set([...entries.filter((key): key is ManagementKey => MANAGE_MENU_SECTIONS.includes(key)), ...MANAGE_MENU_SECTIONS])];
}
export const getManageMenuSections = (configurable: boolean, order?: unknown): readonly NavigationItem<ManagementKey>[] =>
  normalizeManageOrder(order).flatMap(key => key === 'configuration' && !configurable ? []
    : MANAGE_SECTIONS.filter(([entry]) => entry === key));

export const OPTIONAL_SIDEBAR_ITEMS: readonly NavigationItem<SidebarKey>[] = MANAGE_SECTIONS
  .flatMap(([key, label, glyph]): NavigationItem<SidebarKey>[] => key === 'configuration' ? []
    : [[key === 'follow' ? 'follow-manage' : key === 'cleanup' ? 'data-cleanup' : key, label, glyph]]);
export const NAV_CATALOG: readonly NavigationItem<SidebarKey>[] = [...SIDEBAR_ITEMS, ...OPTIONAL_SIDEBAR_ITEMS];
export const DIRECT_MANAGE_NAV: Readonly<Partial<Record<SidebarKey, ManagementKey>>> = {
  stats: 'stats', review: 'review', 'data-cleanup': 'cleanup', trash: 'trash',
  'follow-manage': 'follow', quality: 'quality', activity: 'activity',
};
