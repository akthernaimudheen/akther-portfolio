import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ShieldAlert, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { Reveal } from '@/components/ScrollMotion';
import { ProjectVisualScene } from '@/components/ui/project-visual-scene';
import { profile } from '@/data/profile';

export function ClinicalAiArticle() {
  return (
    <article className="article-container" aria-labelledby="article-title">
      {/* Top Breadcrumb & Navigation */}
      <nav className="article-nav" aria-label="Breadcrumb">
        <Link to="/work/iscribe" className="back-link">
          <ArrowLeft aria-hidden="true" /> iScribe Architecture
        </Link>
        <span className="article-nav__separator" aria-hidden="true">/</span>
        <span className="article-nav__current">Engineering Deep Dive</span>
      </nav>

      {/* Header */}
      <header className="article-header">
        <p className="eyebrow">Engineering Case Study · Applied Clinical NLP</p>
        <h1 id="article-title">
          Building AI Clinical Documentation Beyond Transcription: Engineering Guardrails for Clinical Fact Extraction
        </h1>
        <p className="article-lede">
          Speech recognition does not solve medical documentation. An engineering case study on combining deterministic NLP guardrails, verbatim span tracking, and schema validation to extract structured clinical facts while eliminating unprompted model fabrications.
        </p>

        <div className="article-meta-bar">
          <div className="article-meta-author">
            <img
              src={profile.portrait.src}
              alt={profile.name}
              width={40}
              height={40}
              className="article-author-avatar"
            />
            <div>
              <strong>{profile.name}</strong>
              <span>Independent AI Engineer · Former Clinical AI QA</span>
            </div>
          </div>
          <div className="article-meta-details">
            <span><strong>Published:</strong> October 18, 2026</span>
            <span><strong>Read time:</strong> 14 min read</span>
            <span><strong>Status:</strong> Evaluated on Synthetic Benchmarks</span>
          </div>
        </div>
      </header>

      {/* Key Verified Metrics Summary Card */}
      <div className="article-metrics-banner">
        <div className="article-metric-pill">
          <strong>0.8837 F1</strong>
          <span>Frozen B2 Benchmark</span>
        </div>
        <div className="article-metric-pill">
          <strong>1,336 Tests</strong>
          <span>Passing Automated Gates</span>
        </div>
        <div className="article-metric-pill">
          <strong>0 Prohibited Hits</strong>
          <span>Deterministic Baseline (vs 7 LLM)</span>
        </div>
        <div className="article-metric-pill">
          <strong>Local CPU</strong>
          <span>Tested English NLP Engine</span>
        </div>
      </div>

      {/* Article Body */}
      <div className="article-body">

        {/* Section 1 */}
        <section className="article-section" id="executive-summary">
          <h2>1. Executive Summary</h2>
          <p>
            The primary bottleneck in medical documentation is rarely speech recognition—it is clinical information extraction. Modern Automatic Speech Recognition (ASR) engines can transcribe consultation audio with remarkable word error rates, yet a verbatim transcript of a physician-patient dialogue remains practically unusable for Electronic Health Records (EHR). Real clinical dialogue is conversational, non-linear, fragmented, and punctuated by interruptions, colloquial descriptions of pain, and complex negations.
          </p>
          <p>
            When engineering teams attempt to bridge this gap using generative Large Language Models (LLMs) with standard prompt-and-summarize workflows, they encounter the fundamental liability of stochastic text generation: <strong>unprompted clinical hallucinations, dropped negative findings, and invented normal values</strong>. In clinical software, omitting a reported allergy or hallucinating a normal contralateral limb is not a minor bug—it is an unacceptable patient safety hazard.
          </p>
          <p>
            This case study examines the architecture and evaluation of <strong>iScribe</strong>, an AI clinical documentation prototype engineered to extract structured clinical facts from consultation dialogues using a <strong>dual-engine pipeline</strong>: combining semantic language processing with deterministic NLP guardrails, strict JSON schema validation, verbatim provenance tracking, and a fail-closed clinician-in-the-loop review interface.
          </p>

          <div className="case-notice" role="alert">
            <ShieldAlert className="article-notice-icon" aria-hidden="true" />
            <div>
              <strong>Verified Engineering Milestones:</strong>
              <ul className="article-list-compact">
                <li><strong>Deterministic Fact Extraction:</strong> Achieved an <strong>F1 score of 0.8837</strong> (Precision: 0.8636, Recall: 0.9048; 19 True Positives, 3 False Positives, 2 False Negatives) on a frozen clinical evaluation benchmark with zero pipeline exceptions.</li>
                <li><strong>Deterministic Regression Testing:</strong> Maintained <strong>1,336 passing automated tests</strong> across 9 architectural partition gates, ensuring parser stability across synthetic dialogue permutations.</li>
                <li><strong>Stochastic vs. Deterministic Benchmark:</strong> An experimental benchmark of a local LLM (<code>qwen-coder-abliterated:latest</code>) across 12 ultrasound test cases achieved high findings recall (1.0) but produced <strong>7 prohibited hallucination hits</strong> and an unviable <strong>54.2-second average latency on CPU</strong>, demonstrating empirically why raw LLM outputs cannot be deployed directly without deterministic guardrails.</li>
                <li><strong>Explicit Scope &amp; Safety Boundaries:</strong> Evaluated strictly using curated synthetic dialogues and sanitized fixtures. <strong>No real patient Protected Health Information (PHI), live hospital adoption, regulatory clearance (HIPAA/DPDP), or unverified clinical accuracy is claimed.</strong></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="article-section" id="why-more-than-stt">
          <h2>2. Why Clinical Documentation is More Than Speech-to-Text</h2>
          <p>
            A widespread misconception in ambient healthcare technology is that clinical documentation is simply a speech-to-text problem. If an engineering team transcribes audio with 95% word accuracy, does the physician get an EHR-ready SOAP (Subjective, Objective, Assessment, Plan) note?
          </p>
          <p>
            In practice, the answer is no. Ambient consultation audio differs fundamentally from formal physician dictation:
          </p>

          <div className="article-diagram-card">
            <div className="article-diagram-title">The Semantic Gap: Ambient Speech vs. Structured EHR Requirements</div>
            <pre className="article-pre">
{`[ Ambient Consultation Audio ]
   │
   ├── "Actually doctor, the knee stopped hurting Tuesday, but now my lower back has this sharp throbbing..."
   ├── Conversational tangents, doctor interruptions, patient self-corrections
   └── Code-switching: mixing English medical terminology with regional languages (e.g., Malayalam)
   │
   ▼
[ Raw ASR Transcript ]  ──► (Unstructured, ambiguous, contains clinical negations and noise)
   │
   ▼  What an EHR Actually Requires:
┌────────────────────────────────────────────────────────────────────────┐
│ Structured Clinical Fact Graph:                                        │
│ • Chief Complaint: Low back pain (onset: 3 days ago, quality: sharp)   │
│ • Resolved Symptoms: Right knee pain (resolved Tuesday)                │
│ • Explicit Negation: Denies radiation, denies numbness or fever        │
│ • Objective Range: BP 128/82 mmHg, HR 74 bpm (verified in bounds)      │
│ • Plan / Prescription: Paracetamol 500 mg PO TID PRN x 5 days          │
└────────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>

          <h3>The Three Structural Failure Modes of Raw Transcripts</h3>
          <ol className="article-numbered-list">
            <li>
              <strong>Conversational Non-Linearity:</strong> Patients do not present their medical history chronologically. They backtrack, correct previous statements, and interject unrelated concerns. A transcript records every false start; an extraction pipeline must isolate the final affirmed state.
            </li>
            <li>
              <strong>Explicit Negation and Temporal Status:</strong> In medicine, what a patient <em>does not</em> have is as critical as what they do have. Differentiating between <em>"denies chest pain"</em> (absent), <em>"had chest pain last year"</em> (historical), and <em>"complaining of active chest pain"</em> (present) requires deterministic polarity parsing. General LLMs frequently drop negation modifiers during aggressive summarization.
            </li>
            <li>
              <strong>South Asian Code-Switching (Malayalam-English):</strong> In outpatient clinics across Kerala and South India, dialogue fluently transitions between English medical terms and Malayalam descriptive idioms. A patient might describe their dizziness in Malayalam while the physician notes <em>"orthostatic hypotension"</em> in English. Generic NLP pipelines trained on monolingual Western corpora fail on these phonetic and semantic boundaries.
            </li>
          </ol>
        </section>

        {/* Section 3 */}
        <section className="article-section" id="project-scope-and-boundaries">
          <h2>3. Project Scope and Safety Boundaries</h2>
          <p>
            Applying AI to healthcare mandates transparent, uncompromising disclosures regarding what the system is, what it does, and what it does <strong>not</strong> do.
          </p>

          <div className="article-callout-warning">
            <AlertTriangle className="article-notice-icon" aria-hidden="true" />
            <div>
              <strong>Mandatory Disclosures &amp; Safety Boundaries:</strong>
              <ul>
                <li><strong>Synthetic Evaluation Only:</strong> iScribe was developed and evaluated strictly using synthetic clinical dialogue fixtures and sanitized benchmark datasets. Zero real-patient health records (PHI) were accessed, processed, or stored.</li>
                <li><strong>Zero Clinical Adoption Claims:</strong> This project is a self-directed engineering prototype. It has not been deployed in active clinical hospital environments, and no patient health outcomes are claimed.</li>
                <li><strong>Regulatory Transparency:</strong> No compliance certifications—such as HIPAA (Health Insurance Portability and Accountability Act) or India's DPDP (Digital Personal Data Protection Act)—or medical device regulatory clearances (FDA/CDSCO) are claimed.</li>
                <li><strong>Heuristic Privacy Safeguards:</strong> The pipeline incorporates automated input filters to detect synthetic identifiers (such as regex-based detection of SSN, MRN, phone numbers, and dates of birth). However, <strong>these filters are heuristic regex safeguards</strong> and must never be misconstrued as an exhaustive, mathematically guaranteed de-identification solution.</li>
                <li><strong>Mandatory Clinician-in-the-Loop:</strong> iScribe is an assistive draft generator. Application state strictly prohibits automated EHR commits; every generated note remains gated until verified and signed off by a licensed human physician.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="article-section" id="four-stage-architecture">
          <h2>4. Four-Stage Architecture, Reconciled with Five Implementation Steps</h2>
          <p>
            To prevent ambiguity between architectural documentation and source code, the system's operational structure is defined below, reconciling the high-level visual pipeline diagram with its underlying software passes.
          </p>

          <div className="article-plate">
            <ProjectVisualScene
              src="/iscribe-architecture.svg"
              alt="iScribe 4-stage clinical documentation architecture diagram"
              interactive
              eager
            />
            <p className="article-caption">
              Figure 1: Architectural schematic of the iScribe clinical documentation pipeline illustrating audio intake, entity extraction, deterministic guardrails, and mandatory physician review.
            </p>
          </div>

          <h3>Reconciling the Pipeline Stages</h3>
          <ul>
            <li>
              <strong>The 4 Diagram Stages (<a href="/iscribe-architecture.svg" target="_blank" rel="noopener noreferrer"><code>iscribe-architecture.svg</code></a>):</strong> Categorizes the lifecycle into four visual physical zones: Stage 01 (Ingestion), Stage 02 (Extraction), Stage 03 (Deterministic Guardrails), and Stage 04 (Clinician Review).
            </li>
            <li>
              <strong>The 5 Code Steps (<a href="/work/iscribe"><code>projects.ts</code></a>):</strong> Represents the sequential software execution passes. Step 1 maps to Stage 01; Step 2 maps to Stage 02; <strong>Steps 3 (Schema Validation) and 4 (Ambiguity &amp; Conflict Handling) represent the two internal sub-passes of Stage 03</strong>; and Step 5 maps to Stage 04.
            </li>
            <li>
              <strong>The "4 Layers" Defensive Boundary Metric:</strong> Represents the concentric defensive boundaries protecting the clinical output:
              <ol className="article-sublist">
                <li><em>Transport Boundary:</em> Rate-limiting (30 req/min) and execution timeouts (15s).</li>
                <li><em>Input Sanitization Boundary:</em> Strict payload boundaries (5–5,000 characters) and heuristic regex PHI detection.</li>
                <li><em>Deterministic Schema Boundary:</em> Pydantic/Zod contract verification, physiological range validation, and exact verbatim source-span checks.</li>
                <li><em>Human Authorization Boundary:</em> Fail-closed state locking (<code>PENDING_CLINICIAN_REVIEW</code>) preventing unverified export.</li>
              </ol>
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="article-section" id="deterministic-extraction">
          <h2>5. Deterministic Extraction and Structured Validation</h2>
          <p>
            At the core of iScribe's verified engine is a deterministic NLP pipeline implemented in pure Python, utilizing spaCy for tokenization and entity boundary parsing, combined with targeted pattern matchers and <a href="/work/iscribe"><code>radiology_facts_adapter.py</code></a>.
          </p>

          <h3>The Anatomy of an Extracted Fact</h3>
          <p>
            Rather than asking a model to generate free-form text, the engine models clinical observations as strongly typed objects:
          </p>

          <pre className="article-code-block">
{`{
  "id": "fact_042",
  "label": "finding_hydronephrosis",
  "category": "finding",
  "polarity": "ABSENT",
  "status": "confirmed",
  "organ": "kidney",
  "laterality": "bilateral",
  "source_span": "there is no hydronephrosis",
  "char_offset": [142, 168],
  "confidence": 1.0
}`}
          </pre>

          <h3>Deterministic Guardrail Mechanisms</h3>
          <p>
            The engine executes three defensive passes before a fact can reach the clinical draft:
          </p>
          <ul>
            <li>
              <strong>Verbatim Provenance Gating:</strong> Every candidate fact emitted by an extraction pass must contain a <code>source_span</code>. The validation pass performs normalized substring containment against the raw transcript. If a fact cannot point to its exact text origin, it is immediately discarded.
            </li>
            <li>
              <strong>Polarity and Negation Enforcement:</strong> The engine binds negation cues (<em>"no evidence of"</em>, <em>"denies"</em>, <em>"negative for"</em>, <em>"without"</em>) to anatomical targets using dependency parse trees. This prevents the dangerous inversion where <em>"no signs of calculi"</em> is extracted as an active finding of calculi.
            </li>
            <li>
              <strong>Physiological Range Boundaries:</strong> Numerical vitals and clinical measurements are validated against physiological bounds. A pulse reading of 720 bpm or a kidney measurement of 105 cm triggers a schema violation and visual review flag rather than passing silently into the record.
            </li>
          </ul>
          <p>
            <em>Crucially, schema validity does not equal clinical correctness.</em> A schema validator verifies field types, structure, and physiological range bounds, but it cannot determine whether a documented finding was medically accurate or if a prescribed dosage was clinically optimal for that individual patient. Schema validation is a defensive software boundary, not a substitute for clinical verification.
          </p>
        </section>

        {/* Section 6 */}
        <section className="article-section" id="llm-experiment">
          <h2>6. What the LLM Experiment Revealed: Hallucination Hazards in Unconstrained Models</h2>
          <p>
            To evaluate whether generative LLMs could replace deterministic extraction rules, an experiment was conducted scoring a local LLM route against the deterministic engine.
          </p>

          <h3>The Experimental Setup</h3>
          <ul>
            <li><strong>Model Tested:</strong> <code>qwen-coder-abliterated:latest</code> executed via local Ollama.</li>
            <li><strong>Benchmark Fixture:</strong> 12 curated ultrasound test cases (<code>US-DEV-01</code> through <code>US-DEV-12</code> in synthetic fixtures).</li>
            <li><strong>Approaches Evaluated:</strong>
              <ul>
                <li><strong>Approach A:</strong> Pure deterministic rule-based engine (spaCy + regex).</li>
                <li><strong>Approach B:</strong> Local LLM raw inference with few-shot extraction prompt.</li>
                <li><strong>Approach C:</strong> Local LLM inference followed by fail-closed schema validation.</li>
              </ul>
            </li>
          </ul>

          <div className="article-table-wrapper">
            <table className="article-table">
              <thead>
                <tr>
                  <th>Performance Metric</th>
                  <th>Approach A (Deterministic)</th>
                  <th>Approach B (Local LLM Raw)</th>
                  <th>Approach C (LLM + Validated)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Cases Evaluated</strong></td>
                  <td>12</td>
                  <td>12</td>
                  <td>12</td>
                </tr>
                <tr>
                  <td><strong>Findings Recall</strong></td>
                  <td>0.333</td>
                  <td><strong>1.000</strong></td>
                  <td><strong>1.000</strong></td>
                </tr>
                <tr>
                  <td><strong>Measurement Recall</strong></td>
                  <td>0.111</td>
                  <td><strong>0.667</strong></td>
                  <td><strong>0.667</strong></td>
                </tr>
                <tr>
                  <td><strong>Negative Finding Recall</strong></td>
                  <td>0.000</td>
                  <td><strong>1.000</strong></td>
                  <td><strong>1.000</strong></td>
                </tr>
                <tr>
                  <td><strong>Impression Recall</strong></td>
                  <td>0.833</td>
                  <td>0.833</td>
                  <td>0.833</td>
                </tr>
                <tr>
                  <td><strong>Polarity Errors</strong></td>
                  <td>3</td>
                  <td><strong>1</strong></td>
                  <td><strong>1</strong></td>
                </tr>
                <tr>
                  <td><strong>Laterality Errors</strong></td>
                  <td>5</td>
                  <td><strong>2</strong></td>
                  <td><strong>2</strong></td>
                </tr>
                <tr>
                  <td><strong>Measurement Errors</strong></td>
                  <td>3</td>
                  <td><strong>2</strong></td>
                  <td><strong>2</strong></td>
                </tr>
                <tr className="article-table-highlight">
                  <td><strong>Prohibited Hallucination Hits</strong></td>
                  <td><strong>0</strong></td>
                  <td><strong>7</strong></td>
                  <td><strong>7</strong></td>
                </tr>
                <tr>
                  <td><strong>Review-Flagged Cases</strong></td>
                  <td>12</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td><strong>Mean Inference Latency</strong></td>
                  <td><strong>&lt; 0.2 s (CPU)</strong></td>
                  <td>54.2 s (CPU)</td>
                  <td>54.2 s (CPU)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Engineering Analysis: The High Recall vs. Hallucination Dilemma</h3>
          <p>
            The experiment yielded a profound engineering lesson:
          </p>
          <ol className="article-numbered-list">
            <li>
              <strong>The Vulnerability of Raw LLM Output:</strong> While Approach B achieved perfect findings recall (1.0), it generated <strong>7 prohibited hits</strong> across the 12 cases. In Case <code>US-DEV-02</code> (liver ultrasound) and <code>US-DEV-03</code> (gallbladder), the model hallucinated normal observations about anatomical structures that were never mentioned in the dictation. In a clinical setting, documenting an unexamined organ as normal exposes patients to diagnostic delays and providers to severe legal liability. <em>Crucially, this is an evaluation of unprompted model fabrications within a discrete 12-case synthetic benchmark, not an aggregate clinical error rate across diverse hospital specialties.</em>
            </li>
            <li>
              <strong>Validation Limitations:</strong> Approach C demonstrated that simple post-hoc schema validation flags errors but cannot magically repair ungrounded completions without dropping findings.
            </li>
            <li>
              <strong>Latency Bottlenecks:</strong> A mean latency of <strong>54.2 seconds</strong> (ranging from 34.5s to 61.3s) on local CPU inference is unviable for interactive clinical workflows where physicians expect responsive feedback.
            </li>
          </ol>
        </section>

        {/* Section 7 */}
        <section className="article-section" id="testing-methodology">
          <h2>7. Testing Methodology: What the Metrics Do—and Do Not—Prove</h2>
          <p>
            A central responsibility of applied AI engineering is maintaining clarity regarding what automated test suites actually validate.
          </p>

          <h3>1. Phase 4A Verification Suite</h3>
          <p>
            In the Phase 4A implementation audit (recorded in <code>PHASE4A_EXECUTION_REPORT.md</code>), the test suite reported:
          </p>
          <ul>
            <li><strong>1,336 Passed Tests</strong></li>
            <li><strong>6 Expected Failures (<code>xfailed</code>)</strong></li>
            <li><strong>1 Skipped Test</strong></li>
            <li><strong>14 Pre-existing Failures</strong> (isolated to legacy adversarial test scripts in <code>scripts/test_phase_h*.py</code>)</li>
          </ul>

          <h3>2. Frozen B2 Evaluation Benchmark</h3>
          <p>
            Across all architectural partition gates (P1 through P9), the frozen B2 evaluation runner proved byte-identical stability:
          </p>
          <ul>
            <li><strong>F1 Score:</strong> <code>0.8837</code></li>
            <li><strong>Precision:</strong> <code>0.8636</code></li>
            <li><strong>Recall:</strong> <code>0.9048</code></li>
            <li><strong>Contingency Counts:</strong> True Positives: 19, False Positives: 3, False Negatives: 2</li>
            <li><strong>Integrity Verification:</strong> Zero dropped facts, zero capture omissions, zero pipeline exceptions.</li>
          </ul>

          <div className="case-notice" role="status">
            <CheckCircle2 className="article-notice-icon" aria-hidden="true" />
            <div>
              <strong>Critical Distinction: Software Verification vs. Clinical Validation:</strong>
              <p>
                <strong>What 1,336 unit tests prove:</strong> The Python codebase executes predictably without unhandled crashes. JSON serializers correctly enforce Pydantic/Zod schemas. Regex boundaries and tokenizers handle edge cases and null inputs. Deterministic refactors caused zero regressions against baselines.
              </p>
              <p>
                <strong>What 1,336 unit tests do NOT prove:</strong> They do NOT prove diagnostic safety in real hospital emergency rooms. They do NOT prove model accuracy across diverse patient accents. They do NOT substitute for formal clinical trials.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="article-section" id="malayalam-code-switching">
          <h2>8. Malayalam-English Code-Switching: Current Capabilities and Open Problems</h2>
          <p>
            Healthcare delivery in South India requires addressing conversational code-switching (often referred to colloquially as "Manglish").
          </p>

          <h3>Current Implemented State</h3>
          <ul>
            <li><strong>Lexicon &amp; Semantic Dictionaries:</strong> Verified in Phase 4A (commit <code>P6</code>), targeted dictionaries mapping Malayalam symptoms, anatomical references, and colloquial disease names exist in <code>scribe_engine/data/</code>.</li>
            <li><strong>Verified Token Parsing:</strong> 342 targeted tests verify semantic safety, token normalization, and question-word boundary detection for mixed Malayalam-English text inputs.</li>
          </ul>

          <h3>The Unverified Frontier: End-to-End Speech Recognition</h3>
          <p>
            While dictionary-level text mapping is implemented, <strong>reliable end-to-end Malayalam speech-to-text transcription remains an unverified research problem</strong>:
          </p>
          <ol className="article-numbered-list">
            <li>
              <strong>Acoustic and Phonetic Drift:</strong> Standard open-source ASR models (such as Whisper variants) exhibit steep word error rate degradation when processing rapid conversational Malayalam containing English clinical loanwords.
            </li>
            <li>
              <strong>Compute Realities:</strong> The verified local CPU execution environment (<code>device="cpu", language="en"</code> in <code>engine_bridge.py</code>) operates efficiently for English NLP. Performing low-latency, real-time local ASR for regional Indian languages on standard clinic workstation CPUs without dedicated GPU acceleration remains an active engineering hurdle.
            </li>
          </ol>
        </section>

        {/* Section 9 */}
        <section className="article-section" id="defensive-boundaries">
          <h2>9. Failure Handling, Clinician Review, and Defensive Boundaries</h2>
          <p>
            In safety-critical systems, how software fails is more important than how it succeeds under ideal conditions. iScribe employs a defense-in-depth architecture across four operational boundaries:
          </p>

          <div className="article-diagram-card">
            <pre className="article-pre">
{`[ Incoming Request ]
        │
        ▼
[ Layer 1: Transport Guard ] ──► Exceeds 30 req/min or 15s timeout? ──► HTTP 429 / 504
        │ (Passed)
        ▼
[ Layer 2: Sanitization Guard ] ──► Length < 5 or > 5,000 chars? ─────► HTTP 422 Rejection
        │                         Synthetic PHI Pattern Detected? ──► HTTP 422 Rejection
        │ (Passed)
        ▼
[ Layer 3: Schema Guard ] ────► Malformed JSON or Out-of-Bounds Vitals? ──► Reject / Fallback
        │                         Ungrounded Fact (Missing Span)? ──► Drop Fact
        │ (Passed)
        ▼
[ Layer 4: Human Review UI ] ──► Physician edits, verifies, signs ──► Explicit EHR Export`}
            </pre>
          </div>

          <h3>Defensive Engineering Details</h3>
          <ul>
            <li>
              <strong>Local Bridge Rate Limiting:</strong> The FastAPI bridge enforces an in-memory sliding-window rate limiter (30 requests/minute per client IP) and wraps NLP execution in a 15-second timeout to prevent resource starvation.
            </li>
            <li>
              <strong>Heuristic Synthetic PHI Guard:</strong> Incoming text is scanned by heuristic regex patterns detecting common identifier structures (SSN, MRN, US telephone, dates of birth). If detected in test strings, the API rejects execution fail-closed with HTTP 422.
            </li>
            <li>
              <strong>Ambiguity and Conflict Routing:</strong> When the engine detects contradictory statements (e.g., patient states <em>"fever started yesterday"</em> while later stating <em>"no fever for a week"</em>), it does not resolve the conflict probabilistically. It outputs an <code>ambiguous_safe_behavior</code> flag, triggering a high-visibility warning banner in the physician's UI.
            </li>
            <li>
              <strong>Mandatory Clinician Sign-Off:</strong> The review workspace decouples audio playback from structured note editing. Clinicians can click any extracted finding to highlight its verbatim audio timestamp. The clinical note cannot be serialized or exported until the provider actively authorizes the final draft.
            </li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="article-section" id="limitations-and-next-steps">
          <h2>10. Limitations and Next Experiments</h2>
          <p>
            Engineering credibility rests on acknowledging current technical limitations and charting clear research trajectories.
          </p>

          <h3>Current Technical Limitations</h3>
          <ul>
            <li><strong>Synthetic Evaluation Gap:</strong> Benchmarking on synthetic datasets cannot model the acoustic degradation of noisy clinical environments (e.g., background HVAC noise, overlapping speakers, crying infants).</li>
            <li><strong>Local Inference Latency:</strong> Running local LLMs on CPU yields unacceptable response times (54.2s mean latency).</li>
            <li><strong>ASR Dialectal Fragility:</strong> High error rates on conversational regional Indian dialects when medical jargon is interspersed.</li>
            <li><strong>Interoperability Absence:</strong> The current prototype outputs structured JSON; it does not yet include production HL7 v2 or FHIR (Fast Healthcare Interoperability Resources) export adapters.</li>
          </ul>

          <h3>Planned Research &amp; Experimental Milestones</h3>
          <ol className="article-numbered-list">
            <li>
              <strong>Hybrid Architecture Execution:</strong> Deploying a two-tier extraction pipeline: lightweight deterministic rules (spaCy/regex) for high-frequency anatomy, vitals, and negations (&lt; 50ms), paired with an asynchronous small language model (SLM) solely for complex narrative synthesis.
            </li>
            <li>
              <strong>Quantized Local SLMs:</strong> Benchmarking 3B-parameter quantized models (e.g., Qwen 2.5, Llama 3.2 3B) running via llama.cpp or ONNX Runtime to bring local inference latency under 5 seconds on modern multi-core CPUs.
            </li>
            <li>
              <strong>Dialectal Fine-Tuning:</strong> Developing open-access synthetic evaluation corpora specifically targeting Malayalam-English outpatient consultations to benchmark public ASR models.
            </li>
          </ol>
        </section>

        {/* Section 11 */}
        <section className="article-section" id="engineering-lessons">
          <h2>11. Engineering Lessons Relevant to Applied AI and NLP</h2>
          <p>
            Building iScribe yielded several core tenets applicable across applied machine learning and software engineering:
          </p>

          <div className="article-takeaways-grid">
            <div className="article-takeaway-card">
              <h3>1. Do Not Use an LLM Where Deterministic Logic Suffices</h3>
              <p>Generative models are computationally intensive, high-latency, and non-deterministic. For entity extraction with standardized clinical vocabularies and fixed ranges (anatomical targets, lab units, vital bounds), regex pattern matchers and deterministic tokenizers are orders of magnitude faster and run efficiently on commodity CPUs with zero stochastic token invention. While rule-based systems carry their own failure modes—such as false-negative omissions and brittle parsing of unstructured phrasing—they eliminate unprompted confabulations for predictable medical concepts.</p>
            </div>
            <div className="article-takeaway-card">
              <h3>2. Ground Every Extracted Fact in Verbatim Provenance</h3>
              <p>Requiring every structured assertion to carry a valid <code>source_span</code> offset ensures candidate facts are strictly bounded to the dictation text, making ungrounded statements immediately detectable as contract violations. While verbatim source provenance does not guarantee the medical truth or clinical accuracy of the speaker's dictation itself, it guarantees that the extraction pipeline never invents an assertion that was never uttered.</p>
            </div>
            <div className="article-takeaway-card">
              <h3>3. Schemas and Boundaries Trump System Prompts</h3>
              <p>Prompt engineering (<em>"You are a helpful medical assistant, never hallucinate..."</em>) provides zero mathematical or architectural guarantees. Reliable AI applications require external deterministic compilers, runtime schema validators (Zod/Pydantic), and fail-closed software boundaries.</p>
            </div>
            <div className="article-takeaway-card">
              <h3>4. Build for Graceful Failure</h3>
              <p>In mission-critical software, a system that flags ambiguity and prompts for human review is vastly superior to a system that guesses with unearned statistical confidence.</p>
            </div>
          </div>
        </section>

        {/* Section 12 */}
        <section className="article-section" id="references-and-links">
          <h2>12. References and Project Links</h2>

          <h3>Internal Project Resources</h3>
          <ul>
            <li>
              <strong>Interactive Case Study Overview:</strong> <Link to="/work/iscribe">iScribe Architecture &amp; Visual Walkthrough</Link>
            </li>
            <li>
              <strong>Architectural Research Monograph:</strong> <Link to="/blog/hybrid-ai-architecture-cpu-guardrails">Hybrid AI Architecture: Deterministic CPU Guardrails for LLMs</Link>
            </li>
            <li>
              <strong>Engineering Prototypes &amp; Benchmarks:</strong> <Link to="/work/technical-lab">Technical Lab — Systems Exploration</Link>
            </li>
            <li>
              <strong>Full Engineering Portfolio:</strong> <Link to="/work">Akther Naimudheen — AI Application &amp; QA Engineering</Link>
            </li>
            <li>
              <strong>Background &amp; Quality Discipline:</strong> <Link to="/about">About Akther Naimudheen</Link>
            </li>
            <li>
              <strong>Contact &amp; Technical Inquiries:</strong> <Link to="/contact">Get in Touch</Link>
            </li>
          </ul>

          <h3>External Research &amp; References</h3>
          <ol className="article-references-list">
            <li>
              <strong>Tierney, A. A., et al. (2024).</strong> <em>Ambient Artificial Intelligence Scribes to Alleviate the Burden of Clinical Documentation.</em> NEJM Catalyst. (Examines the impact of ambient clinical documentation on physician burnout and charting time).
            </li>
            <li>
              <strong>Rajpurkar, P., et al. (2022).</strong> <em>AI in Health and Medicine.</em> Nature Medicine, 28(1), 31–38. (Discusses validation requirements and deployment pitfalls of clinical NLP).
            </li>
            <li>
              <strong>Commercial Ambient Scribe Context:</strong> Enterprise documentation platforms (e.g., Nuance DAX Copilot, Abridge, Nabla Copilot, Suki AI) demonstrate clinical documentation potential in healthcare networks. <em>Note: Vendor claims regarding time savings and documentation accuracy reflect proprietary commercial evaluations and are cited as industry context rather than direct performance baselines.</em>
            </li>
            <li>
              <strong>Pydantic &amp; Zod Schema Validation:</strong> Data validation and type safety protocols using Python type hints and TypeScript runtime schema parsers.
            </li>
          </ol>
        </section>

      </div>

      {/* Author Bio Footer Band */}
      <footer className="article-footer-bio">
        <img
          src={profile.portrait.src}
          alt={profile.name}
          width={80}
          height={80}
          className="article-bio-avatar"
        />
        <div>
          <h3>About the Author</h3>
          <p>
            <strong>Akther Naimudheen (Akther V N)</strong> is an AI application and full-stack software engineer based in Kochi, Kerala. His background combines practical software development with direct experience in AI clinical documentation QA (DeepScribe AI project at Ritesource) and OCR medical record verification (Wisedocs). He focuses on deterministic guardrails, applied LLM systems, and reliable software engineering.
          </p>
          <div className="article-bio-links">
            <Link to="/about" className="link-underline">
              About Akther Naimudheen <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link to="/contact" className="link-underline">
              Get in touch <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
