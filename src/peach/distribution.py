"""分发形态（独立测试包、Docker 镜像）的判定与用户数据目录。"""
from __future__ import annotations

import os
import sys
from pathlib import Path


def standalone() -> bool:
    return bool(getattr(sys, "frozen", False) and
                (Path(getattr(sys, "_MEIPASS", "")) / "standalone.txt").is_file())


def docker() -> bool:
    """官方镜像在 Dockerfile 里设了 `PEACH_DISTRIBUTION=docker`。"""
    return os.environ.get("PEACH_DISTRIBUTION") == "docker"


def in_app_update() -> bool:
    """应用内下载并替换安装只有 Windows 独立包有；macOS 独立包下载 DMG 手动替换。"""
    return sys.platform == "win32" and standalone()


def plain_http() -> bool:
    """服务在设置文件指定的主机与端口直接提供明文 HTTP（不接管 80/443、不用本机 CA）。

    独立包一直如此；源码部署里 macOS 仍由托盘维护 HTTPS 固定入口，其余平台与独立包
    同一条路。
    """
    return standalone() or (sys.platform != "darwin" and not docker())


def user_data_root(environ: dict[str, str]) -> Path:
    if sys.platform == "win32":
        base = Path(environ.get("LOCALAPPDATA") or Path.home() / "AppData" / "Local")
    else:
        base = Path.home() / "Library" / "Application Support"
    return base / "Peach" / "peach-data"
