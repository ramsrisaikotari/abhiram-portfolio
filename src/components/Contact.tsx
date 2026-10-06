import { Mail, Github, Linkedin } from "lucide-react";
import { profile } from "../data/profile";
export default function Contact() {
  return (
    <section
      id="contact"
      className="section contact reveal"
      aria-labelledby="contact-title"
    >
      <p className="contact-kicker">
        <span>07.</span> Contact
      </p>
      <h2 id="contact-title">
        Let’s Connect<span className="accent">.</span>
      </h2>
      <p>
        I’m currently interested in DevOps, SRE, cloud, platform engineering,
        and MLOps opportunities. If you'd like to talk about a role, one of the
        projects here, or engineering in general, feel free to reach out.
      </p>
      <div className="contact-links">
        <a className="button button-solid" href={profile.email}>
          <Mail size={18} aria-hidden="true" />
          Email
        </a>
        <a
          className="button button-outline"
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={18} aria-hidden="true" />
          GitHub
        </a>
        <a
          className="button button-outline"
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={18} aria-hidden="true" />
          LinkedIn
        </a>
      </div>
    </section>
  );
}
