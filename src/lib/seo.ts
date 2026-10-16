import { profile } from '@/data/profile';
import type { Project } from '@/data/projects';
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
  alt: 'Akther V N — AI Application Developer & Full-Stack Projects',
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
  title: `${profile.name} | AI Application Developer & Full-Stack Projects`,
  description:
    'Explore AI application projects, full-stack development, clinical documentation workflows, and technical QA work by Akther V N, based in Kerala, India.',
  type: 'profile',
};

export const aboutMeta: RouteMeta = {
  title: `About — ${TITLE_SUFFIX}`,
  description:
    'Background in Computer Engineering, healthcare documentation quality assurance, OCR systems, and hands-on AI application development.',
  type: 'profile',
};

export const workMeta: RouteMeta = {
  title: `Engineering Projects — ${TITLE_SUFFIX}`,
  description:
    'Selected engineering projects across generative AI applications, full-stack clinical documentation architecture, and modern web systems.',
  type: 'website',
};

export const contactMeta: RouteMeta = {
  title: `Contact — ${TITLE_SUFFIX}`,
  description:
    'Connect with Akther V N regarding junior AI engineering, full-stack development, or AI implementation roles.',
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

/**
 * Person structured data. Every value is either supplied by the profile record
 * or derived from it — no invented URLs, social profiles, employer or client
 * links, telephone numbers, ratings, or job titles. `url` and `image` appear
 * only once SITE_URL is configured, because both require an absolute origin.
 */
export function personJsonLd(): string {
  const url = absoluteUrl('/');
  const image = absoluteUrl(profile.portrait.src);

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.positioning,
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
      'Generative AI Applications',
      'Full-Stack Web Development',
      'Clinical Documentation Systems',
      'AI Quality Assurance & Evaluation',
      'Speech-to-Text Pipelines',
      'Prompt Engineering',
      'TypeScript',
      'React',
      'Next.js',
      'Firebase',
      'Python',
    ],
    ...(url ? { url } : {}),
    ...(image ? { image } : {}),
  });
}
