"use client";

import { achievements, campusInvolvement } from "@/data/achievements";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";

function AchievementRow({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="relative group border-b border-white/10"
    >
      <a
        href={item.link || "#"}
        target={item.link ? "_blank" : undefined}
        className={`block relative py-12 px-4 md:px-8 overflow-hidden ${!item.link ? "cursor-default" : ""}`}
      >
        {/* Sweep background */}
        <div className="absolute inset-0 bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[0.22,1,0.36,1] z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-16">
            <span className="font-black text-5xl md:text-7xl text-white group-hover:text-[#050505] transition-colors duration-500 transform group-hover:translate-x-4 md:w-80 shrink-0">
              {item.stat}
            </span>
            <span className="text-2xl md:text-4xl text-white/70 group-hover:text-[#050505]/90 font-medium transition-colors duration-500">
              {item.label}
            </span>
          </div>
          
          {item.detail && (
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest text-white/40 group-hover:text-[#050505]/60 transition-colors duration-500 lg:text-right max-w-xs">
              {item.detail}
            </span>
          )}
        </div>
      </a>
    </motion.div>
  );
}

export default function AchievementsSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleX = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={sectionRef} id="achievements" className="relative py-32 md:py-48 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        
        {/* Scrolling title */}
        <motion.div style={{ x: titleX }} className="mb-32">
          <ScrollReveal>
            <h2 className="text-6xl md:text-[10vw] leading-none font-black text-white/5 uppercase tracking-tighter whitespace-nowrap">
              Milestones
            </h2>
          </ScrollReveal>
        </motion.div>

        {/* Achievement Lists */}
        <div className="space-y-32">
          {achievements.map((group, gi) => (
            <div key={group.category}>
              <ScrollReveal>
                <div className="flex items-center gap-6 mb-8 px-4 md:px-8">
                  <h3 className="font-mono text-sm uppercase tracking-[0.3em] text-white/50">
                    {group.category}
                  </h3>
                  <div className="flex-1 h-[1px] bg-white/10" />
                  <span className="font-mono text-white/20">0{gi + 1}</span>
                </div>
              </ScrollReveal>

              <div className="flex flex-col">
                <div className="border-t border-white/10" />
                {group.items.map((item, i) => (
                  <AchievementRow key={i} item={item} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Campus Involvement */}
        <div className="mt-40">
          <ScrollReveal>
            <div className="flex items-center gap-6 mb-16 px-4 md:px-8">
              <h3 className="font-mono text-sm uppercase tracking-[0.3em] text-white/50">
                Campus Leadership
              </h3>
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="font-mono text-white/20">0{achievements.length + 1}</span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campusInvolvement.map((org, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden border border-white/10 rounded-3xl p-10 md:p-14 group hover:border-white/30 transition-colors bg-gradient-to-br from-white/[0.02] to-transparent"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-24 h-24 rounded-full border border-white flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-white" />
                  </div>
                </div>

                <div className="relative z-10">
                  <h4 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">{org.org}</h4>
                  <div className="flex items-center gap-3 text-white/50 font-mono text-sm mb-10">
                    <span className="text-[var(--color-accent)]">{org.role}</span>
                    <span>//</span>
                    <span>{org.institution}</span>
                  </div>
                  
                  <ul className="space-y-5">
                    {org.highlights.map((h, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.1 + 0.2 }}
                        className="text-lg text-white/70 leading-relaxed flex items-start gap-4"
                      >
                        <span className="text-white/20 mt-1">{"->"}</span>
                        <span>{h}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
