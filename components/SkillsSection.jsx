"use client";

import { useRef, useState } from "react";
import { skills } from "@/data/skills";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import Magnetic from "@/components/Magnetic";

function SkillCard({ group, index }) {
  const ref = useRef(null);
  
  // 3D Tilt Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40, mass: 0.5 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40, mass: 0.5 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  // Spotlight Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.08), transparent 40%)`;
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const currentMouseX = e.clientX - rect.left;
    const currentMouseY = e.clientY - rect.top;
    
    // Spotlight
    mouseX.set(currentMouseX);
    mouseY.set(currentMouseY);
    
    // Tilt
    const xPct = currentMouseX / rect.width - 0.5;
    const yPct = currentMouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl bg-[#0a0a0a] border border-white/5 p-8 md:p-10 group cursor-default"
    >
      {/* Spotlight Glow */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="absolute inset-0"
          style={{ background: spotlightBackground }}
        />
      </motion.div>

      {/* Content */}
      <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
          <h3 className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-white/50">
            {group.category}
          </h3>
          <span className="font-black text-2xl text-white/10 select-none">
            0{index + 1}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-4">
          {group.items.map((skill, i) => (
            <Magnetic key={skill}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.035 + index * 0.07 }}
                className="px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-white/5 bg-white/[0.03] text-white/70 font-medium text-sm md:text-base hover:bg-white hover:text-black hover:border-white transition-colors duration-300 select-none"
              >
                {skill}
              </motion.div>
            </Magnetic>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="relative py-32 md:py-48 px-6 md:px-20 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
            <h2 className="text-5xl md:text-[8vw] leading-none font-black text-white uppercase tracking-tighter mix-blend-difference">
              Capabilities
            </h2>
            <p className="text-white/40 font-mono text-sm tracking-widest uppercase pb-2 max-w-xs">
              Tools and technologies I use to build robust systems
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Box Grid */}
        <div style={{ perspective: "2000px" }} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {skills.map((group, i) => (
            <SkillCard key={group.category} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
