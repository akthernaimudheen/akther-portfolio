import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectVisualScene } from '@/components/ui/project-visual-scene';
import { projects, type Project } from '@/data/projects';

function ProjectDivision({ project, index }: { project: Project; index: number }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.article
      className="project-division"
      initial={reducedMotion ? false : { opacity: 0, y: 90, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -8% 0px' }}
      transition={{ duration: reducedMotion ? 0 : 0.82, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="project-topline">
        <span>{project.index}</span>
        <span className="project-status">{project.status}</span>
      </div>

      <div className="project-artifact-wrap">
        <ProjectVisualScene
          src={project.visual}
          alt={project.visualAlt}
          kind={project.kind}
          index={project.index}
        />
      </div>

      <div className="project-copy">
        <p className="project-eyebrow">{project.eyebrow}</p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="project-tags" aria-label="Project areas">
          {project.areas.map((area) => <span key={area}>{area}</span>)}
        </div>

        <Link className="project-toggle" to={`/work/${project.id}`}>Enter project world <ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </motion.article>
  );
}

export function ProjectGallery() {
  return (
    <div className="project-grid">
      {projects.map((project, index) => <ProjectDivision key={project.id} project={project} index={index} />)}
    </div>
  );
}
