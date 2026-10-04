export default function SectionHeading({ number, children }: { number: string; children: string }) {
  return <h2 className="section-heading"><span>{number}.</span> {children}</h2>;
}
