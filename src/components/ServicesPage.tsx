import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertCircle, ArrowUpRight, Code2, Search, MapPin, ShieldCheck, Layers, FileCheck } from 'lucide-react';
import { services, type ServicePillar } from '@/data/services';
import { profile } from '@/data/profile';
import { Reveal } from '@/components/ScrollMotion';

function ServiceIcon({ id }: { id: string }) {
  switch (id) {
    case 'business-website-development':
      return <Code2 className="service-pillar__icon" aria-hidden="true" />;
    case 'technical-seo':
      return <Search className="service-pillar__icon" aria-hidden="true" />;
    case 'local-seo':
      return <MapPin className="service-pillar__icon" aria-hidden="true" />;
    default:
      return <Layers className="service-pillar__icon" aria-hidden="true" />;
  }
}

export function ServicesPage() {
  return (
    <div className="services-page">
      {/* Services Hero */}
      <header className="services-hero">
        <div className="services-hero__inner">
          <Reveal>
            <p className="eyebrow">Client Engineering & Search Foundations</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1>
              <span>Engineering-Led Web Systems</span>
              <span>& Search Architecture.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lede">
              Practical, dependable web development, technical SEO, and local search visibility for
              independent businesses, practices, and technical teams. Clear scopes, sound
              architecture, and no agency fluff.
            </p>
          </Reveal>

          {/* Core Operating Principles Strip */}
          <Reveal delay={0.18}>
            <div className="services-principles-strip">
              <div className="services-principle-item">
                <span className="services-principle-item__label">
                  <ShieldCheck aria-hidden="true" /> Architecture First
                </span>
                <p>Modern component frameworks and clean code instead of bloated, fragile site-builders.</p>
              </div>
              <div className="services-principle-item">
                <span className="services-principle-item__label">
                  <FileCheck aria-hidden="true" /> Verified Deliverables
                </span>
                <p>Explicit scopes, technical documentation, and full source code handover with zero vendor lock-in.</p>
              </div>
              <div className="services-principle-item">
                <span className="services-principle-item__label">
                  <AlertCircle aria-hidden="true" /> Honest Expectations
                </span>
                <p>Objective diagnostics and verified implementations—no invented metrics or ranking guarantees.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Services List */}
      <section className="services-list-section" aria-label="Available Services">
        <div className="services-list-container">
          {services.map((service: ServicePillar, idx: number) => (
            <article key={service.id} id={service.id} className="service-card">
              <div className="service-card__header">
                <div className="service-card__badge-row">
                  <span className="service-card__num">{service.number}</span>
                  <div className="service-card__tag">
                    <ServiceIcon id={service.id} />
                    <span>{service.subtitle}</span>
                  </div>
                </div>
                <h2>{service.title}</h2>
                <p className="service-card__summary">{service.summary}</p>
              </div>

              <div className="service-card__grid">
                {/* Column 1: Client & Problem Space */}
                <div className="service-card__col">
                  <div className="service-block">
                    <h3 className="service-block__heading">Target Client</h3>
                    <p className="service-block__text">{service.targetClient}</p>
                  </div>

                  <div className="service-block">
                    <h3 className="service-block__heading">Problems Addressed</h3>
                    <ul className="service-problem-list">
                      {service.problemsAddressed.map((problem, pIdx) => (
                        <li key={pIdx}>
                          <span className="service-list-bullet" aria-hidden="true">×</span>
                          <span>{problem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-block">
                    <h3 className="service-block__heading">Execution Process</h3>
                    <ol className="service-process-list">
                      {service.process.map((step) => (
                        <li key={step.step}>
                          <div className="service-process-step__header">
                            <span className="service-process-step__num">{step.step}</span>
                            <strong>{step.title}</strong>
                          </div>
                          <p>{step.description}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Column 2: Deliverables & Next Steps */}
                <div className="service-card__col">
                  <div className="service-block">
                    <h3 className="service-block__heading">Tangible Deliverables</h3>
                    <ul className="service-deliverable-list">
                      {service.deliverables.map((item, dIdx) => (
                        <li key={dIdx}>
                          <CheckCircle2 className="service-check-icon" aria-hidden="true" />
                          <div>
                            <strong>{item.title}</strong>
                            <p>{item.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Boundaries & Exclusions */}
                  <div className="service-scope-box">
                    <div className="service-scope-box__header">
                      <AlertCircle className="service-scope-icon" aria-hidden="true" />
                      <h4>Scope Boundaries & Exclusions</h4>
                    </div>
                    <ul>
                      {service.exclusions.map((item, eIdx) => (
                        <li key={eIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Realistic Next Step CTA */}
                  <div className="service-action-box">
                    <h4>Realistic Next Step</h4>
                    <p>{service.nextStep.description}</p>
                    <div className="service-action-box__actions">
                      <Link
                        to={`/contact?subject=${encodeURIComponent(service.nextStep.contactSubject)}`}
                        className="btn"
                      >
                        {service.nextStep.ctaText} <ArrowRight aria-hidden="true" />
                      </Link>
                      <a
                        href={`mailto:${profile.email}?subject=${encodeURIComponent(service.nextStep.contactSubject)}`}
                        className="link-underline"
                      >
                        Email Directly <ArrowUpRight aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Engagement Workflow / Statement */}
      <section className="ink-panel ink-panel--statement" aria-label="Engineering Standards">
        <div className="ink-panel__inner">
          <div>
            <p className="eyebrow">Engineering Standards</p>
            <h2>Dependable software starts with clear interfaces, sound architecture, and rigorous validation.</h2>
            <p>
              I treat client projects with the same rigorous engineering discipline as complex software products:
              semantic code, fast runtime performance, documented configurations, and zero black-box promises.
            </p>
          </div>
        </div>
      </section>

      {/* Global Bottom CTA */}
      <section className="section cta-band" aria-labelledby="services-cta-heading">
        <Reveal>
          <div className="reveal">
            <p className="eyebrow">Start a Conversation</p>
            <h2 id="services-cta-heading">Have a project or technical challenge?</h2>
            <p className="lede" style={{ maxWidth: '44ch', margin: '0 auto 2rem' }}>
              Whether you need a new web application, an audit of crawl and indexing issues, or
              accurate local search configuration, let's discuss requirements.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/contact" className="btn btn--signal">
                Contact Me <ArrowRight aria-hidden="true" />
              </Link>
              <a href={`mailto:${profile.email}`} className="btn">
                {profile.email} <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
