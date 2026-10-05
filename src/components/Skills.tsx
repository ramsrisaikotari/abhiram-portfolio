import { skills } from "../data/skills";
import SectionHeading from "./SectionHeading";
export default function Skills() {
  return (
    <section
      id="skills"
      className="section reveal"
      aria-label="Technical skills"
    >
      <SectionHeading number="06">Technical Skills</SectionHeading>
      <div className="skills-grid">
        {skills.map((skill) => (
          <div className="skill-group" key={skill.category}>
            <h3>{skill.category}</h3>
            <ul className="tags">
              {skill.technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
