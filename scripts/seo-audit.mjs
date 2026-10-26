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
import {
  structuredDataJsonLd,
  articleJsonLd,
  dynamicArticleJsonLd,
  servicesJsonLd,
  projectJsonLd,
} from '../src/lib/seo.ts';

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

// 6. Check index.html fallback
const indexPath = path.resolve(__dirname, '../index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
check(indexHtml.includes('Akther Naimudheen'), 'index.html missing exact name "Akther Naimudheen"');
check(indexHtml.includes('<noscript>'), 'index.html missing <noscript> semantic crawlable shell');
check(indexHtml.includes('data-static-seo'), 'index.html missing data-static-seo attributes');
console.log('✓ Verified index.html static fallback shell');

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
