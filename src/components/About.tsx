import { profile } from '../data/profile';
import SectionHeading from './SectionHeading';
export default function About() {
  return <section id="about" className="section reveal" aria-label="About me"><SectionHeading number="01">About Me</SectionHeading>
    <div className="about-layout"><div className="about-copy">{profile.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="technology-intro">A few technologies I work with:</p><ul className="technology-list">{profile.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></div>
      <aside className="about-aside"><span className="eyebrow">ENGINEERING AT SCALE</span><strong>150<span>+</span></strong><p>Enterprise APIs & microservices supported across AWS environments.</p><div className="environment-list"><span>Dev</span><span>Test</span><span>Stage</span><span>Production</span></div></aside>
    </div></section>;
}
