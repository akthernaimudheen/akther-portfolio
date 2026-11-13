import { projects } from '../data/projects';
import { articles } from '../data/articles';
import { profile } from '../data/profile';
import { services } from '../data/services';
import { staticRouteMetadata } from './routes-meta';

export interface StaticRouteHighlight {
  title?: string;
  description: string;
  link?: { href: string; label: string };
}

export interface StaticRouteLink {
  href: string;
  label: string;
  note?: string;
}

export interface StaticRouteBodyData {
  route: string;
  eyebrow: string;
  h1: string;
  introParagraphs: string[];
  sectionHeading?: string;
  highlights?: StaticRouteHighlight[];
  internalLinks: StaticRouteLink[];
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Selects complete sentences or complete bullet items within `maxLength` so
 * static highlights never cut mid-word or leave dangling fragments.
 */
function selectCompleteSummary(
  body: string | undefined,
  items: readonly string[] | undefined,
  maxLength = 280
): string {
  if (body && body.trim().length > 0) {
    const trimmed = body.trim();
    if (trimmed.length <= maxLength) {
      return trimmed;
    }
    const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length > 0) {
      let result = sentences[0];
      for (let i = 1; i < sentences.length; i++) {
        const candidate = `${result} ${sentences[i]}`;
        if (candidate.length <= maxLength) {
          result = candidate;
        } else {
          break;
        }
      }
      return result;
    }
    return trimmed;
  }

  if (items && items.length > 0) {
    let joined = items[0].trim();
    for (let i = 1; i < items.length; i++) {
      const next = items[i].trim();
      const candidate = `${joined} ${next}`;
      if (candidate.length <= maxLength) {
        joined = candidate;
      } else {
        break;
      }
    }
    return joined;
  }

  return '';
}

export function getStaticRouteContent(route: string): StaticRouteBodyData {
  // 1. Homepage
  if (route === '/') {
    return {
      route: '/',
      eyebrow: `${profile.name} · AI Engineer in Kerala`,
      h1: 'Akther Naimudheen — AI Engineer in Kerala. Building practical AI, NLP pipelines and intelligent applications.',
      introParagraphs: [
        `${profile.name} is a ${profile.positioning.toLowerCase()} in ${profile.location}, building practical AI systems, clinical NLP pipelines, and reliable LLM applications with deterministic guardrails.`,
        'His engineering work focuses on strict Pydantic and TypeScript schema contracts, asynchronous Python workers, and human-in-the-loop review boundaries rather than unverified model outputs.',
      ],
      sectionHeading: 'Featured Engineering Systems',
      highlights: [
        {
          title: 'CLINORIA: Clinical Intelligence & Deterministic Guardrails',
          description:
            'An experimental clinical intelligence platform exploring multilingual clinical documentation, Malayalam-English clinical NLP, structured JSON fact extraction, and deterministic schema validation guardrails.',
          link: { href: '/work/clinoria', label: 'Explore CLINORIA Case Study' },
        },
        {
          title: 'PromptToShort: Asynchronous Video Automation Pipeline',
          description:
            'An engineering project exploring automated script segmentation, asynchronous FastAPI worker queues, Deepgram Aura neural speech synthesis, and headless multi-track FFmpeg video rendering (160+ passing tests).',
          link: { href: '/work/rshorts', label: 'Explore PromptToShort Pipeline' },
        },
        {
          title: 'Technical Lab: AI Systems & Prototypes',
          description:
            'Exploratory prototypes, local small language model (SLM) CPU inference benchmarks, model routing experiments, and deterministic guardrail architectures.',
          link: { href: '/work/technical-lab', label: 'Explore Technical Lab' },
        },
      ],
      internalLinks: [
        { href: '/about', label: 'About Akther Naimudheen', note: 'Background, education & engineering discipline' },
        { href: '/work', label: 'All Engineering Projects', note: 'Complete systems and case studies portfolio' },
        { href: '/blog', label: 'Technical Publication', note: 'Research monographs and engineering notes' },
        { href: '/blog/hybrid-ai-architecture-cpu-guardrails', label: 'Hybrid AI Architecture Monograph', note: 'Deterministic CPU guardrails for LLMs' },
        { href: '/blog/building-clinical-ai-beyond-transcription', label: 'Clinical AI Deep Dive', note: 'Clinical NLP and hallucination mitigation' },
        { href: '/services', label: 'Engineering Services', note: 'Web engineering & search architecture' },
        { href: '/contact', label: 'Contact', note: 'Collaboration & project inquiries' },
      ],
    };
  }

  // 2. About Page
  if (route === '/about') {
    return {
      route: '/about',
      eyebrow: 'About & Engineering Discipline',
      h1: 'About Akther Naimudheen — AI Engineer & Software Developer. Engineering applications through structure, accuracy and reliable code.',
      introParagraphs: [
        `${profile.name} (${profile.alternateName}) is an AI application and software engineer based in ${profile.location}. His background combines practical software development with direct experience in AI documentation quality assurance and clinical documentation review at RiteSource Infosystem LLP, and OCR pipeline verification and document processing quality assurance at WDG Services.`,
        'He holds a Diploma in Computer Engineering from Maharajas Technological Institute, Thrissur. His engineering approach treats neural model outputs as untrusted boundaries requiring deterministic runtime validation, schema contracts, and human-in-the-loop review.',
      ],
      sectionHeading: 'Engineering Foundations & Focus Areas',
      highlights: [
        {
          title: 'Applied AI & Clinical NLP',
          description:
            'Designing few-shot prompt pipelines with strict Pydantic JSON contracts, Malayalam-English phonetic normalization, and negation/temporality status handling.',
        },
        {
          title: 'Systems Concurrency & Video Pipelines',
          description:
            'Building asynchronous worker queues in Python and FastAPI, handling CPU-bound FFmpeg rendering, and aligning neural TTS waveforms with sub-12ms drift tolerance.',
        },
        {
          title: 'Frontend Systems & Search Architecture',
          description:
            'Engineering responsive, high-performance web systems with React, TypeScript, Tailwind CSS, semantic HTML5, and Schema.org structured data.',
        },
      ],
      internalLinks: [
        { href: '/work', label: 'View Engineering Projects' },
        { href: '/work/clinoria', label: 'CLINORIA Clinical Case Study' },
        { href: '/blog', label: 'Read Technical Essays & Monographs' },
        { href: '/blog/sidekiq-security-vulnerability-responsible-disclosure', label: 'Sidekiq Security Disclosure Case Study' },
        { href: '/contact', label: 'Get in Touch' },
      ],
    };
  }

  // 3. Work Index Page
  if (route === '/work') {
    return {
      route: '/work',
      eyebrow: 'Selected Work',
      h1: 'AI Projects & Software Systems by Akther Naimudheen. AI pipelines, full-stack systems and tested code.',
      introParagraphs: [
        `Explore applied AI engineering projects, clinical NLP pipelines, concurrency architectures, and full-stack systems built by ${profile.name} in Kerala.`,
        'Each case study documents real system constraints, schema validation boundaries, automated test coverage, and implementation trade-offs.',
      ],
      sectionHeading: 'Featured Case Studies & Systems',
      highlights: projects.map((p) => ({
        title: p.title,
        description: p.summary,
        link: { href: `/work/${p.id}`, label: `View ${p.title} Case Study` },
      })),
      internalLinks: [
        { href: '/work/clinoria', label: 'CLINORIA Clinical Intelligence' },
        { href: '/work/rshorts', label: 'PromptToShort Media Automation' },
        { href: '/work/technical-lab', label: 'Technical Systems Exploration' },
        { href: '/work/website-projects', label: 'Frontend Systems Portfolio' },
        { href: '/about', label: 'About the Engineer' },
        { href: '/blog', label: 'Technical Publications' },
        { href: '/contact', label: 'Inquire About Engineering Work' },
      ],
    };
  }

  // 4. Blog Index Page
  if (route === '/blog') {
    return {
      route: '/blog',
      eyebrow: 'Technical Writing',
      h1: 'Systems, architecture, and applied AI in practice.',
      introParagraphs: [
        'Technical case studies, systems architecture breakdowns, and practical engineering notes on applied AI, media automation, application security, and dependable software.',
        'These articles document real engineering challenges: enforcing deterministic schema guardrails on LLMs, coordinating vulnerability disclosures with CERT-In, and decoupling CPU-bound video processing in asynchronous queues.',
      ],
      sectionHeading: 'Published Case Studies & Engineering Notes',
      highlights: articles.map((a) => ({
        title: a.title,
        description: a.description,
        link: { href: `/blog/${a.slug}`, label: `Read Article (${a.readTime})` },
      })),
      internalLinks: [
        { href: '/blog/hybrid-ai-architecture-cpu-guardrails', label: 'Hybrid AI Architecture Monograph' },
        { href: '/blog/building-clinical-ai-beyond-transcription', label: 'Clinical Documentation Beyond Transcription' },
        { href: '/blog/sidekiq-security-vulnerability-responsible-disclosure', label: 'Sidekiq Security Observation & Disclosure' },
        { href: '/work', label: 'View Applied Systems & Projects' },
        { href: '/about', label: 'About Akther Naimudheen' },
      ],
    };
  }

  // 5. Services Page
  if (route === '/services') {
    return {
      route: '/services',
      eyebrow: 'Web Engineering & Search Architecture',
      h1: 'Engineering-Led Web Systems & Search Architecture.',
      introParagraphs: [
        'Engineering-led business website development, technical SEO architecture, and search visibility for independent businesses, service firms, and technical teams in Kerala and beyond.',
        'Every web platform is built with component-based TypeScript and modern static rendering—avoiding bloated site-builders, fragile plugins, and performance regressions.',
      ],
      sectionHeading: 'Available Service Pillars',
      highlights: services.map((s) => ({
        title: `${s.number}. ${s.title}`,
        description: s.summary,
      })),
      internalLinks: [
        { href: '/work/website-projects', label: 'Frontend Systems Portfolio' },
        { href: '/work/clinoria', label: 'CLINORIA Clinical Case Study' },
        { href: '/work/rshorts', label: 'PromptToShort Video Pipeline' },
        { href: '/about', label: 'About the Engineer' },
        { href: '/contact', label: 'Request Service Consultation' },
      ],
    };
  }

  // 6. Contact Page
  if (route === '/contact') {
    return {
      route: '/contact',
      eyebrow: 'Contact',
      h1: 'Have a software problem worth solving?',
      introParagraphs: [
        `${profile.name} is open to software development opportunities involving full-stack applications, applied AI, API integrations, and engineering-focused product development.`,
        `Based in ${profile.location}. If you are building something useful or looking for a developer who enjoys solving practical technical problems, use the direct channels below to connect.`,
      ],
      sectionHeading: 'Direct Contact Channels',
      highlights: [
        {
          title: 'Email',
          description: `${profile.email} — Direct email contact for software development and applied AI inquiries.`,
          link: { href: `mailto:${profile.email}`, label: `Email ${profile.name}` },
        },
        {
          title: 'GitHub',
          description: 'Explore public repositories, engineering documentation, and sample code.',
          link: { href: profile.githubUrl, label: 'github.com/akthernaimudheen' },
        },
        {
          title: 'LinkedIn',
          description: 'Connect professionally and view background details.',
          link: { href: profile.linkedinUrl, label: 'linkedin.com/in/akther-naimudheen' },
        },
      ],
      internalLinks: [
        { href: '/work', label: 'Explore Engineering Projects' },
        { href: '/work/clinoria', label: 'CLINORIA Clinical Case Study' },
        { href: '/about', label: 'About Background & Discipline' },
        { href: '/blog', label: 'Read Technical Articles' },
      ],
    };
  }

  // 6b. 404 Page Not Found
  if (route === '/404') {
    return {
      route: '/404',
      eyebrow: 'Page Not Found · 404',
      h1: 'This address has no page.',
      introParagraphs: [
        'The requested route was not found or has moved to a new canonical URL.',
        'Please check the address or use the navigation links below to return to the portfolio.',
      ],
      internalLinks: [
        { href: '/', label: 'Return Home' },
        { href: '/work', label: 'View Engineering Projects' },
        { href: '/blog', label: 'Read Technical Articles' },
        { href: '/about', label: 'About Akther Naimudheen' },
      ],
    };
  }

  // 7. Project Case Studies (/work/:id)
  const projectMatch = projects.find((p) => `/work/${p.id}` === route);
  if (projectMatch) {
    const studySections = projectMatch.caseStudy || [];
    const highlights: StaticRouteHighlight[] = studySections.slice(0, 4).map((sec) => ({
      title: sec.heading,
      description: selectCompleteSummary(sec.body, sec.items),
    }));

    return {
      route,
      eyebrow: projectMatch.eyebrow || 'Engineering Case Study',
      h1: projectMatch.title,
      introParagraphs: [
        projectMatch.summary,
        projectMatch.caseHeading || 'Detailed architecture overview and personal engineering contributions.',
      ],
      sectionHeading: 'Key Architecture Sections & Findings',
      highlights,
      internalLinks: [
        { href: '/work', label: 'All Engineering Projects' },
        ...(projectMatch.id === 'clinoria'
          ? [{ href: '/blog/building-clinical-ai-beyond-transcription', label: 'Related Monograph: Clinical AI Beyond Transcription' }]
          : []),
        ...(projectMatch.id === 'rshorts'
          ? [{ href: '/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg', label: 'Related Note: FastAPI & FFmpeg Pipeline Architecture' }]
          : []),
        ...(projectMatch.id === 'technical-lab'
          ? [{ href: '/blog/hybrid-ai-architecture-cpu-guardrails', label: 'Related Monograph: Hybrid CPU Guardrails' }]
          : []),
        { href: '/about', label: 'About Akther Naimudheen' },
        { href: '/contact', label: 'Discuss This System' },
      ],
    };
  }

  // 8. Blog Articles (/blog/:slug)
  const articleMatch = articles.find((a) => `/blog/${a.slug}` === route);
  if (articleMatch) {
    const sections = articleMatch.sections || [];
    const highlights: StaticRouteHighlight[] = sections.slice(0, 3).map((sec) => ({
      title: sec.heading,
      description: sec.paragraphs[0] || '',
    }));

    if (highlights.length === 0) {
      if (articleMatch.slug === 'sidekiq-security-vulnerability-responsible-disclosure') {
        highlights.push(
          {
            title: 'Observation & Context',
            description:
              'Responsible security observation of an exposed Sidekiq background job processing dashboard identified during public exposure analysis.',
          },
          {
            title: 'Responsible Disclosure Coordination',
            description:
              'Initial security report submitted to the organization on 6 October 2026, followed by coordinated escalation to CERT-In on 18 October 2026 under reference CERTIn-55576526 (documented as a coordination case, without claiming official vulnerability confirmation or independent remediation verification).',
          },
          {
            title: 'Defense in Depth Lessons',
            description:
              'Why administrative dashboards must enforce explicit authentication, authorization, and network access controls rather than relying on obscurity.',
          }
        );
      } else if (articleMatch.slug === 'hybrid-ai-architecture-cpu-guardrails') {
        highlights.push(
          {
            title: 'Untrusted Coprocessor Model',
            description:
              'Treating neural models as unverified suggestion engines surrounded by deterministic CPU verification across 4 automated guardrail layers and 5 fail-closed pipeline stages.',
          },
          {
            title: 'Measured Pilot Findings',
            description:
              'Unconstrained 7B local CPU Ollama inference averaged 54.2 seconds per note (36.1x the 1,500 ms consultation target) across 12 synthetic ultrasound cases, alongside a 0.8837 F1 score on the 21-fact Frozen B2 synthetic regression gate.',
          },
          {
            title: 'Target Design Hypotheses',
            description:
              'Hypothesis 2 targets at least 35% token generation reduction and 25% median end-to-end latency reduction via deterministic dictionary and regex pre-passes (under evaluation rather than measured production claims).',
          }
        );
      } else if (articleMatch.slug === 'building-clinical-ai-beyond-transcription') {
        highlights.push(
          {
            title: 'Structured JSON Clinical Extraction',
            description:
              'Parsing multilingual doctor-patient dialogues into structured JSON outputs enforced with deterministic schema validation; the current prototype outputs structured JSON and does not yet include production HL7 v2 or FHIR export adapters.',
          },
          {
            title: 'Hallucination Mitigation',
            description:
              'Enforcing verbatim span tracking, explicit negation/uncertainty separation, and deterministic guardrail checks to flag ungrounded findings before review.',
          },
          {
            title: 'Physician Review Boundary',
            description:
              'Designing fail-closed human-in-the-loop review workflows so clinicians inspect structured drafts rather than permitting automated unverified EHR commits.',
          }
        );
      }
    }

    return {
      route,
      eyebrow: `${articleMatch.eyebrow} · Published ${articleMatch.publishedAt}`,
      h1: articleMatch.title,
      introParagraphs: [
        articleMatch.description,
        `Technical publication by ${profile.name}. Reading time: ${articleMatch.readTime}. Category: ${articleMatch.category}.`,
      ],
      sectionHeading: 'Article Highlights & Core Insights',
      highlights,
      internalLinks: [
        { href: '/blog', label: 'Back to All Articles' },
        ...(articleMatch.slug.includes('clinical')
          ? [{ href: '/work/clinoria', label: 'Explore CLINORIA Case Study' }]
          : []),
        ...(articleMatch.slug.includes('video')
          ? [{ href: '/work/rshorts', label: 'Explore PromptToShort Pipeline' }]
          : []),
        ...(articleMatch.slug.includes('hybrid')
          ? [{ href: '/work/clinoria', label: 'Explore CLINORIA Case Study' }]
          : []),
        { href: '/about', label: 'About the Author' },
        { href: '/contact', label: 'Contact Akther Naimudheen' },
      ],
    };
  }

  // Fallback for any other route
  const meta = staticRouteMetadata[route];
  return {
    route,
    eyebrow: `${profile.name} Portfolio`,
    h1: meta?.title ? meta.title.split('—')[0].trim() : `${profile.name} — AI Engineer in Kerala`,
    introParagraphs: [
      meta?.description ||
        `${profile.name} is an AI engineer and software developer in Kerala building practical AI systems and reliable web applications.`,
    ],
    internalLinks: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/work', label: 'Projects' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
    ],
  };
}

/**
 * Renders the single canonical visible static HTML shell placed inside `#root`.
 * React 19 `createRoot` completely replaces `#root` children on mount, avoiding
 * any duplicate `<h1>`, `.skip-link`, or duplicate visible blocks post-hydration.
 */
export function renderStaticRootHtml(data: StaticRouteBodyData): string {
  const eyebrowHtml = `<p style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #595959; font-weight: 700; margin: 0 0 0.5rem 0;">${escapeHtml(
    data.eyebrow
  )}</p>`;
  const h1Html = `<h1 style="font-size: clamp(1.75rem, 3.2vw, 2.5rem); line-height: 1.15; margin: 0 0 1rem 0; color: #0a0a0a;">${escapeHtml(
    data.h1
  )}</h1>`;
  const paragraphsHtml = data.introParagraphs
    .map(
      (p) =>
        `<p style="font-size: 1.0625rem; line-height: 1.65; color: #333333; margin: 0 0 1rem 0;">${escapeHtml(
          p
        )}</p>`
    )
    .join('\n        ');

  let highlightsHtml = '';
  if (data.highlights && data.highlights.length > 0) {
    const items = data.highlights
      .map((h) => {
        const titleStr = h.title ? `<strong>${escapeHtml(h.title)}</strong>: ` : '';
        const descStr = escapeHtml(h.description);
        const linkStr = h.link
          ? ` <a href="${escapeHtml(h.link.href)}" style="color: #0a0a0a; text-decoration: underline;">${escapeHtml(
              h.link.label
            )}</a>`
          : '';
        return `<li style="margin-bottom: 0.75rem;">${titleStr}${descStr}${linkStr}</li>`;
      })
      .join('\n          ');

    highlightsHtml = `
        <h2 style="font-size: 1.25rem; margin: 1.5rem 0 0.75rem 0; color: #0a0a0a;">${escapeHtml(
          data.sectionHeading || 'Key Details & Architecture'
        )}</h2>
        <ul style="padding-left: 1.25rem; margin: 0 0 1.5rem 0; color: #333333;">
          ${items}
        </ul>`;
  }

  const linksItems = data.internalLinks
    .map((l) => {
      const noteStr = l.note ? ` — <span style="color: #595959;">${escapeHtml(l.note)}</span>` : '';
      return `<li style="margin-bottom: 0.5rem;"><a href="${escapeHtml(
        l.href
      )}" style="color: #0a0a0a; font-weight: 600; text-decoration: underline;">${escapeHtml(
        l.label
      )}</a>${noteStr}</li>`;
    })
    .join('\n          ');

  const linksHtml = `
        <h2 style="font-size: 1.25rem; margin: 1.5rem 0 0.75rem 0; color: #0a0a0a;">Related Links &amp; Navigation</h2>
        <nav aria-label="Primary sections">
          <ul style="padding-left: 1.25rem; margin: 0 0 1.25rem 0;">
            ${linksItems}
          </ul>
        </nav>`;

  return `<div id="root">
      <a class="skip-link" href="#main-content">Skip to content</a>
      <main id="main-content" class="static-route-shell" style="padding: 2rem 1.5rem 3rem; max-width: 820px; margin: 0 auto; font-family: Archivo, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0a0a0a;">
        ${eyebrowHtml}
        ${h1Html}
        ${paragraphsHtml}${highlightsHtml}${linksHtml}
        <p class="direct-open-note">Opened directly via file protocol. Serve the production build over HTTP for interactive client enhancements.</p>
      </main>
    </div>`;
}
