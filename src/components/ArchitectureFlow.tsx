import type { ArchitectureFlow as Flow } from "../data/projects";
export default function ArchitectureFlow({ flow }: { flow: Flow }) {
  return (
    <div className="architecture">
      <p className="flow-label">{flow.label}</p>
      <ol className="flow" aria-label={flow.label}>
        {flow.steps.map((step, index) => (
          <li key={step}>
            {index > 0 && flow.connected !== false && (
              <span className="flow-arrow" aria-hidden="true">
                →
              </span>
            )}
            <span className="flow-node">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
