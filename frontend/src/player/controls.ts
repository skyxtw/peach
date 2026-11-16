/* 挂在 Video.js 控制条上的 Peach 控件：设置菜单（氛围模式、播放速度、清晰度）、影院模式键、
 * 控制条排版与形变图标、拖动预览、Media Session、转圈与外挂字幕，外加舞台的氛围光采样。
 *
 * 控件样式取自 YouTube delhi-modern（player 9470c977），每一块的出处写在它自己的函数上。 */
import { api, esc, fmtClock, icon, realDuration } from '@peach/legacy/core';

import { playerHost } from './host';
import { detailPlayer, resizeSoon } from './registry';
import { PLAYER_PANEL_EVENT } from './stats';
import type { PlayerItem, SourceQuality, VjsPlayer } from './types';
import { SubtitleControls, languageName, subtitleIcon } from './subtitles';
import { createSeekPreview, previewCenter } from './seek-preview';
import { mountPlayerRotation } from './rotation';
import { mountPlayerPipControl } from './pip';
import { mountPlaybackRate, playerMemory } from './memory';
import { seekVideoBy, toggleVideoPlayback } from './playback';
import { t } from '../i18n';

type TooltipSync = (label?: string, aria?: string) => void;

const SEEK_STEP_EVENT = 'peachseekstepchange';

/** 控制条上每个按钮的悬停提示都从这里出：文案 + 快捷键徽标，样式取自 YouTube delhi-modern。
 *  原生 title 与状态提示共用同一个同步入口。 */
export function playerControlTooltip(button: Element | null | undefined, label: string, shortcut = ''): TooltipSync {
  if (!button) return () => {};
  let tip = button.querySelector<HTMLElement>(':scope>.vjs-peach-tooltip');
  if (!tip) {
    tip = document.createElement('span'); tip.className = 'vjs-peach-tooltip'; tip.setAttribute('role', 'tooltip');
    tip.innerHTML = '<span class="vjs-peach-tooltip-text"></span><kbd hidden></kbd>';
    button.append(tip);
  }
  const text = tip.querySelector('.vjs-peach-tooltip-text')!, key = tip.querySelector('kbd')!;
  if (shortcut) button.setAttribute('aria-keyshortcuts', shortcut);
  const sync: TooltipSync = (nextLabel = label, aria = '') => {
    text.textContent = nextLabel; key.textContent = shortcut; key.hidden = !shortcut;
    button.setAttribute('aria-label', aria || nextLabel); button.removeAttribute('title');
  };
  sync(); return sync;
}

/** 快捷键复用按钮自己的点击路径：全屏、画中画、静音各有兜底逻辑挂在按钮上，在键盘分支里
 *  再实现一遍就会和按钮走岔。小窗里的播放器不在媒体框里，按 Video.js 自己的壳找控件条。 */
export function clickPlayerControl(video: Element | null, selector: string): void {
  video?.closest('.video-js')?.querySelector<HTMLElement>(`.vjs-control-bar ${selector}`)?.click();
}

export function applyAmbientMode(enabled: boolean, save = true): void {
  const host = playerHost(), settings = host.settings();
  settings.ambientMode = !!enabled; if (save) host.saveSettings();
  host.stage()?.toggleAttribute('data-ambient', settings.ambientMode);
  document.dispatchEvent(new CustomEvent('peachambientchange', { detail: { enabled: settings.ambientMode } }));
}

const theaterSyncs = new WeakMap<Element, TooltipSync>();

function syncPlayerTheaterButton(button: Element | null | undefined): void {
  if (!button) return;
  const theater = playerHost().settings().theaterMode;
  button.setAttribute('aria-pressed', String(theater));
  button.querySelector('use')?.setAttribute('href', theater ? '#i-theater-exit' : '#i-theater-enter');
  theaterSyncs.get(button)?.(theater ? t('catalog:playerControls.defaultView') : t('catalog:playerControls.theaterMode'));
}

export function applyTheaterMode(enabled: boolean, save = true): void {
  const host = playerHost(), settings = host.settings();
  settings.theaterMode = !!enabled; if (save) host.saveSettings();
  const stage = host.stage(); stage?.toggleAttribute('data-theater', settings.theaterMode);
  syncPlayerTheaterButton(stage?.querySelector('[data-player-theater]'));
  resizeSoon(detailPlayer());
}

/** 全屏画面三档：把偏好写到播放器根节点，CSS 按 `--peach-fullscreen-fit` 挑 object-fit。 */
export function applyFullscreenFit(player?: VjsPlayer | null): void {
  const root = (player ?? detailPlayer())?.el();
  if (!root) return;
  const fit = playerHost().settings().fullscreenFit;
  if (fit === 'contain') root.removeAttribute('data-peach-fullscreen-fit');
  else root.setAttribute('data-peach-fullscreen-fit', fit);
}

/** 氛围光：按画面平均色给舞台写 `--video-glow`。
 *
 *  取样有两条入口：播放中跟着帧回调走，`start` 则立刻取一帧。暂停的画面同样是一帧可画的图，
 *  只跟着帧回调走的话，暂停时关掉氛围模式就再也开不回来——关掉抹掉了光，而帧回调只在有新
 *  画面时才来。每条采样链带一个 run 号：暂停或页面隐藏时排队的那个回调可能永远不来，用一个
 *  「已排队」布尔判重会被它永久锁死；换成 run 号后旧回调醒来直接退出，链上永远只有一条在跑。 */
export function mountPlayerAmbient(video: HTMLVideoElement): () => void {
  const stage = playerHost().stage(), canvas = stage?.querySelector<HTMLCanvasElement>('[data-ambient-canvas]');
  if (!stage || !canvas) return () => {};
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return () => {};
  let stopped = false, last = 0, run = 0;
  let glow: number[] | null = null;
  const clear = () => { glow = null; ctx.clearRect(0, 0, canvas.width, canvas.height); stage.style.removeProperty('--video-glow') };
  const sample = () => {
    if (video.readyState < 2) return;
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < px.length; i += 16) { r += px[i]!; g += px[i + 1]!; b += px[i + 2]!; n++ }
      if (n) {
        const next = [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
        // 平均色的微小抖动保持稳定，继承色只在可见变化时刷新整座详情。
        if (!glow || next.some((value, index) => Math.abs(value - glow![index]!) >= 6)) {
          glow = next; stage.style.setProperty('--video-glow', `rgb(${next.join(' ')})`);
        }
      }
    } catch { /* 跨源画面取不到像素 */ }
  };
  const queue = (id: number) => {
    if (video.requestVideoFrameCallback) video.requestVideoFrameCallback((now) => paint(id, now));
    else requestAnimationFrame((now) => paint(id, now));
  };
  const paint = (id: number, now: number) => {
    if (stopped || id !== run) return;
    if (!playerHost().settings().ambientMode) { clear(); return }
    if (video.paused) return;
    if (!document.hidden && now - last > 480) { last = now; sample() }
    queue(id);
  };
  const start = () => { if (stopped || !playerHost().settings().ambientMode) return; sample(); if (!video.paused) queue(++run) };
  const onChange = (event: Event) => {
    const enabled = !!(event as CustomEvent<{ enabled: boolean }>).detail.enabled;
    stage.toggleAttribute('data-ambient', enabled);
    if (enabled) start(); else { run++; clear() }
  };
  document.addEventListener('peachambientchange', onChange);
  video.addEventListener('play', start); video.addEventListener('loadeddata', start); start();
  return () => {
    stopped = true; run++; document.removeEventListener('peachambientchange', onChange);
    video.removeEventListener('play', start); video.removeEventListener('loadeddata', start); clear();
  };
}

/** 设置菜单：氛围模式、播放速度、清晰度。返回的函数换掉来源清晰度表。
 *
 *  `sourceQualities` 是来源自己给的清晰度表（[{height,label}]，从高到低）。rule34video 把每档
 *  写成独立字段，videojs 的 qualityLevels 看不到它们——那套只认 HLS/DASH 的自适应轨道，而这里
 *  是四个各自独立的 mp4。所以由调用方查好再传进来。
 *
 *  `fallbackSize` 是账本记的宽高，视频还没读到尺寸时按它的短边写档位：竖屏 1080×1920 是 1080p。 */
export function mountPlayerQualityControl(
  player: VjsPlayer, video: HTMLVideoElement, fallbackSize: { width?: unknown; height?: unknown } = {}, initialSourceQualities: SourceQuality[] | null = null,
): ((next: SourceQuality[] | null) => void) | undefined {
  const controlBar = player.el().querySelector<HTMLElement>('.vjs-control-bar');
  if (!controlBar || controlBar.querySelector('[data-player-quality]')) return undefined;
  const root = document.createElement('div');
  root.className = 'vjs-peach-settings vjs-control'; root.dataset.playerQuality = '';
  root.innerHTML = `<button type="button" class="vjs-peach-settings-toggle" aria-label="${t('catalog:playerQuality.playerSettings')}" aria-expanded="false">
    ${icon('settings')}<span data-player-quality-badge hidden></span></button>`;
  const fullscreen = controlBar.querySelector('.vjs-fullscreen-control');
  controlBar.insertBefore(root, fullscreen || null);
  const toggle = root.querySelector('button')!, badge = root.querySelector<HTMLElement>('[data-player-quality-badge]')!;
  playerControlTooltip(toggle, t('catalog:playerQuality.settings'));
  const drawer = document.createElement('div');
  drawer.className = 'vjs-peach-settings-drawer'; drawer.dataset.playerSettingsDrawer = ''; drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = `<div class="vjs-peach-settings-head"><strong>${t('catalog:playerQuality.playerSettings')}</strong>
      <button type="button" class="vjs-peach-settings-close" data-player-settings-close aria-label="${t('catalog:playerQuality.closeSettings')}">×</button></div>
    <div class="vjs-peach-settings-tabs" role="tablist" aria-label="${t('catalog:playerQuality.playerSettings')}">
      <button type="button" class="vjs-peach-settings-tab" role="tab" data-player-settings-tab="play" aria-selected="true" tabindex="0">${t('catalog:playerQuality.tabPlayback')}</button>
      <button type="button" class="vjs-peach-settings-tab" role="tab" data-player-settings-tab="keys" aria-selected="false" tabindex="-1">${t('catalog:playerQuality.tabShortcuts')}</button>
    </div>
    <div class="vjs-peach-settings-menu" role="menu" aria-label="${t('catalog:playerQuality.playerSettings')}" aria-hidden="true"></div>`;
  player.el().append(drawer);
  const settingsTabs = [...drawer.querySelectorAll<HTMLElement>('[data-player-settings-tab]')];
  const syncTabs = (active: 'play' | 'keys') => {
    settingsTabs.forEach((tab) => {
      const selected = tab.dataset.playerSettingsTab === active;
      tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
    });
  };
  const menu = drawer.querySelector<HTMLElement>('.vjs-peach-settings-menu')!;
  const rotation = mountPlayerRotation(player, video);
  const rememberRate = mountPlaybackRate(player, video);
  const memory = playerMemory(player);
  let subtitleControls: SubtitleControls | undefined;
  const levels = typeof player.qualityLevels === 'function' ? player.qualityLevels() : null;
  let sourceQualities = initialSourceQualities;
  let selectedQuality = 'auto';
  const resolution = (width: unknown, height: unknown) => {
    const values = [Number(width), Number(height)].filter((value) => value > 0);
    return values.length ? Math.min(...values) : 0;
  };
  interface Row { key: string; label: string; pixels: number }
  const rows = (): Row[] => {
    const result: Row[] = [];
    if (levels?.length) {
      if (levels.length > 1) result.push({ key: 'auto', label: t('catalog:playerQuality.auto'), pixels: 0 });
      for (let index = 0; index < levels.length; index++) {
        const level = levels[index]!;
        const pixels = resolution(level.width, level.height)
          || (levels.length === 1 ? resolution(video.videoWidth, video.videoHeight) : 0);
        result.push({ key: String(index), label: pixels ? `${pixels}p` : (levels.length === 1 ? t('catalog:playerQuality.current') : t('catalog:playerQuality.stream', { number: index + 1 })), pixels });
      }
      return result;
    }
    if (sourceQualities?.length) {
      return sourceQualities.map((quality) => ({ key: `h${quality.height}`, label: quality.label || `${quality.height}p`, pixels: quality.height }));
    }
    const pixels = resolution(video.videoWidth, video.videoHeight) || resolution(fallbackSize.width, fallbackSize.height);
    return [{ key: 'original', label: pixels ? `${pixels}p` : t('catalog:playerQuality.original'), pixels }];
  };
  const qualityRows = () => {
    const options = rows();
    const active = options.find((option) => option.key === selectedQuality) || options[0]!;
    const playing = levels?.[levels.selectedIndex ?? -1];
    const activePixels = active.key === 'auto'
      ? resolution(playing?.width, playing?.height) || resolution(video.videoWidth, video.videoHeight)
      : active.pixels;
    badge.textContent = activePixels >= 2160 ? '4K' : activePixels >= 720 ? 'HD' : ''; badge.hidden = !badge.textContent;
    return { options, active };
  };
  const isOpen = () => menu.getAttribute('aria-hidden') !== 'true';
  const placeDrawer = () => {
    const stage = playerHost().stage();
    const mobile = player.el().classList.contains('vjs-peach-xsmall');
    const parent = mobile && stage ? stage : player.el();
    drawer.toggleAttribute('data-mobile', mobile);
    if (drawer.parentElement !== parent) parent.append(drawer);
  };
  const setOpen = (open: boolean) => {
    if (open) placeDrawer();
    menu.setAttribute('aria-hidden', String(!open)); drawer.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    if (!open) subtitleControls?.hide();
    if (open) document.dispatchEvent(new CustomEvent(PLAYER_PANEL_EVENT, { detail: 'settings' }));
  };
  const close = () => setOpen(false);
  drawer.querySelector('[data-player-settings-close]')!.addEventListener('click', () => { close(); toggle.focus() });
  const closeSettingsForOtherPanel = (event: Event) => { if ((event as CustomEvent<string>).detail !== 'settings') close() };
  document.addEventListener(PLAYER_PANEL_EVENT, closeSettingsForOtherPanel);
  /* 面板之间的切换照 YouTube 播放器 9470c977 的 www-player.css：popup 自己 .25s
     cubic-bezier(.4,0,.2,1) 改高度，旧面板往来的方向滑出、新面板从去的方向滑入。
     旧面板必须先脱离布局再滑，否则两块内容会在动画期间把菜单撑成两倍高；高度也得
     先钉在旧值、下一帧再写新值，同一帧写两次只会直接跳到新值，看不到过渡。 */
  const PANEL_MS = 250;
  let panelTimer: ReturnType<typeof setTimeout> | null = null;
  let panelRun = 0;
  const renderPanel = (html: string, direction: number): HTMLElement => {
    const run = ++panelRun;
    if (panelTimer) {
      clearTimeout(panelTimer); panelTimer = null;
      menu.classList.remove('vjs-peach-popup-animating'); menu.style.height = '';
    }
    menu.querySelectorAll('.vjs-peach-panel-leaving').forEach(panel => panel.remove());
    menu.scrollTop = 0;
    const current = menu.querySelector<HTMLElement>('.vjs-peach-panel');
    const next = document.createElement('div'); next.className = 'vjs-peach-panel'; next.innerHTML = html;
    if (!current || !direction || !isOpen() || matchMedia('(prefers-reduced-motion:reduce)').matches) { menu.replaceChildren(next); menu.style.height = ''; return next }
    const from = menu.getBoundingClientRect().height;
    current.classList.add('vjs-peach-panel-leaving'); current.inert = true; current.setAttribute('aria-hidden', 'true');
    next.classList.add(direction > 0 ? 'vjs-peach-panel-animate-forward' : 'vjs-peach-panel-animate-back');
    menu.append(next); menu.style.height = `${from}px`;
    const to = next.scrollHeight;
    requestAnimationFrame(() => {
      if (run !== panelRun) return;
      menu.classList.add('vjs-peach-popup-animating'); menu.style.height = `${to}px`;
      next.classList.remove('vjs-peach-panel-animate-forward', 'vjs-peach-panel-animate-back');
      current.classList.add(direction > 0 ? 'vjs-peach-panel-animate-back' : 'vjs-peach-panel-animate-forward');
      panelTimer = setTimeout(() => {
        panelTimer = null; current.remove();
        menu.classList.remove('vjs-peach-popup-animating'); menu.style.height = '';
      }, PANEL_MS);
    });
    return next;
  };
  const button = (panel: HTMLElement, selector: string) => panel.querySelector<HTMLElement>(selector)!;
  /** 菜单此刻摆的是哪一面；轨道与尺寸变化只就地改这一面（`refreshPanel`）。 */
  let view: 'main' | 'seek' | 'longpress' | 'speed' | 'quality' | 'subtitles' | 'rotation' | 'shortcuts' = 'main';
  const seekStep = () => Math.max(1, Number(playerHost().settings().seekSeconds) || 10);
  const seekLargeStep = () => Math.max(1, Number(playerHost().settings().seekLargeSeconds) || 60);
  const seekLabel = () => `${t('catalog:playerQuality.seekStepSeconds', { seconds: seekStep() })} / ${t('catalog:playerQuality.seekStepSeconds', { seconds: seekLargeStep() })}`;
  const longPressSpeed = () => Math.min(4, Math.max(1, Number(playerHost().settings().longPressSpeed) || 2));
  const longPressLabel = () => `${longPressSpeed()}×`;
  const fullscreenFit = () => {
    const value = playerHost().settings().fullscreenFit;
    return value === 'cover' || value === 'original' ? value : 'contain';
  };
  const fullscreenFitLabel = () => fullscreenFit() === 'cover'
    ? t('catalog:playerQuality.fullscreenFitCover')
    : fullscreenFit() === 'original'
      ? t('catalog:playerQuality.fullscreenFitOriginal')
      : t('catalog:playerQuality.fullscreenFitContain');
  const showMain = (direction = 0) => {
    view = 'main'; syncTabs('play');
    const { active } = qualityRows(), speed = rememberRate.current();
    const panel = renderPanel(`<div class="vjs-peach-panel-menu">
      <div class="vjs-peach-settings-group">${t('catalog:playerQuality.groupControl')}</div>
      <button type="button" class="vjs-peach-menu-row" role="menuitem" data-player-speed>${icon('player-speed')}<span>${t('catalog:playerQuality.speed')}</span><b>${speed === 1 ? t('catalog:playerQuality.normalSpeed') : `${speed}×`}</b>${icon('player-menu-next')}</button>
      <button type="button" class="vjs-peach-menu-row" role="menuitem" data-player-seek-step>${icon('rotate-cw', 'vjs-peach-menu-line-icon')}<span>${t('catalog:playerQuality.seekStep')}</span><b>${seekLabel()}</b>${icon('player-menu-next')}</button>
      <button type="button" class="vjs-peach-menu-row" role="menuitem" data-player-long-press>${icon('player-speed')}<span>${t('catalog:playerQuality.longPressSpeed')}</span><b>${longPressLabel()}</b>${icon('player-menu-next')}</button>
      <div class="vjs-peach-settings-group">${t('catalog:playerQuality.groupPicture')}</div>
      <button type="button" class="vjs-peach-menu-row" role="menuitemcheckbox" data-player-ambient aria-checked="${playerHost().settings().ambientMode}">
        ${icon('player-ambient')}<span>${t('catalog:playerQuality.ambientMode')}</span><i class="vjs-peach-switch" aria-hidden="true"></i></button>
      <button type="button" class="vjs-peach-menu-row" role="menuitem" data-player-subtitles><span class="vjs-peach-menu-cc" aria-hidden="true">${subtitleIcon()}</span><span>${t('catalog:playerControls.subtitles')}</span><b>${esc(subtitleControls?.label() || t('catalog:subtitles.off'))}</b>${icon('player-menu-next')}</button>
      <button type="button" class="vjs-peach-menu-row" role="menuitem" data-player-rotation>${icon('rotate-cw', 'vjs-peach-menu-line-icon')}<span>${t('catalog:playerQuality.rotation')}</span><b>${rotation.angle()}°</b>${icon('player-menu-next')}</button>
      <button type="button" class="vjs-peach-menu-row" role="menuitem" data-player-quality-view>${icon('player-quality')}<span>${t('catalog:playerQuality.quality')}</span><b>${esc(active.label)}</b>${icon('player-menu-next')}</button>
      <div class="vjs-peach-settings-group">${t('catalog:playerQuality.groupInterface')}</div>
      <button type="button" class="vjs-peach-menu-row" role="menuitemcheckbox" data-player-theater-row aria-checked="${playerHost().settings().theaterMode}">
        ${icon('theater-enter', 'vjs-peach-menu-line-icon')}<span>${t('catalog:playerControls.theaterMode')}</span><i class="vjs-peach-switch" aria-hidden="true"></i></button>
      <button type="button" class="vjs-peach-menu-row" role="menuitem" data-player-fullscreen-fit>${icon('player-fullscreen-enter')}<span>${t('catalog:playerQuality.fullscreenFit')}</span><b>${fullscreenFitLabel()}</b>${icon('player-menu-next')}</button>
      <div data-player-memory-error hidden><p class="vjs-peach-subtitle-status" role="status"></p><button type="button" class="vjs-peach-menu-row" data-player-memory-retry>${t('catalog:playerQuality.retryMemorySave')}</button></div></div>`, direction);
    button(panel, '[data-player-ambient]').onclick = () => { applyAmbientMode(!playerHost().settings().ambientMode); showMain() };
    button(panel, '[data-player-speed]').onclick = () => showSpeed();
    button(panel, '[data-player-seek-step]').onclick = () => showSeek();
    button(panel, '[data-player-long-press]').onclick = () => showLongPress();
    button(panel, '[data-player-subtitles]').onclick = () => subtitleControls?.show();
    button(panel, '[data-player-quality-view]').onclick = () => showQuality();
    button(panel, '[data-player-rotation]').onclick = () => showRotation();
    button(panel, '[data-player-theater-row]').onclick = () => { applyTheaterMode(!playerHost().settings().theaterMode); showMain() };
    button(panel, '[data-player-fullscreen-fit]').onclick = () => {
      const order = ['contain', 'cover', 'original'] as const;
      const next = order[(order.indexOf(fullscreenFit()) + 1) % order.length]!;
      playerHost().settings().fullscreenFit = next;
      playerHost().saveSettings();
      applyFullscreenFit(player);
      showMain();
    };
    button(panel, '[data-player-memory-retry]').onclick = () => { void memory.retry() };
    syncMemoryError();
  };
  const showShortcuts = () => {
    view = 'shortcuts'; syncTabs('keys');
    const rows: [string, string][] = [
      ['Space', t('catalog:playerQuality.shortcutPlayPause')],
      ['← / →', t('catalog:playerQuality.shortcutSeek')],
      ['Shift + ← / →', t('catalog:playerQuality.shortcutSeekLarge')],
      ['↑ / ↓', t('catalog:playerQuality.shortcutVolume')],
      ['M', t('catalog:playerQuality.shortcutMute')],
      ['F', t('catalog:playerQuality.shortcutFullscreen')],
      ['T', t('catalog:playerQuality.shortcutTheater')],
      ['I', t('catalog:playerQuality.shortcutMiniplayer')],
      ['Esc', t('catalog:playerQuality.shortcutClose')],
    ];
    renderPanel(`<div class="vjs-peach-panel-menu vjs-peach-shortcuts">${rows.map(([key, label]) =>
      `<div class="vjs-peach-shortcut"><kbd>${key}</kbd><span>${label}</span></div>`).join('')}</div>`, 1);
  };
  const showSeek = (direction = 1) => {
    view = 'seek'; syncTabs('play');
    const presets = [5, 10, 15, 30, 60];
    const largePresets = [30, 60, 120, 300];
    const panel = renderPanel(`<div class="vjs-peach-panel-header"><button type="button" class="vjs-peach-menu-back" data-player-menu-back aria-label="${t('catalog:playerQuality.backMenu')}">${icon('player-menu-back')}</button><strong>${t('catalog:playerQuality.seekStep')}</strong></div>
      <div class="vjs-peach-seek-panel"><div class="vjs-peach-seek-stepper">
        <button type="button" class="vjs-peach-speed-button" data-player-seek-down aria-label="${t('catalog:playerQuality.seekStep')} -">${icon('minus')}</button>
        <input type="number" class="vjs-peach-seek-input" data-player-seek-input min="1" max="300" step="1" inputmode="numeric" aria-label="${t('catalog:playerQuality.seekStep')}">
        <button type="button" class="vjs-peach-speed-button" data-player-seek-up aria-label="${t('catalog:playerQuality.seekStep')} +">${icon('plus')}</button>
      </div><div class="vjs-peach-seek-presets">${presets.map(seconds =>
        `<button type="button" class="vjs-peach-speed-button" data-player-seek-preset="${seconds}" aria-pressed="false">${seconds}</button>`).join('')}</div>
        <p class="vjs-peach-seek-hint">${t('catalog:playerQuality.seekStepHint')}</p>
        <h4 class="vjs-peach-seek-group">${t('catalog:playerQuality.seekLargeStep')}</h4>
        <div class="vjs-peach-seek-stepper">
          <button type="button" class="vjs-peach-speed-button" data-player-seek-large-down aria-label="${t('catalog:playerQuality.seekLargeStep')} -">${icon('minus')}</button>
          <input type="number" class="vjs-peach-seek-input" data-player-seek-large-input min="1" max="600" step="1" inputmode="numeric" aria-label="${t('catalog:playerQuality.seekLargeStep')}">
          <button type="button" class="vjs-peach-speed-button" data-player-seek-large-up aria-label="${t('catalog:playerQuality.seekLargeStep')} +">${icon('plus')}</button>
        </div><div class="vjs-peach-seek-presets">${largePresets.map(seconds =>
          `<button type="button" class="vjs-peach-speed-button" data-player-seek-large-preset="${seconds}" aria-pressed="false">${seconds}</button>`).join('')}</div>
        <p class="vjs-peach-seek-hint">${t('catalog:playerQuality.seekLargeStepHint')}</p></div>`, direction);
    const input = panel.querySelector<HTMLInputElement>('[data-player-seek-input]')!;
    const apply = (value: number) => {
      const settings = playerHost().settings();
      settings.seekSeconds = Math.min(300, Math.max(1, Math.round(value) || 10));
      playerHost().saveSettings(); input.value = String(settings.seekSeconds);
      document.dispatchEvent(new CustomEvent(SEEK_STEP_EVENT, { detail: settings.seekSeconds }));
      panel.querySelectorAll<HTMLElement>('[data-player-seek-preset]').forEach(option =>
        option.setAttribute('aria-pressed', String(Number(option.dataset.playerSeekPreset) === settings.seekSeconds)));
    };
    button(panel, '[data-player-menu-back]').onclick = () => showMain(-1);
    input.value = String(seekStep());
    input.onchange = () => apply(Number(input.value));
    panel.querySelectorAll<HTMLElement>('[data-player-seek-preset]').forEach(option => {
      option.onclick = () => apply(Number(option.dataset.playerSeekPreset));
    });
    button(panel, '[data-player-seek-down]').onclick = () => apply(seekStep() - 5);
    button(panel, '[data-player-seek-up]').onclick = () => apply(seekStep() + 5);
    panel.querySelectorAll<HTMLElement>('[data-player-seek-preset]').forEach(option =>
      option.setAttribute('aria-pressed', String(Number(option.dataset.playerSeekPreset) === seekStep())));
    const largeInput = panel.querySelector<HTMLInputElement>('[data-player-seek-large-input]')!;
    const applyLarge = (value: number) => {
      const settings = playerHost().settings();
      settings.seekLargeSeconds = Math.min(600, Math.max(1, Math.round(value) || 60));
      playerHost().saveSettings(); largeInput.value = String(settings.seekLargeSeconds);
      document.dispatchEvent(new CustomEvent(SEEK_STEP_EVENT, { detail: settings.seekSeconds }));
      panel.querySelectorAll<HTMLElement>('[data-player-seek-large-preset]').forEach(option =>
        option.setAttribute('aria-pressed', String(Number(option.dataset.playerSeekLargePreset) === settings.seekLargeSeconds)));
    };
    largeInput.value = String(seekLargeStep());
    largeInput.onchange = () => applyLarge(Number(largeInput.value));
    panel.querySelectorAll<HTMLElement>('[data-player-seek-large-preset]').forEach(option => {
      option.onclick = () => applyLarge(Number(option.dataset.playerSeekLargePreset));
    });
    button(panel, '[data-player-seek-large-down]').onclick = () => applyLarge(seekLargeStep() - 15);
    button(panel, '[data-player-seek-large-up]').onclick = () => applyLarge(seekLargeStep() + 15);
    panel.querySelectorAll<HTMLElement>('[data-player-seek-large-preset]').forEach(option =>
      option.setAttribute('aria-pressed', String(Number(option.dataset.playerSeekLargePreset) === seekLargeStep())));
  };
  const showLongPress = (direction = 1) => {
    view = 'longpress'; syncTabs('play');
    const panel = renderPanel(`<div class="vjs-peach-panel-header"><button type="button" class="vjs-peach-menu-back" data-player-menu-back aria-label="${t('catalog:playerQuality.backMenu')}">${icon('player-menu-back')}</button><strong>${t('catalog:playerQuality.longPressSpeed')}</strong></div>
      <div class="vjs-peach-panel-menu">${[1.5, 2, 3, 4].map(rate =>
        `<button type="button" class="vjs-peach-menu-option" role="menuitemradio" data-player-long-press-option="${rate}" aria-checked="${rate === longPressSpeed()}"><span class="vjs-peach-option-check">${rate === longPressSpeed() ? icon('player-option-check') : ''}</span><span class="vjs-peach-option-label">${rate}×</span></button>`).join('')}
        <p class="vjs-peach-seek-hint">${t('catalog:playerQuality.longPressSpeedHint')}</p></div>`, direction);
    button(panel, '[data-player-menu-back]').onclick = () => showMain(-1);
    panel.querySelectorAll<HTMLElement>('[data-player-long-press-option]').forEach(option => {
      option.onclick = () => {
        const settings = playerHost().settings();
        settings.longPressSpeed = Number(option.dataset.playerLongPressOption);
        playerHost().saveSettings(); showMain(-1);
      };
    });
  };
  settingsTabs.forEach((tab) => {
    tab.onclick = () => { if (tab.dataset.playerSettingsTab === 'keys') showShortcuts(); else showMain() };
  });
  const syncMemoryError = () => {
    const message = menu.querySelector<HTMLElement>('[data-player-memory-error]');
    if (!message) return;
    message.hidden = !memory.error;
    message.querySelector('p')!.textContent = memory.error;
  };
  const showRotation = () => {
    view = 'rotation';
    const panel = renderPanel(`<div class="vjs-peach-panel-header"><button type="button" class="vjs-peach-menu-back" data-player-menu-back aria-label="${t('catalog:playerQuality.backMenu')}">${icon('player-menu-back')}</button><strong>${t('catalog:playerQuality.rotation')}</strong></div><div class="vjs-peach-panel-menu">${[0, 90, 180, 270].map(angle =>
      `<button type="button" class="vjs-peach-menu-option" role="menuitemradio" data-player-rotation-option="${angle}" aria-checked="${angle === rotation.angle()}"><span class="vjs-peach-option-check">${angle === rotation.angle() ? icon('player-option-check') : ''}</span><span class="vjs-peach-option-label">${angle === 0 ? t('catalog:playerQuality.originalOrientation', { angle }) : `${angle}°`}</span></button>`).join('')}</div>`, 1);
    button(panel, '[data-player-menu-back]').onclick = () => showMain(-1);
    panel.querySelectorAll<HTMLElement>('[data-player-rotation-option]').forEach(option => {
      option.onclick = () => { rotation.set(Number(option.dataset.playerRotationOption)); showMain(-1) };
    });
  };
  /* 播放速度面板照 YouTube delhi-modern（player 9470c977 的 base.js）：滑条两端取播放器
     支持的最低与最高倍速，步进 0.05，加减键各动 0.05 并按两位小数收敛，读数写成 1.00x。
     预设胶囊点了就地生效，面板不退回上一级。第五格 3.0 在上游是 Premium 专属，本机装的
     Peach 没有会员分级这回事，那一格照上游留着，只是不画角标；滑条上限跟着抬到 3，
     不然点 3.0 会被收敛回 2。 */
  const SPEED_MIN = .25, SPEED_MAX = 3, SPEED_STEP = .05, SPEED_PRESETS = [1, 1.25, 1.5, 2, 3];
  const speedLabel = (speed: number) => Number.isInteger(speed) ? speed.toFixed(1) : String(speed);
  const showSpeed = (direction = 1) => {
    view = 'speed';
    const min = SPEED_MIN, max = SPEED_MAX;
    const clampSpeed = (value: number) => Math.min(max, Math.max(min, Number(value.toFixed(2))));
    const panel = renderPanel(`<div class="vjs-peach-panel-header"><button type="button" class="vjs-peach-menu-back" data-player-menu-back aria-label="${t('catalog:playerQuality.backMenu')}">${icon('player-menu-back')}</button><strong>${t('catalog:playerQuality.speed')}</strong></div>
      <div class="vjs-peach-speed-panel"><div class="vjs-peach-speed-display"><output data-player-speed-display></output></div>
      <div class="vjs-peach-speed-slider"><button type="button" class="vjs-peach-speed-button" data-player-speed-step="-1" aria-label="${t('catalog:playerQuality.speedDown', { step: SPEED_STEP })}">${icon('minus')}</button>
      <input type="range" class="vjs-peach-speed-range" data-player-speed-range min="${min}" max="${max}" step="${SPEED_STEP}" aria-label="${t('catalog:playerQuality.speed')}">
      <button type="button" class="vjs-peach-speed-button" data-player-speed-step="1" aria-label="${t('catalog:playerQuality.speedUp', { step: SPEED_STEP })}">${icon('plus')}</button></div>
      <div class="vjs-peach-speed-chips">${SPEED_PRESETS.map((speed) =>
        `<span class="vjs-peach-speed-preset"><button type="button" class="vjs-peach-speed-button" data-player-speed-option="${speed}" aria-pressed="false">${speedLabel(speed)}</button>${speed === 1 ? `<span class="vjs-peach-speed-preset-label">${t('catalog:playerQuality.normalSpeed')}</span>` : ''}</span>`).join('')}</div></div>`, direction);
    const display = panel.querySelector<HTMLOutputElement>('[data-player-speed-display]')!;
    const range = panel.querySelector<HTMLInputElement>('[data-player-speed-range]')!;
    // player.playbackRate() 读的是 ratechange 之后才写的缓存，面板自己记住这一次的倍速。
    let rate = clampSpeed(rememberRate.current());
    const syncSpeed = () => {
      display.textContent = `${rate.toFixed(2)}x`; range.value = String(rate);
      range.style.setProperty('--peach-speed-percent', `${(rate - min) / (max - min) * 100}%`);
      panel.querySelectorAll<HTMLElement>('[data-player-speed-option]').forEach((option) =>
        option.setAttribute('aria-pressed', String(Number(option.dataset.playerSpeedOption) === rate)));
    };
    const setSpeed = (value: number) => { rate = clampSpeed(value); rememberRate.set(rate); syncSpeed() };
    button(panel, '[data-player-menu-back]').onclick = () => showMain(-1);
    range.oninput = () => setSpeed(Number(range.value));
    panel.querySelectorAll<HTMLElement>('[data-player-speed-step]').forEach((step) => {
      step.onclick = () => setSpeed(rate + Number(step.dataset.playerSpeedStep) * SPEED_STEP);
    });
    panel.querySelectorAll<HTMLElement>('[data-player-speed-option]').forEach((option) => {
      option.onclick = () => setSpeed(Number(option.dataset.playerSpeedOption));
    });
    syncSpeed();
  };
  /** 清晰度那一列的各档。打开面板时随面板一起画好：`renderPanel` 当场量新面板的高度做过渡，
   *  先画空列表再填，量到的只有标题栏，菜单缩成一条、动画结束又弹回原高。 */
  const qualityOptionsHtml = () => {
    const { options, active } = qualityRows();
    return options.map((option) =>
      `<button type="button" class="vjs-peach-menu-option" role="menuitemradio" data-player-quality-option="${esc(option.key)}" aria-checked="${option.key === active.key}"><span class="vjs-peach-option-check">${option.key === active.key ? icon('player-option-check') : ''}</span><span class="vjs-peach-option-label">${esc(option.label)}</span></button>`).join('');
  };
  /** 轨道增减或自动档换轨时原地重画这一列，焦点留在同一档上。 */
  const fillQualityOptions = (list: HTMLElement) => {
    const focused = list.contains(document.activeElement) ? (document.activeElement as HTMLElement).dataset.playerQualityOption : undefined;
    list.innerHTML = qualityOptionsHtml();
    bindQualityOptions(list);
    [...list.querySelectorAll<HTMLElement>('[data-player-quality-option]')]
      .find((option) => focused !== undefined && option.dataset.playerQualityOption === focused)?.focus();
  };
  const bindQualityOptions = (list: HTMLElement) => {
    list.querySelectorAll<HTMLElement>('[data-player-quality-option]').forEach((option) => {
      option.onclick = () => {
        selectedQuality = option.dataset.playerQualityOption || 'auto';
        if (levels?.length) {
          for (let index = 0; index < levels.length; index++) levels[index]!.enabled = selectedQuality === 'auto' || selectedQuality === String(index);
        }
        /* 来源档位是四个各自独立的 mp4，不是同一条流的多个轨道，所以只能换 src。
           记住当前进度和播放状态再换：换源会重新加载，不接回去就等于从头开始。 */
        if (sourceQualities?.length && selectedQuality.startsWith('h')) {
          const height = selectedQuality.slice(1);
          const at = player.currentTime() || 0, wasPlaying = !player.paused();
          const next = new URL(player.currentSrc() || video.src, location.origin);
          next.searchParams.set('quality', height);
          player.src({ src: next.pathname + next.search, type: 'video/mp4' });
          player.one('loadedmetadata', () => {
            if (at > 0) player.currentTime(at);
            if (wasPlaying) player.play()?.catch(() => {});
          });
        }
        showMain(-1);
      };
    });
  };
  const showQuality = (direction = 1) => {
    view = 'quality';
    const panel = renderPanel(`<div class="vjs-peach-panel-header"><button type="button" class="vjs-peach-menu-back" data-player-menu-back aria-label="${t('catalog:playerQuality.backMenu')}">${icon('player-menu-back')}</button><strong>${t('catalog:playerQuality.quality')}</strong></div><div class="vjs-peach-panel-menu">${qualityOptionsHtml()}</div>`, direction);
    button(panel, '[data-player-menu-back]').onclick = () => showMain(-1);
    bindQualityOptions(button(panel, '.vjs-peach-panel-menu'));
  };
  /* HLS 自动码率起播时轨道陆续登记、码率随网速换档，视频尺寸也跟着变：这些事件只更新角标和
     正在看的那一面。退回主菜单的话，正在清晰度面板里挑档的人会被一次换轨踢出去。 */
  const refreshPanel = () => {
    if (!isOpen()) { qualityRows(); return }
    const panel = menu.lastElementChild as HTMLElement | null;
    if (view === 'quality' && panel) { fillQualityOptions(button(panel, '.vjs-peach-panel-menu')); return }
    const { active } = qualityRows();
    const label = view === 'main' ? panel?.querySelector('[data-player-quality-view] b') : null;
    if (label) label.textContent = active.label;
    const angle = view === 'main' ? panel?.querySelector('[data-player-rotation] b') : null;
    const speed = view === 'main' ? panel?.querySelector('[data-player-speed] b') : null;
    const seek = view === 'main' ? panel?.querySelector('[data-player-seek-step] b') : null;
    const longPress = view === 'main' ? panel?.querySelector('[data-player-long-press] b') : null;
    if (angle) angle.textContent = `${rotation.angle()}°`;
    if (speed) speed.textContent = rememberRate.current() === 1 ? t('catalog:playerQuality.normalSpeed') : `${rememberRate.current()}×`;
    if (seek) seek.textContent = seekLabel();
    if (longPress) longPress.textContent = longPressLabel();
  };
  toggle.onclick = (event) => { event.stopPropagation(); const open = !isOpen(); if (open) showMain(); setOpen(open) };
  const outside = (event: Event) => { if (!root.contains(event.target as Node) && !drawer.contains(event.target as Node)) close() };
  document.addEventListener('pointerdown', outside);
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen()) { event.preventDefault(); event.stopPropagation(); close(); toggle.focus() }
    if (['ArrowDown', 'ArrowUp'].includes(event.key) && isOpen() && !(event.target instanceof HTMLInputElement)) {
      event.preventDefault();
      const buttons = [...menu.querySelectorAll<HTMLElement>('button:not([disabled]),input,a[href]')].filter(node => node.offsetParent !== null && !node.closest('[inert]'));
      const current = buttons.indexOf(document.activeElement as HTMLElement);
      buttons[(current + (event.key === 'ArrowDown' ? 1 : buttons.length - 1)) % buttons.length]?.focus();
    }
  };
  root.addEventListener('keydown', onKeydown);
  drawer.addEventListener('keydown', onKeydown);
  video.addEventListener('loadedmetadata', refreshPanel);
  video.addEventListener('resize', refreshPanel);
  video.addEventListener('ratechange', refreshPanel);
  levels?.on?.(['addqualitylevel', 'removequalitylevel', 'change'], refreshPanel);
  const unsubscribeMemory = memory.subscribe(() => { syncMemoryError(); refreshPanel() });
  player.on('dispose', () => {
    unsubscribeMemory();
    video.removeEventListener('loadedmetadata', refreshPanel);
    video.removeEventListener('resize', refreshPanel);
    video.removeEventListener('ratechange', refreshPanel);
    panelRun++;
    document.removeEventListener('pointerdown', outside);
    document.removeEventListener(PLAYER_PANEL_EVENT, closeSettingsForOtherPanel);
    if (panelTimer) clearTimeout(panelTimer);
    drawer.remove();
  });
  subtitleControls = new SubtitleControls(player, video, {
    render: renderPanel, open: () => { view = 'subtitles'; setOpen(true) }, close,
    back: () => { subtitleControls?.hide(); showMain(-1) },
  });
  qualityRows();
  mountPlayerTheaterControl(player, root);
  mountPlayerChromeLayout(player);
  return (next) => { sourceQualities = next?.length ? next : null; refreshPanel() };
}

/** 舞台控制条上的快退/快进按钮：步长跟设置里的 seekSeconds 走，点击只动原生 video。
 *  按钮和播放键同一排、同一档圆底；步长在设置里改完后新开的详情就是新秒数。 */
export function mountPlayerSeekControls(player: VjsPlayer, controlBar: HTMLElement): void {
  if (controlBar.querySelector('[data-player-seek]')) return;
  const play = controlBar.querySelector<HTMLElement>(':scope>.vjs-play-control');
  const video = player.el().querySelector<HTMLVideoElement>('video');
  if (!play || !video) return;
  const step = () => Math.max(1, Number(playerHost().settings().seekSeconds) || 10);
  const largeStep = () => Math.max(1, Number(playerHost().settings().seekLargeSeconds) || 60);
  const refreshers: (() => void)[] = [];
  const make = (side: -1 | 1, name: string, key: string) => {
    const wrap = document.createElement('div');
    wrap.className = 'vjs-peach-seek vjs-control';
    wrap.dataset.playerSeek = key;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'vjs-button';
    button.innerHTML = icon(name, 'vjs-peach-control-icon vjs-peach-seek-icon');
    wrap.append(button);
    const label = () => t(side < 0 ? 'catalog:stagePlayer.seekBack' : 'catalog:stagePlayer.seekForward', { count: step() });
    const sync = playerControlTooltip(button, label());
    refreshers.push(() => sync(label()));
    button.onclick = (event) => { event.stopPropagation(); sync(label()); seekVideoBy(video, (event.shiftKey ? largeStep() : step()) * side) };
    return wrap;
  };
  const refresh = () => refreshers.forEach(sync => sync());
  document.addEventListener(SEEK_STEP_EVENT, refresh);
  const back = make(-1, 'rotate-ccw', 'back');
  const ahead = make(1, 'rotate-cw', 'forward');
  play.after(back, ahead);
  player.on('dispose', () => { document.removeEventListener(SEEK_STEP_EVENT, refresh); back.remove(); ahead.remove() });
}

/* 舞台上的触屏双击：左半区后退、右半区前进，步长同 seekSeconds。
 *
 *  单击仍走播放/暂停，但要等双击窗口过去才兑现；浏览器合成的 click 与 dblclick 都要在捕获阶段
 *  吃掉，否则第一下会先触发播放、第二下又会被 Video.js 当成双击全屏。普通鼠标单击与双击全屏
 *  仍走原路径；鼠标按住同样触发长按倍速，方便非触屏设备验收。
 *  沉浸模式有自己的手势，这个函数只挂在舞台播放器上。 */
const TAP_MS = 300;
const TAP_SLOP = 12;
const TAP_SUPPRESS_MS = 450;
const LONG_PRESS_MS = 500;
const SWIPE_SLOP = 24;

type GestureMode = 'seek' | 'brightness' | 'volume';

export function mountPlayerTouchSeek(player: VjsPlayer): void {
  const root = player.el();
  const video = root.querySelector<HTMLVideoElement>('video');
  if (!video || root.hasAttribute('data-player-touch-seek')) return;
  root.setAttribute('data-player-touch-seek', '');
  const badge = document.createElement('div');
  badge.className = 'vjs-peach-speed-badge'; badge.hidden = true; root.append(badge);
  const gesture = document.createElement('div');
  gesture.className = 'vjs-peach-gesture'; gesture.hidden = true; root.append(gesture);
  gesture.innerHTML = '<span class="vjs-peach-gesture-icon"></span><span class="vjs-peach-gesture-text"></span>';
  const gestureIcon = gesture.querySelector<HTMLElement>('.vjs-peach-gesture-icon')!;
  const gestureText = gesture.querySelector<HTMLElement>('.vjs-peach-gesture-text')!;
  let down: { x: number; y: number; at: number; inactive: boolean } | null = null;
  let lastTap: { side: -1 | 1; at: number } | null = null;
  let tapTimer: ReturnType<typeof setTimeout> | null = null;
  let holdTimer: ReturnType<typeof setTimeout> | null = null;
  let holdGuard: ReturnType<typeof setInterval> | null = null;
  let holdRate = 1;
  let holding = false;
  let suppressClick = false;
  let suppressUntil = 0;
  let mode: GestureMode | null = null;
  let targetTime = 0;
  let startTime = 0;
  let startVolume = 1;
  let startBrightness = 1;
  let brightness = 1;
  const step = () => Math.max(1, Number(playerHost().settings().seekSeconds) || 10);
  const longPressSpeed = () => Math.min(4, Math.max(1, Number(playerHost().settings().longPressSpeed) || 2));
  const inStage = () => { const stage = playerHost().stage(); return !!stage && stage.contains(root) };
  const sideAt = (x: number): -1 | 1 => {
    const rect = root.getBoundingClientRect();
    if (rect.width <= 0) return x < window.innerWidth / 2 ? -1 : 1;
    return x - rect.left < rect.width / 2 ? -1 : 1;
  };
  const clearTap = () => { if (tapTimer) clearTimeout(tapTimer); tapTimer = null; lastTap = null };
  const clearHold = () => { if (holdTimer) clearTimeout(holdTimer); holdTimer = null };
  const restoreRate = () => {
    clearHold();
    if (holdGuard) { clearInterval(holdGuard); holdGuard = null }
    if (!holding) return;
    holding = false; player.playbackRate(holdRate); badge.hidden = true;
  };
  const eventInsideVideo = (event: PointerEvent) => {
    const rect = video.getBoundingClientRect();
    return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  };
  const applyBrightness = (value: number) => {
    brightness = Math.min(1.8, Math.max(.2, value));
    video.style.filter = brightness === 1 ? '' : `brightness(${brightness})`;
    return brightness;
  };
  const applyVolume = (value: number) => {
    const next = Math.min(1, Math.max(0, value));
    video.muted = next === 0; video.volume = next; return next;
  };
  const hideGesture = () => { gesture.hidden = true; mode = null; targetTime = 0 };
  const startGesture = (next: GestureMode) => {
    clearHold(); restoreRate(); badge.hidden = true; suppressClick = true;
    mode = next; gesture.hidden = false; gesture.dataset.mode = next;
    startTime = Number(video.currentTime) || 0; targetTime = startTime;
    startVolume = video.muted ? 0 : video.volume; startBrightness = brightness;
    if (next !== 'seek') gestureIcon.innerHTML = next === 'brightness' ? icon('sun', 'vjs-peach-gesture-line') : icon('player-volume', 'vjs-peach-gesture-fill');
  };
  const updateGesture = (event: PointerEvent) => {
    if (!mode || !down) return;
    const rect = video.getBoundingClientRect();
    if (mode === 'seek') {
      const width = Math.max(1, rect.width), duration = Number(video.duration) || 0;
      const delta = (event.clientX - down.x) / width * 60;
      targetTime = Math.max(0, Math.min(duration || Number.MAX_SAFE_INTEGER, startTime + delta));
      const shown = targetTime - startTime;
      gestureIcon.innerHTML = `<b>${shown >= 0 ? '»' : '«'}</b>`;
      gestureText.textContent = t('catalog:playerQuality.gestureSeek', {
        delta: `${shown >= 0 ? '+' : ''}${Math.round(shown)}`,
        time: fmtClock(targetTime),
      });
      return;
    }
    const dy = (down.y - event.clientY) / Math.max(1, rect.height);
    if (mode === 'brightness') {
      const value = applyBrightness(startBrightness + dy * 1.6);
      gestureIcon.innerHTML = icon('sun', 'vjs-peach-gesture-line');
      gestureText.textContent = t('catalog:playerQuality.gestureBrightness', { percent: Math.round(value * 100) });
    } else {
      const value = applyVolume(startVolume + dy);
      gestureIcon.innerHTML = icon('player-volume', 'vjs-peach-gesture-fill');
      gestureText.textContent = t('catalog:playerQuality.gestureVolume', { percent: Math.round(value * 100) });
    }
  };
  const finishGesture = () => {
    if (!mode) return;
    if (mode === 'seek' && targetTime > 0) video.currentTime = targetTime;
    hideGesture(); suppressClick = false; suppressUntil = Date.now() + TAP_SUPPRESS_MS; down = null;
  };

  const onDown = (event: PointerEvent) => {
    if (!inStage() || event.button > 0) return;
    suppressClick = false; hideGesture();
    clearHold(); restoreRate();
    down = { x: event.clientX, y: event.clientY, at: Date.now(), inactive: root.classList.contains('vjs-user-inactive') };
    try { video.setPointerCapture(event.pointerId) } catch { /* 不支持捕获的浏览器 */ }
    holdTimer = setTimeout(() => {
      holdTimer = null;
      if (!down || !inStage()) return;
      holding = true; suppressClick = true;
      holdRate = Number(player.playbackRate()) || 1;
      player.playbackRate(longPressSpeed());
      badge.textContent = t('catalog:playerQuality.speedBoost', { rate: longPressSpeed() });
      badge.hidden = false;
      /* 起播/换源时浏览器或 Video.js 可能把 rate 写回 1；按住期间每 250ms 重新断言一次。 */
      holdGuard = setInterval(() => {
        if (holding && Math.abs((Number(player.playbackRate()) || 1) - longPressSpeed()) > .01) player.playbackRate(longPressSpeed());
      }, 250);
    }, LONG_PRESS_MS);
  };
  const onMove = (event: PointerEvent) => {
    if (!down) return;
    const distance = Math.hypot(event.clientX - down.x, event.clientY - down.y);
    if (!mode && event.pointerType !== 'mouse' && distance > SWIPE_SLOP) {
      /* 触屏手指一动就退出长按倍速，优先进入横划/竖划手势。 */
      clearHold(); restoreRate(); badge.hidden = true;
      const rect = video.getBoundingClientRect();
      const horizontal = Math.abs(event.clientX - down.x) > Math.abs(event.clientY - down.y) * 1.15;
      startGesture(horizontal ? 'seek' : (down.x < rect.left + rect.width / 2 ? 'brightness' : 'volume'));
    }
    if (mode) { event.preventDefault(); updateGesture(event); return }
    if (holding) {
      if (event.pointerType === 'mouse' && !eventInsideVideo(event)) restoreRate();
      return;
    }
    if (distance > TAP_SLOP) clearHold();
  };
  const onUp = (event: PointerEvent) => {
    clearHold();
    if (mode) { finishGesture(); return }
    if (!down || !inStage()) return;
    const started = down; down = null;
    if (holding || suppressClick) {
      restoreRate(); suppressClick = false; suppressUntil = Date.now() + TAP_SUPPRESS_MS;
      return;
    }
    if (event.pointerType === 'mouse') return;
    if (Date.now() - started.at > 600 || Math.hypot(event.clientX - started.x, event.clientY - started.y) > TAP_SLOP) return;
    const now = Date.now();
    /* 控制条自己藏起来时，第一下只把它唤出来，不切换播放。 */
    if (started.inactive) {
      suppressUntil = now + TAP_SUPPRESS_MS;
      root.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'touch', clientX: event.clientX, clientY: event.clientY }));
      return;
    }
    const side = sideAt(event.clientX);
    suppressUntil = now + TAP_SUPPRESS_MS;
    if (lastTap && lastTap.side === side && now - lastTap.at <= TAP_MS) {
      clearTap(); seekVideoBy(video, step() * side);
      return;
    }
    if (tapTimer) clearTimeout(tapTimer);
    lastTap = { side, at: now };
    tapTimer = setTimeout(() => { tapTimer = null; lastTap = null; toggleVideoPlayback(video) }, TAP_MS);
  };
  const onCancel = () => { restoreRate(); hideGesture(); suppressClick = false; down = null };
  const keepSelection = (event: Event) => { if (event.target === video) event.preventDefault() };
  root.addEventListener('contextmenu', keepSelection);
  /* 桌面滚轮在画面上调音量；设置抽屉里的滚动留给抽屉自己。 */
  const wheel = document.createElement('div');
  wheel.className = 'vjs-peach-gesture vjs-peach-wheel-volume'; wheel.hidden = true;
  wheel.innerHTML = '<span class="vjs-peach-gesture-icon"></span><span class="vjs-peach-gesture-text"></span>';
  root.append(wheel);
  const wheelIcon = wheel.querySelector<HTMLElement>('.vjs-peach-gesture-icon')!;
  const wheelText = wheel.querySelector<HTMLElement>('.vjs-peach-gesture-text')!;
  let wheelTimer: ReturnType<typeof setTimeout> | null = null;
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || (event.target as Element).closest('.vjs-peach-settings-drawer')) return;
    event.preventDefault();
    const next = Math.min(1, Math.max(0, (video.muted ? 0 : video.volume) + (event.deltaY > 0 ? -.05 : .05)));
    video.muted = next === 0; video.volume = next;
    wheelIcon.innerHTML = icon('player-volume', 'vjs-peach-gesture-fill');
    wheelText.textContent = t('catalog:playerQuality.gestureVolume', { percent: Math.round(next * 100) });
    wheel.hidden = false;
    if (wheelTimer) clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheel.hidden = true }, 800);
  };
  root.addEventListener('wheel', onWheel, { passive: false });
  /* 鼠标可能按住后移出视频再松开：在 window 上兜底恢复。 */
  const releaseOutside = () => {
    if (mode) { finishGesture(); return }
    if (!holding && !suppressClick) return;
    restoreRate(); suppressClick = false; suppressUntil = Date.now() + TAP_SUPPRESS_MS; down = null;
  };
  const onLeave = (event: PointerEvent) => { if (holding && !eventInsideVideo(event)) restoreRate() };
  const captureClick = (event: Event) => {
    if (event.target === video && inStage() && Date.now() < suppressUntil) { event.preventDefault(); event.stopImmediatePropagation() }
  };
  const captureDoubleClick = (event: Event) => {
    if (event.target === video && inStage() && Date.now() < suppressUntil) { event.preventDefault(); event.stopImmediatePropagation() }
  };
  video.addEventListener('pointerdown', onDown);
  video.addEventListener('pointermove', onMove);
  video.addEventListener('pointerup', onUp);
  video.addEventListener('pointercancel', onCancel);
  video.addEventListener('pointerleave', onLeave);
  window.addEventListener('pointerup', releaseOutside, true);
  window.addEventListener('pointercancel', releaseOutside, true);
  root.addEventListener('click', captureClick, true);
  root.addEventListener('dblclick', captureDoubleClick, true);
  player.on('dispose', () => {
    if (tapTimer) clearTimeout(tapTimer);
    restoreRate(); hideGesture();
    video.removeEventListener('pointerdown', onDown);
    video.removeEventListener('pointermove', onMove);
    video.removeEventListener('pointerup', onUp);
    video.removeEventListener('pointercancel', onCancel);
    video.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('wheel', onWheel);
    if (wheelTimer) clearTimeout(wheelTimer);
    root.removeEventListener('contextmenu', keepSelection);
    window.removeEventListener('pointerup', releaseOutside, true);
    window.removeEventListener('pointercancel', releaseOutside, true);
    badge.remove(); gesture.remove(); wheel.remove();
    root.removeEventListener('click', captureClick, true);
    root.removeEventListener('dblclick', captureDoubleClick, true);
    root.removeAttribute('data-player-touch-seek');
  });
}

function mountPlayerTheaterControl(player: VjsPlayer, settingsRoot: Element): void {
  const controlBar = player.el().querySelector<HTMLElement>('.vjs-control-bar');
  if (!controlBar || controlBar.querySelector('[data-player-theater]')) return;
  const theater = playerHost().settings().theaterMode;
  const root = document.createElement('div'); root.className = 'vjs-peach-theater vjs-control';
  root.innerHTML = `<button type="button" data-player-theater aria-pressed="${theater}">${icon(theater ? 'theater-exit' : 'theater-enter')}</button>`;
  controlBar.insertBefore(root, settingsRoot.nextSibling);
  const theaterButton = root.querySelector('button')!;
  theaterSyncs.set(theaterButton, playerControlTooltip(theaterButton, t('catalog:playerControls.theaterMode'), 'T'));
  syncPlayerTheaterButton(theaterButton);
  theaterButton.onclick = (event) => { event.stopPropagation(); applyTheaterMode(!playerHost().settings().theaterMode) };
}

function mountPlayerChromeLayout(player: VjsPlayer): void {
  const controlBar = player.el().querySelector<HTMLElement>('.vjs-control-bar');
  if (!controlBar) return;
  mountPlayerSeekControls(player, controlBar);
  mountPlayerTouchSeek(player);
  applyFullscreenFit(player);
  if (controlBar.querySelector('.vjs-peach-right-controls')) return;
  const play = controlBar.querySelector<HTMLElement>(':scope>.vjs-play-control');
  if (play && !play.querySelector(':scope>.vjs-peach-hover')) play.insertAdjacentHTML('beforeend', '<span class="vjs-peach-hover" aria-hidden="true"></span>');
  const explicitIcon = (button: HTMLElement | null, name: string) => {
    if (!button) return null;
    button.dataset.peachExplicitIcon = '';
    button.insertAdjacentHTML('beforeend', icon(name, 'vjs-peach-control-icon'));
    return button.querySelector(':scope>.vjs-peach-control-icon use');
  };
  /* 播放键和静音键的图标要自己形变，不能整块换掉：`<use>` 克隆出来的是影子树，里面的
     `d` 改不动，也挂不上过渡。所以这两个键把 sprite 里的 <path> 搬进自己的 svg，图标怎么变
     由 CSS 说。照 YouTube delhi-modern（player 9470c977 的 base.js）：播放↔暂停是同一条
     路径逐个数字插值 200ms（上游 `eST` 把 `d` 拆成数字与分隔符再逐位插值），音量的两道弧
     各自缩放 250ms（上游 `jjc`：内弧绕 (18,12)、外弧绕 (22,12)），两处曲线都是 `qn3`
     也就是 cubic-bezier(.4,0,.2,1)。 */
  const morphIcon = (button: HTMLElement | null | undefined, name: string) => {
    if (!button) return null;
    const symbol = document.getElementById(`i-${name}`); if (!symbol) return null;
    button.dataset.peachExplicitIcon = '';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', symbol.getAttribute('viewBox') || '');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'vjs-peach-control-icon vjs-peach-morph-icon');
    svg.innerHTML = symbol.innerHTML; button.append(svg); return svg;
  };
  const spritePaths = (name: string) => [...(document.getElementById(`i-${name}`)?.querySelectorAll('path') || [])];
  const playIcon = morphIcon(play, 'player-play'), playPath = playIcon?.querySelector('path');
  const playD = spritePaths('player-play')[0]?.getAttribute('d') || '', pauseD = spritePaths('player-pause')[0]?.getAttribute('d') || '';
  const syncPlayTooltip = playerControlTooltip(play, t('catalog:shared.play'), 'K');
  /* WebKit（Safari 与 iOS 上的所有浏览器）不认 CSS 的 `d` 属性，写进 style 等于没写，图标
     停在播放那一枚。那边直接改路径属性：没有插值，瞬间切换。 */
  const cssPathD = CSS.supports('d', 'path("M0 0")');
  const syncPlayIcon = () => {
    const paused = player.paused() || player.ended(), d = paused ? playD : pauseD;
    if (playPath) { if (cssPathD) playPath.style.setProperty('d', `path("${d}")`); else playPath.setAttribute('d', d) }
    syncPlayTooltip(paused ? t('catalog:shared.play') : t('catalog:shared.pause'));
  };
  player.on(['play', 'pause', 'ended'], syncPlayIcon); syncPlayIcon();
  const volume = controlBar.querySelector<HTMLElement>(':scope>.vjs-volume-panel');
  const mute = volume?.querySelector<HTMLElement>(':scope>.vjs-mute-control'), muteIcon = morphIcon(mute, 'player-volume');
  /* 静音那张图标搬进同一个 svg：挖空的喇叭和叉号跟实心喇叭、两道弧共处一处，弧缩完了
     它们才一起顶上，靠 opacity 换而不是换整块 svg。 */
  if (muteIcon) spritePaths('player-volume-muted').forEach((path) => muteIcon.append(path.cloneNode(true)));
  const syncMuteTooltip = playerControlTooltip(mute, t('catalog:playerControls.mute'), 'M');
  /* 外弧跟音量走：上游 `setVolume` 里超过 50 才给 1，否则 0，静音时两道弧一起收掉。 */
  const syncVolumeIcon = () => {
    const silent = player.muted() || player.volume() === 0;
    if (muteIcon) { muteIcon.dataset.silent = String(silent); muteIcon.dataset.loud = String(!silent && player.volume() > .5) }
    syncMuteTooltip(silent ? t('catalog:playerControls.unmute') : t('catalog:playerControls.mute'));
  };
  player.on('volumechange', syncVolumeIcon); syncVolumeIcon();
  /* 中心提示照 YouTube delhi-modern（player 9470c977 的 www-player.css 与 base.js）：一块
     78px 的毛玻璃圆闪一下当前动作的图标，1s 走完 0→1.33→1 的缩放淡出。捕获阶段读的是
     切换之前的状态，闪出来的正好是这一次做的事：暂停中点播放键闪播放。键盘快捷键走的
     也是同一个按钮的点击路径，所以键盘不用另挂一处。
     画面中心只允许有这一块提示圆：整个播放器里凡是能切换播放的入口——控制条的播放键、
     静音键、点画面本身——都汇到这个 flashBezel 上。同一块画面上再挂第二个 78px 圆，
     两边各按自己的时机取状态，点一下就会一个闪播放一个闪暂停，叠在一起看不清哪个才是
     刚做的事。 */
  const bezel = document.createElement('div');
  bezel.className = 'vjs-peach-bezel'; bezel.setAttribute('role', 'status'); bezel.hidden = true;
  bezel.innerHTML = `<span class="vjs-peach-bezel-icon">${icon('player-play')}</span>`;
  const bezelUse = bezel.querySelector('use'); let bezelTimer: ReturnType<typeof setTimeout> | null = null;
  const flashBezel = (name: string, label: string) => {
    bezelUse?.setAttribute('href', `#i-${name}`); bezel.setAttribute('aria-label', label);
    bezel.hidden = false; bezel.classList.remove('vjs-peach-bezel-run');
    void bezel.offsetWidth; bezel.classList.add('vjs-peach-bezel-run');
    if (bezelTimer) clearTimeout(bezelTimer);
    bezelTimer = setTimeout(() => { bezel.hidden = true; bezel.classList.remove('vjs-peach-bezel-run') }, 1000);
  };
  controlBar.parentElement!.insertBefore(bezel, controlBar);
  player.el().addEventListener('click', (event) => {
    const target = event.target as Element;
    if (target.closest('.vjs-mute-control')) {
      const silent = player.muted() || player.volume() === 0;
      flashBezel(silent ? 'player-volume' : 'player-volume-muted', silent ? t('catalog:playerControls.unmute') : t('catalog:playerControls.mute'));
    } else if (target.closest('.vjs-play-control,.vjs-tech,.vjs-poster')) {
      const paused = player.paused() || player.ended();
      flashBezel(paused ? 'player-play' : 'player-pause', paused ? t('catalog:shared.play') : t('catalog:shared.pause'));
    }
  }, true);
  player.on('dispose', () => { if (bezelTimer) clearTimeout(bezelTimer) });
  const time = document.createElement('button'); let remaining = false;
  time.type = 'button'; time.className = 'vjs-peach-time vjs-control'; time.dataset.playerTime = '';
  time.innerHTML = '<span class="vjs-peach-time-text"></span>';
  const timeText = time.querySelector('.vjs-peach-time-text')!;
  const syncTimeTooltip = playerControlTooltip(time, t('catalog:playerControls.showRemaining'));
  const syncTime = () => {
    const current = Math.max(0, Number(player.currentTime()) || 0), duration = Math.max(0, Number(player.duration()) || 0);
    const left = fmtClock(Math.max(0, duration - current));
    timeText.textContent = `${remaining ? `-${left}` : fmtClock(current)} / ${fmtClock(duration)}`;
    time.dataset.remaining = String(remaining);
    syncTimeTooltip(remaining ? t('catalog:playerControls.showElapsed') : t('catalog:playerControls.showRemaining'), remaining
      ? t('catalog:playerControls.remainingTooltip', { remaining: left, duration: fmtClock(duration) })
      : t('catalog:playerControls.elapsedTooltip', { elapsed: fmtClock(current), duration: fmtClock(duration) }));
  };
  time.onclick = (event) => { event.stopPropagation(); remaining = !remaining; syncTime() };
  player.on(['timeupdate', 'durationchange', 'loadedmetadata'], syncTime); syncTime();
  if (volume) volume.insertAdjacentElement('afterend', time); else controlBar.append(time);
  const pip = controlBar.querySelector<HTMLElement>(':scope>.vjs-picture-in-picture-control');
  playerControlTooltip(controlBar.querySelector('.vjs-subtitles-control>button'), t('catalog:playerControls.subtitles'));
  explicitIcon(pip, 'player-pip');
  // i 键归迷你播放器（YouTube 的 aria-keyshortcuts="i"），画中画只留按钮。
  const syncPipTooltip = playerControlTooltip(pip, t('catalog:playerControls.pictureInPicture'));
  mountPlayerPipControl(player, pip, syncPipTooltip, text => playerHost().toast(text, { warn: true }));
  const fullscreen = controlBar.querySelector<HTMLElement>(':scope>.vjs-fullscreen-control');
  const fullscreenUse = explicitIcon(fullscreen, 'player-fullscreen-enter');
  const syncFullscreenTooltip = playerControlTooltip(fullscreen, t('catalog:playerControls.fullScreen'), 'F');
  /* CSS 的 `.vjs-fullscreen` 只能覆盖 Video.js 已经同步状态类的路径。实际浏览器还可能
     走 full-window 回退，或者先触发 fullscreenchange、下一帧才完成 class 更新。把播放器
     自己的 `isFullscreen()` 结果登记到 DOM，画面填充不再依赖某一个实现细节类名。 */
  /* iPhone 的原生 video 全屏由系统播放器接管，网页控制条会被盖住；这里给 Apple 移动端
     换成舞台 CSS 全屏，控制条和手势仍归 Peach。Safari 的浏览器工具栏无法由页面隐藏。 */
  const appleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let webFullscreen = false;
  const syncFullscreenState = () => {
    const active = webFullscreen || !!player.isFullscreen();
    player.el().toggleAttribute('data-peach-fullscreen', active);
    fullscreenUse?.setAttribute('href', active ? '#i-player-fullscreen-exit' : '#i-player-fullscreen-enter');
    syncFullscreenTooltip(active ? t('catalog:playerControls.exitFullScreen') : t('catalog:playerControls.fullScreen'));
    resizeSoon(player);
  };
  player.on(['fullscreenchange', 'enterFullWindow', 'exitFullWindow'], syncFullscreenState);
  const toggleWebFullscreen = () => {
    const stage = playerHost().stage();
    webFullscreen = !webFullscreen;
    stage?.toggleAttribute('data-peach-web-fullscreen', webFullscreen);
    document.documentElement.classList.toggle('peach-web-fullscreen', webFullscreen);
    syncFullscreenState();
  };
  const onWebFullscreenClick = (event: MouseEvent) => {
    if (!appleMobile) return;
    event.preventDefault(); event.stopImmediatePropagation(); toggleWebFullscreen();
  };
  const onWebFullscreenKey = (event: KeyboardEvent) => {
    if (!webFullscreen || event.key !== 'Escape') return;
    event.preventDefault(); event.stopPropagation(); toggleWebFullscreen();
  };
  fullscreen?.addEventListener('click', onWebFullscreenClick, true);
  if (appleMobile) document.addEventListener('keydown', onWebFullscreenKey, true);
  player.on('dispose', () => {
    fullscreen?.removeEventListener('click', onWebFullscreenClick, true);
    document.removeEventListener('keydown', onWebFullscreenKey, true);
    if (webFullscreen) {
      webFullscreen = false;
      playerHost().stage()?.removeAttribute('data-peach-web-fullscreen');
      document.documentElement.classList.remove('peach-web-fullscreen');
    }
  });
  syncFullscreenState();
  const controls = [
    pip,
    controlBar.querySelector<HTMLElement>(':scope>.vjs-subtitles-control'),
    controlBar.querySelector<HTMLElement>(':scope>.vjs-peach-settings'),
    controlBar.querySelector<HTMLElement>(':scope>.vjs-peach-theater'),
    fullscreen,
  ].filter((control): control is HTMLElement => !!control);
  if (!controls.length) return;
  const group = document.createElement('div'); group.className = 'vjs-peach-right-controls'; group.setAttribute('aria-label', t('catalog:playerControls.viewControls'));
  controlBar.insertBefore(group, controls[0]!);
  controls.forEach((control) => {
    control.insertAdjacentHTML('beforeend', '<span class="vjs-peach-hover" aria-hidden="true"></span>');
    group.append(control);
  });
  /* 参考 115-lite：时间读数放在右侧动作组前面，不再夹在音量和留白之间。 */
  if (time.parentElement) { time.remove(); controlBar.insertBefore(time, group) }
  /* 窄屏折叠照 YouTube 的判据来：base.js 9470c977 里播放器宽度 `v.width<528` 打开
     ytp-xsmall-width-mode，右侧收成「设置 + 展开」，点开才铺开其余按钮。判据必须是播放器
     自己的宽度，不是视口——同一个视口下影院模式和普通视图的播放器宽度差一大截。 */
  const expand = document.createElement('div'); expand.className = 'vjs-peach-expand vjs-control';
  /* 高亮层要挂在 `.vjs-control` 这一层：亮起来的规则是 `>.vjs-peach-hover`，塞进
     button 里就差一层，展开键成了这排唯一没有 hover 的按钮。位置在这排左端——
     这排整体右对齐，展开时新按钮从它右边长出来，箭头指左才对得上要发生的事。箭头用
     `i-player-expand`：菜单行那个 `>` 是 24 视框、一个单位粗的细线，铺到 32px 只有 1.3px 粗；
     上游展开键自带一个 32 视框、两个单位粗的箭头，同样 32px 渲染就是 2px。 */
  expand.innerHTML = `<button type="button" data-player-expand aria-expanded="false">${icon('player-expand')}</button><span class="vjs-peach-hover" aria-hidden="true"></span>`;
  group.prepend(expand);
  const expandButton = expand.querySelector('button')!;
  const syncExpandTooltip = playerControlTooltip(expandButton, t('catalog:playerControls.expandControls'));
  const setExpanded = (open: boolean) => {
    player.el().classList.toggle('vjs-peach-right-expanded', open);
    expandButton.setAttribute('aria-expanded', String(open)); syncExpandTooltip(open ? t('catalog:playerControls.collapseControls') : t('catalog:playerControls.expandControls'));
  };
  expandButton.onclick = (event) => { event.stopPropagation(); setExpanded(!player.el().classList.contains('vjs-peach-right-expanded')) };
  const syncWidthMode = () => {
    const box = player.el(), narrow = box.clientWidth < 528;
    /* 设置面板要按播放器高度收顶，而它的定位祖先只有 36px 高，百分比取不到播放器。 */
    box.style.setProperty('--peach-player-h', `${box.clientHeight}px`);
    box.classList.toggle('vjs-peach-xsmall', narrow);
    if (!narrow) setExpanded(false);
  };
  const widthObserver = new ResizeObserver(syncWidthMode); widthObserver.observe(player.el());
  player.on('dispose', () => widthObserver.disconnect());
  setExpanded(false); syncWidthMode();
}

/** 进度条上的拖动预览：时间与那一秒的画面，取图与夹边见 `seek-preview.ts`。
 *
 *  鼠标悬停显示时间（有图时连画面），触屏按住拖动同样显示；没有可用图时只显示时间。
 *  拖动期间进度条下沿另有一枚时间跟着指针走，松手收起。 */
export function mountPlayerSeekPreview(player: VjsPlayer, item: PlayerItem | null, options: { thumbnail?: boolean } = {}): void {
  const progress = player.el().querySelector<HTMLElement>('.vjs-control-bar .vjs-progress-control');
  if (!progress || progress.querySelector('[data-player-seek-preview]')) return;
  const preview = createSeekPreview(progress, item, options);
  const scrub = document.createElement('span');
  scrub.className = 'vjs-peach-scrub-time'; scrub.hidden = true;
  progress.append(scrub);
  const timeText = player.el().querySelector<HTMLElement>('.vjs-peach-time-text');
  let scrubbing = false;
  const move = (event: PointerEvent, dragging = false) => {
    const duration = realDuration(player.duration()) || realDuration(item?.duration);
    if (!duration) return;
    const rect = progress.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    preview.prime();
    preview.show(ratio, duration);
    /* 拖动时右侧那颗时间胶囊跟着指针走；松手后再由 timeupdate 恢复实际播放位置。 */
    if (dragging) {
      const seconds = duration * Math.min(1, Math.max(0, ratio));
      scrub.textContent = fmtClock(seconds); scrub.hidden = false;
      scrub.style.left = `${previewCenter(event.clientX - rect.left, rect.width, scrub.offsetWidth || 60, 4)}px`;
      if (timeText) timeText.textContent = `${fmtClock(seconds)} / ${fmtClock(duration)}`;
    }
  };
  const restoreTime = () => { scrubbing = false; scrub.hidden = true; player.trigger('timeupdate') };
  const hide = () => { restoreTime(); preview.hide() };
  const lift = (event: PointerEvent) => { restoreTime(); if (event.pointerType !== 'mouse') preview.hide() };
  const listeners: [string, (event: PointerEvent) => void][] = [
    ['pointerdown', (event) => { scrubbing = true; move(event, true) }],
    ['pointermove', (event) => move(event, scrubbing)],
    ['pointerleave', hide], ['pointerup', lift], ['pointercancel', hide],
  ];
  for (const [type, listener] of listeners) progress.addEventListener(type, listener as EventListener);
  player.on('dispose', () => {
    for (const [type, listener] of listeners) progress.removeEventListener(type, listener as EventListener);
    preview.dispose(); scrub.remove();
  });
}

/** 画中画那个窗口由浏览器画，站内控制条一颗键都递不进去。Media Session 的动作处理器是唯一的
 *  入口：登记 `seekbackward` 和 `seekforward` 之后，Chrome 才在那个窗口里画出快退和快进两颗，
 *  步长用设置里那个秒数；`setPositionState` 让它自己那条进度条知道现在放到哪，`seekto` 让拖它
 *  真的生效。不登记时那里只有播放、暂停和关闭三颗。站内的小窗是另一件事，那三颗键在小窗自己身上。 */
export function mountPlayerMediaSession(player: VjsPlayer, item: PlayerItem): void {
  const session = navigator.mediaSession;
  if (!session || typeof session.setActionHandler !== 'function') return;
  const total = () => realDuration(player.duration()) || realDuration(item.duration) || 0;
  const seekTo = (seconds: number) => {
    const duration = total();
    player.currentTime(Math.max(0, duration ? Math.min(duration, seconds) : seconds));
  };
  const step = () => Math.max(1, Number(playerHost().settings().seekSeconds) || 10);
  const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
    ['play', () => { void player.play() }],
    ['pause', () => player.pause()],
    ['seekbackward', (details) => seekTo(player.currentTime() - (details?.seekOffset || step()))],
    ['seekforward', (details) => seekTo(player.currentTime() + (details?.seekOffset || step()))],
    ['seekto', (details) => { if (typeof details?.seekTime === 'number') seekTo(details.seekTime) }],
  ];
  const registered: MediaSessionAction[] = [];
  for (const [action, handler] of handlers) {
    /* 浏览器不认的动作会抛，认得的照常登记：整块 try 会让一个不认识的动作带走后面
       全部处理器，小窗于是又回到只有播放暂停。 */
    try { session.setActionHandler(action, handler); registered.push(action) } catch { /* 不认的动作 */ }
  }
  const syncPosition = () => {
    const duration = total(), position = Math.max(0, Number(player.currentTime()) || 0);
    if (typeof session.setPositionState !== 'function') return;
    /* 时长不可用或者进度跑在时长前面时不报：`setPositionState` 对这两种入参直接抛，
       而 `timeupdate` 每秒都来，抛一次就是每秒一条错误。 */
    if (!duration || position > duration) return;
    try {
      session.setPositionState({ duration, position, playbackRate: Math.max(.001, Number(player.playbackRate()) || 1) });
    } catch { /* 浏览器拒收 */ }
  };
  player.on(['timeupdate', 'durationchange', 'ratechange', 'seeked', 'loadedmetadata'], syncPosition);
  syncPosition();
  player.on('dispose', () => {
    registered.forEach((action) => { try { session.setActionHandler(action, null) } catch { /* 已撤 */ } });
    try { session.setPositionState?.() } catch { /* 已撤 */ }
  });
}

/** 加载提示复用 YouTube e937390a 的 `FsY`：四段嵌套元素与四段动画。 */
/** 播放器缓冲那一圈（`player.css` 的 `vjs-peach-spinner-*`）。沉浸页等媒体加载用同一份，媒体等待只有这一种转圈。 */
export const PLAYER_SPINNER_HTML = '<span class="vjs-peach-spinner-container"><span class="vjs-peach-spinner-rotator"><span class="vjs-peach-spinner-left"><span class="vjs-peach-spinner-circle"></span></span><span class="vjs-peach-spinner-right"><span class="vjs-peach-spinner-circle"></span></span></span></span>';

export function mountPlayerSpinner(player: VjsPlayer): void {
  const spinner = player.el().querySelector('.vjs-loading-spinner');
  if (!spinner || spinner.querySelector('.vjs-peach-spinner-container')) return;
  spinner.innerHTML = PLAYER_SPINNER_HTML;
}

/** 本机资产的外挂字幕。服务端已经把 srt/ass/ssa 换成 WebVTT，这里只把它挂成 text track。
 *  认出语言的轨道按语言码显示界面语言的语言名；`label` 是服务端的中文兜底或文件名多出来的那一段。
 *  一律不设 default：自动打开某一条等于替用户选了语言，而同一部片常有简体、繁体、日语三条。
 *  Peach 字幕菜单只在有轨的时候出现；轨道挂在原生 video 上，随同一枚元素保留。 */
export function mountPlayerSubtitles(player: VjsPlayer, assetId: number): void {
  (api(`/api/assets/${assetId}/subtitles`) as Promise<{ subtitles?: { id: string; legacy_id?: string | null; playable?: boolean; src: string; language?: string; label: string }[] } | null>)
    .then((payload) => {
      if (!player || player.isDisposed()) return;
      (payload?.subtitles || []).filter((track) => track.playable).forEach((track) => {
        player.addRemoteTextTrack({ id: track.id, kind: 'subtitles', src: track.src, srclang: track.language || '',
          label: track.language ? languageName(track.language) : track.label, default: false,
          ...(track.legacy_id ? { legacyId: track.legacy_id } : {}) }, true);
      });
    }).catch(() => {});
}
