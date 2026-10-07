import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navigation } from '../data/profile';
import ResumeButton from './ResumeButton';
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-20% 0px -55% 0px' });
    navigation.forEach(item => { const element = document.getElementById(item.id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    const query = window.matchMedia('(min-width: 901px)');
    const resize = () => { if (query.matches) setOpen(false); };
    query.addEventListener('change', resize);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); query.removeEventListener('change', resize); };
  }, [open]);
  return <header className="site-header"><nav className="nav-shell" aria-label="Main navigation">
    <a className="logo" href="#home" aria-label="Abhi Ram Kotari, home">AK<span aria-hidden="true">.</span></a>
    <button ref={toggle} className="menu-toggle icon-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="navigation-links" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <div ref={menu} id="navigation-links" className={`nav-links ${open ? 'is-open' : ''}`}>
      {navigation.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} onClick={() => setOpen(false)}><span>{item.number}.</span> {item.label}</a>)}
      <a href="/experience-3d" data-experience-route className="experience-entry">3D Experience</a>
      <ResumeButton />
    </div>
  </nav></header>;
}
