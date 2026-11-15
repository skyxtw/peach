import { afterEach, describe, expect, it, vi } from 'vitest';
import { timelineFrame } from '../src/player/timeline';
import { mountPlayerSeekPreview } from '../src/player/controls';
import { createSeekPreview, PRELOAD_PAGES, preloadPages, previewCenter, sheetTile } from '../src/player/seek-preview';
import type { VjsPlayer } from '../src/player/types';

afterEach(() => { vi.unstubAllGlobals(); document.body.replaceChildren() });

const settle = () => new Promise(resolve => setTimeout(resolve, 0));

function stubTimeline(payload: object) {
  const fetch = vi.fn(async (_url: string) => new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } }));
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

/** 进度条宿主：宽 `track`，预览实测宽 `width`。 */
function seekHost(track: number, width = 0) {
  const host = document.createElement('div');
  document.body.append(host);
  host.getBoundingClientRect = () => ({ width: track, left: 0 } as DOMRect);
  const measured = () => {
    const preview = host.querySelector<HTMLElement>('[data-player-seek-preview]')!;
    Object.defineProperty(preview, 'offsetWidth', { configurable: true, get: () => width });
    return preview;
  };
  return { host, measured };
}

function stubImages() {
  const loaded: string[] = [];
  vi.stubGlobal('Image', class { decoding = ''; dataset: Record<string, string> = {}; set src(value: string) { loaded.push(value) } });
  return loaded;
}

function loadPreviewImage(host: ParentNode) {
  const image = host.querySelector('img')!;
  Object.defineProperty(image, 'complete', { configurable: true, value: true });
  Object.defineProperty(image, 'naturalWidth', { configurable: true, value: 320 });
  Object.defineProperty(image, 'naturalHeight', { configurable: true, value: 180 });
  image.dispatchEvent(new Event('load'));
}

describe('时间到雪碧图坐标', () => {
  it('固定间隔按页与格换算，末张按自身帧数算行数', () => {
    const sheet = { frames: 250, interval: 10, columns: 10, rows: 10 };
    expect(sheetTile(0, sheet)).toEqual({ page: 0, slot: 0, columns: 10, rows: 10 });
    expect(sheetTile(1055, sheet)).toEqual({ page: 1, slot: 5, columns: 10, rows: 10 });
    expect(sheetTile(2499, sheet)).toEqual({ page: 2, slot: 49, columns: 10, rows: 5 });
    expect(sheetTile(99999, sheet)).toEqual({ page: 2, slot: 49, columns: 10, rows: 5 });
  });
  it('非 10×10 的拼图按自身列数换算，未覆盖的时刻没有格子', () => {
    expect(sheetTile(65, { frames: 30, interval: 5, columns: 5, rows: 4 })).toEqual({ page: 0, slot: 13, columns: 5, rows: 4 });
    expect(sheetTile(100, { frames: 30, interval: 5, columns: 5, rows: 4 })).toEqual({ page: 1, slot: 0, columns: 5, rows: 2 });
    expect(sheetTile(5, { frames: 1, interval: 0, cues: [[0, 3]] })).toBeNull();
  });
  it('只预热页数可数的自有接触印相', () => {
    expect(preloadPages({ frames: 250, interval: 10 })).toBe(3);
    expect(preloadPages({ frames: 2, interval: 0, cues: [[0, 3], [3, 6]] })).toBe(0);
    expect(preloadPages({ source: 'jellyfin', frames: 250, interval: 10 })).toBe(0);
    expect(preloadPages({ frames: 100 * PRELOAD_PAGES + 1, interval: 10 })).toBe(0);
    expect(preloadPages(null)).toBe(0);
  });
});

describe('边缘对齐', () => {
  it('中心点跟着指针，两端整块留在进度条里', () => {
    expect(previewCenter(300, 600, 240)).toBe(300);
    expect(previewCenter(10, 600, 240)).toBe(120);
    expect(previewCenter(595, 600, 240)).toBe(480);
    expect(previewCenter(30, 200, 240)).toBe(100);
  });
  it('进度条贴着视口边时两端各让出边距', () => {
    expect(previewCenter(10, 600, 240, 12)).toBe(132);
    expect(previewCenter(595, 600, 240, 12)).toBe(468);
    expect(previewCenter(30, 250, 240, 12)).toBe(125);
  });
  it('按显出来之后的实测宽度夹边，不按估算宽度', async () => {
    stubTimeline({});
    const { host, measured } = seekHost(600, 244);
    const preview = createSeekPreview(host, { id: 7, width: 1920, height: 1080, has_thumb: true });
    const element = measured();
    preview.show(0, 100);
    expect(element.hidden).toBe(false);
    loadPreviewImage(host);
    expect(element.style.left).toBe('122px');
    preview.show(1, 100);
    expect(element.style.left).toBe('478px');
    preview.show(.5, 100);
    expect(element.style.left).toBe('300px');
  });
});

describe('无时间轴图降级', () => {
  it('没有索引也没有快照时只显示时间，不取任何图', async () => {
    const fetch = stubTimeline({});
    const { host, measured } = seekHost(900, 160);
    const preview = createSeekPreview(host, { id: 7, has_thumb: false });
    const element = measured();
    await settle();
    preview.show(.5, 600);
    expect(host.querySelector('img')!.hasAttribute('src')).toBe(false);
    expect(host.querySelector<HTMLElement>('.vjs-peach-seek-frame')!.hidden).toBe(true);
    expect(element.hidden).toBe(false);
    expect(element.querySelector('span')!.textContent).toBe('5:00');
    expect(fetch.mock.calls.map(([url]) => url)).toEqual(['/api/timeline?id=7']);
  });
  it('已有九宫格成功后显示，取不到图时只剩时间且不再请求', async () => {
    const fetch = stubTimeline({});
    const { host, measured } = seekHost(900, 160);
    const preview = createSeekPreview(host, { id: 7, has_thumb: true });
    const element = measured();
    await settle();
    expect(fetch).toHaveBeenCalledTimes(1);
    preview.show(.05, 600);
    const frame = host.querySelector<HTMLElement>('.vjs-peach-seek-frame')!, image = host.querySelector('img')!;
    expect(image.getAttribute('src')).toBe('/poster?id=7&c=0');
    expect(element.hidden).toBe(false);
    loadPreviewImage(host);
    expect(element.hidden).toBe(false);
    preview.hide();
    loadPreviewImage(host);
    expect(element.hidden).toBe(true);
    preview.show(.05, 600);
    image.dispatchEvent(new Event('error'));
    preview.show(.95, 600);
    expect(image.getAttribute('src')).toBe('/poster?id=7&c=0');
    expect(frame.hidden).toBe(true);
    expect(element.hidden).toBe(false);
    expect(element.querySelector('span')!.textContent).toBe('9:30');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('关注条目不取图、不查索引，只显示时间', () => {
    const fetch = stubTimeline({});
    const { host } = seekHost(600);
    createSeekPreview(host, null).show(.5, 120);
    expect(host.querySelector('.vjs-peach-seek-frame')).toBeNull();
    expect(host.querySelector<HTMLElement>('[data-player-seek-preview]')!.hidden).toBe(false);
    expect(host.querySelector('[data-player-seek-preview] span')!.textContent).toBe('1:00');
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('雪碧图预加载', () => {
  it('碰到进度条才预热，每页只取一次', async () => {
    stubTimeline({ source: 'peach', frames: 250, interval: 10, columns: 10, rows: 10 });
    const loaded = stubImages();
    const { host } = seekHost(600);
    const preview = createSeekPreview(host, { id: 9 });
    await settle();
    expect(loaded).toEqual([]);
    preview.prime(); preview.prime();
    preview.show(.2, 2500); preview.show(.8, 2500);
    expect(loaded).toEqual(['/timeline?id=9&s=0&source=peach', '/timeline?id=9&s=1&source=peach', '/timeline?id=9&s=2&source=peach']);
  });
  it('外部逐帧来源不预热，自有缓存作为兜底照样预热', async () => {
    stubTimeline({ source: 'bif', frames: 3, interval: 0, cues: [[0, 10], [10, 20], [20, 30]],
      fallback: { source: 'peach', frames: 3, interval: 10, columns: 10, rows: 10 } });
    const loaded = stubImages();
    const { host } = seekHost(600);
    const preview = createSeekPreview(host, { id: 9 });
    preview.prime();
    await settle();
    expect(loaded).toEqual(['/timeline?id=9&s=0&source=peach']);
  });
});

describe('Video.js 进度条接线', () => {
  function mounted() {
    stubTimeline({});
    const root = document.createElement('div');
    root.innerHTML = '<div class="vjs-control-bar"><div class="vjs-peach-time-text"></div><div class="vjs-progress-control"></div></div>';
    document.body.append(root);
    const progress = root.querySelector<HTMLElement>('.vjs-progress-control')!;
    progress.getBoundingClientRect = () => ({ width: 300, left: 0 } as DOMRect);
    const player = { el: () => root, duration: () => 30, on: () => {}, trigger: () => {} } as unknown as VjsPlayer;
    mountPlayerSeekPreview(player, { id: 42, duration: 30, has_thumb: true });
    const preview = progress.querySelector<HTMLElement>('[data-player-seek-preview]')!;
    const timeText = root.querySelector<HTMLElement>('.vjs-peach-time-text')!;
    const scrub = progress.querySelector<HTMLElement>('.vjs-peach-scrub-time')!;
    const fire = (type: string, x: number, pointerType: string) => {
      progress.dispatchEvent(new PointerEvent(type, { clientX: x, pointerType, bubbles: true }));
      loadPreviewImage(progress);
    };
    return { preview, fire, timeText, scrub };
  }
  it('触屏按住拖动时显示，时间胶囊和下方时间跟着走，松手收起', () => {
    const { preview, fire, timeText, scrub } = mounted();
    fire('pointerdown', 150, 'touch');
    expect(preview.hidden).toBe(false);
    expect(preview.querySelector('span')!.textContent).toBe('0:15');
    expect(timeText.textContent).toBe('0:15 / 0:30');
    expect(scrub.hidden).toBe(false);
    expect(scrub.textContent).toBe('0:15');
    fire('pointermove', 270, 'touch');
    expect(preview.querySelector('span')!.textContent).toBe('0:27');
    expect(timeText.textContent).toBe('0:27 / 0:30');
    expect(scrub.textContent).toBe('0:27');
    fire('pointerup', 270, 'touch');
    expect(preview.hidden).toBe(true);
    expect(scrub.hidden).toBe(true);
  });
  it('鼠标松开仍在悬停，预览留着；离开进度条才收起', () => {
    const { preview, fire } = mounted();
    fire('pointermove', 30, 'mouse');
    fire('pointerup', 30, 'mouse');
    expect(preview.hidden).toBe(false);
    fire('pointerleave', 30, 'mouse');
    expect(preview.hidden).toBe(true);
  });
});

describe('索引晚于悬停到达', () => {
  it('指针停着不动也换成拼图那一格，图到了就显示；已离开则不显示', async () => {
    stubTimeline({ source: 'peach', frames: 20, interval: 1, columns: 10, rows: 10 });
    const { host, measured } = seekHost(900, 160);
    const preview = createSeekPreview(host, { id: 7, width: 1920, height: 1080, has_thumb: false });
    const element = measured(), image = host.querySelector('img')!;
    preview.show(.65, 20);
    expect(image.hasAttribute('src')).toBe(false);
    expect(element.hidden).toBe(false);
    expect(element.querySelector('span')!.textContent).toBe('0:13');
    await settle();
    expect(image.getAttribute('src')).toBe('/timeline?id=7&s=0&source=peach');
    expect([image.style.left, image.style.top]).toEqual(['-300%', '-100%']);
    loadPreviewImage(host);
    expect(element.hidden).toBe(false);

    stubTimeline({ source: 'peach', frames: 20, interval: 1, columns: 10, rows: 10 });
    const late = seekHost(900, 160);
    const left = createSeekPreview(late.host, { id: 8, has_thumb: false });
    const leftElement = late.measured();
    left.show(.65, 20);
    left.hide();
    await settle();
    expect(late.host.querySelector('img')!.hasAttribute('src')).toBe(false);
    expect(leftElement.hidden).toBe(true);
  });
});

describe('时间轴索引', () => {
  it('按预览自身的非均匀时间选择帧，并保留未覆盖区间', () => {
    const source = { frames: 3, interval: 0, cues: [[0, 3.5], [3.5, 7], [10, 15]] as [number, number][] };
    expect([0, 3.4, 3.5, 7, 9, 10, 15, 16].map(time => timelineFrame(time, source)))
      .toEqual([0, 0, 1, null, null, 2, 2, null]);
  });
  it('按固定间隔选择接触印相中的帧', () => {
    const source = { frames: 120, interval: 10 };
    expect([0, 9, 10, 999, 1000, 1500].map(time => timelineFrame(time, source)))
      .toEqual([0, 0, 1, 99, 100, 119]);
  });
  it('无效索引和时刻返回空值', () => {
    expect(timelineFrame(-1, { frames: 2, interval: 10 })).toBeNull();
    expect(timelineFrame(Infinity, { frames: 2, interval: 10 })).toBeNull();
    expect(timelineFrame(0, { frames: 0, interval: 10 })).toBeNull();
    expect(timelineFrame(0, { frames: 2, interval: 0 })).toBeNull();
    expect(timelineFrame(1, { frames: 1, interval: 0, cues: [[2, 4]] })).toBeNull();
  });
  it('预览控件使用准确来源，在空隙与图片失败时读取已有缓存', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      source: 'webvtt', frames: 2, interval: 0, columns: 1, rows: 1, cues: [[0, 3], [8, 12]],
      fallback: { source: 'peach', frames: 3, interval: 10, columns: 10, rows: 10 },
    }), { headers: { 'Content-Type': 'application/json' } })));
    const root = document.createElement('div');
    root.innerHTML = '<div class="vjs-control-bar"><div class="vjs-progress-control"></div></div>';
    document.body.append(root);
    const progress = root.querySelector<HTMLElement>('.vjs-progress-control')!;
    progress.getBoundingClientRect = () => ({ width: 300, left: 0 } as DOMRect);
    const player = { el: () => root, duration: () => 30, on: () => {} } as unknown as VjsPlayer;
    mountPlayerSeekPreview(player, { id: 42, duration: 30, width: 1920, height: 1080, has_thumb: true });
    await new Promise(resolve => setTimeout(resolve, 0));
    const image = root.querySelector('img')!;
    const move = (x: number) => progress.dispatchEvent(new PointerEvent('pointermove', { clientX: x, pointerType: 'mouse' }));
    move(90);
    expect(image.getAttribute('src')).toBe('/timeline?id=42&s=1&source=webvtt');
    expect(image.style.width).toBe('100%');
    move(200);
    expect(image.getAttribute('src')).toBe('/timeline?id=42&s=0&source=peach');
    expect(image.style.left).toBe('-200%');
    move(90);
    image.dispatchEvent(new Event('error'));
    move(90);
    expect(image.getAttribute('src')).toBe('/timeline?id=42&s=0&source=peach');
    image.dispatchEvent(new Event('error'));
    move(90);
    expect(image.getAttribute('src')).toBe('/poster?id=42&c=2');
  });
});
