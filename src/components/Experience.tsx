import { experience } from '../data/experience';
import SectionHeading from './SectionHeading';
export default function Experience() {
  return <section id="experience" className="section reveal" aria-label="Experience"><SectionHeading number="02">Where I've Worked</SectionHeading>
    <div className="experience-list">{experience.map(job => <article className="experience-item" key={job.company + job.role}>
      <div className="company-label"><span className="eyebrow">EXPERIENCE</span><h3>{job.company}</h3>{job.period && <p>{job.period}</p>}</div>
      <div className="job-detail"><h4>{job.role}</h4><ul>{job.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></div>
    </article>)}</div></section>;
}
