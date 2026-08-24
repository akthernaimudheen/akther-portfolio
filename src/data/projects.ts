export type ProjectKind = 'signal' | 'hotel' | 'web' | 'lab';

/**
 * One block of a project's case study, rendered in array order.
 *
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
  visual: string;
  visualAlt: string;
  status: string;
  /**
   * Short label for the index rows on /work.
   *
   * Every value restates wording that already appears in that project's own
   * `caseStudy` list or `note` below - nothing is inferred about seniority,
   * ownership or job title.
   */
  role: string;
  summary: string;
  /**
   * Heading for the case-study panel. Deliberately per-project: one shared
   * heading across four different projects said nothing about any of them.
   * Each value only restates that project's own verified `summary`/`areas` —
   * no outcome or result is claimed here.
   */
  caseHeading: string;
  areas: string[];
  caseStudy: CaseStudySection[];
  result?: {
    label: string;
    value: string;
  }[];
  note?: string;
}

export const projects: Project[] = [
  {
    id: 'seaking-restaurant',
    title: 'SeaKing Restaurant',
    eyebrow: 'Hospitality marketing · Kochi',
    kind: 'signal',
    visual: '/project-seaking-restaurant.webp',
    visualAlt: 'Kerala dishes served in brass and stoneware bowls on a dark wood table in a restaurant dining room',
    status: 'Campaign project',
    /* First item of this project's own work list below. */
    role: 'Digital marketing',
    summary:
      'A hospitality marketing project connecting social content, Meta advertising, local visibility, campaign planning and performance reporting.',
    caseHeading: 'Search, social and paid, aligned.',
    areas: ['Meta Ads', 'Local SEO', 'Google Business Profile', 'Content strategy'],
    caseStudy: [
      {
        /* Sourced verbatim from the résumé's SeaKing Restaurant project entry
           (public/Akther-V-N-Resume.pdf, page 2). Nothing added. */
        heading: 'Campaign / work',
        items: [
          'Digital marketing',
          'Social media marketing',
          'Meta advertising',
          'Local SEO',
          'Google Business Profile',
          'Content strategy',
          'Campaign planning',
          'Marketing creatives',
          'Performance reporting',
          'Restaurant promotions',
          'Website-related digital work',
        ],
      },
    ],
    /* The three strongest figures documented in public/Akther-V-N-Resume.pdf
       (page 2). The résumé also records 1,585 total content interactions and
       1,339 accounts engaged — both measure engagement, so only the stronger of
       that pair would qualify, and neither beats the reach figure kept here. The
       résumé's "8 qualified leads" is deliberately not displayed. */
    result: [
      { label: 'Content views', value: '37,250+' },
      { label: 'Accounts reached', value: '8,808' },
      { label: 'Recruitment conversations', value: '102' },
    ],
    note: 'Project-reported campaign results; work was collaborative.',
  },
  {
    id: 'seaking-suites',
    title: 'SeaKing Suites',
    eyebrow: 'Hotel marketing + web · MG Road, Kochi',
    kind: 'hotel',
    visual: '/project-seaking-suites.webp',
    visualAlt: 'Hotel lobby with a stone reception desk, lounge seating and full-height windows onto greenery',
    status: 'Hospitality project',
    /* First item of this project's own digital-work list below. */
    role: 'Hotel digital marketing',
    summary:
      'Digital marketing and web work for a hotel brand, bringing together local search, social media, staycation campaigns and website SEO planning.',
    caseHeading: 'Search, social and the hotel website, aligned.',
    areas: ['Website optimization', 'Local SEO', 'Social media', 'Search visibility'],
    caseStudy: [
      {
        /* Sourced verbatim from the résumé's SeaKing Suites project entry
           (public/Akther-V-N-Resume.pdf, page 2). */
        heading: 'Digital work',
        items: [
          'Hotel digital marketing',
          'Website development and optimization',
          'Local SEO',
          'Google Business Profile',
          'Social media marketing',
          'Staycation campaigns',
          'Content strategy',
          'Search visibility',
          'Website SEO planning',
        ],
      },
    ],
  },
  {
    id: 'website-projects',
    title: 'Business Website Systems',
    eyebrow: 'Selected development work',
    kind: 'web',
    visual: '/project-website-systems.webp',
    visualAlt: 'Desktop monitor and laptop on a studio desk showing the same website layout at two screen sizes',
    status: 'Completed + ongoing work',
    /* Restates 'Website planning' / 'Business-focused website development'. */
    role: 'Website development',
    summary:
      'Responsive websites and landing pages shaped around business goals, mobile usability, website structure, WordPress and SEO implementation.',
    caseHeading: 'Responsive builds shaped around business goals.',
    areas: ['Responsive design', 'WordPress', 'Landing pages', 'On-page SEO'],
    caseStudy: [
      {
        /* Sourced verbatim from the résumé's Website Development Projects entry
           (public/Akther-V-N-Resume.pdf, page 2). */
        heading: 'Technology / systems',
        items: [
          'Website planning',
          'UI structure',
          'Responsive design',
          'Landing pages',
          'WordPress',
          'SEO implementation',
          'Mobile optimization',
          'Business-focused website development',
          'Modern web technologies',
        ],
      },
    ],
  },
  {
    id: 'technical-lab',
    title: 'Technical Exploration Lab',
    eyebrow: 'Experiments + planned systems',
    kind: 'lab',
    visual: '/project-technical-lab.webp',
    visualAlt: 'Desk with a monitor showing a model workflow diagram, a laptop running an experiment log, and engineering books',
    status: 'Clearly marked experiments',
    /* Restates the 'Experiments' section heading and the note below. */
    role: 'Self-directed experiments',
    summary:
      'Exploration across modern React and Next.js websites, Firebase applications, Supabase planning, PWA concepts, APIs, hosting and AI-assisted workflows.',
    caseHeading: 'Experiments across modern web systems.',
    areas: ['React / Next.js', 'Firebase', 'Supabase planning', 'PWA concepts'],
    /* Deliberately a different section set from the three client projects: goal
       and evidence of learning rather than challenge/role/outcome, so experiments
       are never framed as completed client engagements. */
    caseStudy: [
      {
        /* Sourced from the résumé's "Other project context" paragraph
           (public/Akther-V-N-Resume.pdf, page 3). */
        heading: 'Experiments',
        items: [
          'Business, hospitality and restaurant websites',
          'Digital marketing websites and landing pages',
          'E-commerce-related websites',
          'Modern Next.js websites',
          'Firebase-based applications',
          'Supabase-based application planning',
          'Vercel deployments, hosting and migration',
          'PWA and web application concepts',
        ],
      },
    ],
    note: 'This division contains experiments and planned work, not completed client claims.',
  },
];
