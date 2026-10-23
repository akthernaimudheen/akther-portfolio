# Canonical URLs & Metadata Architecture Audit

**Status:** [Verified by local test] & [Verified in code]  
**Priority:** P0 Technical SEO Defect  
**Affects:** All non-root public routes (`/work`, `/work/iscribe`, `/work/rshorts`, `/about`, `/contact`, `/blog`, `/services`, etc.)  

---

## 1. The Core Defect: Raw HTML vs. Client-Rendered DOM Mismatch

An empirical test was conducted by fetching raw server responses across live production routes (`https://www.akthernaimudheen.in/*`) and local preview builds.

### Empirical Evidence (Live HTTP Probes)
When requesting any sub-page via HTTP without executing JavaScript (e.g., via `curl` or search bot crawler):

```text
GET /work/iscribe HTTP/2
Host: www.akthernaimudheen.in

HTTP/2 200 OK
content-type: text/html; charset=utf-8

<head>
  ...
  <title data-static-seo>Akther Naimudheen | Software Developer &amp; AI Application Engineer</title>
  <meta data-static-seo name="description" content="Software engineering projects, applied AI systems, technical architecture writing, and web development services by Akther Naimudheen." />
  <link data-static-seo rel="canonical" href="https://www.akthernaimudheen.in/" />
  ...
</head>
```

### The Root Cause
1. **Single SPA Shell:** The Vite build historically output only a single HTML file: `dist/index.html`.
2. **Hosting Rewrite:** `vercel.json` configured a wildcard rewrite rule:
   ```json
   "rewrites": [
     { "source": "/(.*)", "destination": "/index.html" }
   ]
   ```
3. Because no static file existed at `dist/work/iscribe/index.html`, Vercel rewrote every request to `dist/index.html`.
4. `dist/index.html` contained hardcoded static fallback tags pointing to the **homepage**:
   `<link data-static-seo rel="canonical" href="https://www.akthernaimudheen.in/" />`.
5. **Client-Side Correction:** When JavaScript loaded, `src/components/Seo.tsx` executed, removed `[data-static-seo]`, and hoisted the route-specific canonical (`https://www.akthernaimudheen.in/work/iscribe`).

---

## 2. Why This is a Critical SEO Failure

1. **Googlebot Two-Wave Indexing:**
   - **Wave 1 (Instant):** Googlebot crawls the raw HTML, parses metadata, extracts links, and checks canonical tags before queuing for rendering.
   - During Wave 1, Googlebot sees: `"The canonical URL for /work/iscribe is https://www.akthernaimudheen.in/"`. This instructs Google to **ignore the page and collapse it into the homepage**.
   - **Wave 2 (Deferred):** JavaScript rendering may occur days or weeks later. In cases of budget constraints, pages can be permanently de-indexed as duplicates.
2. **Social & Messaging Preview Scrapers:**
   - Platforms like LinkedIn, X (Twitter), Discord, Slack, and WhatsApp do **not execute JavaScript**.
   - Sharing a link to `https://www.akthernaimudheen.in/work/iscribe` rendered the generic homepage preview card instead of the specific clinical AI case study.
3. **Search Engine Confusion:**
   - Sitemaps claimed 15 distinct indexable URLs, but the server served the exact same canonical for all 15 URLs.

---

## 3. Pre-Change vs. Post-Change Route Audit Table

| Route | Pre-Change Raw HTML Canonical | Pre-Change Rendered DOM Canonical | Post-Change Raw HTML Canonical (Target) | Status |
|---|---|---|---|---|
| `/` | `https://www.akthernaimudheen.in/` | `https://www.akthernaimudheen.in/` | `https://www.akthernaimudheen.in/` | Clean |
| `/about` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/about` | `https://www.akthernaimudheen.in/about` | Fixed via Prerender |
| `/work` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/work` | `https://www.akthernaimudheen.in/work` | Fixed via Prerender |
| `/work/iscribe` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/work/iscribe` | `https://www.akthernaimudheen.in/work/iscribe` | Fixed via Prerender |
| `/work/rshorts` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/work/rshorts` | `https://www.akthernaimudheen.in/work/rshorts` | Fixed via Prerender |
| `/work/website-projects` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/work/website-projects` | `https://www.akthernaimudheen.in/work/website-projects` | Fixed via Prerender |
| `/work/technical-lab` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/work/technical-lab` | `https://www.akthernaimudheen.in/work/technical-lab` | Fixed via Prerender |
| `/work/seaking-restaurant` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/work/seaking-restaurant` | `https://www.akthernaimudheen.in/work/seaking-restaurant` | Fixed via Prerender |
| `/work/seaking-suites` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/work/seaking-suites` | `https://www.akthernaimudheen.in/work/seaking-suites` | Fixed via Prerender |
| `/blog` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/blog` | `https://www.akthernaimudheen.in/blog` | Fixed via Prerender |
| `/blog/building-clinical-ai-beyond-transcription` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/blog/building-clinical-ai-beyond-transcription` | `https://www.akthernaimudheen.in/blog/building-clinical-ai-beyond-transcription` | Fixed via Prerender |
| `/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg` | `https://www.akthernaimudheen.in/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg` | Fixed via Prerender |
| `/blog/deterministic-schema-guardrails-llm-apis` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/blog/deterministic-schema-guardrails-llm-apis` | `https://www.akthernaimudheen.in/blog/deterministic-schema-guardrails-llm-apis` | Fixed via Prerender |
| `/services` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/services` | `https://www.akthernaimudheen.in/services` | Fixed via Prerender |
| `/contact` | `https://www.akthernaimudheen.in/` (Error) | `https://www.akthernaimudheen.in/contact` | `https://www.akthernaimudheen.in/contact` | Fixed via Prerender |

---

## 4. Verification of Host & Trailing-Slash Consistency

- **Canonical Origin:** `https://www.akthernaimudheen.in` (Strictly `www`, never apex `https://akthernaimudheen.in`).
- **Trailing Slash Policy:** Strictly `false` (No trailing slash on subpaths: `/work/iscribe`, not `/work/iscribe/`).
- **Protocol:** Strictly `https://`.
- **Open Graph Agreement:** `og:url` matches `canonical` exactly on every route.
