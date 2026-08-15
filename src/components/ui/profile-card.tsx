import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  className?: string;
  compact?: boolean;
}

export function ProfileCard({ className, compact = false }: ProfileCardProps) {
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;
  const email = 'akthernaimudheen0@gmail.com';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <motion.article
      className={cn('profile-card', compact && 'profile-card--compact', className)}
      initial={reducedMotion ? false : { opacity: 0, y: 56, rotateY: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reducedMotion ? 0 : 0.82, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reducedMotion ? undefined : { y: -7, rotateX: 1.5, rotateY: -1.5 }}
    >
      <div className="profile-card__visual">
        <div className="profile-card__halo" aria-hidden="true" />
        <motion.img
          src="/akther-hero-cutout.png"
          alt="Side-profile portrait of Akther V N"
          loading="lazy"
          decoding="async"
          animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="profile-card__available"><i /> Available</span>
        <span className="profile-card__location"><MapPin aria-hidden="true" /> Thrissur, India</span>
      </div>
      <div className="profile-card__body">
        <p>WEB · SEARCH · MARKETING</p>
        <h3>Akther V N</h3>
        <span>Web development, SEO and digital marketing shaped around useful business outcomes.</span>
        <div className="profile-card__actions">
          <a href={`mailto:${email}`}>Start a conversation <ArrowUpRight aria-hidden="true" /></a>
          <button type="button" onClick={copyEmail} aria-label="Copy email address">
            <AnimatePresence mode="wait" initial={false}>
              {copied
                ? <motion.span key="check" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}><Check aria-hidden="true" /></motion.span>
                : <motion.span key="copy" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}><Copy aria-hidden="true" /></motion.span>}
            </AnimatePresence>
          </button>
        </div>
        <small><Mail aria-hidden="true" /> {copied ? 'Email copied' : email}</small>
      </div>
    </motion.article>
  );
}
