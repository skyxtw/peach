/* 扫描与采集的数据契约、轮询节律与纯折算。
 *
 * 数据管理页卡片、常驻任务面与缺预览提示读同一个 `queryKey`，使用同一份任务快照。
 * 轮询也由 Query 合成一份，进度、失败与完成状态由服务端统一提供。
 * 端点在 `frontend/src` 里只在这里声明一次（`tests/test_frontend_build.py` 盯着）。 */
import { apiGet } from '../../api';
import { t } from '../../i18n';
import { elapsedText, progressText } from '../activity/tasks';
import { queryClient } from '../query';

export const LIBRARY_PROCESSING_URL = '/api/library-processing';

/** 卡片与常驻任务面共用这一个键。 */
export const LIBRARY_PROCESSING_KEY = ['library-processing'] as const;

/** 处理过程中记下的一条问题。`asset_id` 为空时说的是媒体来源本身。 */
export interface LibraryProcessingIssue {
  asset_id: number | null;
  title?: string;
  path?: string;
  message: string;
  /** `paused` 是来源限流没轮到这一项，等来源放开再跑就有；`error` 是它自己出的事。 */
  severity?: 'info' | 'error' | 'paused';
}

/** 一趟扫描与采集的快照。字段以 `q_library_processing`（`src/peach/web_library_processing.py`）为准。 */
export interface LibraryProcessingData {
  library_id?: string | null;
  library_name?: string;
  metadata_only?: boolean;
  /** `idle` | `running` | `pausing` | `paused` | `stopping` | `cancelled` | `complete` | `failed`。 */
  status: string;
  /** 本轮各阶段已处理完但留有问题，或执行中断。 */
  outcome?: 'complete' | 'partial' | 'interrupted' | 'cancelled';
  archived?: boolean;
  new_asset_count?: number;
  /** 进行中这一轮在任务中心记的发起方式：`manual` | `scheduled` | `startup` | `cli`。 */
  trigger?: string;
  speed_mode?: ProcessingSpeed;
  eta_seconds_min?: number | null;
  eta_seconds_max?: number | null;
  eta_kind?: 'historical' | 'measured' | 'estimating';
  eta_scope?: string;
  eta_initial?: boolean;
  job_id?: string;
  stage?: string;
  requested_stage?: string;
  steps?: { id: string; label: string; status: 'pending' | 'current' | 'complete' }[];
  checked?: number;
  total?: number;
  scanned?: number;
  scanned_bytes?: number;
  identified?: number;
  candidates?: number;
  auto_applied?: number;
  covers?: number;
  previews?: number;
  /* 落库之后补齐女优资料那一步的四个读数：别名、头像、交回人工的冲突、没取到的头像。 */
  performer_aliases?: number;
  performer_avatars?: number;
  performer_profile_conflicts?: number;
  performer_profile_failed?: number;
  error?: string;
  issue_count?: number;
  /** `issue_count` 里卡在来源限流上的那些，等来源放开再跑一次就有。 */
  paused_count?: number;
  issue_preview?: LibraryProcessingIssue[];
  issues_log?: string;
  issues_truncated?: boolean;
  retryable_asset_ids?: number[];
  notes?: Record<string, number>;
  current_asset_id?: number | null;
  current_asset_name?: string;
  current_action?: string;
  current_started_at?: number;
  /** 当前这一项正在等的外部来源；`network` 是它这次请求走的那条路。 */
  current_source?: { key: string; label: string; network?: string };
  skip_requested?: boolean;
  last_progress_at?: number;
  stalled?: boolean;
  waited_seconds?: number;
  completed_at?: number;
  traffic?: ProcessingTraffic;
}

export interface TrafficWorkload {
  video_files: number; jav_files: number; jav_titles: number;
  pending_jav_titles?: number; metadata_average_bytes?: number;
}
export interface TrafficSource {
  connection?: 'direct' | 'proxy' | 'system' | 'unknown';
  workload?: TrafficWorkload;
  estimated_bytes?: number;
  key: string; label: string; root: string; location: string; metered: boolean;
  used_bytes: number; estimated_min_bytes: number; estimated_max_bytes: number;
  unobserved: string[];
}
export interface ProcessingTraffic {
  disk?: {
    estimated_bytes: number; temporary_bytes: number; can_fit: boolean | null; cache_unknown: boolean;
    volumes: { path: string; labels: string[]; free_bytes: number | null; estimated_bytes: number;
      temporary_bytes: number; reserve_bytes: number | null; required_bytes: number | null;
      shortfall_bytes: number | null; can_fit: boolean | null }[];
  };
  unknown_route_estimated_bytes?: number;
  workload?: TrafficWorkload;
  inventory?: { complete: boolean; errors: number; token?: string };
  estimated_bytes?: number; metered_estimated_bytes?: number;
  used_bytes: number; estimated_min_bytes: number; estimated_max_bytes: number;
  metered_used_bytes: number; metered_estimated_min_bytes: number; metered_estimated_max_bytes: number;
  sources: TrafficSource[]; partial: boolean; unknown_files: boolean;
}

export const fetchProcessingEstimate = (command: LibraryProcessingCommand, signal?: AbortSignal, inventory?: string) => {
  const params = new URLSearchParams({ estimate: '1', stage: command.stage || 'all' });
  if (command.asset_ids) params.set('asset_ids', JSON.stringify(command.asset_ids));
  if (command.scope) params.set('scope', command.scope);
  if (command.library_id) params.set('library_id', command.library_id);
  if (command.incremental) params.set('incremental', '1');
  if (inventory) params.set('inventory', inventory);
  return apiGet<{ traffic: ProcessingTraffic }>(`${LIBRARY_PROCESSING_URL}?${params}`, signal);
};

/** 一次写操作的请求体：指定处理阶段与影片，或者按任务号重试失败项。 */
export type ProcessingSpeed = 'low' | 'standard' | 'high';
export interface LibraryProcessingCommand {
  library_id?: string;
  incremental?: boolean;
  scope?: 'new';
  stage?: 'scan' | 'collect' | 'previews' | 'metadata' | 'covers';
  asset_ids?: number[];
  job_id?: string;
  retry?: number[];
  speed_mode?: ProcessingSpeed;
}
export type ProcessingControlCommand =
  | { action: 'pause' | 'resume' | 'cancel' | 'archive' | 'unarchive'; job_id: string }
  | { action: 'set_speed'; speed_mode: ProcessingSpeed; job_id?: string }
  | { action: 'skip_current'; job_id: string; asset_id: number };

/** 单部影片问外部来源超过这么久，就把跳过与改走代理摆出来。 */
export const SLOW_ITEM_SECONDS = 120;
const SLOW_ACTIONS: Record<string, string> = { fetching_cover: '封面', querying_metadata: '资料' };

export interface SlowItem { what: string; source?: LibraryProcessingData['current_source'] }

/** 跳过入口属于外部资料与封面采集，扫描和生成预览使用各自的任务控制。 */
export function slowItem(state?: LibraryProcessingData): SlowItem | null {
  if (state?.status !== 'running' || state.current_asset_id == null) return null;
  const what = SLOW_ACTIONS[state.current_action || ''];
  if (!what || (state.waited_seconds || 0) < SLOW_ITEM_SECONDS) return null;
  return { what, source: state.current_source };
}

export function slowItemText({ what, source }: SlowItem): string {
  const who = `${source?.label ? `${source.label} ` : '外部来源'}迟迟没有返回${what}`;
  return `${who}。可以先跳过这部，任务结束后再重试。`;
}

/** 暂停中的任务仍占用同一份处理范围，可继续并持续读取状态。 */
export const processingActive = (state?: LibraryProcessingData) =>
  !!state && ['running', 'pausing', 'paused', 'stopping'].includes(state.status);

export const processingHasPartialResult = (state?: LibraryProcessingData) =>
  state?.status === 'failed' && state.outcome === 'partial';

export const PARTIAL_RESULT_TEXT = '已入库的视频可在全部内容中浏览，未完成项可单独重试。';
export const ALL_CONTENT_URL = '/?loc=&thumb=0';

/** 时间向分钟取整；区间两端始终使用同一单位。 */
export function remainingTime(state: LibraryProcessingData): string {
  if (!processingActive(state)) return '';
  if (state.status === 'stopping') return '正在取消，等待当前步骤退出；已取得的结果会保留';
  if (state.status === 'paused') return '已暂停，继续后更新预估';
  if (state.status === 'pausing') return '正在暂停，当前步骤结束后暂停';
  if (state.stalled) return '等待当前文件响应，剩余时间待更新';
  const low = state.eta_seconds_min, high = state.eta_seconds_max;
  if (low == null || high == null || !Number.isFinite(low) || !Number.isFinite(high) || low < 0 || high < low)
    return '正在估算剩余时间…';
  if (high < 60) return '预计剩余不到 1 分钟';
  const unit = high >= 86400 ? 86400 : high >= 3600 ? 3600 : 60;
  const label = unit === 86400 ? '天' : unit === 3600 ? '小时' : '分钟';
  const precision = unit === 60 ? 1 : 10;
  const start = Math.max(1 / precision, Math.floor(low / unit * precision) / precision);
  const end = Math.max(start, Math.ceil(high / unit * precision) / precision);
  const span = start === end ? `${end}` : `${start}–${end}`;
  const rough = state.eta_initial || state.eta_kind !== 'measured' ? '（粗估）' : '';
  return `预计剩余约 ${span} ${label}${rough}${state.eta_scope ? ` · ${state.eta_scope}` : ''}`;
}

export const fetchLibraryProcessing = (signal?: AbortSignal) =>
  apiGet<LibraryProcessingData>(LIBRARY_PROCESSING_URL, signal);

/** 首屏。中止时 `fetchQuery` 把 `AbortError` 抛回挂载方，它据此放弃这一次。 */
export async function prefetchLibraryProcessing(signal: AbortSignal): Promise<void> {
  await queryClient.fetchQuery({
    queryKey: LIBRARY_PROCESSING_KEY,
    queryFn: () => fetchLibraryProcessing(signal),
  });
}

/** 在跑的时候两秒问一次，和别的后台任务同一个节律。 */
export const RUNNING_POLL_MS = 2000;
/** 闲着时也接着问：任务由后台自己起，两个读者都要认出「现在跑起来了」。 */
export const IDLE_POLL_MS = 10_000;

/** 读失败时页面上留的那句话。上一份数据不撤，下一轮轮询自己会接上。 */
export const DISCONNECTED_TEXT = '连接中断，正在重新读取处理进度';

/** 任务的发起方式写进句子里用的说法；`TRIGGER_LABELS` 是任务中心列表的短标签，放进句子读不通。 */
const TRIGGER_PHRASES: Record<string, string> = {
  manual: '在网页发起', scheduled: '定时发起', startup: '服务启动时自动发起', cli: '由命令行或托盘发起',
};

/** 保存媒体库设置会重启 Peach：在跑的这一轮会怎样，按它跑在哪个进程、是否已暂停分开说。
 * 命令行与托盘起的是独立的 `peach process` 进程，重载只停服务；服务内的任务由启动恢复接着跑，
 * 用户暂停的那一轮恢复时跳过。勾了「保存后扫描」的那一趟要等全库处理锁，排在后面。 */
export function restartEffectText(state: LibraryProcessingData, scanAfterSave: boolean): string {
  const effect = state.trigger === 'cli' ? '这个任务由命令行或托盘发起，在独立进程里运行，不受重启影响。'
    : state.status === 'paused' ? '已暂停的任务会保持暂停，重启后点继续即可接着处理。'
    : '正在进行的任务会随重启中断，重启后从中断处继续。';
  return `保存后 Peach 会重新启动。${effect}${scanAfterSave ? '勾选的「保存后扫描并补全资料」会排在当前任务之后。' : ''}`;
}

/** 已有任务在跑时点同步的回执，写明这一轮是怎么发起的。 */
export function busyText(state: LibraryProcessingData): string {
  const origin = TRIGGER_PHRASES[state.trigger || ''];
  return `当前的扫描与采集任务${origin ? `（${origin}）` : ''}还没结束，等它完成或取消后再开始新的同步`;
}

export function pollInterval(
  data: LibraryProcessingData | undefined, watching: boolean,
): number | false {
  if (processingActive(data)) return RUNNING_POLL_MS;
  return watching ? IDLE_POLL_MS : false;
}

const ACTION_LABELS: Record<string, string> = {
  scanning_files: '扫描文件',
  reading_local: '检查配套文件',
  reading_local_cover: '读取配套图片',
  querying_metadata: '查询外部资料',
  fetching_cover: '采集缺失封面',
  skipped: '已跳过',
  generating_preview: '生成视频预览',
  writing_candidates: '保存待确认资料',
};

/* 来源说「没有」按类型报一个数，不进问题清单：馆藏里大量独立资源和创作者作品
   任何目录站都收不到，它们不是待办。键与 `library_processing.MISS_MESSAGES` 同源。 */
const NOTE_LABELS: Record<string, string> = {
  querying_metadata: '没有资料',
  fetching_cover: '没有封面',
};

export function notesLine(notes: Record<string, number>): string {
  const parts = Object.entries(notes)
    .filter(([key, count]) => NOTE_LABELS[key] && count > 0)
    .map(([key, count]) => `${NOTE_LABELS[key]} ${count.toLocaleString()} 部`);
  return parts.length ? `外部来源${parts.join('、')}，7 天内不再问。` : '';
}

/** 此刻在做什么：哪个文件、哪一步、等了多久。 */
export function currentLine(state: LibraryProcessingData): string {
  if (state.status === 'paused') return '已暂停';
  if (state.status === 'pausing') return '正在暂停';
  const action = ACTION_LABELS[state.current_action || ''] || state.stage || '正在处理';
  const waited = state.waited_seconds ? ` · 已等待 ${elapsedText(state.waited_seconds)}` : '';
  return state.current_asset_name
    ? `当前：${state.current_asset_name} · ${action}${waited}`
    : action + waited;
}

/** 已知总量显示实际完成数；扫描目录期间显示持续发现的文件数。 */
export function processingLine(state: LibraryProcessingData): string {
  const count = state.total ? `${progressText(state.checked, state.total)} 项`
    : state.current_action === 'scanning_files' || state.stage === '扫描文件'
      ? `已发现 ${(state.scanned || 0).toLocaleString()} 个文件` : '';
  return currentLine(state) + (count ? ` · ${count}` : '');
}

/** 折叠起来的问题清单：一句结论 + 逐条明细 + 完整日志的地址。没有问题时是 `null`。 */
export interface IssueDetails {
  label: string;
  items: { key: string; label: string; href: string; note: string; hint: string }[];
  /** 完整记录的本机路径，原样一串：前缀文字和打开它的那颗键归页面，那里才知道摆在哪。 */
  log: string;
}

export function issueDetails(state: LibraryProcessingData): IssueDetails | null {
  const issues = state.issue_preview || [];
  if (!issues.length) return null;
  return {
    label: state.issues_truncated
      ? `问题清单：共 ${state.issue_count || 0} 项，展开查看前 ${issues.length} 项`
      : `问题清单：共 ${state.issue_count || 0} 项`,
    items: issues.map((issue, at) => ({
      key: `${issue.asset_id ?? 'source'}-${at}`,
      label: issue.title || (issue.asset_id ? `视频 ${issue.asset_id}` : '媒体来源'),
      href: issue.asset_id ? `/assets/${issue.asset_id}` : '',
      note: issue.message,
      hint: issue.path || '',
    })),
    log: state.issues_log || '',
  };
}

/* 完成用通知报一次。常驻任务面和数据管理页的卡片看的是同一个任务，谁先看到结束谁报，
   另一处按任务号认出来就不再报。首次引导添加文件夹后那一趟常在跳到目录页之前就跑完
   （一个文件一秒），任务面从没见过「运行中」，所以刚结束的任务第一次读到时也报。 */
const ANNOUNCED_KEY = 'peach.library-processing.announced';
const FRESH_COMPLETION_SECONDS = 120;

export function freshProcessingResult(state: LibraryProcessingData): boolean {
  const age = state.completed_at == null ? Infinity : Date.now() / 1000 - state.completed_at;
  return !!state.job_id && age >= 0 && age < FRESH_COMPLETION_SECONDS;
}

export function announceCompletion(
  state: LibraryProcessingData, toast: (message: string) => void, witnessed: boolean,
): void {
  if (state.status !== 'complete') return;
  if (!witnessed && !freshProcessingResult(state)) return;
  try {
    if (state.job_id && localStorage.getItem(ANNOUNCED_KEY) === state.job_id) return;
    if (state.job_id) localStorage.setItem(ANNOUNCED_KEY, state.job_id);
  } catch { /* 存储不可用时照常提示，最多重复一次 */ }
  if (state.requested_stage === 'covers') {
    toast(t('library-processing:coverOnlyToast', { count: state.covers || 0 }));
    return;
  }
  if (state.requested_stage === 'previews') {
    toast(`视频预览已生成：${state.previews || 0} 部`);
    return;
  }
  toast(`扫描与资料采集已完成：识别 ${state.identified || 0} 个番号，`
    + `取得 ${state.candidates || 0} 组作品资料，自动保存 ${state.auto_applied || 0} 条`
    + (state.previews ? `，生成 ${state.previews} 部视频预览` : ''));
}
