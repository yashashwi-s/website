"use client";

import { useRef } from "react";
import { personal } from "@/data/personal";
import { Mail, FileText, MapPin, GraduationCap, Calendar } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import Magnetic from "@/components/Magnetic";
import ScrambleText from "@/components/ScrambleText";
import { motion, useScroll, useTransform } from "framer-motion";

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span className="relative inline-block">
      <span className="absolute opacity-[0.08]">{children}</span>
      <motion.span style={{ opacity }} className="text-white">{children}</motion.span>
    </span>
  );
};

export default function About() {
  const links = [
    { label: "GitHub", href: personal.github, icon: GithubIcon, show: !!personal.github },
    { label: "LinkedIn", href: personal.linkedin, icon: LinkedinIcon, show: !!personal.linkedin },
    { label: "Resume", href: personal.resume, icon: FileText, show: !!personal.resume },
    { label: "Email", href: personal.email ? `mailto:${personal.email}` : null, icon: Mail, show: !!personal.email },
  ].filter((l) => l.show && l.href);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const words = personal.bio.split(" ");
  
  // Visual clue opacity (fade out as they scroll)
  const visualClueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Right column fades in mid-scroll
  const infoOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const infoY = useTransform(scrollYProgress, [0.4, 0.6], [40, 0]);

  // Links fade in at the very end
  const linksOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const linksY = useTransform(scrollYProgress, [0.75, 0.9], [20, 0]);

  const quickFacts = [
    { icon: GraduationCap, label: personal.education },
    { icon: Calendar, label: `CGPA: ${personal.cgpa} • ${personal.graduationYear}` },
    { icon: MapPin, label: personal.location },
  ];

  return (
    <section ref={containerRef} id="about" className="relative h-[300vh] bg-[#050505]">
      <div className="sticky top-0 min-h-screen flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto overflow-visible py-24">
        
        {/* Scroll Clue */}
        <motion.div style={{ opacity: visualClueOpacity }} className="absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-4 hidden md:flex">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 rotate-90 origin-center translate-y-10">Keep Scrolling</div>
          <div className="w-[1px] h-32 bg-white/10 relative overflow-hidden mt-16">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/3 bg-white"
              animate={{ y: ["0%", "300%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column — Bio with word reveal */}
          <div className="lg:col-span-7">
            <h2 className="text-5xl md:text-[6vw] leading-none font-black text-white/10 mb-10 uppercase tracking-tighter">
              About
            </h2>

            <p className="text-xl md:text-3xl leading-[1.5] md:leading-[1.5] font-medium tracking-tight flex flex-wrap gap-x-2.5 gap-y-1.5 md:gap-x-3.5 md:gap-y-2">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                const range = [start * 0.7, end * 0.7];
                return <Word key={i} progress={scrollYProgress} range={range}>{word}</Word>;
              })}
            </p>

            {/* Social Links */}
            <motion.div 
              style={{ opacity: linksOpacity, y: linksY }} 
              className="flex flex-wrap items-center gap-4 mt-14"
            >
              {links.map((link) => (
                <Magnetic key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white hover:text-black hover:border-white transition-colors duration-300 uppercase tracking-widest text-xs group"
                  >
                    <link.icon size={14} />
                    <ScrambleText text={link.label} />
                  </a>
                </Magnetic>
              ))}
            </motion.div>
          </div>

          {/* Right Column — Quick Facts & Interests */}
          <motion.div 
            style={{ 
              opacity: infoOpacity, 
              y: infoY,
              pointerEvents: useTransform(scrollYProgress, [0.4, 0.41], ["none", "auto"])
            }}
            className="lg:col-span-5 flex flex-col gap-10"
          >
            {/* Quick Facts */}
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 pb-2 border-b border-white/10">
                Quick Facts
              </h3>
              <div className="space-y-4">
                {quickFacts.map((fact, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <fact.icon size={16} className="text-white/30 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/50 leading-relaxed">{fact.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 pb-2 border-b border-white/10">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {personal.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-xs text-white/50 border border-white/10 px-4 py-2 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Codeforces Card */}
            {personal.codeforces && (
              <a 
                href={personal.codeforces} 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-white/10 rounded-2xl p-6 bg-white/[0.02] group hover:border-white/20 transition-colors"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Competitive Programming</div>
                <div className="text-3xl font-black text-white tracking-tight mb-1">1720</div>
                <div className="text-sm text-white/40">Codeforces Rating • hackerman15</div>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
