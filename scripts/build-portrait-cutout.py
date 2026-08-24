"""Derive the transparent hero cutout from the original Akther portrait.

The homepage hero needs the portrait to sit on the yellow field without its
studio wall showing as a grey rectangle, so this builds an alpha matte from
`assets-src/akther-portrait.png` -- the original photograph, not a generated
one. Nothing about the subject is redrawn or retouched: the only change is that
background pixels become transparent.

How the matte is found
----------------------
A flood fill starts from every border pixel and grows through the wall using a
*neighbour-relative* tolerance, so the wall's soft light gradient is followed
while the hard edge at hair, skin and collar stops it. Two guards keep the fill
off the subject:

  FLOOR  a luminance floor; nothing darker is ever treated as background. The
         first pass sits above the neck's shadowed skin, which is otherwise the
         one place the fill can slip from the wall onto the face.
  BAND   the second pass, which mops up the darker top corners of the wall, is
         restricted to the upper part of the frame. There is no skin touching
         the background up there -- only hair, which is far below the floor.

Output (written to public/, alpha-preserving WebP):
  akther-portrait-cutout.webp       1023w  canonical / <img src> fallback
  akther-portrait-cutout-768.webp    768w  srcset step
  akther-portrait-cutout-512.webp    512w  srcset step (mobile)

Run:  python scripts/build-portrait-cutout.py
"""

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets-src" / "akther-portrait.png"
PUBLIC = ROOT / "public"
STEM = "akther-portrait-cutout"
WIDTHS = (512, 768)

# Pass one: walk the wall, stay off the subject.
TOLERANCE = 6
FLOOR = 175
# Pass two: the darker top corners, limited to the head-and-above band.
TOP_TOLERANCE = 8
TOP_FLOOR = 125
TOP_BAND = 0.38
# Softens the one-pixel staircase left by a binary fill.
FEATHER = 1.1


def flood(luma, width, height, background, tolerance, floor, max_y):
    """Grow `background` (a 0/1 bytearray) outward from its current members."""
    queue = deque(
        (x, y)
        for y in range(min(max_y, height))
        for x in range(width)
        if background[y * width + x]
    )
    while queue:
        x, y = queue.popleft()
        value = luma[x, y]
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if not (0 <= nx < width and 0 <= ny < max_y):
                continue
            index = ny * width + nx
            if background[index]:
                continue
            neighbour = luma[nx, ny]
            if neighbour >= floor and abs(neighbour - value) <= tolerance:
                background[index] = 1
                queue.append((nx, ny))


def build() -> Image.Image:
    source = Image.open(SOURCE).convert("RGB")
    width, height = source.size
    # A touch of blur only for the decision map; the saved pixels are untouched.
    luma = source.convert("L").filter(ImageFilter.GaussianBlur(0.8)).load()

    background = bytearray(width * height)
    for x in range(width):
        for y in (0, height - 1):
            if luma[x, y] >= FLOOR:
                background[y * width + x] = 1
    for y in range(height):
        for x in (0, width - 1):
            if luma[x, y] >= FLOOR:
                background[y * width + x] = 1

    flood(luma, width, height, background, TOLERANCE, FLOOR, height)
    flood(luma, width, height, background, TOP_TOLERANCE, TOP_FLOOR, int(height * TOP_BAND))

    alpha = Image.frombytes(
        "L", (width, height), bytes(bytearray(0 if flag else 255 for flag in background))
    ).filter(ImageFilter.GaussianBlur(FEATHER))

    cutout = source.copy()
    cutout.putalpha(alpha)
    share = 100 * sum(background) / (width * height)
    print(f"matte: {share:.1f}% of the frame removed as background")
    return cutout


def main() -> None:
    cutout = build()
    PUBLIC.mkdir(exist_ok=True)

    cutout.save(PUBLIC / f"{STEM}.webp", "WEBP", quality=90, method=6, exact=True)
    print(f"wrote {STEM}.webp ({cutout.width}w)")

    for target in WIDTHS:
        resized = cutout.resize(
            (target, round(cutout.height * target / cutout.width)), Image.LANCZOS
        )
        resized.save(PUBLIC / f"{STEM}-{target}.webp", "WEBP", quality=88, method=6, exact=True)
        print(f"wrote {STEM}-{target}.webp ({target}w)")


if __name__ == "__main__":
    main()
