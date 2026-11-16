/* JAV 页「演员订阅」分区：只列挂着演员实体的订阅源，与厂牌订阅、非 JAV 关注分开。 */
import { useQuery } from '@tanstack/react-query';
import { Note } from '../components/note';
import { apiGet, errorMessage } from '../../api';
import { t } from '../../i18n';

interface FeedSource {
  id: number; kind: string; kind_label: string; name: string; entity_name?: string | null;
  entity_id?: number | null; entity_kind?: string | null; enabled: boolean;
  last_new_count: number; last_fetched_at?: string | null; seen: number;
}

interface FeedSources { sources: FeedSource[] }

interface ActorRow {
  entityId: number; name: string; kindLabel: string; sources: number;
  newCount: number; seen: number; lastFetchedAt?: string | null;
}

const stamp = (value?: string | null) => value ? new Date(value).toLocaleString() : t('catalog:actorSubscriptions.neverFetched');

function actors(sources: FeedSource[]): ActorRow[] {
  const byId = new Map<number, ActorRow>();
  for (const source of sources) {
    if (!source.enabled || source.entity_kind !== 'performer' || typeof source.entity_id !== 'number') continue;
    const row = byId.get(source.entity_id) || { entityId: source.entity_id, name: source.entity_name || source.name,
      kindLabel: source.kind_label, sources: 0, newCount: 0, seen: 0, lastFetchedAt: null };
    row.sources += 1;
    row.newCount += Number(source.last_new_count) || 0;
    row.seen += Number(source.seen) || 0;
    if (!row.lastFetchedAt || (source.last_fetched_at && source.last_fetched_at > row.lastFetchedAt)) row.lastFetchedAt = source.last_fetched_at;
    byId.set(source.entity_id, row);
  }
  return [...byId.values()].sort((a, b) => b.newCount - a.newCount || a.name.localeCompare(b.name));
}

export function ActorSubscriptions({ navigate }: { navigate(path: string): void }) {
  const query = useQuery({ queryKey: ['actor-subscriptions'], queryFn: ({ signal }) => apiGet<FeedSources>('/api/feeds', signal) });
  if (query.isPending) return <div className="text-body-2-regular text-text-secondary">{t('catalog:actorSubscriptions.loading')}</div>;
  if (query.isError) return <Note tone="error" title={t('catalog:actorSubscriptions.failed')}>{errorMessage(query.error)}</Note>;
  const rows = actors(query.data?.sources || []);
  if (!rows.length) return <section data-actor-subscriptions-empty="" className="flex min-h-52 flex-col items-center justify-center gap-2 rounded-floating border border-separator-border bg-background-secondary-default px-6 py-12 text-center">
    <h2 className="text-body-semibold text-text-primary">{t('catalog:actorSubscriptions.empty')}</h2>
    <p className="max-w-empty-copy text-body-2-regular text-text-secondary">{t('catalog:actorSubscriptions.emptyHint')}</p>
    <button type="button" className="mt-2 rounded-lg bg-control px-3 py-1.5 text-body-2-medium text-text-primary hover:bg-control-hover"
      onClick={() => navigate('/performers')}>{t('catalog:actorSubscriptions.browse')}</button>
  </section>;
  return <section data-actor-subscriptions="" className="flex min-w-0 flex-col gap-4">
    <header><h2 className="text-title-2-medium text-text-primary">{t('catalog:actorSubscriptions.title')}</h2>
      <p className="text-body-2-regular text-text-secondary">{t('catalog:actorSubscriptions.hint')}</p></header>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => <article key={row.entityId} data-actor-subscription="" className="flex min-w-0 flex-col gap-3 rounded-xl border border-separator-border bg-surface p-4">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="grid h-10 w-10 flex-none place-items-center rounded-full bg-control text-body-2-medium text-text-primary">{row.name.slice(0, 1)}</span>
          <div className="min-w-0"><strong className="block truncate text-body-1-medium text-text-primary">{row.name}</strong>
            <span className="text-caption-1-regular text-text-secondary">{row.kindLabel} · {row.sources}</span></div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption-1-regular text-text-secondary">
          <span>{t('catalog:actorSubscriptions.newCount', { count: row.newCount })}</span>
          <span>{t('catalog:actorSubscriptions.seenCount', { count: row.seen })}</span>
          <span>{t('catalog:actorSubscriptions.lastFetched', { time: stamp(row.lastFetchedAt) })}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg bg-control px-3 py-1.5 text-body-2-medium text-text-primary hover:bg-control-hover"
            onClick={() => navigate(`/jav?tab=releases&performer=${encodeURIComponent(row.name)}`)}>{t('catalog:actorSubscriptions.openReleases')}</button>
          <button type="button" className="rounded-lg px-3 py-1.5 text-body-2-medium text-text-secondary hover:bg-control"
            onClick={() => navigate('/subscriptions')}>{t('catalog:actorSubscriptions.manage')}</button>
        </div>
      </article>)}
    </div>
  </section>;
}
