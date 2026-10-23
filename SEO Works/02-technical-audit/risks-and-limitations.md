# Technical Risks, Limitations & Constraints

**Status:** [Verified in code] & [Recommendation]  
**Last Updated:** 2026-10-22  

---

## 1. Architectural Risks: Why a Framework Migration Was Rejected

### The Temptation: "Just Migrate to Next.js or Astro"
When facing SPA metadata and crawlability challenges, a common industry reaction is to rewrite the entire project into Next.js, Remix, or Astro for native server-side rendering (SSR).

### Why Migration Was Strictly Rejected for This Project
1. **High Regression Surface:** The portfolio utilizes complex `framer-motion` entrance animations, custom canvas-based cursor and pointer-drift hooks, and fine-tuned UI transitions. Migrating to Next.js App Router frequently triggers hydration mismatches, layout shifts, and React Server Component serialization errors with Framer Motion.
2. **Operational Overhead:** SSR requires Node.js serverless runtimes, cold-start latency management, and increased Vercel invocation costs.
3. **Over-Engineering:** The portfolio has a bounded set of 15 indexable static routes. Dynamic per-request rendering is completely unnecessary when routes change only at build/deployment time.
4. **The Minimal Compatible Alternative:** A build-time Vite static prerendering step generates pre-rendered route entrypoints (`dist/{route}/index.html`) in milliseconds with **zero external dependencies, zero runtime server cost, and zero changes to existing client-side React code**.

---

## 2. Technical Limitations & Access Boundaries

| Limitation | Impact | Mitigation / Status |
|---|---|---|
| **Google Search Console Access Unavailable** | Historical impressions, crawl rate, Google-selected canonicals, and indexing errors cannot be queried programmatically. | Documented a strict manual onboarding protocol for the domain owner (`06-measurement/search-console-checklist.md`). No performance baselines are fabricated. |
| **Sandbox Network Restrictions** | Live Semrush/Ahrefs API metrics are unavailable. | Research is strictly based on direct SERP observation and competitive analysis. Quantitative volume/KD numbers are omitted. |
| **Production Change Freeze** | Agent is strictly barred from deploying to Vercel, merging to `main`, or editing Cloudflare DNS. | All changes are implemented locally on `feat/ai-engineering-repositioning`, validated against local build outputs and preview servers, and packaged for owner review. |

---

## 3. Truth in Advertising & Evaluation Boundaries

To adhere to rigorous engineering standards and avoid misleading claims:

### 1. Clinical AI Boundaries (`/work/iscribe` & `/blog/...`)
- **Limitation:** iScribe is an experimental engineering research system, **not an FDA-cleared or CE-marked medical device**.
- **Evidence Boundary:** The 1,208 automated tests and 0 PHI emission assertions are validated strictly within synthetic test suites and doctor-generated benchmark dialogues. They do not constitute a multi-center randomized clinical trial.
- **Enforcement:** The portfolio copy explicitly identifies iScribe as an "Experimental System" with clearly stated evaluation constraints and architectural trade-offs.

### 2. Automated Media Generation Boundaries (`/work/rshorts`)
- **Limitation:** PromptToShort uses background Celery workers and FFmpeg. Video processing throughput is bounded by available GPU/CPU compute and third-party API rate limits.
- **Enforcement:** The project page clearly distinguishes between the local testing environment, asynchronous queue management, and the public guest demo boundaries.
