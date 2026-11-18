/* 播放位置属于当前浏览器的续播状态；观看统计仍由 ledger 的活动接口累计。 */
import { realDuration } from '@peach/legacy/core';

import type { PlayerItem } from './types';

const KEY = 'peach.playback-position.v1';
const EXTERNAL_KEY = 'peach.external-playback.v1';
const tracking = new WeakMap<HTMLVideoElement, () => void>();

export function stopPlaybackPosition(video: HTMLVideoElement): void {
  tracking.get(video)?.();
  tracking.delete(video);
}

export function playbackKey(kind: 'item' | 'follow', item: PlayerItem, media: number | null = null): string {
  const follow = kind === 'follow' ? item.id : item.location === 'online' ? item.follow_item_id : null;
  return follow ? `follow:${follow}:${media ?? 'main'}` : `item:${item.id}`;
}

interface StoredPosition { time: number; at: number }

function storedPosition(key: string): StoredPosition | null {
  try {
    const raw = localStorage.getItem(`${KEY}:${key}`);
    if (raw === null || !raw.trim()) return null;
    try {
      const parsed = JSON.parse(raw) as { time?: unknown; at?: unknown };
      const time = Number(parsed?.time), at = Number(parsed?.at);
      if (Number.isFinite(time) && time >= 0) return { time, at: Number.isFinite(at) && at > 0 ? at : 0 };
      return null;
    } catch { /* 旧记录是纯数字。 */ }
    const legacy = Number(raw);
    return Number.isFinite(legacy) && legacy >= 0 ? { time: legacy, at: 0 } : null;
  } catch { return null }
}

function epochSeconds(value: unknown): number {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  const parsed = Date.parse(String(value ?? '').replace(' ', 'T'));
  return Number.isFinite(parsed) ? parsed / 1000 : 0;
}

function externalLaunchAt(key: string): number {
  try {
    const at = Number(localStorage.getItem(`${EXTERNAL_KEY}:${key}`));
    return Number.isFinite(at) && at > 0 ? at : 0;
  } catch { return 0 }
}

/** 外部播放器确实接上进度回传时记一笔：下次网页续播要认它写进 ledger 的关闭点。 */
export function markExternalPlayback(key: string): void {
  try { localStorage.setItem(`${EXTERNAL_KEY}:${key}`, String(Date.now() / 1000)) } catch { /* 存储不可用不阻断播放。 */ }
}

/** 打开时从哪一秒接着播。离片尾不到 `restartPercent`% 的算看完，从头播：停在片尾字幕前关掉的，
 *  下次不会落在片尾。时长未知时照原位置接。外部播放器接过进度时先按 ledger 的关闭点算。 */
export function playbackPosition(key: string, item: PlayerItem, restartPercent = 0): number {
  const duration = realDuration(item.duration);
  const stored = storedPosition(key);
  const ratio = Number(item.leave_ratio);
  const fromRatio = ratio > 0 && ratio < 1 ? ratio * duration : 0;
  let time = stored !== null ? stored.time : fromRatio;
  if (stored && externalLaunchAt(key)) {
    const serverAt = epochSeconds(item.last_played);
    if (serverAt > Math.max(externalLaunchAt(key), stored.at)) time = ratio >= 1 ? 0 : fromRatio;
  }
  return restartPercent > 0 && duration > 0 && time >= duration * (1 - restartPercent / 100) ? 0 : time;
}

/** 元数据加载且定位完成后才登记，换源与销毁产生的零位置不覆盖续播状态。 */
export function trackPlaybackPosition(key: string, video: HTMLVideoElement): void {
  stopPlaybackPosition(video);
  let ready = video.readyState >= 1;
  const save = () => {
    if (!ready || !Number.isFinite(video.currentTime)) return;
    const time = video.ended ? 0 : Math.max(0, video.currentTime);
    try {
      localStorage.setItem(`${KEY}:${key}`, JSON.stringify({ time, at: Date.now() / 1000 }));
    } catch { /* 存储不可用不阻断播放。 */ }
  };
  const loaded = () => { ready = true };
  const empty = () => { ready = false };
  video.addEventListener('loadedmetadata', loaded);
  video.addEventListener('emptied', empty);
  for (const event of ['timeupdate', 'seeked', 'pause', 'ended']) video.addEventListener(event, save);
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', save);
  tracking.set(video, () => {
    save();
    video.removeEventListener('loadedmetadata', loaded);
    video.removeEventListener('emptied', empty);
    for (const event of ['timeupdate', 'seeked', 'pause', 'ended']) video.removeEventListener(event, save);
    window.removeEventListener('pagehide', save);
    document.removeEventListener('visibilitychange', save);
  });
}
