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
    title: `AI Engineer in Kerala | Applied AI & NLP Developer — ${TITLE_SUFFIX}`,
    description:
      'Akther Naimudheen is an AI engineer in Kerala building practical AI systems, clinical NLP pipelines, and reliable LLM applications with deterministic guardrails.',
    type: 'profile',
  },
  '/about': {
    title: `About ${TITLE_SUFFIX} — AI Engineer in Kerala & Developer`,
    description:
      'Background of Akther Naimudheen: AI engineer and software developer in Kerala, India. Applied AI systems, clinical NLP QA, and computer engineering background.',
    type: 'profile',
  },
  '/work': {
    title: `AI Engineering Projects & Systems Portfolio — ${TITLE_SUFFIX}`,
    description:
      'Explore applied AI engineering projects and systems by Akther Naimudheen in Kerala: iScribe clinical NLP, PromptToShort media pipelines, and Technical Lab.',
    type: 'website',
  },
  '/contact': {
    title: `Contact ${TITLE_SUFFIX} — AI & Software Engineering`,
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
  '/blog/hybrid-ai-architecture-cpu-guardrails': {
    title: `Hybrid AI Architecture: Deterministic CPU Guardrails for LLMs — ${TITLE_SUFFIX}`,
    description:
      'Why treating the neural model as an untrusted coprocessor within a deterministic CPU runtime creates safer, faster, and cheaper AI systems.',
    type: 'article',
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
      title: `iScribe: Clinical NLP & AI Documentation — ${TITLE_SUFFIX}`,
      description:
        'iScribe by Akther Naimudheen: clinical NLP guardrails, Malayalam-English speech extraction, deterministic schema validation, and clinical documentation QA.',
      type: 'article',
    };
  }
  if (project.id === 'rshorts') {
    return {
      title: `PromptToShort: AI Video Automation Pipeline — ${TITLE_SUFFIX}`,
      description:
        'PromptToShort by Akther Naimudheen: automated AI video processing pipeline, asynchronous FastAPI workers, and headless FFmpeg rendering workflows.',
      type: 'article',
    };
  }
  if (project.id === 'technical-lab') {
    return {
      title: `Technical Lab: AI Engineering & Prototype Systems — ${TITLE_SUFFIX}`,
      description:
        'Technical Lab by Akther Naimudheen: AI engineering prototypes, local LLM inference benchmarks, deterministic guardrails, and systems architecture.',
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
