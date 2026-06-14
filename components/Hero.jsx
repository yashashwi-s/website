"use client";

import { personal } from "@/data/personal";
import { ArrowDown } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Magnetic from "@/components/Magnetic";
import TextReveal from "@/components/TextReveal";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.8]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const Wrapper = prefersReducedMotion ? "div" : motion.div;
  const ItemWrapper = prefersReducedMotion ? "div" : motion.div;

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-6 max-w-5xl mx-auto relative overflow-hidden"
    >
      {/* Decorative SVG Squiggles */}
      <div className="absolute top-[20%] right-[10%] opacity-40 pointer-events-none hidden md:block">
        <svg width="120" height="120" viewBox="0 0 100 100" className="text-[var(--chalk-pink)]">
          <path d="M10,50 Q30,10 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M75,35 L90,50 L75,65" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      
      <div className="absolute bottom-[20%] left-[5%] opacity-40 pointer-events-none hidden md:block">
        <svg width="80" height="80" viewBox="0 0 100 100" className="text-[var(--chalk-yellow)]">
          <path d="M50,10 L60,40 L90,50 L60,60 L50,90 L40,60 L10,50 L40,40 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>

      <Wrapper
        {...(!prefersReducedMotion ? { variants: container, initial: "hidden", animate: "show", style: { y, opacity, scale } } : {})}
        className="relative z-10"
      >
        <ItemWrapper {...(!prefersReducedMotion ? { variants: item } : {})}>
          <div className="inline-block mb-4 relative">
            <p className="font-hand text-2xl text-[var(--chalk-cyan)] rotate-[-2deg]">
              hey, i'm
            </p>
            {/* Underline doodle */}
            <svg className="absolute -bottom-2 left-0 w-full text-[var(--chalk-cyan)]" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M5,10 Q50,20 95,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </ItemWrapper>

        <ItemWrapper {...(!prefersReducedMotion ? { variants: item } : {})}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 relative z-10 uppercase">
            <TextReveal delay={2.5}>{personal.name.split(" ")[0]}</TextReveal>
            <br className="md:hidden" />
            <span className="text-white/50 block mt-2">
              <TextReveal delay={2.7}>{personal.name.split(" ")[1]}</TextReveal>
            </span>
          </h1>
        </ItemWrapper>

        <ItemWrapper {...(!prefersReducedMotion ? { variants: item } : {})}>
          <p className="text-xl md:text-2xl font-hand text-[var(--chalk-pink)] max-w-2xl mb-10 leading-relaxed rotate-[1deg]">
            <TextReveal delay={3.1}>{`"${personal.tagline}"`}</TextReveal>
          </p>
        </ItemWrapper>

        <ItemWrapper {...(!prefersReducedMotion ? { variants: item } : {})}>
          <div className="flex flex-wrap items-center gap-6">
            <Magnetic>
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <GithubIcon size={20} />
                GitHub
                {/* Highlight doodle behind button */}
                <div className="absolute inset-0 bg-[var(--chalk-yellow)] rounded-xl -z-10 translate-y-1.5 translate-x-1.5 opacity-50 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
              </a>
            </Magnetic>
            
            <Magnetic>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/20 text-white font-bold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                See my work
                <ArrowDown size={18} className="animate-bounce" />
              </a>
            </Magnetic>
          </div>
        </ItemWrapper>
      </Wrapper>
    </section>
  );
}
