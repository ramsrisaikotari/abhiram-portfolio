import { skills } from "../data/siteContent";

export default function Skills() {
  return (
    <section id="skills" className="section section-tinted" aria-labelledby="skills-title">
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-kicker"><span>04</span> / Skills</p>
          <h2 id="skills-title">Tools I use</h2>
        </div>
        <dl className="skills-list">
          {skills.map((skill) => (
            <div className="skill-row" key={skill.category}>
              <dt>{skill.category}</dt>
              <dd>{skill.details}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
