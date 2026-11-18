#!/usr/bin/env python3
"""按桥的锁构建独立 amane 运行时，并随附许可证与固定版本源码。"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import runpy
import shutil
import subprocess
import sys
import tomllib
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parents[1]
BRIDGE = ROOT / "tools/amane-bridge"
if str(ROOT / "src") not in sys.path:
    sys.path.insert(0, str(ROOT / "src"))
from peach.interface_text import dev as t  # noqa: E402


def locked_amane() -> dict:
    lock = tomllib.loads((BRIDGE / "uv.lock").read_text(encoding="utf-8"))
    package = next(item for item in lock["package"] if item["name"] == "amane")
    return {"revision": package["source"]["git"].rsplit("#", 1)[1], "version": package["version"]}


def build_requirements() -> list[str]:
    """PyInstaller 及构建依赖沿用主锁的精确版本。"""
    lock = tomllib.loads((ROOT / "uv.lock").read_text(encoding="utf-8"))
    packages = {item["name"]: item for item in lock["package"]}
    names = {"pyinstaller", "pyinstaller-hooks-contrib", "altgraph", "packaging", "setuptools"}
    names.update({"pefile", "pywin32-ctypes"} if sys.platform == "win32" else
                 {"macholib"} if sys.platform == "darwin" else set())
    runtime_lock = tomllib.loads((BRIDGE / "uv.lock").read_text(encoding="utf-8"))
    names -= {item["name"] for item in runtime_lock["package"]}
    return [f"{name}=={packages[name]['version']}" for name in sorted(names)]


def corresponding_source(destination: Path, work: Path, facts: dict) -> None:
    checkout = work / "source"
    if not (checkout / ".git").exists():
        subprocess.run(["git", "init", str(checkout)], check=True)
    subprocess.run(["git", "-C", str(checkout), "fetch", "--depth", "1",
                    "https://github.com/sqzw-x/amane.git", facts["revision"]], check=True)
    archive = destination / "amane-corresponding-source.zip"
    subprocess.run(["git", "-C", str(checkout), "archive", "--format=zip",
                    f"--output={archive}", "--prefix=amane/", facts["revision"]], check=True)
    license_text = subprocess.run(["git", "-C", str(checkout), "show",
                                  f"{facts['revision']}:LICENSE"], check=True,
                                 capture_output=True).stdout
    (destination / "LICENSE-amane.txt").write_bytes(license_text)
    with zipfile.ZipFile(archive, "a", compression=zipfile.ZIP_DEFLATED) as output:
        for path in (BRIDGE / "bridge.py", BRIDGE / "pyproject.toml", BRIDGE / "uv.lock",
                     ROOT / "scripts/build_amane_runtime.py", ROOT / "scripts/amane_bridge.spec",
                     ROOT / "pyproject.toml", ROOT / "uv.lock", ROOT / "LICENSE"):
            output.write(path, "peach/" + path.relative_to(ROOT).as_posix())
        lock = tomllib.loads((BRIDGE / "uv.lock").read_text(encoding="utf-8"))
        for package in lock["package"]:
            if package["name"] != "certifi":
                continue
            source = package["sdist"]
            with urllib.request.urlopen(source["url"], timeout=120) as response:
                content = response.read()
            if "sha256:" + hashlib.sha256(content).hexdigest() != source["hash"]:
                raise ValueError(t("build_amane_runtime.sourceMismatch", name=package['name']))
            output.writestr("dependencies/" + source["url"].rsplit("/", 1)[1], content)
    facts["source_sha256"] = hashlib.sha256(archive.read_bytes()).hexdigest()
    (destination / "NOTICE-amane.md").write_text(
        "# amane 独立运行时\n\n"
        f"来源：[amane](https://github.com/sqzw-x/amane)\n\n版本：{facts['version']}\n\n"
        f"revision：{facts['revision']}\n\n"
        "amane 按 GPL-3.0 分发，许可证见 LICENSE-amane.txt。完整对应源码位于 "
        "amane-corresponding-source.zip，包含原版 amane、Peach 桥、依赖锁与构建入口，"
        "以及 certifi（MPL-2.0）的固定源码。"
        "桥按 AGPL-3.0-or-later 分发，许可证位于源码归档 peach/LICENSE。"
        "依赖许可证保留于随包的 dist-info 目录；PyInstaller bootloader 适用其发行例外。\n",
        encoding="utf-8")


def verify(destination: Path, *, script: Path = BRIDGE / "bridge.py") -> dict:
    facts = json.loads((destination / "manifest.json").read_text(encoding="utf-8"))
    if any(facts.get(key) != value for key, value in locked_amane().items()):
        raise ValueError(t("build_amane_runtime.manifestMismatch"))
    if facts["kind"] not in {"python", "executable"}:
        raise ValueError(t("build_amane_runtime.invalidKind"))
    executable = destination / facts["executable"]
    boundary = executable.parent.resolve() if facts["kind"] == "python" else executable.resolve()
    if not boundary.is_relative_to(destination.resolve()):
        raise ValueError(t("build_amane_runtime.executableOutside"))
    command = [str(executable)]
    if facts["kind"] == "python":
        command += ["-X", "utf8", str(script)]
    env = {key: value for key, value in os.environ.items()
           if key not in {"PYTHONPATH", "PYTHONHOME", "VIRTUAL_ENV", "_PYI_APPLICATION_HOME_DIR",
                          "_PYI_ARCHIVE_FILE", "_PYI_PARENT_PROCESS_LEVEL"}}
    env.update(PATH="", PYTHONUTF8="1", PYTHONIOENCODING="utf-8", PYINSTALLER_RESET_ENVIRONMENT="1")
    result = subprocess.run([*command, "--self-check"], check=True, capture_output=True,
                            text=True, encoding="utf-8", cwd=destination, env=env, timeout=120)
    report = json.loads(result.stdout)
    expected_sites = list(runpy.run_path(str(script))["SITES"])
    if (not report.get("ok") or report.get("amane", {}).get("version") != facts["version"]
            or report.get("sites") != expected_sites):
        raise ValueError(t("build_amane_runtime.selfCheckMismatch", report=report))
    return report


def build(destination: Path, *, kind: str = "executable", work: Path | None = None) -> dict:
    destination = destination.resolve()
    work = (work or ROOT / "build/amane-runtime").resolve()
    if destination == work or work.is_relative_to(destination):
        raise ValueError(t("build_amane_runtime.workInsideDestination"))
    pending = destination / ".peach-amane-build.json"
    if destination.exists() and any(destination.iterdir()):
        marker = destination / "manifest.json"
        owned = (marker.is_file() and json.loads(marker.read_text(encoding="utf-8")).get("kind") == kind)
        owned = owned or (pending.is_file() and json.loads(pending.read_text(encoding="utf-8")) ==
                          {"builder": "peach-amane-runtime", "kind": kind})
        if not owned:
            raise ValueError(t("build_amane_runtime.destinationNotOwned"))
    destination.mkdir(parents=True, exist_ok=True)
    marker_content = json.dumps({"builder": "peach-amane-runtime", "kind": kind})
    pending.write_text(marker_content, encoding="utf-8")
    work.mkdir(parents=True, exist_ok=True)
    uv = shutil.which("uv")
    if not uv:
        raise FileNotFoundError(t("build_amane_runtime.uvRequired"))
    environment = destination / ".venv" if kind == "python" else work / ".venv"
    python = environment / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")
    env = {**os.environ, "UV_PROJECT_ENVIRONMENT": str(environment)}
    subprocess.run([uv, "sync", "--project", str(BRIDGE), "--locked", "--no-dev",
                    "--python", sys.executable], check=True, env=env)
    facts = {**locked_amane(), "kind": kind}
    if kind == "executable":
        subprocess.run([uv, "pip", "install", "--python", str(python), "--no-deps",
                        *build_requirements()], check=True)
        subprocess.run([str(python), "-X", "utf8", "-m", "PyInstaller", "--clean", "--noconfirm",
                        "--distpath", str(work / "dist"), "--workpath", str(work / "pyinstaller"),
                        str(ROOT / "scripts/amane_bridge.spec")], check=True, cwd=ROOT)
        shutil.rmtree(destination)
        shutil.copytree(work / "dist/amane-bridge", destination)
        pending.write_text(marker_content, encoding="utf-8")
        facts["executable"] = "amane-bridge.exe" if sys.platform == "win32" else "amane-bridge"
    else:
        facts["executable"] = python.relative_to(destination).as_posix()
    corresponding_source(destination, work, facts)
    (destination / "manifest.json").write_text(json.dumps(facts, ensure_ascii=False, indent=2) + "\n",
                                              encoding="utf-8")
    verify(destination)
    pending.unlink()
    return facts


def main() -> None:
    parser = argparse.ArgumentParser(description=t("build_amane_runtime.description"))
    parser.add_argument("--destination", type=Path, required=True)
    parser.add_argument("--work", type=Path)
    parser.add_argument("--kind", choices=("executable", "python"), default="executable")
    args = parser.parse_args()
    print(json.dumps(build(args.destination, kind=args.kind, work=args.work), ensure_ascii=False))


if __name__ == "__main__":
    main()
