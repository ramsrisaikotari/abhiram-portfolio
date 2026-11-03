import { contact, siteLinks } from "../data/siteContent";

export default function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="section-shell contact-inner">
        <div>
          <p className="section-kicker"><span>05</span> / Contact</p>
          <h2 id="contact-title">{contact.heading}</h2>
          <p>{contact.text}</p>
        </div>
        <ul className="contact-links" aria-label="Contact links">
          <li>
            <a className="button button-primary" href={siteLinks.email}>Email</a>
          </li>
          <li>
            <a href={siteLinks.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          </li>
          <li>
            <a href={siteLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </li>
        </ul>
      </div>
    </section>
  );
}
