# Metadata Specification: Route-by-Route Registry

**Domain Origin:** `https://www.akthernaimudheen.in`  
**Site Title Suffix:** `Akther Naimudheen`  
**Default OG Image:** `https://www.akthernaimudheen.in/og-image.jpg` (1200x630)  
**Status:** [Verified in code]  

---

## 1. Master Route Metadata Table

### Route 1: Homepage (`/`)
- **Canonical:** `https://www.akthernaimudheen.in/`
- **Title:** `Akther Naimudheen | AI Application Engineer & Software Developer`
- **Description:** `Software developer and AI application engineer in Kerala, India. Explore applied AI projects, Python systems, software architecture, and engineering case studies.`
- **OG Type:** `profile`
- **OG / Twitter Image:** `https://www.akthernaimudheen.in/og-image.jpg`
- **Structured Data:** `schema.org/WebSite` + `schema.org/Person` graph

### Route 2: About (`/about`)
- **Canonical:** `https://www.akthernaimudheen.in/about`
- **Title:** `About — Akther Naimudheen`
- **Description:** `Background of Akther Naimudheen: AI-focused software developer, full-stack web development, computer engineering diploma, and healthcare documentation QA.`
- **OG Type:** `profile`
- **Structured Data:** `schema.org/Person` graph

### Route 3: Work Index (`/work`)
- **Canonical:** `https://www.akthernaimudheen.in/work`
- **Title:** `Engineering Projects & Case Studies | Akther Naimudheen`
- **Description:** `Explore AI engineering projects, Python applications, asynchronous media pipelines, and full-stack systems, with technical decisions and testing evidence.`
- **OG Type:** `website`
- **Structured Data:** `schema.org/Person` graph

### Route 4: iScribe Case Study (`/work/iscribe`)
- **Canonical:** `https://www.akthernaimudheen.in/work/iscribe`
- **Title:** `iScribe AI Architecture & Testing | Akther Naimudheen`
- **Description:** `Explore the engineering behind iScribe, a Malayalam clinical documentation application, including NLP guardrails, schema validation, regression testing, and known limitations.`
- **OG Type:** `article`
- **Structured Data:** `schema.org/Person` + `schema.org/TechArticle` cross-reference

### Route 5: PromptToShort Case Study (`/work/rshorts`)
- **Canonical:** `https://www.akthernaimudheen.in/work/rshorts`
- **Title:** `PromptToShort: Python Media Pipeline | Akther Naimudheen`
- **Description:** `Explore a video-processing application built with Python and FastAPI, covering asynchronous processing, FFmpeg workflows, subtitle synchronization, and automated tests.`
- **OG Type:** `article`
- **Structured Data:** `schema.org/Person`

### Route 6: Client Websites (`/work/website-projects`)
- **Canonical:** `https://www.akthernaimudheen.in/work/website-projects`
- **Title:** `Client Website Implementations — Akther Naimudheen`
- **Description:** `Production website implementations for regional businesses, focusing on clean frontend architecture, responsive layouts, and performance.`
- **OG Type:** `article`

### Route 7: Technical Lab (`/work/technical-lab`)
- **Canonical:** `https://www.akthernaimudheen.in/work/technical-lab`
- **Title:** `Experimental Systems Architecture — Akther Naimudheen`
- **Description:** `Architecture experiments, agentic workflow prototypes, and technical proof-of-concepts exploring reliability and latency constraints.`
- **OG Type:** `article`

### Route 8: Sea King Restaurant (`/work/seaking-restaurant`)
- **Canonical:** `https://www.akthernaimudheen.in/work/seaking-restaurant`
- **Title:** `Sea King Restaurant Website — Akther Naimudheen`
- **Description:** `Independent restaurant website with component-based frontend engineering, responsive menus, and local business discoverability.`
- **OG Type:** `article`

### Route 9: Sea King Suites (`/work/seaking-suites`)
- **Canonical:** `https://www.akthernaimudheen.in/work/seaking-suites`
- **Title:** `Sea King Suites Website — Akther Naimudheen`
- **Description:** `Commercial hotel accommodation website featuring room catalogs, responsive booking inquiries, and local search optimization.`
- **OG Type:** `article`

### Route 10: Blog Index (`/blog`)
- **Canonical:** `https://www.akthernaimudheen.in/blog`
- **Title:** `Technical Publication & Engineering Essays — Akther Naimudheen`
- **Description:** `Technical case studies, systems architecture breakdowns, and practical engineering notes on applied AI, media automation, and dependable software.`
- **OG Type:** `website`

### Route 11: Clinical AI Article (`/blog/building-clinical-ai-beyond-transcription`)
- **Canonical:** `https://www.akthernaimudheen.in/blog/building-clinical-ai-beyond-transcription`
- **Title:** `Building AI Clinical Documentation Beyond Transcription — Akther Naimudheen`
- **Description:** `An engineering deep dive into deterministic NLP guardrails, verbatim span tracking, and schema validation to solve LLM hallucinations in clinical documentation.`
- **OG Type:** `article`
- **Structured Data:** `schema.org/TechArticle` (headline, author, publisher, verbatim span keywords, datePublished)

### Route 12: Video Pipeline Engineering Note (`/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg`)
- **Canonical:** `https://www.akthernaimudheen.in/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg`
- **Title:** `Architecting Asynchronous Video Pipelines with FastAPI and FFmpeg — Akther Naimudheen`
- **Description:** `A systems breakdown of an asynchronous video generation pipeline: Celery worker coordination, FFmpeg rendering, subtitle synchronization, and storage integrity.`
- **OG Type:** `article`
- **Structured Data:** Dynamic `schema.org/TechArticle`

### Route 13: Deterministic Schema Guardrails Note (`/blog/deterministic-schema-guardrails-llm-apis`)
- **Canonical:** `https://www.akthernaimudheen.in/blog/deterministic-schema-guardrails-llm-apis`
- **Title:** `Deterministic Schema Guardrails for LLM APIs — Akther Naimudheen`
- **Description:** `Engineering dependable LLM integrations with Pydantic runtime validation, deterministic retry policies, and structured schema enforcement.`
- **OG Type:** `article`
- **Structured Data:** Dynamic `schema.org/TechArticle`

### Route 14: Services Page (`/services`)
- **Canonical:** `https://www.akthernaimudheen.in/services`
- **Title:** `Web Engineering & Search Architecture Services — Akther Naimudheen`
- **Description:** `Engineering-led business website development, technical SEO architecture, and local search visibility for independent businesses and technical teams.`
- **OG Type:** `website`
- **Structured Data:** `schema.org/ItemList` containing 3 `schema.org/Service` items

### Route 15: Contact Page (`/contact`)
- **Canonical:** `https://www.akthernaimudheen.in/contact`
- **Title:** `Contact — Akther Naimudheen`
- **Description:** `Connect with Akther Naimudheen for full-stack software development, applied AI engineering, API integrations, and product development opportunities.`
- **OG Type:** `website`
- **Structured Data:** `schema.org/Person`
