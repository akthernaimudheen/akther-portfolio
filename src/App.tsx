import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Lenis from 'lenis';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Braces,
  ChartNoAxesCombined,
  Download,
  Mail,
  MapPin,
  Menu,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Parallax, Reveal, ScrollMarquee, ScrollProgress } from '@/components/ScrollMotion';
import { ProfileCard } from '@/components/ui/profile-card';
import { ProjectVisualScene } from '@/components/ui/project-visual-scene';
import { projects } from '@/data/projects';

const FishBackground = lazy(() =>
  import('@/components/three/FishBackground').then((module) => ({ default: module.FishBackground })),
);
const ProjectGallery = lazy(() =>
  import('@/components/ProjectGallery').then((module) => ({ default: module.ProjectGallery })),
);

function useEnhancedBackground() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return enabled;
}

const journey = [
  { year: '2018', title: 'Computer Engineering', text: 'A technical foundation at Maharajas Technological Institute, Thrissur.' },
  { year: '2021', title: 'Diploma completed', text: 'Practical grounding in computing, systems and technology.' },
  { year: '2022', title: 'Quality-sensitive digital work', text: 'Medical scribing training, structured documentation and attention to detail.' },
  { year: '2022—23', title: 'DeepScribe AI / QA', text: 'Reviewed AI-generated medical documentation through disciplined quality processes.' },
  { year: '2023—24', title: 'Wisedocs / OCR', text: 'Worked with accurate OCR-based documentation under strict turnaround requirements.' },
  { year: '2026', title: 'Digital marketing', text: 'Developed practical skills across SEO, social media, paid campaigns and web.' },
  { year: 'NOW', title: 'Connected digital experiences', text: 'Bringing development, search, marketing and AI-assisted workflows together.' },
];

const capabilities = [
  { icon: Braces, number: '01', title: 'Build', text: 'Responsive websites, landing pages, WordPress and practical front-end development.' },
  { icon: Search, number: '02', title: 'Discover', text: 'SEO, Local SEO, on-page structure and search-focused website planning.' },
  { icon: ChartNoAxesCombined, number: '03', title: 'Grow', text: 'Meta Ads, Google Ads, content, campaign reporting and lead-generation thinking.' },
  { icon: Sparkles, number: '04', title: 'Automate', text: 'AI-assisted development, research, optimization and smarter digital workflows.' },
];

function SmoothScroll() {
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, [reducedMotion]);
  return null;
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(current > previous && current > 150 && !open);
  });
  const links = [['Home', '/'], ['About', '/about'], ['Work', '/work'], ['Contact', '/contact']];
  return (
    <motion.header
      className="premium-header"
      animate={{ y: hidden && !reducedMotion ? '-130%' : 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
    >
      <Link to="/" className="premium-brand" aria-label="Akther V N home">AKTHER<span>.</span></Link>
      <nav className="premium-nav" aria-label="Primary navigation">
        {links.map(([label, href]) => <NavLink key={href} to={href} end={href === '/'}>{label}</NavLink>)}
      </nav>
      <Link to="/contact" className="header-cta">Start a project <ArrowUpRight aria-hidden="true" /></Link>
      <button className="premium-menu" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="premium-mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav id="premium-mobile-nav" className={`premium-mobile-nav${open ? ' is-open' : ''}`} aria-label="Mobile navigation">
        {links.map(([label, href]) => <NavLink key={href} to={href} onClick={() => setOpen(false)}>{label}</NavLink>)}
      </nav>
    </motion.header>
  );
}

function PageFrame({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const renderFish = useEnhancedBackground();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      {renderFish ? (
        <Suspense fallback={<div className="fish-canvas fish-canvas--fallback" aria-hidden="true" />}>
          <FishBackground reducedMotion={reducedMotion ?? false} />
        </Suspense>
      ) : <div className="fish-canvas fish-canvas--fallback" aria-hidden="true" />}
      <SiteHeader />
      <AnimatePresence mode="wait">
        <motion.main
          id="main-content"
          key={location.pathname}
          className="premium-main"
          initial={reducedMotion ? false : { opacity: 0, y: 30, filter: 'blur(10px)', clipPath: 'inset(0 0 5% 0)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0% 0)' }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -24, filter: 'blur(8px)', clipPath: 'inset(5% 0 0 0)' }}
          transition={{ duration: reducedMotion ? 0 : 0.62, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </>
  );
}

function HomePage() {
  const reducedMotion = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const portraitStageRef = useRef<HTMLDivElement>(null);
  const portraitZoomTarget = useMotionValue(1);
  const portraitShiftXTarget = useMotionValue(0);
  const portraitShiftYTarget = useMotionValue(0);
  const portraitZoom = useSpring(portraitZoomTarget, { stiffness: 150, damping: 22, mass: 0.45 });
  const portraitShiftX = useSpring(portraitShiftXTarget, { stiffness: 140, damping: 24, mass: 0.45 });
  const portraitShiftY = useSpring(portraitShiftYTarget, { stiffness: 140, damping: 24, mass: 0.45 });
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const copyY = useTransform(heroProgress, [0, 1], reducedMotion ? [0, 0] : [0, -110]);
  const copyScale = useTransform(heroProgress, [0, 1], reducedMotion ? [1, 1] : [1, 0.94]);
  const copyOpacity = useTransform(heroProgress, [0, 0.76, 1], reducedMotion ? [1, 1, 1] : [1, 0.76, 0.18]);
  const portraitY = useTransform(heroProgress, [0, 1], reducedMotion ? [0, 0] : [0, 145]);
  const portraitScale = useTransform(heroProgress, [0, 1], reducedMotion ? [1, 1] : [1, 1.08]);
  const blueOrbY = useTransform(heroProgress, [0, 1], reducedMotion ? [0, 0] : [0, 190]);
  const peachOrbY = useTransform(heroProgress, [0, 1], reducedMotion ? [0, 0] : [0, -125]);

  const resetPortraitProximity = () => {
    portraitZoomTarget.set(1);
    portraitShiftXTarget.set(0);
    portraitShiftYTarget.set(0);
  };

  const handleHeroPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch' || !portraitStageRef.current) return;
    const rect = portraitStageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const radius = Math.max(rect.width, rect.height) * 0.9;
    const proximity = Math.max(0, Math.min(1, 1 - distance / radius));

    portraitZoomTarget.set(1 + proximity * 0.16);
    portraitShiftXTarget.set((dx / Math.max(rect.width, 1)) * proximity * 9);
    portraitShiftYTarget.set((dy / Math.max(rect.height, 1)) * proximity * 6);
  };

  return (
    <PageFrame>
      <section
        ref={heroRef}
        className="glass-hero editorial-hero"
        aria-labelledby="home-title"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={resetPortraitProximity}
      >
        <motion.div className="glass-orb glass-orb--blue" style={{ y: blueOrbY }} aria-hidden="true" />
        <motion.div className="glass-orb glass-orb--peach" style={{ y: peachOrbY }} aria-hidden="true" />
        <div className="glass-grid" aria-hidden="true" />
        <motion.div
          className="glass-copy-card"
          style={{ y: copyY, scale: copyScale, opacity: copyOpacity }}
          initial={reducedMotion ? false : { opacity: 0, y: 30, scale: .98 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : .7, delay: .12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-availability"><span /> Available for selected opportunities</div>
          <h1 id="home-title"><span>WEB</span><strong>DEVELOPER</strong><i aria-hidden="true">*</i></h1>
          <p className="glass-role">I BUILD DIGITAL EXPERIENCES<br /><strong>THAT CONNECT AND PERFORM.</strong></p>
          <p className="glass-summary">I connect technology and marketing to build useful digital experiences around real business goals.</p>
          <div className="editorial-actions">
            <span className="glass-cta" aria-hidden="true"><ArrowRight /></span>
            <Link className="editorial-text-link" to="/work">View selected work <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </motion.div>

        <motion.div
          ref={portraitStageRef}
          className="glass-portrait-stage"
          style={{ y: portraitY, scale: portraitScale }}
          initial={reducedMotion ? false : { opacity: 0, y: 140, scale: .92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: reducedMotion ? 'tween' : 'spring', duration: reducedMotion ? 0 : undefined, stiffness: 92, damping: 16, delay: .18 }}
        >
          <motion.div className="glass-portrait-float" animate={reducedMotion ? undefined : { y: [0, -10, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="glass-portrait-halo" aria-hidden="true" />
            <motion.img
              src="/akther-hero-cutout.png"
              alt="Side-profile portrait of Akther V N"
              style={{ scale: portraitZoom, x: portraitShiftX, y: portraitShiftY }}
            />
            <div className="glass-identity-chip"><span>AVAILABLE</span><small>FOR SELECTED PROJECTS</small></div>
          </motion.div>
        </motion.div>
        <div className="glass-scroll">Move near portrait / scroll <span>↓</span></div>
        <div className="editorial-skill-strip" aria-label="Core disciplines">
          <span><strong>01</strong><small>Web<br />Development</small></span>
          <span><strong>02</strong><small>Search Engine<br />Optimization</small></span>
          <span><strong>03</strong><small>Digital<br />Marketing</small></span>
          <span><strong>04</strong><small>AI-Assisted<br />Workflows</small></span>
        </div>
      </section>

      <ScrollMarquee />

      <section className="premium-section home-work">
        <Reveal className="premium-heading" amount={0.35}>
          <p>01 / SELECTED WORK</p>
          <h2>Built where systems<br />meet <em>attention.</em></h2>
          <Link to="/work">View every project <ArrowUpRight aria-hidden="true" /></Link>
        </Reveal>
        <div className="featured-grid">
          {projects.slice(0, 2).map((project, index) => (
            <motion.div
              className="featured-card-shell"
              key={project.id}
              style={{ top: `calc(7rem + ${index * 1.25}rem)` }}
              initial={reducedMotion ? false : { opacity: 0, y: 90, rotateX: 6, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reducedMotion ? 0 : 0.85, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={`/work/${project.id}`} className="featured-card">
                <div className={`featured-visual featured-visual--${project.kind}`}>
                  <ProjectVisualScene
                    src={project.visual}
                    alt={project.visualAlt}
                    kind={project.kind}
                    index={project.index}
                    eager={index === 0}
                  />
                </div>
                <div><p>{project.eyebrow}</p><h3>{project.title}</h3><span>Open case study <ArrowUpRight aria-hidden="true" /></span></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="premium-section capability-stage">
        <Reveal className="premium-heading"><p>02 / CAPABILITIES</p><h2>One connected<br /><em>approach.</em></h2></Reveal>
        <div className="capability-orbit-grid">
          {capabilities.map(({ icon: Icon, number, title, text }, index) => (
            <motion.article
              key={number}
              initial={reducedMotion ? false : { opacity: 0, y: 70, rotateY: index % 2 ? -8 : 8 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: reducedMotion ? 0 : 0.72, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            ><span>{number}</span><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p></motion.article>
          ))}
        </div>
      </section>

      <CtaSection />
    </PageFrame>
  );
}

function JourneyTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 42%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.35 });

  return (
    <div className="journey-timeline">
      <div className="journey-progress-track" aria-hidden="true"><motion.i style={{ scaleY: progress }} /></div>
      <ol ref={ref}>
      {journey.map((item, index) => (
        <motion.li
          key={`${item.year}-${item.title}`}
          initial={reducedMotion ? false : { opacity: 0, x: index % 2 ? 60 : -60, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.42 }}
          transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>{item.year}</span><div className="timeline-node" /><div><h3>{item.title}</h3><p>{item.text}</p></div>
        </motion.li>
      ))}
      </ol>
    </div>
  );
}

function AboutPage() {
  return (
    <PageFrame>
      <section className="page-hero about-page-hero">
        <Reveal className="page-hero-motion" amount={0.5}>
          <p className="premium-kicker">ABOUT / JOURNEY</p>
          <h1>A technical mind<br />with a <em>marketing lens.</em></h1>
          <p className="page-lead">My path is not a straight line. Every stage added another layer: systems thinking, quality discipline, AI-assisted workflows, search, marketing and web development.</p>
        </Reveal>
      </section>
      <section className="story-grid premium-section">
        <Parallax className="story-profile" distance={55}><ProfileCard /></Parallax>
        <Reveal direction="right"><p className="premium-kicker">THE INTERSECTION</p><h2>I understand how digital systems are built—and how they create value.</h2><p>I combine practical development with SEO and digital marketing, keeping the final experience clear for the person using it and useful for the business behind it.</p></Reveal>
      </section>
      <section className="about-visual-chapter premium-section">
        <Reveal direction="left"><p className="premium-kicker">SYSTEMS / STORY / MOTION</p><h2>Different skills.<br />One <em>connected system.</em></h2></Reveal>
        <ProjectVisualScene
          src={projects[2].visual}
          alt={projects[2].visualAlt}
          kind={projects[2].kind}
          index="A / 03"
        />
      </section>
      <section className="journey-path premium-section">
        <Reveal className="premium-heading"><p>THE JOURNEY</p><h2>From accuracy<br />to <em>impact.</em></h2></Reveal>
        <JourneyTimeline />
      </section>
      <CtaSection />
    </PageFrame>
  );
}

function WorkPage() {
  return (
    <PageFrame>
      <section className="page-hero work-page-hero">
        <Reveal className="page-hero-motion" amount={0.5}>
          <p className="premium-kicker">WORK / CASE STUDIES</p>
          <h1>Digital work<br />with <em>depth.</em></h1>
          <p className="page-lead">Web, local search, paid media and experiments—presented as dedicated project worlds instead of compressed accordions.</p>
        </Reveal>
      </section>
      <section className="premium-section work-index">
        <Suspense fallback={<div className="project-loading">Loading project worlds…</div>}><ProjectGallery /></Suspense>
      </section>
      <CtaSection />
    </PageFrame>
  );
}

function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.id === slug);
  const reducedMotion = useReducedMotion() ?? false;
  if (!project) return <NotFound />;
  return (
    <PageFrame>
      <section className={`project-page-hero project-page-hero--${project.kind}`}>
        <Link to="/work" className="back-link"><ArrowLeft aria-hidden="true" /> All work</Link>
        <motion.div initial={reducedMotion ? false : { opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reducedMotion ? 0 : 0.78, ease: [0.16, 1, 0.3, 1] }}><p className="premium-kicker">{project.eyebrow}</p><h1>{project.title}</h1><p>{project.summary}</p></motion.div>
        <motion.div className="case-visual" initial={reducedMotion ? false : { opacity: 0, scale: 0.88, rotateY: -10 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: reducedMotion ? 0 : 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}>
          <ProjectVisualScene src={project.visual} alt={project.visualAlt} kind={project.kind} index={project.index} eager />
        </motion.div>
      </section>
      <section className="case-body premium-section">
        <Reveal direction="left"><p className="premium-kicker">PROJECT VIEW</p><h2>A connected digital system.</h2></Reveal>
        <Reveal className="case-copy" direction="right" delay={0.08}><p>{project.summary}</p><div className="project-tags">{project.areas.map((area) => <span key={area}>{area}</span>)}</div>{project.note && <p className="case-note">{project.note}</p>}</Reveal>
      </section>
      {project.result && <section className="metrics-stage premium-section"><motion.p className="premium-kicker" initial={reducedMotion ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: reducedMotion ? 0 : .6 }}>REPORTED SIGNALS</motion.p><div>{project.result.map((result, index) => <motion.article key={result.label} initial={reducedMotion ? false : { opacity: 0, y: 55, scale: 0.94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: reducedMotion ? 0 : 0.62, delay: index * 0.08 }}><strong>{result.value}</strong><span>{result.label}</span></motion.article>)}</div></section>}
      <section className="next-project"><Link to={`/work/${projects[(projects.indexOf(project) + 1) % projects.length].id}`}><span>NEXT PROJECT</span><strong>{projects[(projects.indexOf(project) + 1) % projects.length].title}</strong><ArrowRight aria-hidden="true" /></Link></section>
    </PageFrame>
  );
}

function ContactPage() {
  const reducedMotion = useReducedMotion() ?? false;
  return (
    <PageFrame>
      <section className="contact-page">
        <motion.div className="contact-orb-premium" aria-hidden="true" initial={reducedMotion ? false : { opacity: 0, scale: 0.72, rotate: -18 }} animate={{ opacity: .46, scale: 1, rotate: 0 }} transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }} />
        <div className="contact-layout">
          <div className="contact-copy">
            <motion.p className="premium-kicker" initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .6 }}>CONTACT / START A CONVERSATION</motion.p>
            <motion.h1 initial={reducedMotion ? false : { opacity: 0, y: 65, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: reducedMotion ? 0 : .85, delay: .08, ease: [0.16, 1, 0.3, 1] }}>Let’s build something<br /><em>useful.</em></motion.h1>
            <motion.p initial={reducedMotion ? false : { opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .65, delay: .2 }}>Have a website, marketing system or digital idea in mind? Tell me what you’re working on.</motion.p>
            <motion.div className="contact-page-actions" initial={reducedMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .6, delay: .3 }}>
              <a className="orb-button" href="mailto:akthernaimudheen0@gmail.com">Email Akther <Mail aria-hidden="true" /></a>
              <a className="quiet-link" href="/Akther-V-N-Resume.pdf" download>Download résumé <Download aria-hidden="true" /></a>
            </motion.div>
            <motion.div className="contact-details" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : .7, delay: .4 }}><span><Mail aria-hidden="true" /> akthernaimudheen0@gmail.com</span><span><MapPin aria-hidden="true" /> Thrissur, Kerala, India</span></motion.div>
          </div>
          <ProfileCard compact />
        </div>
      </section>
    </PageFrame>
  );
}

function CtaSection() {
  return <section className="premium-cta"><Parallax className="cta-glow" distance={90}><span /></Parallax><Reveal className="premium-cta__content" direction="scale" amount={0.45}><p>HAVE AN IDEA?</p><h2>Let’s make it<br /><em>matter.</em></h2><Link className="orb-button" to="/contact">Start a conversation <ArrowUpRight aria-hidden="true" /></Link></Reveal></section>;
}

function NotFound() {
  return <PageFrame><section className="contact-page"><p className="premium-kicker">404 / NOT FOUND</p><h1>This path<br /><em>drifted away.</em></h1><Link className="orb-button" to="/">Return home <ArrowLeft aria-hidden="true" /></Link></section></PageFrame>;
}

function AppRoutes() {
  return <Routes><Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/work" element={<WorkPage />} /><Route path="/work/:slug" element={<ProjectPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<NotFound />} /></Routes>;
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
