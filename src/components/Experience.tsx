import { experience } from "../data/siteContent";

export default function Experience() {
  return (
    <section id="experience" className="section section-tinted" aria-labelledby="experience-title">
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-kicker"><span>01</span> / Experience</p>
          <h2 id="experience-title">Where I work</h2>
        </div>

        <article className="experience-block">
          <header className="experience-header">
            <div>
              <h3>{experience.role}</h3>
              <p className="company">{experience.company}</p>
            </div>
            <p className="dates">{experience.dates}</p>
          </header>
          <p className="experience-summary">{experience.summary}</p>
          <ul className="responsibility-list">
            {experience.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="tools-line">
            <span>Tools</span>
            {experience.tools}
          </p>
        </article>
      </div>
    </section>
  );
}
