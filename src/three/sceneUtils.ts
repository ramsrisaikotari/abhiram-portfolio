export const steel = {
  body: "#394B57",
  panel: "#53646D",
  dark: "#1C2934",
  cyan: "#59A6C4",
  blue: "#548DAE",
  gold: "#AD915B",
};
export function ease(time: number, start: number, duration: number) {
  const t = Math.max(0, Math.min(1, (time - start) / duration));
  return t * t * (3 - 2 * t);
}
export function shortLabel(label: string) {
  const labels: Record<string, string> = {
    "VPC Link / Load Balancer": "VPC Link / LB",
    "ECS Services": "ECS",
    "Downstream Services / Database": "Services / DB",
    "AWS Applications": "AWS Apps",
    "CloudWatch Logs": "CloudWatch",
    "Amazon Data Firehose": "Firehose",
    "Python Validation": "Python checks",
    "CloudWatch Metrics": "CW metrics",
    "Firehose Metrics": "Firehose metrics",
    "Dynatrace Verification": "Verification",
    "Container Image": "Image",
    "CI Pipeline": "CI",
    "Application / HTTP Signals": "Application / HTTP",
    "Applications / Infrastructure": "Applications",
    "CloudWatch / Agents": "CloudWatch",
    "Dynatrace / Datadog / Elasticsearch": "Monitoring",
    "Application / Network / Database Investigation": "Layer checks",
    "Cross-Team Root-Cause Analysis": "Root cause",
    "Incident Investigation": "Investigate",
    "Linux Troubleshooting": "Linux",
    "APIs & Microservices Supported": "Services",
    "AWS Accounts": "Accounts",
    "AWS Regions": "Regions",
    "Production Incidents Supported": "Operations",
    "Kubernetes — Learning / Hands-on": "Kubernetes",
    "Time-Series Forecasting": "Forecasting",
    "AI / MLOPS": "AI / MLOps",
  };
  return labels[label] ?? label;
}

export function mobileLabel(label: string) {
  const labels: Record<string, string> = {
    OBSERVABILITY: "Observe",
    Observability: "Observability",
    "CloudWatch Logs": "CW Logs",
    CloudWatch: "Cloud Watch",
    Elasticsearch: "Elastic search",
    "Dynatrace Verification": "Verify",
    CodeDeploy: "Code Deploy",
    Application: "App",
    "Downstream Services / Database": "Services / DB",
    Reliability: "SRE",
  };
  return labels[label] ?? shortLabel(label);
}
