export type CapabilityIcon = 'build' | 'discover' | 'grow' | 'automate';

export interface JourneyEntry {
  year: string;
  category: 'employment' | 'education' | 'certification' | 'projects';
  categoryLabel: string;
  title: string;
  roleOrCompany: string;
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
  positioning: 'AI Application Developer | Generative AI & Full-Stack Projects | Healthcare Documentation QA',
  email: 'akthernaimudheen0@gmail.com',
  githubUrl: 'https://github.com/akthernaimudheen',
  linkedinUrl: 'https://www.linkedin.com/in/akther-naimudheen-3bbb24197/',
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
  portrait: {
    src: '/akther-portrait.webp',
    srcSet: '/akther-portrait-512.webp 512w, /akther-portrait-768.webp 768w, /akther-portrait.webp 1023w',
    width: 1023,
    height: 1537,
    alt: 'Portrait of Akther V N',
  },
  portraitCutout: {
    src: '/akther-side-profile-cutout.webp',
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
  /* Employment */
  {
    year: '2026 — Present',
    category: 'employment',
    categoryLabel: 'Professional Employment & Industry Experience',
    title: 'Web Development & Digital Systems',
    roleOrCompany: 'Orestes Technology, Infopark',
    text: 'Developing responsive web applications, modular frontend components, technical SEO architecture, and automation workflows.',
  },
  {
    year: 'Dec 2023 — Mar 2024',
    category: 'employment',
    categoryLabel: 'Professional Employment & Industry Experience',
    title: 'OCR Pipeline QA Specialist',
    roleOrCompany: 'Wisedocs',
    text: 'Executed quality assurance and verification on OCR-extracted medical records, ensuring entity classification accuracy under strict turnaround requirements.',
  },
  {
    year: 'Nov 2022 — Nov 2023',
    category: 'employment',
    categoryLabel: 'Professional Employment & Industry Experience',
    title: 'AI Clinical Documentation QA',
    roleOrCompany: 'Ritesource Infosystems · DeepScribe AI Project',
    text: 'Reviewed and audited ambient AI-generated clinical documentation for terminology precision, hallucination detection, schema compliance, and clinical narrative consistency.',
  },

  /* Education */
  {
    year: '2018 — 2021',
    category: 'education',
    categoryLabel: 'Technical Education',
    title: 'Diploma in Computer Engineering',
    roleOrCompany: 'Maharajas Technological Institute, Thrissur',
    text: '3-year State Board technical program providing practical foundations in computing, data structures, digital electronics, database systems, and software fundamentals.',
  },

  /* Certifications */
  {
    year: '2022',
    category: 'certification',
    categoryLabel: 'Certifications & Training',
    title: 'Certified Program in Medical Scribing',
    roleOrCompany: 'Luminis School of Medical Scribing, Thrissur',
    text: 'Comprehensive clinical documentation training covering medical terminology, anatomical systems, EHR workflow structures, and clinical note formatting.',
  },
  {
    year: '2026',
    category: 'certification',
    categoryLabel: 'Certifications & Training',
    title: 'Digital Marketing & Web Systems',
    roleOrCompany: 'InterSmart EduTech, Ernakulam',
    text: 'Certification program covering search optimization, digital analytics, web delivery, and performance measurement.',
  },

  /* Self-directed projects */
  {
    year: '2026',
    category: 'projects',
    categoryLabel: 'Self-Directed AI Engineering',
    title: 'AI Systems: iScribe & RShorts',
    roleOrCompany: 'Independent Engineering',
    text: 'Engineered iScribe (clinical documentation pipeline with multi-stage schema validation) and RShorts (automated vertical video pipeline with 160+ passing tests).',
  },
];

export const capabilities: Capability[] = [
  { icon: 'build', title: 'Full-Stack Applications', text: 'Building responsive, modular web applications with TypeScript, React, Next.js, and Firebase.' },
  { icon: 'discover', title: 'AI & LLM Integration', text: 'Integrating generative AI APIs, prompt engineering, structured JSON extraction, and speech-to-text pipelines.' },
  { icon: 'grow', title: 'QA & Verification', text: 'Applying structured quality checks, schema validation, error analysis, and regression test suites.' },
  { icon: 'automate', title: 'Systems & Delivery', text: 'Frontend performance, Core Web Vitals, CI/CD automation, and maintainable component architectures.' },
];
