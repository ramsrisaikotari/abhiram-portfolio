import { skillLabel } from "./skillLabels";
import { useEffect, useState } from "react";
import { profile } from "../data/profile";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { impact } from "../data/impact";
import SceneHost from "./SceneHost";
import EngineeringStory from "./EngineeringStory";
import { useMedia, useSceneController } from "./useSceneController";
import "./experience.css";
const sections = [
  "intro",
  "impact",
  "infrastructure",
  "modules",
  "case-studies",
  "observability",
  "delivery",
  "diagnostic",
  "components",
  "standby",
];
const heroNodes = [
  "AWS",
  "CI/CD",
  "OBSERVABILITY",
  "AUTOMATION",
  "SRE",
  "AI / MLOPS",
];
export default function Experience3D() {
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const mobile = useMedia("(max-width: 768px)");
  const { active, visible } = useSceneController(mobile);
  const [selected, setSelected] = useState("AWS");
  const [projectSlug, setProjectSlug] = useState("enterprise-api-migration");
  const [boot, setBoot] = useState(!reduced);
  useEffect(() => {
    const timeout = window.setTimeout(() => setBoot(false), 1400);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    document.getElementById("system-title")?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape")
        document.getElementById("system-exit")?.click();
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);
  const caseStudies = projects
    .filter((project) => project.kind === "professional-case-study")
    .slice(0, 5);
  const current =
    (active === "case-studies" ? caseStudies : projects).find(
      (project) => project.slug === projectSlug,
    ) ?? caseStudies[0];
  const observability =
    projects.find(
      (project) =>
        project.title === "Multi-Account AWS Observability Migration",
    ) ?? caseStudies.find((project) => project.slug.includes("observability"))!;
  const release = projects.find(
    (project) => project.slug === "release-engineering",
  )!;
  const flow =
    active === "impact"
      ? impact.map(([value, label]) => `${value} ${label}`)
      : active === "infrastructure"
        ? ["Cloud", "Delivery", "Services", "Observability", "Reliability"]
        : active === "observability"
          ? observability.architecture.flatMap((flow) => flow.steps)
          : active === "delivery"
            ? release.architecture[0]?.steps
            : active === "diagnostic"
              ? ["Application", "API", "ECS", "Network", "Database"]
              : active === "case-studies" || active === "modules"
                ? current.architecture.flatMap((flow) => flow.steps)
                : active === "components"
                  ? (skills.find(
                      (skill) => skillLabel(skill.category) === selected,
                    )?.technologies ?? skills[0].technologies)
                  : heroNodes;
  const phase = ["infrastructure", "delivery"].includes(active)
    ? "mechanical"
    : ["intro", "impact", "observability"].includes(active)
      ? "digital"
      : "command";
  return (
    <div className={`experience-3d phase-${phase}`}>
      <a className="skip-link" href="#system-title">
        Skip to engineering story
      </a>
      <header className="system-header">
        <a id="system-exit" href="/" data-experience-route>
          ← Back to Portfolio
        </a>
        <span>ABHI // SYSTEMS</span>
        <a href={profile.resume} target="_blank" rel="noopener noreferrer">
          View Resume ↗
        </a>
      </header>
      <div className="scene-stage">
        <SceneHost
          projectSlug={projectSlug}
          onProjectSelect={setProjectSlug}
          active={active}
          phase={phase}
          selected={selected}
          steps={flow ?? heroNodes}
          reduced={reduced}
          mobile={mobile}
          visible={visible}
          connectedCount={
            active === "observability"
              ? observability.architecture[0].steps.length
              : active === "case-studies" || active === "modules"
                ? current.architecture[0]?.steps.length
                : undefined
          }
          onSelect={setSelected}
        />
      </div>
      <div className="scene-caption" aria-hidden="true">
        <span>LIVE SYSTEM / {phase.toUpperCase()}</span>
        <span>
          {String(sections.indexOf(active) + 1).padStart(2, "0")} / 10
        </span>
      </div>
      <nav className="system-nav" aria-label="Engineering story">
        {sections.map((section, index) => (
          <a
            href={`#${section}`}
            key={section}
            aria-current={active === section ? "location" : undefined}
            aria-label={section.replaceAll("-", " ")}
          >
            {String(index + 1).padStart(2, "0")}
          </a>
        ))}
      </nav>
      <EngineeringStory
        boot={boot}
        reduced={reduced}
        selected={selected}
        projectSlug={projectSlug}
        setSelected={setSelected}
        setProjectSlug={setProjectSlug}
        caseStudies={caseStudies}
        observability={observability}
        release={release}
      />
    </div>
  );
}
