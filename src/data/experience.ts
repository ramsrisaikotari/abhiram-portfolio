export interface ExperienceItem { company: string; role: string; period?: string; bullets: string[] }
export const experience: ExperienceItem[] = [{
  company: 'Cyber Nirvana', role: 'DevOps & Site Reliability Engineer',
  // TODO: Add verified employment dates as `period` if desired.
  bullets: [
    'Supported migration and production operations for 150+ APIs and microservices across enterprise AWS environments.',
    'Supported AWS environments across Dev, Test, Stage, and Production.',
    'Managed production deployments and CI/CD pipelines.',
    'Troubleshot ECS, Lambda, API Gateway, networking, database connectivity, HTTP errors, and distributed application issues.',
    'Worked with AWS ECS, Lambda, API Gateway, CloudWatch, S3, Step Functions, Secrets Manager, SSM, VPC, NLB, and WAF.',
    'Built and supported observability using Dynatrace, Datadog, CloudWatch, and centralized logging.',
    'Participated in production incident response and root-cause analysis.',
  ],
}];
