# Akther V N Portfolio

A responsive React portfolio for Akther V N's web development, SEO and digital marketing work.

## Open locally on Windows

Double-click `Start Portfolio.cmd`. Keep the launcher window open while viewing the site.

## Development

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Production check:

```bash
pnpm lint
pnpm build
pnpm preview
```

## Design system

- Exaggerated minimalism: paper white `#F7F5EF`, ink black `#0A0A0A`, one signal
  yellow `#FFD21F`, muted text `#595959` and hairline rules at
  `rgba(10,10,10,.18)`. Every colour on the site is one of these, or derived
  from them in `:root`.
- Bricolage Grotesque carries display headings; Archivo carries navigation, body
  copy and interface labels. Body measure is capped at 62ch.
- Yellow is used as one focal field per page, behind the portrait, never as a
  second accent competing with the type.
- Image-first editorial layouts: staggered project spreads instead of repeated
  rounded cards.
- Two meaningful movements per viewport at most; page transitions stay under
  350ms and everything collapses under `prefers-reduced-motion`.
- Every route closes on the same ink-black footer, so the site ends rather than
  stops. Focus rings switch from ink to signal yellow on dark grounds.

The homepage hero is gaze-led: the side-profile cutout faces right, so the back
of the head sits toward the left edge and the headline takes the open space in
front of it. `--portrait-ratio` in `:root` carries the cutout's intrinsic ratio
so `object-fit: contain` fills its box exactly, and the yellow disc is sized
from the figure's *height* -- it therefore always clears the header and the rail
whatever the viewport is.

## Pointer interaction

`src/lib/pointer.ts` is the single pointer source: one `requestAnimationFrame`
loop, spring-smoothed, that parks itself the moment it settles, so an idle page
runs no animation frames. Nothing writes React state on `pointermove`.

- `CursorFollower` draws a decorative ink dot and a 34px outline ring. The native
  system cursor is never hidden, both elements are `aria-hidden` and
  `pointer-events: none`, and they mount only when `(pointer: fine)` matches and
  reduced motion is not requested.
- `usePointerDrift` moves the hero's yellow field, portrait and headline layers
  a few pixels at different depths.
- `mix-blend-mode: difference` is switched on only inside `[data-cursor-invert]`
  regions, where the backdrop is dark enough for the result to be predictable.

## Content integrity

- Employment, education and project claims come from supplied portfolio and resume material.
- SeaKing Restaurant results are labeled as collaborative project-reported figures.
- Technical experiments remain separate from completed client work.
- Empty case-study sections stay hidden until verified content is supplied.

## Assets

Portrait and project images are served as responsive WebP files from `public/`.
Their source files live in `assets-src/`.

- `scripts/convert-project-images.py` regenerates the project and portrait
  variants.
- `scripts/build-portrait-cutout.py` derives the transparent hero cutout from
  the original front portrait. It is tuned to that photograph's studio
  background and must not be pointed at any other image.
- `scripts/build-side-profile-variants.py` prepares the hero's side-profile
  cutout. It removes no background, flips nothing and never upscales, and no RGB
  channel is touched. It does two things to the alpha channel: makes the subject
  fully opaque (the supplied file was matted with the photograph's own
  luminance, so the black shirt was its most transparent region) and trims the
  transparent margin so the silhouette anchors to its box.

Replace `public/Akther-V-N-Resume.pdf` with the same filename when updating the public resume.

Set the production origin in `src/lib/seo.ts` before deployment so canonical and social metadata use the correct domain.
