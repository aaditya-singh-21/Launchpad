import React from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { buttonVariants } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

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
    description: 'A lightweight container-first operating system designed for edge computing.',
    authorAvatar: avatarImg,
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="w-full pt-[120px]">
      {/* Hero Section */}
      <section className="container mx-auto px-6 max-w-[1280px] grid grid-cols-1 lg:grid-cols-2 items-center gap-12 min-h-[80vh] pb-20">
        <div className="max-w-[560px] mx-auto lg:mx-0 text-center lg:text-left">
          <Badge variant="secondary" className="bg-gray-200 text-slate-500 text-[10px] font-extrabold tracking-[1.5px] uppercase py-1 px-4 rounded-full mb-8 hover:bg-gray-200 border-none">
            EVOLUTIONARY DEVELOPMENT
          </Badge>
          <h1 className="text-5xl sm:text-6xl leading-[1.1] font-extrabold text-[#1a1a1a] mb-6 tracking-[-2px]">
            Launch Your Ideas. <br />
            <span className="text-[#E67A62]">Discover the Future.</span>
          </h1>
          <p className="text-lg text-zinc-500 leading-relaxed mb-10">
            A modern platform for developers to showcase and explore cutting-edge projects. 
            Build your portfolio, find inspiration, and connect with the next generation of creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/explore" className={cn(buttonVariants({ size: "lg" }), "bg-[#E67A62] hover:bg-[#D66D57] text-white px-8 py-6 text-base rounded-lg font-semibold border-none")}>
              Explore Projects &rarr;
            </Link>
            <Link to="/share" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "bg-[#E2DFDB] hover:bg-[#D5D1CC] text-[#1a1a1a] px-8 py-6 text-base rounded-lg font-bold border-none")}>
              Share Your Project
            </Link>
          </div>
        </div>
        <div className="relative flex justify-center items-center">
          <div className="bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md rounded-3xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/50 transform [transform:perspective(1000px)_rotateY(-5deg)_rotateX(5deg)] transition-transform duration-500 ease-out hover:[transform:perspective(1000px)_rotateY(0deg)_rotateX(0deg)]">
            <img src={heroImg} alt="Dashboard Illustration" className="w-full rounded-xl block" />
          </div>
        </div>
      </section>

      {/* Trending Projects Section */}
      <section className="bg-[#faf7f2] py-20 border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-[1280px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-[32px] font-extrabold text-[#1a1a1a] mb-2 tracking-tight">Trending Projects</h2>
              <p className="text-base text-zinc-500">Handpicked innovations from our global community.</p>
            </div>
            <Link to="/explore" className="text-[#E67A62] font-semibold text-sm flex items-center gap-1 hover:text-[#D66D57] transition-colors">
              View all projects &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-[1280px]">
          <div className="bg-[#E67A62] rounded-2xl py-16 px-6 sm:px-10 text-center text-white shadow-[0_20px_40px_rgba(230,122,98,0.2)]">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">Ready to showcase your craft?</h2>
            <p className="text-lg max-w-[600px] mx-auto mb-10 opacity-90 leading-relaxed">
              Join a community of 50k+ developers building the next generation of web and mobile applications.
            </p>
            <Link to="/signup" className={cn(buttonVariants({ size: "lg" }), "bg-white hover:bg-gray-100 text-[#E67A62] px-8 py-6 text-base rounded-lg font-bold border-none transition-transform hover:-translate-y-[1px]")}>
              Create Your Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
