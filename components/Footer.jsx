"use client";

import { personal } from "@/data/personal";
import Magnetic from "@/components/Magnetic";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // The reveal itself is driven by the clip-path trick below (a fixed panel
  // uncovered as the in-flow wrapper scrolls up behind it), so the content's
  // own entrance is tied to that same scroll progress rather than a separate
  // whileInView — a plain whileInView on a position:fixed element is
  // unreliable here since the element sits within the viewport from mount.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
  const linksOpacity = useTransform(scrollYProgress, [0.15, 0.55], [0, 1]);
  const linksY = useTransform(scrollYProgress, [0.15, 0.55], [30, 0]);

  return (
    <div
      ref={containerRef}
      className="relative h-[80vh] bg-black"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed bottom-0 h-[80vh] w-full flex flex-col justify-end pb-12 px-6 md:px-20 z-0">
        <motion.h2
          className="text-[15vw] leading-none font-black text-white tracking-tighter uppercase mb-10"
          style={prefersReducedMotion ? undefined : { opacity: headingOpacity, y: headingY }}
        >
          Let's Talk
        </motion.h2>
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-t border-white/20 pt-10"
          style={prefersReducedMotion ? undefined : { opacity: linksOpacity, y: linksY }}
        >
          <a href={`mailto:${personal.email}`} className="text-2xl md:text-4xl text-white/50 hover:text-white transition-colors">
            {personal.email}
          </a>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex gap-8">
              <Magnetic>
                <a href={personal.github} target="_blank" rel="noreferrer" className="text-lg uppercase text-white/60 hover:text-white transition-colors">Github</a>
              </Magnetic>
              <Magnetic>
                <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-lg uppercase text-white/60 hover:text-white transition-colors">LinkedIn</a>
              </Magnetic>
            </div>
            <p className="text-white/30 text-sm mt-4 md:mt-0">© {new Date().getFullYear()} {personal.name}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
