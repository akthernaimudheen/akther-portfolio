import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, AlertTriangle, Info, Terminal, Tag } from 'lucide-react';
import { profile } from '@/data/profile';
import type { Article, ArticleCallout } from '@/data/articles';

interface StructuredArticlePageProps {
  article: Article;
}

function CalloutBox({ callout }: { callout: ArticleCallout }) {
  const icon =
    callout.type === 'warning' ? (
      <AlertTriangle className="callout-icon callout-icon--warning" aria-hidden="true" />
    ) : callout.type === 'tip' ? (
      <CheckCircle2 className="callout-icon callout-icon--tip" aria-hidden="true" />
    ) : (
      <Info className="callout-icon callout-icon--note" aria-hidden="true" />
    );

  return (
    <aside className={`article-callout article-callout--${callout.type}`} role="note">
      <div className="article-callout__icon">{icon}</div>
      <div className="article-callout__content">
        {callout.title && <strong className="article-callout__title">{callout.title}</strong>}
        <p>{callout.text}</p>
      </div>
    </aside>
  );
}

export function StructuredArticlePage({ article }: StructuredArticlePageProps) {
  return (
    <article className="article-container" aria-labelledby="article-title">
      {/* Top Breadcrumb & Navigation */}
      <nav className="article-nav" aria-label="Breadcrumb">
        <Link to="/blog" className="back-link">
          <ArrowLeft aria-hidden="true" /> Technical Essays
        </Link>
        <span className="article-nav__separator" aria-hidden="true">/</span>
        <span className="article-nav__current">{article.category}</span>
      </nav>

      {/* Header */}
      <header className="article-header">
        <p className="eyebrow">{article.eyebrow}</p>
        <h1 id="article-title">{article.title}</h1>
        <p className="article-lede">{article.description}</p>

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
              <span>{profile.positioning}</span>
            </div>
          </div>
          <div className="article-meta-details">
            <span>
              <strong>Published:</strong> <time dateTime={article.publishedAt}>{article.publishedAt}</time>
            </span>
            <span>
              <strong>Read time:</strong> {article.readTime}
            </span>
            <span className="article-meta-status-pill">
              {article.statusLabel}
            </span>
          </div>
        </div>
      </header>

      {/* Structured Sections */}
      <div className="article-content">
        {article.sections?.map((section, idx) => (
          <section key={section.heading} className="article-section" aria-labelledby={`sec-head-${idx}`}>
            <h2 id={`sec-head-${idx}`}>{section.heading}</h2>

            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx}>{p}</p>
            ))}

            {section.callout && <CalloutBox callout={section.callout} />}

            {section.codeBlock && (
              <div className="article-code-wrapper">
                {section.codeBlock.caption && (
                  <div className="article-code-caption">
                    <Terminal className="code-caption-icon" aria-hidden="true" />
                    <span>{section.codeBlock.caption}</span>
                    <span className="code-lang-tag">{section.codeBlock.language}</span>
                  </div>
                )}
                <pre className="article-code-block">
                  <code>{section.codeBlock.code}</code>
                </pre>
              </div>
            )}

            {section.listItems && section.listItems.length > 0 && (
              <ul className="article-list">
                {section.listItems.map((item, lIdx) => (
                  <li key={lIdx}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/* Article Footer & Tags */}
      <footer className="article-footer">
        <div className="article-tags-block">
          <Tag className="tag-icon" aria-hidden="true" />
          <span className="tags-label">Tags:</span>
          <div className="tags-list">
            {article.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                #{tag}
              </span>
            ))}
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
              Software Developer &amp; AI Application Engineer based in Kerala, India. Working across full-stack applications, API integrations, deterministic evaluation, and intelligent systems.
            </p>
            <div className="author-box-links">
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight aria-hidden="true" />
              </a>
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn <ArrowUpRight aria-hidden="true" />
              </a>
              <Link to="/contact">
                Contact <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="article-bottom-nav">
          <Link to="/blog" className="btn">
            <ArrowLeft aria-hidden="true" /> Back to all articles
          </Link>
          <Link to="/work" className="link-underline">
            Explore engineering projects <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </article>
  );
}
