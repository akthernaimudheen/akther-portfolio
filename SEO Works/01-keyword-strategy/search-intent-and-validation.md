# Search Intent Analysis & Strategy Validation

**Focus:** Aligning portfolio content with real search engine query semantics and audience intent  
**Audience Segments:** Technical Recruiters, Engineering Managers, Startup Founders, Freelance Clients  
**Status:** [Web-researched] & [Recommendation]  

---

## 1. Deconstructing Hiring Search Intent

Search engine optimization for a personal portfolio operates differently than e-commerce or SaaS SEO. Ranking for raw high-volume keywords is useless if the traffic consists of students or job seekers looking for vacancies.

### Audience 1: Technical Recruiters & Talent Sourcers
- **Search Behavior:** Boolean searches on LinkedIn/Google, long-tail discovery queries.
- **Typical Queries:** `AI application engineer portfolio`, `software developer portfolio Kochi`, `Python media pipeline developer`.
- **SERP Intent:** Finding individual professionals to evaluate for contract or full-time roles.
- **Conversion Trigger:** Clear positioning statement, immediate links to live demos or GitHub repos, downloadable resume, and direct contact options.

### Audience 2: Engineering Hiring Managers & Technical Leads
- **Search Behavior:** Searching for solutions to concrete architectural problems or vetting a candidate's portfolio link sent via an application.
- **Typical Queries:** `evaluating non-deterministic LLMs`, `Malayalam speech to text clinical NLP`, `FastAPI Celery FFmpeg pipeline`.
- **SERP Intent:** Technical validation. They want to see how the candidate thinks, whether they write tests, and how they handle edge cases.
- **Conversion Trigger:** Thorough technical documentation, architectural diagrams, test counts, trade-off discussions, and honest disclosures of limitations.

### Audience 3: Regional Business Owners & Founders
- **Search Behavior:** Looking for localized web development and technical guidance.
- **Typical Queries:** `website development Kochi`, `technical SEO consultant Kerala`.
- **SERP Intent:** Hiring an engineer to build a dependable business site or fix crawlability issues.
- **Conversion Trigger:** The dedicated `/services` page with transparent scope, pricing ranges, and clear deliverables.

---

## 2. Rejection Rationale for Low-Value & Misleading Terms

| Rejected Keyword Phrase | Intended Audience | Why It Fails | Action Taken |
|---|---|---|---|
| `entry-level software engineer India` | Job Seekers | Page 1 of Google is 100% dominated by aggregators (Naukri, Indeed, LinkedIn, Foundit). Recruiters do not search this phrase to discover candidates; candidates search this phrase to find job listings. | **REJECTED.** No page targets this query. |
| `best AI engineer in India` | General Public | Unsubstantiated superlative. Ranks PR articles, university rankings, and corporate profiles. Using this on a portfolio harms technical credibility and violates Google E-E-A-T quality guidelines. | **REJECTED.** Banned from all metadata and copy. |
| `prompt engineer portfolio` | Junior AI Practitioners | Industry perception has shifted; "prompt engineering" without software engineering is viewed as low-barrier and transient. | **REPLACED** with `AI Application Engineer & Software Developer`. |
| `100% accurate clinical AI` | Marketing Hype | Medically false and legally irresponsible. Machine learning speech-to-text and NLP pipelines cannot guarantee 100% accuracy. | **BANNED.** Replaced with evidence-backed descriptions of deterministic guardrails, validation schemas, and synthetic benchmark fixtures. |

---

## 3. Geographic Modifier Validation

### Rule: Use Location When Truthful; Omit When Limiting
1. **When to Include (`Kerala`, `Kochi`):**
   - On the `/about` page: Akther lives and works in Kerala; local recruiters frequently filter by region.
   - On the `/services` page: Regional businesses seek local engineers for communication ease.
   - On the homepage meta tags: Establishes clear entity resolution for local search graphs.
2. **When to Omit:**
   - On deep-dive technical articles (`/blog/...`): Global readers looking for FastAPI/FFmpeg architectures or NLP guardrails should not see a geographic constraint in the title.
   - In global case studies (`/work/iscribe`, `/work/rshorts`): The technical achievements stand on their own merit regardless of geography.

---

## 4. Semantic Integrity & Anti-Stuffing Guidelines

- **No Keyword Repetition:** Never repeat target keyphrases artificially in headings or body text.
- **Headings Follow Logic, Not SEO:** `<h1>` tags must accurately describe the visible page section (`iScribe AI Architecture`, `PromptToShort Media Pipeline`), not an unnatural string of keywords.
- **Clarity First:** If an SEO recommendation conflicts with clear, truthful engineering prose, **clarity always takes priority**.
