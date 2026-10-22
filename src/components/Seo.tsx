import { useEffect } from 'react';
import { profile } from '@/data/profile';
import type { Article } from '@/data/articles';
import {
  absoluteUrl,
  articleJsonLd,
  dynamicArticleJsonLd,
  OG_IMAGE,
  personJsonLd,
  type RouteMeta,
} from '@/lib/seo';

interface SeoProps extends RouteMeta {
  /** Site-relative path for this route, used only when SITE_URL is configured. */
  path: string;
}

/**
 * index.html ships default metadata so link scrapers that never run JavaScript
 * still get a usable preview. React 19 appends its hoisted tags instead of
 * replacing those, which would leave two of every meta tag with the static
 * homepage copy taking precedence on every route. Effects run after the commit
 * that inserts the route's own tags, so dropping the static set here is
 * gapless, and idempotent for later mounts.
 */
function useStaticMetadataCleanup() {
  useEffect(() => {
    document.head.querySelectorAll('[data-static-seo]').forEach((node) => node.remove());
  }, []);
}

/**
 * Route metadata. React 19 hoists `<title>`, `<meta>` and `<link>` rendered
 * here into `<head>`, so each page can declare its own without a side-effect
 * hook. Canonical and og:url are emitted only when a production URL exists.
 */
export function Seo({ title, description, type, noIndex, path }: SeoProps) {
  const canonical = absoluteUrl(path);
  const image = absoluteUrl(OG_IMAGE.path);
  useStaticMetadataCleanup();

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Akther Naimudheen Portfolio" />
      <meta property="og:locale" content="en" />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && (
        <>
          <meta property="og:image" content={image} />
          <meta property="og:image:width" content={String(OG_IMAGE.width)} />
          <meta property="og:image:height" content={String(OG_IMAGE.height)} />
          <meta property="og:image:alt" content={OG_IMAGE.alt} />
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {canonical && <link rel="canonical" href={canonical} />}
    </>
  );
}

/**
 * Person structured data, rendered once per page. JSON-LD is valid anywhere in
 * the document, so this stays in the body rather than relying on script
 * hoisting, which React reserves for async scripts.
 */
export function PersonStructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd() }} />;
}

/**
 * TechArticle structured data for deep-dive technical engineering articles.
 */
export function ArticleStructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd() }} />;
}

/**
 * Dynamic TechArticle structured data for registry articles.
 */
export function DynamicArticleStructuredData({ article }: { article: Article }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: dynamicArticleJsonLd(article) }} />;
}

