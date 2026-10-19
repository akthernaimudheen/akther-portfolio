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
    title: 'iScribe AI Architecture',
    eyebrow: 'Clinical documentation pipeline · Full-stack application',
    kind: 'ai',
    category: 'ai',
    categoryLabel: 'AI Applications & Pipeline Engineering',
    visual: '/iscribe-project-preview.svg',
    caseVisual: '/iscribe-architecture.svg',
    visualAlt: 'Workflow architecture diagram for AI-assisted clinical documentation: audio intake, transcription, clinical extraction, and structured output.',
    status: 'Private case study',
    role: 'Full-stack architecture & LLM pipeline design',
    summary:
      'Architected an AI-assisted clinical documentation system that transforms consultation audio into structured medical records with multi-stage schema validation and mandatory clinician review.',
    caseHeading: 'Speech recognition, language processing, and structured clinical schema.',
    areas: ['React / TypeScript', 'Firebase', 'Speech-to-Text Pipeline', 'LLM Fact Extraction', 'Schema Validation'],
    caseStudy: [
      {
        heading: 'Project Overview & Privacy Disclosure',
        body: 'iScribe is a self-directed engineering project addressing physician documentation burden. Clinical consultations produce dense, conversational speech with rapid terminology and regional code-switching (Malayalam and English). NOTICE: Evaluated strictly using synthetic consultation transcripts and sanitized datasets. No real patient data (PHI) is used, and no live hospital adoption or regulatory certifications (HIPAA/DPDP) are claimed.',
      },
      {
        heading: 'Architecture & System Pipeline',
        items: [
          'Stage 1 (Audio Ingestion & STT): Processes chunked consultation audio via speech-to-text with timestamped segment boundaries',
          'Stage 2 (Bilingual & Entity Extraction): Targeted prompt templates isolate chief complaints, symptoms, medications, dosages, and temporal anchors',
          'Stage 3 (Deterministic Schema Validation): Runtime validation via Zod / Pydantic JSON contracts ensuring strict field typing and range checks',
          'Stage 4 (Ambiguity & Conflict Handling): Flags contradictory timelines, uncertain diagnoses ("rule out", "suspected"), and missing fields',
          'Stage 5 (Clinician Review UI): Responsive editing workspace requiring manual physician verification and sign-off before export',
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
    title: 'PromptToShort',
    eyebrow: 'AI video creation platform · Media pipeline',
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
      'Engineered PromptToShort (originally RShorts), an automated AI video creation platform converting prompts and scripts into vertical short-form videos with Deepgram neural voiceover, beat-synced visual pacing, kinetic subtitles, and multi-track NLE timeline export.',
    caseHeading: 'Transcript segmentation, multi-provider footage selection, and audio-visual assembly.',
    areas: ['Python / FastAPI', 'LLM Prompt Engineering', 'Deepgram TTS', 'Multimodal Vision QA', 'FFmpeg Pipeline'],
    caseStudy: [
      {
        heading: 'Project Overview & Problem Scope',
        body: 'PromptToShort is an end-to-end generative AI product engineered by Akther Naimudheen to transform prompts and scripts into publish-ready 9:16 vertical short-form videos. The system automates narrative hook synthesis, neural voice narration, semantic footage ranking, kinetic subtitle compilation, and multi-track timeline export for DaVinci Resolve and Premiere Pro.',
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
        heading: 'System Architecture & Workflow',
        items: [
          'Stage 1 (Transcript Analysis & Hook Detection): Segmenting transcripts into candidate 30–60 second narrative arcs with retention scoring',
          'Stage 2 (Voice Synthesis & Beat Alignment): Generating master narration audio and word-level timing tables',
          'Stage 3 (Media Selection & Multimodal QA): Ranking b-roll video candidates and running vision-model relevance checks',
          'Stage 4 (Dynamic Kinetic Subtitling): Compiling ASS subtitle files with word-level bounding-box highlight bounces',
          'Stage 5 (FFmpeg Assembly Engine): Multi-track video compositing (A-Roll + B-Roll + Voice + Audio Ducker + Overlays) into 1080x1920 MP4',
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
    eyebrow: 'Component architecture · Modern web systems',
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
