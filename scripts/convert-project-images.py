"""Convert the approved master images into responsive WebP variants.

Masters live in ../assets-src (outside public/, so the multi-megabyte PNGs are
never copied into dist/). Only the WebP output below is served.

Project artwork, per asset -- native 16:9 aspect is preserved and the display
crop is left to CSS `object-fit: cover`:
  <name>.webp        1536w  canonical / <img src> fallback
  <name>-1152.webp   1152w  srcset step
  <name>-768.webp     768w  srcset step (mobile)

Portrait -- one asset family serves both the hero and the About profile card, so
the browser never downloads two large copies of the same photograph. The native
2:3 aspect is preserved and each context picks its own crop via CSS
`object-fit: cover` + `object-position`:
  akther-portrait.webp       1023w  canonical (master's native width)
  akther-portrait-768.webp    768w  srcset step
  akther-portrait-512.webp    512w  srcset step (mobile / compact card)

Run:  python scripts/convert-project-images.py
Requires Pillow. Re-runnable; overwrites its own output only, never a master.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MASTERS = ROOT / "assets-src"
PUBLIC = ROOT / "public"

# (suffix, target width, quality)
PROJECT_VARIANTS = [
    ("", 1536, 82),
    ("-1152", 1152, 82),
    ("-768", 768, 80),
]

PORTRAIT_VARIANTS = [
    ("", 1023, 86),
    ("-768", 768, 86),
    ("-512", 512, 84),
]

EDITORIAL_PORTRAIT_VARIANTS = [
    ("", 1024, 88),
    ("-768", 768, 87),
    ("-512", 512, 86),
]

CINEMATIC_PORTRAIT_VARIANTS = [
    ("", 1536, 88),
    ("-1152", 1152, 87),
    ("-768", 768, 86),
]

JOBS = [
    ("project-seaking-restaurant.png", PROJECT_VARIANTS),
    ("project-seaking-suites.png", PROJECT_VARIANTS),
    ("project-website-systems.png", PROJECT_VARIANTS),
    ("project-technical-lab.png", PROJECT_VARIANTS),
    # Slightly higher quality than the project art: faces show WebP artefacts
    # far more readily than architectural interiors do.
    ("akther-portrait.png", PORTRAIT_VARIANTS),
    ("akther-editorial-portrait.png", EDITORIAL_PORTRAIT_VARIANTS),
    ("akther-cinematic-portrait.png", CINEMATIC_PORTRAIT_VARIANTS),
]


def kb(path: Path) -> str:
    return f"{path.stat().st_size / 1024:.1f} KB"


def main() -> None:
    total_src = 0
    total_out = 0

    for filename, variants in JOBS:
        src_path = MASTERS / filename
        if not src_path.exists():
            raise SystemExit(f"missing master: {src_path}")

        with Image.open(src_path) as im:
            im = im.convert("RGB")
            src_w, src_h = im.size
            total_src += src_path.stat().st_size
            print(f"\n{filename}  {src_w}x{src_h}  {kb(src_path)}")

            for suffix, width, quality in variants:
                if width > src_w:
                    width = src_w
                height = round(width * src_h / src_w)
                out_path = PUBLIC / f"{src_path.stem}{suffix}.webp"
                resized = im if (width, height) == (src_w, src_h) else im.resize(
                    (width, height), Image.LANCZOS
                )
                resized.save(out_path, "WEBP", quality=quality, method=6)
                total_out += out_path.stat().st_size
                print(f"  -> {out_path.name:42s} {width}x{height:<5d} {kb(out_path)}")

    print(
        f"\nmaster PNG total {total_src / 1024 / 1024:.2f} MB"
        f"  ->  webp output total {total_out / 1024 / 1024:.2f} MB"
    )


if __name__ == "__main__":
    main()
