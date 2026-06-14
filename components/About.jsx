"use client";

import { useRef } from "react";
import { personal } from "@/data/personal";
import { Mail, FileText } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import Magnetic from "@/components/Magnetic";
import ScrambleText from "@/components/ScrambleText";
import { motion, useScroll, useTransform } from "framer-motion";

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="absolute opacity-20">{children}</span>
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

  // Links fade in at the very end
  const linksOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);
  const linksY = useTransform(scrollYProgress, [0.8, 0.95], [20, 0]);

  return (
    <section ref={containerRef} id="about" className="relative h-[300vh] bg-[#050505]">
      <div className="sticky top-0 h-screen flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto overflow-hidden">
        
        {/* Scroll Clue */}
        <motion.div style={{ opacity: visualClueOpacity }} className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 hidden md:flex">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 rotate-90 origin-center translate-y-10">Keep Scrolling</div>
          <div className="w-[1px] h-32 bg-white/10 relative overflow-hidden mt-16">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/3 bg-white"
              animate={{ y: ["0%", "300%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        <h2 className="text-5xl md:text-[8vw] leading-none font-black text-white/10 mb-12 uppercase tracking-tighter">
          About
        </h2>

        <div className="flex-1 max-w-4xl relative">
          <p className="text-2xl md:text-5xl leading-[1.3] md:leading-[1.4] font-medium tracking-tight flex flex-wrap gap-x-3 gap-y-2 md:gap-x-4 md:gap-y-3">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + (1 / words.length);
              // Adjust the range to end at 0.8 so links have time to fade in
              const range = [start * 0.8, end * 0.8];
              return <Word key={i} progress={scrollYProgress} range={range}>{word}</Word>
            })}
          </p>

          <motion.div 
            style={{ opacity: linksOpacity, y: linksY }} 
            className="flex flex-wrap items-center gap-6 mt-20"
          >
            {links.map((link) => (
              <Magnetic key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-5 rounded-full border border-white/20 text-white font-bold transition-colors duration-300 uppercase tracking-widest text-xs group"
                >
                  <link.icon size={16} />
                  <ScrambleText text={link.label} />
                </a>
              </Magnetic>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
