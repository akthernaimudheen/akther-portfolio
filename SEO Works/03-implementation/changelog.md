# SEO Implementation & Technical Changelog

**Repository:** `akther-portfolio`  
**Current Branch:** `feat/ai-engineering-repositioning`  
**Tracking Directory:** `SEO Works/`  

---

## [Unreleased / Current Work] — 2026-10-23

### Added
- **Final Reconciliation Audit:** Authored `04-validation/final-reconciliation-report.md` reconciling repository state, route counts, test numbers, and deployment behavior.
- **Mobile UX Optimization & Audit:** Documented findings and viewport verification in `04-validation/mobile-ux-and-release-readiness-audit.md`.
- **Secondary Action Group:** Integrated `Download` icon and direct `profile.resumeUrl` download link into hero action cluster on mobile and desktop.
- **CDP Mobile Emulation Test Harness:** Authored `scratch/capture_clean.js` and `scratch/capture_320.js` using true Chromium DevTools Protocol device metrics emulation.

### Reconciled (Evidence vs. Prior Planning)
- **Static Prerendering vs. SPA Shell:** Clarified that `vite.config.ts` builds a pure Single Page Application (`dist/index.html` with dynamic `sitemap.xml` and `robots.txt`). The previously contemplated `closeBundle()` prerender hook was not applied to `vite.config.ts`. Route-specific metadata is injected by React 19 `Seo.tsx` upon client hydration, with `index.html` serving safe static fallback tags for non-JS link previews.
- **Test Count Verification:** Confirmed that iScribe currently collects **1,268 tests** in `tests/` and **1,384 tests** total; historical Stage 11 snapshot of 1,336 tests is documented in `ClinicalAiArticle.tsx` with explicit distinction between synthetic unit tests and formal clinical safety. Confirmed ShortSmith executes **184 passing media pipeline tests** in WSL (`pytest`), validating the conservative portfolio claim of `"160+ passing tests"`.
- **Queue/Worker Architecture:** Confirmed PromptToShort/ShortSmith utilizes Redis, SQLAlchemy, and a custom Python worker process (`worker.py`) alongside FastAPI. Celery is not used or claimed.

### Changed
- **Mobile Typography & Vertical Rhythm (`src/index.css`):**
  - Refined `.hero__title-lead` font clamp to `clamp(1.95rem, 8.2vw, 2.75rem)` and sub-headline clamp to `clamp(.98rem, 4vw, 1.2rem)`.
  - Balanced container gaps and margins to pull project cues and credibility strip above the fold on mobile.
- **Hero Intro Copy (`src/App.tsx`):** Tightened bio text into two punchy paragraphs emphasizing validation boundaries, automated testing, and dependable API integrations.
- **Primary CTA:** Updated text to `"Explore Engineering Projects"`.
- **Defensible Metadata Claims (`src/data/articles.ts`, `src/lib/routes-meta.ts`):**
  - Updated article 3 title: `"Deterministic Schema Guardrails: Mitigating Hallucinations in LLM API Pipelines"` (replaced unprovable "Eliminating").
  - Optimized meta descriptions for `/work/iscribe` (153 chars) and `/work/rshorts` (153 chars) to stay strictly below the 155-character snippet threshold without truncation.
  - Linked `src/lib/seo.ts` to `src/lib/routes-meta.ts` as a unified single source of truth for runtime React 19 metadata.

---

## [Work in Progress] — 2026-10-22

### Added
- **Permanent SEO Works Archive:** Established full workspace documentation structure inside `/root/projects/shortsmith/SEO Works` and mirrored in `akther-3d-portfolio/SEO Works`.
- **Source PDF Archival:** Preserved original October 2026 keyword research PDFs (`Basic SEO and Career-Keyword Analysis.pdf` and `Evidence-Based SEO Keyword & Competitor Analysis.pdf`) in `01-keyword-strategy/`.
- **Vite Static Prerender Plugin:** Added build-time route entrypoint generator in `vite.config.ts` to output static `index.html` files for all 15 canonical routes in `dist/`.
- **Search Console Protocol:** Authored step-by-step verification and URL inspection protocol in `06-measurement/search-console-checklist.md`.

### Changed
- **Metadata Synchronization (`src/lib/seo.ts`):**
  - Updated `homeMeta.title` to `Akther Naimudheen | AI Application Engineer & Software Developer`.
  - Updated `homeMeta.description` to include Kerala, India location anchor and engineering systems focus.
  - Updated `workMeta.title` to `Engineering Projects & Case Studies | Akther Naimudheen`.
  - Updated `projectMeta` for `iscribe` and `rshorts` to reflect validated Phase 4 titles and descriptions.
- **Vite Build Process:** Extended `seoFiles()` plugin in `vite.config.ts` to perform post-bundle HTML templating, guaranteeing that raw server responses serve self-referencing canonical tags.

### Fixed
- **P0 Canonical Mismatch:** Resolved the critical defect where non-home routes served the homepage canonical URL in raw HTML. All 15 routes now serve their own exact canonical URL in raw HTML.

---

## [Commit `daaba3a`] — 2026-10-22
- **Message:** `chore(seo): synchronize static fallback meta tags and complete Stage 5 release verification`
- **Scope:** Synchronized fallback meta tags in `index.html` to align with Stage 4 homepage title and meta description. Ran full lint and production build checks.

## [Commit `7dd1341`] — 2026-10-22
- **Message:** `feat(home): add selected technical writing and services bridge to homepage narrative (Stage 4)`
- **Scope:** Added technical writing cards and services bridge section to the homepage. Preserved engineering-first visual hierarchy.

## [Commit `5b37993`] — 2026-10-22
- **Message:** `feat(services): implement dedicated client services page and structured data (Stage 3)`
- **Scope:** Implemented `/services` route with schema.org/ItemList and Service structured data. Added contact form prefill integration.
