# Technical Article Backlog & Editorial Calendar

**Status:** [Recommendation] & [Web-researched]  
**Editorial Policy:** High-depth, evidence-backed engineering essays only. No shallow AI listicles. Drafts must remain isolated until approved by the owner.  

---

## 1. Top 10 Priority Technical Articles (Ranked)

| Priority | Proposed Title | Primary Intent / Search Query | Target Audience | Key Architectural Concepts Covered | Status |
|---|---|---|---|---|---|
| **#1** | **Testing Non-Deterministic Systems: How I Built 1,200+ Automated Tests for iScribe** | `testing non-deterministic AI systems` | AI Engineering Leads, QA Architects | Unit testing probabilistic outputs, property-based testing, synthetic fixture generation, CI/CD for LLMs. | **Published Case Study** (`/blog/building-clinical-ai-beyond-transcription`) |
| **#2** | **Deploying Malayalam NLP: Architectural Trade-offs in Clinical AI** | `Malayalam speech to text clinical NLP` | Regional Tech Recruiters, NLP Engineers | Code-switching challenges, acoustic model fine-tuning, vocabulary constraints in Indian healthcare. | **Backlog / Draft Planned** |
| **#3** | **Why Your RAG Pipeline Fails in Production (And How I Fixed Mine)** | `production RAG failure modes` | Startup Founders, Staff Engineers | Context window pollution, chunk size trade-offs, vector drift, hybrid retrieval with BM25. | **Backlog / Draft Planned** |
| **#4** | **Structuring LLM Outputs with Python and Pydantic: A Case Study** | `deterministic schema guardrails LLM APIs` | Python Developers, Backend Engineers | Runtime schema enforcement, partial JSON parsing, automatic retry strategies, type safety. | **Published Engineering Note** (`/blog/deterministic-schema-guardrails-llm-apis`) |
| **#5** | **Handling Rate Limits and API Failures in Asynchronous Video Pipelines** | `FastAPI Celery FFmpeg asynchronous pipeline` | Backend Engineers, Systems Architects | Token-bucket rate limiting, Redis job persistence, dead-letter queues, FFmpeg process isolation. | **Published Engineering Note** (`/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg`) |
| **#6** | **From Notebook to FastAPI: Architecting an AI Web Application** | `deploying AI model FastAPI web app` | Junior Engineers, Recruiters | Moving from Jupyter exploratory scripts to modular production APIs with Docker and CI/CD. | **Backlog / Draft Planned** |
| **#7** | **Cost Optimization in AI Engineering: Managing Token Budgets in Production** | `LLM token cost optimization production` | CTOs, Engineering Managers | Caching strategies, prompt pruning, tiered model routing (small models for classification, large models for extraction). | **Backlog / Draft Planned** |
| **#8** | **Evaluating AI Guardrails: Security and Prompt Injection Defenses** | `AI prompt injection guardrails defense` | Security Engineers, AI Architects | System prompt delimiters, input sanitization, output validation, black-box penetration testing. | **Backlog / Draft Planned** |
| **#9** | **State Management in Agentic AI Workflows** | `state management agentic AI workflows` | AI Engineers, Technical Recruiters | Cyclic graphs vs. DAGs, state persistence across multi-step agent actions, rollback mechanics. | **Backlog / Draft Planned** |
| **#10** | **Lessons Learned: When Not to Use Generative AI** | `when not to use generative AI software` | Engineering Leaders, Founders | Pragmatic software architecture: when regex, deterministic state machines, or SQL are 100x faster and cheaper. | **Backlog / Draft Planned** |

---

## 2. Release & Change-Control Policy

- **Current Published Articles (3):**
  1. `/blog/building-clinical-ai-beyond-transcription` (Full Case Study)
  2. `/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg` (Engineering Note)
  3. `/blog/deterministic-schema-guardrails-llm-apis` (Engineering Note)
- **Draft Protection:** No new articles will be published to `src/data/articles.ts` or made live without explicit, separate approval from the repository owner.
