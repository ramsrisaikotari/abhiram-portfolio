import type { Project } from "../data/projects";
import ArchitectureFlow from "./ArchitectureFlow";
const labels = {
  personal: "Personal project",
  academic: "Academic project",
  "professional-case-study": "Professional case study",
};
export default function ProjectCard({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  const technologies = [
    ...project.technologies,
    ...(project.additionalTechnologies ?? []),
  ];
  return (
    <article
      className={`project ${project.featured && !compact ? "project-featured" : ""} ${compact ? "project-compact" : ""} ${project.confidential ? "project-professional" : ""}`}
      aria-labelledby={`${project.slug}-title`}
    >
      <div className="project-meta">
        <span className="type-badge">{labels[project.kind]}</span>
        <span>{project.category}</span>
      </div>
      <h3 id={`${project.slug}-title`}>{project.title}</h3>
      <p className="project-description">{project.summary}</p>
      {project.technologies.length > 0 && (
        <ul className="tags" aria-label={`${project.title} technologies`}>
          {project.technologies.slice(0, compact ? 5 : 7).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      {!compact && (
        <ul className="project-highlights">
          {project.highlights.slice(0, 3).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
      {(!compact || project.confidential) && project.detail && (
        <details className="project-details">
          <summary>
            Details / Architecture
            <span className="sr-only"> for {project.title}</span>
          </summary>
          <div className="detail-content">
            {project.confidential && (
              <p className="confidential-note">
                This is a high-level summary of professional work. Internal
                implementation details are intentionally left out.
              </p>
            )}
            <h4>Overview</h4>
            <p>{project.summary}</p>
            <h4>Goal</h4>
            <p>{project.detail.goal}</p>
            <h4>Architecture</h4>
            {project.architecture.map((flow) => (
              <ArchitectureFlow key={flow.label} flow={flow} />
            ))}
            <h4>What I Worked On</h4>
            <ul className="project-highlights">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <h4>Technologies</h4>
            <ul className="tags">
              {technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <h4>{project.confidential ? "Engineering Focus" : "My Focus"}</h4>
            <p>{project.detail.focus}</p>
            <h4>Outcome</h4>
            <p>{project.detail.outcome}</p>
          </div>
        </details>
      )}
      {(project.github || project.live) && !project.confidential && (
        <div className="project-links">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub (new tab)`}
            >
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site (new tab)`}
            >
              Live ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}
