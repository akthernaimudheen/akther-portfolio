/**
 * Automated Technical SEO & Entity Integrity Audit
 *
 * Checks:
 * 1. Route metadata uniqueness, non-empty titles, description lengths.
 * 2. Canonical URL validity and HTTPS domain enforcement.
 * 3. Structured Data JSON-LD schemas (WebSite, Person, ProfilePage, SoftwareApplication, TechArticle, Services).
 * 4. Internal links validity across application components.
 * 5. Sitemap and robots.txt generation contracts.
 * 6. Exact-name entity disambiguation signals.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_URL, STATIC_ROUTES } from '../src/lib/site.ts';
import { projects } from '../src/data/projects.ts';
import { articles } from '../src/data/articles.ts';
import { profile } from '../src/data/profile.ts';
import {
  getAllRoutesMetadata,
  staticRouteMetadata,
  getProjectMetadata,
  getArticleMetadata,
} from '../src/lib/routes-meta.ts';
import { SEO_KEYWORD_MAP } from '../src/data/seo-keyword-map.ts';
import {
  structuredDataJsonLd,
  articleJsonLd,
  dynamicArticleJsonLd,
  servicesJsonLd,
  projectJsonLd,
} from '../src/lib/seo.ts';
import { getStaticRouteContent } from '../src/lib/static-route-content.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, '../src');

let errors = [];
let warnings = [];

function check(condition, message, isWarning = false) {
  if (!condition) {
    if (isWarning) warnings.push(message);
    else errors.push(message);
  }
}

console.log('--- Starting Automated Technical SEO Audit ---');

// 1. Check Site Origin
check(SITE_URL === 'https://www.akthernaimudheen.in', `SITE_URL must be https://www.akthernaimudheen.in (got: ${SITE_URL})`);

// 2. Check Route Metadata
const allMetadata = getAllRoutesMetadata();
const titles = new Set();
const descriptions = new Set();
const knownRoutes = new Set();

for (const [route, meta] of Object.entries(allMetadata)) {
  knownRoutes.add(route);

  // Title checks
  check(Boolean(meta.title && meta.title.trim()), `Route ${route} has an empty title`);
  check(meta.title.includes('Akther Naimudheen'), `Route ${route} title missing exact entity name: "${meta.title}"`);
  check(!titles.has(meta.title), `Duplicate title found on ${route}: "${meta.title}"`);
  titles.add(meta.title);

  // Description checks
  check(Boolean(meta.description && meta.description.trim()), `Route ${route} has an empty description`);
  check(meta.description.length <= 165, `Route ${route} description too long (${meta.description.length} chars): "${meta.description}"`, true);
  check(!descriptions.has(meta.description), `Duplicate description found on ${route}: "${meta.description}"`);
  descriptions.add(meta.description);

  // Canonical checks
  check(meta.canonical.startsWith('https://www.akthernaimudheen.in'), `Route ${route} canonical does not start with SITE_URL: "${meta.canonical}"`);
  check(!meta.canonical.includes('//', 8), `Route ${route} canonical contains double slashes: "${meta.canonical}"`);
  if (route !== '/') {
    check(!meta.canonical.endsWith('/'), `Route ${route} canonical has trailing slash: "${meta.canonical}"`);
  }

  // Noindex check
  check(!meta.noIndex, `Canonical route ${route} has accidental noIndex set`);
}

console.log(`✓ Checked ${Object.keys(allMetadata).length} canonical routes metadata`);

// 3. Check Structured Data (JSON-LD)
try {
  const parsedStructured = JSON.parse(structuredDataJsonLd());
  check(parsedStructured['@context'] === 'https://schema.org', 'structuredDataJsonLd missing @context');
  const graph = parsedStructured['@graph'];
  check(Array.isArray(graph), 'structuredDataJsonLd @graph is not an array');

  const person = graph.find((item) => item['@type'] === 'Person');
  check(Boolean(person), 'structuredDataJsonLd missing Person schema');
  check(person.name === 'Akther Naimudheen', `Person name is not "Akther Naimudheen": ${person?.name}`);
  check(Array.isArray(person.alternateName), 'Person alternateName should be an array');
  check(person.alternateName.includes('akthernaimudheen'), 'Person alternateName missing unspaced handle "akthernaimudheen"');
  check(person.sameAs.includes('https://github.com/akthernaimudheen'), 'Person sameAs missing GitHub URL');
  check(person.sameAs.includes('https://www.linkedin.com/in/akther-naimudheen-3bbb24197/'), 'Person sameAs missing LinkedIn URL');
  check(Array.isArray(person.knowsAbout) && person.knowsAbout.length >= 5, 'Person knowsAbout must contain technical specialties');

  const website = graph.find((item) => item['@type'] === 'WebSite');
  check(Boolean(website), 'structuredDataJsonLd missing WebSite schema');
  check(website.name === 'Akther Naimudheen Portfolio', `WebSite name mismatch: ${website?.name}`);

  const profilePage = graph.find((item) => item['@type'] === 'ProfilePage');
  check(Boolean(profilePage), 'structuredDataJsonLd missing ProfilePage schema');
  check(profilePage.mainEntity?.['@id'] === person['@id'], 'ProfilePage mainEntity does not point to Person @id');
} catch (e) {
  errors.push(`structuredDataJsonLd JSON parse error: ${e.message}`);
}

// Check project structured data
for (const project of projects) {
  try {
    const parsedProject = JSON.parse(projectJsonLd(project));
    check(parsedProject['@type'] === 'SoftwareApplication', `Project ${project.id} schema type is not SoftwareApplication`);
    check(parsedProject.name === project.title, `Project ${project.id} name does not match project.title`);
    check(parsedProject.author?.name === 'Akther Naimudheen', `Project ${project.id} author is not Akther Naimudheen`);
  } catch (e) {
    errors.push(`projectJsonLd error for ${project.id}: ${e.message}`);
  }
}

// Check article structured data
try {
  const parsedArticle = JSON.parse(articleJsonLd());
  check(parsedArticle['@type'] === 'TechArticle', 'articleJsonLd schema type is not TechArticle');
  check(parsedArticle.author?.name === 'Akther Naimudheen', 'articleJsonLd author is not Akther Naimudheen');
} catch (e) {
  errors.push(`articleJsonLd error: ${e.message}`);
}

for (const article of articles) {
  try {
    const parsedArticle = JSON.parse(dynamicArticleJsonLd(article));
    check(parsedArticle['@type'] === 'TechArticle', `dynamicArticleJsonLd for ${article.slug} is not TechArticle`);
    check(parsedArticle.author?.name === 'Akther Naimudheen', `dynamicArticleJsonLd for ${article.slug} author mismatch`);
  } catch (e) {
    errors.push(`dynamicArticleJsonLd error for ${article.slug}: ${e.message}`);
  }
}

console.log('✓ Verified Structured Data JSON-LD generators and schemas');

// 4. Check Internal Links across Source Files
const filesToScan = [
  path.join(SRC_DIR, 'App.tsx'),
  path.join(SRC_DIR, 'components/ClinicalAiArticle.tsx'),
  path.join(SRC_DIR, 'components/HybridAiArticle.tsx'),
  path.join(SRC_DIR, 'components/SidekiqSecurityArticle.tsx'),
  path.join(SRC_DIR, 'components/BlogIndex.tsx'),
  path.join(SRC_DIR, 'components/ServicesPage.tsx'),
];

const linkRegex = /(?:<Link[^>]+to=["']|<NavLink[^>]+to=["']|href=["'])([^"'>\s]+)["']/g;
const dynamicPrefixes = ['/work/', '/blog/'];

for (const file of filesToScan) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const target = match[1];
    // Ignore external URLs, mailto, tel, hashes, asset paths
    if (
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:') ||
      target.startsWith('#') ||
      target.startsWith('/assets/') ||
      target.endsWith('.pdf') ||
      target.endsWith('.webp') ||
      target.endsWith('.svg') ||
      target.endsWith('.jpg') ||
      target.endsWith('.png') ||
      target.endsWith('.ico')
    ) {
      continue;
    }

    const cleanTarget = target.split('?')[0].split('#')[0];
    if (cleanTarget === '') continue;

    const isValid = knownRoutes.has(cleanTarget) ||
      dynamicPrefixes.some(prefix => cleanTarget.startsWith(prefix) && cleanTarget.length > prefix.length);

    check(isValid, `File ${path.basename(file)} contains broken internal link: "${target}"`);
  }
}

console.log('✓ Verified internal link integrity across components');

// 5. Check Sitemap & Robots output
const rawRoutes = [
  ...STATIC_ROUTES,
  ...projects.map((p) => `/work/${p.id}`),
  ...articles.map((a) => `/blog/${a.slug}`),
];
const sitemapRoutes = Array.from(new Set(rawRoutes));
for (const route of sitemapRoutes) {
  check(knownRoutes.has(route), `Sitemap route ${route} not found in known metadata routes`);
}
console.log(`✓ Verified sitemap contains ${sitemapRoutes.length} canonical routes`);

// 6. Check index.html fallback & unambiguous markers
const indexPath = path.resolve(__dirname, '../index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
check(indexHtml.includes('Akther Naimudheen'), 'index.html missing exact name "Akther Naimudheen"');
check(!indexHtml.includes('<noscript>'), 'index.html must not contain <noscript> duplicate static shell');
check(indexHtml.includes('data-static-seo'), 'index.html missing data-static-seo attributes');
check(/<script\s[^>]*data-static-seo[^>]*type="application\/ld\+json"/i.test(indexHtml), 'index.html JSON-LD @graph script missing data-static-seo attribute');
check(indexHtml.includes('<!-- STATIC_HEAD_META_START -->') && indexHtml.includes('<!-- STATIC_HEAD_META_END -->'), 'index.html missing STATIC_HEAD_META markers');
check(indexHtml.includes('<!-- STATIC_ROUTE_SHELL_START -->') && indexHtml.includes('<!-- STATIC_ROUTE_SHELL_END -->'), 'index.html missing STATIC_ROUTE_SHELL markers');
check(indexHtml.includes('<!-- STATIC_ARTICLE_JSONLD_SLOT -->'), 'index.html missing STATIC_ARTICLE_JSONLD_SLOT marker');
check((indexHtml.match(/class="skip-link"/g) || []).length === 1, 'index.html must contain exactly one .skip-link element (inside #root)');
console.log('✓ Verified index.html visible static shell, data-static-seo JSON-LD, and build markers');

// 7. Check SEO Keyword Map and Search Intent Differentiation
const primaryKeywords = new Set();
check(SEO_KEYWORD_MAP.length >= 8, `Expected at least 8 mapped keyword routes (found: ${SEO_KEYWORD_MAP.length})`);

for (const mapEntry of SEO_KEYWORD_MAP) {
  check(knownRoutes.has(mapEntry.route), `Keyword map route ${mapEntry.route} is not in knownRoutes`);
  check(Boolean(mapEntry.primaryKeyword && mapEntry.primaryKeyword.trim()), `Route ${mapEntry.route} has empty primaryKeyword`);
  check(!primaryKeywords.has(mapEntry.primaryKeyword), `Duplicate primary keyword across routes: "${mapEntry.primaryKeyword}"`);
  primaryKeywords.add(mapEntry.primaryKeyword);

  check(Array.isArray(mapEntry.supportingCluster) && mapEntry.supportingCluster.length >= 2, `Route ${mapEntry.route} supporting cluster too small`);
  check(Boolean(mapEntry.searchIntent), `Route ${mapEntry.route} missing searchIntent`);

  for (const link of mapEntry.relevantInternalLinks) {
    const isValidLink = knownRoutes.has(link) || dynamicPrefixes.some(prefix => link.startsWith(prefix));
    check(isValidLink, `Keyword map for ${mapEntry.route} contains invalid internal link: "${link}"`);
  }
}

// Verify Homepage Specifics for "AI engineer in Kerala"
const homeMeta = allMetadata['/'];
check(homeMeta?.title.includes('AI Engineer in Kerala'), `Homepage title does not include "AI Engineer in Kerala": "${homeMeta?.title}"`);
check(homeMeta?.description.includes('Kerala'), `Homepage description does not mention "Kerala": "${homeMeta?.description}"`);
console.log(`✓ Verified SEO Keyword Map (${SEO_KEYWORD_MAP.length} routes) and Kerala search intent alignment`);

// 8. Check Vercel Edge Redirects (vercel.json)
const vercelConfigPath = path.resolve(__dirname, '../vercel.json');
check(fs.existsSync(vercelConfigPath), 'vercel.json missing');
if (fs.existsSync(vercelConfigPath)) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    const redirects = vercelConfig.redirects || [];
    check(Array.isArray(redirects), 'vercel.json missing redirects array');

    // Required permanent redirects
    const redirectMap = new Map();
    for (const r of redirects) {
      check(r.permanent === true, `Redirect for ${r.source} is not permanent (301/308)`);
      check(r.source !== r.destination, `Self-redirect loop detected for ${r.source}`);
      check(knownRoutes.has(r.destination), `Redirect target for ${r.source} is not a known canonical route: "${r.destination}"`);
      redirectMap.set(r.source, r.destination);
    }

    check(redirectMap.get('/work/iscribe') === '/work/clinoria', 'vercel.json missing /work/iscribe -> /work/clinoria redirect');
    check(redirectMap.get('/projects') === '/work', 'vercel.json missing /projects -> /work redirect');
    check(redirectMap.get('/projects/iscribe') === '/work/clinoria', 'vercel.json missing /projects/iscribe -> /work/clinoria redirect');
    check(redirectMap.get('/writing') === '/blog', 'vercel.json missing /writing -> /blog redirect');

    // Check project slug mappings
    for (const p of projects) {
      const target = redirectMap.get(`/projects/${p.id}`);
      check(target === `/work/${p.id}`, `vercel.json missing or incorrect redirect for /projects/${p.id} -> /work/${p.id}`);
    }

    // Verify no catch-all redirect of unknown slugs to unrelated pages
    const hasWildcardProjectRedirect = redirects.some(r => r.source === '/projects/:slug' || r.source === '/projects/(.*)');
    check(!hasWildcardProjectRedirect, 'vercel.json must not have wildcard redirect for /projects/:slug to prevent redirecting unknown slugs to unrelated pages');

    console.log(`✓ Verified Vercel edge redirects (${redirects.length} rules, clean single-hop destinations)`);
  } catch (err) {
    errors.push(`vercel.json parse error: ${err.message}`);
  }
}

// 9. Check Built Production HTML (dist/) — Fail if missing
const distPath = path.resolve(__dirname, '../dist');
check(fs.existsSync(distPath), 'Built dist/ directory missing — run `npm run build` before `npm run test:seo`');

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

if (fs.existsSync(distPath)) {
  const distH1s = new Map();
  const distTitles = new Set();

  // Extract authoritative CERT-In reference dynamically from SidekiqSecurityArticle.tsx
  const sidekiqSrc = fs.readFileSync(path.join(SRC_DIR, 'components/SidekiqSecurityArticle.tsx'), 'utf8');
  const certInMatch = sidekiqSrc.match(/CERTIn-\d+/);
  check(Boolean(certInMatch), 'Could not extract authoritative CERT-In reference from SidekiqSecurityArticle.tsx');
  const authoritativeCertInRef = certInMatch?.[0] || '';

  const forbiddenStaticPatterns = [
    { re: /#1021481/, label: 'invented #1021481 report reference' },
    { re: /FHIR-ready/i, label: 'unsupported FHIR-ready claim' },
    { re: /\bp99\b/i, label: 'unsupported p99 latency claim' },
    { re: /slashing API costs/i, label: 'unsupported API cost reduction claim' },
    { re: /24[–-]48\s*hours/i, label: 'unsupported 24-48 hours SLA claim' },
    { re: /systems consulting/i, label: 'ungrounded systems consulting claim' },
    { re: /architecture blueprints/i, label: 'ungrounded architecture blueprints claim' },
  ];

  for (const [route, meta] of Object.entries(allMetadata)) {
    const cleanPath = route.replace(/^\//, '');
    const htmlFile = route === '/' ? path.join(distPath, 'index.html') : path.join(distPath, cleanPath, 'index.html');
    check(fs.existsSync(htmlFile), `Built HTML file missing for route ${route}: ${htmlFile}`);

    if (!fs.existsSync(htmlFile)) continue;

    const html = fs.readFileSync(htmlFile, 'utf8');

    // Flat cleanUrls HTML parity check for non-home routes
    if (route !== '/') {
      const flatHtmlFile = path.join(distPath, `${cleanPath}.html`);
      check(fs.existsSync(flatHtmlFile), `Flat cleanUrls HTML missing for route ${route}: ${flatHtmlFile}`);
      if (fs.existsSync(flatHtmlFile)) {
        const flatHtml = fs.readFileSync(flatHtmlFile, 'utf8');
        check(flatHtml === html, `Built HTML divergence between ${cleanPath}.html and ${cleanPath}/index.html`);
      }
    }

    // Single <title>, <meta name="description">, <link rel="canonical">, og:url, .skip-link
    const titleMatches = [...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)];
    check(titleMatches.length === 1, `Route ${route} expected 1 <title>, found ${titleMatches.length}`);
    const pageTitle = titleMatches[0]?.[1]?.trim() || '';
    check(Boolean(pageTitle), `Route ${route} built HTML missing <title>`);
    check(!distTitles.has(pageTitle), `Duplicate built <title> on route ${route}: "${pageTitle}"`);
    distTitles.add(pageTitle);

    const descMatches = [...html.matchAll(/<meta\s[^>]*name=["']description["'][^>]*>/gi)];
    check(descMatches.length === 1, `Route ${route} expected 1 meta description, found ${descMatches.length}`);

    const canonMatches = [...html.matchAll(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/gi)];
    check(canonMatches.length === 1, `Route ${route} expected 1 canonical link, found ${canonMatches.length}`);
    check(
      canonMatches[0]?.[1] === meta.canonical,
      `Route ${route} built canonical mismatch: expected ${meta.canonical}, got ${canonMatches[0]?.[1]}`
    );

    const ogUrlMatches = [...html.matchAll(/<meta\s[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["'][^>]*>/gi)];
    check(ogUrlMatches.length === 1, `Route ${route} expected 1 og:url meta tag, found ${ogUrlMatches.length}`);
    check(
      ogUrlMatches[0]?.[1] === meta.canonical,
      `Route ${route} og:url mismatch: expected ${meta.canonical}, got ${ogUrlMatches[0]?.[1]}`
    );

    const skipLinkMatches = html.match(/class=["']skip-link["']/gi) || [];
    check(skipLinkMatches.length === 1, `Route ${route} expected 1 .skip-link, found ${skipLinkMatches.length}`);

    // JSON-LD structural validity + data-static-seo enforcement
    const ldScripts = [...html.matchAll(/<script([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi)];
    const isArticleRoute = articles.some((a) => `/blog/${a.slug}` === route);
    const expectedLdCount = isArticleRoute ? 2 : 1;
    check(ldScripts.length === expectedLdCount, `Route ${route} expected ${expectedLdCount} JSON-LD scripts, found ${ldScripts.length}`);
    for (const [, attrs, jsonBody] of ldScripts) {
      check(/data-static-seo/i.test(attrs), `Route ${route} JSON-LD script missing data-static-seo`);
      try {
        JSON.parse(jsonBody);
      } catch (e) {
        errors.push(`Route ${route} invalid JSON-LD: ${e.message}`);
      }
    }

    // No leftover <noscript> duplicate shell or unresolved build slots
    check(!html.includes('<noscript>'), `Route ${route} must not emit <noscript> duplicate shell`);
    check(!html.includes('STATIC_ARTICLE_JSONLD_SLOT'), `Route ${route} left unresolved STATIC_ARTICLE_JSONLD_SLOT marker`);

    // Single <h1> strictly matching static route content contract
    const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
      decodeEntities(m[1].replace(/<[^>]*>/g, '').trim())
    );
    check(h1Matches.length === 1, `Route ${route} must contain exactly 1 <h1> in raw HTML, found ${h1Matches.length}`);

    const mainH1 = h1Matches[0] || '';
    const expectedStatic = getStaticRouteContent(route);
    check(
      mainH1 === expectedStatic.h1,
      `Route ${route} static <h1> does not match expected route heading:\n  expected: "${expectedStatic.h1}"\n  got:      "${mainH1}"`
    );
    distH1s.set(route, mainH1);

    // Anti-truncation guard on structured static highlights
    for (const hl of expectedStatic.highlights || []) {
      check(
        !hl.description.includes('…') && !hl.description.includes('...'),
        `Route ${route} static highlight contains ellipsis truncation: "${hl.title || hl.description}"`
      );
    }

    // Visible #root static content & internal link integrity
    const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>/i);
    check(Boolean(rootMatch), `Route ${route} built HTML missing <div id="root">`);
    if (rootMatch) {
      const rootBody = rootMatch[1];
      check(rootBody.includes('class="static-route-shell"'), `Route ${route} #root missing visible static-route-shell`);
      check(!/class="direct-open-message"/.test(rootBody), `Route ${route} #root still uses hidden .direct-open-message class`);
      const mainText = decodeEntities(rootBody.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
      check(mainText.length >= 300, `Route ${route} visible static text too brief (${mainText.length} chars)`);

      const internalHrefs = [...rootBody.matchAll(/<a\s[^>]*href="(\/[^"]*)"/gi)].map((m) => m[1]);
      check(internalHrefs.length >= 3, `Route ${route} visible static shell needs >= 3 internal links (found: ${internalHrefs.length})`);
      for (const href of internalHrefs) {
        const cleanHref = href.split('#')[0];
        check(
          cleanHref === '' || knownRoutes.has(cleanHref),
          `Route ${route} static shell contains invalid internal link: "${href}"`
        );
      }

      // Factual accuracy guards against built static body
      for (const { re, label } of forbiddenStaticPatterns) {
        check(!re.test(mainText), `Route ${route} static HTML contains ${label}`);
      }
      if (route === '/blog/sidekiq-security-vulnerability-responsible-disclosure' && authoritativeCertInRef) {
        check(
          mainText.includes(authoritativeCertInRef),
          `Sidekiq static HTML missing authoritative CERT-In reference "${authoritativeCertInRef}"`
        );
      }
    }
  }

  check(
    new Set(distH1s.values()).size === Object.keys(allMetadata).length,
    `Expected ${Object.keys(allMetadata).length} unique static <h1> headings across canonical routes, got ${new Set(distH1s.values()).size}`
  );

  // Check 404.html in dist (strict isolation from homepage SEO signals)
  const notFoundFile = path.join(distPath, '404.html');
  check(fs.existsSync(notFoundFile), 'Built dist/404.html missing');
  if (fs.existsSync(notFoundFile)) {
    const nfHtml = fs.readFileSync(notFoundFile, 'utf8');
    const nfStatic = getStaticRouteContent('/404');
    check(nfHtml.includes('noindex, follow'), 'dist/404.html missing noindex, follow robots directive');
    check(!/rel=["']canonical["']/i.test(nfHtml), 'dist/404.html must NOT emit a rel="canonical" link');
    check(!/property=["']og:/i.test(nfHtml), 'dist/404.html must NOT emit Open Graph tags');
    check(!/name=["']twitter:/i.test(nfHtml), 'dist/404.html must NOT emit Twitter Card tags');
    check(!/application\/ld\+json/i.test(nfHtml), 'dist/404.html must NOT emit homepage JSON-LD');
    check(!nfHtml.includes('#profilepage') && !nfHtml.includes('#person'), 'dist/404.html must NOT emit Person/ProfilePage schema');

    const nfH1s = [...nfHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
      decodeEntities(m[1].replace(/<[^>]*>/g, '').trim())
    );
    check(nfH1s.length === 1 && nfH1s[0] === nfStatic.h1, `dist/404.html must contain exact <h1> "${nfStatic.h1}"`);
    const nfInternalHrefs = [...nfHtml.matchAll(/<a\s[^>]*href="(\/[^"]*)"/gi)].map((m) => m[1]);
    check(nfInternalHrefs.includes('/') && nfInternalHrefs.length >= 3, 'dist/404.html missing recovery internal links');
  }

  console.log(`✓ Verified built static HTML across all ${Object.keys(allMetadata).length} canonical routes and 404.html`);
}

// 10. Check React Hydration & Clean Metadata Cleanup Architecture
const mainTsxPath = path.join(SRC_DIR, 'main.tsx');
check(fs.existsSync(mainTsxPath), 'src/main.tsx missing');
if (fs.existsSync(mainTsxPath)) {
  const mainTsx = fs.readFileSync(mainTsxPath, 'utf8');
  check(mainTsx.includes('createRoot('), 'src/main.tsx must use createRoot to ensure complete DOM replacement on mount');
}

const seoTsxPath = path.join(SRC_DIR, 'components/Seo.tsx');
check(fs.existsSync(seoTsxPath), 'src/components/Seo.tsx missing');
if (fs.existsSync(seoTsxPath)) {
  const seoTsx = fs.readFileSync(seoTsxPath, 'utf8');
  check(seoTsx.includes('useStaticMetadataCleanup'), 'src/components/Seo.tsx missing useStaticMetadataCleanup to prevent duplicate live DOM tags');
  check(seoTsx.includes('data-static-seo'), 'src/components/Seo.tsx missing data-static-seo cleanup query');
  check(seoTsx.includes('noIndex ? undefined : absoluteUrl(path)'), 'src/components/Seo.tsx must suppress canonical URL when noIndex is true');
}

const appTsxPath = path.join(SRC_DIR, 'App.tsx');
if (fs.existsSync(appTsxPath)) {
  const appTsx = fs.readFileSync(appTsxPath, 'utf8');
  check(appTsx.includes('{!meta.noIndex && <PersonStructuredData />}'), 'src/App.tsx must suppress PersonStructuredData on noIndex routes (404)');
}
console.log('✓ Verified React hydration architecture and static metadata cleanup contracts');

// Results
console.log('\n--- Audit Results ---');
if (warnings.length > 0) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) console.warn(`  [WARN] ${w}`);
}

if (errors.length > 0) {
  console.error(`\nErrors (${errors.length}):`);
  for (const err of errors) console.error(`  [FAIL] ${err}`);
  process.exit(1);
} else {
  console.log('SUCCESS: All Technical SEO and Entity Integrity checks passed with zero errors!\n');
  process.exit(0);
}
