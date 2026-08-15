# Akther V N — 3D Portfolio

A responsive React portfolio that combines Akther's web-development and digital-marketing story with cinematic AI artwork, scroll-responsive depth scenes and a lightweight WebGL fish background.

## Easiest way to open it on Windows

Double-click **`Start Portfolio.cmd`**. Keep the small launcher window open while viewing the site. Close that window or press `Ctrl+C` when finished.

Do not open `index.html` directly. React and WebGL use browser modules that require a local server; the launcher provides that automatically.

## Run locally

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Production check:

```bash
pnpm build
pnpm preview
```

## Technology choices

- React + TypeScript: component structure, typed project data and accessible interactions.
- Vite: fast local development and a production-optimized build.
- Tailwind CSS v4: available through the Vite plugin; the bespoke visual system lives in `src/index.css`.
- React Three Fiber + Three.js: a procedural swimming fish behind the page.
- Drei: lightweight floating motion for the WebGL background.
- Framer Motion: scroll-linked image depth, parallax, section reveals, route transitions, progress feedback and pointer tilt springs.
- Lucide React: consistent accessible interface icons.

The shadcn-compatible component location is `src/components/ui`. The supplied hero pattern was integrated as `src/components/ui/minimalist-hero.tsx`, and shared class merging lives in `src/lib/utils.ts`.

## 3D implementation

### Swimming fish

`src/components/three/FishBackground.tsx` builds a fish entirely from low-complexity Three.js geometry. The body, head, fins, tail and eyes use separate meshes so the tail and pectoral fins can move independently. The root group follows a looping horizontal path while sine waves control vertical drift, roll and fin motion.

Conceptually:

```ts
progress = (startOffset + elapsedTime * swimSpeed) % 1
x = lerp(leftEdge, rightEdge, progress)
y = sin(progress * 2π) * verticalRange
tail.rotation.y = sin(elapsedTime * tailSpeed) * tailAmplitude
```

The canvas is fixed behind the site with `pointer-events: none`, capped device-pixel ratio and low mesh counts. It is lazy-loaded so HTML content appears before WebGL.

### Cinematic project worlds

Each project is a keyboard-accessible HTML article containing an original AI-generated 3D editorial artwork. `src/components/ui/project-visual-scene.tsx` turns each still image into a layered depth scene using independent scroll transforms, moving light, orbital linework, duplicated atmospheric depth and spring-smoothed pointer tilt. Touch devices keep a stable surface, and reduced-motion users receive a still composition.

- SeaKing Restaurant: a glass communication portal for campaigns and local discovery.
- SeaKing Suites: a sculptural hospitality tower with a luminous guest pathway.
- Business Website Systems: connected glass interface layers.
- Technical Exploration Lab: a crystalline computing core inside orbital architecture.

The same visual language appears on the homepage, Work index, About interlude and project detail routes. The real title, summary, tags, controls and results remain semantic HTML rather than being hidden in a canvas.

## Scroll motion system

- The homepage uses a bold black, white and red editorial hero while preserving the original portrait float. On pointer devices, the cutout smoothly zooms and nudges toward the cursor as it approaches; touch and reduced-motion modes remain stable.
- A spring-smoothed progress line tracks the complete page.
- The homepage portrait, glass card and ambient orbs move at different speeds for subtle depth.
- Two oversized discipline lines travel in opposite directions as the page scrolls.
- Selected projects form a sticky editorial card sequence on desktop and a normal vertical stack on mobile.
- Section headings, capability cards, project image worlds and case-study metrics reveal in controlled staggered groups.
- The About timeline draws a colored progress path while each career chapter enters from alternating directions.
- About and Contact use a Vite-compatible animated profile card with floating portrait depth and a working copy-email control.
- The navigation hides while scrolling down and returns immediately when the visitor scrolls up.
- Reduced-motion preferences disable parallax, sticky motion and non-essential animation.

## Content integrity

- Employment, education and project claims come from the supplied portfolio brief and resume.
- SeaKing Restaurant metrics are labeled as project-reported collaborative campaign results.
- Technical experiments are explicitly separated from completed and ongoing work.
- No LinkedIn, GitHub, client, certification or achievement was invented.

## Performance and accessibility

- The WebGL fish bundle is code-split from the initial interface.
- The WebGL fish is not loaded below 900px or when reduced motion is requested; those visitors receive the lightweight gradient atmosphere.
- The fish canvas DPR is capped at 1.45; project art uses lazy image decoding instead of four more WebGL canvases.
- Artwork is lazy-loaded except for the first above-the-fold project visual.
- The site respects `prefers-reduced-motion`; continuous motion stops and CSS animation collapses.
- Navigation, project details and CTAs work with a keyboard.
- Visible focus rings, semantic headings, descriptive alt text and 44px touch targets are included.
- The WebGL canvas is decorative and hidden from assistive technology; AI artwork has descriptive alt text and all important content remains normal HTML.

## Responsive behavior verified

The production build was visually and structurally checked at 390 and 1440 pixels. Mobile navigation, sticky-card fallback, scroll-linked transform changes, project routes, image loading, profile-card interaction, page overflow and browser console errors were tested.

## Replacing the portrait or resume

- Portrait: replace `public/akther-portrait.png` with the same filename.
- Resume: replace `public/Akther-V-N-Resume.pdf` with the same filename.

## Optional next improvements

- Add verified project screenshots to the project detail panels when they are available.
- Add real LinkedIn or GitHub links only after the URLs are supplied.
- Run Lighthouse on the final production host because hosting, caching and compression affect the score.
