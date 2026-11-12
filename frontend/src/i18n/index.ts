/* 界面文案的翻译入口（ADR-0156）。
 *
 * 源文是 `locales/zh-CN/<命名空间>.json`，英文在 `locales/en/`，两份由同一个 PR 维护；其他语言经 Weblate 回流。
 * 界面语言在模块求值时从本地偏好同步算出（默认「自动」：浏览器语言优先，其次系统语言），整页只有这一份实例：
 * 导航词表这类模块在顶层就取译文，换语言靠整页重载，不做运行中切换。缺译文的键回落到 zh-CN。 */
import i18next from 'i18next';

import { SETTINGS_KEY } from '../settings-key';
import enCleanup from '../locales/en/cleanup.json';
import enLibraryProcessing from '../locales/en/library-processing.json';
import enNavigation from '../locales/en/navigation.json';
import enSettings from '../locales/en/settings.json';
import zhCleanup from '../locales/zh-CN/cleanup.json';
import zhLibraryProcessing from '../locales/zh-CN/library-processing.json';
import zhNavigation from '../locales/zh-CN/navigation.json';
import zhSettings from '../locales/zh-CN/settings.json';

export const INTERFACE_LANGUAGES = ['zh-CN', 'en'] as const;
export type InterfaceLanguage = typeof INTERFACE_LANGUAGES[number];
export const SOURCE_LANGUAGE: InterfaceLanguage = 'zh-CN';

export const resources = {
  'zh-CN': { navigation: zhNavigation, settings: zhSettings, cleanup: zhCleanup,
             'library-processing': zhLibraryProcessing },
  en: { navigation: enNavigation, settings: enSettings, cleanup: enCleanup,
        'library-processing': enLibraryProcessing },
} as const;

/** 设置里能选的值：`auto` 按浏览器与系统语言自动选，其余是固定的界面语言。 */
export const INTERFACE_LANGUAGE_CHOICES = ['auto', ...INTERFACE_LANGUAGES] as const;
export type InterfaceLanguageChoice = typeof INTERFACE_LANGUAGE_CHOICES[number];
/** 都对不上时用英文：既读不懂中文、也没有自己语言译文的人，英文比中文更可能读得懂。 */
const UNMATCHED_LANGUAGE: InterfaceLanguage = 'en';

export const isInterfaceLanguage = (value: unknown): value is InterfaceLanguage =>
  INTERFACE_LANGUAGES.includes(value as InterfaceLanguage);
export const isInterfaceLanguageChoice = (value: unknown): value is InterfaceLanguageChoice =>
  INTERFACE_LANGUAGE_CHOICES.includes(value as InterfaceLanguageChoice);

/** 一个语言标签对应哪种界面语言：中文的各种写法（zh、zh-TW、zh-Hant…）都给简体中文。 */
export function matchInterfaceLanguage(tag: unknown): InterfaceLanguage | null {
  const primary = typeof tag === 'string' ? tag.trim().toLowerCase().split(/[-_]/)[0] : '';
  return primary === 'zh' ? 'zh-CN' : primary === 'en' ? 'en' : null;
}

/** 浏览器给出的语言，按用户的偏好顺序；最后是 Intl 的默认区域，它跟着浏览器界面或系统区域走。 */
export function browserLanguages(): string[] {
  const nav = globalThis.navigator;
  let intl = '';
  try { intl = Intl.DateTimeFormat().resolvedOptions().locale } catch { /* 没有 Intl 就不看它 */ }
  return [...(nav?.languages ?? []), nav?.language ?? '', intl].filter(Boolean);
}

/** 选「自动」时实际用哪种：先按浏览器语言的顺序找第一个有译文的，再看运行 Peach 的电脑的系统语言，都没有就用英文。 */
export function resolveInterfaceLanguage(choice: unknown, systemLanguage: unknown, browser: readonly string[] = browserLanguages()): InterfaceLanguage {
  if (isInterfaceLanguage(choice)) return choice;
  for (const tag of browser) {
    const match = matchInterfaceLanguage(tag);
    if (match) return match;
  }
  return matchInterfaceLanguage(systemLanguage) ?? UNMATCHED_LANGUAGE;
}

/** 本地偏好里存的选择与系统语言算出来的界面语言；没存或存坏时按「自动」算。 */
export function storedInterfaceLanguage(
  storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage, browser: readonly string[] = browserLanguages(),
): InterfaceLanguage {
  let saved: { interfaceLanguage?: unknown; systemLanguage?: unknown } = {};
  try { saved = JSON.parse(storage?.getItem(SETTINGS_KEY) || '{}') ?? {} } catch { /* 坏掉的存量按自动算 */ }
  return resolveInterfaceLanguage(saved.interfaceLanguage, saved.systemLanguage, browser);
}

/** 按给定语言建一份同步就绪的实例；页面用模块级那一份，测试用它比对各语言。 */
export function createTranslator(language: InterfaceLanguage) {
  const instance = i18next.createInstance();
  void instance.init({
    lng: language, fallbackLng: SOURCE_LANGUAGE, supportedLngs: [...INTERFACE_LANGUAGES],
    resources, ns: Object.keys(resources[SOURCE_LANGUAGE]), defaultNS: 'navigation',
    // 中文的句间分隔是空串（英文是空格），空串要原样返回，不能当成缺键。
    initAsync: false, returnNull: false, returnEmptyString: true, interpolation: { escapeValue: false },
  });
  return instance;
}

export const interfaceLanguage = storedInterfaceLanguage();
const translator = createTranslator(interfaceLanguage);
if (typeof document !== 'undefined') document.documentElement.lang = interfaceLanguage;

/** 取当前界面语言的译文，键写成 `命名空间:路径`。 */
export const t = translator.t.bind(translator);
