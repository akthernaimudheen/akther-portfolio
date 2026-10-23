import { SITE_URL } from './site';
import { projects, type Project } from '../data/projects';
import { articles, type Article } from '../data/articles';

export interface RouteMetadata {
  title: string;
  description: string;
  type: 'website' | 'profile' | 'article';
  canonical: string;
  noIndex?: boolean;
}

const TITLE_SUFFIX = 'Akther Naimudheen';
const DESCRIPTION_LIMIT = 155;

export function clampDescription(text: string): string {
  if (text.length <= DESCRIPTION_LIMIT) return text;
  const cut = text.slice(0, DESCRIPTION_LIMIT);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:—-]$/, '')}…`;
}

export const staticRouteMetadata: Record<string, Omit<RouteMetadata, 'canonical'>> = {
  '/': {
    title: `${TITLE_SUFFIX} | AI Application Engineer & Software Developer`,
    description:
      'Software developer and AI application engineer in Kerala, India. Explore applied AI projects, Python systems, software architecture, and engineering case studies.',
    type: 'profile',
  },
  '/about': {
    title: `About — ${TITLE_SUFFIX}`,
    description:
      'Background of Akther Naimudheen: AI-focused software developer, full-stack web development, computer engineering diploma, and healthcare documentation QA.',
    type: 'profile',
  },
  '/work': {
    title: `Engineering Projects & Case Studies | ${TITLE_SUFFIX}`,
    description:
      'Explore AI engineering projects, Python applications, asynchronous media pipelines, and full-stack systems, with technical decisions and testing evidence.',
    type: 'website',
  },
  '/contact': {
    title: `Contact — ${TITLE_SUFFIX}`,
    description:
      'Connect with Akther Naimudheen for full-stack software development, applied AI engineering, API integrations, and product development opportunities.',
    type: 'website',
  },
  '/blog': {
    title: `Technical Publication & Engineering Essays — ${TITLE_SUFFIX}`,
    description:
      'Technical case studies, systems architecture breakdowns, and practical engineering notes on applied AI, media automation, and dependable software.',
    type: 'website',
  },
  '/services': {
    title: `Web Engineering & Search Architecture Services — ${TITLE_SUFFIX}`,
    description:
      'Engineering-led business website development, technical SEO architecture, and local search visibility for independent businesses and technical teams.',
    type: 'website',
  },
  '/blog/building-clinical-ai-beyond-transcription': {
    title: `Building AI Clinical Documentation Beyond Transcription — ${TITLE_SUFFIX}`,
    description:
      'An engineering deep dive into deterministic NLP guardrails, verbatim span tracking, and schema validation to mitigate LLM hallucinations in clinical notes.',
    type: 'article',
  },
};

export function getProjectMetadata(project: Project): Omit<RouteMetadata, 'canonical'> {
  if (project.id === 'iscribe') {
    return {
      title: `iScribe AI Architecture & Testing | ${TITLE_SUFFIX}`,
      description:
        'Explore the engineering behind iScribe: clinical NLP guardrails, schema validation, regression tests, and limitations in Malayalam medical documentation.',
      type: 'article',
    };
  }
  if (project.id === 'rshorts') {
    return {
      title: `PromptToShort: Python Media Pipeline | ${TITLE_SUFFIX}`,
      description:
        "Explore PromptToShort's Python media pipeline: asynchronous FastAPI processing, headless FFmpeg workflows, subtitle synchronization, and automated tests.",
      type: 'article',
    };
  }
  return {
    title: `${project.title} — ${TITLE_SUFFIX}`,
    description: clampDescription(project.summary),
    type: 'article',
  };
}

export function getArticleMetadata(article: Article): Omit<RouteMetadata, 'canonical'> {
  return {
    title: `${article.title} — ${TITLE_SUFFIX}`,
    description: clampDescription(article.description),
    type: 'article',
  };
}

export function getAllRoutesMetadata(): Record<string, RouteMetadata> {
  const result: Record<string, RouteMetadata> = {};

  for (const [route, meta] of Object.entries(staticRouteMetadata)) {
    result[route] = {
      ...meta,
      canonical: `${SITE_URL}${route === '/' ? '/' : route}`,
    };
  }

  for (const project of projects) {
    const route = `/work/${project.id}`;
    result[route] = {
      ...getProjectMetadata(project),
      canonical: `${SITE_URL}${route}`,
    };
  }

  for (const article of articles) {
    const route = `/blog/${article.slug}`;
    if (!result[route]) {
      result[route] = {
        ...getArticleMetadata(article),
        canonical: `${SITE_URL}${route}`,
      };
    }
  }

  return result;
}
