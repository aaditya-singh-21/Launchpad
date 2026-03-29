import React from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import './LandingPage.css';

import heroImg from '../assets/hero_mockup.png';
import p1Img from '../assets/project_1.png';
import p2Img from '../assets/project_2.png';
import p3Img from '../assets/project_3.png';
import p4Img from '../assets/project_4.png';
import avatarImg from '../assets/user_avatar.png';

const MOCK_PROJECTS = [
  {
    image: p1Img,
    tags: ['React', 'Three.js'],
    title: 'Nebula UI',
    description: 'A futuristic component library focused on glassmorphism and 3D interactions.',
    authorAvatar: avatarImg,
  },
  {
    image: p2Img,
    tags: ['TypeScript', 'Rust'],
    title: 'Flowstate SDK',
    description: 'Ultra-fast state management for complex collaborative applications.',
    authorAvatar: avatarImg,
  },
  {
    image: p3Img,
    tags: ['Python', 'AI'],
    title: 'CipherMind',
    description: 'Self-learning security layer that detects and patches vulnerabilities in real-time.',
    authorAvatar: avatarImg,
  },
  {
    image: p4Img,
    tags: ['Go', 'Docker'],
    title: 'BeaconOS',
    description: 'A lightweight, container-first operating system designed for edge computing.',
    authorAvatar: avatarImg,
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-content">
          <span className="pill-badge">EVOLUTIONARY DEVELOPMENT</span>
          <h1 className="hero-title">
            Launch Your Ideas. <br />
            <span className="highlight-text">Discover the Future.</span>
          </h1>
          <p className="hero-subtitle">
            A modern platform for developers to showcase and explore cutting-edge projects. 
            Build your portfolio, find inspiration, and connect with the next generation of creators.
          </p>
          <div className="hero-actions">
            <Link to="/explore" className="btn btn-primary btn-large">
              Explore Projects &rarr;
            </Link>
            <Link to="/share" className="btn btn-secondary btn-large">
              Share Your Project
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-wrapper">
            <img src={heroImg} alt="Dashboard Illustration" className="dashboard-mockup" />
          </div>
        </div>
      </section>

      {/* Trending Projects Section */}
      <section className="trending-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Trending Projects</h2>
              <p className="section-subtitle">Handpicked innovations from our global community.</p>
            </div>
            <Link to="/explore" className="view-all-link">
              View all projects &rarr;
            </Link>
          </div>
          
          <div className="projects-grid">
            {MOCK_PROJECTS.map((project, index) => (
              <ProjectCard 
                key={index}
                image={project.image}
                tags={project.tags}
                title={project.title}
                description={project.description}
                authorAvatar={project.authorAvatar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section container">
        <div className="cta-card">
          <h2 className="cta-title">Ready to showcase your craft?</h2>
          <p className="cta-subtitle">
            Join a community of 50k+ developers building the next generation of web and mobile applications.
          </p>
          <Link to="/signup" className="btn btn-white btn-large">
            Create Your Project
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
