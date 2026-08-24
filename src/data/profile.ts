export type CapabilityIcon = 'build' | 'discover' | 'grow' | 'automate';

export interface JourneyEntry {
  year: string;
  title: string;
  text: string;
}

export interface Capability {
  icon: CapabilityIcon;
  title: string;
  text: string;
}

export const profile = {
  name: 'Akther V N',
  /* Single source for the professional positioning. Drives the hero H1's
     accessible name and every route title, so the visible heading and the
     semantic/SEO name can never drift apart. */
  positioning: 'AI-Enabled Digital Marketing & Web Developer',
  email: 'akthernaimudheen0@gmail.com',
  location: 'Kochi, Kerala, India',
  locationShort: 'Kochi, India',
  /* The same professional base as `location` above, split into its parts so the
     JSON-LD PostalAddress can be assembled field by field. Visible location and
     structured data therefore always describe the same place. */
  seoLocality: 'Kochi',
  seoRegion: 'Kerala',
  seoCountry: 'India',
  employer: 'Orestes Technology',
  resumeUrl: '/Akther-V-N-Resume.pdf',
  /* One photograph, one asset family, two presentations. The hero crops it as a
     tall editorial photograph and the About profile card as a conventional
     headshot, both from these same files — so nobody downloads the portrait
     twice. Widths match scripts/convert-project-images.py; 1023 is the master's
     native width, so there is no upscaled variant to ship. */
  portrait: {
    src: '/akther-portrait.webp',
    srcSet: '/akther-portrait-512.webp 512w, /akther-portrait-768.webp 768w, /akther-portrait.webp 1023w',
    width: 1023,
    height: 1537,
    alt: 'Portrait of Akther V N',
  },
  /* Right-facing transparent side profile used by the gaze-led homepage hero.
     The supplied cutout is preserved without a flip or a replacement matte;
     scripts/build-side-profile-variants.py only creates responsive WebP sizes. */
  portraitCutout: {
    src: '/akther-side-profile-cutout.webp',
    /* Two steps, not three: scripts/build-side-profile-variants.py trims the
       transparent margin down to a 718w master, and refuses to upscale, so a
       768w step would be invented pixels. */
    srcSet:
      '/akther-side-profile-cutout-512.webp 512w, /akther-side-profile-cutout.webp 718w',
    width: 718,
    height: 1279,
    alt: 'Akther V N in profile, facing right',
  },
  editorialPortrait: {
    src: '/akther-editorial-portrait.webp',
    srcSet: '/akther-editorial-portrait-512.webp 512w, /akther-editorial-portrait-768.webp 768w, /akther-editorial-portrait.webp 1024w',
    width: 1024,
    height: 1536,
    alt: 'Editorial three-quarter portrait of Akther V N',
  },
  cinematicPortrait: {
    src: '/akther-cinematic-portrait.webp',
    srcSet: '/akther-cinematic-portrait-768.webp 768w, /akther-cinematic-portrait-1152.webp 1152w, /akther-cinematic-portrait.webp 1536w',
    width: 1536,
    height: 1024,
    alt: 'Cinematic side portrait of Akther V N',
  },
} as const;

export const journey: JourneyEntry[] = [
  { year: '2018', title: 'Computer Engineering', text: 'A technical foundation at Maharajas Technological Institute, Thrissur.' },
  { year: '2021', title: 'Diploma completed', text: 'Practical grounding in computing, systems and technology.' },
  { year: '2022', title: 'Quality-sensitive digital work', text: 'Medical scribing training, structured documentation and attention to detail.' },
  { year: '2022—23', title: 'DeepScribe AI / QA', text: 'Reviewed AI-generated medical documentation through disciplined quality processes.' },
  { year: '2023—24', title: 'Wisedocs / OCR', text: 'Worked with accurate OCR-based documentation under strict turnaround requirements.' },
  { year: '2026', title: 'Digital marketing', text: 'Digital Marketing Intern at Orestes Technology, Infopark. Developed practical skills across SEO, social media, paid campaigns and web.' },
  { year: 'NOW', title: 'Connected digital experiences', text: 'Bringing development, search, marketing and AI-assisted workflows together.' },
];

export const capabilities: Capability[] = [
  { icon: 'build', title: 'Build', text: 'Responsive websites, landing pages, WordPress and practical front-end development.' },
  { icon: 'discover', title: 'Discover', text: 'SEO, Local SEO, on-page structure and search-focused website planning.' },
  { icon: 'grow', title: 'Grow', text: 'Meta Ads, Google Ads, content, campaign reporting and lead-generation thinking.' },
  { icon: 'automate', title: 'Automate', text: 'AI-assisted development, research, optimization and smarter digital workflows.' },
];
