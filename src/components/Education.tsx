import { education } from "../data/siteContent";

export default function Education() {
  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-kicker"><span>05</span> / Education</p>
          <h2 id="education-title">Education</h2>
        </div>
        <ul className="education-list">
          {education.map((item) => (
            <li key={item.degree}>
              <h3>{item.degree}</h3>
              <p>{item.school}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
