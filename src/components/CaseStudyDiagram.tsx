import { useId } from "react";

const descriptions = [
  {
    title: "MuleSoft-to-AWS migration",
    description: "Before: MuleSoft. After: ECS/Fargate on AWS in Stage and Production, with Kibana Watcher alerts attached. The migration arrow is labeled Migrated and deployed through CodePipeline, CodeBuild and CodeDeploy. The pipeline services are annotations, not an intermediate step in the flow.",
    height: 480,
  },
  {
    title: "Configuration changes in two regions",
    description: "AWS CDK and GitHub pull requests feed the primary and disaster-recovery regions through arrows labeled Changes through pull requests. Each region contains ECS/Fargate, SQS and configuration in S3. A separate dashed return path labeled Rollback pull request leads back through the same pull-request process.",
    height: 440,
  },
  {
    title: "Log pipeline and Python validation",
    description: "CloudWatch Logs flow to Amazon Data Firehose, then Dynatrace, with a branch to an S3 backup. A Python validator checks delivery, throttling, backup health and freshness. Dashed arrows indicate checks.",
    height: 464,
  },
] as const;

export default function CaseStudyDiagram({ index }: { index: number }) {
  const id = useId();
  const { title, description, height } = descriptions[index];
  const arrow = `url(#${id}-arrow)`;

  return (
    <svg
      className="case-study-diagram"
      viewBox={`0 0 320 ${height}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-description`}
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-description`}>{description}</desc>
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {index === 0 && (
        <>
          <rect x="24" y="8" width="272" height="52" rx="4" />
          <text x="160" y="40">MuleSoft (before)</text>
          <path d="M160 60 V76 H36 V246 H160 V264" markerEnd={arrow} />
          <text x="180" y="108"><tspan x="180">Migrated and</tspan><tspan x="180" dy="24">deployed through</tspan></text>
          <text x="180" y="169"><tspan x="180">CodePipeline,</tspan><tspan x="180" dy="24">CodeBuild and</tspan><tspan x="180" dy="24">CodeDeploy</tspan></text>
          <rect x="24" y="266" width="272" height="100" rx="4" />
          <text x="160" y="295"><tspan x="160">ECS/Fargate on AWS,</tspan><tspan x="160" dy="25">Stage and Production</tspan><tspan x="160" dy="25">(after)</tspan></text>
          <path d="M160 366 V406" markerEnd={arrow} />
          <rect x="24" y="408" width="272" height="64" rx="4" />
          <text x="160" y="446">Kibana Watcher alerts</text>
        </>
      )}

      {index === 1 && (
        <>
          <rect x="24" y="8" width="272" height="72" rx="4" />
          <text x="160" y="38"><tspan x="160">AWS CDK</tspan><tspan x="160" dy="25">GitHub pull requests</tspan></text>
          <path d="M160 80 V148 H72 V166 M160 148 H224 V166" markerEnd={arrow} />
          <path d="M72 148 V166" markerEnd={arrow} />
          <rect className="diagram-arrow-label" x="47" y="92" width="226" height="47" />
          <text x="160" y="109"><tspan x="160">Changes through</tspan><tspan x="160" dy="23">pull requests</tspan></text>
          <rect x="4" y="168" width="136" height="188" rx="4" />
          <rect x="156" y="168" width="136" height="188" rx="4" />
          <text className="diagram-region" x="72" y="195"><tspan x="72">Primary</tspan><tspan x="72" dy="22">region</tspan></text>
          <text className="diagram-region" x="224" y="195"><tspan x="224">Disaster-recovery</tspan><tspan x="224" dy="22">region</tspan></text>
          {[72, 224].map((x) => (
            <text key={x} x={x} y="250"><tspan x={x}>ECS/Fargate</tspan><tspan x={x} dy="27">SQS</tspan><tspan x={x} dy="27">Configuration</tspan><tspan x={x} dy="22">in S3</tspan></text>
          ))}
          <path className="diagram-check" d="M72 356 V408 H312 V44 H298 M224 356 V408" markerEnd={undefined} />
          <path className="diagram-check" d="M312 44 H298" markerEnd={arrow} />
          <rect className="diagram-arrow-label" x="46" y="391" width="228" height="27" />
          <text x="160" y="410">Rollback pull request</text>
        </>
      )}

      {index === 2 && (
        <>
          <rect x="24" y="8" width="272" height="56" rx="4" />
          <text x="160" y="42">CloudWatch Logs</text>
          <path d="M160 64 V102" markerEnd={arrow} />
          <rect x="24" y="104" width="272" height="56" rx="4" />
          <text x="160" y="138">Amazon Data Firehose</text>
          <path d="M160 160 V180 H78 V198 M160 180 H242 V198" markerEnd={arrow} />
          <path d="M78 180 V198" markerEnd={arrow} />
          <rect x="4" y="200" width="148" height="56" rx="4" />
          <text x="78" y="234">Dynatrace</text>
          <rect x="168" y="200" width="148" height="56" rx="4" />
          <text x="242" y="234">S3 backup</text>
          <path className="diagram-check" d="M160 306 V282 H78 V258 M160 282 H242 V258" markerEnd={arrow} />
          <path className="diagram-check" d="M78 282 V258" markerEnd={arrow} />
          <rect x="24" y="308" width="272" height="146" rx="4" />
          <text x="160" y="337"><tspan x="160">Python validator</tspan><tspan x="160" dy="33">Checks delivery, throttling,</tspan><tspan x="160" dy="26">backup health</tspan><tspan x="160" dy="26">and freshness</tspan></text>
        </>
      )}
    </svg>
  );
}
