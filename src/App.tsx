import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Mail, MapPin, Menu, X } from 'lucide-react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { CountUp } from '@/components/CountUp';
import { CursorFollower } from '@/components/CursorFollower';
import { ProjectGallery } from '@/components/ProjectGallery';
import { Reveal } from '@/components/ScrollMotion';
import { ArticleStructuredData, PersonStructuredData, Seo } from '@/components/Seo';
import { ProjectVisualScene } from '@/components/ui/project-visual-scene';
import { ClinicalAiArticle } from '@/components/ClinicalAiArticle';
import { usePointerDrift } from '@/lib/pointer';
import { projects } from '@/data/projects';
import { capabilities, journey, profile } from '@/data/profile';
import {
  aboutMeta,
  clinicalAiArticleMeta,
  contactMeta,
  homeMeta,
  notFoundMeta,
  projectMeta,
  workMeta,
  type RouteMeta,
} from '@/lib/seo';

const navigation = [
  ['Home', '/'],
  ['About', '/about'],
  ['Work', '/work'],
  ['Contact', '/contact'],
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The portrait's own entrance: it rises, overshoots once and settles. Kept
 * separate from the copy's tween because the cutout is the piece the eye lands
 * on, and a spring reads as weight rather than as a fade-in.
 */
const PORTRAIT_ENTRANCE = {
  type: 'spring',
  stiffness: 180,
  damping: 15,
  mass: 0.9,
  delay: 0.3,
} as const;

/**
 * Entrance step for the hero. The whole stagger — copy, yellow field, portrait —
 * lands inside 450ms, and collapses to nothing under reduced motion.
 */
function useHeroStep() {
  const reduced = useReducedMotion() ?? false;
  return (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 18 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.36, delay: reduced ? 0 : delay, ease: EASE },
  });
}

/** Flips once the page has left the hero, so the header can pick up a backdrop. */
function useScrolled(threshold = 32) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);
  return scrolled;
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={`site-header${scrolled ? ' is-stuck' : ''}`}>
      <div className="site-header__bar">
        <Link to="/" className="brand" aria-label={`${profile.name}, home`}>
          AKTHER<span aria-hidden="true">.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary">
          {navigation.map(([label, href]) => (
            <NavLink key={href} to={href} end={href === '/'}>
              {label}
            </NavLink>
          ))}
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </nav>
        <button
          className="menu-button"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav${open ? ' is-open' : ''}`} aria-label="Mobile">
        {navigation.map(([label, href]) => (
          <NavLink key={href} to={href} end={href === '/'} onClick={() => setOpen(false)}>
            {label}
          </NavLink>
        ))}
        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={`mailto:${profile.email}`}>Email</a>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer" data-cursor-invert>
      <div className="site-footer__inner">
        <div className="site-footer__mark">
          <Link to="/" className="brand" aria-label={`${profile.name}, home`}>
            AKTHER<span aria-hidden="true">.</span>
          </Link>
          <p>
            Full-stack web applications, generative AI pipelines, and healthcare documentation quality assurance.
          </p>
          <a className="link-underline" href={`mailto:${profile.email}`}>
            {profile.email} <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <nav className="site-footer__col" aria-label="Footer pages">
          <p className="eyebrow">Pages</p>
          <ul>
            {navigation.map(([label, href]) => (
              <li key={href}>
                <Link to={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="site-footer__col" aria-label="Footer projects">
          <p className="eyebrow">Projects</p>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <Link to={`/work/${project.id}`}>{project.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__col">
          <p className="eyebrow">Details & Links</p>
          <ul>
            <li>
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href={profile.resumeUrl} download>
                Technical Résumé (PDF)
              </a>
            </li>
            <li>
              <span>{profile.location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer__rail">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Built with React, TypeScript and Tailwind</span>
      </div>
    </footer>
  );
}

interface PageFrameProps {
  /** This route's metadata. Rendered outside the transition — see below. */
  meta: RouteMeta;
  /** Site-relative path, used for the canonical and og:url. */
  path: string;
  children: ReactNode;
}

/**
 * Route metadata is deliberately rendered here rather than inside `children`.
 *
 * React 19 hoists `<title>` and `<meta>` into `<head>` and keeps one of each.
 * With `AnimatePresence mode="wait"` the outgoing and incoming pages are both
 * mounted for the length of the exit, so two subtrees claim the same hoisted
 * tags — and on a transition between two routes that render the *same*
 * component (project page to project page) the outgoing page's title, canonical
 * and og:url were the ones left behind. Keeping exactly one `<Seo>` outside the
 * animated subtree means the collision cannot happen.
 */
function PageFrame({ meta, path, children }: PageFrameProps) {
  const location = useLocation();
  const reduced = useReducedMotion() ?? false;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Seo {...meta} path={path} />
      <PersonStructuredData />
      <SiteHeader />
      <AnimatePresence mode="wait">
        <motion.main
          id="main-content"
          key={location.pathname}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <SiteFooter />
    </>
  );
}

/* ------------------------------------------------------------------ home --- */

function HomeHero() {
  const step = useHeroStep();
  const reduced = useReducedMotion() ?? false;
  const fieldRef = useRef<HTMLSpanElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const leadRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLSpanElement>(null);

  /* Restrained depth, deepest layer first: the yellow field travels furthest,
     the portrait barely tilts (a side profile shows rotation far more than a
     front view does), and the headline moves least of all. */
  usePointerDrift(fieldRef, { x: 12, y: 10 });
  usePointerDrift(portraitRef, { x: 6, y: 4, rotate: 0.8 });
  usePointerDrift(leadRef, { x: 6, y: 4 });
  usePointerDrift(subRef, { x: 3, y: 2 });

  return (
    <section className="hero" aria-labelledby="home-title">
      <motion.p className="eyebrow hero__eyebrow" {...step(0)}>
        AI APPLICATIONS · FULL-STACK DEVELOPMENT · AI QUALITY
      </motion.p>

      <motion.h1 className="hero__title" id="home-title" {...step(0.06)}>
        <span className="hero__title-lead" ref={leadRef}>
          <span>Building AI applications</span>
        </span>
        <span className="hero__title-sub" ref={subRef}>
          <span>with validation and review</span>
          <span>built into the workflow.</span>
        </span>
      </motion.h1>

      {/* The yellow field sits below the headline and the portrait above it, so
          the type reads as black-on-yellow while the face stays clear. */}
      <motion.div className="hero__field" aria-hidden="true" {...step(0.12)}>
        <span ref={fieldRef} />
      </motion.div>

      {/* Entrance uses a reliable ease transition so the image never hangs at opacity 0 */}
      <motion.figure
        className="hero__figure"
        initial={reduced ? false : { opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.45, delay: 0.12, ease: EASE }}
      >
        <img
          ref={portraitRef}
          src={profile.portraitCutout.src}
          srcSet={profile.portraitCutout.srcSet}
          sizes="(max-width: 900px) 78vw, 30vw"
          width={profile.portraitCutout.width}
          height={profile.portraitCutout.height}
          alt={profile.portraitCutout.alt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </motion.figure>

      <motion.div className="hero__intro" {...step(0.16)}>
        <p>
          I'm a Computer Engineering diploma holder based in Kerala, India, with experience in healthcare documentation quality assurance and OCR workflows. I build AI-assisted applications and focus on making complex workflows structured, testable and useful.
        </p>
        <div className="hero__actions">
          <Link className="btn" to="/work">
            Explore Engineering Projects <ArrowRight aria-hidden="true" />
          </Link>
          <a className="link-underline" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
            View GitHub <ArrowUpRight aria-hidden="true" />
          </a>
          <a className="link-underline" href={profile.resumeUrl} download>
            Download Résumé <Download aria-hidden="true" />
          </a>
        </div>
      </motion.div>

      {/* Immediate Project Evidence Cues */}
      <div className="hero__cues" role="region" aria-label="Featured project highlights">
        <div className="hero__cue-item">
          <div>
            <strong>iScribe:</strong> <span>Clinical documentation pipeline &amp; schema checks</span>
          </div>
          <Link to="/work/iscribe">Explore Architecture →</Link>
        </div>
        <div className="hero__cue-item">
          <div>
            <strong>RShorts:</strong> <span>Automated video pipeline (160+ passing tests)</span>
          </div>
          <Link to="/work/rshorts">View Pipeline →</Link>
        </div>
      </div>

      <div className="hero__rail">
        <span>Computer Engineering (MTI)</span>
        <span>AI Applications &amp; Full-Stack</span>
        <span>{profile.location}</span>
      </div>
    </section>
  );
}

function HomePage() {
  const featured = projects.slice(0, 3);

  return (
    <PageFrame meta={homeMeta} path="/">
      <HomeHero />

      <section className="section" aria-labelledby="home-work-title">
        <Reveal className="section-head">
          <p className="eyebrow">Featured engineering</p>
          <h2 id="home-work-title">
            Systems built with
            <br />structure and rigor.
          </h2>
          <p className="lede">
            Generative AI applications, clinical documentation pipelines, and modern web architectures with concrete engineering scope and test evidence.
          </p>
        </Reveal>

        <div className="feature-list">
          {featured.map((project, index) => (
            <Reveal
              key={project.id}
              className={`feature feature--${index + 1}`}
              amount={0.15}
              delay={index * 0.05}
            >
              <Link to={`/work/${project.id}`}>
                <ProjectVisualScene
                  src={project.visual}
                  alt={project.visualAlt}
                  interactive
                  eager={index === 0}
                />
                <div className="feature__meta">
                  <p>{project.eyebrow}</p>
                  <h3>{project.title}</h3>
                  <span className="link-underline">
                    Open case study <ArrowUpRight aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Link className="wide-link" to="/work">
          <span>See all engineering and technical systems</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <section className="section split-section" aria-labelledby="home-capability-title">
        <Reveal className="section-head section-head--sticky">
          <p className="eyebrow">Technical approach</p>
          <h2 id="home-capability-title">
            Architecture,
            <br />
            integration
            <br />
            and reliability.
          </h2>
        </Reveal>
        <div className="capability-list">
          {capabilities.map(({ title, text }, index) => (
            <Reveal className="capability-row" key={title} amount={0.3} delay={index * 0.05}>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="ink-panel" data-cursor-invert aria-labelledby="home-role-title">
        <div className="ink-panel__inner">
          <Reveal>
            <p className="eyebrow">Engineering discipline</p>
            <h2 id="home-role-title">
              Quality-focused
              <br />
              systems engineering.
            </h2>
          </Reveal>
          <Reveal className="ink-panel__copy" direction="right">
            <p>
              Combining a Computer Engineering foundation with professional experience validating high-volume AI clinical documentation and OCR pipelines, I bring rigor, precision, and architectural discipline to every software project.
            </p>
            <Link className="link-underline" to="/about">
              Read about my background <ArrowUpRight aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </PageFrame>
  );
}

/* ----------------------------------------------------------------- about --- */

function AboutPage() {
  const fieldRef = useRef<HTMLSpanElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  usePointerDrift(fieldRef, { x: 12, y: 10 });
  usePointerDrift(portraitRef, { x: 5, y: 4, rotate: 1.2 });

  return (
    <PageFrame meta={aboutMeta} path="/about">

      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero__copy">
          <p className="eyebrow">About Akther</p>
          <h1 id="about-title">
            <span>Engineering applications</span>
            <span>through structure,</span>
            <span>accuracy and</span>
            <span>reliable code.</span>
          </h1>
          <p className="lede">
            I build full-stack web applications and integrate generative AI pipelines with a focus on reliability, clear system boundaries, and factual validation.
          </p>
          <p>
            I’m based in Kochi, Kerala. My background includes a Diploma in Computer Engineering from Maharajas Technological Institute, rigorous AI medical documentation quality assurance on the DeepScribe AI project, OCR pipeline verification at Wisedocs, and web application development at Orestes Technology.
          </p>
          <div className="about-hero__actions" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            <a className="link-underline" href={profile.resumeUrl} download>
              Technical résumé <Download aria-hidden="true" />
            </a>
            <a className="link-underline" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="link-underline" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <figure className="about-hero__figure">
          <span className="about-hero__field" ref={fieldRef} aria-hidden="true" />
          <img
            ref={portraitRef}
            src={profile.portrait.src}
            srcSet={profile.portrait.srcSet}
            sizes="(max-width: 900px) 84vw, 36vw"
            width={profile.portrait.width}
            height={profile.portrait.height}
            alt={profile.portrait.alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </figure>
      </section>

      <section className="ink-panel ink-panel--statement" data-cursor-invert>
        <div className="ink-panel__inner">
          <Reveal>
            <p className="eyebrow">The philosophy</p>
            <h2>
              I understand system architecture, then I build the prompt, the data pipeline and the user interface.
            </h2>
          </Reveal>
        </div>
      </section>

      <section className="section split-section" aria-labelledby="about-experience-title">
        <Reveal className="section-head section-head--sticky">
          <p className="eyebrow">Experience &amp; Training</p>
          <h2 id="about-experience-title">
            Technical foundation
            <br />
            and quality discipline.
          </h2>
          <p className="lede">
            Working directly on AI medical documentation at DeepScribe and OCR verification at Wisedocs established my core engineering discipline: generative outputs must be treated as untrusted boundaries requiring strict schema contracts, deterministic regression testing, and clear human-review boundaries.
          </p>
        </Reveal>
        <div className="experience-list">
          {journey.map((item, index) => (
            <Reveal
              className="experience-row"
              key={`${item.year}-${item.title}`}
              amount={0.2}
              delay={Math.min(index, 4) * 0.04}
            >
              <div>
                <div style={{ marginBottom: '0.4rem' }}>
                  <span className="badge-status badge-status--progress">
                    {item.year}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginTop: '0.2rem' }}>
                  {item.roleOrCompany}
                </span>
              </div>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection />
    </PageFrame>
  );
}

/* ------------------------------------------------------------------ work --- */

function WorkPage() {
  const featured = projects[0];

  return (
    <PageFrame meta={workMeta} path="/work">

      <section className="work-hero" aria-labelledby="work-title">
        <div className="work-hero__copy">
          <p className="eyebrow">Engineering projects</p>
          <h1 id="work-title">
            <span>AI pipelines,</span>
            <span>full-stack systems</span>
            <span>and tested code.</span>
          </h1>
          <p className="lede">
            Each project states the problem, my architectural contributions, verified implementation details, and current limitations.
          </p>
        </div>
        <Link className="work-hero__lead" to={`/work/${featured.id}`}>
          <ProjectVisualScene
            src="/work-overview-visual.svg"
            alt="Architectural overview of clinical documentation and automated video pipelines"
            interactive
            eager
          />
          <div>
            <span>Featured Architecture · Core Systems</span>
            <strong>iScribe &amp; RShorts Architecture</strong>
            <ArrowUpRight aria-hidden="true" />
          </div>
        </Link>
      </section>

      <section className="section work-index" aria-label="Project index">
        <ProjectGallery />
      </section>

      <CtaSection />
    </PageFrame>
  );
}

/* --------------------------------------------------------------- project --- */

function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.id === slug);
  const reduced = useReducedMotion() ?? false;

  if (!project) return <NotFound />;

  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <PageFrame meta={projectMeta(project)} path={`/work/${project.id}`}>

      <section className="project-hero" aria-labelledby="project-title">
        <Link to="/work" className="back-link">
          <ArrowLeft aria-hidden="true" /> All work
        </Link>
        <motion.div
          className="project-hero__copy"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.36, ease: EASE }}
        >
          <p className="eyebrow">
            {project.eyebrow} — {project.status}
          </p>
          <h1 id="project-title">{project.title}</h1>
          <p className="lede">{project.summary}</p>
          <div className="tag-list" aria-label="Responsibilities">
            {project.areas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </motion.div>
      </section>

      <motion.div
        className="project-plate"
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.08, ease: EASE }}
      >
        <ProjectVisualScene
          src={project.caseVisual ?? project.visual}
          alt={project.visualAlt}
          interactive
          eager
        />
      </motion.div>

      <section className="section split-section" aria-labelledby="case-title">
        <Reveal className="section-head section-head--sticky">
          <p className="eyebrow">Project view</p>
          <h2 id="case-title">{project.caseHeading}</h2>
        </Reveal>
        <Reveal className="case-copy" direction="right" delay={0.05}>
          {project.id === 'iscribe' && (
            <>
              <div className="case-notice" role="alert">
                <span style={{ fontSize: '1.25rem', lineHeight: 1 }} aria-hidden="true">⚠</span>
                <div>
                  <strong>Safety &amp; Verification Boundary:</strong> Evaluated strictly using synthetic clinical dialogue. Valid JSON schema does not replace qualified physician review. All clinical outputs require qualified clinician sign-off prior to EHR commit.
                </div>
              </div>
              <div className="article-promo-card">
                <div>
                  <span className="eyebrow" style={{ color: 'var(--ink)' }}>In-Depth Technical Case Study</span>
                  <h3 style={{ margin: '0.25rem 0 0.45rem', fontSize: '1.15rem' }}>
                    Building AI Clinical Documentation Beyond Transcription
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--muted)' }}>
                    Read the complete 14-minute engineering analysis covering deterministic extraction, our 12-case Ollama benchmark with 7 prohibited hallucinations, and verbatim provenance tracking.
                  </p>
                </div>
                <Link className="btn btn--signal" to="/blog/building-clinical-ai-beyond-transcription">
                  Read Case Study <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
          {project.id === 'rshorts' && (
            <div className="case-notice" role="status">
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }} aria-hidden="true">✓</span>
              <div>
                <strong>Automated Test Benchmark:</strong> 160+ unit and integration tests verify timing precision, subtitle drift within 12ms, and FFmpeg filtergraph construction without manual video editing intervention.
              </div>
            </div>
          )}
          {project.caseStudy.map((section) => (
            <div className="case-section" key={section.heading}>
              <h3>{section.heading}</h3>
              {section.body && <p>{section.body}</p>}
              {section.items && (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {project.note && <p className="case-note">{project.note}</p>}
        </Reveal>
      </section>

      {project.result && (
        <section className="section results-section" aria-labelledby="results-title">
          <Reveal>
            <p className="eyebrow" id="results-title">
              Reported results
            </p>
          </Reveal>
          <div className="results-grid">
            {project.result.map((result) => (
              <article key={result.label}>
                <strong><CountUp value={result.value} /></strong>
                <span>{result.label}</span>
              </article>
            ))}
          </div>
          {project.note && <p className="case-note">{project.note}</p>}
        </section>
      )}

      <section className="ink-panel ink-panel--next" data-cursor-invert>
        <Link className="ink-panel__inner" to={`/work/${nextProject.id}`}>
          <span>Next project</span>
          <strong>{nextProject.title}</strong>
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </PageFrame>
  );
}

/* --------------------------------------------------------------- contact --- */

function ContactPage() {
  return (
    <PageFrame meta={contactMeta} path="/contact">
      <section className="contact" data-cursor-invert aria-labelledby="contact-title">
        <div className="contact__image">
          <img
            src={profile.cinematicPortrait.src}
            srcSet={profile.cinematicPortrait.srcSet}
            sizes="(max-width: 900px) 100vw, 52vw"
            width={profile.cinematicPortrait.width}
            height={profile.cinematicPortrait.height}
            alt={profile.cinematicPortrait.alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="contact__panel">
          <p className="eyebrow">Contact</p>
          <h1 id="contact-title">
            <span>Let’s build</span>
            <span>reliable software.</span>
          </h1>
          <p className="lede">
            Open to Junior AI Application Developer, Full-Stack Developer, and AI Quality Assurance / Implementation roles. Send an email or connect on LinkedIn and GitHub.
          </p>
          <div className="contact__actions">
            <a className="btn btn--signal" href={`mailto:${profile.email}`}>
              Email Akther <Mail aria-hidden="true" />
            </a>
            <a className="link-underline" href={profile.resumeUrl} download>
              Technical résumé <Download aria-hidden="true" />
            </a>
          </div>
          <dl className="contact__details">
            <div>
              <dt>
                <Mail aria-hidden="true" /> Email
              </dt>
              <dd>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </dd>
            </div>
            <div>
              <dt>
                <ArrowUpRight aria-hidden="true" /> GitHub
              </dt>
              <dd>
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">github.com/akthernaimudheen</a>
              </dd>
            </div>
            <div>
              <dt>
                <ArrowUpRight aria-hidden="true" /> LinkedIn
              </dt>
              <dd>
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">linkedin.com/in/akther-naimudheen</a>
              </dd>
            </div>
            <div>
              <dt>
                <MapPin aria-hidden="true" /> Location
              </dt>
              <dd>{profile.location}</dd>
            </div>
          </dl>
        </div>
      </section>
    </PageFrame>
  );
}

/* ---------------------------------------------------------------- shared --- */

function CtaSection() {
  return (
    <section className="section cta-band" aria-labelledby="cta-title">
      <Reveal>
        <p className="eyebrow">Looking for technical contributions?</p>
        <h2 id="cta-title">
          Open to AI engineering
          <br />
          and full-stack roles.
        </h2>
        <Link className="btn" to="/contact">
          Get in touch <ArrowUpRight aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}

function ClinicalAiArticlePage() {
  return (
    <PageFrame meta={clinicalAiArticleMeta} path="/blog/building-clinical-ai-beyond-transcription">
      <ArticleStructuredData />
      <ClinicalAiArticle />
    </PageFrame>
  );
}

function NotFound() {
  return (
    <PageFrame meta={notFoundMeta} path="/404">
      <section className="not-found">
        <p className="eyebrow">Page not found</p>
        <h1>
          <span>This address</span>
          <span>has no page.</span>
        </h1>
        <Link className="btn" to="/">
          <ArrowLeft aria-hidden="true" /> Return home
        </Link>
      </section>
    </PageFrame>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/work" element={<WorkPage />} />
      <Route path="/work/:slug" element={<ProjectPage />} />
      <Route path="/blog/building-clinical-ai-beyond-transcription" element={<ClinicalAiArticlePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <CursorFollower />
    </BrowserRouter>
  );
}
