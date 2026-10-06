import {
  Cloud,
  Container,
  Workflow,
  Activity,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { profile } from "../data/profile";
import ResumeButton from "./ResumeButton";
export default function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-main">
        <p className="intro">DevOps &amp; Site Reliability Engineer</p>
        <h1 id="hero-title">
          Abhi Ram Kotari<span className="accent">.</span>
        </h1>
        <p className="hero-statement">
          I build and support cloud systems, automate deployments, and improve
          how production applications are monitored and operated.
        </p>
        <p className="hero-description">{profile.description}</p>
        <div className="hero-actions">
          <a href="#experience" className="button button-solid">
            View Experience
          </a>
          <ResumeButton className="button button-outline">
            View Resume
          </ResumeButton>
        </div>
        <div className="hero-socials">
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            <Github size={16} aria-hidden="true" />
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={16} aria-hidden="true" />
            LinkedIn
          </a>
          <a href={profile.email}>
            <Mail size={16} aria-hidden="true" />
            Email
          </a>
        </div>
      </div>
      <div
        className="system-diagram"
        role="img"
        aria-label="Cloud systems diagram: delivery, AWS infrastructure, services, and observability"
      >
        <div className="diagram-top">
          <span>INFRASTRUCTURE / SYSTEMS</span>
          <span>01—04</span>
        </div>
        <div className="diagram-nodes">
          <div className="system-node">
            <Workflow />
            <span>
              <small>01 / DELIVERY</small>CI/CD pipelines
            </span>
          </div>
          <div className="system-node node-cloud">
            <Cloud />
            <span>
              <small>02 / INFRASTRUCTURE</small>AWS cloud
            </span>
          </div>
          <div className="system-node">
            <Container />
            <span>
              <small>03 / SERVICES</small>APIs & microservices
            </span>
          </div>
          <div className="system-node">
            <Activity />
            <span>
              <small>04 / OBSERVABILITY</small>Metrics · logs · traces
            </span>
          </div>
        </div>
        <p className="diagram-caption">
          From deployment to production monitoring.
        </p>
      </div>
      <div className="hero-bottom">
        <span>DEVOPS & SITE RELIABILITY ENGINEERING</span>
        <a href="#about">
          See my work <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
