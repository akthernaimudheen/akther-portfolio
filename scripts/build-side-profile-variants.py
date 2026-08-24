"""Resize the supplied side-profile cutout into the responsive WebP set.

This is deliberately NOT a background remover, and it never touches a subject
pixel. Face, skin tone, hair, clothing, proportions and gaze direction come
through exactly as supplied:

  * no RGB channel is modified, ever
  * no horizontal flip -- the gaze direction is part of the composition
  * no upscaling -- a requested width larger than the source is skipped
  * `exact=True` on save, so fully transparent pixels keep their RGB and the
    encoder cannot bleed colour into the alpha edge as a halo

It does repair one defect in the supplied alpha channel. See `solidify()`.

Contrast with scripts/build-portrait-cutout.py, which *derives* a matte from the
front studio portrait. That script is hardcoded to that photograph's background
and must not be pointed at this file.

Place the supplied file at:
    assets-src/akther-side-profile-cutout.png

Output (public/, alpha preserved):
    akther-side-profile-cutout.webp       master (source width, capped)
    akther-side-profile-cutout-768.webp   768w  srcset step
    akther-side-profile-cutout-512.webp   512w  srcset step (mobile)

Run:  python scripts/build-side-profile-variants.py
"""

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
STEM = "akther-side-profile-cutout"
STEPS = (512, 768)
# Nothing on the page renders the hero wider than this, so a bigger master is
# only bytes the visitor pays for.
MASTER_CAP = 1280
# Alpha at or below this counts as background when tracing the silhouette.
EDGE_FLOOR = 10
FEATHER = 0.9
# Pixels of transparent padding kept around the silhouette after trimming.
TRIM_MARGIN = 4

CANDIDATES = (
    ROOT / "assets-src" / f"{STEM}.png",
    ROOT / "assets-src" / f"{STEM}.webp",
)


def solidify(image: Image.Image) -> Image.Image:
    """Make the subject fully opaque without moving its silhouette.

    The supplied cutout was matted with the photograph's own luminance as its
    alpha channel: the outline is correct, but inside the subject alpha tracks
    brightness, so the black shirt ends up the *most* transparent part of the
    person. Composited on the hero's yellow field that reads as a yellow-green
    cast across the shirt and a washed-out face.

    The repair works only on alpha. Background is defined as zero-alpha pixels
    reachable from the frame border, so any dark interior region stays subject
    no matter how low its luminance-derived alpha was. The resulting silhouette
    is then feathered by about a pixel so the edge stays soft rather than
    aliased. RGB is passed through untouched.
    """
    width, height = image.size
    alpha = image.getchannel("A").load()

    background = bytearray(width * height)
    queue = deque()

    def seed(x: int, y: int) -> None:
        if alpha[x, y] <= EDGE_FLOOR and not background[y * width + x]:
            background[y * width + x] = 1
            queue.append((x, y))

    for x in range(width):
        seed(x, 0)
        seed(x, height - 1)
    for y in range(height):
        seed(0, y)
        seed(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if not (0 <= nx < width and 0 <= ny < height):
                continue
            index = ny * width + nx
            if not background[index] and alpha[nx, ny] <= EDGE_FLOOR:
                background[index] = 1
                queue.append((nx, ny))

    silhouette = Image.frombytes(
        "L", (width, height), bytes(bytearray(0 if flag else 255 for flag in background))
    ).filter(ImageFilter.GaussianBlur(FEATHER))
    # Tighten the blur's ramp so the feather stays about a pixel wide.
    silhouette = silhouette.point(
        lambda v: 0 if v < 40 else (255 if v > 210 else int((v - 40) * 255 / 170))
    )

    repaired = image.copy()
    repaired.putalpha(silhouette)
    return repaired


def trim(image: Image.Image) -> Image.Image:
    """Crop away the fully transparent margin around the silhouette.

    The supplied frame carries a wide empty band to the right of the face and
    above the head. `object-fit: contain` centres the whole frame, padding
    included, so that band pushes the profile off-centre in the hero and wastes
    bytes on nothing. Trimming to the alpha bounding box makes the subject
    anchor to the box itself -- the back of the head on one edge, the nose on
    the other -- which is what lets the headline sit exactly in front of the
    gaze. No subject pixel is removed; only transparent padding.
    """
    box = image.getchannel("A").getbbox()
    if box is None:
        return image

    left, top, right, bottom = box
    left = max(0, left - TRIM_MARGIN)
    top = max(0, top - TRIM_MARGIN)
    right = min(image.width, right + TRIM_MARGIN)
    bottom = min(image.height, bottom + TRIM_MARGIN)

    cropped = image.crop((left, top, right, bottom))
    print(
        f"trimmed transparent margin: {image.width}x{image.height} -> "
        f"{cropped.width}x{cropped.height}"
    )
    return cropped


def locate() -> Path:
    for path in CANDIDATES:
        if path.exists():
            return path
    looked = "\n  ".join(str(p) for p in CANDIDATES)
    raise SystemExit(f"No side-profile cutout found. Expected one of:\n  {looked}")


def main() -> None:
    source_path = locate()
    image = Image.open(source_path)

    if image.mode != "RGBA":
        image = image.convert("RGBA")
    alpha = image.getchannel("A")
    low, high = alpha.getextrema()
    if low == high == 255:
        raise SystemExit(
            f"{source_path.name} has no transparency (alpha is fully opaque).\n"
            "This script only resizes an existing cutout; it does not remove a background."
        )

    print(f"source: {source_path.name}  {image.width}x{image.height}  alpha range {low}-{high}")

    image = solidify(image)
    repaired = image.getchannel("A").histogram()
    pixels = image.width * image.height
    print(
        f"alpha repaired: {100 * repaired[0] / pixels:.1f}% transparent, "
        f"{100 * repaired[255] / pixels:.1f}% opaque, "
        f"{100 * (pixels - repaired[0] - repaired[255]) / pixels:.1f}% feathered edge"
    )

    image = trim(image)

    master = image
    if image.width > MASTER_CAP:
        master = image.resize(
            (MASTER_CAP, round(image.height * MASTER_CAP / image.width)), Image.LANCZOS
        )

    PUBLIC.mkdir(exist_ok=True)
    master.save(PUBLIC / f"{STEM}.webp", "WEBP", quality=90, method=6, exact=True)
    print(f"wrote {STEM}.webp ({master.width}x{master.height})")

    for target in STEPS:
        if target >= image.width:
            print(f"skipped {target}w -- source is only {image.width}w, refusing to upscale")
            continue
        resized = image.resize(
            (target, round(image.height * target / image.width)), Image.LANCZOS
        )
        resized.save(PUBLIC / f"{STEM}-{target}.webp", "WEBP", quality=88, method=6, exact=True)
        print(f"wrote {STEM}-{target}.webp ({target}x{resized.height})")

    print(
        "\nNow update profile.portraitCutout in src/data/profile.ts with the master's\n"
        "width/height above, and set --portrait-ratio in src/index.css to match."
    )


if __name__ == "__main__":
    main()
