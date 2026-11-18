import copy
import hashlib
import json
import os
import io
from pathlib import Path
import subprocess
import shutil
import tempfile
import unittest
from urllib.request import Request
import zipfile
from unittest import mock

from scripts import ci_r2_artifacts as artifacts
from scripts import release_candidate as candidate
from scripts import github_release_candidate as github
from scripts.release_forge import REQUIRED_TEST_JOBS, REHEARSAL_JOBS


class ReleaseCandidateTests(unittest.TestCase):
    def setUp(self):
        self.build = {"project": "123", "pipeline": "7", "commit": "a" * 40, "tag": "v1.2.3"}
        self.environment = {"CI_PROJECT_ID": "123", "CI_PIPELINE_ID": "8", "CI_COMMIT_SHA": "a" * 40,
            "CI_COMMIT_TAG": "v1.2.3", "CI_COMMIT_REF_PROTECTED": "true", "CI_SERVER_HOST": "forge.example",
            "CI_PROJECT_PATH": "owner/repo"}
        self.names = sorted((REQUIRED_TEST_JOBS | REHEARSAL_JOBS) - {"seal-release"})
        self.jobs = {name: {"id": index + 10, "status": "success", "commit": {"id": "a" * 40}}
                     for index, name in enumerate(self.names)}
        self.docker = {"commit": "a" * 40, "pipeline": "7", "version": "1.2.3",
            "image": "peach-ci:1.2.3-7", "image_id": "sha256:" + "b" * 64}
        self.paths = {"windows-release": "release/Peach-1.2.3-windows-x64.zip",
            "macos-release": "dist/macos.noindex/arm64/Peach-1.2.3-macos-arm64.dmg",
            "docker-release": "build/ci-artifacts/docker-image.json"}
        self.groups = {group: {"format": 1, "identity": self.build, "producer_job": "99", "group": group,
            "files": [{"path": path, "size": 4, "sha256": hashlib.sha256(b"file").hexdigest()}]}
            for group, path in self.paths.items()}
        self.sealed = {"format": 1, "identity": self.build, "jobs": {name: row["id"] for name, row in self.jobs.items()},
            "groups": self.groups, "docker": self.docker}
        self.forge = mock.Mock()
        self.forge.test_runs.return_value = [{"id": 7, "status": "completed", "conclusion": "success"}]
        self.forge.jobs.return_value = self.jobs

    def test_tag_validation_binds_successful_jobs_and_same_commit_candidate(self):
        with tempfile.TemporaryDirectory() as directory, mock.patch.dict(os.environ, self.environment, clear=True), \
                mock.patch.object(candidate, "forge", return_value=self.forge), \
                mock.patch.object(artifacts, "remote_json", return_value=self.sealed):
            root = Path(directory).resolve()
            receipt = candidate.validate(root)
            self.assertEqual(receipt["candidate"]["identity"]["pipeline"], "7")
            self.assertEqual(receipt["target"]["pipeline"], "8")
            self.assertTrue((root / candidate.RECEIPT).is_file())
            self.forge.require_rehearsal.assert_called_once_with("owner/repo", 7)

    def test_changed_commit_failed_checks_or_replaced_mirror_are_rejected(self):
        mutations = (lambda data: data["identity"].update(commit="c" * 40),
                     lambda data: data["jobs"].update({self.names[0]: 999}),
                     lambda data: data["docker"].update(image="unrelated:latest"))
        for mutate in mutations:
            with self.subTest(mutate=mutate), tempfile.TemporaryDirectory() as directory, \
                    mock.patch.dict(os.environ, self.environment, clear=True), \
                    mock.patch.object(candidate, "forge", return_value=self.forge):
                data = copy.deepcopy(self.sealed)
                mutate(data)
                with mock.patch.object(artifacts, "remote_json", return_value=data), self.assertRaises(ValueError):
                    candidate.validate(Path(directory).resolve())
        self.jobs[self.names[0]]["status"] = "failed"
        with self.assertRaises(ValueError):
            candidate.verified_jobs(self.forge, "owner/repo", self.build)

    def test_missing_candidate_is_not_a_successful_promotion(self):
        with tempfile.TemporaryDirectory() as directory, mock.patch.dict(os.environ, self.environment, clear=True), \
                mock.patch.object(candidate, "forge", return_value=self.forge), \
                mock.patch.object(artifacts, "remote_json", return_value=None), self.assertRaises(ValueError):
            candidate.validate(Path(directory).resolve())

    def test_pull_keeps_source_pipeline_identity_and_group_file_checksums(self):
        with tempfile.TemporaryDirectory() as directory, mock.patch.dict(os.environ, self.environment, clear=True), \
                mock.patch.object(candidate, "forge", return_value=self.forge), \
                mock.patch.object(artifacts, "remote_json", return_value=self.sealed), \
                mock.patch.object(artifacts, "transfer", return_value={"files": 1}) as transfer:
            root = Path(directory).resolve()
            result = candidate.pull(root)
            self.assertTrue(result["promoted"])
            self.assertEqual(transfer.call_count, 3)
            self.assertTrue(all(call.kwargs["source"] == self.build for call in transfer.call_args_list))
            manifest = json.loads((root / "build/ci-artifacts/windows-release.json").read_text())
            self.assertEqual(manifest["files"], self.groups["windows-release"]["files"])

    def test_peak_capacity_includes_staging_and_new_public_files(self):
        with tempfile.TemporaryDirectory() as directory, \
                mock.patch.object(candidate, "listing", return_value=[{"Path": "_ci/current", "Size": 7999999995}]), \
                self.assertRaisesRegex(ValueError, "超过上限"):
            candidate.check_capacity(Path(directory), self.build, self.groups)

    def test_unprotected_tags_and_foreign_source_identity_cannot_read_artifacts(self):
        with mock.patch.dict(os.environ, {**self.environment, "CI_COMMIT_REF_PROTECTED": "false"}, clear=True), \
                self.assertRaises(ValueError):
            candidate.validate(Path.cwd())
        with mock.patch.dict(os.environ, self.environment, clear=True), self.assertRaises(ValueError):
            artifacts.transfer(Path.cwd(), "windows-release", "pull", source={**self.build, "project": "other"})

    def test_restore_distinguishes_absence_from_failed_reads(self):
        with tempfile.TemporaryDirectory() as directory, mock.patch.dict(os.environ, self.environment, clear=True), \
                mock.patch.object(artifacts, "remote_json", return_value=None) as read:
            root = Path(directory).resolve()
            self.assertFalse(artifacts.restore(root, "windows-release")["restored"])
            read.side_effect = subprocess.CalledProcessError(1, "rclone")
            with self.assertRaises(subprocess.CalledProcessError):
                artifacts.restore(root, "windows-release")

    def test_checkpoint_restore_downloads_without_publishing_new_build(self):
        build = {**self.build, "pipeline": "8"}
        manifest = {**self.groups["windows-release"], "identity": build}
        with tempfile.TemporaryDirectory() as directory, mock.patch.dict(os.environ, self.environment, clear=True), \
                mock.patch.object(artifacts, "remote_json", return_value=manifest), \
                mock.patch.object(artifacts, "transfer", return_value={"files": 1}) as transfer:
            root = Path(directory).resolve()
            self.assertTrue(artifacts.restore(root, "windows-release")["restored"])
            transfer.assert_called_once_with(root, "windows-release", "pull")

    def test_sealed_rehearsal_and_tag_transfer_keep_identical_bytes(self):
        metadata, objects = {}, {}
        for group, path in self.paths.items():
            data = json.dumps(self.docker).encode() if group == "docker-release" else b"verified " + group.encode()
            item = self.groups[group]["files"][0]
            item.update(size=len(data), sha256=hashlib.sha256(data).hexdigest())
            metadata[artifacts.checkpoint(self.build, group)] = self.groups[group]
            remote = f"peach:peach-releases/{artifacts.prefix(self.build, group, '99')}/{path}"
            objects[remote] = data
        def remote_json(_root, key, payload=None):
            if payload is not None:
                metadata[key] = copy.deepcopy(payload)
            return copy.deepcopy(metadata.get(key))
        def transfer(command, **_kwargs):
            self.assertEqual(command[1], "copy")
            source, destination = command[2:4]
            names = Path(command[command.index("--files-from-raw") + 1]).read_text().splitlines()
            for name in names:
                path = Path(destination) / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(objects[source + "/" + name])
        with tempfile.TemporaryDirectory() as directory, mock.patch.object(candidate, "forge", return_value=self.forge), \
                mock.patch.object(candidate, "listing", return_value=[]), \
                mock.patch.object(artifacts, "remote_json", side_effect=remote_json), \
                mock.patch.object(artifacts, "rclone_environment", return_value={"PEACH_R2_BUCKET": "peach-releases"}), \
                mock.patch.object(artifacts, "rclone_executable", return_value="rclone"), \
                mock.patch.object(artifacts.subprocess, "run", side_effect=transfer):
            root = Path(directory).resolve()
            source = root / "rehearsal"
            source.mkdir()
            rehearsal = {**self.environment, "CI_PIPELINE_ID": "7", "CI_COMMIT_BRANCH": "master",
                         "CI_COMMIT_TAG": "", "PEACH_RELEASE_REHEARSAL": "1"}
            with mock.patch.dict(os.environ, rehearsal, clear=True), mock.patch.object(artifacts, "rehearsal_tag", return_value="v1.2.3"):
                self.assertTrue(candidate.seal(source)["sealed"])
            target = root / "tag"
            target.mkdir()
            with mock.patch.dict(os.environ, self.environment, clear=True):
                self.assertTrue(candidate.pull(target)["promoted"])
            self.assertEqual((target / self.paths["windows-release"]).read_bytes(), b"verified windows-release")
            self.assertEqual(json.loads((target / self.paths["docker-release"]).read_text()), self.docker)


@unittest.skipUnless(shutil.which("pwsh"), "需要 PowerShell 7 执行 Windows 发布入口")
class DockerPublicationTests(unittest.TestCase):
    def test_failed_push_retains_verified_image_and_success_removes_it(self):
        entry = Path(__file__).resolve().parents[1] / "scripts/ci_windows.ps1"
        image = {"Id": "sha256:" + "b" * 64, "Config": {"Labels": {
            "org.opencontainers.image.revision": "a" * 40, "org.opencontainers.image.version": "1.2.3"}}}
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            (root / "src/peach").mkdir(parents=True)
            (root / "src/peach/__init__.py").write_text('__version__ = "1.2.3"')
            (root / "build/ci-artifacts").mkdir(parents=True)
            receipt = {"target": {"pipeline": "8", "commit": "a" * 40},
                       "candidate": {"identity": {"pipeline": "7"}, "docker": {"image_id": image["Id"]}}}
            (root / "build/ci-artifacts/release-candidate.json").write_text(json.dumps(receipt))
            driver = root / "driver.ps1"
            # 重定向时 pwsh 按系统代码页输出，中文 Windows 上失败消息是 GBK；按 UTF-8 读要先切换。
            driver.write_text('''[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
function docker {
    param([Parameter(Position=0, ValueFromRemainingArguments=$true)][string[]]$DockerArgs,
          [Parameter(ValueFromPipeline=$true)][string]$LoginInput)
    Add-Content -LiteralPath calls.log -Value ($DockerArgs -join ' ')
    $global:LASTEXITCODE = 0
    if ($DockerArgs[0] -eq 'context') { return 'fixture-endpoint' }
    if ($DockerArgs[0] -eq 'image' -and $DockerArgs[1] -eq 'inspect') { return $env:TEST_IMAGE }
    if ($DockerArgs[0] -eq 'push' -and $env:TEST_FAIL_PUSH -eq '1') { $global:LASTEXITCODE = 1 }
}
try { & $env:TEST_CI_ENTRY docker-push } catch { Write-Output $_; exit 3 }
''', encoding="utf-8")
            environment = {**os.environ, "TEST_CI_ENTRY": str(entry), "TEST_IMAGE": json.dumps(image),
                "CI_PIPELINE_ID": "8", "CI_COMMIT_SHA": "a" * 40, "CI_COMMIT_TAG": "v1.2.3",
                "PEACH_RELEASE_REHEARSAL": "", "DOCKERHUB_USERNAME": "fixture", "DOCKERHUB_TOKEN": "fixture"}
            for fail in (True, False):
                with self.subTest(failed=fail):
                    log = root / "calls.log"
                    log.unlink(missing_ok=True)
                    # 中文 Windows 上 pwsh 的错误流按控制台代码页输出；输出只用于失败说明，解不了的字节替换掉。
                    result = subprocess.run([shutil.which("pwsh"), "-NoProfile", "-NonInteractive", "-File", str(driver)],
                        cwd=root, env={**environment, "TEST_FAIL_PUSH": str(int(fail))}, text=True, encoding="utf-8",
                        errors="replace", capture_output=True)
                    calls = log.read_text(encoding="utf-8-sig")
                    self.assertEqual(result.returncode == 0, not fail, (result.stdout or "") + (result.stderr or ""))
                    self.assertEqual("image rm peach-ci:1.2.3-7" in calls, not fail)
                    self.assertIn("logout", calls)


class GitHubCandidateTests(unittest.TestCase):
    def payload(self, name="program.exe"):
        stream = io.BytesIO()
        with zipfile.ZipFile(stream, "w") as package:
            package.writestr(name, b"verified bytes")
        return stream.getvalue()

    def test_download_checks_server_digest_before_extracting(self):
        payload = self.payload()
        record = {"run_id": 7, "artifacts": {"desktop-candidate": {"id": 9,
            "digest": "sha256:" + hashlib.sha256(payload).hexdigest()}}}
        with tempfile.TemporaryDirectory() as directory, mock.patch.object(github, "select", return_value=record), \
                mock.patch.object(github, "request", side_effect=lambda *_: io.BytesIO(payload)):
            root = Path(directory)
            self.assertTrue(github.download("owner/repo", "a" * 40, "desktop", root)["promoted"])
            self.assertEqual((root / "program.exe").read_bytes(), b"verified bytes")
            record["artifacts"]["desktop-candidate"]["digest"] = "sha256:" + "0" * 64
            with self.assertRaisesRegex(ValueError, "SHA-256"):
                github.download("owner/repo", "a" * 40, "desktop", root / "second")
            self.assertFalse((root / "second/program.exe").exists())

    def test_verified_zip_cannot_escape_or_replace_an_existing_file(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            path = root / "artifact.zip"
            path.write_bytes(self.payload("../outside"))
            with self.assertRaises(ValueError):
                github.extract(path, root / "target")
            self.assertFalse((root / "outside").exists())
            path.write_bytes(self.payload())
            (root / "program.exe").write_bytes(b"keep original")
            with self.assertRaises(ValueError):
                github.extract(path, root)
            self.assertEqual((root / "program.exe").read_bytes(), b"keep original")

    def test_cross_host_redirect_drops_ci_authorization(self):
        original = Request("https://api.github.com/repos/owner/repo/actions/artifacts/9/zip",
                           headers={"Authorization": "Bearer test-value"})
        redirected = github.ArtifactRedirect().redirect_request(original, None, 302, "Found", {}, "https://artifacts.example/package")
        self.assertIsNone(redirected.get_header("Authorization"))
        with self.assertRaises(ValueError):
            github.ArtifactRedirect().redirect_request(original, None, 302, "Found", {}, "http://artifacts.example/package")

    def test_expired_artifacts_and_skipped_smoke_are_not_successful_candidates(self):
        run = {"id": 7, "head_sha": "a" * 40, "head_branch": "master", "event": "push", "status": "completed", "conclusion": "success"}
        jobs = [{"name": name, "conclusion": "success"} for name in github.REQUIRED_JOBS]
        artifacts = [{"name": name, "id": index, "expired": False, "digest": "sha256:" + "b" * 64}
                     for index, name in enumerate(sorted(github.REQUIRED_ARTIFACTS))]
        def api(_repo, endpoint):
            return {"workflow_runs": [run]} if "workflows/" in endpoint else {"jobs": jobs} if "/jobs?" in endpoint else {"artifacts": artifacts}
        with mock.patch.object(github, "api", side_effect=api):
            self.assertEqual(github.select("owner/repo", "a" * 40)["run_id"], 7)
            artifacts[0]["expired"] = True
            with self.assertRaises(ValueError):
                github.select("owner/repo", "a" * 40)
            artifacts[0]["expired"] = False
            jobs[0]["conclusion"] = "skipped"
            with self.assertRaises(ValueError):
                github.select("owner/repo", "a" * 40)

    def test_a_dispatched_rehearsal_is_promoted_when_the_push_run_was_skipped(self):
        def row(run_id, event, conclusion, branch="master"):
            return {"id": run_id, "head_sha": "a" * 40, "head_branch": branch, "event": event,
                    "status": "completed", "conclusion": conclusion}
        runs = [row(5, "workflow_dispatch", "success"), row(6, "push", "skipped"),
                row(8, "push", "failure", branch="v0.37.0"), row(9, "pull_request", "success")]
        jobs = [{"name": name, "conclusion": "success"} for name in github.REQUIRED_JOBS]
        artifacts = [{"name": name, "id": index, "expired": False, "digest": "sha256:" + "b" * 64}
                     for index, name in enumerate(sorted(github.REQUIRED_ARTIFACTS))]
        def api(_repo, endpoint):
            return {"workflow_runs": runs} if "workflows/" in endpoint else {"jobs": jobs} if "/jobs?" in endpoint else {"artifacts": artifacts}
        with mock.patch.object(github, "api", side_effect=api):
            self.assertEqual(github.select("owner/repo", "a" * 40)["run_id"], 5)
            runs[0]["conclusion"] = "failure"
            with self.assertRaisesRegex(ValueError, "尚未成功"):
                github.select("owner/repo", "a" * 40)
            del runs[:2]
            with self.assertRaisesRegex(ValueError, "未取得"):
                github.select("owner/repo", "a" * 40)

    def test_loaded_docker_image_must_match_the_recorded_image_content(self):
        image = {"Id": "sha256:" + "b" * 64, "Architecture": "arm64", "Os": "linux",
                 "RootFS": {"Type": "layers", "Layers": ["sha256:" + "1" * 64, "sha256:" + "2" * 64]},
                 "Config": {"Entrypoint": ["/entrypoint.sh"], "Env": ["PATH=/usr/bin"], "Labels": {
                     "org.opencontainers.image.version": "1.2.3", "org.opencontainers.image.revision": "a" * 40}}}
        inspected = []
        def inspect(command, **_kw):
            inspected.append(command[-1])
            return json.dumps(image)
        with tempfile.TemporaryDirectory() as directory, mock.patch.dict(os.environ, {"GITHUB_SHA": "a" * 40}), \
                mock.patch.object(github.subprocess, "check_output", side_effect=inspect):
            receipt = Path(directory) / "image.json"
            github.image_receipt(receipt, "1.2.3", "arm64", verify=False)
            github.image_receipt(receipt, "1.2.3", "arm64", verify=True)
            self.assertEqual(set(inspected), {"longmeidao/peach:candidate-arm64"}, "每个架构核对自己的候选标签")
            with self.assertRaisesRegex(ValueError, "架构"):
                github.image_receipt(receipt, "1.2.3", "amd64", verify=True)
            # 在 arm64 runner（overlay2）记录、在 amd64 runner（containerd）载入后核对：Id 换了，内容没变。
            image["Id"] = "sha256:" + "c" * 64
            github.image_receipt(receipt, "1.2.3", "arm64", verify=True)
            image["RootFS"]["Layers"][-1] = "sha256:" + "3" * 64
            with self.assertRaises(ValueError):
                github.image_receipt(receipt, "1.2.3", "arm64", verify=True)
            image["RootFS"]["Layers"][-1] = "sha256:" + "2" * 64
            image["Config"]["Entrypoint"] = ["/other.sh"]
            with self.assertRaises(ValueError):
                github.image_receipt(receipt, "1.2.3", "arm64", verify=True)

    def test_docker_promotion_requires_an_accepted_candidate_for_every_architecture(self):
        self.assertTrue({"docker-candidate-amd64", "docker-candidate-arm64"} <= github.REQUIRED_ARTIFACTS)
        self.assertTrue({"Linux amd64 镜像构建与验收", "Linux arm64 镜像构建与验收"} <= github.REQUIRED_JOBS)
