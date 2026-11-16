/* 名册卡的订阅键：人物页「订阅新作」开关在索引页的入口。
 *
 * 可订性随索引行一起下发（`feed.available`）。没有 JavDB 演员页或 DMM 女优编号的
 * 女优不摆开关，改成一个可见的「暂无可订阅来源」链接，去订阅管理里补来源；点击不会
 * 发订阅请求。卡片本身仍是整块按钮，订阅键与收藏星标一样是它的兄弟节点。 */
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { esc } from '@peach/legacy/core';
import { spinnerHtml } from '@peach/legacy/ui';
import { Chip } from '@/components/base/badges/chip';
import { apiSend, errorMessage } from '../../api';
import { t } from '../../i18n';
import { queryClient } from '../query';
import { spriteGlyph } from '../components/sprite-glyph';
import { busyProps } from '../settings/busy-props';
import { showToast } from '../toaster';
import { EntityActionButton } from '../library-shortcuts/favorite-star';

export interface FeedState { following: boolean; available: boolean }
export interface FollowEntity { entity_id: number; name: string; feed?: FeedState | null }

interface FollowRow { entity_id?: number; following?: boolean; feed?: FeedState | null }
interface FollowPage { items?: FollowRow[] }
interface FollowData { pages?: FollowPage[] }
interface FollowReply { ok: boolean; entity_id: number; following: boolean; sources: number[] }

const URL = '/api/feeds/source';
const Rss = spriteGlyph('rss');

/** 名册缓存里这一位改成订阅/退订后的样子。 */
function patchRows(data: FollowData | undefined, entityId: number, on: boolean): FollowData | undefined {
  const pages = data?.pages;
  if (!Array.isArray(pages)) return data;
  let changed = false;
  const next = pages.map((page) => {
    const items = page?.items;
    if (!Array.isArray(items)) return page;
    let pageChanged = false;
    const rows = items.map((row) => {
      if (row.entity_id !== entityId) return row;
      pageChanged = true;
      return { ...row, following: on, feed: row.feed ? { ...row.feed, following: on } : row.feed };
    });
    if (!pageChanged) return page;
    changed = true;
    return { ...page, items: rows };
  });
  return changed ? { ...data, pages: next } : data;
}

function patchIndex(entityId: number, on: boolean): void {
  for (const [key, data] of queryClient.getQueriesData<FollowData>({ queryKey: ['index'] })) {
    const next = patchRows(data, entityId, on);
    if (next !== data) queryClient.setQueryData(key, next);
  }
}

/** 订阅写接口的乐观状态：先翻开关，失败按快照退回，成功用服务端回执定稿。 */
export function useFollowToggle(item: FollowEntity, onError?: (error: unknown) => void) {
  const current = item.feed?.following ?? false;
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const write = useMutation({
    mutationKey: ['follow-source'],
    mutationFn: (body: Record<string, unknown>) => apiSend<FollowReply>(URL, body),
    onMutate: (body) => {
      const on = body.enabled === true;
      const previous = queryClient.getQueriesData<FollowData>({ queryKey: ['index'] });
      setOptimistic(on);
      patchIndex(item.entity_id, on);
      return { previous };
    },
    onError: (error, _body, context) => {
      setOptimistic(null);
      for (const [key, data] of context?.previous ?? []) queryClient.setQueryData(key, data);
      onError?.(error);
    },
    onSuccess: (reply) => {
      setOptimistic(reply.following);
      patchIndex(reply.entity_id, reply.following);
    },
  });
  const toggle = () => {
    if (write.isPending || !item.feed?.available) return;
    write.mutate({ action: 'follow', entity_id: item.entity_id, enabled: !(optimistic ?? current) });
  };
  return { selected: optimistic ?? current, busy: write.isPending, error: write.error, toggle };
}

/** 名册卡左上角的订阅键：可订时是开关，没有来源时是去补来源的链接。 */
export function IndexFollowButton({ item }: { item: FollowEntity }) {
  const follow = useFollowToggle(item, (error) => {
    showToast(`follow-${item.entity_id}`, { html: esc(errorMessage(error)), alert: true, timeout: 6000, action: null });
  });
  if (!item.feed?.available) {
    const label = t('catalog:peopleIndex.subscribeUnavailableAction', { name: item.name });
    return <a data-index-follow="" data-index-follow-unavailable="" href="/subscriptions?tab=add"
      aria-label={label} title={label}>
      <Chip variant="caption" color="soft"><Rss /><span>{t('catalog:peopleIndex.subscribeUnavailable')}</span></Chip>
    </a>;
  }
  const label = t(follow.selected ? 'catalog:peopleIndex.unsubscribeAction' : 'catalog:peopleIndex.subscribeAction', { name: item.name });
  return <EntityActionButton data-index-follow="" data-index-feed="" aria-pressed={!!follow.selected}
    label={label} {...busyProps(follow.busy)} onClick={follow.toggle}>
    {follow.busy ? <span aria-hidden dangerouslySetInnerHTML={{ __html: spinnerHtml('') }} /> : <Rss />}
  </EntityActionButton>;
}
