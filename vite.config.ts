import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { projects } from './src/data/projects.ts';
import { articles } from './src/data/articles.ts';
import { SITE_URL, STATIC_ROUTES } from './src/lib/site.ts';
import { getAllRoutesMetadata } from './src/lib/routes-meta.ts';
import { articleJsonLd, dynamicArticleJsonLd } from './src/lib/seo.ts';
import {
  getStaticRouteContent,
  renderStaticRootHtml,
} from './src/lib/static-route-content.ts';

/**
 * Emits sitemap.xml and robots.txt at build time.
 *
 * Both are generated rather than committed so they cannot drift: the project
 * routes come from the same `projects` array the router renders, and the origin
 * from the same `SITE_URL` the canonical tags use. Adding a project to
 * src/data/projects.ts is enough to put it in the sitemap.
 *
 * With no SITE_URL configured neither file is written — a sitemap of relative
 * URLs is invalid, and a robots.txt pointing at a sitemap that does not exist
 * is worse than no robots.txt at all.
 */
function seoFiles(): Plugin {
  return {
    name: 'akther-seo-files',
    apply: 'build',
    generateBundle() {
      if (!SITE_URL) {
        this.warn('SITE_URL is empty — skipping sitemap.xml and robots.txt.');
        return;
      }

      const lastmod = new Date().toISOString().slice(0, 10);
      const rawRoutes = [
        ...STATIC_ROUTES,
        ...projects.map((project) => `/work/${project.id}`),
        ...articles.map((article) => `/blog/${article.slug}`),
      ];
      const routes = Array.from(new Set(rawRoutes));

      const urls = routes
        .map((route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
        .join('\n');

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      });
    },
  };
}

/**
 * Generates per-route index.html files at build time so that Googlebot and
 * other non-JS crawlers receive correct, route-specific metadata when they
 * request any canonical URL directly.
 *
 * Problem: Vercel rewrites every request to /index.html (SPA fallback). The
 * single index.html carries only homepage metadata — so every route returns
 * HTTP 200 but with the same homepage title, description, og:title, og:url,
 * and canonical URL. Google indexes all routes as duplicates of the homepage.
 *
 * Fix: At build time, for every indexable route except /, write a copy of the
 * built index.html into the corresponding output subdirectory (e.g.
 * dist/about/index.html) with the static data-static-seo tags replaced by the
 * route-specific equivalents. Vercel's rewrite rule then serves the correct
 * HTML for each path before JavaScript runs.
 *
 * The React app still mounts and replaces these tags via useStaticMetadataCleanup
 * exactly as before — the only change is that the initial HTML crawlers and
 * social-card scrapers read is now correct per route.
 */
function perRouteHtml(): Plugin {
  let outDir: string;

  return {
    name: 'akther-per-route-html',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      if (!SITE_URL) return;

      const indexPath = path.resolve(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        console.warn('[akther-per-route-html] dist/index.html not found — skipping per-route HTML generation.');
        return;
      }
      const rawIndexTemplate = fs.readFileSync(indexPath, 'utf-8');

      const allMeta = getAllRoutesMetadata();

      const escapeHtml = (str: string) =>
        str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      const HEAD_META_RE = /<!-- STATIC_HEAD_META_START -->[\s\S]*?<!-- STATIC_HEAD_META_END -->/;
      const ROUTE_SHELL_RE = /<!-- STATIC_ROUTE_SHELL_START -->[\s\S]*?<!-- STATIC_ROUTE_SHELL_END -->/;
      const ARTICLE_JSONLD_SLOT = '<!-- STATIC_ARTICLE_JSONLD_SLOT -->';

      const replaceRequired = (
        source: string,
        matcher: RegExp | string,
        replacement: string,
        label: string
      ): string => {
        const found = typeof matcher === 'string' ? source.includes(matcher) : matcher.test(source);
        if (!found) {
          throw new Error(`[akther-per-route-html] Missing required template marker or pattern: ${label}`);
        }
        return source.replace(matcher, replacement);
      };

      // Validate all unambiguous template markers upfront so build fails loudly if index.html drifts.
      replaceRequired(rawIndexTemplate, HEAD_META_RE, '', 'STATIC_HEAD_META_START/END');
      replaceRequired(rawIndexTemplate, ROUTE_SHELL_RE, '', 'STATIC_ROUTE_SHELL_START/END');
      replaceRequired(rawIndexTemplate, ARTICLE_JSONLD_SLOT, '', 'STATIC_ARTICLE_JSONLD_SLOT');

      // 1. Normalize homepage in dist/index.html with route-specific static body content
      const homeContent = getStaticRouteContent('/');
      const updatedIndexHtml = replaceRequired(
        replaceRequired(rawIndexTemplate, ROUTE_SHELL_RE, renderStaticRootHtml(homeContent), 'home route shell'),
        ARTICLE_JSONLD_SLOT,
        '',
        'home article JSON-LD slot'
      );
      fs.writeFileSync(indexPath, updatedIndexHtml, 'utf-8');

      // 2. Generate per-route HTML for all non-home canonical routes
      for (const [route, meta] of Object.entries(allMeta)) {
        if (route === '/') continue;

        const title = escapeHtml(meta.title);
        const description = escapeHtml(meta.description);
        const canonical = meta.canonical;
        const ogType = meta.type === 'profile' ? 'profile' : meta.type === 'article' ? 'article' : 'website';

        // Replace all data-static-seo tags in the template with route-specific values.
        let routeHtml = rawIndexTemplate
          .replace(/(<title data-static-seo>)[^<]*(<\/title>)/, `$1${title}$2`)
          .replace(/(<meta\s[^>]*data-static-seo[^>]*name="description"[^>]*content=")[^"]*(")/, `$1${description}$2`)
          .replace(/(<meta\s[^>]*name="description"\s[^>]*data-static-seo[^>]*content=")[^"]*(")/, `$1${description}$2`)
          .replace(/(<meta\s[^>]*data-static-seo[^>]*property="og:title"[^>]*content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(<meta\s[^>]*property="og:title"\s[^>]*data-static-seo[^>]*content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(<meta\s[^>]*data-static-seo[^>]*property="og:description"[^>]*content=")[^"]*(")/, `$1${description}$2`)
          .replace(/(<meta\s[^>]*property="og:description"\s[^>]*data-static-seo[^>]*content=")[^"]*(")/, `$1${description}$2`)
          .replace(/(<meta\s[^>]*data-static-seo[^>]*property="og:url"[^>]*content=")[^"]*(")/, `$1${canonical}$2`)
          .replace(/(<meta\s[^>]*property="og:url"\s[^>]*data-static-seo[^>]*content=")[^"]*(")/, `$1${canonical}$2`)
          .replace(/(<meta\s[^>]*data-static-seo[^>]*property="og:type"[^>]*content=")[^"]*(")/, `$1${ogType}$2`)
          .replace(/(<meta\s[^>]*property="og:type"\s[^>]*data-static-seo[^>]*content=")[^"]*(")/, `$1${ogType}$2`)
          .replace(/(<meta\s[^>]*data-static-seo[^>]*name="twitter:title"[^>]*content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(<meta\s[^>]*name="twitter:title"\s[^>]*data-static-seo[^>]*content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(<meta\s[^>]*data-static-seo[^>]*name="twitter:description"[^>]*content=")[^"]*(")/, `$1${description}$2`)
          .replace(/(<meta\s[^>]*name="twitter:description"\s[^>]*data-static-seo[^>]*content=")[^"]*(")/, `$1${description}$2`)
          .replace(/(<link\s[^>]*data-static-seo[^>]*rel="canonical"[^>]*href=")[^"]*(")/, `$1${canonical}$2`)
          .replace(/(<link\s[^>]*rel="canonical"\s[^>]*data-static-seo[^>]*href=")[^"]*(")/, `$1${canonical}$2`);

        // Inject TechArticle JSON-LD for articles at the dedicated slot, or remove the slot.
        const article = articles.find((a) => `/blog/${a.slug}` === route);
        const articleSlotReplacement = article
          ? `<script data-static-seo type="application/ld+json">\n    ${
              article.slug === 'building-clinical-ai-beyond-transcription'
                ? articleJsonLd()
                : dynamicArticleJsonLd(article)
            }\n    </script>`
          : '';
        routeHtml = replaceRequired(routeHtml, ARTICLE_JSONLD_SLOT, articleSlotReplacement, `${route} article JSON-LD slot`);

        // Inject single canonical visible static body inside #root
        const routeBodyData = getStaticRouteContent(route);
        routeHtml = replaceRequired(routeHtml, ROUTE_SHELL_RE, renderStaticRootHtml(routeBodyData), `${route} route shell`);

        const cleanPath = route.replace(/^\//, '');
        // 1. Write flat .html file for cleanUrls on Vercel and preview servers (e.g. dist/about.html, dist/work/clinoria.html)
        const flatFile = path.resolve(outDir, `${cleanPath}.html`);
        fs.mkdirSync(path.dirname(flatFile), { recursive: true });
        fs.writeFileSync(flatFile, routeHtml, 'utf-8');

        // 2. Write nested index.html for standard directory indexing (e.g. dist/about/index.html, dist/work/clinoria/index.html)
        const routeDir = path.resolve(outDir, cleanPath);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(path.resolve(routeDir, 'index.html'), routeHtml, 'utf-8');
      }

      // 3. Generate static 404.html cleanly stripped of homepage canonical, OG, Twitter, and @graph JSON-LD
      const notFoundData = getStaticRouteContent('/404');
      const notFoundHeadMeta = [
        '<title data-static-seo>Page Not Found — Akther Naimudheen</title>',
        '    <meta data-static-seo name="description" content="The page you are looking for does not exist or has moved." />',
        '    <meta data-static-seo name="robots" content="noindex, follow" />',
      ].join('\n');
      let notFoundHtml = replaceRequired(rawIndexTemplate, HEAD_META_RE, notFoundHeadMeta, '404 head metadata block');
      notFoundHtml = replaceRequired(notFoundHtml, ARTICLE_JSONLD_SLOT, '', '404 article JSON-LD slot');
      notFoundHtml = replaceRequired(notFoundHtml, ROUTE_SHELL_RE, renderStaticRootHtml(notFoundData), '404 route shell');
      fs.writeFileSync(path.resolve(outDir, '404.html'), notFoundHtml, 'utf-8');

      console.log(`[akther-per-route-html] Generated per-route HTML (both flat .html and directory/index.html) for ${Object.keys(allMeta).length - 1} non-home routes, plus 404.html.`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles(), perRouteHtml()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
