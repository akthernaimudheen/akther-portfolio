/**
 * The production origin, kept in a module with no imports of its own.
 *
 * `vite.config.ts` reads this at build time to emit sitemap.xml and robots.txt,
 * and it is bundled by esbuild without the `@/` alias — so anything this file
 * imported would fail to resolve there. Keeping it dependency-free is what lets
 * the app and the build share one source of truth for the domain.
 *
 * The production origin is www.akthernaimudheen.in, matching Vercel production
 * domain routing where apex permanently redirects to www. No trailing slash.
 */
export const SITE_URL = 'https://www.akthernaimudheen.in';

/** Routes that belong in the sitemap. Project pages are appended at build time. */
export const STATIC_ROUTES = [
  '/',
  '/about',
  '/work',
  '/contact',
  '/blog',
  '/blog/building-clinical-ai-beyond-transcription',
  '/blog/hybrid-ai-architecture-cpu-guardrails',
  '/services',
] as const;
