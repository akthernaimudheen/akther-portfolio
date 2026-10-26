import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Download, Mail, MapPin, Menu, Tag, X } from 'lucide-react';
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { CountUp } from '@/components/CountUp';
import { CursorFollower } from '@/components/CursorFollower';
import { ProjectGallery } from '@/components/ProjectGallery';
import { Reveal } from '@/components/ScrollMotion';
import {
  ArticleStructuredData,
  DynamicArticleStructuredData,
  PersonStructuredData,
  ProjectStructuredData,
  Seo,
  ServicesStructuredData,
} from '@/components/Seo';
import { ProjectVisualScene } from '@/components/ui/project-visual-scene';
import { ClinicalAiArticle } from '@/components/ClinicalAiArticle';
import { HybridAiArticle } from '@/components/HybridAiArticle';
import { BlogIndex } from '@/components/BlogIndex';
import { StructuredArticlePage } from '@/components/StructuredArticlePage';
import { ServicesPage } from '@/components/ServicesPage';
import { usePointerDrift } from '@/lib/pointer';
import { projects } from '@/data/projects';
import { capabilities, journey, profile, skillCategories, verifiedTechnologies } from '@/data/profile';
import { articles, getArticleBySlug } from '@/data/articles';
import {
  aboutMeta,
  blogMeta,
  buildArticleMeta,
  clinicalAiArticleMeta,
  hybridAiArticleMeta,
  contactMeta,
  homeMeta,
  notFoundMeta,
  projectMeta,
  servicesMeta,
  workMeta,
  type RouteMeta,
} from '@/lib/seo';

const navigation = [
  ['Home', '/'],
  ['About', '/about'],
  ['Projects', '/work'],
  ['Blog', '/blog'],
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
          AKTHER NAIMUDHEEN<span aria-hidden="true">.</span>
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
            AKTHER NAIMUDHEEN<span aria-hidden="true">.</span>
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
            <li>
              <Link to="/services">Services</Link>
            </li>
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
        AKTHER NAIMUDHEEN · AI-FOCUSED SOFTWARE ENGINEER
      </motion.p>

      <motion.h1 className="hero__title" id="home-title" {...step(0.06)}>
        <span className="sr-only">Akther Naimudheen — AI Application Engineer &amp; Software Developer. </span>
        <span className="hero__title-lead" ref={leadRef}>
          <span>I build software</span>
        </span>
        <span className="hero__title-sub" ref={subRef}>
          <span>that turns complex ideas into working systems.</span>
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
          I'm Akther Naimudheen, an AI-focused software engineer and full-stack developer based in Kerala, India. I design resilient architectures with concrete validation boundaries, automated testing, and dependable API integrations.
        </p>
        <p className="hero__intro-sub">
          Explore practical AI engineering—from multilingual clinical documentation workflows (iScribe) to asynchronous video processing pipelines (PromptToShort).
        </p>
        <div className="hero__actions">
          <Link className="btn" to="/work">
            Explore Engineering Projects <ArrowRight aria-hidden="true" />
          </Link>
          <div className="hero__secondary-actions">
            <a className="link-underline" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="link-underline" href={profile.resumeUrl} download>
              Résumé <Download aria-hidden="true" />
            </a>
            <Link className="link-underline" to="/contact">
              Contact <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Immediate Project Evidence Cues */}
      <div className="hero__cues" role="region" aria-label="Featured project highlights">
        <div className="hero__cue-item">
          <div>
            <strong>iScribe:</strong> <span>Clinical documentation &amp; schema guardrails</span>
          </div>
          <Link to="/work/iscribe">Explore Architecture →</Link>
        </div>
        <div className="hero__cue-item">
          <div>
            <strong>PromptToShort:</strong> <span>AI video automation workflow (160+ passing tests)</span>
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

function CredibilityStrip() {
  return (
    <section className="credibility-strip" aria-label="Verified technologies and stack">
      <span className="credibility-strip__label">Verified Technologies &amp; Working Stack</span>
      <div className="credibility-strip__techs">
        {verifiedTechnologies.map((tech) => (
          <span key={tech} className="credibility-strip__tag">
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  const featured = projects.slice(0, 3);
  const featuredArticles = articles.slice(0, 2);

  return (
    <PageFrame meta={homeMeta} path="/">
      <HomeHero />
      <CredibilityStrip />

      <section className="section" aria-labelledby="home-work-title">
        <Reveal className="section-head">
          <p className="eyebrow">Featured engineering</p>
          <h2 id="home-work-title">
            Systems built with
            <br />structure and rigor.
          </h2>
          <p className="lede">
            Practical AI engineering, full-stack web applications, and media workflows with concrete technical scope, validation boundaries, and test evidence.
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

      {/* About section: Engineering at the intersection of software and applied AI */}
      <section className="section split-section" aria-labelledby="home-about-title">
        <Reveal className="section-head section-head--sticky">
          <p className="eyebrow">Engineering approach</p>
          <h2 id="home-about-title">
            Engineering at
            <br />
            the intersection of
            <br />
            software and applied AI.
          </h2>
        </Reveal>
        <Reveal className="about-narrative" direction="right" delay={0.05}>
          <p>
            My approach to development is to understand the problem first, design a practical solution, and make the implementation testable and maintainable.
          </p>
          <p>
            I enjoy working across the software stack: building user-facing interfaces, connecting APIs and backend services, integrating AI capabilities, validating structured outputs, and investigating edge cases that can affect application reliability.
          </p>
          <p>
            My current project work includes AI-assisted clinical documentation and automated video creation. These projects give me opportunities to explore the engineering challenges behind language processing, structured data, application integration, and software quality.
          </p>
          <p>
            I also bring experience in documentation quality assurance and technical workflows, which informs my interest in validation, traceability, and dependable software behaviour.
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <Link className="link-underline" to="/about">
              Read complete background &amp; experience <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Skills section: Categorized engineering competencies */}
      <section className="section" aria-labelledby="home-skills-title">
        <Reveal className="section-head">
          <p className="eyebrow">Technical capabilities</p>
          <h2 id="home-skills-title">
            Skills organized by
            <br />engineering discipline.
          </h2>
          <p className="lede">
            Core competencies across frontend interfaces, backend APIs, applied AI pipelines, and software quality engineering.
          </p>
        </Reveal>

        <div className="skills-grid">
          {skillCategories.map((cat, idx) => (
            <Reveal key={cat.category} className="skill-card" delay={idx * 0.05}>
              <p className="eyebrow" style={{ fontSize: '0.68rem', marginBottom: '0.1rem' }}>
                Discipline 0{idx + 1}
              </p>
              <h3>{cat.category}</h3>
              <ul>
                {cat.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Selected Technical Writing Section */}
      <section className="section" aria-labelledby="home-writing-title">
        <Reveal className="section-head">
          <p className="eyebrow">Technical writing &amp; architecture notes</p>
          <h2 id="home-writing-title">
            Engineering essays on
            <br />applied AI &amp; systems.
          </h2>
          <p className="lede">
            In-depth architectural case studies and practical engineering notes exploring LLM verification, audio/video pipelines, and dependable software execution.
          </p>
        </Reveal>

        <div className="home-writing__grid">
          {featuredArticles.map((article, idx) => (
            <Reveal key={article.slug} className="blog-card" delay={idx * 0.08}>
              <div className="blog-card__header">
                <div className="blog-card__badges">
                  <span className="blog-card__category">{article.category}</span>
                  <span
                    className={`blog-card__status ${
                      article.status === 'published-case-study'
                        ? 'blog-card__status--case-study'
                        : 'blog-card__status--note'
                    }`}
                  >
                    {article.statusLabel}
                  </span>
                </div>
                <div className="blog-card__meta">
                  <Clock style={{ width: '0.85rem', height: '0.85rem' }} aria-hidden="true" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              <h3 className="blog-card__title">
                <Link to={`/blog/${article.slug}`}>{article.title}</Link>
              </h3>

              <p className="blog-card__desc">{article.description}</p>

              <div className="blog-card__tags">
                <Tag className="blog-card__tag-icon" aria-hidden="true" />
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="blog-card__tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="blog-card__footer">
                <Link to={`/blog/${article.slug}`} className="link-underline">
                  Read article <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Link className="wide-link" to="/blog">
          <span>Explore all technical writing, case studies &amp; notes</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      {/* Services Bridge: Client Engineering & Search Foundations */}
      <section className="section services-bridge" aria-labelledby="home-services-title">
        <Reveal className="section-head">
          <p className="eyebrow">Client Engineering &amp; Search Foundations</p>
          <h2 id="home-services-title">
            Engineering services for
            <br />
            web systems &amp; search.
          </h2>
          <p className="lede">
            In addition to software product engineering, I provide scoped technical consulting and implementation for independent businesses, practices, and technical teams.
          </p>
        </Reveal>

        <div className="services-bridge__grid">
          <Reveal className="services-bridge__card" amount={0.05} delay={0.05}>
            <div className="services-bridge__card-header">
              <span className="services-bridge__num">01</span>
              <h3>Business Website Development</h3>
            </div>
            <p>
              Component-based frontend architecture, responsive layout, API integrations, and scoped production deployment setup without fragile site-builders.
            </p>
            <Link to="/services#business-website-development" className="link-underline">
              View scope &amp; deliverables <ArrowUpRight aria-hidden="true" />
            </Link>
          </Reveal>

          <Reveal className="services-bridge__card" amount={0.05} delay={0.1}>
            <div className="services-bridge__card-header">
              <span className="services-bridge__num">02</span>
              <h3>Technical SEO Architecture</h3>
            </div>
            <p>
              Crawlability diagnostics, indexing configuration, Schema.org structured data, XML sitemaps, and Core Web Vitals performance remediation.
            </p>
            <Link to="/services#technical-seo" className="link-underline">
              View scope &amp; deliverables <ArrowUpRight aria-hidden="true" />
            </Link>
          </Reveal>

          <Reveal className="services-bridge__card" amount={0.05} delay={0.15}>
            <div className="services-bridge__card-header">
              <span className="services-bridge__num">03</span>
              <h3>Local Search Visibility</h3>
            </div>
            <p>
              Google Business Profile optimization, NAP consistency auditing, LocalBusiness schema markup, and geographic relevance signals.
            </p>
            <Link to="/services#local-seo" className="link-underline">
              View scope &amp; deliverables <ArrowUpRight aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <Link className="wide-link" to="/services">
          <span>Explore all services, deliverables &amp; scope boundaries</span>
          <ArrowRight aria-hidden="true" />
        </Link>
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
          <p className="eyebrow">About Akther Naimudheen</p>
          <h1 id="about-title">
            <span className="sr-only">About Akther Naimudheen — AI Engineer &amp; Software Developer. </span>
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
              Reliable software starts with sound architecture, clear interfaces and rigorous validation.
            </h2>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="about-skills-title">
        <Reveal className="section-head">
          <p className="eyebrow">Technical capabilities</p>
          <h2 id="about-skills-title">
            Skills organized by
            <br />engineering discipline.
          </h2>
          <p className="lede">
            Core competencies across frontend interfaces, backend APIs, applied AI pipelines, and software quality engineering.
          </p>
        </Reveal>

        <div className="skills-grid">
          {skillCategories.map((cat, idx) => (
            <Reveal key={cat.category} className="skill-card" delay={idx * 0.05}>
              <p className="eyebrow" style={{ fontSize: '0.68rem', marginBottom: '0.1rem' }}>
                Discipline 0{idx + 1}
              </p>
              <h3>{cat.category}</h3>
              <ul>
                {cat.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </Reveal>
          ))}
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
          <p className="eyebrow">Engineering projects · Akther Naimudheen</p>
          <h1 id="work-title">
            <span className="sr-only">AI Projects &amp; Software Systems by Akther Naimudheen. </span>
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
            <strong>iScribe &amp; PromptToShort Architecture</strong>
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
      <ProjectStructuredData project={project} />

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
          {project.liveUrl && (
            <div style={{ marginTop: '1.5rem' }}>
              <a
                className="btn btn--signal"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Launch {project.title} <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          )}
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
  const [searchParams] = useSearchParams();
  const subjectParam = searchParams.get('subject') || searchParams.get('service') || '';
  const emailHref = subjectParam
    ? `mailto:${profile.email}?subject=${encodeURIComponent(subjectParam)}`
    : `mailto:${profile.email}`;

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
            <span>Have a software problem</span>
            <span>worth solving?</span>
          </h1>
          <p className="lede">
            I'm interested in software development opportunities involving full-stack applications, applied AI, API integrations, and engineering-focused product development. If you're building something useful or looking for a developer who enjoys solving practical technical problems, let's connect.
          </p>
          {subjectParam && (
            <div style={{ marginBottom: '1.25rem', padding: '0.65rem 0.95rem', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--hairline-dark)', borderRadius: '2px', fontSize: '0.84rem', color: 'var(--on-dark)' }}>
              Enquiry focus: <strong>{subjectParam.replace(/^Enquiry:\s*/i, '')}</strong>
            </div>
          )}
          <div className="contact__actions">
            <a className="btn btn--signal" href={emailHref}>
              Email Akther Naimudheen <Mail aria-hidden="true" />
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
        <p className="eyebrow">Connect &amp; Collaborate</p>
        <h2 id="cta-title">
          Have a software problem
          <br />
          worth solving?
        </h2>
        <p className="lede" style={{ maxWidth: '640px', margin: '1rem 0 1.5rem' }}>
          I'm interested in software development opportunities involving full-stack applications, applied AI, API integrations, and engineering-focused product development. If you're building something useful or looking for a developer who enjoys solving practical technical problems, let's connect.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link className="btn" to="/contact">
            Contact Me <ArrowRight aria-hidden="true" />
          </Link>
          <a className="link-underline" href={`mailto:${profile.email}`}>
            {profile.email} <Mail aria-hidden="true" />
          </a>
          <a className="link-underline" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function BlogPage() {
  return (
    <PageFrame meta={blogMeta} path="/blog">
      <BlogIndex />
    </PageFrame>
  );
}

function HybridAiArticlePage() {
  const article = getArticleBySlug('hybrid-ai-architecture-cpu-guardrails');
  return (
    <PageFrame meta={hybridAiArticleMeta} path="/blog/hybrid-ai-architecture-cpu-guardrails">
      {article && <DynamicArticleStructuredData article={article} />}
      <HybridAiArticle />
    </PageFrame>
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

function DynamicArticlePage() {
  const { slug } = useParams();
  if (!slug) return <NotFound />;

  const article = getArticleBySlug(slug);
  if (!article) return <NotFound />;

  // Flagship clinical article: exact preservation of custom component
  if (article.slug === 'building-clinical-ai-beyond-transcription' || article.componentName === 'ClinicalAiArticle') {
    return <ClinicalAiArticlePage />;
  }

  // Hybrid AI architecture monograph: exact preservation of custom component
  if (article.slug === 'hybrid-ai-architecture-cpu-guardrails' || article.componentName === 'HybridAiArticle') {
    return <HybridAiArticlePage />;
  }

  const meta = buildArticleMeta(article);
  return (
    <PageFrame meta={meta} path={`/blog/${article.slug}`}>
      <DynamicArticleStructuredData article={article} />
      <StructuredArticlePage article={article} />
    </PageFrame>
  );
}

function ServicesRoutePage() {
  return (
    <PageFrame meta={servicesMeta} path="/services">
      <ServicesStructuredData />
      <ServicesPage />
    </PageFrame>
  );
}

function ProjectsSlugRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/work/${slug ?? ''}`} replace />;
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
      <Route path="/projects" element={<Navigate to="/work" replace />} />
      <Route path="/projects/:slug" element={<ProjectsSlugRedirect />} />
      <Route path="/writing" element={<Navigate to="/blog" replace />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/building-clinical-ai-beyond-transcription" element={<ClinicalAiArticlePage />} />
      <Route path="/blog/hybrid-ai-architecture-cpu-guardrails" element={<HybridAiArticlePage />} />
      <Route path="/blog/:slug" element={<DynamicArticlePage />} />
      <Route path="/services" element={<ServicesRoutePage />} />
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
