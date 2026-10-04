import { Cloud, Activity, Logs, Workflow, Github } from 'lucide-react';
import { projects } from '../data/projects';
import SectionHeading from './SectionHeading';
const icons = [Cloud, Activity, Logs, Workflow];
export default function Projects() {
  return <section id="projects" className="section reveal" aria-label="Projects"><SectionHeading number="04">Some Things I've Built</SectionHeading>
    <div className="projects-grid">{projects.map((project, index) => { const Icon = icons[index]; return <article className="project" key={project.title}>
      <div className="project-top"><Icon size={25} aria-hidden="true" /><span className="project-number">0{index + 1}</span>{project.github && <a className="project-github icon-button" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`}><Github size={21} /></a>}</div>
      <p className="eyebrow">{project.category}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><ul className="project-technologies" aria-label="Technologies">{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
    </article>; })}</div></section>;
}
