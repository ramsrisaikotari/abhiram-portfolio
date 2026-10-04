import { Cloud, Terminal, Activity, Code2, Server } from 'lucide-react';
import { skills } from '../data/skills';
import SectionHeading from './SectionHeading';
const icons = [Cloud, Terminal, Activity, Code2, Server];
export default function Skills() {
  return <section id="skills" className="section reveal" aria-label="Skills"><SectionHeading number="03">Technologies I Work With</SectionHeading>
    <div className="skills-grid">{skills.map((skill, index) => { const Icon = icons[index]; return <div className="skill-group" key={skill.category}><Icon size={22} aria-hidden="true" /><h3>{skill.category}</h3><ul>{skill.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></div>; })}</div>
  </section>;
}
