import { profile } from "../data/profile";
import SectionHeading from "./SectionHeading";
export default function About() {
  return (
    <section id="about" className="section reveal" aria-label="About me">
      <SectionHeading number="01">Engineering Approach</SectionHeading>
      <div className="about-layout">
        <div className="about-copy">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside className="approach-aside">
          <span className="eyebrow">A connected view of systems</span>
          <p>
            Repeatable delivery.
            <br />
            Useful observability.
            <br />
            Practical troubleshooting.
          </p>
        </aside>
      </div>
    </section>
  );
}
