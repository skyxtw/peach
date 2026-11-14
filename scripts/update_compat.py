"""发布前核对：仍在支持范围内的旧版独立包，用它们自己的更新代码能不能装上这一版。

旧客户端的更新代码装在用户机器上，改不了；能改的只有这一版发出去的发布条目与更新包。
所以拿每个旧版本标签里的 `release_updates` 与 `update_packages` 原样去读这一版：选得中新版本，
选中应用更新包时读得了它的工具清单，清单里旧版不认得的工具都是运行时自己能补齐的
（`update_packages.SELF_PROVISIONED`）。有一个旧版本过不了就拒绝发布（ADR-0120）。

本机测试用打包代码合成的制品跑这道核对，构建作业用真实制品再跑一遍。
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import sys
import tarfile
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
from peach.interface_text import dev as t  # noqa: E402
from peach.update_packages import MANIFEST, SELF_PROVISIONED  # noqa: E402

#: 支持自动更新到新版的最旧客户端。更早的版本要求工具集合与它认得的完全相等，0.48.0 加入人脸
#: 模型后它们只能手动装一次完整包。放弃一批旧客户端要改这里，并在变更日志里写明怎么手动升级。
OLDEST_CLIENT = "0.48.0"

#: 在旧版本的源码树里执行：只走它自己的检查与清单读取，网络换成本次的发布条目。
PROBE = r"""
import inspect, json, sys, tempfile
from pathlib import Path
from types import SimpleNamespace
sys.path[:0] = [sys.argv[1]]
import peach
if not Path(peach.__file__).resolve().is_relative_to(Path(sys.argv[1]).resolve()):
    raise SystemExit(f"导入的不是旧版本源码：{peach.__file__}")
from peach import release_updates, update_packages
payload = json.load(sys.stdin)
def transport(request, *_):
    if request.url == release_updates.DOWNLOADS_API:
        return SimpleNamespace(status=200, headers={}, body=json.dumps(payload["rows"]).encode(), url=request.url)
    return SimpleNamespace(status=404, headers={}, body=b"", url=request.url)
# 这道核对针对 Windows 更新包。0.53.0 起检查按本机平台选包，在 macOS 上只认 DMG，所以明确按
# Windows x64 客户端核对；更早的版本不分平台、只认 Windows 包，照原样调用。
windows = ({"system": "win32", "machine": "AMD64"}
           if "system" in inspect.signature(release_updates.check).parameters else {})
release = release_updates.check(transport=transport, **windows)
result = {"state": release.get("state"), "latest": release.get("latest_version"),
          "kind": release.get("package_kind"), "tools": sorted(update_packages.TOOL_PATHS)}
if release.get("package_kind") != "full":
    with tempfile.TemporaryDirectory() as folder:
        # 旧版逐级检查暂存目录的父路径不是链接；macOS 的临时目录在 /var 这个链接下面，先解析成真实路径，
        # 和客户端在安装目录旁建的暂存目录一样。
        stage = Path(folder).resolve()
        (stage / update_packages.MANIFEST).write_text(json.dumps(payload["manifest"]), encoding="utf-8")
        try:
            update_packages.read_manifest(stage, payload["version"])
        except Exception as exc:
            result["error"] = f"{type(exc).__name__}: {exc}"
print(json.dumps(result, ensure_ascii=False))
"""


def _version(value: str) -> tuple[int, ...]:
    return tuple(map(int, value.removeprefix("v").split(".")))


def client_tags(root: Path, version: str, oldest: str = OLDEST_CLIENT) -> list[str]:
    """已发布、不早于 `oldest`、早于本版的版本标签。"""
    listed = subprocess.run(["git", "-C", str(root), "tag", "--list", "v*"], capture_output=True, text=True,
                            encoding="utf-8", check=True)
    tags = [tag for tag in listed.stdout.split() if re.fullmatch(r"v\d+\.\d+\.\d+", tag)
            and _version(oldest) <= _version(tag) < _version(version)]
    if not tags:
        raise ValueError(t("update_compat.noClientTags", oldest=oldest))
    return sorted(tags, key=_version)


def release_row(packages: Path, version: str) -> dict:
    """这一版在 `releases.json` 里的那一条，字段同 `release_r2.publish` 写出的。"""
    assets = []
    for path in sorted(packages.glob(f"Peach-{version}-windows-x64*")):
        if path.is_file() and path.suffix in {".zip", ".exe"}:
            with path.open("rb") as source:
                checksum = hashlib.file_digest(source, "sha256").hexdigest()
            assets.append({"name": path.name, "size": path.stat().st_size, "sha256": checksum,
                           "digest": "sha256:" + checksum, "state": "uploaded"})
    return {"tag_name": "v" + version, "draft": False, "prerelease": True, "assets": assets}


def package_manifest(packages: Path, version: str) -> dict:
    with zipfile.ZipFile(packages / f"Peach-{version}-windows-x64-update.zip") as package:
        return json.loads(package.read("Peach/" + MANIFEST))


def probe(root: Path, tag: str, payload: dict) -> dict:
    with tempfile.TemporaryDirectory(prefix="peach-update-compat-") as folder:
        exported = subprocess.run(["git", "-C", str(root), "archive", "--format=tar", tag, "src/peach"],
                                  capture_output=True, check=True).stdout
        with tarfile.open(fileobj=io.BytesIO(exported)) as archive:
            archive.extractall(folder, filter="data")
        # 0.58 起界面文字改从 resources/locales 读；只导出 src 的话旧客户端导入就会缺文案。
        locales = subprocess.run(["git", "-C", str(root), "archive", "--format=tar", tag, "resources/locales"],
                                 capture_output=True, check=False).stdout
        if locales:
            with tarfile.open(fileobj=io.BytesIO(locales)) as archive:
                archive.extractall(folder, filter="data")
        completed = subprocess.run([sys.executable, "-I", "-X", "utf8", "-c", PROBE, str(Path(folder) / "src")],
                                   input=json.dumps(payload), capture_output=True, text=True, encoding="utf-8")
    if completed.returncode != 0:
        return {"error": (completed.stderr or completed.stdout).strip().splitlines()[-1:] or [t("update_compat.noOutput")]}
    return json.loads(completed.stdout.strip().splitlines()[-1])


def check_clients(root: Path, rows: list[dict], manifest: dict, version: str,
                  oldest: str = OLDEST_CLIENT) -> dict[str, list[str]]:
    """逐个旧版本核对；返回每个过不了的版本与原因，全部通过时为空。"""
    payload = {"rows": rows, "manifest": manifest, "version": version}
    problems: dict[str, list[str]] = {}
    for tag in client_tags(root, version, oldest):
        result, reasons = probe(root, tag, payload), []
        if result.get("state") != "available" or result.get("latest") != version:
            reasons.append(t("update_compat.notSelected", state=str(result.get("state")),
                                 latest=str(result.get("latest")), version=version))
        if result.get("error"):
            reasons.append(t("update_compat.unreadable", error=str(result["error"])))
        if result.get("kind") == "update":
            orphaned = set(manifest.get("tools", {})) - set(result.get("tools", [])) - SELF_PROVISIONED
            if orphaned:
                reasons.append(t("update_compat.orphanedTools",
                                     tools=sorted(orphaned)))
        if reasons:
            problems[tag] = reasons
    return problems


def verify(packages: Path, version: str, root: Path = ROOT) -> dict[str, list[str]]:
    return check_clients(root, [release_row(packages, version)], package_manifest(packages, version), version)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=t("update_compat.description"))
    parser.add_argument("--packages", type=Path, required=True, help=t("update_compat.packagesHelp"))
    parser.add_argument("--version", required=True)
    args = parser.parse_args(argv)
    problems = verify(args.packages, args.version)
    print(json.dumps({"version": args.version, "oldest_client": OLDEST_CLIENT, "problems": problems},
                     ensure_ascii=False, indent=2))
    return 1 if problems else 0


if __name__ == "__main__":
    raise SystemExit(main())
