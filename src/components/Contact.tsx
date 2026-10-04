import { Mail, Github, Linkedin } from 'lucide-react';
import { profile } from '../data/profile';
export default function Contact() {
  return <section id="contact" className="section contact reveal" aria-labelledby="contact-title"><p className="contact-kicker"><span>05.</span> What's Next?</p><h2 id="contact-title">Get In Touch<span className="accent">.</span></h2>
    <p>I'm open to opportunities in {profile.opportunities.slice(0, -1).join(', ')}, and {profile.opportunities.at(-1)}. If you're building reliable systems and looking for someone to help, I'd love to connect.</p>
    <div className="contact-links"><a className="button button-solid" href={profile.email}><Mail size={18} aria-hidden="true" />Email</a><a className="button button-outline" href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={18} aria-hidden="true" />GitHub</a><a className="button button-outline" href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={18} aria-hidden="true" />LinkedIn</a></div>
  </section>;
}
