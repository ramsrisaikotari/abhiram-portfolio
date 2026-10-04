import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import useReveal from './hooks/useReveal';
export default function App() {
  useReveal();
  return <><a className="skip-link" href="#main">Skip to content</a><Navbar /><main id="main" tabIndex={-1}><Hero /><About /><Experience /><Skills /><Projects /><Contact /></main><Footer /></>;
}
