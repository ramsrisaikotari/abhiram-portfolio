import { Vector3 } from "three";
import type { SceneProps } from "../SceneHost";
import { projects } from "../../data/projects";

export interface Station {
  label: string;
  display?: string;
  position: Vector3;
  primary: boolean;
  selected: boolean;
  project?: string;
}
const titles: Record<string, string> = {
  "llm-job-agent": "LLM Job Agent",
  "portfolio-cicd": "Portfolio CI/CD",
  "phishing-url-detection": "Phishing Detection",
  "covid-analytics": "COVID Analytics",
};
export function composeStations(props: SceneProps): Station[] {
  const { active, mobile, steps, selected, skillCategory } = props;
  if (active === "intro" || active === "standby") return [];
  if (active === "modules")
    return projects
      .filter((p) => p.featured)
      .map((p, i) => ({
        label: p.title,
        display: titles[p.slug],
        project: p.slug,
        primary: true,
        selected: p.slug === props.projectSlug,
        position: new Vector3(
          (i % 2 ? 1 : -1) * (mobile ? 1.6 : 2.15),
          i < 2 ? (mobile ? 1.5 : 0.95) : mobile ? 0.15 : -0.45,
          p.slug === props.projectSlug ? 2 : 0.8,
        ),
      }));
  const isSkills = active === "components";
  const isFlow = [
    "case-studies",
    "observability",
    "delivery",
    "diagnostic",
  ].includes(active);
  const count = props.connectedCount ?? steps.length;
  let items = steps.map((label, index) => ({
    label,
    index,
    primary: index < count,
  }));
  if (mobile) {
    if (active === "delivery" || (isFlow && count > 5)) {
      const index = Math.max(0, steps.indexOf(selected));
      const start = Math.min(
        Math.max(index - 1, 0),
        Math.max(0, steps.length - 4),
      );
      items = items.slice(start, start + 4);
    } else if (isFlow)
      items = items
        .filter((item) => item.primary)
        .slice(0, active === "observability" ? 4 : 5);
    else if (isSkills && !skillCategory) items = items.slice(0, 4);
    else
      items = items.slice(0, isSkills || active === "infrastructure" ? 5 : 4);
  }
  if (!mobile && isSkills && skillCategory) items = items.slice(0, 6);
  const primary = items.filter((item) => item.primary);
  const support = items.filter((item) => !item.primary);
  return items.map((item) => {
    const index = item.primary ? primary.indexOf(item) : support.indexOf(item);
    const total = item.primary ? primary.length : support.length;
    let x = 0,
      y = 0,
      z = 2;
    if (isFlow) {
      // Sequential elevation follows one rail; never a box grid or circular map.
      x =
        (index - (total - 1) / 2) *
        Math.min(
          mobile ? 1.1 : 1.08,
          (mobile ? 3.6 : 5.2) / Math.max(1, total - 1),
        );
      if (!item.primary)
        x =
          (index - (total - 1) / 2) *
          Math.min(2.4, 5.2 / Math.max(1, total - 1));
      y = item.primary
        ? active === "delivery"
          ? mobile
            ? 0.75 + index * 0.05
            : -0.45 + index * 0.08
          : 1.38
        : -0.65;
      z = item.primary ? 2.4 - index * 0.035 : 1.5;
    } else {
      const columnCount = mobile || (isSkills && skillCategory) ? 3 : 4;
      const row = Math.floor(index / columnCount);
      const columns = Math.min(total - row * columnCount, columnCount);
      x =
        ((index % columnCount) - (columns - 1) / 2) *
        (mobile ? 1.7 : isSkills && skillCategory ? 1.95 : 1.55);
      y = row === 0 ? 1.35 : mobile ? 0.25 : -0.35;
      z = row === 0 ? 1.7 : 2.2;
    }
    return {
      label: item.label,
      display:
        count > 5
          ? (
              {
                CodeDeploy: "Deploy",
                "ECS Blue/Green": "Blue/Green",
                Validation: "Validate",
                "Applications / Infrastructure": "Apps",
                "Logs + Metrics": "Signals",
                "Dashboards + Alerts": "Alerts",
                "Incident Investigation": "Inspect",
              } as Record<string, string>
            )[item.label]
          : undefined,
      primary: item.primary,
      selected: item.label === selected,
      position: new Vector3(x, y, z),
    };
  });
}
export function machinePlacement(mode: string, mobile: boolean) {
  if (mode === "intro") return { position: new Vector3(), scale: 1 };
  const overview = [
    "modules",
    "case-studies",
    "observability",
    "components",
  ].includes(mode);
  return {
    position: new Vector3(0, overview ? -0.65 : -0.25, overview ? -1.1 : -0.4),
    scale: mobile ? 0.62 : overview ? 0.76 : 0.88,
  };
}
export const modeReadout: Record<string, string> = {
  impact: "TELEMETRY / ANALYSIS",
  infrastructure: "INFRASTRUCTURE ONLINE",
  modules: "PROJECT STATIONS",
  "case-studies": "OPERATIONS COMMAND",
  observability: "LOG PROCESSING",
  delivery: "DEPLOYMENT LINE",
  diagnostic: "DIAGNOSTIC PROCESSOR",
  components: "MODULAR SYSTEM",
  standby: "SYSTEM STANDBY",
};
