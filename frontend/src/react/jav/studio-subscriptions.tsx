/* JAV 页「厂牌订阅」分区：只列挂着片商实体的订阅源，不混入演员订阅。 */
import { useQuery } from '@tanstack/react-query';
import { logoUrl } from '@peach/card-art';
import { Note } from '../components/note';
import { apiGet, errorMessage } from '../../api';
import { interfaceLanguage, t } from '../../i18n';

interface FeedSource {
  id: number; kind: string; kind_label: string; name: string; entity_name?: string | null;
  entity_id?: number | null; entity_kind?: string | null; enabled: boolean;
  last_new_count: number; last_fetched_at?: string | null; seen: number;
}

interface FeedSources { sources: FeedSource[] }

interface StudioRow {
  entityId: number; name: string; kind: string; kindLabel: string; sources: number;
  newCount: number; seen: number; lastFetchedAt?: string | null;
}

const stamp = (value?: string | null) => value ? new Date(value).toLocaleString(interfaceLanguage) : t('catalog:studioSubscriptions.neverFetched');

/** 按片商实体归并；同一家的 maker/label 源只占一张卡。 */
function studios(sources: FeedSource[]): StudioRow[] {
  const byId = new Map<number, StudioRow>();
  for (const source of sources) {
    if (!source.enabled || source.entity_kind !== 'studio' || typeof source.entity_id !== 'number') continue;
    const current = byId.get(source.entity_id);
    const row = current || { entityId: source.entity_id, name: source.entity_name || source.name,
      kind: source.kind, kindLabel: source.kind_label, sources: 0, newCount: 0, seen: 0, lastFetchedAt: null };
    row.sources += 1;
    row.newCount += Number(source.last_new_count) || 0;
    row.seen += Number(source.seen) || 0;
    if (!row.lastFetchedAt || (source.last_fetched_at && source.last_fetched_at > row.lastFetchedAt)) row.lastFetchedAt = source.last_fetched_at;
    byId.set(source.entity_id, row);
  }
  return [...byId.values()].sort((a, b) => b.newCount - a.newCount || a.name.localeCompare(b.name));
}

export function StudioSubscriptions({ navigate }: { navigate(path: string): void }) {
  const query = useQuery({ queryKey: ['studio-subscriptions'], queryFn: ({ signal }) => apiGet<FeedSources>('/api/feeds', signal) });
  if (query.isPending) return <div data-studio-subscriptions-loading="" className="text-body-2-regular text-text-secondary">{t('catalog:studioSubscriptions.loading')}</div>;
  if (query.isError) return <Note tone="error" title={t('catalog:studioSubscriptions.failed')}>{errorMessage(query.error)}</Note>;
  const rows = studios(query.data?.sources || []);
  if (!rows.length) return <section data-studio-subscriptions-empty="" className="flex min-h-52 flex-col items-center justify-center gap-2 rounded-floating border border-separator-border bg-background-secondary-default px-6 py-12 text-center">
    <h2 className="text-body-semibold text-text-primary">{t('catalog:studioSubscriptions.empty')}</h2>
    <p className="max-w-empty-copy text-body-2-regular text-text-secondary">{t('catalog:studioSubscriptions.emptyHint')}</p>
    <button type="button" className="mt-2 rounded-lg bg-control px-3 py-1.5 text-body-2-medium text-text-primary hover:bg-control-hover"
      onClick={() => navigate('/studios')}>{t('catalog:studioSubscriptions.browse')}</button>
  </section>;
  return <section data-studio-subscriptions="" className="flex min-w-0 flex-col gap-4">
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div><h2 className="text-title-2-medium text-text-primary">{t('catalog:studioSubscriptions.title')}</h2>
        <p className="text-body-2-regular text-text-secondary">{t('catalog:studioSubscriptions.hint')}</p></div>
    </header>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => <article key={row.entityId} data-studio-subscription="" className="flex min-w-0 flex-col gap-3 rounded-xl border border-separator-border bg-surface p-4">
        <div className="flex min-w-0 items-center gap-3">
          <img src={logoUrl(row.name, 'icon')} alt="" width={40} height={40} loading="lazy" decoding="async"
            className="h-10 w-10 flex-none rounded-lg object-contain" onError={(event) => { event.currentTarget.style.display = 'none' }} />
          <div className="min-w-0"><strong className="block truncate text-body-1-medium text-text-primary">{row.name}</strong>
            <span className="text-caption-1-regular text-text-secondary">{row.kindLabel} · {row.sources}</span></div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption-1-regular text-text-secondary">
          <span>{t('catalog:studioSubscriptions.newCount', { count: row.newCount })}</span>
          <span>{t('catalog:studioSubscriptions.seenCount', { count: row.seen })}</span>
          <span>{t('catalog:studioSubscriptions.lastFetched', { time: stamp(row.lastFetchedAt) })}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg bg-control px-3 py-1.5 text-body-2-medium text-text-primary hover:bg-control-hover"
            onClick={() => navigate(`/jav?tab=releases&studio=${encodeURIComponent(row.name)}`)}>{t('catalog:studioSubscriptions.openReleases')}</button>
          <button type="button" className="rounded-lg px-3 py-1.5 text-body-2-medium text-text-secondary hover:bg-control"
            onClick={() => navigate('/subscriptions')}>{t('catalog:studioSubscriptions.manage')}</button>
        </div>
      </article>)}
    </div>
  </section>;
}
