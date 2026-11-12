import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { RiArrowDownSLine, RiArrowRightLine } from '@remixicon/react';
import { Dialog, Popover } from 'react-aria-components';
import { Button } from '@/components/base/buttons/button';
import { LinkButton } from '@/components/base/buttons/link-button';
import { MENU_ITEM, MENU_ITEM_INTERACTIVE, MENU_POPOVER_SURFACE } from '@/components/base/dropdown/menu-styles';
import { cx } from '@/utils/cx';
import { formModal } from '@peach/legacy/ui';
import { useMovingSurface } from '../components/use-moving-surface';
import { busyProps } from '../settings/use-action';
import { errorMessage } from '../../api';
import { t } from '../../i18n';
import { fetchProcessingEstimate, type LibraryProcessingCommand, type ProcessingSpeed, type ProcessingTraffic } from './library-processing';
import { ProcessingEffort } from './processing-effort';
import { TrafficProgress } from './processing-traffic';

interface ProcessingOption {
  label: string; description: string; command: LibraryProcessingCommand; disabled?: boolean;
}

function ProcessingMenuGroup({ label, maintenance = false, children }: {
  label: string; maintenance?: boolean; children: ReactNode;
}) {
  const ref = useMovingSurface('hover');
  return <div ref={ref} role="group" aria-label={label} data-processing-maintenance={maintenance || undefined}
    className={cx('flex flex-col gap-1', maintenance && 'mt-2')}>
    {children}
  </div>;
}

function ProcessingMenuOption({ option, metadataOnly, onRun }: {
  option: ProcessingOption; metadataOnly: boolean; onRun(command: LibraryProcessingCommand): void;
}) {
  const blocked = metadataOnly && option.command.stage === 'previews';
  const disabled = blocked || option.disabled;
  return <button type="button" disabled={disabled}
    title={blocked ? '请先在媒体库设置中开启视频预览生成' : undefined}
    className={cx(MENU_ITEM, disabled ? 'cursor-not-allowed opacity-50' : MENU_ITEM_INTERACTIVE, 'text-body-2-medium')}
    onClick={() => onRun(option.command)}><span className="flex min-w-0 flex-col gap-1">
      <span>{option.label}</span><span className="text-caption-1-regular text-text-secondary">{option.description}</span>
    </span></button>;
}

function ProcessingPrompt({ command, speed, dialog, onSpeed, busy, libraryName }: {
  libraryName?: string;
  command: LibraryProcessingCommand; speed: ProcessingSpeed; dialog: ReturnType<typeof formModal>;
  onSpeed(value: ProcessingSpeed): void; busy: boolean;
}) {
  const [mode, setMode] = useState(speed);
  const [traffic, setTraffic] = useState<ProcessingTraffic>();
  const [failure, setFailure] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const load = async (inventory?: string) => {
      try {
        const result = await fetchProcessingEstimate(command, controller.signal, inventory);
        if (!result.traffic) throw new Error('服务端未提供流量预估');
        if (controller.signal.aborted) return;
        setTraffic(result.traffic);
        dialog.confirmButton.disabled = false;
        if (result.traffic.inventory?.token) timer = setTimeout(() => { void load(result.traffic.inventory?.token) }, 250);
      } catch (error) {
        if (!controller.signal.aborted) {
          setFailure(errorMessage(error));
          dialog.confirmButton.disabled = false;
        }
      }
    };
    void load();
    return () => { controller.abort(); clearTimeout(timer) };
  }, [command, dialog]);
  const scope = command.incremental ? command.stage === 'scan' ? '尚未登记的新增文件' : '新增文件与待补全影片'
    : command.scope === 'new' ? '已登记的待补全影片'
    : command.stage === 'covers' ? t('library-processing:coverOnlyScope')
    : command.stage === 'previews' ? '已入库的视频（跳过流量保护目录）' : '全部文件与影片';
  return <div className="flex flex-col gap-4">
    <p data-processing-scope className="text-body-2-medium text-text-primary">处理范围：{libraryName || '所有媒体库'} · {scope}</p>
    <div className="flex justify-center"><ProcessingEffort value={mode} busy={busy} onChange={value => { setMode(value); onSpeed(value) }} /></div>
    {traffic ? <TrafficProgress traffic={traffic} initial /> : null}
    {failure || !traffic ? <p role="status" className="text-body-2-regular text-text-secondary">{failure ? `流量预估未取得：${failure}` : '正在估算流量…'}</p> : null}
  </div>;
}

/** 扫描和已有作品补全共用资料流水线，视频预览由媒体库设置决定。
 *
 * `busy` 是这次启动还在路上，按钮标 `aria-busy`，点击由共享的忙碌拦截吞掉。`occupied` 是已有
 * 任务在跑：按钮只标 `aria-disabled`，点击仍会到达，由 `onOccupied` 告诉人为什么没有开始。 */
export function ProcessingActions({ busy, occupied = false, scan = false, metadataOnly = false, speedMode = 'standard', pendingCount = 0, libraryId, libraryName, onRun, onOccupied }: {
  libraryId?: string; libraryName?: string;
  busy: boolean; occupied?: boolean; scan?: boolean; metadataOnly?: boolean; speedMode?: ProcessingSpeed; pendingCount?: number;
  onRun(command: LibraryProcessingCommand): void | Promise<unknown>;
  onOccupied?(): void;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const prompt = useRef<ReturnType<typeof formModal> | null>(null);
  const [promptView, setPromptView] = useState<{ host: HTMLElement; footer: HTMLElement; dialog: ReturnType<typeof formModal>; command: LibraryProcessingCommand } | null>(null);
  const selectedSpeed = useRef(speedMode);
  useEffect(() => () => prompt.current?.close(), []);
  const [open, setOpen] = useState(false);
  const primary: ProcessingOption = { label: scan ? '同步新增文件' : '同步这些影片', description: '',
    command: scan ? {incremental:true} : { stage: 'collect' as const } };
  const dailyOptions: ProcessingOption[] = [
    {label:'仅发现新增文件', description:'扫描并登记新文件，保留已有影片资料', command:{stage:'scan',incremental:true}},
    {label:'补全待处理影片', description:libraryId ? '补全所选媒体库内已登记的待处理影片'
      : pendingCount ? `${pendingCount.toLocaleString()} 部已登记影片等待补全` : '暂无待补全影片',
      command:{stage:'collect',scope:'new'}, disabled:!pendingCount},
  ];
  const options: ProcessingOption[] = [
    ...(scan ? [{label:libraryId ? '同步所选媒体库' : '同步所有媒体库',description:'检查所选范围的全部文件，补全缺失资料和预览',command:{}}] : []),
    ...(scan ? [{ label: '仅扫描文件', description: '发现文件，读取视频时长和分辨率', command: { stage: 'scan' as const } }] : []),
    ...(scan ? [{ label: '补全资料与预览', description: metadataOnly ? '补已有影片的资料和视频属性' : '补资料和视频属性，生成预览图', command: { stage: 'collect' as const } }] : []),
    { label: '仅补全影片资料', description: '补影片资料、封面和人物资料', command: { stage: 'metadata' as const } },
    { label: t('library-processing:coverOnly'), description: t('library-processing:coverOnlyDescription'), command: { stage: 'covers' as const } },
    { label: '仅补全预览图', description: '为已入库的视频生成九宫格，跳过流量保护目录', command: { stage: 'previews' as const } },
  ];
  const blocked = busy || occupied;
  const blockedProps = busy ? busyProps(true) : occupied ? { 'aria-disabled': true } as const : {};
  const run = (command: LibraryProcessingCommand) => {
    if (busy) return;
    if (occupied) { onOccupied?.(); return }
    command = { ...command, ...(libraryId ? { library_id: libraryId } : {}) };
    setOpen(false);
    if (!scan) {
      void Promise.resolve(onRun(command)).catch(() => { /* 错误由任务入口留在原位 */ });
      return;
    }
    if (prompt.current) return;
    selectedSpeed.current = speedMode;
    const previews = command.stage === 'previews';
    const title = command.scope === 'new' ? '补全待处理影片'
      : command.incremental ? command.stage === 'scan' ? '发现新增文件' : '同步新增文件'
      : previews ? '仅补全预览图' : command.stage === 'covers' ? t('library-processing:coverOnly')
      : command.stage === 'scan' ? '扫描全部文件'
      : command.stage === 'metadata' ? '仅补全影片资料' : command.stage === 'collect' ? '补全已入库影片' : libraryId ? '同步所选媒体库' : '同步所有媒体库';
    const work = command.scope === 'new' ? '为这组已登记的影片补全资料和视频属性，并按设置生成预览'
      : command.incremental
      ? command.stage === 'scan' ? '发现并登记未入库的新文件，保留已有影片资料'
      : `发现新文件，仅补全新增及未完成影片的资料和视频属性${metadataOnly ? '' : '，并生成预览图'}`
      : previews ? '为已入库的视频补全九宫格预览图，跳过流量保护目录，会读取视频并占用处理器'
      : command.stage === 'covers' ? t('library-processing:coverOnlyWork')
      : command.stage === 'scan' ? '扫描目录并登记文件，按目录设置读取视频时长和分辨率'
      : command.stage === 'metadata' ? '读取配套资料，补全影片资料、封面和人物资料'
      : `${command.stage === 'collect' ? '为已入库影片补全资料和视频属性' : '扫描目录发现文件，再补全资料和视频属性'}${metadataOnly ? '' : '，并生成预览图'}`;
    const dialog = formModal({
      title,
      description: `${libraryName ? `媒体库「${libraryName}」：` : '所有媒体库：'}${work}，可能让电脑变慢。需要同时使用电脑时，可选择低占用模式。`,
      body: '<div class="peach-react" data-processing-prompt></div>',
      confirmLabel: title,
      confirmDisabled: true,
      onConfirm: async () => {
        await onRun({ ...command, ...(selectedSpeed.current === speedMode ? {} : { speed_mode: selectedSpeed.current }) });
      },
    });
    const footer = document.createElement('span');
    footer.className = 'peach-react flex items-center';
    dialog.confirmButton.before(footer);
    prompt.current = dialog;
    setPromptView({ host: dialog.dialog.querySelector<HTMLElement>('[data-processing-prompt]')!, footer, dialog, command });
    void dialog.done.then(() => { if (prompt.current === dialog) { prompt.current = null; setPromptView(null) } });
  };
  return <>
    {promptView ? createPortal(<ProcessingPrompt libraryName={libraryName} command={promptView.command} dialog={promptView.dialog}
      speed={speedMode} busy={blocked} onSpeed={value => { selectedSpeed.current = value }} />, promptView.host) : null}
    {promptView ? createPortal(<LinkButton href="/settings/library" size="small" variant="primary" trailingIcon={RiArrowRightLine} disabled={blocked}
      onClick={event => {
        if (promptView.dialog.confirmButton.getAttribute('aria-busy') === 'true') { event.preventDefault(); return }
        promptView.dialog.close();
      }}>管理媒体库</LinkButton>, promptView.footer) : null}
    <span data-button-group data-split-button data-variant="primary">
      <Button {...blockedProps} onClick={() => run(primary.command)}>{primary.label}</Button>
      <Button ref={trigger} iconOnly leadingIcon={RiArrowDownSLine} aria-label="更多同步方式"
        aria-haspopup="dialog" aria-expanded={open} {...blockedProps} onClick={() => {
          if (busy) return;
          if (occupied) onOccupied?.(); else setOpen(!open);
        }} />
    </span>
    <Popover triggerRef={trigger} isOpen={open} onOpenChange={setOpen} placement="bottom end" offset={4}
      className={MENU_POPOVER_SURFACE}>
      <Dialog aria-label="同步方式" className="flex w-80 flex-col gap-1 outline-none">
        {scan ? <ProcessingMenuGroup label="日常同步">
          <p className="px-2 py-1 text-caption-1-medium text-text-secondary">日常同步</p>
          {dailyOptions.map(option => <ProcessingMenuOption key={option.label} option={option} metadataOnly={metadataOnly} onRun={run} />)}
        </ProcessingMenuGroup> : null}
        <ProcessingMenuGroup label={scan ? '全库维护' : '补全方式'} maintenance={scan}>
          {scan ? <p className="px-2 py-1 text-caption-1-medium text-text-secondary">全库维护</p> : null}
          {options.map(option => <ProcessingMenuOption key={option.label} option={option} metadataOnly={metadataOnly} onRun={run} />)}
        </ProcessingMenuGroup>
      </Dialog>
    </Popover>
  </>;
}
