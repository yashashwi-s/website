"use client";

import { useRef } from "react";
import { experience } from "@/data/experience";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

function ExperienceCard({ exp, i, progress, total }) {
  // Calculate dynamic range for scaling
  // Card i reaches top at progress = i / total
  const startScale = i / total;
  // It finishes scaling down at progress = 1
  const endScale = 1;
  const targetScale = 1 - ((total - i) * 0.04);
  
  // Safe range to avoid Framer Motion errors with identical values
  const range = startScale >= endScale ? [0.99, 1] : [startScale, endScale];
  const scale = useTransform(progress, range, [1, targetScale]);
  
  // Opacity fades out slightly as it gets pushed back
  const opacity = useTransform(progress, range, [1, 0.5]);

  return (
    <div className="h-screen w-full flex items-center justify-center sticky top-0 px-6 md:px-20 md:pl-40 pt-[5vh]">
      <motion.div 
        style={{ 
          scale: i === total - 1 ? 1 : scale,
          opacity: i === total - 1 ? 1 : opacity,
          top: `calc(${i * 20}px)` 
        }} 
        className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[30px] md:rounded-[40px] p-8 md:p-14 shadow-2xl flex flex-col origin-top overflow-hidden"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-white/[0.03] blur-[100px] md:blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-12 border-b border-white/5 pb-8">
            <div>
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4 border border-white/10 px-3 py-1 rounded-full">
                {exp.type === "work" ? "Work" : "Research"}
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                {exp.role}
              </h3>
              <div className="text-xl md:text-2xl text-white/60 font-medium tracking-tight">
                {exp.company}
              </div>
            </div>
            
            <div className="text-left md:text-right flex flex-row md:flex-col gap-4 md:gap-1">
              <div className="font-mono text-sm uppercase tracking-widest text-white/40">{exp.period}</div>
              <div className="font-mono text-xs uppercase tracking-widest text-white/30 hidden md:block">{exp.location}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-10 md:gap-16">
            <ul className="space-y-4 md:space-y-5">
              {exp.bullets.map((bullet, j) => (
                <li key={j} className="text-base md:text-lg text-white/50 leading-relaxed flex items-start gap-4">
                  <span className="text-white/20 mt-1.5 shrink-0 text-sm">✦</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-6 pt-4 md:pt-0">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">Technologies</div>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[11px] uppercase tracking-wider text-white/50 bg-white/5 border border-white/5 px-3 py-1.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ExperienceSection() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} id="experience" className="relative bg-[#050505]">
      {/* Sticky Vertical Sidebar Title */}
      <div className="sticky top-0 h-screen w-full pointer-events-none z-0 overflow-hidden">
        <ScrollReveal>
          <h2 className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-[40%] md:-translate-x-[25%] -rotate-90 text-[20vh] md:text-[30vh] font-black text-white/5 uppercase tracking-tighter whitespace-nowrap">
            Experience
          </h2>
        </ScrollReveal>
      </div>

      {/* Cards Container */}
      <div className="-mt-[100vh] relative z-10">
        {experience.map((exp, i) => (
          <ExperienceCard 
            key={i} 
            exp={exp} 
            i={i} 
            progress={scrollYProgress} 
            total={experience.length} 
          />
        ))}
      </div>
    </section>
  );
}
