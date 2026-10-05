export interface ExperienceItem {
  company: string;
  role: string;
  period?: string;
  bullets: string[];
  technologies: string[];
}
export const experience: ExperienceItem[] = [
  {
    company: "Cyber Nirvana",
    role: "DevOps & Site Reliability Engineer",
    bullets: [
      "Supported migration and production operations for 150+ APIs and microservices across four AWS accounts and two regions.",
      "Operated CI/CD and production delivery across Dev, Test, Stage and Production, including release troubleshooting and post-deployment validation.",
      "Supported ECS/Fargate, Lambda and API Gateway workloads, investigating application, networking and database connectivity issues.",
      "Built and supported monitoring, centralized logging and Python automation for operational validation.",
      "Supported 30+ production incidents and collaborated with application, database, network and platform teams on root-cause analysis.",
    ],
    technologies: [
      "AWS",
      "ECS / Fargate",
      "Lambda",
      "API Gateway",
      "Jenkins",
      "Python",
      "CloudWatch",
      "Dynatrace",
    ],
  },
];
