import { useEffect, useRef, useState } from "react";
import { navigation, siteLinks } from "../data/siteContent";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menu.current?.contains(target) && !toggle.current?.contains(target)) {
        setOpen(false);
      }
    };
    const desktop = window.matchMedia("(min-width: 48rem)");
    const closeOnDesktop = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="logo" href="#home" aria-label="Abhi Ram Kotari, home">
          AK<span aria-hidden="true">.</span>
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="navigation-links"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <div
          ref={menu}
          id="navigation-links"
          className={`nav-links${open ? " is-open" : ""}`}
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a
            className="button button-primary nav-resume"
            href={siteLinks.resume}
            target="_blank"
            rel="noreferrer"
            aria-label="Resume (opens in a new tab)"
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
