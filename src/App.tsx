import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Mail, MapPin, Menu, X } from 'lucide-react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { CountUp } from '@/components/CountUp';
import { CursorFollower } from '@/components/CursorFollower';
import { ProjectGallery } from '@/components/ProjectGallery';
import { Reveal } from '@/components/ScrollMotion';
import { PersonStructuredData, Seo } from '@/components/Seo';
import { ProjectVisualScene } from '@/components/ui/project-visual-scene';
import { usePointerDrift } from '@/lib/pointer';
import { projects } from '@/data/projects';
import { capabilities, journey, profile } from '@/data/profile';
import {
  aboutMeta,
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
            Web development, SEO and digital campaigns. Currently a Digital Marketing Intern at
            {' '}{profile.employer}.
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
          <p className="eyebrow">Details</p>
          <ul>
            <li>
              <a href={profile.resumeUrl} download>
                Résumé (PDF)
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
        Web development · SEO · Digital campaigns
      </motion.p>

      <motion.h1 className="hero__title" id="home-title" {...step(0.06)}>
        <span className="hero__title-lead" ref={leadRef}>
          <span>I build</span>
          <span>the page.</span>
        </span>
        <span className="hero__title-sub" ref={subRef}>
          <span>Then I help</span>
          <span>people find it.</span>
        </span>
      </motion.h1>

      {/* The yellow field sits below the headline and the portrait above it, so
          the type reads as black-on-yellow while the face stays clear. */}
      <motion.div className="hero__field" aria-hidden="true" {...step(0.12)}>
        <span ref={fieldRef} />
      </motion.div>

      {/* Entrance lives on the figure; usePointerDrift owns the inner <img>
          transform, so Framer Motion and the pointer loop never write to the
          same node. */}
      <motion.figure
        className="hero__figure"
        initial={reduced ? false : { opacity: 0, y: 80, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reduced ? { duration: 0 } : PORTRAIT_ENTRANCE}
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
          I’m Akther V N, a digital marketing intern at Orestes Technology and a web developer in
          Kerala. I work across responsive websites, local search, content and paid campaigns.
        </p>
        <div className="hero__actions">
          <Link className="btn" to="/work">
            View my work <ArrowRight aria-hidden="true" />
          </Link>
          <a className="link-underline" href={`mailto:${profile.email}`}>
            Email me <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </motion.div>

      <div className="hero__rail">
        <span>{profile.employer}</span>
        <span>Digital Marketing Intern</span>
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
          <p className="eyebrow">Selected work</p>
          <h2 id="home-work-title">
            Projects with
            <br />a job to get done.
          </h2>
          <p className="lede">
            Websites, search work and campaigns, each presented with the scope, my contribution and
            the evidence that exists.
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
                    Open project <ArrowUpRight aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Link className="wide-link" to="/work">
          <span>See the full project index</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <section className="section split-section" aria-labelledby="home-capability-title">
        <Reveal className="section-head section-head--sticky">
          <p className="eyebrow">How I work</p>
          <h2 id="home-capability-title">
            The website
            <br />
            and the way
            <br />
            people reach it.
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
            <p className="eyebrow">Current role</p>
            <h2 id="home-role-title">
              Digital Marketing Intern
              <br />
              at Orestes Technology.
            </h2>
          </Reveal>
          <Reveal className="ink-panel__copy" direction="right">
            <p>
              My current work covers SEO, social media, paid campaigns and website-related digital
              work. I bring a technical background to each brief.
            </p>
            <Link className="link-underline" to="/about">
              Read about my path <ArrowUpRight aria-hidden="true" />
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
            <span>I came to</span>
            <span>marketing through</span>
            <span>systems, accuracy</span>
            <span>and code.</span>
          </h1>
          <p className="lede">
            I build websites and support the search, content and campaigns that bring people to
            them.
          </p>
          <p>
            I’m based in Kochi, Kerala. My background includes computer engineering, quality-focused
            documentation work and digital marketing at Orestes Technology, where I work as a
            Digital Marketing Intern.
          </p>
          <a className="link-underline" href={profile.resumeUrl} download>
            Download résumé <Download aria-hidden="true" />
          </a>
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
            <p className="eyebrow">The connection</p>
            <h2>
              I understand the build, then I look at the search path, the message and the business
              goal.
            </h2>
          </Reveal>
        </div>
      </section>

      <section className="section split-section" aria-labelledby="about-experience-title">
        <Reveal className="section-head section-head--sticky">
          <p className="eyebrow">Experience</p>
          <h2 id="about-experience-title">
            A technical path
            <br />
            into digital work.
          </h2>
          <p className="lede">
            Each role strengthened the same habits: clear structure, careful review and work that
            holds up under use.
          </p>
        </Reveal>
        <div className="experience-list">
          {journey.map((item, index) => (
            <Reveal
              className="experience-row"
              key={`${item.year}-${item.title}`}
              amount={0.3}
              delay={Math.min(index, 4) * 0.05}
            >
              <h3>{item.title}</h3>
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
          <p className="eyebrow">Selected work</p>
          <h1 id="work-title">
            <span>Websites, search</span>
            <span>and campaigns</span>
            <span>under one roof.</span>
          </h1>
          <p className="lede">
            Each project states the scope, my contribution and the evidence available. Nothing is
            claimed beyond what the project material supports.
          </p>
        </div>
        <Link className="work-hero__lead" to={`/work/${featured.id}`}>
          <ProjectVisualScene src={featured.visual} alt={featured.visualAlt} interactive eager />
          <div>
            <span>Featured — {featured.status}</span>
            <strong>{featured.title}</strong>
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
        <ProjectVisualScene src={project.visual} alt={project.visualAlt} interactive eager />
      </motion.div>

      <section className="section split-section" aria-labelledby="case-title">
        <Reveal className="section-head section-head--sticky">
          <p className="eyebrow">Project view</p>
          <h2 id="case-title">{project.caseHeading}</h2>
        </Reveal>
        <Reveal className="case-copy" direction="right" delay={0.05}>
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
            <span>Tell me what</span>
            <span>you’re building.</span>
          </h1>
          <p className="lede">
            Send the brief, the problem or the unfinished idea. I work across websites, search and
            digital campaigns.
          </p>
          <div className="contact__actions">
            <a className="btn btn--signal" href={`mailto:${profile.email}`}>
              Email Akther <Mail aria-hidden="true" />
            </a>
            <a className="link-underline" href={profile.resumeUrl} download>
              Download résumé <Download aria-hidden="true" />
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
        <p className="eyebrow">Have a project in mind?</p>
        <h2 id="cta-title">
          Start with the brief.
          <br />
          We’ll find the next step.
        </h2>
        <Link className="btn" to="/contact">
          Contact Akther <ArrowUpRight aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
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
