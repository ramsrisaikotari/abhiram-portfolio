export const siteLinks = {
  resume: "/resume.pdf",
  github: "https://github.com/ramsrisaikotari",
  linkedin: "https://www.linkedin.com/in/abhi-ram-kotari-bb4bb9323/",
  email: "mailto:ramsrisaikotari@gmail.com",
  portfolioRepository: "https://github.com/ramsrisaikotari/abhiram-portfolio",
  liveSite: "https://abhiramkotari.com",
} as const;

export const navigation = [
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  eyebrow: "DevOps & Site Reliability Engineer",
  name: "Abhi Ram Kotari",
  headline:
    "I keep cloud applications reliable, from deployment to production monitoring.",
  intro:
    "I'm a DevOps and Site Reliability Engineer working mainly on AWS. I own ten applications end to end, from development through production, and I spent much of 2026 moving enterprise APIs from MuleSoft to AWS. Most days that means deployments, monitoring and alerting, disaster-recovery configuration, and tracking down production issues across the stack.",
  relocation: "Open to relocation anywhere in the US.",
  impact: [
    { value: "10", label: "Applications I own end to end" },
    { value: "150+", label: "APIs and microservices supported in production" },
    { value: "~85", label: "APIs covered by monitoring and alerts I set up" },
    { value: "2", label: "AWS regions, including disaster recovery" },
  ],
} as const;

export const experience = {
  company: "Cyber Nirvana LLC",
  role: "DevOps & Site Reliability Engineer",
  dates: "Aug 2024 – Present",
  summary:
    "I work on enterprise APIs and applications running on AWS, across four accounts (Dev, Test, Stage and Production) and two regions.",
  responsibilities: [
    "Own 10 applications from development through production as the team's DevOps engineer and SRE, running on ECS/Fargate, Lambda, Step Functions and a scheduler, with on-call support.",
    "Ran and troubleshot release pipelines in AWS CodePipeline, CodeBuild, CodeDeploy and Jenkins, and raised 140+ change requests.",
    "Investigated 30+ production incidents, from ECS task failures and database connection timeouts to HTTP errors and network issues, working with application, database, network and platform teams on recovery and root-cause analysis.",
    "My main 2026 work was the MuleSoft-to-AWS migration, disaster-recovery configuration and alerting, described in Selected work below.",
  ],
  tools:
    "AWS, ECS/Fargate, Lambda, AWS CDK, Jenkins, Python, Dynatrace, Kibana, CloudWatch",
} as const;

export const selectedWork = {
  note:
    "Professional work is described at a high level to protect internal systems and client details.",
  items: [
    {
      title: "Moving enterprise APIs from MuleSoft to AWS",
      context:
        "A large set of enterprise applications and APIs had to move from MuleSoft to AWS, in both Stage and Production.",
      actions: [
        "Carried out Stage and Production migration deployments and ran the infrastructure and application pipelines.",
        "Updated application configuration and infrastructure repositories, with pull requests for each environment's changes.",
        "Checked ECS tasks and deployment logs after each rollout, and watched application logs in Kibana while validating.",
        "Set up Kibana Watcher alerts for the migrated Stage and Production workloads.",
        "Helped with production cutovers and rollbacks alongside developers, testers, middleware and cloud engineering teams.",
      ],
      outcome:
        "The migrated workloads run in Stage and Production with Watcher alerts in place, and environment changes go through pull requests.",
      stack:
        "AWS, ECS/Fargate, CodePipeline, CodeBuild, CodeDeploy, GitHub, Kibana",
    },
    {
      title: "Multi-region and disaster-recovery configuration",
      context:
        "The applications run in two AWS regions, including a disaster-recovery region. That side has to stay correctly configured as the applications change.",
      actions: [
        "Updated disaster-recovery SQS configuration through AWS CDK.",
        "Changed production application properties and environment-specific configuration files.",
        "Configured IAM permissions and application access.",
        "Wrote and executed rollback pull requests when a change had to be reversed.",
        "Verified updated configuration in S3, restarted ECS tasks to pick it up, and checked logs and service health after each release.",
      ],
      outcome:
        "Configuration changes reach both regions through pull requests, and services are validated after every release.",
      stack: "AWS CDK, SQS, IAM, S3, ECS/Fargate, GitHub",
    },
    {
      title: "Alert design and automated log-pipeline checks",
      context:
        "Logs from hundreds of CloudWatch log groups across several accounts flow into Dynatrace. Alerts need clear rules, and the log pipeline itself needs checking.",
      actions: [
        "Designed alert matrices in Dynatrace that set thresholds, severity levels, error conditions, who gets notified and how to respond.",
        "Added Dynatrace metric keys through GitHub configuration changes, and tested alerts by reproducing the errors they watch for.",
        "Wrote Dynatrace OpenPipeline processing rules (DQL) for application service logs.",
        "Built a Python validator for the log pipeline (CloudWatch Logs to Amazon Data Firehose to Dynatrace, with S3 backup). It checks delivery, throttling, backup health, data freshness and ingestion across accounts and regions.",
      ],
      outcome:
        "Observability across 400+ CloudWatch log groups, and monitoring and alert coverage for about 85 APIs. The validator replaced a repetitive manual check.",
      stack:
        "Dynatrace, DQL, Python, CloudWatch, Amazon Data Firehose, S3, Kibana",
    },
  ],
} as const;

export const projects = [
  {
    title: "KubeReliability (in progress)",
    label: "Personal lab project",
    description:
      "A lab for testing how Kubernetes workloads behave when things fail. It uses Python tooling against the Kubernetes API, Prometheus and Grafana for monitoring, and failure scenarios to test against.",
    stack: "Python, Kubernetes, Prometheus, Grafana",
    links: [],
  },
  {
    title: "Portfolio CI/CD Platform",
    label: "Personal project",
    description:
      "This website is also one of my DevOps projects. Every change goes through a pull request, CI checks and a Firebase preview environment, then deploys to production automatically after merge. GitHub Actions signs in to Google Cloud with OIDC and Workload Identity Federation, so no long-lived service-account key is stored, and uptime monitoring watches the live site.",
    stack:
      "React, TypeScript, Vite, GitHub Actions, OIDC/WIF, Firebase Hosting, Cloud Monitoring",
    links: [
      { label: "GitHub", href: siteLinks.portfolioRepository },
      { label: "Live", href: siteLinks.liveSite },
    ],
  },
  {
    title: "Phishing URL Detection",
    label: "Academic project",
    description:
      "Compared classical machine learning (Random Forest, SVM) with deep learning (CNN, LSTM) for spotting phishing URLs from URL and domain features, then connected the model to an application layer to test predictions.",
    stack: "Python, Random Forest, SVM, CNN, LSTM, Jenkins, AWS",
    links: [],
  },
] as const;

export const skills = [
  {
    category: "Cloud (AWS)",
    details:
      "ECS/Fargate, Lambda, API Gateway, Step Functions, SQS, S3, IAM, Secrets Manager, ECR, EC2, VPC and load balancing",
  },
  {
    category: "Infrastructure as code and CI/CD",
    details:
      "AWS CDK, Terraform, CloudFormation, CodePipeline, CodeBuild, CodeDeploy, Jenkins, GitHub Actions, Docker, Maven",
  },
  {
    category: "Observability",
    details:
      "Dynatrace (alerting, DQL, OpenPipeline), CloudWatch (Logs Insights, Container Insights), Kibana and Elasticsearch",
  },
  { category: "Languages", details: "Python, Bash, TypeScript, YAML/JSON" },
  {
    category: "Reliability",
    details:
      "Incident investigation, root-cause analysis, disaster-recovery configuration, alert design, release validation, Linux troubleshooting",
  },
  {
    category: "Learning in my lab",
    details: "Kubernetes, Prometheus, Grafana",
  },
] as const;

export const contact = {
  heading: "Let's talk",
  text:
    "I'm interested in DevOps, SRE, cloud and platform engineering roles. If you'd like to talk about a role or anything on this page, email is the quickest way to reach me.",
} as const;
