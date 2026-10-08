import { useEffect, useState } from "react";
export function useMedia(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}
export function useSceneController(mobile: boolean) {
  const [active, setActive] = useState("intro");
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries
          .filter((item) => item.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (entry) setActive(entry.target.id);
      },
      {
        rootMargin: mobile
          ? `-${Math.round(Math.min(184, Math.max(160, innerHeight * 0.21)) + 48)}px 0px -15% 0px`
          : "-15% 0px -45% 0px",
        threshold: [0, 0.2, 0.5],
      },
    );
    document
      .querySelectorAll("[data-system-section]")
      .forEach((section) => observer.observe(section));
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [mobile]);
  return { active, visible };
}
