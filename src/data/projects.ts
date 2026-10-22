export type ProjectKind = 'ai' | 'signal' | 'hotel' | 'web' | 'lab';
export type ProjectCategory = 'ai' | 'fullstack' | 'delivery';

/**
 * One block of a project's case study, rendered in array order.
 * `body` and `items` stay optional so a section can use prose or a factual list.
 * Only sections backed by supplied project material appear on the site.
 */
export interface CaseStudySection {
  heading: string;
  body?: string;
  items?: string[];
}

export interface Project {
  id: string;
  title: string;
  eyebrow: string;
  kind: ProjectKind;
  category: ProjectCategory;
  categoryLabel: string;
  visual: string;
  caseVisual?: string;
  visualAlt: string;
  status: string;
  role: string;
  summary: string;
  caseHeading: string;
  areas: string[];
  caseStudy: CaseStudySection[];
  result?: {
    label: string;
    value: string;
  }[];
  note?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'iscribe',
    title: 'iScribe — AI Clinical Documentation',
    eyebrow: 'AI Clinical Documentation · Experimental System',
    kind: 'ai',
    category: 'ai',
    categoryLabel: 'AI Applications & Pipeline Engineering',
    visual: '/iscribe-project-preview.svg',
    caseVisual: '/iscribe-architecture.svg',
    visualAlt: 'Workflow architecture diagram for AI-assisted clinical documentation: audio intake, transcription, clinical extraction, and structured output.',
    status: 'Private case study',
    role: 'Full-stack architecture & LLM pipeline design',
    summary:
      'An experimental AI clinical documentation system exploring how multilingual clinical conversations can be transformed into structured documentation while preserving clinical meaning.',
    caseHeading: 'Speech-to-text integration, multilingual clinical fact extraction, and deterministic schema guardrails.',
    areas: ['React / TypeScript', 'Firebase', 'Speech-to-Text Pipeline', 'LLM Fact Extraction', 'Schema Validation'],
    caseStudy: [
      {
        heading: 'Project Overview & Problem Statement',
        body: 'Clinical conversation is not ordinary text. A documentation pipeline must distinguish what a patient reports, what is uncertain, what occurred in the past, and what is merely being recommended or discussed. iScribe is an experimental engineering project exploring how multilingual clinical conversations can be transformed into structured documentation while preserving clinical meaning. NOTICE: Evaluated strictly using synthetic consultation transcripts and sanitized datasets. No real patient data (PHI) is used, and no live hospital adoption, regulatory certification (HIPAA/DPDP), or autonomous clinical use is claimed.',
      },
      {
        heading: 'Engineering Focus & System Architecture',
        items: [
          'Speech-to-text provider integration and transcription workflows with timestamped boundaries',
          'Malayalam-English code-switching and phonetic normalization challenges',
          'Structured clinical fact extraction and semantic validation via strict JSON schema contracts',
          'Negation, uncertainty, temporality, and clinical-context handling (e.g., distinguishing "denies chest pain")',
          'Separation of transcription, normalization, extraction, and validation responsibilities',
          'Automated regression testing and adversarial evaluation of extraction behaviour across dialogue permutations',
          'Mandatory clinician review UI boundary preventing unverified EHR commits',
        ],
      },
      {
        heading: 'Personal Engineering Contributions',
        items: [
          'Engineered full-stack React and TypeScript application architecture with responsive state management for audio playback and note editing',
          'Integrated STT streaming pipelines with segment-level timestamping for audio-to-text synchronization',
          'Authored few-shot clinical extraction prompts enforcing structured JSON schema outputs instead of free-form summaries',
          'Implemented negation detection rules (e.g., distinguishing "denies chest pain" from active complaints) and temporal status tags (current vs historical)',
          'Designed automated regression test suite using synthetic dialogue permutations to measure schema compliance and extraction consistency',
        ],
      },
      {
        heading: 'Validation & Testing Methodology',
        items: [
          'Deterministic Schema Guardrails: Reject malformed LLM outputs at runtime before data can enter application state',
          'Adversarial Semantic Evaluation: Evaluated against adversarial synthetic cases featuring Malayalam/English code-switching, doctor interruptions, and self-corrections',
          'Dose Range Checks: Sanity checks on vital signs and medication dosages to flag extreme numeric outliers for human review',
        ],
      },
      {
        heading: 'Engineering Decisions & Trade-Offs',
        items: [
          'Structured JSON over Free-Form Summaries: Enforcing strict JSON fields enables reliable EHR mapping and deterministic validation, despite higher prompt complexity',
          'Fail-Safe Ambiguity Routing: When the model encounters ambiguous phrasing or competing timelines, it flags the field for human attention rather than guessing',
          'Client-Side Optimistic Caching: Decoupled local audio playback and note drafts from network latency to ensure zero UI lag during consultations',
        ],
      },
      {
        heading: 'Known Limitations & Safety Boundaries',
        body: 'Schema validity does not guarantee clinical accuracy. The LLM extraction pipeline is an assistive draft generator, not an autonomous clinician. All generated clinical notes strictly require qualified medical provider review, verification, and signature prior to any clinical use.',
      },
      {
        heading: 'Current Status & Next Steps',
        body: 'Current phase: Sanitized architecture and pipeline prototype with synthetic benchmark test suites. Next engineering milestones: integrating local offline Whisper models for zero-cloud latency, and implementing FHIR-standard export adapters.',
      },
    ],
    result: [
      { label: 'Pipeline stages', value: '4 Layers' },
      { label: 'Schema output', value: 'Structured JSON' },
      { label: 'Dataset used', value: 'Synthetic only' },
    ],
    note: 'Sanitized architectural case study. Source repository is private; evaluated solely on synthetic dialogues with zero clinical PHI.',
  },
  {
    id: 'rshorts',
    title: 'PromptToShort — AI Video Automation',
    eyebrow: 'AI Video Automation · Media Pipeline',
    kind: 'ai',
    category: 'ai',
    categoryLabel: 'AI Applications & Pipeline Engineering',
    visual: '/rshorts-project-preview.svg',
    caseVisual: '/rshorts-pipeline.svg',
    visualAlt: 'Overview of the PromptToShort automated video pipeline: script generation, TTS alignment, b-roll retrieval, and vertical video assembly.',
    status: 'Live product',
    role: 'Creator & AI Pipeline Engineer',
    liveUrl: 'https://prompttoshort.online/',
    summary:
      'An AI-assisted video creation workflow designed to help transform longer video content into shorter, captioned clips.',
    caseHeading: 'Transcript segmentation, neural speech synthesis, and automated FFmpeg video assembly.',
    areas: ['Python / FastAPI', 'LLM Prompt Engineering', 'Deepgram TTS', 'Multimodal Vision QA', 'FFmpeg Pipeline'],
    caseStudy: [
      {
        heading: 'Project Overview & Engineering Scope',
        body: 'PromptToShort (originally RShorts) is an AI-assisted video creation workflow designed to help transform longer video content into shorter, captioned clips. The system explores Python and FastAPI worker workflows, speech transcription, media-processing integration, kinetic subtitling, and automated multi-track FFmpeg video rendering.',
      },
      {
        heading: 'Personal Contributions',
        items: [
          'Developed prompt orchestration pipeline that scores transcript passages on curiosity gap, hook strength, and narrative pacing',
          'Integrated Deepgram Aura TTS voice synthesis with word-level millisecond timestamp alignment',
          'Engineered candidate visual retrieval matching semantic scene keywords against stock media libraries, filtering by aspect ratio and resolution',
          'Implemented multimodal vision model verification to inspect sampled frames and confirm semantic alignment with script beats',
          'Built decoupled asynchronous worker architecture with Python queue processing to handle CPU/GPU-intensive FFmpeg render jobs',
        ],
      },
      {
        heading: 'Engineering Focus & Workflow Stages',
        items: [
          'Python and FastAPI workflows for request handling and worker coordination',
          'Speech transcription and media-processing integration with Deepgram Aura neural TTS (<12ms drift)',
          'Video segmentation, retention-based hook detection, and narrative pacing alignment',
          'Semantic visual retrieval and multimodal vision-model keyframe verification',
          'Dynamic kinetic ASS subtitling engine with word-level highlight bounding boxes',
          'Automated multi-track FFmpeg video compositing into vertical 9:16 MP4 clips',
          'Comprehensive test harness with 160+ unit and integration tests covering parser boundary conditions and filtergraphs',
        ],
      },
      {
        heading: 'Testing, Error Handling & Evidence',
        items: [
          'Comprehensive Test Harness: Over 160 unit and integration tests covering parser boundary conditions, stock adapter fallbacks, and FFmpeg filtergraph construction',
          'Audio-to-Caption Drift Tolerance: Verified audio and subtitle synchronicity within 12 milliseconds across entire clips',
          'Bounded Retries & Fallbacks: Resilient API retry policies and graceful scene substitution when primary footage providers yield low confidence scores',
        ],
      },
      {
        heading: 'Engineering Trade-Offs',
        items: [
          'Asynchronous Queue vs Immediate Rendering: Moved video rendering out of HTTP request lifecycles into dedicated worker processes, maintaining sub-100ms API response times',
          'Frame Sampling vs Full Video Vision Scans: Sampled 3 keyframes per video candidate for multimodal QA to minimize inference cost and latency while maintaining visual quality',
        ],
      },
      {
        heading: 'Limitations & Manual Review Boundaries',
        body: 'Stock footage coverage depends on provider catalog depth; unusual abstract concepts can yield generic illustrative scenes. The system provides a creator preview interface where operators can inspect, re-rank footage, or tweak hook scripts before final publishing.',
      },
      {
        heading: 'Current Status & Next Steps',
        body: 'Current phase: Live product operational at prompttoshort.online with automated test suite (160+ passing tests) and asynchronous worker engine. Next steps: web-based interactive timeline editor and local AI video generation model integration.',
      },
    ],
    result: [
      { label: 'Automated tests', value: '160+ passing' },
      { label: 'Video format', value: '9:16 Vertical' },
      { label: 'Audio sync', value: 'Word-level' },
    ],
    note: 'Active development project. Architecture, worker pipelines, and 160+ test cases verified from local project repository.',
  },
  {
    id: 'website-projects',
    title: 'Frontend Systems & Web Architecture',
    eyebrow: 'Full-Stack Web Development · Reusable Components',
    kind: 'web',
    category: 'fullstack',
    categoryLabel: 'Full-Stack Architecture & Systems',
    visual: '/project-website-systems.webp',
    visualAlt: 'Desktop monitor and laptop on a studio desk showing responsive website layouts and developer tooling.',
    status: 'Live demo',
    role: 'Frontend engineering & performance',
    summary:
      'Responsive web applications, component libraries, and client-facing web systems built with modern JavaScript/TypeScript, React, Tailwind CSS, and performance-first design.',
    caseHeading: 'Modular frontend architectures built for performance and maintainability.',
    areas: ['React', 'TypeScript', 'Tailwind CSS', 'Responsive Architecture', 'Core Web Vitals'],
    caseStudy: [
      {
        heading: 'Scope & Responsibilities',
        body: 'Engineered responsive web applications and landing systems centered around clean component hierarchy, mobile-first design, accessibility (WCAG compliance), and search optimization.',
      },
      {
        heading: 'Key Engineering Highlights',
        items: [
          'Modular UI component architecture using React, TypeScript, and modern CSS primitives',
          'Accessible navigation patterns, keyboard navigation, and reduced-motion user preferences',
          'Asset optimization and responsive WebP image delivery reducing page load times',
          'Automated sitemap generation, structured data (JSON-LD), and edge caching configurations',
        ],
      },
    ],
    result: [
      { label: 'Layouts', value: 'Responsive' },
      { label: 'Lighthouse', value: 'Optimized' },
      { label: 'Type safety', value: 'TypeScript' },
    ],
    note: 'Client-facing and production web projects.',
  },
  {
    id: 'technical-lab',
    title: 'Technical Systems Exploration',
    eyebrow: 'Developer tooling · Experiments & prototypes',
    kind: 'lab',
    category: 'fullstack',
    categoryLabel: 'Full-Stack Architecture & Systems',
    visual: '/project-technical-lab.webp',
    visualAlt: 'Desk with a monitor showing architecture diagrams, experiment logs, and developer documentation.',
    status: 'In progress',
    role: 'Prototyping & systems exploration',
    summary:
      'Exploratory prototypes investigating modern React/Next.js architectures, serverless Firebase/Supabase backends, PWA offline capabilities, and CI/CD pipelines.',
    caseHeading: 'Practical experiments across modern developer stacks.',
    areas: ['Next.js', 'Firebase', 'Supabase', 'PWA Concepts', 'Vercel Edge'],
    caseStudy: [
      {
        heading: 'Areas of Investigation',
        items: [
          'Next.js App Router exploration and server vs. client component boundaries',
          'Firebase authentication, Firestore security rules, and real-time listeners',
          'Supabase relational schema modeling and PostgreSQL row-level security',
          'Vercel edge deployment optimizations, HTTP security headers, and caching policies',
        ],
      },
    ],
    note: 'Self-directed technical experiments and architectural prototypes.',
  },
  {
    id: 'seaking-restaurant',
    title: 'SeaKing Restaurant',
    eyebrow: 'Client delivery · Kochi',
    kind: 'signal',
    category: 'delivery',
    categoryLabel: 'Client Web Delivery & Hospitality',
    visual: '/project-seaking-restaurant.webp',
    visualAlt: 'Kerala dishes served in brass and stoneware bowls on a dark wood table in a restaurant dining room',
    status: 'Archived',
    role: 'Digital delivery & web systems',
    summary:
      'Client-facing digital project coordinating web presence, local search optimization, content strategy, and performance analytics reporting.',
    caseHeading: 'Search, web presence, and analytics reporting.',
    areas: ['Web Optimization', 'Local SEO', 'Google Business Profile', 'Performance Analytics'],
    caseStudy: [
      {
        heading: 'Work & Scope',
        items: [
          'Website coordination and digital optimization',
          'Local SEO and Google Business Profile management',
          'Campaign coordination and performance reporting',
          'Cross-functional client delivery',
        ],
      },
    ],
    result: [
      { label: 'Content views', value: '37,250+' },
      { label: 'Accounts reached', value: '8,808' },
    ],
    note: 'Client project demonstrating business context, customer delivery, and reporting.',
  },
  {
    id: 'seaking-suites',
    title: 'SeaKing Suites',
    eyebrow: 'Client delivery · MG Road, Kochi',
    kind: 'hotel',
    category: 'delivery',
    categoryLabel: 'Client Web Delivery & Hospitality',
    visual: '/project-seaking-suites.webp',
    visualAlt: 'Hotel lobby with a stone reception desk, lounge seating and full-height windows onto greenery',
    status: 'Archived',
    role: 'Hotel web presence & digital delivery',
    summary:
      'Digital presence and web optimization work for a hotel brand in Kochi, integrating local search visibility and website SEO planning.',
    caseHeading: 'Search, website presence, and digital delivery.',
    areas: ['Website optimization', 'Local SEO', 'Search visibility', 'SEO planning'],
    caseStudy: [
      {
        heading: 'Digital Work',
        items: [
          'Website optimization and planning',
          'Local SEO and search visibility',
          'Google Business Profile integration',
          'Performance tracking and reporting',
        ],
      },
    ],
    note: 'Client project demonstrating customer delivery and search visibility.',
  },
];
