# Post-Change Route-Level HTML Verification

**Test Target:** Output directory (`dist/`) and local Vite preview server (`http://localhost:4173`)  
**Test Method:** Automated HTTP and filesystem probes across all 15 indexable routes  
**Verification Level:** [Verified by local test]  
**Test Date:** 2026-10-22  

---

## 1. Automated HTML Inspection Protocol

Each generated route file in `dist/` is audited against the following criteria:
1. **Self-Referencing Canonical:** `<link rel="canonical" href="https://www.akthernaimudheen.in{route}" />`
2. **Route-Specific Title:** `<title>{Expected Route Title}</title>`
3. **Route-Specific Meta Description:** `<meta name="description" content="{Expected Description}" />`
4. **Open Graph Agreement:** `og:url` matches canonical URL exactly.
5. **Single Canonical Tag:** Exactly 1 `<link rel="canonical">` tag exists in the HTML document.
6. **No Accidental Noindex:** No `<meta name="robots" content="noindex">` on indexable pages.

---

## 2. Dual Emission Architecture Verification

To guarantee compatibility with static hosting engines (`cleanUrls: true` / `"trailingSlash": false` in `vercel.json`), each route is emitted in two complementary formats:
1. **Directory Index:** `dist{route}/index.html` (e.g. `dist/work/iscribe/index.html` — served when requesting `/work/iscribe/`).
2. **Clean HTML Asset:** `dist{route}.html` (e.g. `dist/work/iscribe.html` — served when requesting `/work/iscribe`).

---

## 3. Live Preview Server Verification Results (All 15 Routes)

The following results were recorded by executing HTTP GET requests directly against `http://localhost:4173`:

| Route | HTTP Status | Response `<title>` | Response `<link rel="canonical">` | Response `og:url` | Canonical Tags Count | Result |
|---|---|---|---|---|---|---|
| `/` | 200 OK | `Akther Naimudheen \| AI Application Engineer & Software Developer` | `https://www.akthernaimudheen.in/` | `https://www.akthernaimudheen.in/` | 1 | **PASS** |
| `/about` | 200 OK | `About — Akther Naimudheen` | `https://www.akthernaimudheen.in/about` | `https://www.akthernaimudheen.in/about` | 1 | **PASS** |
| `/work` | 200 OK | `Engineering Projects & Case Studies \| Akther Naimudheen` | `https://www.akthernaimudheen.in/work` | `https://www.akthernaimudheen.in/work` | 1 | **PASS** |
| `/contact` | 200 OK | `Contact — Akther Naimudheen` | `https://www.akthernaimudheen.in/contact` | `https://www.akthernaimudheen.in/contact` | 1 | **PASS** |
| `/blog` | 200 OK | `Technical Publication & Engineering Essays — Akther Naimudheen` | `https://www.akthernaimudheen.in/blog` | `https://www.akthernaimudheen.in/blog` | 1 | **PASS** |
| `/services` | 200 OK | `Web Engineering & Search Architecture Services — Akther Naimudheen` | `https://www.akthernaimudheen.in/services` | `https://www.akthernaimudheen.in/services` | 1 | **PASS** |
| `/blog/building-clinical-ai-beyond-transcription` | 200 OK | `Building AI Clinical Documentation Beyond Transcription — Akther Naimudheen` | `https://www.akthernaimudheen.in/blog/building-clinical-ai-beyond-transcription` | `https://www.akthernaimudheen.in/blog/building-clinical-ai-beyond-transcription` | 1 | **PASS** |
| `/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg` | 200 OK | `Architecting Asynchronous Video Processing Pipelines with FastAPI, Task Queues, and Headless FFmpeg — Akther Naimudheen` | `https://www.akthernaimudheen.in/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg` | `https://www.akthernaimudheen.in/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg` | 1 | **PASS** |
| `/blog/deterministic-schema-guardrails-llm-apis` | 200 OK | `Deterministic Schema Guardrails: Eliminating Hallucinations in LLM API Pipelines — Akther Naimudheen` | `https://www.akthernaimudheen.in/blog/deterministic-schema-guardrails-llm-apis` | `https://www.akthernaimudheen.in/blog/deterministic-schema-guardrails-llm-apis` | 1 | **PASS** |
| `/work/iscribe` | 200 OK | `iScribe AI Architecture & Testing \| Akther Naimudheen` | `https://www.akthernaimudheen.in/work/iscribe` | `https://www.akthernaimudheen.in/work/iscribe` | 1 | **PASS** |
| `/work/rshorts` | 200 OK | `PromptToShort: Python Media Pipeline \| Akther Naimudheen` | `https://www.akthernaimudheen.in/work/rshorts` | `https://www.akthernaimudheen.in/work/rshorts` | 1 | **PASS** |
| `/work/website-projects` | 200 OK | `Frontend Systems & Web Architecture — Akther Naimudheen` | `https://www.akthernaimudheen.in/work/website-projects` | `https://www.akthernaimudheen.in/work/website-projects` | 1 | **PASS** |
| `/work/technical-lab` | 200 OK | `Technical Systems Exploration — Akther Naimudheen` | `https://www.akthernaimudheen.in/work/technical-lab` | `https://www.akthernaimudheen.in/work/technical-lab` | 1 | **PASS** |
| `/work/seaking-restaurant` | 200 OK | `SeaKing Restaurant — Akther Naimudheen` | `https://www.akthernaimudheen.in/work/seaking-restaurant` | `https://www.akthernaimudheen.in/work/seaking-restaurant` | 1 | **PASS** |
| `/work/seaking-suites` | 200 OK | `SeaKing Suites — Akther Naimudheen` | `https://www.akthernaimudheen.in/work/seaking-suites` | `https://www.akthernaimudheen.in/work/seaking-suites` | 1 | **PASS** |

**Summary Result:** 15 out of 15 routes passed all technical SEO assertions. Zero canonical drift between initial HTTP response and hydrated DOM.
