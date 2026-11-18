# -*- mode: python ; coding: utf-8 -*-
"""amane 桥的独立 console 运行目录。"""
from pathlib import Path
import runpy
from importlib.metadata import distributions
from PyInstaller.utils.hooks import collect_all, collect_data_files, copy_metadata

root = Path(SPECPATH).parent
bridge = root / "tools/amane-bridge/bridge.py"
sites = runpy.run_path(str(bridge))["SITES"]
datas = collect_data_files("amane")
binaries, hiddenimports = [], []
curl_data, curl_binaries, curl_imports = collect_all("curl_cffi")
datas += curl_data
binaries += curl_binaries
hiddenimports += curl_imports
hiddenimports += [f"amane.crawlers.sites.{module}" for module, _name in sites.values()]
# 分发保留所有锁定依赖的版本和许可证；动态版本查询使用相同 dist-info。
for distribution in distributions():
    datas += copy_metadata(distribution.metadata["Name"])
a = Analysis([str(bridge)], pathex=[], binaries=binaries, datas=datas,
             hiddenimports=hiddenimports, excludes=["tkinter"])
pyz = PYZ(a.pure)
exe = EXE(pyz, a.scripts, [], exclude_binaries=True, name="amane-bridge",
          console=True, strip=False, upx=False)
collection = COLLECT(exe, a.binaries, a.datas, strip=False, upx=False, name="amane-bridge")
