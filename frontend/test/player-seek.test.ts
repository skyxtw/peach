/* 舞台控制条的快退/快进与触屏双击：不挂真 Video.js，只验控件、步长和点击/双击路径。 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mountPlayerSeekControls, mountPlayerTouchSeek } from '../src/player/controls';
import { configurePlayer } from '../src/player/host';
import type { VjsPlayer } from '../src/player/types';

const host = (seekSeconds = 10) => ({
  settings: () => ({ ambientMode: false, theaterMode: false, seekSeconds, miniplayer: true, detailAutoplay: false, javImage: 'cover' }),
  saveSettings: () => {}, toast: () => {}, loadSourceStatus: async () => ({}), offlineReason: () => '', stage: () => null,
});

function setup(seekSeconds = 10) {
  const stage = document.createElement('div');
  document.body.append(stage);
  configurePlayer({ ...host(seekSeconds), stage: () => stage });
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
  const player = { el: () => root, on: vi.fn() } as unknown as VjsPlayer;
  return { root, bar, video, player };
}

function pointer(type: string, x: number) {
  const event = new Event(type, { bubbles: true }) as PointerEvent;
  Object.defineProperties(event, { pointerType: { value: 'touch' }, clientX: { value: x }, clientY: { value: 100 } });
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
