import { skillLabel } from "./skillLabels";
import { profile } from "../data/profile";
import { projects, type Project } from "../data/projects";
import { skills } from "../data/skills";
import EngineeringImpact from "../components/EngineeringImpact";
import Experience from "../components/Experience";
import ProjectCard from "../components/ProjectCard";
import Contact from "../components/Contact";
import SystemFlow from "./SystemFlow";
const heroNodes = [
  "AWS",
  "CI/CD",
  "OBSERVABILITY",
  "AUTOMATION",
  "SRE",
  "AI / MLOPS",
];
interface StoryProps {
  skillCategory: string | null;
  onSkillSelect: (value: string) => void;
  boot: boolean;
  reduced: boolean;
  selected: string;
  projectSlug: string;
  setSelected: (node: string) => void;
  setProjectSlug: (slug: string) => void;
  caseStudies: Project[];
  observability: Project;
  release: Project;
}
export default function EngineeringStory({
  skillCategory,
  onSkillSelect,
  boot,
  reduced,
  selected,
  projectSlug,
  setSelected,
  setProjectSlug,
  caseStudies,
  observability,
  release,
}: StoryProps) {
  return (
    <main className="system-content">
      <section id="intro" data-system-section>
        <p className="system-kicker">
          {boot && !reduced ? "SYSTEM INITIALIZING" : "SYSTEM ONLINE"} / 01
        </p>
        <h1 id="system-title" tabIndex={-1}>
          Engineering
          <br />
          <span>in motion.</span>
        </h1>
        <p className="system-role">DEVOPS & SITE RELIABILITY ENGINEERING</p>
        <p>{profile.description}</p>
        <a className="system-enter" href="#impact">
          Enter System ↓
        </a>
        <SystemFlow
          steps={heroNodes}
          label="Connected engineering systems"
          selected={selected}
          onSelect={setSelected}
        />
        <p className="system-hint">
          Scroll to explore. Focus or select a node to trace its connections.
        </p>
        {selected === "AWS" && <p>ECS · Lambda · API Gateway · CloudWatch</p>}
      </section>
      <section id="impact" data-system-section>
        <p className="system-kicker">02 / SYSTEM TELEMETRY</p>
        <EngineeringImpact />
      </section>
      <section id="infrastructure" data-system-section>
        <p className="system-kicker">03 / MECHANICAL INFRASTRUCTURE</p>
        <Experience />
        <SystemFlow
          steps={[
            "Cloud",
            "Delivery",
            "Services",
            "Observability",
            "Reliability",
          ]}
          label="Infrastructure modules"
          selected={selected}
          onSelect={setSelected}
        />
      </section>
      <section id="modules" data-system-section>
        <p className="system-kicker">04 / PROJECT MODULES</p>
        <h2>Featured projects</h2>
        {projects
          .filter((project) => project.featured)
          .map((project) => (
            <div
              key={project.slug}
              className="system-project"
              onFocus={() => setProjectSlug(project.slug)}
              onPointerEnter={() => setProjectSlug(project.slug)}
            >
              <button
                className="system-activate"
                aria-pressed={projectSlug === project.slug}
                onClick={() => {
                  setProjectSlug(project.slug);
                  setSelected(
                    project.architecture[0]?.steps[0] ?? project.title,
                  );
                }}
              >
                Activate module ↗
              </button>
              <ProjectCard project={project} />
            </div>
          ))}
      </section>
      <section id="case-studies" data-system-section>
        <p className="system-kicker">05 / COMMAND CENTER</p>
        <h2>Engineering case studies</h2>
        <div className="system-flow">
          {caseStudies.map((project) => (
            <button
              key={project.slug}
              aria-pressed={projectSlug === project.slug}
              onClick={() => {
                setProjectSlug(project.slug);
                setSelected(project.architecture[0]?.steps[0] ?? "");
              }}
            >
              {project.title}
            </button>
          ))}
        </div>
        <ProjectCard
          project={
            caseStudies.find((project) => project.slug === projectSlug) ??
            caseStudies[0]
          }
        />
        {(
          caseStudies.find((project) => project.slug === projectSlug) ??
          caseStudies[0]
        ).architecture.map((architecture) => (
          <SystemFlow
            key={architecture.label}
            label={architecture.label}
            steps={architecture.steps}
            selected={selected}
            onSelect={setSelected}
          />
        ))}
      </section>
      <section id="observability" data-system-section>
        <p className="system-kicker">06 / DATA FLOW</p>
        <h2>Observability</h2>
        <p>{observability.summary}</p>
        {observability.architecture.map((architecture) => (
          <SystemFlow
            key={architecture.label}
            label={architecture.label}
            steps={architecture.steps}
            selected={selected}
            onSelect={setSelected}
          />
        ))}
      </section>
      <section id="delivery" data-system-section>
        <p className="system-kicker">07 / RELEASE SYSTEM</p>
        <h2>CI/CD pipeline</h2>
        <p>{release.summary}</p>
        <SystemFlow
          label="Release pipeline"
          steps={release.architecture[0].steps}
          selected={selected}
          onSelect={setSelected}
        />
      </section>
      <section id="diagnostic" data-system-section>
        <p className="system-kicker">08 / DIAGNOSTIC MODE</p>
        <h2>Follow the signal.</h2>
        <p>
          {
            projects.find((project) => project.slug === "incident-response")
              ?.summary
          }
        </p>
        <p className="system-hint">
          Illustrative diagnostic only — not an employer incident.
        </p>
        <SystemFlow
          label="Diagnostic layers"
          steps={["Application", "API", "ECS", "Network", "Database"]}
          selected={selected}
          onSelect={setSelected}
        />
        <dl className="system-status">
          <dt>API / ECS</dt>
          <dd>Healthy</dd>
          <dt>Database</dt>
          <dd className="warning">Degraded</dd>
          <dt>Latency</dt>
          <dd className="warning">Elevated</dd>
          <dt>Signals</dt>
          <dd>Logs · Metrics · HTTP</dd>
        </dl>
      </section>
      <section id="components" data-system-section>
        <p className="system-kicker">09 / SYSTEM COMPONENTS</p>
        <h2>Skills & connections</h2>
        <SystemFlow
          label="Skill categories"
          steps={skills.map((skill) => skillLabel(skill.category))}
          selected={skillCategory ?? ""}
          onSelect={onSkillSelect}
        />
        <div className="system-skills">
          {skills.map((skill) => (
            <details
              key={skill.category}
              open={skillCategory === skillLabel(skill.category)}
            >
              <summary
                onClick={() => onSkillSelect(skillLabel(skill.category))}
              >
                {skill.category}
              </summary>
              <ul className="tags">
                {skill.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
      <section id="standby" data-system-section>
        <p className="system-kicker">10 / SYSTEM STANDBY</p>
        <Contact />
        <a href="/" data-experience-route className="system-enter">
          Back to Portfolio ↗
        </a>
      </section>
    </main>
  );
}
