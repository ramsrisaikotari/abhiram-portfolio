import { impact } from "../data/impact";
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
