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
      "Supported the migration and day-to-day production operation of 150+ APIs and microservices across four AWS accounts and two regions.",
      "Worked on releases from Dev through Production, including failed deployment troubleshooting and post-release checks.",
      "Troubleshot ECS/Fargate, Lambda, and API Gateway workloads, including application, network, and database connectivity issues.",
      "Built and supported monitoring, centralized logging, and Python automation used for operational checks.",
      "Supported 30+ production incidents and worked with application, database, network, and platform teams on root-cause analysis.",
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
