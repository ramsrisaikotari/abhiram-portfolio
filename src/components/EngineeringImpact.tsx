const impact = [
  ["150+", "APIs & Microservices Supported"],
  ["4", "AWS Accounts"],
  ["2", "AWS Regions"],
  ["30+", "Production Incidents Supported"],
];
export default function EngineeringImpact() {
  return (
    <section className="impact" aria-labelledby="impact-title">
      <h2 id="impact-title" className="eyebrow">
        Engineering Impact
      </h2>
      <dl>
        {impact.map(([value, label]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
