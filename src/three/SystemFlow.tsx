export default function SystemFlow({
  steps,
  selected,
  onSelect,
  label,
}: {
  steps: string[];
  selected: string;
  onSelect: (node: string) => void;
  label: string;
}) {
  return (
    <div className="system-flow" role="group" aria-label={label}>
      {steps.map((step, index) => (
        <button
          key={step}
          aria-pressed={selected === step}
          onFocus={() => onSelect(step)}
          onPointerEnter={() => onSelect(step)}
          onClick={() => onSelect(step)}
        >
          <span className="system-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          {step}
          <span aria-hidden="true"> ↗</span>
        </button>
      ))}
    </div>
  );
}
