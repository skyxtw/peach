/* JAV 用户脚本的默认下载渠道与专用令牌。 */
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Select, SelectItem } from '@/components/base/select/select';
import { apiGet, apiSend, errorMessage } from '../../api';
import { t } from '../../i18n';
import { javBrowserSkeleton, rememberShape } from '../../configuration-skeleton';
import { SourceLabel } from '../components/source-label';
import { ErrorText, FieldLabel, Footer, Help, Section, SectionSkeleton, Stack } from './section';
import { busyProps, useAction } from './use-action';
import { UserscriptStatus } from './userscript-status';

const URL = '/api/configuration/jav-browser';
interface State {
  enabled: boolean; provider: string; available: boolean; token?: string;
  active_provider?: string; problems?: string[];
  min_resolution?: number; edition_keywords?: string[];
  userscript: { version: string; minimum_version: string; install_url: string };
  providers: { key: string; label: string; configured: boolean; target: string }[];
}

export function JavBrowserSettings({ receipt, refreshKey }: { receipt(message: string): void; refreshKey: string }) {
  const query = useQuery({ queryKey: ['jav-browser-settings', refreshKey],
    queryFn: ({ signal }) => apiGet<State>(URL, signal), refetchOnMount: 'always', refetchOnWindowFocus: 'always' });
  if (query.error && !query.data) return <ErrorText>{errorMessage(query.error)}</ErrorText>;
  if (query.isFetching && !query.data) return <SectionSkeleton label="正在读取浏览器添加设置" html={javBrowserSkeleton} />;
  return query.data ? <BrowserForm initial={query.data} receipt={receipt} /> : null;
}

function BrowserForm({ initial, receipt }: { initial: State; receipt(message: string): void }) {
  const [state, setState] = useState(initial);
  const [provider, setProvider] = useState(initial.provider);
  const [minResolution, setMinResolution] = useState(String(initial.min_resolution ?? 0));
  const [keywords, setKeywords] = useState((initial.edition_keywords ?? []).join(', '));
  const [token, setToken] = useState('');
  const action = useAction();
  useEffect(() => {
    /* 启用与否决定底栏几颗键，渠道就绪与否决定那句提示在不在：下次骨架照这个结构画。 */
    rememberShape('javBrowser', { enabled: initial.enabled,
      ready: initial.providers.some(item => item.key === initial.provider && item.configured && item.target) });
    setState(initial);
    setProvider(current => initial.providers.some(item => item.key === current) ? current : initial.provider);
    setMinResolution(String(initial.min_resolution ?? 0));
    setKeywords((initial.edition_keywords ?? []).join(', '));
    if (!initial.enabled) setToken('');
  }, [initial]);
  const save = (kind: 'enable' | 'rotate' | 'disable') => {
    void action.run(kind, signal => apiSend<State>(URL, { action: kind, provider }, 'POST', signal), result => {
      const { token: issued = '', ...settings } = result;
      setState(settings);
      setProvider(settings.provider);
      setToken(issued);
      receipt(kind === 'disable' ? '已关闭浏览器添加' : '已生成专用令牌');
    });
  };
  const savePreferences = () => {
    void action.run('preferences', signal => apiSend<State>(URL, {
      action: 'preferences', min_resolution: Number(minResolution),
      edition_keywords: keywords.split(/[,，、]/).map(part => part.trim()).filter(Boolean),
    }, 'POST', signal), result => {
      setState(result);
      setMinResolution(String(result.min_resolution ?? 0));
      setKeywords((result.edition_keywords ?? []).join(', '));
      receipt(t('settings:javBrowser.preferencesSaved'));
    });
  };
  const ready = state.providers.some(item => item.key === provider && item.configured && item.target);
  return <Section guide="browser" title="浏览器添加 JAV">
    <Stack>
      <div className="flex min-w-0 flex-col gap-4">
      <UserscriptStatus enabled={state.enabled} release={state.userscript} />
      <div className="flex flex-col gap-1"><FieldLabel>浏览器添加的下载渠道</FieldLabel>
      <Select aria-label="浏览器添加的下载渠道" selectedKey={provider || null} placeholder="暂无可用渠道"
        onSelectionChange={key => { if (key !== null) setProvider(String(key)); }}
        isDisabled={!state.providers.length || Boolean(action.busy)}>
        {state.providers.map(item => <SelectItem key={item.key} id={item.key} textValue={item.label}>
          <SourceLabel source={item.key} label={item.label} />
        </SelectItem>)}
      </Select></div>
      {!ready ? <Help>请在媒体库中添加支持云下载的网盘，并配置账号与目标目录。</Help> : null}
      {state.problems?.map(problem => <Help key={problem}>{problem}</Help>)}
      <div className="flex flex-col gap-1"><FieldLabel>{t('settings:javBrowser.minResolution')}</FieldLabel>
      <Select aria-label={t('settings:javBrowser.minResolution')} selectedKey={minResolution}
        onSelectionChange={key => { if (key !== null) setMinResolution(String(key)); }}
        isDisabled={Boolean(action.busy)}>
        <SelectItem id="0">{t('settings:javBrowser.minResolutionOff')}</SelectItem>
        <SelectItem id="1080">{t('settings:javBrowser.minResolution1080')}</SelectItem>
        <SelectItem id="2160">{t('settings:javBrowser.minResolution2160')}</SelectItem>
      </Select></div>
      <Input label={t('settings:javBrowser.editionKeywords')} value={keywords} maxLength={320}
        placeholder={t('settings:javBrowser.editionKeywordsPlaceholder')} isReadOnly={Boolean(action.busy)}
        onChange={setKeywords} />
      <Help>{t('settings:javBrowser.editionKeywordsHelp')}</Help>
      <div><Button variant="secondary" type="button" disabled={Boolean(action.busy)}
        onClick={savePreferences} {...busyProps(action.busy === 'preferences')}>
        {t('settings:javBrowser.savePreferences')}
      </Button></div>
      {state.enabled && state.active_provider && !state.providers.some(item => item.key === state.active_provider)
        ? <Help>已启用的下载渠道不可用，请选择渠道并更新令牌。</Help> : null}
      <Input label="Peach 地址" value={window.location.origin} isReadOnly autoComplete="off" />
      {token ? <>
        <Input label="浏览器添加专用令牌" type="password" value={token} isReadOnly autoComplete="new-password" />
        <div><Button variant="secondary" type="button" onClick={() => {
          void action.run('copy', async () => navigator.clipboard.writeText(JSON.stringify({
            peach_pairing: 1, base: window.location.origin, token,
          })), () => receipt('已复制配对信息'));
        }} {...busyProps(action.busy === 'copy')}>复制配对信息</Button></div>
        <Help>在用户脚本设置的「Peach 地址」中粘贴配对信息，即可填好地址与令牌。</Help>
      </> : null}
      </div>
      {action.error ? <ErrorText>{action.error}</ErrorText> : null}
    </Stack>
    <Footer>
      {state.enabled ? <Button variant="secondary" type="button" disabled={Boolean(action.busy)}
        onClick={() => save('disable')}>关闭浏览器添加</Button> : null}
      <Button type="button" disabled={!state.available || !ready || Boolean(action.busy)}
        onClick={() => save(state.enabled ? 'rotate' : 'enable')}
        {...busyProps(action.busy === 'enable' || action.busy === 'rotate')}>
        {state.enabled ? '更新渠道与令牌' : '启用并生成令牌'}
      </Button>
    </Footer>
  </Section>;
}
