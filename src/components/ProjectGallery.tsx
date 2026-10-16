import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectVisualScene } from '@/components/ui/project-visual-scene';
import { projects, type Project, type ProjectCategory } from '@/data/projects';

function statusBadgeClass(kind: string, status: string) {
  if (kind === 'ai') return 'badge-status--ai';
  if (status.toLowerCase().includes('live')) return 'badge-status--live';
  if (status.toLowerCase().includes('progress')) return 'badge-status--progress';
  return 'badge-status--archived';
}

function ProjectRow({ project, position }: { project: Project; position: number }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.article
      className={`index-row index-row--${position % 2 === 0 ? 'lead' : 'offset'}`}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/work/${project.id}`}>
        <ProjectVisualScene src={project.visual} alt={project.visualAlt} interactive />
        <div className="index-row__body">
          <div>
            <div style={{ marginBottom: '0.65rem' }}>
              <span className={`badge-status ${statusBadgeClass(project.kind, project.status)}`}>
                {project.status}
              </span>
            </div>
            <h3>{project.title}</h3>
          </div>
          <p className="index-row__summary">{project.summary}</p>
          <dl className="index-row__facts">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>{project.areas.slice(0, 3).join(', ')}</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>{project.eyebrow.split('·')[0].trim()}</dd>
            </div>
          </dl>
          <span className="link-underline">
            View technical case study <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export function ProjectGallery() {
  const categories: { key: ProjectCategory; title: string; count: string }[] = [
    { key: 'ai', title: 'AI Applications & Pipeline Engineering', count: '02 Projects' },
    { key: 'fullstack', title: 'Full-Stack Architecture & Systems', count: '02 Systems' },
    { key: 'delivery', title: 'Client Web Delivery & Hospitality', count: '02 Projects' },
  ];

  return (
    <div className="project-index">
      {categories.map((cat) => {
        const catProjects = projects.filter((p) => p.category === cat.key);
        if (catProjects.length === 0) return null;

        return (
          <section key={cat.key} className="work-group" aria-label={cat.title}>
            <div className="work-group__head">
              <h2>{cat.title}</h2>
              <span className="work-group__count">{cat.count}</span>
            </div>
            <div style={{ display: 'grid', gap: 'clamp(2.5rem, 5vw, 4rem)' }}>
              {catProjects.map((project, index) => (
                <ProjectRow key={project.id} project={project} position={index} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
