/**
 * Source of truth for keyword-to-route assignments and search intent mapping.
 * Enforces differentiated search purpose across canonical portfolio routes.
 */

export interface RouteKeywordDefinition {
  route: string;
  primaryKeyword: string;
  supportingCluster: string[];
  searchIntent: string;
  relevantInternalLinks: string[];
}

export const SEO_KEYWORD_MAP: RouteKeywordDefinition[] = [
  {
    route: '/',
    primaryKeyword: 'AI engineer in Kerala',
    supportingCluster: [
      'AI engineer Kerala',
      'AI developer in Kerala',
      'AI software developer Kerala',
      'applied AI engineer',
      'AI engineer Kochi',
    ],
    searchIntent: 'Local Professional Discovery',
    relevantInternalLinks: [
      '/work/iscribe',
      '/work/technical-lab',
      '/work/rshorts',
      '/about',
      '/contact',
      '/blog',
    ],
  },
  {
    route: '/work/iscribe',
    primaryKeyword: 'clinical NLP and AI documentation',
    supportingCluster: [
      'Malayalam-English NLP',
      'clinical NLP developer',
      'structured clinical data extraction',
      'clinical AI guardrails',
    ],
    searchIntent: 'Specialized Technical Case Study',
    relevantInternalLinks: [
      '/blog/building-clinical-ai-beyond-transcription',
      '/blog/hybrid-ai-architecture-cpu-guardrails',
      '/work',
    ],
  },
  {
    route: '/work/rshorts',
    primaryKeyword: 'AI video automation',
    supportingCluster: [
      'automated video processing',
      'video processing pipeline',
      'asynchronous video pipeline',
      'automated editing workflow',
    ],
    searchIntent: 'System Architecture Case Study',
    relevantInternalLinks: [
      '/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg',
      '/work',
    ],
  },
  {
    route: '/work/technical-lab',
    primaryKeyword: 'AI engineering projects and technical prototypes',
    supportingCluster: [
      'reliable AI systems',
      'LLM guardrails',
      'CPU-based LLM inference',
      'software architecture prototypes',
    ],
    searchIntent: 'Technical Systems Exploration',
    relevantInternalLinks: [
      '/blog/hybrid-ai-architecture-cpu-guardrails',
      '/work/iscribe',
      '/work',
    ],
  },
  {
    route: '/blog/hybrid-ai-architecture-cpu-guardrails',
    primaryKeyword: 'deterministic LLM guardrails and hybrid AI architecture',
    supportingCluster: [
      'resource-aware AI inference',
      'selective model execution',
      'hybrid AI architecture',
      'deterministic CPU guardrails',
    ],
    searchIntent: 'Technical Research Monograph',
    relevantInternalLinks: [
      '/work/iscribe',
      '/work/technical-lab',
      '/about',
    ],
  },
  {
    route: '/blog/building-clinical-ai-beyond-transcription',
    primaryKeyword: 'clinical AI documentation and NLP',
    supportingCluster: [
      'Malayalam code-switching NLP',
      'clinical fact extraction',
      'deterministic guardrails',
      'Pydantic validation',
    ],
    searchIntent: 'Clinical Research Monograph',
    relevantInternalLinks: [
      '/work/iscribe',
      '/blog/hybrid-ai-architecture-cpu-guardrails',
      '/about',
    ],
  },
  {
    route: '/about',
    primaryKeyword: 'AI software developer in Kerala',
    supportingCluster: [
      'AI engineer Kerala',
      'software developer Kochi',
      'computer engineering diploma',
      'clinical documentation QA',
    ],
    searchIntent: 'Professional Background & Credibility',
    relevantInternalLinks: [
      '/work/iscribe',
      '/work/technical-lab',
      '/contact',
      '/services',
    ],
  },
  {
    route: '/work',
    primaryKeyword: 'applied AI engineering projects',
    supportingCluster: [
      'AI engineering portfolio projects',
      'clinical NLP systems',
      'asynchronous media pipelines',
      'Python AI applications',
    ],
    searchIntent: 'Engineering Systems Portfolio',
    relevantInternalLinks: [
      '/work/iscribe',
      '/work/rshorts',
      '/work/technical-lab',
    ],
  },
];
