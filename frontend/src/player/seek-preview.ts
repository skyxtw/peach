/* 进度条上方那块预览：指着哪一秒，就显示那一秒的画面和时间。详情、小窗与沉浸三处共用。
 *
 * 只认「宿主元素 + 进度比例」，不认事件：Video.js 的进度条和沉浸自绘的那条各自把指针换成比例
 * 交进来。时间轴采集铺好了接触印相就按它取格；取不到、且有快照时退回九宫格那九格，没有可用图就只显示时间。
 * 这里只读已经铺好的图，`/timeline` 不现抽，`/poster` 只从已有快照裁格、不读视频。 */
import { api, fmtClock } from '@peach/legacy/core';

import { timelineFrame, type TimelineSheets } from './timeline';

export interface SeekPreviewItem {
  id?: number | string;
  width?: number | null;
  height?: number | null;
  /** 有九宫格快照（与卡片悬停同一判据）；没有就不退回九宫格，免得每格去撞 404。 */
  has_thumb?: unknown;
}

/** 一帧落在第几张接触印相、第几格；`rows` 是这一张自己的行数。 */
export interface SheetTile { page: number; slot: number; columns: number; rows: number }

/** 自有接触印相按页预热的上限：两小时的片子 10 秒一帧是 8 张，再长的按需取。 */
export const PRELOAD_PAGES = 12;

export function sheetTile(seconds: number, sheet: TimelineSheets): SheetTile | null {
  const index = timelineFrame(seconds, sheet);
  if (index === null) return null;
  const columns = sheet.columns || 10, per = columns * (sheet.rows || 10);
  const page = Math.floor(index / per);
  // 末张通常不满 10 行，行数按它自己那几帧反算：按满行去铺，格子会落到图外面的空白上。
  return { page, slot: index % per, columns, rows: Math.ceil(Math.min(per, sheet.frames - page * per) / columns) };
}

/** 预览中心点：跟着指针，但整块留在进度条里，两端各让出 `inset`。放不下时居中。 */
export function previewCenter(pointer: number, track: number, width: number, inset = 0): number {
  if (width + inset * 2 >= track) return track / 2;
  return Math.min(track - inset - width / 2, Math.max(inset + width / 2, pointer));
}

/** 只预热 Peach 自有接触印相：页数可数。外部来源的 `s` 是帧号、一帧一图，可能几百张，按需取。 */
export function preloadPages(sheet: TimelineSheets | null | undefined): number {
  if (!sheet || (sheet.source || 'peach') !== 'peach' || sheet.cues?.length || !(sheet.interval > 0) || sheet.frames <= 0) return 0;
  const pages = Math.ceil(sheet.frames / ((sheet.columns || 10) * (sheet.rows || 10)));
  return pages <= PRELOAD_PAGES ? pages : 0;
}

export interface SeekPreview {
  /** 指针进了进度条或开始拖：此时才预热整片的接触印相，没碰进度条的播放不多下载。 */
  prime(): void;
  /** `ratio` 是进度比例，`duration` 是整片秒数。 */
  show(ratio: number, duration: number): void;
  hide(): void;
  dispose(): void;
}

/** `inset`：进度条贴着视口边时（沉浸），预览离两端留的距离；Video.js 的进度条本身已经内缩。 */
export function createSeekPreview(host: HTMLElement, item: SeekPreviewItem | null,
  options: { thumbnail?: boolean; inset?: number } = {}): SeekPreview {
  const hasThumbnail = !!item?.id && options.thumbnail !== false;
  const preview = document.createElement('div');
  preview.className = 'vjs-peach-seek-preview'; preview.dataset.playerSeekPreview = ''; preview.hidden = true;
  preview.innerHTML = `${hasThumbnail ? '<i class="vjs-peach-seek-frame" hidden><img alt=""></i>' : ''}<span class="mono">0:00</span>`;
  host.append(preview);
  const frame = preview.querySelector<HTMLElement>('.vjs-peach-seek-frame');
  const image = preview.querySelector('img'), label = preview.querySelector('span')!;
  const id = encodeURIComponent(String(item?.id ?? ''));
  const aspect = (width: number, height: number) => { frame?.style.setProperty('--seek-aspect', String(width / height)) };
  if (item?.width && item.height) aspect(item.width, item.height);
  let sheets: TimelineSheets | null = null, shown = '', indexedImage = false, cell = -1, primed = false, disposed = false;
  let active = false, pointer = 0, span = 0;
  const paint = () => {
    preview.hidden = disposed || !active;
    if (preview.hidden) return;
    /* 没有图时只显示时间：浮层不能因为图没取到就一起消失。 */
    const ready = !!frame && !frame.hidden && !!image?.complete && !!image.naturalWidth;
    if (frame) frame.style.display = ready ? '' : 'none';
    const track = host.getBoundingClientRect().width;
    preview.style.left = `${previewCenter(pointer * track, track, preview.offsetWidth, options.inset)}px`;
  };
  /* 九宫格一格取不到，多半是快照没了：九格同源，不再逐格去试。 */
  let posterless = item?.has_thumb !== true;
  const warm: HTMLImageElement[] = [];
  const sheetSource = (sheet: TimelineSheets, page: number) =>
    `/timeline?id=${id}&s=${page}&source=${encodeURIComponent(sheet.source || 'peach')}`;
  const preload = () => {
    if (!primed || !sheets) return;
    for (const sheet of [sheets, sheets.fallback]) {
      for (let page = 0; page < preloadPages(sheet); page++) {
        const source = sheetSource(sheet!, page);
        if (warm.some((img) => img.dataset.source === source)) continue;
        const img = new Image(); img.decoding = 'async'; img.dataset.source = source; img.src = source;
        warm.push(img);
      }
    }
  };
  if (frame) {
    (api(`/api/timeline?id=${id}`) as Promise<TimelineSheets | null>).then((meta) => {
      if (disposed || !meta || !(meta.frames > 0) || !(meta.interval > 0 || meta.cues?.length)) return;
      sheets = meta; preload();
      // 指针先停在进度条上、索引后到：按停着的位置换成拼图那一格，不等下一次移动。
      if (active) show(pointer, span);
    }).catch(() => {});
  }
  const showSheetFrame = (seconds: number, sheet: TimelineSheets) => {
    const tile = sheetTile(seconds, sheet);
    if (!tile || !frame || !image) return false;
    indexedImage = !!sheet.cues;
    // 外部逐帧图按图片自身比例取景（见 `onload`）；回到拼图时取景框回到片源比例。
    if (!indexedImage && item?.width && item.height) aspect(item.width, item.height);
    const source = sheetSource(sheet, tile.page);
    if (source !== shown) { shown = source; image.src = source }
    frame.hidden = false;
    // 取景框按片源比例，图按格子铺满：两边比例一致，`fill` 才既不裁也不拉。
    image.style.objectFit = 'fill';
    image.style.width = `${tile.columns * 100}%`; image.style.height = `${tile.rows * 100}%`;
    image.style.left = `${-(tile.slot % tile.columns) * 100}%`; image.style.top = `${-Math.floor(tile.slot / tile.columns) * 100}%`;
    return true;
  };
  const showPoster = (ratio: number) => {
    if (!frame || !image) return;
    if (posterless) { frame.hidden = true; return }
    const next = Math.min(8, Math.floor(ratio * 9));
    if (next === cell && shown === `poster:${next}`) return;
    cell = next; frame.hidden = false; image.removeAttribute('style');
    indexedImage = false; shown = `poster:${next}`;
    image.src = `/poster?id=${id}&c=${next}`;
  };
  if (image && frame) {
    image.onerror = () => {
      if (shown.startsWith('poster:')) posterless = true;
      frame.hidden = true; sheets = indexedImage ? sheets?.fallback || null : null; shown = ''; cell = -1;
      paint();
    };
    image.onload = () => {
      if (indexedImage && image.naturalWidth && image.naturalHeight) aspect(image.naturalWidth, image.naturalHeight);
      paint();
    };
  }
  const show = (ratio: number, duration: number) => {
    if (!duration || disposed) { active = false; paint(); return }
    const clamped = Math.min(1, Math.max(0, ratio)), seconds = duration * clamped;
    active = true; pointer = clamped; span = duration;
    label.textContent = fmtClock(seconds);
    if (frame && !(sheets && showSheetFrame(seconds, sheets)) && !(sheets?.fallback && showSheetFrame(seconds, sheets.fallback))) {
      showPoster(clamped);
    }
    // 宽度按显出来之后的实测值夹边：框宽由样式按片源比例和视口定，这里不另算一套。
    paint();
  };
  return {
    prime() { if (!primed) { primed = true; preload() } },
    show,
    hide() { active = false; preview.hidden = true },
    dispose() { disposed = true; warm.length = 0; preview.remove() },
  };
}
