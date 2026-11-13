"""核对交付提交的署名：哪个工具、哪个模型写的这一段代码。"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

from .check_readme_impact import git, trailers, unpublished

#: 已登记的工具与它厂商的 noreply 地址。换用别的智能体就在这里加一行，别散着写。
VENDORS = {
    "Claude Code": "noreply@anthropic.com",
    "Codex": "noreply@openai.com",
    "DeepSeek Harness": "noreply@deepseek.com",
    "opencode": "noreply@opencode.ai",
}

#: 署名形态：`工具 (模型 版本) <厂商 noreply>`。括号里那一段是重点——同一个工具换代
#: 模型，写出来的代码差别比换工具本身还大，事后翻这一行是要知道哪个模型写的。
FORM = re.compile(r"(?P<tool>[^()<>]+) \((?P<model>[^()]+)\) <(?P<mail>[^<>\s]+)>")
HUMAN_FORM = re.compile(r"(?P<name>[^()<>\r\n]+) <(?P<mail>[^<>\s@]+@[^<>\s@]+)>")

EXAMPLE = "Co-Authored-By: Claude Code (Opus 5) <noreply@anthropic.com>"


def values(repo: Path, head: str = "HEAD") -> list[str]:
    """交付提交末尾那一块里的 Co-Authored-By，原样取值。"""
    message = git(repo, "show", "-s", "--format=%B", head)
    return trailers(repo, message).get("co-authored-by", [])


def commits(repo: Path, base: str, head: str = "HEAD") -> list[tuple[str, str, str]]:
    """分支自己的提交：(取值用的 hash, 给人看的 `短 hash 主题`, 作者邮箱)，不含合进来的 merge 与已发布到远端的。"""
    output = git(repo, "log", "--no-merges", "--format=%H%x00%h %s%x00%ae", f"{base}..{head}", *unpublished(repo))
    return [tuple(line.split("\0", 2)) for line in output.splitlines() if line.strip()]


def committer_mail(repo: Path) -> str:
    """本机提交者的邮箱；没配置时返回空串，按本机提交处理。"""
    try:
        return git(repo, "config", "--get", "user.email").strip()
    except subprocess.CalledProcessError:
        return ""


def is_own(author_mail: str, local_mail: str) -> bool:
    """作者就是本机提交者，才算本机智能体路径的产出；取不到本机邮箱时从严处理。"""
    return not local_mail or author_mail.strip().casefold() == local_mail.strip().casefold()


def problems(label: str, found: list[str], *, own: bool = True) -> list[str]:
    """本机提交须有登记过的智能体署名；采纳的他人提交不要求，自带的署名只核形态。

    外部贡献者是否用了 AI 由本人在 PR 里说明，门槛不替作者补签，也不卡他用的工具名单。
    """
    if not found:
        return [f"提交「{label}」须有 Co-Authored-By 写明工具与模型，如 {EXAMPLE}"] if own else []
    problems = []
    has_agent = False
    for value in found:
        parsed = FORM.fullmatch(value)
        human = HUMAN_FORM.fullmatch(value)
        if (parsed is None and human is not None and human["name"].strip()
                and human["name"].strip().casefold() not in {tool.casefold() for tool in VENDORS}
                and human["mail"].casefold() not in VENDORS.values()):
            continue
        if parsed is None:
            problems.append(f"提交「{label}」的署名「{value}」形态不对，须为 工具 (模型 版本) "
                            f"<厂商 noreply>，如 {EXAMPLE}")
        elif parsed["tool"] not in VENDORS:
            if own:
                problems.append(f"提交「{label}」的署名里，工具「{parsed['tool']}」未登记，"
                                "已登记：" + "、".join(VENDORS))
        elif parsed["mail"] != VENDORS[parsed["tool"]]:
            problems.append(f"提交「{label}」里 {parsed['tool']} 的署名地址须是 "
                            f"{VENDORS[parsed['tool']]}，不是 {parsed['mail']}")
        else:
            has_agent = True
    if own and not problems and not has_agent:
        problems.append(f"提交「{label}」须有 Co-Authored-By 写明工具与模型，如 {EXAMPLE}")
    return problems


def check(repo: Path, base: str, head: str = "HEAD") -> list[str]:
    """分支上每个非 merge 提交的署名都要合规；本机提交还要有登记过的智能体署名。

    署名是事后追责的入手处：出问题的那一行是哪个工具的哪个模型写的，只能从这里看。
    作者是本机提交者的提交，是本机智能体路径的产出，须有合规的智能体署名；人类共同
    作者使用「姓名 <邮箱>」，可以与智能体并列。作者是别人的提交（采纳的社区补丁）
    不要求智能体署名，自带的署名只核形态与已登记工具的厂商地址。

    判据落在每个提交上，不是落在分支尖端：一次交付常常是好几个提交，只看最后一个
    等于只要收尾那次签对了，前面写代码的几次签成谁都放行——而要追的恰恰是写出那
    一行的提交。合进来的 merge 不算分支自己的产出，跳过。
    """
    local_mail = committer_mail(repo)
    found_problems = []
    for commit, label, author_mail in commits(repo, base, head):
        found_problems += problems(label, values(repo, commit), own=is_own(author_mail, local_mail))
    return found_problems
