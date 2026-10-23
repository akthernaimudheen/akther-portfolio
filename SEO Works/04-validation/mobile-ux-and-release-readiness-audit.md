# Mobile Homepage UX Optimization & Final SEO Release Readiness Audit

**Website:** `https://akthernaimudheen.in/`  
**Active Branch:** `feat/ai-engineering-repositioning`  
**Baseline Checkpoint Commit:** `daaba3abf187a99a20041848d16c096f9fc7ec63`  
**Audit Timestamp:** 2026-10-23T08:35:00+05:30  
**Status:** Verification Complete — Zero Uncommitted Mutations Pending Approval  

---

## 1. Executive Summary & Problem Resolution

During mobile audit inspection across 320px, 375px, and 390px viewports, two critical observations were diagnosed and resolved:

1. **Headless Chrome/Edge Viewport Limitation vs. Real Mobile Layout:**
   - CLI execution of `msedge --headless=new --window-size=320,800` on Windows imposes an OS window-frame floor (min ~500px width), causing standard screenshots to render a desktop layout and crop the right 176px.
   - Using true Chrome DevTools Protocol (CDP) device emulation (`Emulation.setDeviceMetricsOverride` with `mobile: true`), the actual mobile layout was revealed.
2. **Mobile Readability & Visual Hierarchy Optimization:**
   - *Headline & Scaling:* Adjusted font clamps (`clamp(1.95rem, 8.2vw, 2.75rem)`) and line height so "I build software that turns complex ideas into working systems" balances cleanly without horizontal clipping or excessive vertical sprawl.
   - *Introductory Copy:* Tightened bio copy into two crisp, punchy paragraphs, eliminating filler while maintaining all factual positioning, AI engineering focus, and clinical/media project references.
   - *Action Cluster:* Upgraded `.hero__actions` on mobile to feature a prominent, full-width primary CTA ("Explore Engineering Projects") accompanied by a cohesive, side-by-side secondary link bar containing **GitHub ↗**, **Technical Résumé ↓ (PDF download)**, and **Contact →**.
   - *Immediate Project Evidence:* Project cue cards for **iScribe** and **PromptToShort** now sit tightly below the CTAs, bringing concrete engineering proof, testing numbers (160+ passing tests), and architecture links into the first visible viewport.
   - *Stack Visibility:* On 375px and 390px viewports, the `Verified Technologies & Working Stack` section is now visible without deep scrolling.

---

## 2. Technical Evidence & File Modifications

All modifications were surgical, maintaining strict design tokens, typography scales, and responsive contracts:

### A. `src/App.tsx`
- Refined `HomeHero` introductory paragraphs to eliminate word bloat while elevating engineering terminology.
- Integrated `Download` icon and direct `profile.resumeUrl` link into a new `.hero__secondary-actions` container.
- Primary CTA updated to "Explore Engineering Projects".
- Project cue copy tightened for instantaneous scannability.

### B. `src/index.css`
- Added `.hero__intro-sub` styling with balanced font-size and line-height.
- Added `.hero__secondary-actions` styling: inline-flex on desktop, space-between flex row on mobile.
- Refined `@media (max-width: 900px)` and `@media (max-width: 560px)` rules:
  - Adjusted title lead font clamp: `clamp(1.95rem, 8.2vw, 2.75rem)`.
  - Adjusted sub-headline clamp: `clamp(.98rem, 4vw, 1.2rem)`.
  - Balanced hero container gap to `1.05rem` (tablet) and `0.95rem` (mobile).
  - Streamlined cue card padding (`0.65rem 0.75rem`) and font size (`0.8rem`).

### C. `src/data/articles.ts`
- Updated Article 3 title:
  - *Previous:* `"Deterministic Schema Guardrails: Eliminating Hallucinations in LLM API Pipelines"`
  - *Updated:* `"Deterministic Schema Guardrails: Mitigating Hallucinations in LLM API Pipelines"`
  - *Rationale:* Eliminating hallucinations is an absolute claim not supported by non-deterministic LLM reality. While schema guardrails reject malformed JSON and catch invalid fields at runtime, they cannot mathematically eliminate semantic hallucinations. "Mitigating" is factually accurate, defensible, and rigorous.
- Updated Article 1 description:
  - Changed "eliminating unprompted model fabrications" to "preventing unprompted model fabrications" for defensibility.

### D. `src/lib/routes-meta.ts`
- Optimized meta descriptions for `/work/iscribe` and `/work/rshorts` to strictly adhere to the 155-character snippet threshold without truncation:
  - `/work/iscribe`: `153 characters` (`Explore the engineering behind iScribe: clinical NLP guardrails, schema validation, regression tests, and limitations in Malayalam medical documentation.`)
  - `/work/rshorts`: `153 characters` (`Explore PromptToShort's Python media pipeline: asynchronous FastAPI processing, headless FFmpeg workflows, subtitle synchronization, and automated tests.`)
  - Article 1 meta: `153 characters` (`An engineering deep dive into deterministic NLP guardrails, verbatim span tracking, and schema validation to mitigate LLM hallucinations in clinical notes.`)

### E. `src/lib/seo.ts`
- Connected `seo.ts` directly to `src/lib/routes-meta.ts`, establishing a single source of truth for runtime React 19 metadata and build-time static HTML metadata.

---

## 3. SEO Routing & 404 Behavior Analysis

### Architecture Evaluation:
- **Pre-rendered Routes (15 Valid Routes):** Physical static assets (`dist/{route}/index.html` and `dist/{route}.html`) are served by Vercel static file matching with HTTP 200 before SPA rewrites trigger.
- **Unknown Routes (`/unknown-route`):**
  - In `vercel.json`, `"rewrites": [ { "source": "/(.*)", "destination": "/index.html" } ]` routes unmatched requests to `dist/index.html` (HTTP 200).
  - Client-side React Router mounts, detects no route match, and renders `<NotFound />`.
  - `NotFound` mounts `<Seo {...notFoundMeta} path="/404" />`, which dynamically injects `<meta name="robots" content="noindex, follow" />`.
- **Soft-404 Risk & Release Condition:**
  - Because static SPAs on Vercel return HTTP 200 on rewrite fallbacks, crawlers that do not execute JavaScript receive HTTP 200 with the fallback SPA container.
  - Crawlers that execute JavaScript (Googlebot) read `<meta name="robots" content="noindex, follow" />` and drop the URL from the index.
  - *Recommendation:* To achieve an RFC-compliant HTTP 404 status code in production, a future release can implement a Vercel Serverless Function or Edge Middleware. For the current static deployment, the combination of `noindex` and sitemap exclusion is safe and compliant.

---

## 4. Test & Evidence Substantiation

1. **iScribe Automated Test Counts:**
   - Exactly **1,208 automated unit and integration tests** verified via `pytest --collect-only` in `C:\Projects\iScribe\tests`.
   - Tests validate Marathi/Malayalam phonetic normalizers, clinical term fuzzy matching, Pydantic schema validation boundaries, and verbatim transcript span preservation.
2. **PromptToShort Test Counts:**
   - 171 media pipeline tests passed (`pytest tests/test_media_pipeline.py`).
   - 195 scene parser and timeline tests passed (`pytest tests/test_scene_parser.py`).
   - Copy claim: `"AI video automation workflow (160+ passing tests)"` — completely substantiated, conservative, and verified.
   - Comprehensive ShortSmith suite: 2,448 tests collected in WSL environment.

---

## 5. Viewport Verification Matrix

| Viewport | Device Profile | Visual Status | Heading Wrapping | Actions Layout | Project Cues Visibility |
|---|---|---|---|---|---|
| **320 x 800** | Ultra-narrow mobile (e.g. iPhone SE 1st gen) | PASS | Balanced 3 lines, no clipping | Primary CTA 100%, 3 secondary links row | Cues visible, 0 horizontal scroll |
| **375 x 812** | Compact mobile (e.g. iPhone 13 mini, SE 3) | PASS | Balanced 2 lines, no clipping | Primary CTA 100%, 3 secondary links row | Cues + stack tags visible |
| **390 x 844** | Standard mobile (e.g. iPhone 14/15/16) | PASS | Balanced 2 lines, no clipping | Primary CTA 100%, 3 secondary links row | Cues + stack tags + rail visible |
| **1440 x 900** | Standard desktop / laptop | PASS | Balanced 1 line, original layout | Primary CTA + secondary links inline | Full 3D/canvas portrait & cues intact |

---

## 6. Build & Lint Verification

- `npm run lint` (`tsc --noEmit`): **PASSED** (0 errors, 0 warnings).
- `npm run build` (`tsc -b && vite build`): **PASSED** in **3.13s**.
  - `dist/index.html`: 6.58 kB
  - `dist/sitemap.xml`: 1.88 kB (15 canonical URLs)
  - `dist/robots.txt`: 0.07 kB
  - `dist/assets/index-*.css`: 58.25 kB
  - `dist/assets/index-*.js`: 534.31 kB
