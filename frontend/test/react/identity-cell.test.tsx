/* 详情身份格的收藏星标：位置、初始状态、乐观写入、失败退回与整格点击的分工。 */
import { notifyManager, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerNameWritings, setNameLanguage } from '../../src/core/entity-names';
import { IdentityCell } from '../../src/react/components/identity-cell';
import type { DetailEntityRef } from '../../src/react/item-detail/item-detail';
import { queryClient } from '../../src/react/query';
import { click, mount, pending, settle } from './render';
import { showToast } from '../../src/react/toaster';
import type { Shortcuts } from '../../src/react/library-shortcuts/library-shortcuts';

vi.mock('../../src/react/toaster', () => ({ showToast: vi.fn() }));
notifyManager.setScheduler((notify) => notify());
beforeEach(() => { registerNameWritings([]); setNameLanguage('zh-CN') });
afterEach(() => { queryClient.clear() });

const performer = { id: 7, name: '七海ひな' } as DetailEntityRef;
const favorite: Shortcuts = {
  favorites: [{ key: 'entity:7', entity_id: 7, kind: 'performer', name: '七海ひな' }],
  filters: [],
};

function serve(answer: () => Promise<Shortcuts> | Shortcuts, read: Shortcuts, writes: Record<string, unknown>[]) {
  vi.stubGlobal('fetch', vi.fn(async (_url: string, init?: RequestInit) => {
    if (!init?.body) return { ok: true, status: 200, json: async () => read };
    writes.push(JSON.parse(String(init.body)));
    return { ok: true, status: 200, json: async () => await answer() };
  }));
}

async function openCell(person = performer, kind = 'performer') {
  const onOpen = vi.fn();
  const host = await mount(<QueryClientProvider client={queryClient}>
    <IdentityCell kind={kind} person={person} onOpen={onOpen} />
  </QueryClientProvider>);
  await settle();
  return { host, onOpen };
}

describe('身份格收藏', () => {
  it('读出已有收藏，点星标先翻状态，成功回执后保持，整格点击另行打开', async () => {
    const answer = pending<Shortcuts>();
    const writes: Record<string, unknown>[] = [];
    serve(() => answer.answer, favorite, writes);
    const { host, onOpen } = await openCell();
    const star = host.querySelector<HTMLButtonElement>('[data-id-favorite]')!;
    expect(star.tagName).toBe('BUTTON');
    expect(star.getAttribute('aria-pressed')).toBe('true');
    expect(star.getAttribute('aria-label')).toBe('取消收藏七海ひな');
    expect(star.closest('[data-id-cell]')).toBeNull();
    await click(star);
    expect(star.getAttribute('aria-pressed')).toBe('false');
    expect(onOpen).not.toHaveBeenCalled();
    expect(writes[0]).toMatchObject({ action: 'favorite', entity_id: 7, kind: 'performer', on: false });
    await answer.release({ favorites: [], filters: [] });
    await settle();
    expect(star.getAttribute('aria-pressed')).toBe('false');
    await click(host.querySelector('[data-id-cell="performer"]'));
    expect(onOpen).toHaveBeenCalledWith('performer', '七海ひな');
  });

  it('写失败退回原状态并进通知栈', async () => {
    const writes: Record<string, unknown>[] = [];
    const failure = pending<unknown>();
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init?.body) return { ok: true, status: 200, json: async () => favorite };
      writes.push(JSON.parse(String(init.body)));
      await failure.answer;
      return { ok: false, status: 500, json: async () => ({ error: '收藏没写上' }) };
    }));
    const { host } = await openCell();
    const star = host.querySelector<HTMLButtonElement>('[data-id-favorite]')!;
    await click(star);
    expect(star.getAttribute('aria-pressed')).toBe('false');
    await failure.release(null);
    await settle();
    expect(star.getAttribute('aria-pressed')).toBe('true');
    expect(showToast).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ alert: true }));
  });

  it('非女优身份格没有星标，未登记的姓名格也只是文字', async () => {
    const studio = { id: 5, name: '示例厂牌' } as DetailEntityRef;
    const { host } = await openCell(studio, 'studio');
    expect(host.querySelector('[data-id-cell="studio"]')?.tagName).toBe('BUTTON');
    expect(host.querySelector('[data-id-favorite]')).toBeNull();
    const unnamed = { id: null, name: '未登记' } as DetailEntityRef;
    const second = await openCell(unnamed, 'performer');
    expect(second.host.querySelector('[data-id-cell="performer"]')?.tagName).toBe('SPAN');
    expect(second.host.querySelector('[data-id-favorite]')).toBeNull();
  });
});
