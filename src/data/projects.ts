export interface Project { title: string; category: string; description: string; technologies: string[]; github?: string }
// Optional: add `github: 'https://github.com/your-user/your-repo'` to any public project.
export const projects: Project[] = [
  { title: 'AWS API Migration Platform', category: 'Cloud infrastructure', description: 'Supported migration of more than 150 enterprise APIs and microservices to AWS using ECS, Lambda, API Gateway, Step Functions and supporting AWS services.', technologies: ['AWS', 'ECS', 'Lambda', 'API Gateway', 'CloudFormation', 'Jenkins'] },
  { title: 'Cloud Observability Platform', category: 'Monitoring & reliability', description: 'Implemented and supported application and infrastructure monitoring using Dynatrace, Datadog, CloudWatch, dashboards, metrics, logs and alerting.', technologies: ['Dynatrace', 'Datadog', 'CloudWatch', 'AWS'] },
  { title: 'CloudWatch Log Pipeline Migration', category: 'Logging & automation', description: 'Worked on migrating AWS CloudWatch log delivery architecture using Amazon Data Firehose and automated validation across multiple AWS accounts and regions.', technologies: ['AWS', 'CloudWatch', 'Firehose', 'Python', 'Dynatrace'] },
  { title: 'Automated CI/CD Platform', category: 'Developer infrastructure', description: 'Built and maintained deployment pipelines supporting automated application releases across Dev, Test, Stage and Production environments.', technologies: ['Jenkins', 'GitHub', 'AWS', 'Docker', 'Python'] },
];
