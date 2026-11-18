"""GitHub CI 通过官方 REST 接口晋级同一提交的已验收产物，不调用 CLI。"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys
import tempfile
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
import zipfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from peach.interface_text import dev as t
from peach.user_agent import USER_AGENT

#: Docker 镜像按架构各在原生 runner 上构建验收，发布时合成同一个多架构 index（ADR-0121）。
DOCKER_ARCHITECTURES = ("amd64", "arm64")
REQUIRED_ARTIFACTS = {"desktop-candidate", "macos-candidate-arm64", "macos-candidate-x86_64",
    *(f"docker-candidate-{arch}" for arch in DOCKER_ARCHITECTURES)}
REQUIRED_JOBS = {"Windows x64 独立测试包", "仅下载制品验收",
    *(f"Linux {arch} 镜像构建与验收" for arch in DOCKER_ARCHITECTURES),
    "macOS arm64 独立测试包", "macOS x86_64 独立测试包",
    "macOS arm64 仅下载制品验收", "macOS x86_64 仅下载制品验收"}


class ArtifactRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, file, code, message, headers, url):
        if urlsplit(url).scheme != "https":
            raise ValueError(t("github_release_candidate.redirectHttps"))
        redirected = super().redirect_request(request, file, code, message, headers, url)
        if redirected is not None and urlsplit(url).hostname != "api.github.com":
            redirected.remove_header("Authorization")
        return redirected


def request(repo: str, endpoint: str):
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": USER_AGENT}
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if os.environ.get("GITHUB_ACTIONS") == "true" and token:
        headers["Authorization"] = "Bearer " + token
    return build_opener(ArtifactRedirect()).open(Request(f"https://api.github.com/repos/{repo}/{endpoint}", headers=headers), timeout=60)


def api(repo: str, endpoint: str):
    with request(repo, endpoint) as response:
        return json.load(response)


def select(repo: str, sha: str) -> dict:
    if not re.fullmatch(r"[0-9a-f]{40}", sha) or not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repo):
        raise ValueError(t("github_release_candidate.repoAndCommitRequired"))
    # 版本提交推送时自动演练；其他主线提交的推送演练被跳过，只能手动触发。
    runs = api(repo, f"actions/workflows/release.yml/runs?head_sha={sha}&per_page=100")["workflow_runs"]
    matching = [row for row in runs if row["head_sha"] == sha and row["head_branch"] == "master"
                and row["event"] in {"push", "workflow_dispatch"}]
    if not matching:
        raise ValueError(t("github_release_candidate.noRehearsal"))
    succeeded = [row for row in matching if row["status"] == "completed" and row["conclusion"] == "success"]
    if not succeeded:
        raise ValueError(t("github_release_candidate.rehearsalNotSuccessful"))
    run = max(succeeded, key=lambda row: (row["id"], row.get("run_attempt", 1)))
    jobs = api(repo, f"actions/runs/{run['id']}/jobs?per_page=100")["jobs"]
    passed = {row["name"] for row in jobs if row["conclusion"] == "success"}
    if not REQUIRED_JOBS <= passed:
        raise ValueError(t("github_release_candidate.rehearsalMissingJobs"))
    artifacts = api(repo, f"actions/runs/{run['id']}/artifacts?per_page=100")["artifacts"]
    selected = {row["name"]: row for row in artifacts if row["name"] in REQUIRED_ARTIFACTS and not row["expired"]}
    if set(selected) != REQUIRED_ARTIFACTS or any(not re.fullmatch(r"sha256:[0-9a-f]{64}", str(row.get("digest", ""))) for row in selected.values()):
        raise ValueError(t("github_release_candidate.candidateUnusable"))
    return {"run_id": run["id"], "commit": sha, "artifacts": selected}


def extract(package: Path, destination: Path) -> None:
    with zipfile.ZipFile(package) as archive:
        for info in archive.infolist():
            parts = PurePosixPath(info.filename).parts
            if (not parts or ".." in parts or "\\" in info.filename or ":" in info.filename
                    or PurePosixPath(info.filename).is_absolute() or (info.external_attr >> 16) & 0o170000 == 0o120000):
                raise ValueError(t("github_release_candidate.zipInvalidPath"))
            target = destination.joinpath(*parts)
            if not target.resolve().is_relative_to(destination.resolve()):
                raise ValueError(t("github_release_candidate.zipEscapes"))
            if info.is_dir():
                target.mkdir(parents=True, exist_ok=True)
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            if target.exists():
                with archive.open(info) as source, target.open("rb") as current:
                    if hashlib.file_digest(source, "sha256").digest() != hashlib.file_digest(current, "sha256").digest():
                        raise ValueError(t("github_release_candidate.sameNameDiffers"))
                continue
            with archive.open(info) as source, target.open("xb") as stream:
                shutil.copyfileobj(source, stream)


def download(repo: str, sha: str, group: str, destination: Path) -> dict:
    receipt = select(repo, sha)
    names = {"desktop": {"desktop-candidate"}, "macos": {"macos-candidate-arm64", "macos-candidate-x86_64"},
             "docker": {f"docker-candidate-{arch}" for arch in DOCKER_ARCHITECTURES}}[group]
    destination.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="peach-candidate-") as directory:
        for name in sorted(names):
            row = receipt["artifacts"][name]
            package = Path(directory) / (name + ".zip")
            with request(repo, f"actions/artifacts/{row['id']}/zip") as response, package.open("wb") as stream:
                shutil.copyfileobj(response, stream)
            with package.open("rb") as stream:
                actual = "sha256:" + hashlib.file_digest(stream, "sha256").hexdigest()
            if actual != row["digest"]:
                raise ValueError(t("github_release_candidate.sha256Mismatch"))
            extract(package, destination)
    return {"promoted": True, "run_id": receipt["run_id"], "commit": sha, "group": group}


#: 构成镜像内容身份的启动配置字段；其余字段（主机名、空端口表等）随 Docker 版本与存储方式变化。
IMAGE_CONFIG_FIELDS = ("Entrypoint", "Cmd", "Env", "User", "WorkingDir", "Labels")


def image_identity(inspected: dict) -> str:
    """跨 Docker 镜像存储一致的内容身份：架构、各层内容摘要与启动配置。

    `docker image inspect` 的 `Id` 在 containerd 存储里是 manifest 摘要，在 overlay2 存储里是 config 摘要；
    arm64 runner 与发布用的 amd64 runner 存储不同，同一镜像 `docker load` 后 `Id` 对不上。层摘要按未压缩
    内容计算，两种存储一致。"""
    config = inspected.get("Config") or {}
    content = {"architecture": inspected.get("Architecture"), "os": inspected.get("Os"),
               "layers": (inspected.get("RootFS") or {}).get("Layers") or [],
               "config": {field: config.get(field) for field in IMAGE_CONFIG_FIELDS}}
    encoded = json.dumps(content, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return "sha256:" + hashlib.sha256(encoded).hexdigest()


def image_receipt(destination: Path, version: str, architecture: str, *, verify: bool) -> dict:
    actual = json.loads(subprocess.check_output(["docker", "image", "inspect", "--format", "{{json .}}",
                                                f"longmeidao/peach:candidate-{architecture}"], text=True, encoding="utf-8"))
    labels = actual.get("Config", {}).get("Labels", {})
    sha = os.environ["GITHUB_SHA"]
    if labels.get("org.opencontainers.image.revision") != sha or labels.get("org.opencontainers.image.version") != version:
        raise ValueError(t("github_release_candidate.imageTagMismatch"))
    if actual.get("Architecture") != architecture:
        raise ValueError(t("github_release_candidate.imageArchitectureMismatch"))
    if not (actual.get("RootFS") or {}).get("Layers"):
        raise ValueError(t("github_release_candidate.imageDigestMismatch"))
    expected = {"image_identity": image_identity(actual), "commit": sha, "version": version,
                "architecture": architecture}
    if verify:
        if json.loads(destination.read_text(encoding="utf-8")) != expected:
            raise ValueError(t("github_release_candidate.imageDigestMismatch"))
    else:
        destination.write_text(json.dumps(expected, indent=2) + "\n", encoding="utf-8")
    return expected


def main() -> None:
    parser = argparse.ArgumentParser(description=t("github_release_candidate.description"))
    parser.add_argument("group", choices=("desktop", "macos", "docker", "image-record", "image-verify"))
    parser.add_argument("--destination", required=True, type=Path)
    parser.add_argument("--version")
    parser.add_argument("--arch", choices=DOCKER_ARCHITECTURES)
    args = parser.parse_args()
    if args.group.startswith("image-"):
        if not args.version or not args.arch:
            parser.error(t("github_release_candidate.imageVersionRequired"))
        result = image_receipt(args.destination, args.version, args.arch, verify=args.group == "image-verify")
    else:
        result = download(os.environ["GITHUB_REPOSITORY"], os.environ["GITHUB_SHA"], args.group, args.destination)
    print(json.dumps(result))


if __name__ == "__main__":
    main()
