import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { apiGet, apiSend } from '../../api';
import { queryClient } from '../query';
import { entityPath } from '@peach/legacy/core';

export interface Favorite { key?: string; entity_id?: number; scope?: 'local' | 'online'; tag_id?: string; kind: string; name: string; favorite?: boolean; image_url?: string; image_label?: string; image_label_code?: string; image_label_params?: Record<string, unknown>; image_fallbacks?: string[] }
export interface SavedFilter { id: string; name: string; href: string }
export interface Shortcuts { favorites: Favorite[]; filters: SavedFilter[] }
export const SHORTCUTS_KEY = ['library-shortcuts'] as const;
const URL = '/api/library-shortcuts';

export function useShortcuts(enabled = true) {
  return useQuery({ queryKey: SHORTCUTS_KEY, queryFn: ({ signal }) => apiGet<Shortcuts>(URL, signal),
    enabled, refetchOnMount: enabled ? 'always' : false });
}
export function useShortcutWrite() {
  return useMutation({ mutationKey: SHORTCUTS_KEY,
    mutationFn: (body: Record<string, unknown>) => apiSend<Shortcuts>(URL, body),
    onSuccess: (data, body) => {
      queryClient.setQueryData(SHORTCUTS_KEY, data);
      if (body.action === 'favorite' && body.scope === 'online') {
        void queryClient.invalidateQueries({ queryKey: ['follow', 'tags'] });
        void queryClient.invalidateQueries({ queryKey: ['tag-management'] });
      }
    },
  });
}
export function isFavorite(rows: Favorite[], item: Favorite): boolean {
  return rows.some((row) => item.scope === 'online'
    ? row.scope === 'online' && row.tag_id === item.tag_id
    : row.scope !== 'online' && (item.entity_id ? row.entity_id === item.entity_id : row.kind === item.kind && row.name === item.name));
}
/* 星标入口与资料页开关共用同一支写接口：名册格与身份格没有整页收藏清单可依赖，
 * 用乐观状态先行，成功回执换回服务端整份清单，失败按快照退回。 */
export interface FavoriteToggleOptions {
  /** 详情页的实体引用不带收藏状态：挂载时读一份收藏清单补初值。 */
  load?: boolean;
  onError?(error: unknown): void;
}

interface FavoriteRow { entity_id?: number; entity_kind?: string; favorite?: boolean }
interface FavoritePage { items?: FavoriteRow[] }
interface FavoriteIndexData { pages?: FavoritePage[] }

function patchFavoriteList(current: Shortcuts | undefined, item: Favorite, on: boolean): Shortcuts | undefined {
  if (!current) return current;
  const rows = (current.favorites || []).filter((row) => !isFavorite([row], item));
  if (!on) return { ...current, favorites: rows };
  const entry: Favorite = item.scope === 'online'
    ? { key: `online-tag:${item.tag_id}`, kind: 'tag', scope: 'online', tag_id: item.tag_id, name: item.name }
    : { key: `entity:${item.entity_id}`, entity_id: item.entity_id, kind: item.kind, name: item.name };
  return { ...current, favorites: [...rows, entry] };
}

/** 名册缓存按行改收藏状态；只有同一规范实体那几行会变。 */
function patchIndexFavorites(data: FavoriteIndexData | undefined, entityId: number, kind: string, on: boolean): FavoriteIndexData | undefined {
  const pages = data?.pages;
  if (!Array.isArray(pages)) return data;
  let changed = false;
  const next = pages.map((page) => {
    const items = page?.items;
    if (!Array.isArray(items)) return page;
    let pageChanged = false;
    const rows = items.map((row) => {
      if (row.entity_id !== entityId || (row.entity_kind && row.entity_kind !== kind) || row.favorite === on) return row;
      pageChanged = true;
      return { ...row, favorite: on };
    });
    if (!pageChanged) return page;
    changed = true;
    return { ...page, items: rows };
  });
  return changed ? { ...data, pages: next } : data;
}

function patchFavoriteIndexes(entityId: number, kind: string, on: boolean): void {
  for (const [key, data] of queryClient.getQueriesData<FavoriteIndexData>({ queryKey: ['index'] })) {
    const next = patchIndexFavorites(data, entityId, kind, on);
    if (next !== data) queryClient.setQueryData(key, next);
  }
}

/** 星标的选中状态与写入：状态先按点击方向翻，回执回来后以服务端清单为准。 */
export function useFavoriteToggle(item: Favorite, options: FavoriteToggleOptions = {}) {
  const query = useShortcuts(options.load ?? false);
  const initial = useRef(query.data);
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const fromCache = query.data && (options.load || query.data !== initial.current)
    ? isFavorite(query.data.favorites || [], item)
    : item.favorite ?? (query.data ? isFavorite(query.data.favorites || [], item) : false);
  const selected = optimistic ?? fromCache;
  const write = useMutation({
    mutationKey: SHORTCUTS_KEY,
    mutationFn: (body: Record<string, unknown>) => apiSend<Shortcuts>(URL, body),
    onMutate: (body) => {
      const on = body.on === true;
      const previousShortcuts = queryClient.getQueryData<Shortcuts>(SHORTCUTS_KEY);
      const previousIndexes = queryClient.getQueriesData<FavoriteIndexData>({ queryKey: ['index'] });
      setOptimistic(on);
      if (previousShortcuts) queryClient.setQueryData(SHORTCUTS_KEY, patchFavoriteList(previousShortcuts, item, on));
      if (typeof item.entity_id === 'number') patchFavoriteIndexes(item.entity_id, item.kind, on);
      return { previousShortcuts, previousIndexes };
    },
    onError: (error, _body, context) => {
      setOptimistic(null);
      if (context?.previousShortcuts) queryClient.setQueryData(SHORTCUTS_KEY, context.previousShortcuts);
      for (const [key, data] of context?.previousIndexes ?? []) queryClient.setQueryData(key, data);
      options.onError?.(error);
    },
    onSuccess: (data, body) => {
      queryClient.setQueryData(SHORTCUTS_KEY, data);
      const entityId = typeof body.entity_id === 'number' ? body.entity_id : item.entity_id;
      const kind = typeof body.kind === 'string' ? body.kind : item.kind;
      if (typeof entityId === 'number') {
        patchFavoriteIndexes(entityId, kind, isFavorite(data.favorites || [], { ...item, entity_id: entityId, kind }));
      }
      setOptimistic(null);
    },
  });
  const toggle = () => {
    if (write.isPending) return;
    write.mutate({ action: 'favorite', ...item, on: !selected });
  };
  return { selected, busy: write.isPending, error: write.error, toggle };
}

export function favoriteHref(item: Favorite): string {
  if (item.scope === 'online') return `/follow?${new URLSearchParams({ tag: item.name })}`;
  return entityPath(item.kind, item.name, item.entity_id);
}
