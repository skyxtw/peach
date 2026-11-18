import { useEffect, useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { apiGet, apiSend } from '../../api';
import { SelectField } from '../settings-panel/legacy-controls';
import { ErrorText, Help } from '../settings/section';
import { busyProps, useAction } from '../settings/use-action';
import { t } from '../../i18n';
import { serverLabel } from '../../core/server-text';
import { markExternalPlayback } from '../../player/progress';
import { queryClient } from '../../query/client';
import { schemePlayers, type SchemePlayer } from '../../player/external-schemes';

const TARGET_KEY = 'peach.playback-target.v1';
/** 本机播放器：`label` 是播放器名或服务端按 zh-CN 渲染的「系统默认播放器」，后者带 `label_code`。 */
type LocalPlayer = { id: string; label: string; label_code?: string };
const NETWORK_TARGETS = [['m3u', t('catalog:externalPlayback.m3uPlaylist')], ['url', t('catalog:externalPlayback.streamUrlVr')]] as const;
const schemeLabel = (player: SchemePlayer) => player.label || t('catalog:externalPlayback.androidChooser');
/** 链接调起的播放器按客户端平台给；本机已检测到的同名播放器走服务端打开，不重复列。 */
const schemeTargets = (players: LocalPlayer[] | null) =>
  schemePlayers(undefined, (players || []).map(item => item.id)).map(player => [`scheme:${player.id}`, player] as const);

function savedTarget(): string | null {
  try {
    return localStorage.getItem(TARGET_KEY)
      || (localStorage.getItem('peach.local-player.v1') ? `local:${localStorage.getItem('peach.local-player.v1')}` : null);
  } catch { return null }
}

export function ExternalPlayback({ id, onOpened }: { id: number; onOpened?(): void }) {
  const [players, setPlayers] = useState<LocalPlayer[] | null>(null);
  const [pinned, setPinned] = useState(() => savedTarget() !== null);
  const [player, setPlayer] = useState(() => savedTarget() ?? 'local:default');
  const [links, setLinks] = useState<{ url: string; playlist: string } | null>(null);
  const [loadError, setLoadError] = useState('');
  const [epoch, setEpoch] = useState(0);
  const [externalLaunch, setExternalLaunch] = useState<number | null>(null);
  const action = useAction();
  useEffect(() => {
    const controller = new AbortController();
    apiGet<{ players: LocalPlayer[] }>('/api/local-players', controller.signal).then(result => {
      if (controller.signal.aborted) return;
      setPlayers(result.players);
      setPlayer(current => {
        const valid = result.players.some(item => `local:${item.id}` === current)
          || NETWORK_TARGETS.some(([key]) => key === current)
          || schemeTargets(result.players).some(([key]) => key === current);
        if (pinned && valid) return current;
        /* 没存过选择时优先挑能回传进度的本机播放器；系统默认播放器仍可手动选。 */
        const preferred = result.players.find(item => item.id !== 'default') ?? result.players[0];
        return preferred ? `local:${preferred.id}` : 'm3u';
      });
    }).catch(cause => {
      if (controller.signal.aborted) return;
      setPlayers([]);
      setPlayer(current => NETWORK_TARGETS.some(([key]) => key === current)
        || schemeTargets([]).some(([key]) => key === current) ? current : 'm3u');
      setLoadError(String(cause.message || cause));
    });
    return () => controller.abort();
  }, [epoch]);
  useEffect(() => {
    if (externalLaunch === null) return;
    let cancelled = false, checking = false, timer: ReturnType<typeof setTimeout> | null = null;
    const finish = () => {
      setExternalLaunch(null);
      void queryClient.invalidateQueries({ queryKey: ['item', id] });
    };
    const readFinal = () => {
      void apiGet<{ leave_ratio?: number; duration?: number; last_played?: number | string }>(`/api/item?id=${id}&_=${Date.now()}`).then(item => {
        if (cancelled) return;
        const playedAt = Number(item.last_played), ratio = Number(item.leave_ratio), total = Number(item.duration);
        if (playedAt > externalLaunch && total > 0 && ratio > 0) {
          const video = document.querySelector<HTMLVideoElement>('#stage video');
          if (video) video.currentTime = ratio >= 1 ? 0 : Math.floor(ratio * total);
        }
        finish();
      }).catch(finish);
    };
    const poll = () => {
      timer = null;
      if (cancelled || checking) return;
      checking = true;
      void apiGet<{ active: number[] }>(`/api/local-playback/status?_=${Date.now()}`).then(status => {
        checking = false;
        if (cancelled) return;
        if (status.active.includes(Number(id))) { timer = setTimeout(poll, 700); return }
        /* 跟踪线程结束前已经完成最后一次落库；这时再读 /api/item 拿关闭点。 */
        readFinal();
      }).catch(() => { checking = false; timer = setTimeout(poll, 1000) });
    };
    const wake = () => {
      if (cancelled || checking) return;
      if (timer) clearTimeout(timer);
      poll();
    };
    const onVisible = () => { if (!document.hidden) wake() };
    window.addEventListener('focus', wake);
    document.addEventListener('visibilitychange', onVisible);
    poll();
    const deadline = setTimeout(finish, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', wake);
      document.removeEventListener('visibilitychange', onVisible);
      if (timer) clearTimeout(timer);
      clearTimeout(deadline);
    };
  }, [externalLaunch, id]);
  const open = () => void action.run('open', async signal => {
    if (player.startsWith('local:')) {
      const video = document.querySelector<HTMLVideoElement>('#stage video');
      const position = Math.max(0, Math.floor(Number(video?.currentTime) || 0));
      const opened = await apiSend<{ tracked?: boolean }>(`/api/local-playback?id=${id}&player=${encodeURIComponent(player.slice(6))}&position=${position}`, {}, 'POST', signal);
      if (opened?.tracked) { markExternalPlayback(`item:${id}`); setExternalLaunch(Date.now() / 1000) }
      return null;
    }
    const result = await apiSend<{ url: string; playlist: string }>(`/api/external-playback?id=${id}`, {}, 'POST', signal);
    return { url: new URL(result.url, location.origin).href, playlist: new URL(result.playlist, location.origin).href };
  }, result => {
    if (!result) {
      document.querySelector<HTMLVideoElement>('#stage video')?.pause();
      onOpened?.();
      return;
    }
    setLinks(result);
    if (player === 'url') return;
    const scheme = schemeTargets(players).find(([key]) => key === player)?.[1];
    const link = document.createElement('a');
    link.href = scheme ? scheme.link(result.url) : result.playlist;
    link.rel = 'noreferrer';
    document.body.append(link);
    link.click();
    link.remove();
  });
  return <div data-local-playback="">
    <div data-local-playback-row="">
      <SelectField id={`external-player-${id}`} label={t('catalog:externalPlayback.externalPlayer')}
        options={[...(players || []).map(item => [`local:${item.id}`, serverLabel(item.label_code ?? '', item.label)] as const),
          ...schemeTargets(players).map(([key, item]) => [key, schemeLabel(item)] as const), ...NETWORK_TARGETS]}
        value={player} disabled={players === null || !!action.busy} epoch={epoch * 2 + Number(players !== null)} onPick={value => {
          setPlayer(value); setPinned(true);
          setLinks(null);
          action.setError('');
          try { localStorage.setItem(TARGET_KEY, value) } catch { /* 浏览器未允许保存偏好。 */ }
        }} />
      <Button variant="secondary" aria-label={t('catalog:externalPlayback.openInPlayer')} disabled={players === null}
        {...busyProps(action.busy === 'open')} onClick={open}>{t('catalog:shared.open')}</Button>
    </div>
    {players === null ? <Help>{t('catalog:externalPlayback.detectingPlayers')}</Help>
      : player === 'local:default' ? <Help>{t('catalog:externalPlayback.defaultPlayerNoResume')}</Help> : null}
    {action.error || loadError ? <ErrorText>{action.error || loadError}</ErrorText> : null}
    {loadError ? <Button variant="secondary" disabled={!!action.busy}
      onClick={() => { setLoadError(''); setPlayers(null); setEpoch(value => value + 1) }}>{t('catalog:externalPlayback.redetect')}</Button> : null}
    {links ? <>
      <Input label={t('catalog:externalPlayback.streamUrl')} value={links.url} isReadOnly />
      <Help>{player.startsWith('scheme:') ? t('catalog:externalPlayback.schemeHint') : t('catalog:externalPlayback.streamUrlHint')}</Help>
    </> : null}
  </div>;
}
