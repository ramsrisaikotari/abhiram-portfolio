import { useEffect } from 'react';
export default function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('reveal-pending'); observer.unobserve(entry.target); } }); }, { threshold: 0.07 });
    document.querySelectorAll('.reveal').forEach(element => { element.classList.add('reveal-pending'); observer.observe(element); });
    return () => { observer.disconnect(); document.querySelectorAll('.reveal-pending').forEach(element => element.classList.remove('reveal-pending')); };
  }, []);
}
