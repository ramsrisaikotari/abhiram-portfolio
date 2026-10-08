// Presentation labels only; technologies always come from shared skills data.
export function skillLabel(category: string): string {
  const labels: Record<string, string> = {
    "Cloud & AWS": "AWS",
    "Infrastructure as Code": "Terraform",
    "CI/CD": "CI/CD",
    Containers: "Containers",
    Observability: "Observability",
    "Languages / Automation": "Python",
    Reliability: "Linux",
    "AI / ML": "MLOps",
  };
  return labels[category] ?? category;
}
