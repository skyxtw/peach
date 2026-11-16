import { t } from '../../i18n';
export const JAV_TABS = [['library', t('catalog:javTabs.collection')], ['wants', t('catalog:javTabs.wants')], ['releases', t('catalog:javTabs.newReleases')], ['discover', t('catalog:javTabs.discover')], ['actors', t('catalog:javTabs.actorSubscriptions')], ['studios', t('catalog:javTabs.studioSubscriptions')]] as const;
export const javTab = (value: string | null) => JAV_TABS.some(([key]) => key === value) ? value! : 'library';
export const javPath = (tab: string) => javTab(tab) === 'library' ? '/?jav=1' : `/jav?tab=${tab}`;
export function javLibraryPath(search: string) {
  const params = new URLSearchParams(search);
  params.delete('tab'); params.set('jav', '1');
  return '/?' + params;
}
