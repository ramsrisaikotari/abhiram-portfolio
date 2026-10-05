import { Github, Linkedin } from 'lucide-react';
import { profile } from '../data/profile';
export default function Footer() {
  return <footer className="footer"><p>Designed, Built, Previewed & Deployed by Abhi Ram Kotari</p><div><a className="icon-button" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="Abhi Ram Kotari on GitHub"><Github size={19} /></a><a className="icon-button" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Abhi Ram Kotari on LinkedIn"><Linkedin size={19} /></a></div></footer>;
}
