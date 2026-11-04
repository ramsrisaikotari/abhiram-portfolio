import { useId, useSyncExternalStore } from "react";

const desktopQuery = "(min-width: 48rem)";
function subscribeToLayout(onChange: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const isDesktopLayout = () => window.matchMedia(desktopQuery).matches;

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
    description: "CloudWatch Logs flow to Amazon Data Firehose, then Dynatrace, with a branch to an S3 backup. Three separate dashed arrows run from the Python validator directly to Amazon Data Firehose for delivery and throttling, S3 backup for backup health, and Dynatrace for freshness. Each check arrow ends at its target box, not on another line.",
    height: 464,
  },
] as const;

export default function CaseStudyDiagram({ index }: { index: number }) {
  const id = useId();
  const wide = useSyncExternalStore(subscribeToLayout, isDesktopLayout);
  const { title, description, height } = descriptions[index];
  const arrow = `url(#${id}-arrow)`;

  return (
    <svg
      className={`case-study-diagram${wide ? " case-study-diagram-wide" : ""}`}
      viewBox={wide ? `0 0 960 ${index === 0 ? 320 : 440}` : `0 0 320 ${height}`}
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

      {wide && index === 0 && (
        <>
          <rect x="8" y="124" width="176" height="112" rx="4" />
          <text x="96" y="171"><tspan x="96">MuleSoft</tspan><tspan x="96" dy="30">(before)</tspan></text>
          <path d="M184 180 H478" markerEnd={arrow} />
          <text x="332" y="105"><tspan x="332">Migrated and</tspan><tspan x="332" dy="30">deployed through</tspan></text>
          <text x="332" y="222"><tspan x="332">CodePipeline,</tspan><tspan x="332" dy="30">CodeBuild and</tspan><tspan x="332" dy="30">CodeDeploy</tspan></text>
          <rect x="480" y="112" width="248" height="136" rx="4" />
          <text x="604" y="151"><tspan x="604">ECS/Fargate on AWS,</tspan><tspan x="604" dy="30">Stage and Production</tspan><tspan x="604" dy="30">(after)</tspan></text>
          <path d="M728 180 H790" markerEnd={arrow} />
          <rect x="792" y="132" width="160" height="96" rx="4" />
          <text x="872" y="163"><tspan x="872">Kibana</tspan><tspan x="872" dy="26">Watcher</tspan><tspan x="872" dy="26">alerts</tspan></text>
        </>
      )}

      {wide && index === 1 && (
        <>
          <rect x="8" y="154" width="260" height="90" rx="4" />
          <text x="138" y="190"><tspan x="138">AWS CDK</tspan><tspan x="138" dy="30">GitHub pull requests</tspan></text>
          <path d="M268 199 H350 V74 H845 V112" markerEnd={arrow} />
          <path d="M599 74 V112" markerEnd={arrow} />
          <text x="620" y="45">Changes through pull requests</text>
          <rect x="492" y="114" width="214" height="188" rx="4" />
          <rect x="738" y="114" width="214" height="188" rx="4" />
          <text className="diagram-region" x="599" y="147"><tspan x="599">Primary region</tspan></text>
          <text className="diagram-region" x="845" y="142"><tspan x="845">Disaster-recovery</tspan><tspan x="845" dy="26">region</tspan></text>
          {[599, 845].map((x) => (
            <text key={x} x={x} y="206"><tspan x={x}>ECS/Fargate</tspan><tspan x={x} dy="28">SQS</tspan><tspan x={x} dy="28">Configuration in S3</tspan></text>
          ))}
          <path className="diagram-check" d="M599 302 V368 H138 V246" markerEnd={arrow} />
          <path className="diagram-check" d="M845 302 V368 H599" />
          <rect className="diagram-arrow-label" x="355" y="351" width="330" height="34" />
          <text x="520" y="377">Rollback pull request</text>
        </>
      )}

      {wide && index === 2 && (
        <>
          <rect x="8" y="108" width="224" height="82" rx="4" />
          <text x="120" y="157">CloudWatch Logs</text>
          <path d="M232 149 H338" markerEnd={arrow} />
          <rect x="340" y="108" width="260" height="82" rx="4" />
          <text x="470" y="142"><tspan x="470">Amazon Data</tspan><tspan x="470" dy="28">Firehose</tspan></text>
          <path d="M600 149 H650 V90 H726" markerEnd={arrow} />
          <path d="M650 149 V224 H726" markerEnd={arrow} />
          <rect x="728" y="56" width="224" height="68" rx="4" />
          <text x="840" y="98">Dynatrace</text>
          <rect x="728" y="190" width="224" height="68" rx="4" />
          <text x="840" y="232">S3 backup</text>
          <path className="diagram-check" d="M420 338 V192" markerEnd={arrow}><title>Amazon Data Firehose: delivery and throttling</title></path>
          <path className="diagram-check" d="M600 338 V280 H700 V140 H840 V126" markerEnd={arrow}><title>Dynatrace: freshness</title></path>
          <path className="diagram-check" d="M714 383 H840 V260" markerEnd={arrow}><title>S3 backup: backup health</title></path>
          <rect x="264" y="338" width="450" height="92" rx="4" />
          <text x="489" y="365"><tspan x="489">Python validator</tspan><tspan x="489" dy="28">Checks delivery, throttling,</tspan><tspan x="489" dy="28">backup health and freshness</tspan></text>
        </>
      )}

      {!wide && index === 0 && (
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

      {!wide && index === 1 && (
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
          <path className="diagram-check" d="M72 356 V408 H312 V44 H298 M224 356 V408" />
          <path className="diagram-check" d="M312 44 H298" markerEnd={arrow} />
          <rect className="diagram-arrow-label" x="46" y="391" width="228" height="27" />
          <text x="160" y="410">Rollback pull request</text>
        </>
      )}

      {!wide && index === 2 && (
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
          <path className="diagram-check" d="M160 308 V176 H280 V162" markerEnd={arrow}><title>Amazon Data Firehose: delivery and throttling</title></path>
          <path className="diagram-check" d="M110 308 V282 H78 V258" markerEnd={arrow}><title>Dynatrace: freshness</title></path>
          <path className="diagram-check" d="M210 308 V282 H242 V258" markerEnd={arrow}><title>S3 backup: backup health</title></path>
          <rect x="24" y="308" width="272" height="146" rx="4" />
          <text x="160" y="337"><tspan x="160">Python validator</tspan><tspan x="160" dy="33">Checks delivery, throttling,</tspan><tspan x="160" dy="26">backup health</tspan><tspan x="160" dy="26">and freshness</tspan></text>
        </>
      )}
    </svg>
  );
}
