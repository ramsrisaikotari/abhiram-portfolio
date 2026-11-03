import { hero, siteLinks } from "../data/siteContent";

const heroLinks = [
  { label: "Resume", href: siteLinks.resume },
  { label: "GitHub", href: siteLinks.github },
  { label: "LinkedIn", href: siteLinks.linkedin },
  { label: "Email", href: siteLinks.email },
] as const;

export default function Hero() {
  return (
    <section id="home" className="hero section-shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 id="hero-title">
          <span className="hero-name">{hero.name}</span>
          <span className="hero-headline">{hero.headline}</span>
        </h1>
        <p className="hero-intro">{hero.intro}</p>
        <p className="relocation">{hero.relocation}</p>
        <ul className="text-links" aria-label="Profile links">
          {heroLinks.map((link) => {
            const external = link.href.startsWith("http") || link.href.endsWith(".pdf");
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  aria-label={external ? `${link.label} (opens in a new tab)` : undefined}
                >
                  {link.label}
                  {external && <span aria-hidden="true"> ↗</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <dl className="impact-grid" aria-label="Professional impact">
        {hero.impact.map((item) => (
          <div className="impact-item" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
