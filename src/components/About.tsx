import { profile } from "../data/profile";
import SectionHeading from "./SectionHeading";
export default function About() {
  return (
    <section id="about" className="section reveal" aria-label="About me">
      <SectionHeading number="01">About Me</SectionHeading>
      <div className="about-layout">
        <div className="about-copy">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside className="approach-aside">
          <span className="eyebrow">How I work</span>
          <p>
            Automate repeated work.
            <br />
            Monitor what matters.
            <br />
            Troubleshoot across the stack.
          </p>
        </aside>
      </div>
    </section>
  );
}
