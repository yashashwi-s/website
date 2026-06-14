"use client";

import { useState, useRef } from "react";
import { personal } from "@/data/personal";
import { Mail, FileText } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import ScrollReveal from "./ScrollReveal";
import Magnetic from "@/components/Magnetic";
import RevealText from "@/components/RevealText";

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
        <h2 className="text-5xl md:text-8xl font-black text-white mb-12 relative inline-block uppercase tracking-tighter">
          About
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
            {/* Staggered Reveal Text */}
            <div className="mb-16">
              <RevealText 
                text={personal.bio} 
                className="text-2xl md:text-4xl text-white leading-tight font-medium tracking-tight"
                delay={0}
              />
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
