import { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EngineeringImpact from "./components/EngineeringImpact";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import useReveal from "./hooks/useReveal";
function Portfolio() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <EngineeringImpact />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

const Experience3D = lazy(() => import("./three/Experience3D"));
export default function App() {
  const [immersive, setImmersive] = useState(
    location.pathname === "/experience-3d",
  );
  useEffect(() => {
    const sync = () => {
      setImmersive(location.pathname === "/experience-3d");
      window.scrollTo(0, 0);
    };
    const navigate = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "a[data-experience-route]",
      );
      if (
        !link ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      history.pushState(null, "", link.getAttribute("href"));
      sync();
    };
    window.addEventListener("popstate", sync);
    document.addEventListener("click", navigate);
    return () => {
      window.removeEventListener("popstate", sync);
      document.removeEventListener("click", navigate);
    };
  }, []);
  return immersive ? (
    <Suspense
      fallback={
        <main style={{ padding: "3rem" }}>
          <p>Loading engineering systems…</p>
          <a href="/" data-experience-route>
            Back to Portfolio
          </a>
        </main>
      }
    >
      <Experience3D />
    </Suspense>
  ) : (
    <Portfolio />
  );
}
