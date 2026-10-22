import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Tag } from 'lucide-react';
import { Reveal } from '@/components/ScrollMotion';
import {
  articles,
  articleCategories,
  type ArticleCategory,
} from '@/data/articles';

export function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'all'>('all');

  const filteredArticles =
    activeCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="blog-index">
      {/* Editorial Publication Header */}
      <section className="blog-hero" aria-labelledby="blog-title">
        <div className="blog-hero__copy">
          <p className="eyebrow">Technical Publication · Engineering Essays</p>
          <h1 id="blog-title">
            <span>Systems, architecture,</span>
            <span>and applied AI</span>
            <span>in practice.</span>
          </h1>
          <p className="lede">
            In-depth case studies, engineering notes, and practical architectural breakdowns across applied AI, backend systems, media processing, and software reliability.
          </p>
        </div>
      </section>

      {/* Category Filter Controls */}
      <section className="section blog-filter-section" aria-label="Article categories">
        <div className="blog-filters" role="tablist" aria-label="Filter articles by category">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'all'}
            className={`blog-filter-btn ${activeCategory === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Articles ({articles.length})
          </button>
          {articleCategories.map((category) => {
            const count = articles.filter((a) => a.category === category).length;
            if (count === 0) return null;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                className={`blog-filter-btn ${activeCategory === category ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>

        {/* Article Cards Grid */}
        <div className="blog-grid" role="feed" aria-label="Technical articles">
          {filteredArticles.map((article, index) => (
            <Reveal key={article.slug} className="blog-card" delay={index * 0.05}>
              <article aria-labelledby={`article-heading-${article.slug}`}>
                <div className="blog-card__header">
                  <div className="blog-card__badges">
                    <span className="blog-card__category">{article.category}</span>
                    <span
                      className={`blog-card__status ${
                        article.status === 'published-case-study'
                          ? 'blog-card__status--case-study'
                          : 'blog-card__status--note'
                      }`}
                    >
                      {article.statusLabel}
                    </span>
                  </div>
                  <div className="blog-card__meta">
                    <span>{article.readTime}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.publishedAt}>{article.publishedAt}</time>
                  </div>
                </div>

                <h2 className="blog-card__title" id={`article-heading-${article.slug}`}>
                  <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>

                <p className="blog-card__desc">{article.description}</p>

                <div className="blog-card__tags" aria-label="Article tags">
                  <Tag className="blog-card__tag-icon" aria-hidden="true" />
                  {article.tags.map((tag) => (
                    <span key={tag} className="blog-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="blog-card__footer">
                  <Link className="link-underline" to={`/blog/${article.slug}`}>
                    Read technical {article.status === 'published-case-study' ? 'case study' : 'note'} <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="blog-empty">
            <BookOpen aria-hidden="true" />
            <p>No articles currently published under this category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
