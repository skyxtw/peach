import subprocess
import tempfile
import unittest
from pathlib import Path

from scripts import version_bump
from scripts.version_bump import (
    VersionError, bump_part_for, bump_version, plan_bump, read_version, runtime_inputs_changed,
    write_version,
)

#: 版本号的唯一来源，`src/peach/__init__.py` 在测试仓库里的最小复刻。
VERSION_SEED = '"""Peach application package."""\n\n__version__ = "0.7.14"\n'


class BumpPartTests(unittest.TestCase):
    def test_the_bump_part_follows_commit_types_and_new_migrations(self):
        """feat 与破坏性标记推 minor，新迁移文件推 minor，其余都是 patch；major 不自动判。"""
        self.assertEqual(bump_part_for(["fix: 抽屉重画只写滚动层"], []), "patch")
        self.assertEqual(bump_part_for(["docs: 记录运行状态", "chore(release): 版本 0.7.27"], []),
                         "patch")
        self.assertEqual(bump_part_for(["refactor(follow): 来源登记表变成唯一真相"], []), "patch")
        self.assertEqual(bump_part_for(["feat: 配置页并入主站管理菜单"], []), "minor")
        self.assertEqual(bump_part_for(["feat(web): 滚动条改成自绘覆盖式"], []), "minor")
        self.assertEqual(bump_part_for(["fix!: 数据库路径改成 location 键"], []), "minor")
        self.assertEqual(bump_part_for(["refactor(config)!: 删掉盘符键"], []), "minor")
        self.assertEqual(bump_part_for(["fix: 补迁移"], ["migrations/0027_thing.sql"]), "minor")
        self.assertEqual(bump_part_for(["fix: 补迁移"], [r"migrations\0027_thing.sql"]), "minor")
        self.assertEqual(bump_part_for(["fix: 改了迁移的注释"], ["src/peach/tray.py"]), "patch")
        self.assertEqual(
            bump_part_for(["Merge branch 'master' into agent/claude/x", "feature: 新东西"], []),
            "minor")
        self.assertEqual(bump_part_for([], []), "patch")

    def test_runtime_inputs_are_told_apart_from_development_only_paths(self):
        self.assertTrue(runtime_inputs_changed(["src/peach/tray.py"]))
        self.assertTrue(runtime_inputs_changed(["web/app.js"]))
        self.assertTrue(runtime_inputs_changed(["frontend/src/main.ts"]))
        self.assertTrue(runtime_inputs_changed(["migrations/0042_thing.sql"]))
        self.assertTrue(runtime_inputs_changed(["resources/peach.ico"]))
        self.assertTrue(runtime_inputs_changed(["scripts/build_windows.ps1"]))
        self.assertTrue(runtime_inputs_changed(["scripts/build_app_entry.py"]))
        for path in ("scripts/build_macos_app.py", "scripts/build_macos_standalone.py",
                     "scripts/peach_macos.spec", "scripts/package_windows_release.py",
                     "scripts/installer/peach.iss", "scripts/ci_windows.ps1",
                     "scripts/ci_macos.sh", ".gitlab-ci.yml"):
            with self.subTest(path=path):
                self.assertTrue(runtime_inputs_changed([path]))
        self.assertTrue(runtime_inputs_changed(["pyproject.toml"]))
        self.assertTrue(runtime_inputs_changed(["uv.lock"]))
        self.assertTrue(runtime_inputs_changed([".github/workflows/release.yml"]))
        self.assertTrue(runtime_inputs_changed([r"src\peach\tray.py"]))

        self.assertFalse(runtime_inputs_changed([]))
        self.assertFalse(runtime_inputs_changed(["docs/STATUS.md", "AGENTS.md"]))
        self.assertFalse(runtime_inputs_changed(["tests/test_tray.py"]))
        self.assertFalse(runtime_inputs_changed([".claude/skills/peach-worktree/SKILL.md"]))
        self.assertFalse(runtime_inputs_changed(["scripts/agent_worktree.py"]))

    def test_only_the_version_line_moves(self):
        updated, version = bump_version(VERSION_SEED, "patch")
        self.assertEqual(version, "0.7.15")
        self.assertEqual(updated,
                         '"""Peach application package."""\n\n__version__ = "0.7.15"\n')

        self.assertEqual(bump_version('__version__ = "0.7.14"', "minor")[1], "0.8.0")
        self.assertEqual(bump_version('__version__ = "0.7.14"', "major")[1], "1.0.0")
        with self.assertRaisesRegex(VersionError, "unknown bump part"):
            bump_version('__version__ = "0.7.14"', "epoch")
        with self.assertRaisesRegex(VersionError, "__version__"):
            bump_version("nothing here\n", "patch")


class ReleasePlanTests(unittest.TestCase):
    """区间与档位落在真实 git 仓库上，不是拿字符串假装。"""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        # 先 resolve：CI runner 的临时目录都是别名，未 resolve 的路径只在本机成立。
        self.root = Path(self.tmp.name).resolve()
        subprocess.run(["git", "init", "-b", "master", str(self.root)], check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self.git("config", "user.email", "test@example.invalid")
        self.git("config", "user.name", "Peach Test")
        self.commit("chore: 起点", self.write("src/peach/__init__.py", VERSION_SEED))

    def git(self, *args: str) -> str:
        done = subprocess.run(["git", "-C", str(self.root), *args], check=True,
                              capture_output=True, text=True, encoding="utf-8")
        return done.stdout.strip()

    def write(self, path: str, text: str = "改了\n") -> str:
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8", newline="\n")
        return path

    def commit(self, subject: str, *paths: str) -> None:
        for path in paths:
            self.git("add", path)
        self.git("commit", "-m", subject)

    def tag(self, name: str = "v0.7.14") -> None:
        self.git("tag", "-a", name, "-m", f"Peach {name}")

    def test_the_range_starts_at_the_last_version_tag(self):
        self.tag()
        self.commit("fix: 托盘图标补回来", self.write("src/peach/tray.py"))
        self.assertEqual(version_bump.last_tag(self.root), "v0.7.14")
        self.assertEqual(version_bump.release_range(self.root), "v0.7.14..HEAD")
        self.assertEqual(version_bump.subjects_in(self.root, "v0.7.14..HEAD"),
                         ["fix: 托盘图标补回来"])
        self.assertEqual(version_bump.changed_in(self.root, "v0.7.14..HEAD"),
                         ["src/peach/tray.py"])

    def test_without_any_tag_the_range_is_the_whole_history(self):
        self.assertIsNone(version_bump.last_tag(self.root))
        self.assertEqual(version_bump.release_range(self.root), "HEAD")
        self.assertEqual(version_bump.changed_in(self.root, "HEAD"), ["src/peach/__init__.py"])
        self.assertEqual(plan_bump(self.root)["version"], "0.7.15")

    def test_a_feature_since_the_last_tag_plans_the_next_minor(self):
        self.tag()
        self.commit("feat: 配置页加桌面快捷方式", self.write("src/peach/routes_configuration.py"))
        planned = plan_bump(self.root)
        self.assertEqual((planned["range"], planned["bump"], planned["current"],
                          planned["version"], planned["commits"]),
                         ("v0.7.14..HEAD", "minor", "0.7.14", "0.8.0", 1))

    def test_a_fix_since_the_last_tag_plans_the_next_patch(self):
        self.tag()
        self.commit("fix: 忙态提示说明在做什么", self.write("web/app.js"))
        self.assertEqual(plan_bump(self.root)["version"], "0.7.15")

    def test_an_explicit_part_overrides_the_commit_types(self):
        self.tag()
        self.commit("fix: 一处小修", self.write("src/peach/tray.py"))
        self.assertEqual(plan_bump(self.root, "major")["version"], "1.0.0")
        self.assertEqual(plan_bump(self.root, "minor")["version"], "0.8.0")

    def test_release_workflow_changes_plan_a_patch(self):
        self.tag()
        self.commit("fix(desktop): 发布构建使用完整依赖", self.write(".github/workflows/release.yml"))
        self.assertEqual(plan_bump(self.root)["version"], "0.7.15")

    def test_locked_dependency_changes_plan_a_patch(self):
        self.tag()
        self.commit("fix(desktop): 固定构建依赖", self.write("uv.lock"))
        self.assertEqual(plan_bump(self.root)["version"], "0.7.15")

    def test_bundled_sidecar_fetch_changes_plan_a_patch(self):
        self.tag()
        self.commit('fix(desktop): 获取随包工具', self.write('scripts/fetch_cloudflared.ps1'))
        self.assertEqual(plan_bump(self.root)['version'], '0.7.15')

    def test_bundled_sidecar_lock_changes_plan_a_patch(self):
        self.tag()
        self.commit('fix(desktop): 固定随包工具版本', self.write('scripts/cloudflared-windows.json'))
        self.assertEqual(plan_bump(self.root)['version'], '0.7.15')

    def test_macos_disk_image_changes_plan_a_patch(self):
        self.tag()
        self.commit("fix(macos): 保留镜像资源签名", self.write("scripts/build_macos_standalone.py"))
        self.assertEqual(plan_bump(self.root)["version"], "0.7.15")

    def test_gitlab_release_build_changes_plan_a_patch(self):
        self.tag()
        self.commit("fix(packaging): 使用项目要求的解释器", self.write(".gitlab-ci.yml"))
        self.assertEqual(plan_bump(self.root)["version"], "0.7.15")

    def test_planning_writes_nothing(self):
        self.tag()
        self.commit("feat: 新面板", self.write("src/peach/panel.py"))
        plan_bump(self.root)
        self.assertEqual(read_version(self.root), "0.7.14")
        self.assertEqual(self.git("status", "--porcelain"), "")

    def test_a_batch_that_never_reaches_the_runtime_cannot_be_released(self):
        """只改文档、技能与测试时，打出来的包和上一个标签逐字节相同。"""
        self.tag()
        self.commit("docs: 记一笔运行状态", self.write("docs/STATUS.md"))
        self.commit("test: 补一条断言", self.write("tests/test_tray.py"))
        with self.assertRaisesRegex(VersionError, "开发过程"):
            plan_bump(self.root)

    def test_a_tag_with_nothing_after_it_cannot_be_released(self):
        self.tag()
        with self.assertRaisesRegex(VersionError, "没有提交"):
            plan_bump(self.root)

    def test_writing_the_version_leaves_the_rest_of_the_file_alone(self):
        self.assertEqual(write_version(self.root, "minor"), "0.8.0")
        self.assertEqual(read_version(self.root), "0.8.0")
        self.assertEqual((self.root / "src/peach/__init__.py").read_text(encoding="utf-8"),
                         VERSION_SEED.replace("0.7.14", "0.8.0"))

    def test_readme_downloads_wait_for_the_release_and_then_move_alone(self):
        """定版不碰 README；换直链时只动链接里的版本号，制品名后缀与其余字节原样保留。"""
        old = ("[Installer](https://github.com/o/p/releases/download/v0.7.14/Peach-0.7.14-windows-x64-setup.exe)"
               " · [Releases](https://github.com/o/p/releases)\r\nPeach 0.7.14\n")
        for name in version_bump.README_FILES:
            (self.root / name).write_bytes(old.encode("utf-8"))
        write_version(self.root, "patch")
        self.assertEqual(version_bump.readme_assets(self.root, "0.7.15"),
                         ["Peach-0.7.15-windows-x64-setup.exe"])
        self.assertEqual(version_bump.point_readmes(self.root, "0.7.15"), list(version_bump.README_FILES))
        self.assertEqual(version_bump.point_readmes(self.root, "0.7.15"), [])
        for name in version_bump.README_FILES:
            with self.subTest(readme=name):
                self.assertEqual((self.root / name).read_bytes().decode("utf-8"),
                                 old.replace("v0.7.14/Peach-0.7.14-", "v0.7.15/Peach-0.7.15-"))


if __name__ == "__main__":
    unittest.main()


class ReleaseNoticeGateTests(unittest.TestCase):
    def test_a_minor_release_without_a_notice_is_refused_and_a_patch_is_not(self):
        from scripts.release_tag import require_release_notice
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "src/peach").mkdir(parents=True)
            (root / "src/peach/release_notices.py").write_text(
                'NOTICES: dict[str, dict] = {"0.57.0": {"level": "notice"}}\n', encoding="utf-8")
            require_release_notice(root, "0.57.0", "minor")
            require_release_notice(root, "0.57.1", "patch")
            with self.assertRaisesRegex(version_bump.VersionError, "0.58.0 还没有更新公告"):
                require_release_notice(root, "0.58.0", "minor")

    def test_a_minor_release_after_0_58_0_needs_a_current_reasoned_review(self):
        """0.58.0 之后的 minor 定版前，公告要有逐条带理由的审阅；改了公告审阅就失效。"""
        import json
        from scripts.release_tag import NOTICE_REVIEW, notice_digest, require_release_notice
        notice = {"level": "notice", "features": [{"id": "english-interface", "icon": "translate"}]}
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "src/peach").mkdir(parents=True)
            (root / "src/peach/release_notices.py").write_text(
                f'NOTICES: dict[str, dict] = {{"0.59.0": {notice!r}}}\n', encoding="utf-8")
            with self.assertRaisesRegex(version_bump.VersionError, "还没审阅"):
                require_release_notice(root, "0.59.0", "minor")
            review = {"version": "0.59.0", "digest": notice_digest(root, "0.59.0", notice),
                      "items": {"english-interface": {"perceptible": "是",
                                                      "icon": "翻译图标的登记含义就是界面语言，和这条一致"}},
                      "omitted": "其余条目是修复与提速，打开应用看不出变化，不进公告"}
            (root / NOTICE_REVIEW).parent.mkdir(parents=True)
            (root / NOTICE_REVIEW).write_text(json.dumps(review, ensure_ascii=False), encoding="utf-8")
            with self.assertRaisesRegex(version_bump.VersionError, "english-interface"):
                require_release_notice(root, "0.59.0", "minor")
            review["items"]["english-interface"]["perceptible"] = "浏览器是英文的用户打开就看到整页英文"
            (root / NOTICE_REVIEW).write_text(json.dumps(review, ensure_ascii=False), encoding="utf-8")
            require_release_notice(root, "0.59.0", "minor")
            # 审阅之后又改了公告：摘要对不上，要重审。
            changed = {**notice, "features": [{"id": "english-interface", "icon": "switch"}]}
            (root / "src/peach/release_notices.py").write_text(
                f'NOTICES: dict[str, dict] = {{"0.59.0": {changed!r}}}\n', encoding="utf-8")
            with self.assertRaisesRegex(version_bump.VersionError, "对不上"):
                require_release_notice(root, "0.59.0", "minor")
            require_release_notice(root, "0.59.1", "patch")

    def test_the_repository_notices_parse_without_importing_the_package(self):
        from scripts.release_tag import ROOT, require_release_notice
        require_release_notice(ROOT, "0.57.0", "minor")
