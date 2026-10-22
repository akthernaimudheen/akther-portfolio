import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { projects } from './src/data/projects.ts';
import { articles } from './src/data/articles.ts';
import { SITE_URL, STATIC_ROUTES } from './src/lib/site.ts';

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

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
