"use client";

import { useState, useRef } from "react";
import { personal } from "@/data/personal";
import { Mail, FileText } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import ScrollReveal from "./ScrollReveal";
import Magnetic from "@/components/Magnetic";

export default function About() {
  const links = [
    {
      label: "GitHub",
      href: personal.github,
      icon: GithubIcon,
      show: !!personal.github,
      color: "var(--chalk-pink)",
    },
    {
      label: "LinkedIn",
      href: personal.linkedin,
      icon: LinkedinIcon,
      show: !!personal.linkedin,
      color: "var(--chalk-cyan)",
    },
    {
      label: "Resume",
      href: personal.resume,
      icon: FileText,
      show: !!personal.resume,
      color: "var(--chalk-yellow)",
    },
    {
      label: "Email",
      href: personal.email ? `mailto:${personal.email}` : null,
      icon: Mail,
      show: !!personal.email,
      color: "var(--chalk-mint)",
    },
  ].filter((l) => l.show && l.href);

  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section id="about" className="px-6 max-w-5xl mx-auto py-32 relative">
      <ScrollReveal>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-12 relative inline-block">
          About Me
          <svg className="absolute top-1 -right-10 w-8 h-8 text-[var(--chalk-mint)] animate-spin-slow" viewBox="0 0 50 50" style={{ animationDuration: '10s' }}>
            <path d="M25,0 L30,20 L50,25 L30,30 L25,50 L20,30 L0,25 L20,20 Z" fill="currentColor" />
          </svg>
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="flex flex-col lg:flex-row items-start gap-12 max-w-5xl">
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex-1 p-8 md:p-10 border-l border-white/20 relative"
          >
            {/* Base Text Layer (Dim) */}
            <p className="text-xl md:text-3xl text-white/20 leading-tight mb-12 font-medium tracking-tight">
              {personal.bio}
            </p>

            {/* Masked X-Ray Text Layer (Bright) */}
            <div 
              className="absolute top-8 md:top-10 left-8 md:left-10 right-8 md:right-10 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                WebkitMaskImage: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                maskImage: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
              }}
            >
              <p className="text-xl md:text-3xl text-white leading-tight mb-12 font-medium tracking-tight">
                {personal.bio}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 relative z-10">
              {links.map((link) => (
                <Magnetic key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2 px-6 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    <link.icon size={16} />
                    {link.label}
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
