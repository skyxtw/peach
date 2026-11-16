"""入口页共用件：首启、登录与错误三页的薄壳，首启与配置页共用的运行信息与字段错误。

三页都由独立页面包 `/dist/peach-pages.js` 画（ADR-0094），服务端只吐同一张薄壳，要画的变量写在
挂载点的 `data-*` 上。运行信息则被 `/api/setup` 和 `/api/configuration` 共用。三个路由模块都要，
就不能住在其中任何一个里：那会让路由层互相导入成环。放在 web 层，路由模块单向依赖它，
`tests/test_module_layering.py` 守着这个方向。
"""
from __future__ import annotations

import re
from collections.abc import Mapping
from html import escape

from . import interface_text
from .user_messages import UserFacingError, UserValueError

#: 三页共用的文档头（`<html lang>` 之后的部分）。`robots` 那一行管只读 HTML 的爬虫，响应头 `X-Robots-Tag`
#: 管所有响应：公网入口在跑的时候登录页就在互联网上，不希望它进任何搜索结果。图标声明和主站同一份，
#: 没有会话时登录页就是书签实际停在的地方。
_PAGE_HEAD = ('<head><meta charset="utf-8">'
              '<meta name="viewport" content="width=device-width,initial-scale=1">'
              '<meta name="color-scheme" content="light dark">'
              '<meta name="robots" content="noindex, nofollow">'
              '<link rel="icon" href="/favicon.ico" type="image/x-icon">'
              '<link rel="manifest" href="/manifest.webmanifest">'
              '<meta name="mobile-web-app-capable" content="yes">'
              '<meta name="apple-mobile-web-app-capable" content="yes">'
              '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
              '<link rel="apple-touch-icon" href="/apple-touch-icon.png">')

#: 手动选的深浅压过系统偏好，必须在第一次绘制前定下来，所以排在任何样式之前：`dark` 类给
#: BoardUI 的色板，`data-theme` 记手动那一档，判据同 `web/index.html` 的预读脚本。
_THEME_SCRIPT = ('<script>(()=>{try{'
                 'const c=JSON.parse(localStorage.getItem("peach.settings.v1")||"{}").theme;'
                 'document.documentElement.classList.toggle("dark",c==="dark"||(c!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches));'
                 'if(c==="light"||c==="dark")document.documentElement.dataset.theme=c;'
                 '}catch(e){}})();</script>')

_DATA_KEY = re.compile(r"[a-z][a-z0-9-]*")


def page_shell(title: str, page: str, data: Mapping[str, str] | None = None, *, symbols: str = "",
               language: str = interface_text.SOURCE_LANGUAGE) -> str:
    """入口页的薄壳：主题预读、Inter、页面包的样式与脚本，以及挂载点 `#peach-page`。

    `page` 写进 `data-page`，页面包按它挑哪一页；`data` 的每一项写成挂载点上的 `data-<键>`，
    值一律经 HTML 转义。骨架文案归页面包，这里只放服务端才知道的变量。`symbols` 是页面要借的
    雪碧图字形，原样放进一张不占位的 `<svg>`。`language` 是这一页的语言（`interface_text.request_language`），
    写进 `<html lang>`；`title` 由调用方按同一种语言渲染好。
    """
    attributes = ""
    for key, value in (data or {}).items():
        if not _DATA_KEY.fullmatch(key):
            raise UserValueError("api.entry.invalidDataKey", {"key": repr(key)})
        attributes += f' data-{key}="{escape(value, quote=True)}"'
    sprite = f'<svg width="0" height="0" aria-hidden="true" style="position:absolute">{symbols}</svg>' if symbols else ""
    return (f'<!doctype html>\n<html lang="{escape(language, quote=True)}">{_PAGE_HEAD}'
            f'<title>{escape(title)}</title>{_THEME_SCRIPT}'
            '<link rel="stylesheet" href="/vendor/inter/5.3.0/index.css">'
            '<link rel="stylesheet" href="/dist/peach-pages.css">'
            '<script type="module" src="/dist/peach-pages.js"></script></head>'
            f'<body class="peach-react">{sprite}'
            f'<div id="peach-page" data-page="{escape(page, quote=True)}"{attributes}></div></body></html>\n')


def field_errors(errors: Mapping[str, object]) -> dict[str, dict]:
    """逐字段的错误写成响应里的两份：`errors` 是按 zh-CN 渲染的原句（老页面照旧读它），`error_codes` 同形，
    每项是 `{code, params}`，页面按当前界面语言取译文。值可以是异常、已是文字的原因或空串；列表字段（媒体目录）
    逐行同形，没带 code 的那一项在 `error_codes` 里是 `None`。"""
    def text(value: object) -> str:
        return value.message if isinstance(value, UserFacingError) else str(value or "")

    def code(value: object) -> dict | None:
        return {"code": value.code, "params": dict(value.params)} if isinstance(value, UserFacingError) else None

    shown: dict[str, object] = {}
    codes: dict[str, object] = {}
    for key, value in errors.items():
        if isinstance(value, (list, tuple)):
            shown[key], codes[key] = [text(item) for item in value], [code(item) for item in value]
        else:
            shown[key], codes[key] = text(value), code(value)
    return {"errors": shown, "error_codes": codes}


#: 运行信息里有项名的几行，项名是 `labels.runtimeFacts.<键>`；FFmpeg 与 untrunc 两行的项名是软件名，不翻译。
_FACT_TERMS = ("version", "os", "dataRoot", "settingsFile", "logs")
_AVAILABLE = "labels.runtimeFacts.available"


def _coded(row: dict, key: str, code: str, params: Mapping[str, object] | None = None) -> None:
    """运行信息一行里的一项文字：`<键>` 是按 zh-CN 渲染的原句，`<键>_code` 与 `<键>_params` 给页面按当前语言渲染。"""
    values = dict(params or {})
    row.update({key: interface_text.text(f"server:{code}", values), f"{key}_code": code, f"{key}_params": values})


def _fact_rows(config) -> list[dict]:
    from . import __version__
    import platform as system_platform
    from .ffmpeg import FFmpegResolver
    from .mp4recover import untrunc_path

    values = (__version__, system_platform.system(), str(config.data_root), str(config.path),
              str(config.directory("logs")))
    rows: list[dict] = []
    for term, value in zip(_FACT_TERMS, values):
        row: dict = {"value": value}
        _coded(row, "term", f"labels.runtimeFacts.{term}")
        rows.append(row)
    ffmpeg: dict = {"term": "FFmpeg"}
    available = FFmpegResolver(config.directory("tools") / "ffmpeg").ffmpeg() is not None
    _coded(ffmpeg, "value", _AVAILABLE if available else "labels.runtimeFacts.ffmpegNotInstalled")
    untrunc: dict = {"term": "untrunc"}
    _coded(untrunc, "value", _AVAILABLE if untrunc_path(config.directory("tools"))
           else "labels.runtimeFacts.untruncNotInstalled")
    return [*rows, ffmpeg, untrunc]


def runtime_facts(config) -> tuple[tuple[str, str], ...]:
    """这台机器上 Peach 的位置与版本，`(项名, 值)` 按 zh-CN 渲染：设置完成页和 `/api/configuration` 共用同一份。"""
    return tuple((row["term"], row["value"]) for row in _fact_rows(config))


def runtime_fact_entries(config) -> list[dict[str, object]]:
    """运行信息中的缺失依赖附带入口：Windows x64 由 Peach 装进数据目录（`install_tool`），
    其余平台没有发布的工具包，给官方下载外链。

    依赖可用时，只有数据目录里那份占一行并写明版本，让刚装完的人看到结果；随包或 PATH 上的不占行。
    项名、取值与下载链接文字配 `term_code`、`value_code`、`download_label_code` 与各自的 `_params`。
    """
    from . import media_tools
    from .ffmpeg import FFmpegResolver
    from .mp4recover import untrunc_path
    tools = config.directory("tools")
    installable = media_tools.supported()
    entries = _fact_rows(config)

    def installed(row: dict, tool: str) -> None:
        version = media_tools.installed_version(tools, tool)
        if version:
            _coded(row, "value", "labels.runtimeFacts.installedVersion", {"version": version})
        else:
            _coded(row, "value", "labels.runtimeFacts.installedInDataRoot")

    resolver = FFmpegResolver(tools / "ffmpeg")
    choices = {"FFmpeg": resolver.ffmpeg(), "ffprobe": resolver.ffprobe()}
    entry = next(row for row in entries if row["term"] == "FFmpeg")
    missing = [name for name, choice in choices.items() if choice is None]
    if missing:
        if len(missing) == 1:
            _coded(entry, "value", "labels.runtimeFacts.ffmpegToolMissing", {"tool": missing[0]})
        else:
            _coded(entry, "value", "labels.runtimeFacts.ffmpegToolsMissing",
                   {"first": missing[0], "second": missing[1]})
        if installable:
            entry["install_tool"] = "ffmpeg"
        else:
            entry["download_url"] = "https://ffmpeg.org/download.html"
            _coded(entry, "download_label", "labels.downloadNamed", {"name": "FFmpeg"})
    elif all(choice.source == "peach-managed" for choice in choices.values()):
        installed(entry, "ffmpeg")
    untrunc = next(row for row in entries if row["term"] == "untrunc")
    path = untrunc_path(tools)
    if path is None and installable:
        untrunc["install_tool"] = "untrunc"
    elif path is None:
        _coded(untrunc, "value", "labels.runtimeFacts.untruncExtractTo", {"path": str(tools / "untrunc")})
        untrunc["download_url"] = "https://github.com/anthwlock/untrunc/releases"
        _coded(untrunc, "download_label", "labels.downloadNamed", {"name": "untrunc"})
    elif path.parent == (tools / "untrunc").resolve():
        installed(untrunc, "untrunc")
    return [row for row in entries
            if not (row["term"] in ("FFmpeg", "untrunc") and row.get("value_code") == _AVAILABLE)]
