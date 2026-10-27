import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, ShieldAlert, AlertTriangle, CheckCircle2, FileText, Tag, Terminal } from 'lucide-react';
import { profile } from '@/data/profile';

export function HybridAiArticle() {
  return (
    <article className="article-container" aria-labelledby="article-title">
      {/* Top Breadcrumb & Navigation */}
      <nav className="article-nav" aria-label="Breadcrumb">
        <Link to="/blog" className="back-link">
          <ArrowLeft aria-hidden="true" /> Technical Publication
        </Link>
        <span className="article-nav__separator" aria-hidden="true">/</span>
        <span className="article-nav__current">Applied AI &amp; NLP</span>
      </nav>

      {/* Header */}
      <header className="article-header">
        <p className="eyebrow">Applied AI Architecture · Systems Engineering</p>
        <h1 id="article-title">
          Hybrid AI Architecture: Deterministic CPU Guardrails for LLMs
        </h1>
        <p className="article-lede">
          Why treating the neural model as an untrusted coprocessor within a deterministic CPU runtime creates safer, faster, and cheaper AI systems.
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
            <span><strong>Published:</strong> October 2026</span>
            <span><strong>Read time:</strong> 12 min read</span>
            <span><strong>Status:</strong> Evaluated on Synthetic Benchmarks</span>
          </div>
        </div>
      </header>

      {/* Key Verified Metrics Summary Card */}
      <div className="article-metrics-banner">
        <div className="article-metric-pill">
          <strong>36.1× Latency</strong>
          <span>Overrun in CPU Pilot</span>
        </div>
        <div className="article-metric-pill">
          <strong>4 Guardrail Layers</strong>
          <span>Automated CPU Pipeline</span>
        </div>
        <div className="article-metric-pill">
          <strong>0.8837 F1</strong>
          <span>Frozen B2 Synthetic Gate</span>
        </div>
        <div className="article-metric-pill">
          <strong>5 Pipeline Stages</strong>
          <span>Fail-Closed Human Review</span>
        </div>
      </div>

      {/* Article Body */}
      <div className="article-body">

        {/* Section 1 */}
        <section className="article-section" id="model-as-computer-anti-pattern">
          <h2>1. The "Model-as-Computer" Anti-Pattern</h2>
          <p>
            In modern generative AI application engineering, there is an unspoken assumption that has become standard practice: <strong>treat the foundation model as the entire computer.</strong>
          </p>
          <p>
            When an engineering team builds an entity extraction pipeline, a clinical documentation assistant, or a document parser, the common architecture is strikingly uniform. Raw, unstructured text is bundled into a massive prompt. A Large Language Model (LLM) is asked to simultaneously parse syntax, resolve domain vocabulary, extract entities, evaluate negation, enforce business logic, and emit strictly formatted JSON.
          </p>

          <div className="article-diagram-card">
            <div className="article-diagram-title">The Standard Model-Centric Anti-Pattern</div>
            <pre className="article-pre">
{`[ Raw Transcript ] ──▶ [ Massive System Prompt ] ──▶ [ LLM API / Cloud GPU ] ──▶ [ Output JSON ]`}
            </pre>
          </div>

          <p>
            On a simple demo, this model-centric architecture looks miraculous. But when you deploy it into resource-constrained or safety-conscious environments—such as clinical dialogue processing or local workstation software—the architecture breaks down along three fundamental engineering fault lines:
          </p>
          <ol className="article-numbered-list">
            <li>
              <strong>Unbounded Non-Determinism:</strong> Neural language models are stochastic next-token predictors. Even at temperature <code>T = 0</code>, minor variations in prompt whitespace, token serialization, or GPU floating-point non-determinism can cause valid inputs to fail schema validation or produce subtle factual variations.
            </li>
            <li>
              <strong>Extreme Compute Inefficiency:</strong> Executing billions of floating-point operations (FLOPs) on dedicated GPUs to perform mechanical tasks—such as regex boundary matching, timestamp alignment, unit conversion, or looking up a known drug in a fixed dictionary—wastes electrical power, incurs cloud API fees, and introduces 500 ms to 2,000 ms of unnecessary network latency.
            </li>
            <li>
              <strong>Unanchored Hallucinations:</strong> Unconstrained attention mechanisms have no intrinsic concept of ground truth. When tasked with extracting observations from complex dialogue, they can effortlessly fabricate plausible-sounding clinical findings or invert critical negations (such as turning "patient denies chest pain" into an active symptom).
            </li>
          </ol>

          <h3>The Alternative: Treating the Model as an Untrusted Coprocessor</h3>
          <p>
            In systems engineering, we do not allow untrusted user input to write directly to a database without validation. Why should probabilistic token completions be treated differently?
          </p>
          <p>
            The architecture I propose—<strong>Hybrid CPU/Model Intelligence</strong>—flips the prevailing paradigm. Instead of treating the neural model as the entire application runtime, it treats the model as an <strong>asynchronous, untrusted coprocessor wrapped inside a deterministic, CPU-bound software harness</strong>.
          </p>

          <div className="article-diagram-card">
            <div className="article-diagram-title">Hybrid Architecture: The Coprocessor Model</div>
            <pre className="article-pre">
{`[ Raw Input ] ──▶ [ CPU Deterministic Intake ] ──▶ [ Selective Model Coprocessor ] ──▶ [ CPU Guardrails ] ──▶ [ Human Review ]`}
            </pre>
          </div>

          <p>
            Deterministic software running on commodity CPUs executes before and after any model invocation:
          </p>
          <ul className="article-list">
            <li>
              <strong>Before the model is called:</strong> Fast, deterministic CPU routines clean the input, resolve known domain entities via dictionary lookups, tokenize spans, and construct a targeted, minimal prompt containing only unresolved ambiguities.
            </li>
            <li>
              <strong>After the model generates:</strong> A multi-layered deterministic guardrail layer validates structural schemas, verifies verbatim text provenance against the source transcript, checks domain boundaries, and routes ambiguous facts to human oversight.
            </li>
          </ul>

          <div className="case-notice" role="alert">
            <ShieldAlert className="article-notice-icon" aria-hidden="true" />
            <div>
              <strong>Engineering Scope &amp; Intellectual Honesty:</strong>
              <p>
                I am not claiming to have invented hybrid AI, neuro-symbolic reasoning, or model cascades. Combining heuristic rules with statistical classifiers has decades of proven industrial precedent—from 1990s spam filters to search intent routing. Nor am I presenting a theoretical breakthrough or a certified medical device.
              </p>
              <p>
                What I am presenting is an <strong>applied systems engineering architecture, concrete implementation patterns, and empirical benchmark lessons</strong> developed while building and testing local clinical documentation pipelines on CPU hardware.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="article-section" id="five-stage-pipeline">
          <h2>2. The Five-Stage Pipeline Topology</h2>
          <p>
            To build a reliable hybrid system, software engineers must avoid treating "pipeline" as a vague black box. In my architecture, the end-to-end processing lifecycle is partitioned into <strong>five distinct pipeline stages</strong>. Stages 1 through 4 represent automated software execution, while Stage 5 is an asynchronous human oversight stage:
          </p>

          <div className="article-diagram-card">
            <div className="article-diagram-title">End-to-End Pipeline Stages</div>
            <pre className="article-pre">
{`Stage 1: CPU-Side Deterministic Intake & Pre-Processing
   │  (Regex matching, tokenizers, phonetic mapping; sub-5ms design target)
   ▼
Deterministic Gate: Ambiguity or Synthesis Needed?
   ├── No  ──▶ High-Confidence Extraction directly to Fact Store
   └── Yes ──▶ Stage 2: Selective Model Execution (minimal targeted prompt, SLM/LLM)
                  │
                  ▼
               Stage 3: Model-Based Synthesis (constrained JSON schema emission)
                  │
                  ▼
               Stage 4: Automated Deterministic Guardrails (4-layer CPU checks)
                  │
                  ├── All Guardrails Pass ──▶ Pass to Fact Store
                  └── Fails or Ambiguous  ──▶ Stage 5: Mandatory Human Review (asynchronous)`}
            </pre>
          </div>

          <h3>Stage 1: CPU-Side Deterministic Intake &amp; Pre-Processing</h3>
          <p>
            Before any neural model receives a token, deterministic code executes on the host CPU.
          </p>
          <ul className="article-list">
            <li><strong>Tools:</strong> Pre-compiled regular expressions, finite state machines, Levenshtein string distance, hash maps (e.g., specialized Malayalam-English clinical lexicons), and abstract syntax tree (AST) parsers.</li>
            <li><strong>Design Target:</strong> Sub-millisecond to sub-5ms (&lt; 5 ms) execution per sentence.</li>
            <li><strong>Function:</strong> Sanitizes transcript noise, standardizes colloquial phonetic spellings, segments sentence boundaries, and extracts closed-vocabulary entities (such as numeric blood pressures, standard heart rates, and known medications). If an input consists solely of unambiguous, closed-vocabulary facts, the deterministic gate resolves it immediately without ever invoking a neural model.</li>
          </ul>

          <h3>Stage 2: Selective Model Execution</h3>
          <p>
            When input text contains conversational narrative, complex syntax, or open-vocabulary descriptions that rule-based systems cannot parse with high confidence, the system invokes a language model.
          </p>
          <ul className="article-list">
            <li><strong>Mechanism:</strong> Instead of passing the entire raw document into the prompt, the deterministic pre-processor isolates only the unresolved sentences. It constructs a targeted, minimal prompt, preserving token budgets.</li>
            <li><strong>Coprocessor Selection:</strong> The system routes the query either to a local CPU-quantized Small Language Model (SLM, 1.5B–3B parameters via GGUF/llama.cpp) or to an external API endpoint depending on offline privacy constraints.</li>
          </ul>

          <h3>Stage 3: Model-Based Synthesis</h3>
          <p>
            The model performs generative synthesis—transforming conversational fragments into cohesive draft notes (such as Subjective/Objective sections in clinical documentation) or normalizing non-standard clinical phrasing.
          </p>
          <ul className="article-list">
            <li><strong>Contract:</strong> The model is never allowed to emit unrestricted markdown. It must emit strictly constrained JSON conforming to a rigid schema contract.</li>
          </ul>

          <h3>Stage 4: Automated Deterministic Guardrails</h3>
          <p>
            Model output is intercepted immediately upon generation. A multi-layered deterministic evaluation harness running on the host CPU validates the candidate completion across four independent automated layers before any application state is updated.
          </p>

          <h3>Stage 5: Mandatory Human Review &amp; Clinician Oversight</h3>
          <p>
            In high-stakes domains like clinical healthcare, AI software must never autonomously commit generated records to production databases or Electronic Health Records (EHR).
          </p>
          <ul className="article-list">
            <li><strong>Mechanism:</strong> When automated checks flag an unanchored fact, a polarity conflict, or an out-of-bounds measurement, the candidate finding is highlighted with visual diffs in a clinician-in-the-loop review interface. The clinician can approve, correct, or reject the finding with a single click. Stage 5 operates asynchronously and fail-closed: unreviewed findings remain uncommitted drafts.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="article-section" id="four-layers-of-guardrails">
          <h2>3. The Four Layers of Deterministic AI Guardrails (Stage 4)</h2>
          <p>
            A widespread point of confusion in applied AI engineering is conflating <strong>schema validation</strong> with <strong>factual correctness</strong>.
          </p>
          <p>
            Many developers believe that using Pydantic or structured JSON output eliminates hallucinations. It does not. A model can emit syntactically flawless JSON that is factually fabricated.
          </p>
          <p>
            To prevent this confusion, my architecture decomposes <strong>Stage 4 (Automated Deterministic Guardrails)</strong> into four strictly separated automated layers:
          </p>

          <div className="article-table-wrapper">
            <table className="article-table">
              <thead>
                <tr>
                  <th>Automated Guardrail Layer</th>
                  <th>Validation Mechanism</th>
                  <th>What It Deterministically Enforces</th>
                  <th>What It CANNOT Enforce</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Layer 1: Structural Schema Validation</strong></td>
                  <td>Pydantic / Zod models, JSON schema parsing</td>
                  <td>Ensures output is valid JSON, required keys exist, and data types conform (e.g., <code>pulse: int</code>).</td>
                  <td><strong>Cannot detect factual fabrications.</strong> If an LLM hallucinates an organ finding (e.g., <code>{`{"organ": "gallbladder", "status": "normal"}`}</code> in a kidney exam), the schema validates successfully because the dictionary conforms to the type specification.</td>
                </tr>
                <tr>
                  <td><strong>Layer 2: Transcript-Span Grounding</strong></td>
                  <td>Verbatim substring matching, character-offset containment (<code>start_char</code>, <code>end_char</code>)</td>
                  <td>Verifies that the cited string literally appeared in the source text. Intercepts entities fabricated out of thin air.</td>
                  <td><strong>Cannot detect negation or clinical context.</strong> Verifying that "chest pain" appears in the text does not prevent misclassifying "denies chest pain" as an active symptom.</td>
                </tr>
                <tr>
                  <td><strong>Layer 3: Syntactic Polarity &amp; Negation Parsing</strong></td>
                  <td>Syntactic dependency parse trees, NegEx cue binding algorithms</td>
                  <td>Binds negation cues ("denies", "no", "without") to target entity heads; verifies assertion status.</td>
                  <td><strong>Cannot detect unmentioned entities or verify examination scope.</strong> Must be combined with span grounding and domain whitelists.</td>
                </tr>
                <tr>
                  <td><strong>Layer 4: Semantic Domain &amp; Physiological Bounds</strong></td>
                  <td>Examination scope whitelists, numerical range validation tables</td>
                  <td>Enforces physiological bounds (e.g., heart rate 30 &le; HR &le; 250 bpm) and restricts findings to allowable anatomy for the exam type.</td>
                  <td><strong>Cannot resolve clinical judgment or complex narrative ambiguity.</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>The Gallbladder in a Kidney Scan: Why Schema Checks Fail Factual Grounding</h3>
          <p>
            To understand why Layer 1 cannot guarantee safety on its own, consider an ultrasound dictation where a sonographer evaluates only the kidneys.
          </p>
          <p>
            A generative model tasked with producing a structured report might complete its output by generating:
          </p>

          <div className="article-code-wrapper">
            <div className="article-code-caption">
              <Terminal className="code-caption-icon" aria-hidden="true" />
              <span>Hallucinated but syntactically valid completion</span>
              <span className="code-lang-tag">json</span>
            </div>
            <pre className="article-code-block">
<code>
  <span className="token-brace">{'{'}</span>{'\n'}
  {'  '}<span className="token-key">"organ"</span><span className="token-punct">:</span> <span className="token-string">"gallbladder"</span><span className="token-punct">,</span>{'\n'}
  {'  '}<span className="token-key">"status"</span><span className="token-punct">:</span> <span className="token-string">"normal"</span><span className="token-punct">,</span>{'\n'}
  {'  '}<span className="token-key">"echogenicity"</span><span className="token-punct">:</span> <span className="token-string">"homogeneous"</span><span className="token-punct">,</span>{'\n'}
  {'  '}<span className="token-key">"calculi"</span><span className="token-punct">:</span> <span className="token-boolean">false</span>{'\n'}
  <span className="token-brace">{'}'}</span>
</code>
            </pre>
          </div>

          <p>
            If you pass this dictionary through Pydantic or a JSON schema validator, <strong>it passes with zero errors</strong>. The keys are strings and booleans; the required fields are populated; the enum values are valid.
          </p>
          <p>
            Yet, clinically, this is a catastrophic hallucination: the sonographer never examined the gallbladder. Documenting an unexamined organ as "normal" exposes patients to diagnostic delays and providers to severe malpractice liability.
          </p>
          <p>
            Schema validation (Layer 1) confirms syntactic structure; only <strong>Transcript-Span Grounding (Layer 2)</strong> and <strong>Examination Scope Whitelists (Layer 4)</strong> can detect that the gallbladder was never mentioned in the transcript and is out of scope for a renal exam.
          </p>

          <h3>The "Denies Chest Pain" Dilemma: Why Span Matching Alone Fails</h3>
          <p>
            Conversely, developers often assume that verbatim span grounding solves all hallucination problems. If every extracted entity quotes an exact character offset in the source transcript, can the fact still be wrong?
          </p>
          <p>
            Yes. Consider this consultation transcript:
          </p>

          <div className="article-code-wrapper">
            <div className="article-code-caption">
              <Terminal className="code-caption-icon" aria-hidden="true" />
              <span>Transcript-span extraction with polarity inversion</span>
              <span className="code-lang-tag">text</span>
            </div>
            <pre className="article-code-block">
<code>
  <span className="token-label">Source Sentence:</span> <span className="token-string">"Patient reports mild nausea yesterday, but strongly denies any chest pain or shortness of breath."</span>{'\n'}
  <span className="token-label">Candidate Fact from Model:</span>{'\n'}
  <span className="token-brace">{'{'}</span>{'\n'}
  {'  '}<span className="token-key">"entity"</span><span className="token-punct">:</span> <span className="token-string">"chest pain"</span><span className="token-punct">,</span>{'\n'}
  {'  '}<span className="token-key">"verbatim_quote"</span><span className="token-punct">:</span> <span className="token-string">"chest pain"</span><span className="token-punct">,</span>{'\n'}
  {'  '}<span className="token-key">"status"</span><span className="token-punct">:</span> <span className="token-string">"confirmed"</span>  <span className="token-error">&lt;-- CRITICAL POLARITY ERROR</span>{'\n'}
  <span className="token-brace">{'}'}</span>
</code>
            </pre>
          </div>

          <ul className="article-list">
            <li>
              <strong>What Transcript-Span Matching Proves:</strong> The candidate fact cites "chest pain". A verbatim span validator searches the raw transcript, finds the exact substring at character offset 64–74, and marks the fact as provenance-grounded. Span matching alone succeeds because the words exist in the text.
            </li>
            <li>
              <strong>What Transcript-Span Matching Does NOT Prove:</strong> It fails to recognize that the governing predicate is "strongly denies". Without syntactic dependency trees (Layer 3) or negation cue binding, the system extracts a denied symptom as an active complaint.
            </li>
            <li>
              <strong>The Engineering Takeaway:</strong> Transcript-span matching is a necessary baseline for provenance, but it cannot stand alone. The deterministic layer must combine verbatim span anchoring with syntactic polarity parse trees (e.g., spaCy Negex rules), exam boundary checking, and mandatory human clinician review (Stage 5) before any record is committed.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="article-section" id="empirical-benchmarks">
          <h2>4. Empirical Reality Check: Lessons from Preliminary Benchmarks</h2>
          <p>
            Rather than relying solely on architectural diagrams, I evaluated these concepts across internal experimental benchmarks documented in my portfolio repository.
          </p>

          <h3>A. The 12-Case Ultrasound Pilot Experiment</h3>
          <p>
            In an internal preliminary experiment documented in <Link to="/blog/building-clinical-ai-beyond-transcription">the clinical AI case study</Link>, I evaluated three extraction approaches across 12 curated ultrasound test cases (<code>US-DEV-01</code> through <code>US-DEV-12</code> in synthetic fixtures) using a local LLM (<code>qwen-coder-abliterated:latest</code>) running via Ollama on a commodity host CPU:
          </p>

          <div className="article-table-wrapper">
            <table className="article-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Approach A (Deterministic spaCy + Regex)</th>
                  <th>Approach B (Local LLM Raw Prompt)</th>
                  <th>Approach C (Local LLM + Schema Validated)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cases Evaluated</td>
                  <td>12</td>
                  <td>12</td>
                  <td>12</td>
                </tr>
                <tr>
                  <td>Findings Recall</td>
                  <td>0.333</td>
                  <td><strong>1.000</strong></td>
                  <td><strong>1.000</strong></td>
                </tr>
                <tr>
                  <td>Measurement Recall</td>
                  <td>0.111</td>
                  <td><strong>0.667</strong></td>
                  <td><strong>0.667</strong></td>
                </tr>
                <tr>
                  <td>Negative Finding Recall</td>
                  <td>0.000</td>
                  <td><strong>1.000</strong></td>
                  <td><strong>1.000</strong></td>
                </tr>
                <tr>
                  <td>Polarity Errors</td>
                  <td>3</td>
                  <td><strong>1</strong></td>
                  <td><strong>1</strong></td>
                </tr>
                <tr>
                  <td>Laterality Errors</td>
                  <td>5</td>
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
                  <td>Review-Flagged Cases</td>
                  <td>12</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>Mean Inference Latency (CPU)</td>
                  <td><strong>&lt; 0.2 s (42 ms)</strong></td>
                  <td>54.2 s (range: 34.5s–61.3s)</td>
                  <td>54.2 s</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>Two Critical Engineering Lessons from the Pilot:</h4>
          <ol className="article-numbered-list">
            <li>
              <strong>Schema Validation Does Not Repair Factual Errors:</strong> Notice that in the table above, <strong>Approach C also recorded 7 prohibited hallucination hits and 4 review-flagged cases—identical to Approach B</strong>. While Approach C enforced rigid JSON structure, post-hoc schema validation could not magically repair ungrounded completions without dropping findings. When the model hallucinated normal findings for unexamined organs (such as liver and gallbladder findings in Cases <code>US-DEV-02</code> and <code>US-DEV-03</code>), the schema validator accepted them because they were formatted correctly. <em>(Note: The underlying code and execution logs reside in the private iScribe repository and cannot be independently verified from public portfolio files alone).</em>
            </li>
            <li>
              <strong>The 54.2-Second Latency Bottleneck:</strong> Running an unconstrained 7B-class model (<code>qwen-coder-abliterated:latest</code>) on local CPU via Ollama required an average of <strong>54.2 seconds</strong> per consultation note. Against my proposed <strong>1,500 ms real-time consultation target</strong>, this measured result was approximately <strong>36.1× the target budget</strong>.
            </li>
          </ol>

          <div className="case-notice" role="alert">
            <AlertTriangle className="article-notice-icon" aria-hidden="true" />
            <div>
              <strong>Careful Scope of the Latency Finding:</strong>
              <p>
                This 54.2-second result characterizes the specific configuration evaluated: unconstrained full-transcript generation using <code>qwen-coder-abliterated:latest</code> running via Ollama on an unaccelerated host CPU across 12 ultrasound test cases.
              </p>
              <p>
                This finding illustrates why this particular combination of model, runtime, and unconstrained prompt was unsuitable for synchronous consultation workflows, motivating the need for hybrid pre-filtering, targeted prompt construction, and smaller quantized models.
              </p>
              <p>
                This empirical observation must <strong>not</strong> be extrapolated as a claim that all local language models or all commodity CPUs are unsuitable for interactive clinical workflows. Smaller quantized models (e.g., 1.5B–3B parameters), specialized inference engines (such as llama.cpp with SIMD optimizations), selective span execution, or asynchronous background processing may exhibit substantially different latency profiles.
              </p>
            </div>
          </div>

          <h3>B. The Frozen B2 Synthetic Regression Benchmark</h3>
          <p>
            To verify pipeline stability across refactors, I established the Frozen B2 evaluation runner:
          </p>
          <ul className="article-list">
            <li><strong>Contingency Counts:</strong> True Positives (TP) = 19, False Positives (FP) = 3, False Negatives (FN) = 2</li>
            <li><strong>Precision:</strong> 19 / 22 &approx; 0.8636 (86.36%)</li>
            <li><strong>Recall:</strong> 19 / 21 &approx; 0.9048 (90.48%)</li>
            <li><strong>F1 Score:</strong> (2 &times; 19) / (2 &times; 19 + 3 + 2) = 38 / 43 &approx; <strong>0.8837 (88.37%)</strong></li>
          </ul>
          <p>
            <strong>Sample Size Context &amp; Scientific Limitation:</strong> The Frozen B2 evaluation runner evaluated <strong>a total of 21 ground-truth clinical facts</strong> across architectural partition gates P1–P9 (24 total evaluated instances). This metric is an internal frozen synthetic regression gate designed to verify byte-identical pipeline stability across refactors. It must <strong>not</strong> be presented as a statistically generalized measure of clinical accuracy across real hospital consultations.
          </p>

          <h3>C. The 1,208 Automated Test Harness</h3>
          <p>
            The underlying codebase contains <strong>1,208 automated unit and integration tests</strong>. These tests execute deterministically against synthetic dialogue fixtures, verifying that parser boundaries, regular expressions, and schema models execute without unhandled exceptions. They prove software execution stability; they do <strong>not</strong> constitute independent clinical validation or formal clinical trials.
          </p>
        </section>

        {/* Section 5 */}
        <section className="article-section" id="hypotheses-vs-future-work">
          <h2>5. Separating Measured Results from Hypotheses &amp; Future Work</h2>
          <p>
            In technical writing, conflating what has been measured with what is planned destroys credibility. In this architecture, targets and future work are explicitly separated from verified findings:
          </p>

          <h3>Target Hypotheses (Design Objectives Under Evaluation)</h3>
          <ul className="article-list">
            <li>
              <strong>Hypothesis 1 (Span Grounding vs. Polarity):</strong> Verbatim transcript span anchoring will eliminate unanchored entity extractions (Type II errors) in synthetic benchmarks, but will not prevent polarity inversions (Type III errors) without deterministic negation cue parsing.
            </li>
            <li>
              <strong>Hypothesis 2 (Token and Latency Reduction Targets):</strong> Resolving high-frequency entities via deterministic dictionary and regex lookups prior to model invocation will reduce total model token generation by a target of at least <strong>35%</strong> and median end-to-end processing latency by a target of at least <strong>25%</strong> compared to unconstrained zero-shot prompts.
            </li>
            <li>
              <strong>Hypothesis 3 (Interactive CPU Throughput):</strong> Quantized Small Language Models (SLMs, 1.5B–3B parameters) paired with deterministic pre-passes can achieve interactive throughput targets (<strong>&gt; 15 tokens/sec</strong>) on multi-core CPUs, whereas larger models (7B–8B) fall below interactive thresholds (<strong>&lt; 10 tokens/sec</strong>).
            </li>
          </ul>

          <h3>Planned Benchmarks (Future Work Specification)</h3>
          <p>
            The <strong>250-case primary synthetic consultation dataset</strong> (featuring Malayalam-English code-switching) and <strong>50-case adversarial dataset</strong> described in the research proposal represent a <strong>proposed benchmark specification</strong> for future empirical work. They are planned future validation suites, not existing datasets in the public repository.
          </p>
        </section>

        {/* Section 6 */}
        <section className="article-section" id="limitations-and-scope">
          <h2>6. Threats to Validity &amp; Engineering Limitations</h2>
          <p>
            A credible engineering architecture must be explicit about where it fails or reaches its operational limits:
          </p>
          <ul className="article-list">
            <li>
              <strong>Synthetic Data Bias:</strong> All evaluations to date have been conducted on curated synthetic dialogue fixtures. Real consultation rooms feature background acoustic noise, physician interruptions, patients changing their minds mid-sentence, and subtle regional dialects that synthetic text cannot fully capture.
            </li>
            <li>
              <strong>Rule Maintenance Complexity:</strong> Hand-crafted regular expressions and dictionary mappings can become brittle when extended across new medical specialties or regional dialects. Maintaining deterministic lexicons requires active domain engineering.
            </li>
            <li>
              <strong>Hardware Constraints:</strong> Local CPU inference speed is constrained by RAM memory bandwidth and CPU SIMD instruction sets (AVX-512, ARM Neon). A system tuned for an 8-core desktop CPU may perform sluggishly on an older hospital terminal.
            </li>
            <li>
              <strong>Non-Clinical / Non-Medical-Device Status:</strong> This architecture is an applied software engineering design, not a certified medical device. It cannot claim regulatory compliance (HIPAA, DPDP, CDSCO) without formal organizational, physical, and infrastructure certifications.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="article-section" id="conclusion">
          <h2>7. Conclusion: Pragmatic AI Systems Engineering</h2>
          <p>
            Generative models are extraordinary tools for open-vocabulary synthesis, semantic reasoning, and colloquial translation. But treating them as the entire computing stack is an engineering anti-pattern that leads to high latency, expensive compute, and unanchored hallucinations.
          </p>
          <p>
            By shifting to a <strong>Hybrid CPU/Model Intelligence</strong> architecture:
          </p>
          <ul className="article-list">
            <li>The system assigns <strong>deterministic, closed-vocabulary tasks</strong> to commodity CPUs, with sub-5ms execution remaining a design target until measured for the specified operations and environment.</li>
            <li>The pipeline reserves <strong>neural models as untrusted coprocessors</strong> invoked selectively on complex syntax and generative synthesis.</li>
            <li>Deterministic runtime checks enforce <strong>multi-layered guardrails</strong> combining structural schemas, verbatim span grounding, syntactic polarity parsing, and domain bounds.</li>
            <li>The workflow maintains <strong>fail-closed human review</strong> for ambiguous or out-of-bounds observations.</li>
          </ul>
          <p>
            Systems engineering is about choosing the right tool for the right boundary. The future of reliable, resource-conscious AI does not lie in throwing larger models at mechanical problems, but in surrounding intelligent models with rigorous, deterministic engineering harnesses.
          </p>
        </section>

        {/* Section 8 */}
        <section className="article-section" id="bibliography">
          <h2>8. Verified Bibliography &amp; Literature</h2>
          <ol className="article-references-list">
            <li>
              <strong>Marcus, G. (2020).</strong> <em>The Next Decade in AI: Four Steps Towards Robust Artificial Intelligence.</em> arXiv preprint arXiv:2002.06177. (Analyzes the necessity of hybrid architectures combining deep learning with structured symbolic manipulation).
            </li>
            <li>
              <strong>Leviathan, Y., Kalman, M., &amp; Matias, Y. (2023).</strong> <em>Fast Inference from Transformers via Speculative Decoding.</em> Proceedings of the 40th International Conference on Machine Learning (ICML 2023), PMLR 202:19274-19286. arXiv:2211.17192. (Foundational paper on speculative execution and draft model verification. <em>Note on architectural relationship:</em> Speculative decoding operates at the autoregressive token-sampling level, using a small neural draft model to propose tokens that a larger target model verifies in parallel. While our proposed architecture does not implement speculative token sampling, it draws upon the broader systems engineering principle of asymmetric compute pairing: utilizing fast, low-overhead computation to minimize the invocations and token load of heavier models).
            </li>
            <li>
              <strong>Radford, A., Kim, J. W., Xu, T., Brockman, G., McLeavey, C., &amp; Sutskever, I. (2022).</strong> <em>Robust Speech Recognition via Large-Scale Weak Supervision.</em> arXiv preprint arXiv:2212.04356. (Foundational Whisper architecture and multilingual speech-to-text benchmarks).
            </li>
            <li>
              <strong>Colvin, S., et al. (2024).</strong> <em>Pydantic: Data validation using Python type hints.</em> Official documentation: <a href="https://docs.pydantic.dev/" target="_blank" rel="noopener noreferrer">https://docs.pydantic.dev/</a>. (Runtime data parsing and schema validation).
            </li>
            <li>
              <strong>Akther Naimudheen. (2026).</strong> <em>Building AI Clinical Documentation Beyond Transcription: Engineering Guardrails for Clinical Fact Extraction.</em> Portfolio Technical Case Study. <Link to="/blog/building-clinical-ai-beyond-transcription">ClinicalAiArticle.tsx</Link>.
            </li>
          </ol>
        </section>

        {/* Section 9 */}
        <section className="article-section" id="related-links">
          <h2>9. Related Technical Case Studies &amp; Links</h2>
          <ul className="article-list">
            <li>
              <strong>Related Clinical Documentation Prototype:</strong>{' '}
              <Link to="/work/iscribe">iScribe — Clinical Fact Extraction &amp; Malayalam-English NLP</Link>
            </li>
            <li>
              <strong>Experimental Systems &amp; Local Benchmarks:</strong>{' '}
              <Link to="/work/technical-lab">Technical Lab — Local LLM Inference &amp; Guardrail Prototypes</Link>
            </li>
            <li>
              <strong>Flagship Clinical Research Monograph:</strong>{' '}
              <Link to="/blog/building-clinical-ai-beyond-transcription">
                Building AI Clinical Documentation Beyond Transcription: Engineering Guardrails for Clinical Fact Extraction
              </Link>
            </li>
            <li>
              <strong>Complete Systems Portfolio:</strong>{' '}
              <Link to="/work">Engineering Projects &amp; Case Studies</Link>
            </li>
            <li>
              <strong>Technical Contact:</strong>{' '}
              <Link to="/contact">Direct Engineering Inquiries</Link>
            </li>
          </ul>
        </section>
      </div>

      {/* Article Footer & Tags */}
      <footer className="article-footer">
        <div className="article-tags-block">
          <Tag className="tag-icon" aria-hidden="true" />
          <span className="tags-label">Tags:</span>
          <div className="tags-list">
            <span className="tag-pill">#Hybrid AI</span>
            <span className="tag-pill">#Deterministic Guardrails</span>
            <span className="tag-pill">#CPU Inference</span>
            <span className="tag-pill">#Clinical NLP</span>
            <span className="tag-pill">#Systems Architecture</span>
          </div>
        </div>

        <div className="article-author-box">
          <img
            src={profile.portrait.src}
            alt={profile.name}
            width={64}
            height={64}
            className="author-box-avatar"
          />
          <div className="author-box-bio">
            <h3>{profile.name}</h3>
            <p>
              Independent AI application engineer and former clinical AI QA specialist based in Kerala, India. Working across full-stack applications, API integrations, deterministic evaluation, and intelligent systems.
            </p>
            <div className="author-box-links">
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight aria-hidden="true" />
              </a>
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn <ArrowUpRight aria-hidden="true" />
              </a>
              <Link to="/about">
                About Akther <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/contact">
                Contact <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
