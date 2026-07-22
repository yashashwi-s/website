"use client";

import { useRef } from "react";
import { experience } from "@/data/experience";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

function ExperienceCard({ exp, i, progress, total }) {
  const startScale = i / total;
  const endScale = 1;
  const targetScale = 1 - ((total - i) * 0.04);
  
  const range = startScale >= endScale ? [0.99, 1] : [startScale, endScale];
  const scale = useTransform(progress, range, [1, targetScale]);
  const opacity = useTransform(progress, range, [1, 0.5]);

  // The last card never shrinks/dims (nothing stacks on top of it), but it still
  // releases from `sticky` at the very end of the section — without its own fade,
  // it stays at full opacity while scrolling away, overlapping visually with About
  // already entering from below. Fade it out over the section's final stretch instead.
  const isLast = i === total - 1;
  const exitOpacity = useTransform(progress, [0.8, 1], [1, 0]);

  return (
    <div className="h-[100svh] w-full flex items-center justify-center sticky top-0 px-6 md:pr-12 md:pl-64 pt-[5vh] pb-[5vh]">
      <motion.div
        style={{
          scale: isLast ? 1 : scale,
          opacity: isLast ? exitOpacity : opacity,
        }}
        className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[30px] md:rounded-[40px] p-6 md:p-14 shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex flex-col origin-top overflow-hidden max-h-full group"
      >
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white/[0.03] blur-[80px] md:blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3 group-hover:bg-white/[0.06] transition-all duration-700" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12 border-b border-white/5 pb-6 md:pb-8">
            <div>
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 border border-white/10 px-3 py-1 rounded-full">
                {exp.type === "work" ? "Work" : "Research"}
              </span>
              <h3 className="text-2xl md:text-5xl font-black text-white tracking-tight mb-2">
                {exp.role}
              </h3>
              <div className="text-lg md:text-2xl text-white/60 font-medium tracking-tight">
                {exp.company}
              </div>
            </div>
            
            <div className="text-left md:text-right flex flex-row md:flex-col gap-4 md:gap-1">
              <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-white/40">{exp.period}</div>
              <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/30 hidden md:block">{exp.location}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8 md:gap-16">
            <ul className="space-y-3 md:space-y-5">
              {exp.bullets.map((bullet, j) => (
                <li key={j} className="text-sm md:text-lg text-white/60 leading-relaxed flex items-start gap-4">
                  <span className="text-white/20 mt-1 shrink-0 text-xs md:text-sm">✦</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-6 pt-2 md:pt-0">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 md:mb-4">Technologies</div>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[10px] md:text-[11px] uppercase tracking-wider text-white/50 bg-white/5 border border-white/5 px-2 md:px-3 py-1.5 rounded-md">
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

  // Matches the last card's exit fade so the title clears out in step with it
  // instead of lingering at full opacity while About enters from below.
  const titleExitOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <section ref={containerRef} id="experience" className="relative bg-[#050505]">
      {/* Sticky Vertical Sidebar Title */}
      <div className="sticky top-0 h-[100svh] w-full pointer-events-none z-0 overflow-hidden">
        <motion.div style={{ opacity: titleExitOpacity }}>
          <ScrollReveal>
            <div className="hidden md:flex absolute top-0 bottom-0 left-4 xl:left-12 items-center justify-center">
              <h2
                className="text-[8vh] xl:text-[12vh] font-black text-white/10 uppercase tracking-tighter whitespace-nowrap"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                Experience
              </h2>
            </div>
            <h2 className="md:hidden absolute top-20 left-6 text-5xl font-black text-white/10 uppercase tracking-tighter whitespace-nowrap">
              Experience
            </h2>
          </ScrollReveal>
        </motion.div>
      </div>

      {/* Cards Container */}
      <div className="-mt-[100svh] relative z-10">
        {experience.map((exp, i) => (
          <ExperienceCard
            key={i}
            exp={exp}
            i={i}
            progress={scrollYProgress}
            total={experience.length}
          />
        ))}
        {/* Without this, the last card's sticky "budget" within this shared container hits 0 and it never dwells pinned before releasing. */}
        <div className="h-[100svh]" aria-hidden="true" />
      </div>
    </section>
  );
}
