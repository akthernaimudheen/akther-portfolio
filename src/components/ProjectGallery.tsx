import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectVisualScene } from '@/components/ui/project-visual-scene';
import { projects, type Project } from '@/data/projects';

/**
 * One row of the editorial project index: a large photograph first, then the
 * title with its role, scope and status. Rows alternate their offset so the
 * index reads as a staggered spread rather than a stack of identical cards.
 */
function ProjectRow({ project, position }: { project: Project; position: number }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.article
      className={`index-row index-row--${position % 2 === 0 ? 'lead' : 'offset'}`}
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/work/${project.id}`}>
        <ProjectVisualScene src={project.visual} alt={project.visualAlt} interactive />
        <div className="index-row__body">
          <h2>{project.title}</h2>
          <p className="index-row__summary">{project.summary}</p>
          <dl className="index-row__facts">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>{project.areas.join(', ')}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{project.status}</dd>
            </div>
          </dl>
          <span className="link-underline">
            View project <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export function ProjectGallery() {
  return (
    <div className="project-index">
      {projects.map((project, index) => (
        <ProjectRow key={project.id} project={project} position={index} />
      ))}
    </div>
  );
}
