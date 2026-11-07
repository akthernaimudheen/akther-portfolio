import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Shield, ShieldAlert, ShieldCheck, Lock, Server, FileText, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { profile } from '@/data/profile';

export function SidekiqSecurityArticle() {
  return (
    <article className="article-container" aria-labelledby="article-title">
      {/* Top Breadcrumb & Navigation */}
      <nav className="article-nav" aria-label="Breadcrumb">
        <Link to="/blog" className="back-link">
          <ArrowLeft aria-hidden="true" /> Technical Publication
        </Link>
        <span className="article-nav__separator" aria-hidden="true">/</span>
        <span className="article-nav__current">Security Research &amp; Responsible Disclosure</span>
      </nav>

      {/* Header */}
      <header className="article-header">
        <p className="eyebrow">Application Security Research · Responsible Disclosure</p>
        <h1 id="article-title">
          Exposed Sidekiq Dashboard: An Independent Security Observation and Responsible Disclosure
        </h1>
        <p className="article-lede">
          What happens when an application's background-job management system is exposed to the public internet without adequate access controls? An independent observation, security implications, and the responsible disclosure process.
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
              <span>Independent Software Developer &amp; AI-Focused Engineer</span>
            </div>
          </div>
          <div className="article-meta-details">
            <span><strong>Published:</strong> October 2026</span>
            <span><strong>Read time:</strong> 8 min read</span>
            <span className="article-meta-status-pill">
              Responsible Disclosure Case Study
            </span>
          </div>
        </div>
      </header>

      {/* Key Observation Summary Banner */}
      <div className="article-metrics-banner">
        <div className="article-metric-pill">
          <strong>Observation</strong>
          <span>Exposed Background UI</span>
        </div>
        <div className="article-metric-pill">
          <strong>Protocol</strong>
          <span>Responsible Disclosure</span>
        </div>
        <div className="article-metric-pill">
          <strong>Escalation</strong>
          <span>CERT-In Coordination</span>
        </div>
        <div className="article-metric-pill">
          <strong>Reference</strong>
          <span>CERTIn-55576526</span>
        </div>
      </div>

      {/* Article Body */}
      <div className="article-body">

        {/* Responsible Disclosure Scope Callout */}
        <div className="case-notice" role="alert" style={{ marginBottom: '2.5rem' }}>
          <ShieldAlert className="article-notice-icon" aria-hidden="true" />
          <div>
            <strong>Responsible Disclosure &amp; Data Protection Notice:</strong>
            <p>
              In accordance with responsible vulnerability disclosure principles, all infrastructure identifiers, organization names, hostnames, IP addresses, operational datasets, and reproduction steps are intentionally withheld from this publication.
            </p>
            <p style={{ marginTop: '0.45rem', fontSize: '0.86rem', color: 'var(--muted)' }}>
              No third-party data was extracted, modified, or retained. The investigation was conducted strictly to identify the exposure boundary and alert the appropriate administrative authorities.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <section className="article-section" id="introduction">
          <p>
            Security research doesn't always begin in a professional security laboratory. Sometimes it starts with curiosity, a technical observation, and the decision to investigate a potential security weakness responsibly.
          </p>
          <p>
            In October 2026, while exploring publicly accessible infrastructure, I encountered an exposed Sidekiq dashboard that appeared to be accessible without authentication.
          </p>
          <p>
            What initially looked like an administrative interface raised a more important question: <strong>what happens when an application's background-job management system is exposed to the public internet without adequate access controls?</strong>
          </p>
          <p>
            I documented the observation, reported it to the affected organization, and subsequently escalated the matter to India's national cybersecurity response team, CERT-In.
          </p>
          <p>
            This article documents the security observation, its implications, the disclosure timeline, and the lessons I took away from the experience.
          </p>
        </section>

        {/* Section 1 */}
        <section className="article-section" id="understanding-sidekiq-exposure">
          <h2>1. Understanding the Sidekiq Dashboard Exposure</h2>
          <p>
            <a href="https://sidekiq.org/" target="_blank" rel="noopener noreferrer">Sidekiq</a> is a background-job processing framework commonly used in Ruby applications. It allows applications to process asynchronous tasks, manage queues, retry failed jobs, and monitor background processing activity.
          </p>
          <p>
            Its web interface provides operational visibility into information such as:
          </p>
          <ul className="article-list">
            <li><strong>Background-job queues:</strong> Active queues and real-time processing throughput.</li>
            <li><strong>Scheduled and retry jobs:</strong> Pending tasks awaiting dispatch or retries following transient errors.</li>
            <li><strong>Failed and dead jobs:</strong> Unhandled exceptions, failed executions, and error backtraces.</li>
            <li><strong>Worker statistics:</strong> Thread pool concurrency, memory usage, and operational metrics.</li>
            <li><strong>Administrative job-management functionality:</strong> Interactive controls to manually retry, clear, or terminate jobs.</li>
          </ul>
          <p>
            These features are useful to developers and system administrators. However, they also make the dashboard a sensitive administrative interface.
          </p>
          <p>
            According to the official <a href="https://sidekiq.org/wiki/Monitoring" target="_blank" rel="noopener noreferrer">Sidekiq monitoring documentation</a>, production deployments can restrict dashboard access through authentication and authorization constraints.
          </p>
          <p>
            An exposed dashboard can therefore create a significant access-control concern.
          </p>

          <div className="article-diagram-card">
            <div className="article-diagram-title">Conceptual Architecture: The Boundary Disconnect</div>
            <pre className="article-pre">
{`[ Public Internet ] ──▶ [ Primary Application Router ] ──▶ [ Enforces Session & Login ] ──▶ Protected Resources
                               │
                               ▼ (Separately Mounted Route)
                        [ /sidekiq Web UI ] ──▶ [ Missing Authentication Gate ] ──▶ [ Redis Queues & Job Management ]`}
            </pre>
          </div>
        </section>

        {/* Section 2 */}
        <section className="article-section" id="initial-security-observation">
          <h2>2. Initial Security Observation</h2>
          <p>
            During my investigation in October 2026, I identified a publicly accessible Sidekiq web interface associated with a production environment.
          </p>
          <p>
            The initial observation was that the dashboard responded successfully without requiring authentication.
          </p>
          <p>
            The application also appeared to have a separate authentication mechanism for its primary administrative interface. However, the Sidekiq dashboard did not appear to enforce the same protection.
          </p>
          <p>
            This highlighted a potentially important security boundary issue: <strong>protecting the main application does not automatically protect independently mounted administrative services.</strong>
          </p>
          <p>
            I recorded the observation and its relevant security implications.
          </p>
          <p>
            I am intentionally withholding infrastructure identifiers, operational data, screenshots containing sensitive information, and reproduction details to avoid exposing the affected environment.
          </p>
        </section>

        {/* Section 3 */}
        <section className="article-section" id="why-an-exposed-dashboard-matters">
          <h2>3. Why an Exposed Sidekiq Dashboard Matters</h2>
          <p>
            A background-job dashboard should not be treated as an ordinary public-facing page.
          </p>
          <p>
            Depending on the permissions and configuration available through the exposed interface, unauthorized access could create risks involving:
          </p>
          <ul className="article-list">
            <li>
              <strong>Operational information disclosure:</strong> Queue names, worker information, job metadata, and processing statistics can reveal details about an application's internal operations and backend architecture.
            </li>
            <li>
              <strong>Administrative functionality exposure:</strong> Job-management interfaces can expose controls for retrying, deleting, or otherwise managing background jobs.
            </li>
            <li>
              <strong>Potential service disruption:</strong> Unauthorized administrative operations could interfere with application workflows or background processing lifecycles.
            </li>
            <li>
              <strong>Sensitive information exposure:</strong> Job metadata and associated application data may contain information that should only be accessible to authorized personnel.
            </li>
          </ul>
          <p>
            The actual impact depends on the exposed functionality, application architecture, and the permissions enforced by the deployment.
          </p>
          <p>
            This is why an exposed dashboard should be investigated and remediated rather than dismissed as a minor configuration issue.
          </p>
        </section>

        {/* Section 4 */}
        <section className="article-section" id="responsible-disclosure-and-escalation">
          <h2>4. Responsible Disclosure and Escalation</h2>
          <p>
            After identifying the exposure, I attempted to report the issue directly to the affected organization.
          </p>
          
          <h3>Disclosure Timeline</h3>
          <div className="article-table-wrapper">
            <table className="article-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Date</th>
                  <th>Event &amp; Coordination Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>6 October 2026</strong></td>
                  <td>Initial security report submitted to the organization.</td>
                </tr>
                <tr>
                  <td><strong>18 October 2026</strong></td>
                  <td>Escalation submitted to CERT-In following unsuccessful attempts to obtain a response.</td>
                </tr>
                <tr>
                  <td><strong>October 2026</strong></td>
                  <td>Continued documentation of the reported exposure and its status.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            The CERT-In escalation was registered under reference:
          </p>

          <div className="article-diagram-card" style={{ borderLeft: '3px solid var(--ink)', padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--ink)', fontSize: '0.72rem' }}>Official CERT-In Registration Reference</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.04em', fontFamily: 'monospace', color: 'var(--ink)', marginTop: '0.2rem' }}>
                  CERTIn-55576526
                </div>
              </div>
              <span className="article-meta-status-pill">
                Coordination Case
              </span>
            </div>
          </div>

          <p>
            I am sharing the reference as part of documenting the disclosure process, not as an indication of an official vulnerability confirmation or endorsement.
          </p>
          <p>
            CERT-In's <a href="https://cert-in.org.in/RVDCP.jsp" target="_blank" rel="noopener noreferrer">Responsible Vulnerability Disclosure and Coordination Policy</a> describes the process through which vulnerability reports can be coordinated between researchers, affected organizations, and relevant stakeholders.
          </p>
          <p>
            This experience reinforced the importance of documenting findings and using appropriate reporting channels.
          </p>
        </section>

        {/* Section 5 */}
        <section className="article-section" id="technical-lessons">
          <h2>5. Technical Lessons from the Observation</h2>
          <p>
            There are several important lessons for developers and infrastructure administrators:
          </p>

          <div className="article-takeaways-grid">
            <div className="article-takeaway-card">
              <h3>1. Protect Administrative Interfaces Independently</h3>
              <p>
                Authentication on the primary application should never be assumed to protect separately mounted administrative services. Each sensitive interface should enforce its own appropriate access-control requirements.
              </p>
            </div>
            <div className="article-takeaway-card">
              <h3>2. Restrict Sidekiq Web UI Access</h3>
              <p>
                The official Sidekiq documentation provides examples of restricting access through authentication and administrator authorization. Production deployments should ensure that only explicitly authorized users can access the dashboard.
              </p>
            </div>
            <div className="article-takeaway-card">
              <h3>3. Apply Network-Level Restrictions</h3>
              <p>
                Where appropriate, administrative interfaces should be accessible only through trusted internal networks, VPNs, or other controlled access mechanisms.
              </p>
            </div>
            <div className="article-takeaway-card">
              <h3>4. Follow the Principle of Least Privilege</h3>
              <p>
                Administrative capabilities should be limited to users who genuinely require them for operational duties.
              </p>
            </div>
          </div>

          <h3>Relevant Authoritative Guidance</h3>
          <ul className="article-list">
            <li>
              <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer">
                OWASP Authentication Cheat Sheet <ExternalLink size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </a> — Best practices for user authentication, credential storage, and session security.
            </li>
            <li>
              <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer">
                OWASP Authorization Cheat Sheet <ExternalLink size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </a> — Enforcing robust access-control boundaries across microservices and administrative endpoints.
            </li>
            <li>
              <a href="https://sidekiq.org/wiki/Monitoring" target="_blank" rel="noopener noreferrer">
                Sidekiq Official Monitoring Guide <ExternalLink size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </a> — Securing the Web UI via Rack middleware, Devise constraints, or HTTP Basic authentication.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="article-section" id="remediation-status">
          <h2>6. Remediation Status</h2>
          <p>
            A responsible security report should distinguish between reporting an issue and independently verifying its remediation.
          </p>
          <p>
            I am retaining the disclosure timeline and supporting evidence privately. I will update this section if I obtain reliable confirmation that the exposure has been fixed.
          </p>
          <p>
            I do not currently claim an independently verified remediation date or a confirmed causal relationship between my report and any subsequent changes.
          </p>
        </section>

        {/* Section 7 */}
        <section className="article-section" id="what-i-learned">
          <h2>7. What I Learned as an Independent Researcher</h2>
          <p>
            This experience was valuable beyond the technical finding itself.
          </p>
          <p>
            It gave me an opportunity to understand how production infrastructure can expose administrative functionality, why access-control boundaries matter, and how security observations can be communicated through formal reporting channels.
          </p>
          <p>
            It also reinforced an important principle for my future work: <strong>security research must remain within clearly authorized boundaries, use the minimum verification necessary, and avoid accessing or retaining information that is not required to establish a finding.</strong>
          </p>
          <p>
            I am continuing to develop my understanding of application security, infrastructure security, and responsible vulnerability disclosure alongside my work in AI engineering and software development.
          </p>
        </section>

        {/* Conclusion */}
        <section className="article-section" id="conclusion">
          <h2>Conclusion</h2>
          <p>
            The Sidekiq dashboard observation was a reminder that even well-established software components can become security risks when deployed with inadequate access controls.
          </p>
          <p>
            For developers, the lesson is straightforward: administrative interfaces must be protected independently, and production infrastructure should be regularly reviewed for unintended public exposure.
          </p>
          <p>
            For me, this was an opportunity to move beyond building software and develop a deeper understanding of how production systems should be secured.
          </p>
          <p>
            I intend to continue learning, documenting technical observations, and contributing to a safer software ecosystem through responsible and authorized security research.
          </p>
        </section>

        {/* Internal Navigation and Related Resources */}
        <section className="article-section" id="related-resources" style={{ borderTop: '1px solid var(--hairline)', paddingTop: '2rem' }}>
          <h2>Related Architecture &amp; Engineering Case Studies</h2>
          <ul className="article-list">
            <li>
              <strong>Asynchronous Worker Architecture:</strong>{' '}
              <Link to="/blog/architecting-asynchronous-video-pipelines-fastapi-ffmpeg">
                Architecting Asynchronous Video Processing Pipelines with FastAPI and Worker Queues
              </Link>{' '}
              — Examining decoupled job queues, worker process management, and concurrency boundaries.
            </li>
            <li>
              <strong>Deterministic Systems &amp; Guardrails:</strong>{' '}
              <Link to="/blog/hybrid-ai-architecture-cpu-guardrails">
                Hybrid AI Architecture: Deterministic CPU Guardrails for LLMs
              </Link>{' '}
              — Why treating untrusted components with strict validation boundaries creates safer systems.
            </li>
            <li>
              <strong>Clinical NLP Documentation Case Study:</strong>{' '}
              <Link to="/work/clinoria">
                CLINORIA — Clinical Intelligence &amp; Multilingual Fact Extraction
              </Link>{' '}
              — Safe engineering workflows and sanitization practices with zero PHI.
            </li>
            <li>
              <strong>Full Engineering Systems Portfolio:</strong>{' '}
              <Link to="/work">Explore All Applied AI &amp; Software Projects</Link>
            </li>
            <li>
              <strong>Technical Publication Index:</strong>{' '}
              <Link to="/blog">Browse All Engineering Notes &amp; Monographs</Link>
            </li>
            <li>
              <strong>Professional Background &amp; Engineering Philosophy:</strong>{' '}
              <Link to="/about">About Akther Naimudheen</Link>
            </li>
            <li>
              <strong>Security Inquiries &amp; Technical Collaboration:</strong>{' '}
              <Link to="/contact">Get in Touch</Link>
            </li>
          </ul>
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
            <strong>{profile.name}</strong> is an independent software developer and AI-focused engineer based in Kerala, India. His work spans practical AI systems, clinical NLP pipelines, infrastructure security, and responsible security research.
          </p>
          <div className="article-bio-links">
            <Link to="/" className="link-underline">Official Portfolio</Link>
            <Link to="/about" className="link-underline">About Akther</Link>
            <Link to="/contact" className="link-underline">Contact</Link>
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="link-underline">GitHub</a>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="link-underline">LinkedIn</a>
          </div>
        </div>
      </footer>
    </article>
  );
}
