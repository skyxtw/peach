/* 舞台控制条的快退/快进与触屏双击：不挂真 Video.js，只验控件、步长和点击/双击路径。 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mountPlayerSeekControls, mountPlayerTouchSeek } from '../src/player/controls';
import { configurePlayer } from '../src/player/host';
import type { VjsPlayer } from '../src/player/types';

const host = (seekSeconds = 10, longPressSpeed = 2) => ({
  settings: () => ({ ambientMode: false, theaterMode: false, seekSeconds, seekLargeSeconds: 60, longPressSpeed, fullscreenFit: 'contain' as const, miniplayer: true, detailAutoplay: false, javImage: 'cover' }),
  saveSettings: () => {}, toast: () => {}, loadSourceStatus: async () => ({}), offlineReason: () => '', stage: () => null,
});

function setup(seekSeconds = 10, longPressSpeed = 2) {
  const stage = document.createElement('div');
  document.body.append(stage);
  configurePlayer({ ...host(seekSeconds, longPressSpeed), stage: () => stage });
  const root = document.createElement('div');
  root.className = 'video-js';
  const bar = document.createElement('div');
  bar.className = 'vjs-control-bar';
  const play = document.createElement('button');
  play.className = 'vjs-play-control';
  bar.append(play);
  const video = document.createElement('video');
  Object.defineProperty(video, 'duration', { configurable: true, value: 90 });
  video.currentTime = 50;
  root.append(bar, video);
  stage.append(root);
  root.getBoundingClientRect = () => ({ left: 0, top: 0, right: 400, bottom: 300, width: 400, height: 300, x: 0, y: 0, toJSON: () => ({}) });
  let rate = 1;
  const player = { el: () => root, on: vi.fn(),
    playbackRate: (value?: number) => { if (value === undefined) return rate; rate = value; return rate } } as unknown as VjsPlayer;
  return { root, bar, video, player, rate: () => rate };
}

function pointer(type: string, x: number, pointerType = 'touch') {
  const event = new Event(type, { bubbles: true }) as PointerEvent;
  Object.defineProperties(event, { pointerType: { value: pointerType }, clientX: { value: x }, clientY: { value: 100 } });
  return event;
}

afterEach(() => { document.body.innerHTML = ''; vi.useRealTimers() });

describe('舞台快退/快进按钮', () => {
  it('按 seekSeconds 的步长插入两枚键，点击只改当前视频位置', () => {
    const { video, player, bar } = setup(15);
    mountPlayerSeekControls(player, bar);
    const back = bar.querySelector<HTMLButtonElement>('[data-player-seek="back"] button')!;
    const ahead = bar.querySelector<HTMLButtonElement>('[data-player-seek="forward"] button')!;
    expect(back.getAttribute('aria-label')).toBe('后退 15 秒');
    expect(ahead.getAttribute('aria-label')).toBe('前进 15 秒');
    back.click();
    expect(video.currentTime).toBe(35);
    ahead.click();
    expect(video.currentTime).toBe(50);
  });
});

describe('舞台触屏双击', () => {
  it('长按画面临时加速，松开恢复且不切播放', () => {
    vi.useFakeTimers();
    const { video, player, rate } = setup(10, 3);
    mountPlayerTouchSeek(player);
    video.dispatchEvent(pointer('pointerdown', 200));
    vi.advanceTimersByTime(500);
    expect(rate()).toBe(3);
    video.dispatchEvent(pointer('pointerup', 200));
    expect(rate()).toBe(1);
    expect(video.currentTime).toBe(50);
  });

  it('鼠标长按同样加速，普通点击仍交给原生播放路径', () => {
    vi.useFakeTimers();
    const { video, player, rate } = setup(10, 3);
    mountPlayerTouchSeek(player);
    video.dispatchEvent(pointer('pointerdown', 200, 'mouse'));
    vi.advanceTimersByTime(500);
    expect(rate()).toBe(3);
    video.dispatchEvent(pointer('pointerup', 200, 'mouse'));
    expect(rate()).toBe(1);
  });

  it('同侧两下按步长跳，左右半区方向相反', () => {
    const { video, player } = setup(10);
    mountPlayerTouchSeek(player);
    video.dispatchEvent(pointer('pointerdown', 320));
    video.dispatchEvent(pointer('pointerup', 320));
    video.dispatchEvent(pointer('pointerdown', 320));
    video.dispatchEvent(pointer('pointerup', 320));
    expect(video.currentTime).toBe(60);
    video.dispatchEvent(pointer('pointerdown', 80));
    video.dispatchEvent(pointer('pointerup', 80));
    video.dispatchEvent(pointer('pointerdown', 80));
    video.dispatchEvent(pointer('pointerup', 80));
    expect(video.currentTime).toBe(50);
  });
});
