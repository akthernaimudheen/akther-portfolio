/**
 * The production origin, kept in a module with no imports of its own.
 *
 * `vite.config.ts` reads this at build time to emit sitemap.xml and robots.txt,
 * and it is bundled by esbuild without the `@/` alias — so anything this file
 * imported would fail to resolve there. Keeping it dependency-free is what lets
 * the app and the build share one source of truth for the domain.
 *
 * The apex is primary; www redirects to it permanently at the edge. No trailing
 * slash. An empty string switches every canonical, og:url and sitemap entry off
 * rather than pointing them at a domain that does not exist.
 */
export const SITE_URL = 'https://akthernaimudheen.in';

/** Routes that belong in the sitemap. Project pages are appended at build time. */
export const STATIC_ROUTES = ['/', '/about', '/work', '/contact'] as const;
