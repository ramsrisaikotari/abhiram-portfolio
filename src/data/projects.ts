export type ProjectKind = "personal" | "academic" | "professional-case-study";
export type ProjectFilter =
  "AI & ML" | "Cloud & DevOps" | "Software Engineering" | "Data";
export interface ArchitectureFlow {
  label: string;
  steps: string[];
  connected?: boolean;
}
export interface Project {
  slug: string;
  title: string;
  kind: ProjectKind;
  category: string;
  featured: boolean;
  summary: string;
  technologies: string[];
  additionalTechnologies?: string[];
  highlights: string[];
  architecture: ArchitectureFlow[];
  filters: ProjectFilter[];
  github?: string;
  live?: string;
  confidential?: boolean;
  detail?: { goal: string; focus: string; outcome: string };
}
// Sources and deliberately omitted claims are documented in docs/content-verification.md.
export const projects: Project[] = [
  {
    slug: "llm-job-agent",
    title: "LLM Job Application Agent",
    kind: "personal",
    category: "AI / Generative AI",
    featured: true,
    summary:
      "Built an LLM-powered job application assistant that generates personalized application content from a resume summary, target role, job description, preferred tone, language and selected model.",
    technologies: [
      "Python",
      "FastAPI",
      "Pydantic",
      "Uvicorn",
      "OpenRouter",
      "REST APIs",
      "Render",
    ],
    highlights: [
      "Designed a REST API with structured candidate and job inputs.",
      "Validated requests with Pydantic API contracts.",
      "Supported configurable model, language and tone selection.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "User Input",
          "FastAPI",
          "Request Validation",
          "Prompt Construction",
          "LLM Provider",
          "Generated Content",
        ],
      },
    ],
    detail: {
      goal: "Generate role-specific application content through a structured API.",
      focus:
        "Personal project \u00b7 API design, validation and LLM integration.",
      outcome:
        "A working API implementation connecting validated inputs to an external language model.",
    },
    filters: ["AI & ML"],
    github: "https://github.com/ramsrisaikotari/llm-job-agent",
  },
  {
    slug: "portfolio-cicd",
    title: "Portfolio CI/CD Platform",
    kind: "personal",
    category: "DevOps / Platform Engineering",
    featured: true,
    summary:
      "Designed and deployed a production portfolio platform with protected GitHub workflows, automated CI/CD, pull-request previews, keyless cloud authentication, custom DNS, HTTPS and availability monitoring.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "GitHub Actions",
      "OIDC / WIF",
      "Firebase Hosting",
      "Cloud Monitoring",
    ],
    highlights: [
      "Implemented pull-request validation and Firebase preview environments.",
      "Used OIDC and Workload Identity Federation instead of long-lived cloud keys.",
      "Automated production delivery with custom DNS, HTTPS and uptime monitoring.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "Feature Branch",
          "Pull Request",
          "CI / Lint / Build",
          "Firebase Preview",
          "Review",
          "Merge to Main",
          "GitHub Actions",
          "GitHub OIDC",
          "GCP Workload Identity Federation",
          "Firebase Hosting",
          "abhiramkotari.com",
          "Cloud Monitoring",
        ],
      },
    ],
    detail: {
      goal: "Make changes reviewable before production and authenticate delivery with short-lived credentials.",
      focus:
        "Personal project \u00b7 frontend, CI/CD and cloud delivery architecture.",
      outcome:
        "A production portfolio with a repeatable preview and release workflow.",
    },
    filters: ["Cloud & DevOps"],
    github: "https://github.com/ramsrisaikotari/abhiram-portfolio",
    live: "https://abhiramkotari.com",
    additionalTechnologies: ["GitHub", "Google Cloud", "Cloudflare DNS"],
  },
  {
    slug: "phishing-url-detection",
    title: "Machine Learning Phishing URL Detection",
    kind: "academic",
    category: "Machine Learning / Security",
    featured: true,
    summary:
      "Developed a machine-learning-based phishing URL detection system using URL and domain characteristics, model experimentation and application/API integration.",
    technologies: [
      "Python",
      "Random Forest",
      "SVM",
      "CNN",
      "LSTM",
      "Jenkins",
      "AWS",
    ],
    highlights: [
      "Evaluated classical machine-learning and deep-learning approaches.",
      "Performed URL/domain feature engineering and model evaluation.",
      "Integrated prediction functionality with an application/API layer.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "URL",
          "Feature Extraction",
          "URL / Domain Features",
          "ML Model",
          "Prediction",
          "API",
          "Web UI",
        ],
      },
    ],
    detail: {
      goal: "Explore how URL and domain features can identify potentially malicious websites.",
      focus:
        "Academic project \u00b7 feature engineering, model evaluation and integration.",
      outcome:
        "Compared model approaches for phishing detection; no unverified accuracy claims are published.",
    },
    filters: ["AI & ML"],
  },
  {
    slug: "covid-analytics",
    title: "COVID-19 Analytics & Forecasting Platform",
    kind: "academic",
    category: "Data Engineering / Machine Learning",
    featured: true,
    summary:
      "Built a data-processing and analytics platform for ingesting, transforming, visualizing and forecasting COVID-19 trends with automated pipelines and time-series analysis.",
    technologies: [
      "Python",
      "Apache Airflow",
      "AWS Lambda",
      "React",
      "D3.js",
      "Prophet",
      "ARIMA",
    ],
    highlights: [
      "Developed Python data-ingestion and processing workflows.",
      "Applied ARIMA and Prophet for time-series forecasting.",
      "Built interactive visualizations using React and D3.js.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "External Data",
          "Python ETL",
          "Airflow / Lambda",
          "Processed Data",
          "ARIMA / Prophet",
          "React + D3 Dashboard",
        ],
      },
    ],
    detail: {
      goal: "Connect data processing, trend forecasting and interactive exploration.",
      focus:
        "Academic project \u00b7 data pipelines, forecasting and visualization.",
      outcome:
        "Combined data-engineering and time-series techniques in an analytics project.",
    },
    filters: ["AI & ML", "Data"],
    github: "https://github.com/ramsrisaikotari/covid-rate-tracker",
  },
  {
    slug: "enterprise-api-migration",
    title: "Enterprise AWS API Migration",
    kind: "professional-case-study",
    category: "Cloud Infrastructure",
    featured: false,
    summary:
      "Supported migration and production operation of 150+ APIs and microservices across multi-account, multi-region AWS environments.",
    technologies: [
      "AWS",
      "ECS Fargate",
      "Lambda",
      "API Gateway",
      "Step Functions",
      "CloudFormation",
      "Jenkins",
    ],
    highlights: [
      "Supported 150+ APIs and microservices across four AWS accounts and two regions.",
      "Worked across containerized services, serverless workloads, networking and secrets.",
      "Participated in deployments and post-deployment validation.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "Client",
          "API Gateway",
          "VPC Link / Load Balancer",
          "ECS Services",
          "Downstream Services / Database",
        ],
      },
      {
        label: "Related workloads",
        steps: ["Lambda", "Step Functions"],
        connected: false,
      },
    ],
    detail: {
      goal: "Support migration and reliable operation across AWS environments.",
      focus:
        "Cloud infrastructure \u00b7 deployment support and operational validation.",
      outcome:
        "Supported migration and ongoing production operations across distributed workloads.",
    },
    filters: ["Cloud & DevOps"],
    confidential: true,
    additionalTechnologies: [
      "CodeDeploy",
      "ECR",
      "SSM",
      "Secrets Manager",
      "CloudWatch",
    ],
  },
  {
    slug: "observability-migration",
    title: "Multi-Account AWS Observability Migration",
    kind: "professional-case-study",
    category: "Observability / Automation",
    featured: false,
    summary:
      "Supported migration of AWS log delivery across accounts and regions using CloudWatch, Amazon Data Firehose, Python automation and Dynatrace.",
    technologies: [
      "AWS",
      "CloudWatch",
      "Amazon Data Firehose",
      "Python",
      "Dynatrace",
      "S3",
    ],
    highlights: [
      "Automated checks for log activity, delivery health and data freshness.",
      "Validated success/failure signals, throttling and backup delivery.",
      "Verified downstream Dynatrace ingestion.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "AWS Applications",
          "CloudWatch Logs",
          "Amazon Data Firehose",
          "Dynatrace",
        ],
      },
      {
        label: "Validation targets",
        steps: [
          "Python Validation",
          "CloudWatch Metrics",
          "Firehose Metrics",
          "S3 Backup",
          "Dynatrace Verification",
        ],
        connected: false,
      },
    ],
    detail: {
      goal: "Validate log delivery and downstream ingestion during an observability migration.",
      focus:
        "Observability automation \u00b7 delivery and ingestion validation.",
      outcome:
        "Used automated validation to support investigation of log-pipeline health.",
    },
    filters: ["Cloud & DevOps"],
    confidential: true,
  },
  {
    slug: "cloud-observability",
    title: "Cloud Observability & Reliability",
    kind: "professional-case-study",
    category: "Monitoring / SRE",
    featured: false,
    summary:
      "Implemented and supported cloud observability using metrics, logs, dashboards, alerting and production monitoring across multiple platforms.",
    technologies: [
      "Dynatrace",
      "Datadog",
      "AWS CloudWatch",
      "Elasticsearch",
      "Kibana",
    ],
    highlights: [
      "Supported application and infrastructure monitoring.",
      "Onboarded logs and metrics and worked with dashboards and alerts.",
      "Used observability signals in production troubleshooting and service-health investigations.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "Applications / Infrastructure",
          "Logs + Metrics",
          "CloudWatch / Agents",
          "Dynatrace / Datadog / Elasticsearch",
          "Dashboards + Alerts",
          "Incident Investigation",
        ],
      },
    ],
    detail: {
      goal: "Make service health and operational signals available for troubleshooting.",
      focus:
        "Monitoring and SRE \u00b7 log onboarding, dashboards and investigations.",
      outcome:
        "Supported production investigations with application and infrastructure signals.",
    },
    filters: ["Cloud & DevOps"],
    confidential: true,
  },
  {
    slug: "release-engineering",
    title: "Automated CI/CD & Release Engineering",
    kind: "professional-case-study",
    category: "CI/CD / Developer Infrastructure",
    featured: false,
    summary:
      "Built and operated CI/CD workflows for application promotion through production, including container builds, approvals, blue-green releases, rollback handling and validation.",
    technologies: [
      "Jenkins",
      "GitHub",
      "AWS CodePipeline",
      "AWS CodeDeploy",
      "ECR",
      "ECS",
      "Docker",
    ],
    highlights: [
      "Supported near-daily releases through Dev, Test, Stage and Production.",
      "Troubleshot build failures, task-definition mismatches and failed deployments.",
      "Supported approval gates, blue-green releases, rollback handling and validation.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "GitHub",
          "CI Pipeline",
          "Build",
          "Container Image",
          "ECR",
          "Approval",
          "CodeDeploy",
          "ECS Blue/Green",
          "Validation",
        ],
      },
    ],
    detail: {
      goal: "Support repeatable application promotion and production release operations.",
      focus:
        "Release engineering \u00b7 pipeline operation and deployment troubleshooting.",
      outcome:
        "Supported application delivery and post-release validation across environments.",
    },
    filters: ["Cloud & DevOps"],
    confidential: true,
    additionalTechnologies: ["Python"],
  },
  {
    slug: "incident-response",
    title: "Production Reliability & Incident Response",
    kind: "professional-case-study",
    category: "Site Reliability Engineering",
    featured: false,
    summary:
      "Supported production reliability for distributed AWS applications, troubleshooting application, container, database, networking and infrastructure failures.",
    technologies: [
      "AWS ECS",
      "Lambda",
      "API Gateway",
      "CloudWatch",
      "Dynatrace",
      "Linux",
      "HTTP",
    ],
    highlights: [
      "Supported 30+ production incidents and cross-team root-cause analysis.",
      "Investigated service communication, database connectivity and timeouts.",
      "Troubleshot request paths, VPC routing, security groups, load balancing and HTTP 4xx/5xx failures.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "Application / HTTP Signals",
          "Logs + Metrics",
          "Application / Network / Database Investigation",
          "Cross-Team Root-Cause Analysis",
        ],
      },
    ],
    detail: {
      goal: "Investigate distributed failures across application and infrastructure boundaries.",
      focus:
        "Production reliability \u00b7 incident response and troubleshooting.",
      outcome:
        "Supported incident investigations with application, database, network and platform teams.",
    },
    filters: ["Cloud & DevOps"],
    confidential: true,
    additionalTechnologies: [
      "Load Balancing",
      "VPC Networking",
      "Security Groups",
      "Database Connectivity",
    ],
  },
  {
    slug: "test-reporting",
    title: "Automated Test Reporting & CI Integration",
    kind: "professional-case-study",
    category: "CI/CD / Test Automation",
    featured: false,
    summary:
      "Enhanced CI workflows for automated browser testing and post-build reporting, providing build context, test artifacts and execution results to engineering teams.",
    technologies: [
      "Jenkins",
      "Playwright",
      "GitHub",
      "JUnit XML",
      "HTML Reports",
    ],
    highlights: [
      "Integrated Playwright execution with Jenkins workflows.",
      "Added reporting for success, failure and unstable build states.",
      "Packaged test artifacts with environment, branch and build context for investigation.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "GitHub",
          "Jenkins",
          "Playwright",
          "Test Results",
          "Artifact Packaging",
          "Email / Build Report",
        ],
      },
    ],
    detail: {
      goal: "Make automated test execution and post-build results easier to investigate.",
      focus:
        "CI integration \u00b7 browser-test execution and artifact reporting.",
      outcome:
        "Provided engineering teams with build context and packaged execution artifacts.",
    },
    filters: ["Cloud & DevOps"],
    confidential: true,
  },
  {
    slug: "car-rental",
    title: "Car Rental Management System",
    kind: "academic",
    category: "Software Engineering",
    featured: false,
    summary:
      "Designed a database-backed car rental application supporting vehicle search, reservations, booking management, authentication and administrative workflows.",
    technologies: [],
    highlights: [
      "Vehicle search and reservations.",
      "Authentication, administrative workflows and persistent data storage.",
    ],
    architecture: [],
    detail: {
      goal: "",
      focus: "",
      outcome: "",
    },
    filters: ["Software Engineering"],
  },
  {
    slug: "kanban",
    title: "Kanban Task Management Platform",
    kind: "academic",
    category: "Software Engineering / Testing",
    featured: false,
    summary:
      "Developed a Kanban task-management application with authenticated APIs, authorization, persistent storage and automated functional testing.",
    technologies: [
      "Spring Boot",
      "REST APIs",
      "JWT",
      "RBAC",
      "MySQL",
      "Swagger",
      "Postman",
      "Selenium",
      "Docker",
    ],
    highlights: [
      "Task/workflow APIs with JWT authentication and role-based access control.",
      "API documentation, functional testing and containerization.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "Client",
          "REST API",
          "Spring Boot",
          "Authentication / RBAC",
          "Business Logic",
          "MySQL",
        ],
      },
    ],
    detail: {
      goal: "",
      focus: "",
      outcome: "",
    },
    filters: ["Software Engineering"],
  },
  {
    slug: "diabetes-prediction",
    title: "Diabetes Risk Prediction",
    kind: "academic",
    category: "Machine Learning",
    featured: false,
    summary:
      "Built and evaluated diabetes risk prediction models using structured healthcare data, preprocessing, feature selection and hyperparameter tuning.",
    technologies: [
      "Python",
      "Pandas",
      "scikit-learn",
      "Random Forest",
      "Logistic Regression",
      "KNN",
      "SVM",
      "Decision Trees",
      "GridSearchCV",
    ],
    highlights: [
      "Data cleaning, imputation, scaling and feature selection.",
      "Model tuning and evaluation using precision, recall, ROC-AUC and confusion matrices.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "Dataset",
          "Cleaning",
          "Imputation",
          "Scaling",
          "Feature Selection",
          "Model Training",
          "Hyperparameter Tuning",
          "Evaluation",
        ],
      },
    ],
    detail: {
      goal: "",
      focus: "",
      outcome: "",
    },
    filters: ["AI & ML", "Data"],
  },
  {
    slug: "customer-segmentation",
    title: "Customer Segmentation Analysis",
    kind: "academic",
    category: "Machine Learning / Data Analytics",
    featured: false,
    summary:
      "Applied unsupervised learning to segment customers by behavioral and demographic characteristics and identify meaningful groups.",
    technologies: [
      "Python",
      "Pandas",
      "scikit-learn",
      "K-Means",
      "Hierarchical Clustering",
      "PCA",
    ],
    highlights: [
      "Preprocessing, normalization and dimensionality reduction.",
      "Clustering to identify customer segments.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "Customer Data",
          "Preprocessing",
          "Normalization",
          "PCA",
          "Clustering",
          "Customer Segments",
        ],
      },
    ],
    detail: {
      goal: "",
      focus: "",
      outcome: "",
    },
    filters: ["AI & ML", "Data"],
  },
  {
    slug: "nlp-chatbot",
    title: "NLP Chatbot",
    kind: "academic",
    category: "AI / NLP",
    featured: false,
    summary:
      "Developed an NLP chatbot for intent identification and entity extraction, with messaging-platform integrations.",
    technologies: [
      "Python",
      "NLP",
      "Intent Classification",
      "Entity Recognition",
      "Slack API",
      "Telegram API",
    ],
    highlights: [
      "Intent classification and entity recognition.",
      "Messaging integrations and response logic.",
    ],
    architecture: [
      {
        label: "System flow",
        steps: [
          "Slack / Telegram",
          "Messaging Integration",
          "Chatbot",
          "Intent Classification",
          "Entity Recognition",
          "Response Logic",
        ],
      },
    ],
    detail: {
      goal: "",
      focus: "",
      outcome: "",
    },
    filters: ["AI & ML"],
  },
  {
    slug: "loan-calculator",
    title: "Loan Calculator",
    kind: "academic",
    category: "Software Engineering",
    featured: false,
    summary:
      "Developed a desktop loan calculator with structured financial calculations, input validation and an interactive interface.",
    technologies: ["Java", "Swing"],
    highlights: ["Financial calculations and input validation."],
    architecture: [],
    detail: {
      goal: "",
      focus: "",
      outcome: "",
    },
    filters: ["Software Engineering"],
  },
  {
    slug: "inventory-management",
    title: "Inventory Management System",
    kind: "academic",
    category: "Software Engineering / Database",
    featured: false,
    summary:
      "Developed an inventory application supporting record creation, updates, search, deletion, validation and persistent data storage.",
    technologies: [],
    highlights: [
      "Inventory CRUD and search.",
      "Validation, error handling and persistent storage.",
    ],
    architecture: [],
    detail: {
      goal: "",
      focus: "",
      outcome: "",
    },
    filters: ["Software Engineering", "Data"],
  },
];
