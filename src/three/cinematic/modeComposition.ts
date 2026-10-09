import { Vector3 } from "three";
import type { SceneProps } from "../SceneHost";
import { projects } from "../../data/projects";

export type ModuleForm =
  | "tower"
  | "rail"
  | "compute"
  | "sensor"
  | "shield"
  | "console"
  | "collector"
  | "channel"
  | "receiver"
  | "database";
export interface Station {
  label: string;
  display: string;
  position: Vector3;
  primary: boolean;
  selected: boolean;
  form: ModuleForm;
  scale: number;
  project?: string;
  anchor?: boolean;
}
const abbreviations: Record<string, string> = {
  "Python Validation": "CHECK",
  "CloudWatch Metrics": "CW",
  "Firehose Metrics": "FLOW",
  "S3 Backup": "S3",
  "Dynatrace Verification": "VERIFY",
  "Incident Response": "INCIDENT",
  "Root Cause Analysis": "RCA",
  "Networking Troubleshooting": "NET",
  "Linux Troubleshooting": "LINUX",
  "Kubernetes — Learning / Hands-on": "K8S",
  "GitHub Actions": "GITHUB",
  "AWS CodePipeline": "PIPELINE",
  "AWS CodeDeploy": "DEPLOY",
  "Step Functions": "STATE",
  "Machine Learning": "ML",
  "scikit-learn": "SKLEARN",
  "Time-Series Forecasting": "FORECAST",
  CloudFormation: "CFN",
  "VPC / Load Balancing": "VPC",
  "Secrets Manager": "SECRETS",
  "ECS / Fargate": "ECS",
  "API Gateway": "API",
  Containers: "CONTAINERS",

  Client: "CLIENT",
  "VPC Link / Load Balancer": "LB",
  "ECS Services": "ECS",
  "Downstream Services / Database": "DB",
  "AWS Applications": "APPS",
  "CloudWatch Logs": "LOGS",
  "Amazon Data Firehose": "FLOW",
  Dynatrace: "DT",
  "CI Pipeline": "CI",
  "Container Image": "IMAGE",
  "ECS Blue/Green": "BLUE/GREEN",
  CodeDeploy: "DEPLOY",
  Validation: "CHECK",
  Application: "APP",
  Network: "NET",
  Database: "DB",
  "Applications / Infrastructure": "APPS",
  "Application / HTTP Signals": "HTTP",
  "CloudWatch / Agents": "LOGS",
  "Dynatrace / Datadog / Elasticsearch": "MONITOR",
  "Application / Network / Database Investigation": "LAYERS",
  "Cross-Team Root-Cause Analysis": "RCA",
  "Incident Investigation": "INSPECT",
  "Dashboards + Alerts": "ALERTS",
  "Logs + Metrics": "SIGNALS",
  "APIs & Microservices Supported": "SERVICES",
  "AWS Accounts": "ACCOUNTS",
  "AWS Regions": "REGIONS",
  "Production Incidents Supported": "OPERATIONS",
  Observability: "OBSERVE",
  Elasticsearch: "ELASTIC",
  CloudWatch: "CW",
};
const forms: ModuleForm[] = ["tower", "rail", "compute", "sensor", "shield"];
export function moduleForm(label: string, index: number): ModuleForm {
  if (/database|downstream/i.test(label)) return "database";
  if (/firehose/.test(label.toLowerCase())) return "channel";
  if (/dynatrace|receiver/i.test(label)) return "receiver";
  if (/cloudwatch|collector|metrics|logs/i.test(label)) return "collector";
  if (/observ|python|datadog/i.test(label)) return "sensor";
  if (/cloud|aws|terraform/i.test(label)) return "tower";
  if (/delivery|ci|deploy|github|build/i.test(label)) return "rail";
  if (/reliab|approval|validation/i.test(label)) return "shield";
  if (/services|ecs|container|linux/i.test(label)) return "compute";
  return forms[index % forms.length];
}
export function composeStations(props: SceneProps): Station[] {
  const { active, mobile, steps, selected, skillCategory } = props;
  if (active === "intro" || active === "standby") return [];
  if (active === "modules")
    return projects
      .filter((p) => p.featured)
      .map((p, i) => ({
        label: p.title,
        display: mobile
          ? "PROJECT"
          : (
              {
                "llm-job-agent": "LLM Job Agent",
                "portfolio-cicd": "Portfolio CI/CD",
                "phishing-url-detection": "Phishing Detection",
                "covid-analytics": "COVID Analytics",
              } as Record<string, string>
            )[p.slug],
        project: p.slug,
        primary: true,
        selected: p.slug === props.projectSlug,
        form: "console",
        scale: mobile ? 0.8 : 1.22,
        position: new Vector3(
          (i % 2 ? 1 : -1) * (mobile ? 1.55 : 2.05),
          i < 2 ? (mobile ? 0.6 : -0.35) : mobile ? -0.25 : -1.05,
          i < 2 ? 0.65 : mobile ? 1.3 : 2.25,
        ),
      }));
  const flow = [
    "case-studies",
    "observability",
    "delivery",
    "diagnostic",
  ].includes(active);
  const count = props.connectedCount ?? steps.length;
  const selectedIndex = Math.max(0, steps.indexOf(selected));
  let items = steps.map((label, index) => ({
    label,
    index,
    primary: index < count,
  }));
  if (mobile) {
    if (active === "delivery") {
      const start = Math.min(
        Math.max(0, selectedIndex - 1),
        Math.max(0, steps.length - 3),
      );
      items = items.slice(start, start + 3);
    } else if (flow)
      items = items
        .filter((i) => i.primary)
        .slice(0, active === "observability" ? 4 : 5);
    else if (active === "components" && skillCategory)
      items = items.slice(0, 3);
    else if (active === "components" || active === "infrastructure") {
      // Keep the selected attachment in the compact band, with only its neighbors.
      const start = Math.min(
        Math.max(0, selectedIndex - 1),
        Math.max(0, items.length - 3),
      );
      items = items.slice(start, start + 3);
    } else items = items.slice(0, 3);
  } else if (active === "components" && skillCategory)
    items = items.slice(0, 5);
  const primaries = items.filter((i) => i.primary),
    supports = items.filter((i) => !i.primary);
  const chosen = items.some((i) => i.label === selected)
    ? selected
    : items[0]?.label;
  const result: Station[] = items.map((item) => {
    const index = item.primary
      ? primaries.indexOf(item)
      : supports.indexOf(item);
    const total = item.primary ? primaries.length : supports.length;
    let x = 0,
      y = 0,
      z = 1,
      scale = mobile ? 0.75 : 0.9;
    if (active === "case-studies" && !mobile) {
      // A dedicated vertical projection beside the machine, never across its core.
      x = item.primary
        ? 1.85 + index * Math.min(0.27, 1.2 / Math.max(1, total - 1))
        : 1.65 + index * Math.min(0.4, 1.8 / Math.max(1, total - 1));
      y = item.primary
        ? 2.35 - index * Math.min(0.56, 2.7 / Math.max(1, total - 1))
        : -0.6;
      z = 1.6;
      scale = item.primary ? 0.46 : 0.29;
    } else if (flow) {
      x =
        (index - (total - 1) / 2) *
        Math.min(
          mobile ? 1.03 : 1.18,
          (mobile ? 3.5 : 5.1) / Math.max(1, total - 1),
        );
      y = item.primary
        ? active === "delivery"
          ? (mobile ? 0.55 : -0.68) + index * 0.055
          : active === "observability"
            ? mobile
              ? 1.55
              : 1.55
            : mobile
              ? 1.5
              : 1.35
        : -0.94;
      z = active === "delivery" ? 2.35 - index * 0.12 : mobile ? 0.9 : 1.6;
      scale = mobile
        ? active === "delivery"
          ? 0.57
          : 0.46
        : active === "delivery"
          ? 0.58
          : item.primary
            ? 0.76
            : 0.28;
      if (!item.primary) {
        x = -2.4 + index * 0.42;
        z = 0.4;
      }
    } else if (active === "components" && skillCategory) {
      x = (index - (total - 1) / 2) * (mobile ? 1.25 : 0.95);
      y = mobile ? 1.25 : -0.75;
      z = 2.0;
      scale = mobile ? 0.48 : 0.7;
    } else if (mobile) {
      const slots = [
        [-1.5, 0.25, 0.5],
        [1.5, 0.3, 0.5],
        [1.15, -0.3, 0.7],
      ];
      [x, y, z] = slots[index % slots.length];
      scale = 0.74;
    } else if (active === "components") {
      const side = index % 2 ? 1 : -1;
      x = side * (index < 4 ? 2.15 : 2.8);
      y = 1.05 - Math.floor(index / 2) * 0.7;
      z = index < 4 ? 0.1 : 1.0;
      scale = 0.63;
    } else {
      const positions =
        active === "infrastructure"
          ? [
              [-2.35, 0.65, 0.3],
              [1.9, -1, 2.3],
              [-1.9, -0.75, 1.55],
              [2.2, 1.15, 0.4],
              [2.55, -0.45, 1.15],
            ]
          : [
              [-2, 0.8, 0.3],
              [2, 0.45, 0.4],
              [-1.8, -0.8, 1.6],
              [2, -0.95, 1.5],
            ];
      [x, y, z] = positions[index % positions.length];
      scale = active === "infrastructure" ? 0.96 : 0.62;
    }
    return {
      label: item.label,
      display: abbreviations[item.label] ?? item.label.toUpperCase(),
      primary: item.primary,
      selected: item.label === chosen,
      form: moduleForm(item.label, item.index),
      scale,
      position: new Vector3(x, y, z),
    };
  });
  if (active === "components" && skillCategory)
    result.push({
      label: skillCategory,
      display: abbreviations[skillCategory] ?? skillCategory.toUpperCase(),
      form: moduleForm(skillCategory, 0),
      primary: true,
      selected: true,
      anchor: true,
      scale: mobile ? 0.83 : 1.03,
      position: new Vector3(mobile ? -1.75 : -1.85, mobile ? -0.05 : 0.65, 0.5),
    });
  return result;
}
export function machinePlacement(mode: string, mobile: boolean) {
  if (mode === "intro") return { position: new Vector3(), scale: 1 };
  if (mobile && ["case-studies", "observability", "diagnostic"].includes(mode))
    return { position: new Vector3(0, -0.65, -0.8), scale: 0.62 };
  if (mode === "case-studies" && !mobile)
    return { position: new Vector3(-0.95, -0.32, -0.7), scale: 0.76 };
  if (mode === "observability")
    return {
      position: new Vector3(0, -0.6, -0.9),
      scale: mobile ? 0.62 : 0.79,
    };
  if (mode === "modules")
    return {
      position: new Vector3(0, -0.15, -1.1),
      scale: mobile ? 0.64 : 0.82,
    };
  return {
    position: new Vector3(0, mode === "standby" ? -0.1 : -0.25, -0.45),
    scale: mobile ? 0.66 : mode === "infrastructure" ? 0.9 : 0.86,
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
