"use client";

import { useRef } from "react";
import { experience } from "@/data/experience";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

export default function ExperienceSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} id="experience" className="relative py-32 md:py-48 px-6 md:px-20 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-5xl md:text-[8vw] leading-none font-black text-white/10 mb-20 uppercase tracking-tighter">
            Experience
          </h2>
        </ScrollReveal>

        <div className="relative">
          {/* Animated Timeline Line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-[1px] bg-white/10">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-white/40 origin-top"
            />
          </div>

          <div className="flex flex-col gap-20 md:gap-28">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: i * 0.1 }}
                className="relative pl-8 md:pl-24"
              >
                {/* Timeline Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 300 }}
                  className="absolute left-0 md:left-8 top-2 w-3 h-3 rounded-full bg-white -translate-x-[5px]"
                />

                {/* Type Badge */}
                <span className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4 border border-white/10 px-3 py-1 rounded-full">
                  {exp.type === "work" ? "Work" : "Research"}
                </span>

                {/* Header */}
                <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-1">
                  {exp.role}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6">
                  <span className="text-lg md:text-xl text-white/60 font-medium">{exp.company}</span>
                  <span className="text-white/20">•</span>
                  <span className="font-mono text-sm text-white/40">{exp.period}</span>
                  <span className="text-white/20">•</span>
                  <span className="font-mono text-sm text-white/30">{exp.location}</span>
                </div>

                {/* Bullets */}
                <ul className="space-y-3 mb-6">
                  {exp.bullets.map((bullet, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.08 + 0.3, duration: 0.5 }}
                      className="text-base md:text-lg text-white/50 leading-relaxed flex gap-3"
                    >
                      <span className="text-white/20 mt-1 shrink-0">→</span>
                      <span>{bullet}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs text-white/30 border border-white/10 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
