import { profile } from '@/data/profile';
import type { Project } from '@/data/projects';
import type { Article } from '@/data/articles';
import { SITE_URL } from '@/lib/site';

/**
 * Re-exported so every existing `@/lib/seo` import keeps working. The value
 * itself lives in `@/lib/site`, which vite.config.ts also reads to emit the
 * sitemap — one domain, one definition.
 */
export { SITE_URL };

/**
 * Social preview card. A 1200x630 capture of the live homepage hero, so the
 * preview and the page a visitor lands on are the same composition.
 */
export const OG_IMAGE = {
  path: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Akther Naimudheen — AI Engineer & Developer Portfolio',
} as const;

/** Absolute URL for a site-relative path, or undefined while SITE_URL is unset. */
export function absoluteUrl(path: string): string | undefined {
  if (!SITE_URL) return undefined;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export interface RouteMeta {
  title: string;
  description: string;
  /** og:type — 'profile' for person-centric pages, 'article' for a case study. */
  type: 'website' | 'profile' | 'article';
  /** Kept out of the index while there is no canonical URL to point at. */
  noIndex?: boolean;
}

const TITLE_SUFFIX = profile.name;
const DESCRIPTION_LIMIT = 155;

/** Trim to a word boundary so a long summary cannot produce a mid-word cut. */
function clampDescription(text: string): string {
  if (text.length <= DESCRIPTION_LIMIT) return text;
  const cut = text.slice(0, DESCRIPTION_LIMIT);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:—-]$/, '')}…`;
}

export const homeMeta: RouteMeta = {
  title: `${profile.name} | Software Developer & AI Application Engineer`,
  description:
    'Software engineering projects, applied AI systems, technical architecture writing, and web development services by Akther Naimudheen.',
  type: 'profile',
};

export const aboutMeta: RouteMeta = {
  title: `About — ${TITLE_SUFFIX}`,
  description:
    'Background of Akther Naimudheen: AI-focused software developer, full-stack web development, computer engineering diploma, and healthcare documentation QA.',
  type: 'profile',
};

export const workMeta: RouteMeta = {
  title: `Software Projects — ${TITLE_SUFFIX}`,
  description:
    'Software engineering projects by Akther Naimudheen across applied AI pipelines, clinical documentation research, full-stack web applications, and automated video workflows.',
  type: 'website',
};

export const contactMeta: RouteMeta = {
  title: `Contact — ${TITLE_SUFFIX}`,
  description:
    'Connect with Akther Naimudheen for full-stack software development, applied AI engineering, API integrations, and product development opportunities.',
  type: 'website',
};

export const notFoundMeta: RouteMeta = {
  title: `Page not found — ${TITLE_SUFFIX}`,
  description: 'This page does not exist. Return to the portfolio home page.',
  type: 'website',
  noIndex: true,
};

/** Built strictly from fields that already exist on the project record. */
export function projectMeta(project: Project): RouteMeta {
  return {
    title: `${project.title} — ${TITLE_SUFFIX}`,
    description: clampDescription(project.summary),
    type: 'article',
  };
}

export const clinicalAiArticleMeta: RouteMeta = {
  title: `Building AI Clinical Documentation Beyond Transcription — ${TITLE_SUFFIX}`,
  description:
    'An engineering deep dive into deterministic NLP guardrails, verbatim span tracking, and schema validation to solve LLM hallucinations in clinical documentation.',
  type: 'article',
};

export const blogMeta: RouteMeta = {
  title: `Technical Publication & Engineering Essays — ${TITLE_SUFFIX}`,
  description:
    'Technical case studies, systems architecture breakdowns, and practical engineering notes on applied AI, media automation, and dependable software.',
  type: 'website',
};

export const servicesMeta: RouteMeta = {
  title: `Web Engineering & Search Architecture Services — ${TITLE_SUFFIX}`,
  description:
    'Engineering-led business website development, technical SEO architecture, and local search visibility for independent businesses and technical teams.',
  type: 'website',
};

export function buildArticleMeta(article: Article): RouteMeta {
  return {
    title: `${article.title} — ${TITLE_SUFFIX}`,
    description: clampDescription(article.description),
    type: 'article',
  };
}

export function dynamicArticleJsonLd(article: Article): string {
  const url = absoluteUrl(`/blog/${article.slug}`);
  const authorUrl = absoluteUrl('/about');
  const image = absoluteUrl(OG_IMAGE.path);

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.positioning,
      url: authorUrl,
      sameAs: [profile.githubUrl, profile.linkedinUrl],
    },
    publisher: {
      '@type': 'Person',
      name: profile.name,
      url: absoluteUrl('/'),
    },
    datePublished: article.publishedAt,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    mainEntityOfPage: url,
    image: image,
    inLanguage: 'en',
    proficiencyLevel: 'Expert',
    about: article.tags.map((tag) => ({ '@type': 'Thing', name: tag })),
    keywords: article.tags,
  });
}

/**
 * TechArticle structured data for the in-depth iScribe engineering study.
 * Conforms to schema.org/TechArticle specification.
 */
export function articleJsonLd(): string {
  const url = absoluteUrl('/blog/building-clinical-ai-beyond-transcription');
  const authorUrl = absoluteUrl('/about');
  const image = absoluteUrl(OG_IMAGE.path);

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Building AI Clinical Documentation Beyond Transcription: Engineering Guardrails for Clinical Fact Extraction',
    description: clinicalAiArticleMeta.description,
    author: {
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.positioning,
      url: authorUrl,
      sameAs: [profile.githubUrl, profile.linkedinUrl],
    },
    publisher: {
      '@type': 'Person',
      name: profile.name,
      url: absoluteUrl('/'),
    },
    datePublished: '2026-10-18',
    dateModified: '2026-10-19',
    mainEntityOfPage: url,
    image: image,
    inLanguage: 'en',
    proficiencyLevel: 'Expert',
    about: [
      { '@type': 'Thing', name: 'Clinical Natural Language Processing' },
      { '@type': 'Thing', name: 'Artificial Intelligence in Healthcare' },
      { '@type': 'Thing', name: 'Software Verification & Testing' },
    ],
    keywords: [
      'Clinical NLP',
      'Clinical Fact Extraction',
      'Deterministic Guardrails',
      'AI Medical Scribe',
      'Speech-to-Text Pipeline',
      'Schema Validation',
      'Malayalam English Code-Switching',
      'Pydantic',
      'spaCy',
    ],
  });
}

/**
 * Structured data for WebSite and Person.
 * Connects the personal identity "Akther Naimudheen" to canonical portfolio,
 * LinkedIn, GitHub, and defines WebSite site-name identity for Google Search.
 */
export function structuredDataJsonLd(): string {
  const url = absoluteUrl('/');
  const personId = url ? `${url}#person` : undefined;
  const websiteId = url ? `${url}#website` : undefined;
  const image = absoluteUrl(profile.portrait.src);

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      ...(websiteId ? { '@id': websiteId } : {}),
      ...(url ? { url } : {}),
      name: 'Akther Naimudheen Portfolio',
      alternateName: ['Akther Naimudheen', 'Akther V N Portfolio'],
      description: homeMeta.description,
      ...(personId ? { publisher: { '@id': personId } } : {}),
    },
    {
      '@type': 'Person',
      ...(personId ? { '@id': personId } : {}),
      name: profile.name,
      alternateName: [profile.alternateName, 'Akther'],
      jobTitle: 'Software Developer & AI Application Engineer',
      description: homeMeta.description,
      email: `mailto:${profile.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: profile.seoLocality,
        addressRegion: profile.seoRegion,
        addressCountry: profile.seoCountry,
      },
      worksFor: {
        '@type': 'Organization',
        name: profile.employer,
      },
      sameAs: [
        profile.githubUrl,
        profile.linkedinUrl,
      ],
      knowsAbout: [
        'Software Application Development',
        'AI Application Engineering',
        'Full-Stack Web Development',
        'Clinical Documentation Systems',
        'REST API Integration',
        'Speech-to-Text Pipelines',
        'Software Testing & Validation',
        'TypeScript & JavaScript',
        'React & Next.js',
        'Tailwind CSS',
        'FastAPI',
        'PostgreSQL & Supabase',
        'Python',
      ],
      ...(url ? { url } : {}),
      ...(image ? { image } : {}),
    },
  ];

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  });
}

/** Retained for backward-compatibility with existing component imports. */
export function personJsonLd(): string {
  return structuredDataJsonLd();
}

/**
 * Service structured data for the /services offerings.
 * Conforms to schema.org/ItemList with nested schema.org/Service items.
 */
export function servicesJsonLd(): string {
  const url = absoluteUrl('/services');
  const providerUrl = absoluteUrl('/about');
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Technical Web & Search Services',
    description:
      'Engineering-led business website development, technical SEO architecture, and local search visibility.',
    numberOfItems: 3,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Business Website Development',
        item: {
          '@type': 'Service',
          name: 'Business Website Development',
          serviceType: 'Web Application & Website Development',
          provider: {
            '@type': 'Person',
            name: profile.name,
            url: providerUrl,
          },
          description:
            'Component-based frontend engineering, responsive implementation, API integration, and scoped deployment setup.',
          url: url,
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Technical SEO Architecture',
        item: {
          '@type': 'Service',
          name: 'Technical SEO Architecture',
          serviceType: 'Technical SEO Consulting',
          provider: {
            '@type': 'Person',
            name: profile.name,
            url: providerUrl,
          },
          description:
            'Crawlability auditing, indexing configuration, structured data, canonical tags, and Core Web Vitals remediation.',
          url: url,
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Local Search Visibility',
        item: {
          '@type': 'Service',
          name: 'Local Search Visibility',
          serviceType: 'Local Search Optimization',
          provider: {
            '@type': 'Person',
            name: profile.name,
            url: providerUrl,
          },
          description:
            'Google Business Profile optimization, NAP consistency auditing, local schema markup, and geographic relevance signals.',
          url: url,
        },
      },
    ],
  });
}


