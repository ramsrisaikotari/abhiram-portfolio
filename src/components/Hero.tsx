import { Cloud, Container, Workflow, Activity } from 'lucide-react';
import { profile } from '../data/profile';
import ResumeButton from './ResumeButton';
export default function Hero() {
  return <section id="home" className="hero" aria-labelledby="hero-title">
    <div className="hero-main"><p className="intro">Hi, my name is</p><h1 id="hero-title">Abhi Ram Kotari<span className="accent">.</span></h1>
      <p className="hero-statement">I build and operate<br className="desktop-break" /> reliable cloud systems.</p>
      <p className="hero-description">{profile.description}</p>
      <div className="hero-actions"><a href="#projects" className="button button-solid">View My Work</a><ResumeButton className="button button-outline">View Resume</ResumeButton></div>
    </div>
    <div className="system-diagram" role="img" aria-label="Cloud systems diagram: delivery, AWS infrastructure, services, and observability">
      <div className="diagram-top"><span>INFRASTRUCTURE / SYSTEMS</span><span>01—04</span></div>
      <div className="diagram-nodes">
        <div className="system-node"><Workflow /><span><small>01 / DELIVERY</small>CI/CD pipelines</span></div>
        <div className="system-node node-cloud"><Cloud /><span><small>02 / INFRASTRUCTURE</small>AWS cloud</span></div>
        <div className="system-node"><Container /><span><small>03 / SERVICES</small>APIs & microservices</span></div>
        <div className="system-node"><Activity /><span><small>04 / OBSERVABILITY</small>Metrics · logs · traces</span></div>
      </div><p className="diagram-caption">Build. Deploy. Observe. Improve.</p>
    </div>
    <div className="hero-bottom"><span>DEVOPS & SITE RELIABILITY ENGINEERING</span><a href="#about">Explore the portfolio <span aria-hidden="true">↓</span></a></div>
  </section>;
}
