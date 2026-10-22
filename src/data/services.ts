export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServicePillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  targetClient: string;
  problemsAddressed: string[];
  deliverables: ServiceDeliverable[];
  process: ServiceProcessStep[];
  exclusions: string[];
  nextStep: {
    description: string;
    ctaText: string;
    contactSubject: string;
  };
}

export const services: ServicePillar[] = [
  {
    id: 'business-website-development',
    number: '01',
    title: 'Business Website Development',
    subtitle: 'Architecture, Responsive Implementation & Production Handover',
    summary:
      'Component-based frontend engineering and web systems for independent practices, service firms, and growing businesses that require fast load times, accessible layouts, and reliable deployment without fragile site-builders.',
    targetClient:
      'Independent practices, professional service operators, local enterprises, and founders who need a dependable, modern web presence built with clean code and maintainable architecture.',
    problemsAddressed: [
      'Bloated CMS setups and fragile page-builder plugins that slow down loading and break during routine updates.',
      'Sluggish mobile experiences and poor layout responsiveness causing visitor drop-off.',
      'Disjointed inquiry workflows, unverified contact forms, or missing integration with email and booking tools.',
      'Unstructured deployment pipelines lacking SSL, DNS configuration, and automated continuous delivery.',
    ],
    deliverables: [
      {
        title: 'Component-Based Web Architecture',
        description:
          'Modern frontend built with TypeScript, React, Next.js, or lightweight static generation designed for fast execution, maintainability, and clean code separation.',
      },
      {
        title: 'Mobile-First Responsive Layout',
        description:
          'Accessible, cross-browser interfaces rigorously tested across desktop, tablet, and mobile screens with semantic HTML5 hierarchy and keyboard navigation.',
      },
      {
        title: 'Lead Capture & Business Integration',
        description:
          'Robust contact form handling, inquiry workflows, API integrations, and lightweight event tracking without performance-degrading third-party scripts.',
      },
      {
        title: 'Scoped Hosting & DNS Deployment Setup',
        description:
          'Configuration of modern production infrastructure (Vercel, Cloudflare, Firebase, or supported client host) with SSL certificate verification, DNS mapping assistance, and automated Git build triggers based on agreed project parameters.',
      },
      {
        title: 'Technical Documentation & Handover',
        description:
          'Clear repository walkthrough, environment variable documentation, and operational guidance so your team retains full ownership of your assets.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Scope & Architecture',
        description:
          'Analyze functional requirements, sitemap hierarchy, branding guidelines, and necessary third-party integrations.',
      },
      {
        step: '02',
        title: 'Modular Implementation',
        description:
          'Develop responsive components, optimize asset pipelines, and implement semantic layouts with modern TypeScript.',
      },
      {
        step: '03',
        title: 'Integration & Testing',
        description:
          'Wire inquiry forms, verify email notifications, test cross-browser responsiveness, and audit performance metrics.',
      },
      {
        step: '04',
        title: 'Production Handover',
        description:
          'Assist with DNS mapping cutover, verify live SSL certificates, configure build hooks, and deliver repository documentation.',
      },
    ],
    exclusions: [
      'Client provides core brand assets (high-resolution logos, brand imagery) and approved written copy unless copywriting support is separately scoped.',
      'Ongoing content authoring and continuous post-launch editorial publishing are not included by default.',
      'Third-party hosting fees, domain registrations, and paid SaaS API subscriptions are billed directly to client accounts.',
    ],
    nextStep: {
      description:
        'Email a brief overview of your business, desired launch timeline, and any existing website or wireframe links for an architectural review.',
      ctaText: 'Discuss Web Development',
      contactSubject: 'Enquiry: Business Website Development',
    },
  },
  {
    id: 'technical-seo',
    number: '02',
    title: 'Technical SEO Architecture',
    subtitle: 'Crawlability, Indexing Configuration & Core Web Vitals',
    summary:
      'Code-level search architecture ensuring search engines can discover, crawl, render, index, and interpret your website accurately, supported by validated structured data and Core Web Vitals optimization.',
    targetClient:
      'Businesses and product teams with an existing or newly launched website experiencing indexing anomalies, crawl errors, canonical conflicts, or performance bottlenecks in search consoles.',
    problemsAddressed: [
      'Critical pages omitted from search indexes due to improper canonical tags, orphan URLs, or restrictive robots directives.',
      'Suboptimal Core Web Vitals (LCP, CLS, INP) caused by unoptimized assets, render-blocking scripts, or layout instability.',
      'Missing or invalid Schema.org structured data, preventing search engines from recognizing organizations, services, and articles.',
      'Broken redirect loops, status code mismatches, and fragmented sitemap files obstructing search bot efficiency.',
    ],
    deliverables: [
      {
        title: 'Technical Crawl & Indexing Audit',
        description:
          'Systematic inspection of 4xx/5xx status codes, canonical link integrity, crawl budgets, and robots.txt rules.',
      },
      {
        title: 'Metadata & Semantic Structure Review',
        description:
          'Implementation of automated Open Graph meta, Twitter cards, unique meta descriptions, and clean HTML5 document hierarchy.',
      },
      {
        title: 'XML Sitemap & Search Console Setup Assistance',
        description:
          'Build-integrated XML sitemap generation with lastmod timestamps, robots.txt alignment, and scoped Google Search Console property verification assistance where administrative access is provided.',
      },
      {
        title: 'Schema.org JSON-LD Structured Data',
        description:
          'Implementation and validation of Organization, WebSite, Service, LocalBusiness, and TechArticle structured markup via Schema.org standards.',
      },
      {
        title: 'Scoped Performance & Core Web Vitals Remediation',
        description:
          'Diagnostic-driven code improvements targeting verified bottlenecks: font display rules, asset compression, script deferral, and layout shift reduction within the application codebase.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Baseline Diagnostic',
        description:
          'Review Google Search Console coverage reports, run automated crawl analysis, and capture baseline PageSpeed diagnostic traces.',
      },
      {
        step: '02',
        title: 'Remediation Roadmap',
        description:
          'Categorize issues by technical severity and define exact code and server modifications needed to restore healthy indexing.',
      },
      {
        step: '03',
        title: 'Code Implementation',
        description:
          'Deploy fixes directly in the codebase: canonical headers, schema injection, sitemap generation, and bundle optimization.',
      },
      {
        step: '04',
        title: 'Validation & Re-indexing',
        description:
          'Test structured data with Google Rich Results Test, verify server response headers, and request re-crawling in Search Console.',
      },
    ],
    exclusions: [
      'Does not include spam link acquisition, private blog networks (PBNs), automated directory blasts, or ranking guarantees.',
      'Search engines retain ultimate algorithmic discretion over ranking positions and indexing timetables; no specific rank is guaranteed.',
      'Requires administrative access to Google Search Console and the website code repository or hosting environment.',
    ],
    nextStep: {
      description:
        'Share your site URL and Google Search Console access (or an export of current crawl error reports) for an initial technical feasibility review.',
      ctaText: 'Request Technical SEO Review',
      contactSubject: 'Enquiry: Technical SEO Architecture',
    },
  },
  {
    id: 'local-seo',
    number: '03',
    title: 'Local Search Visibility',
    subtitle: 'Google Business Profile, NAP Consistency & Geographic Relevance',
    summary:
      'Foundational local search architecture helping local businesses, physical clinics, and regional services establish consistent NAP data, optimized Business Profiles, and structured geographic relevance signals.',
    targetClient:
      'Independent clinics, professional offices, retail stores, and regional service operators wanting dependable visibility when nearby customers search for local solutions.',
    problemsAddressed: [
      'Conflicting Name, Address, and Phone (NAP) citations across business directories confusing search engines and customers.',
      'Unclaimed, incomplete, or unoptimized Google Business Profile listings lacking appropriate service categories and hours.',
      'Missing local structured data and lack of geographic relevance signals on the primary business website.',
      'Absence of an ethical, straightforward protocol for collecting and displaying genuine customer reviews.',
    ],
    deliverables: [
      {
        title: 'Scoped Google Business Profile Optimization',
        description:
          'Assistance with category selection, service catalog alignment, operating hours accuracy, and compliant photo guidelines for eligible business entities.',
      },
      {
        title: 'NAP Consistency & Citation Audit',
        description:
          'Detailed review of core directory footprints to eliminate conflicting address and telephone variations.',
      },
      {
        title: 'On-Page Geographic Architecture',
        description:
          'Structured location details, standardized footer NAP markup, service-area copy alignment, and accessible location maps.',
      },
      {
        title: 'LocalBusiness Schema.org Integration',
        description:
          'Precise JSON-LD structured data embedding geo-coordinates, street addresses, opening hours specifications, and telephone links.',
      },
      {
        title: 'Authentic Review Collection System',
        description:
          'Practical workflows and ethical templates to help your team regularly gather legitimate customer feedback and respond appropriately.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Local Presence Audit',
        description:
          'Inspect active Google Business Profile status, citation footprint, and on-page geographic signals.',
      },
      {
        step: '02',
        title: 'Profile Optimization',
        description:
          'Align GBP primary and secondary categories, service descriptions, and operating details with actual search query intent.',
      },
      {
        step: '03',
        title: 'On-Site Local Alignment',
        description:
          'Embed LocalBusiness schema markup and align footer, contact page, and location content with verified GBP data.',
      },
      {
        step: '04',
        title: 'Local Operating Guide',
        description:
          'Deliver a maintenance checklist for responding to reviews, posting regular updates, and preserving NAP consistency.',
      },
    ],
    exclusions: [
      'Does not include acquiring fake reviews, black-hat location spoofing, or guaranteed #1 Google Map Pack placements.',
      'Physical address verification requires postcard, video, or phone verification executed directly between Google and the business owner.',
      'Client must maintain genuine commercial operations and an active phone number at the declared physical address.',
    ],
    nextStep: {
      description:
        'Share your business name, primary operating areas, and current Google Business Profile link for a local visibility audit.',
      ctaText: 'Assess Local Search Visibility',
      contactSubject: 'Enquiry: Local Search Visibility',
    },
  },
];
