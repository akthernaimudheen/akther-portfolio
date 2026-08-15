export type ProjectKind = 'signal' | 'hotel' | 'web' | 'lab';

export interface Project {
  id: string;
  index: string;
  title: string;
  eyebrow: string;
  kind: ProjectKind;
  visual: string;
  visualAlt: string;
  status: string;
  summary: string;
  areas: string[];
  result?: {
    label: string;
    value: string;
  }[];
  note?: string;
}

export const projects: Project[] = [
  {
    id: 'seaking-restaurant',
    index: '01',
    title: 'SeaKing Restaurant',
    eyebrow: 'Hospitality marketing · Kochi',
    kind: 'signal',
    visual: '/project-seaking-restaurant.png',
    visualAlt: 'Abstract glass communication portal representing restaurant marketing and local discovery',
    status: 'Campaign project',
    summary:
      'A hospitality marketing project connecting social content, Meta advertising, local visibility, campaign planning and performance reporting.',
    areas: ['Meta Ads', 'Local SEO', 'Google Business Profile', 'Content strategy'],
    result: [
      { label: 'Content views', value: '37,250+' },
      { label: 'Accounts reached', value: '8,808' },
      { label: 'Interactions', value: '1,585' },
      { label: 'Recruitment conversations', value: '102' },
    ],
    note: 'Project-reported campaign results; work was collaborative.',
  },
  {
    id: 'seaking-suites',
    index: '02',
    title: 'SeaKing Suites',
    eyebrow: 'Hotel marketing + web · MG Road, Kochi',
    kind: 'hotel',
    visual: '/project-seaking-suites.png',
    visualAlt: 'Sculptural hotel tower rising from water with a luminous digital pathway',
    status: 'Hospitality project',
    summary:
      'Digital marketing and web work for a hotel brand, bringing together local search, social media, staycation campaigns and website SEO planning.',
    areas: ['Website optimization', 'Local SEO', 'Social media', 'Search visibility'],
  },
  {
    id: 'website-projects',
    index: '03',
    title: 'Business Website Systems',
    eyebrow: 'Selected development work',
    kind: 'web',
    visual: '/project-website-systems.png',
    visualAlt: 'Layered glass interface system connected by precise pathways',
    status: 'Completed + ongoing work',
    summary:
      'Responsive websites and landing pages shaped around business goals, mobile usability, website structure, WordPress and SEO implementation.',
    areas: ['Responsive design', 'WordPress', 'Landing pages', 'On-page SEO'],
  },
  {
    id: 'technical-lab',
    index: '04',
    title: 'Technical Exploration Lab',
    eyebrow: 'Experiments + planned systems',
    kind: 'lab',
    visual: '/project-technical-lab.png',
    visualAlt: 'Crystalline computing core suspended inside orbital glass architecture',
    status: 'Clearly marked experiments',
    summary:
      'Exploration across modern React and Next.js websites, Firebase applications, Supabase planning, PWA concepts, APIs, hosting and AI-assisted workflows.',
    areas: ['React / Next.js', 'Firebase', 'Supabase planning', 'PWA concepts'],
    note: 'This division contains experiments and planned work, not completed client claims.',
  },
];
