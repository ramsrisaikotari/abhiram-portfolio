import { useState } from "react";
import { projects } from "../data/projects";
import type { ProjectFilter } from "../data/projects";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
const filters: (ProjectFilter | "All" | "Academic")[] = [
  "All",
  "AI & ML",
  "Cloud & DevOps",
  "Software Engineering",
  "Data",
  "Academic",
];
export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  // Filter the full personal/academic collection so every category has useful results.
  const archive = projects.filter(
    (p) =>
      p.kind !== "professional-case-study" &&
      (filter === "All"
        ? !p.featured
        : filter === "Academic"
          ? p.kind === "academic"
          : p.filters.includes(filter)),
  );
  return (
    <>
      <section id="projects" className="section" aria-label="Featured projects">
        <SectionHeading number="03">Featured Projects</SectionHeading>
        <p className="section-intro">
          A few projects that show how I approach building, automating, and
          solving technical problems.
        </p>
        <div className="projects-grid">
          {projects
            .filter((p) => p.featured)
            .map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
        </div>
      </section>
      <section
        id="case-studies"
        className="section"
        aria-label="Engineering case studies"
      >
        <SectionHeading number="04">Engineering Case Studies</SectionHeading>
        <p className="section-intro">
          Examples of the cloud, monitoring, deployment, and production support
          work I’ve handled in enterprise environments.
        </p>
        <p className="confidential-note">
          Professional work is summarized at a high level to avoid exposing
          internal systems or proprietary details.
        </p>
        <div className="projects-grid case-grid">
          {projects
            .filter(
              (p) =>
                p.kind === "professional-case-study" &&
                p.slug !== "test-reporting",
            )
            .map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
        </div>
        <section
          className="additional-work"
          aria-labelledby="additional-work-title"
        >
          <h3 id="additional-work-title">Additional Engineering Work</h3>
          {projects
            .filter((p) => p.slug === "test-reporting")
            .map((p) => (
              <ProjectCard key={p.slug} project={p} compact />
            ))}
        </section>
      </section>
      <section id="archive" className="section" aria-label="Project archive">
        <SectionHeading number="05">Project Archive</SectionHeading>
        <p className="section-intro">
          More projects from my coursework and earlier hands-on work in software
          engineering, data, and machine learning.
        </p>
        <div
          className="project-filters"
          role="group"
          aria-label="Filter project archive"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="filter-status" role="status">
          {archive.length} {archive.length === 1 ? "project" : "projects"} ·{" "}
          {filter === "All" ? "More projects" : filter}
        </p>
        <div className="archive-grid">
          {archive.map((p) => (
            <ProjectCard key={p.slug} project={p} compact />
          ))}
        </div>
      </section>
    </>
  );
}
