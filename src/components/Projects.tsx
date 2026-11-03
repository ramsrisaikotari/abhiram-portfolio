import { projects, siteLinks } from "../data/siteContent";

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-kicker"><span>03</span> / Projects</p>
          <h2 id="projects-title">Projects outside production work</h2>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <p className="project-label">{project.label}</p>
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <p className="project-stack">
                <span>Stack</span>
                {project.stack}
              </p>
              {project.links.length > 0 && (
                <ul className="project-links" aria-label={`${project.title} links`}>
                  {project.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label} <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <a className="more-projects" href={siteLinks.github} target="_blank" rel="noreferrer">
          More projects on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
