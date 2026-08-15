import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: ReactNode;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: { part1: string; part2: string };
  socialLinks: { icon: LucideIcon; href: string; label: string }[];
  locationText: string;
  className?: string;
}

const NavLink = ({ href, children, onClick }: { href: string; children: ReactNode; onClick?: () => void }) => (
  <a href={href} onClick={onClick} className="nav-link">{children}</a>
);

const SocialIcon = ({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) => (
  <a href={href} className="icon-link" aria-label={label}><Icon aria-hidden="true" /></a>
);

export function MinimalistHero({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
}: MinimalistHeroProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section id="home" className={cn('hero-shell', className)} aria-labelledby="hero-title">
      <header className="site-header">
        <motion.a
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={transition}
          className="brand-mark"
          href="#home"
          aria-label="Akther V N, home"
        >
          {logoText}<span aria-hidden="true">.</span>
        </motion.a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => <NavLink key={link.label} href={link.href}>{link.label}</NavLink>)}
        </nav>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <div id="mobile-menu" className={cn('mobile-nav', menuOpen && 'mobile-nav--open')}>
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</NavLink>
          ))}
        </div>
      </header>

      <div className="hero-grid">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reducedMotion ? 0 : 0.72 }}
        >
          <p className="hero-intro">{mainText}</p>
          <a className="text-link" href={readMoreLink}>Read more</a>
        </motion.div>

        <div className="portrait-stage">
          <motion.div
            className="portrait-circle"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...transition, delay: reducedMotion ? 0 : 0.15 }}
          />
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="portrait-image"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, duration: reducedMotion ? 0 : 0.95, delay: reducedMotion ? 0 : 0.3 }}
          />
        </div>

        <motion.div
          className="hero-title-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reducedMotion ? 0 : 0.88 }}
        >
          <h1 id="hero-title" className="hero-title">{overlayText.part1}<br />{overlayText.part2}</h1>
        </motion.div>
      </div>

      <footer className="hero-footer">
        <div className="hero-socials">
          {socialLinks.map((link) => <SocialIcon key={link.label} {...link} />)}
        </div>
        <p>{locationText}</p>
      </footer>
    </section>
  );
}
