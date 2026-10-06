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
      "A FastAPI application that takes a résumé summary and job description and uses an LLM to generate tailored application content. I added options for role, tone, language, and model selection.",
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
      "Built a FastAPI endpoint around structured résumé and job inputs.",
      "Used Pydantic to validate requests before sending them to the model.",
      "Added options for model, tone, and language so the output can be adjusted for different applications.",
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
      goal: "Create a simple API that turns résumé and job information into tailored application content.",
      focus:
        "I focused on API design, request validation, prompt construction, and the LLM integration.",
      outcome:
        "The project gave me a practical way to connect a typed API to an external LLM and control how requests are handled.",
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
      "This website is also one of my DevOps projects. Changes go through pull requests, CI checks, Firebase preview environments, and an automated production deployment using GitHub Actions and keyless GCP authentication.",
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
      "Set up pull-request checks and Firebase preview environments so changes can be reviewed before production.",
      "Used GitHub OIDC and GCP Workload Identity Federation instead of storing a long-lived service-account key.",
      "Automated the production deployment after merges to main and added uptime monitoring for the live site.",
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
      goal: "Build a portfolio that uses a real review, deployment, and monitoring workflow instead of manually publishing changes.",
      focus:
        "I built the site and the CI/CD path around it, including previews, cloud authentication, hosting, DNS, and monitoring.",
      outcome:
        "The site now has a repeatable path from feature branch to preview to production without storing long-lived deployment credentials.",
    },
    filters: ["Cloud & DevOps"],
    github: "https://github.com/ramsrisaikotari/abhiram-portfolio",
    live: "https://abhiramkotari.com",
    additionalTechnologies: ["GitHub", "Google Cloud", "Cloudflare DNS"],
  },
  {
    slug: "phishing-url-detection",
    title: "Phishing URL Detection with Machine Learning",
    kind: "academic",
    category: "Machine Learning / Security",
    featured: true,
    summary:
      "An academic machine-learning project that explores phishing detection using URL and domain features. I worked with several ML and deep-learning approaches and connected the prediction flow to an application layer.",
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
      "Prepared URL and domain features for model training and comparison.",
      "Compared classical ML and deep-learning approaches including Random Forest, SVM, CNN, and LSTM.",
      "Connected the model output to an application/API flow for testing predictions.",
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
      goal: "Explore whether URL and domain features can help distinguish phishing sites from legitimate ones.",
      focus:
        "I worked on feature preparation, model comparison, evaluation, and connecting predictions to the application flow.",
      outcome:
        "The project helped me understand the trade-offs between different model types and how model predictions can be exposed through an application.",
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
      "A data and forecasting project that collects COVID-19 data, processes it through Python-based workflows, and uses ARIMA and Prophet to explore trends through an interactive dashboard.",
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
      "Built Python workflows to ingest and prepare COVID-19 data.",
      "Used ARIMA and Prophet to explore time-series trends and forecasts.",
      "Presented the processed data through React and D3 visualizations.",
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
      goal: "Turn raw COVID-19 data into a workflow that could be processed, explored, and forecasted.",
      focus:
        "I worked on data processing, time-series forecasting, and the visualization flow.",
      outcome:
        "I used the project to connect data processing, forecasting, and visualization in one application.",
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
      "Worked on the migration and production support of 150+ APIs and microservices across four AWS accounts and two regions. My work covered ECS, Lambda, API Gateway, deployments, configuration, monitoring, and post-deployment checks.",
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
      "Worked with ECS/Fargate, Lambda, API Gateway, networking, configuration, and secrets.",
      "Supported releases and checked application health after deployments.",
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
      goal: "Help move API workloads to AWS and keep them stable after migration.",
      focus:
        "I worked across cloud infrastructure, deployment support, and production checks.",
      outcome:
        "I supported these workloads across multiple environments and regions, from deployment through production troubleshooting.",
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
      "Worked on moving AWS log delivery to a new CloudWatch and Firehose-based flow across multiple accounts and regions. I also updated Python automation used to check whether logs were active, delivered successfully, backed up correctly, and visible in Dynatrace.",
    technologies: [
      "AWS",
      "CloudWatch",
      "Amazon Data Firehose",
      "Python",
      "Dynatrace",
      "S3",
    ],
    highlights: [
      "Used Python checks to confirm log activity, delivery status, and data freshness.",
      "Checked Firehose delivery, throttling, and S3 backup behavior.",
      "Verified that the expected logs were reaching Dynatrace.",
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
      goal: "Move log delivery to the new AWS-to-Dynatrace path without losing visibility into delivery health.",
      focus:
        "I focused on delivery validation and the Python checks used to verify each step of the log path.",
      outcome:
        "The validation helped separate source-log issues from Firehose delivery problems and downstream Dynatrace ingestion issues.",
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
      "Worked with Dynatrace, Datadog, CloudWatch, Elasticsearch, and Kibana to onboard logs and metrics, create monitoring, and investigate production issues.",
    technologies: [
      "Dynatrace",
      "Datadog",
      "AWS CloudWatch",
      "Elasticsearch",
      "Kibana",
    ],
    highlights: [
      "Onboarded logs and metrics for cloud-hosted applications.",
      "Worked with dashboards and alerts in Dynatrace, Datadog, and CloudWatch.",
      "Used logs and metrics to investigate service-health and production issues.",
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
      goal: "Make it easier to see what applications and infrastructure were doing in production.",
      focus:
        "I worked on log and metric onboarding, dashboards, alerts, and production troubleshooting.",
      outcome:
        "This gave the team more useful signals to work with during monitoring and incident investigation.",
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
      "Supported release pipelines that moved applications from Dev through Production. This included container builds, approval gates, ECS blue-green deployments, failed deployment troubleshooting, rollbacks, and post-release checks.",
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
      "Supported near-daily releases through Dev, Test, Stage, and Production.",
      "Troubleshot image builds, task-definition mismatches, and failed deployments.",
      "Worked with approval gates, blue-green releases, rollback scenarios, and post-release checks.",
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
      goal: "Make application releases predictable from Dev through Production.",
      focus:
        "I worked on pipeline operation, deployment troubleshooting, blue-green releases, approvals, and post-release checks.",
      outcome:
        "This work gave me regular hands-on experience with release failures, rollbacks, and production validation.",
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
      "Supported more than 30 production incidents involving ECS services, APIs, databases, networking, load balancers, and application failures. I worked with application, database, network, and platform teams to troubleshoot issues and support root-cause analysis.",
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
      "Supported 30+ production incidents and root-cause analysis.",
      "Investigated service communication, database connectivity, timeouts, routing, security groups, and load balancing.",
      "Worked across application, database, network, and platform teams to narrow down failures.",
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
      goal: "Restore service quickly and understand where failures were occurring across the stack.",
      focus:
        "I worked on incident triage and troubleshooting across application, container, network, database, and AWS layers.",
      outcome:
        "The incidents strengthened my ability to follow a problem across multiple layers instead of treating each component in isolation.",
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
      "Added Playwright test reporting to Jenkins pipelines so teams could quickly see build status, execution details, and test artifacts after a run.",
    technologies: [
      "Jenkins",
      "Playwright",
      "GitHub",
      "JUnit XML",
      "HTML Reports",
    ],
    highlights: [
      "Ran Playwright tests in Jenkins pipelines.",
      "Added reporting for success, failure and unstable build states.",
      "Packaged test artifacts with environment, branch, and build details to help troubleshoot failures.",
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
      goal: "Make Playwright results easier for teams to review after a Jenkins run.",
      focus:
        "I worked on test execution, post-build reporting, and packaging the artifacts needed for troubleshooting.",
      outcome:
        "The workflow brought useful build context and test outputs together for easier investigation.",
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
      "Built a database-backed car rental application for vehicle search, reservations, booking management, authentication, and administrative workflows.",
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
      "Built a Kanban-style task management application with REST APIs, JWT authentication, role-based access, MySQL storage, and automated testing.",
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
      "Compared several machine-learning models for diabetes risk prediction, including preprocessing, feature selection, hyperparameter tuning, and model evaluation.",
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
      "Used K-Means, hierarchical clustering, and PCA to group customers based on behavioral and demographic data and compare the resulting segments.",
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
      "Built an NLP chatbot that identifies user intent, extracts entities, and connects with Slack and Telegram.",
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
      "Built a Java Swing application for calculating loan payments with input validation and a simple desktop interface.",
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
      "Built an inventory application for adding, updating, searching, and deleting records with validation and persistent storage.",
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
