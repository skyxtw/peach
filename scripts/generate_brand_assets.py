"""Generate Peach's square raster logo and Windows icon from the supplied artwork."""
from __future__ import annotations

import argparse
from pathlib import Path
import sys

from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT_ROOT / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from peach.interface_text import dev as t  # noqa: E402

#: 页面里那枚站标的小图：侧栏 20–24 CSS px、登录卡 40 CSS px。页面用 `srcset` 按屏幕像素
#: 密度挑一张，1024 那张原图只留给 README、托盘与打包。
SMALL_LOGO_SIZES = (64, 128)

#: 主屏幕 Web App 的图标：iOS 用 apple-touch-icon（180），Android/桌面 manifest 用 192 与 512。
PWA_LOGO_SIZES = ((180, "apple-touch-icon"), (192, "peach-pwa-192"), (512, "peach-pwa-512"))


def save_small_logos(logo: Image.Image, output_dir: Path) -> None:
    """从方形原图缩出 `peach-logo-64.png` 与 `peach-logo-128.png`。"""
    for size in SMALL_LOGO_SIZES:
        logo.resize((size, size), Image.Resampling.LANCZOS).save(
            output_dir / f"peach-logo-{size}.png", optimize=True)


def save_pwa_logos(logo: Image.Image, output_dir: Path) -> None:
    """从方形原图缩出主屏幕 Web App 的三枚图标。"""
    for size, name in PWA_LOGO_SIZES:
        logo.resize((size, size), Image.Resampling.LANCZOS).save(
            output_dir / f"{name}.png", optimize=True)


def generate(source: Path, output_dir: Path) -> None:
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    visible = alpha.point(lambda value: 255 if value > 20 else 0)
    bbox = visible.getbbox()
    if bbox is None:
        raise ValueError("source image has no visible artwork")

    left, top, right, bottom = bbox
    content_size = max(right - left, bottom - top)
    padding = max(1, round(content_size * 0.05))
    center_x = (left + right) // 2
    center_y = (top + bottom) // 2
    side = content_size + padding * 2
    crop_left = max(0, center_x - side // 2)
    crop_top = max(0, center_y - side // 2)
    crop_left = min(crop_left, image.width - side)
    crop_top = min(crop_top, image.height - side)
    square = image.crop((crop_left, crop_top, crop_left + side, crop_top + side))
    square.putalpha(square.getchannel("A").point(lambda value: value if value > 20 else 0))
    logo = square.resize((1024, 1024), Image.Resampling.LANCZOS)

    output_dir.mkdir(parents=True, exist_ok=True)
    logo.save(output_dir / "peach-logo.png", optimize=True)
    save_small_logos(logo, output_dir)
    save_pwa_logos(logo, output_dir)
    logo.save(
        output_dir / "peach.ico",
        format="ICO",
        sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("--output-dir", type=Path, default=Path("resources"))
    parser.add_argument("--small-only", action="store_true",
                        help=t("generate_brand_assets.smallOnlyHelp"))
    args = parser.parse_args()
    if args.small_only:
        args.output_dir.mkdir(parents=True, exist_ok=True)
        save_small_logos(Image.open(args.source).convert("RGBA"), args.output_dir)
    else:
        generate(args.source, args.output_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
