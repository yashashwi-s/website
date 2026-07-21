"use client";

import { useEffect, useState } from "react";
import { personal } from "@/data/personal";
import { ArrowDown } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { motion, useScroll, useTransform, useSpring, useVelocity, useMotionValue, useReducedMotion } from "framer-motion";
import Magnetic from "@/components/Magnetic";
import RevealText from "@/components/RevealText";
import ScrambleText from "@/components/ScrambleText";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  // Kinetic typography distortion — skipped under reduced motion below since
  // scroll-velocity-driven skew is the more disorienting of the hero's effects.
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const rawSkewY = useTransform(smoothVelocity, [-1000, 0, 1000], [-5, 0, 5]);
  const rawScaleY = useTransform(smoothVelocity, [-1000, 0, 1000], [1.2, 1, 1.2]);

  // Use MotionValues directly to avoid re-renders on every mousemove
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const smoothMouseX = useSpring(rawMouseX, { damping: 50, stiffness: 300, mass: 0.5 });
  const smoothMouseY = useSpring(rawMouseY, { damping: 50, stiffness: 300, mass: 0.5 });

  // The entrance choreography (label → name → tagline) starts once the
  // preloader actually finishes — via the `preloader-finished` event it
  // dispatches — rather than a hardcoded guess at its duration. That keeps
  // the two in sync even when the preloader shortens or skips itself
  // (reduced motion, repeat visits within the session).
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setIntroReady(true);
      return;
    }
    const onFinished = () => setIntroReady(true);
    window.addEventListener("preloader-finished", onFinished);
    // Safety net: if the event is ever missed, don't leave the hero blank.
    const fallback = setTimeout(() => setIntroReady(true), 3000);
    return () => {
      window.removeEventListener("preloader-finished", onFinished);
      clearTimeout(fallback);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      rawMouseX.set(e.clientX);
      rawMouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawMouseX, rawMouseY]);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-6 md:px-20 relative overflow-hidden"
    >
      {/* Interactive Mesh Gradient Orb — no re-renders, pure MotionValue */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] rounded-full mix-blend-screen pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full"
      >
        <div className="mb-6 overflow-hidden">
          {introReady && (
            <motion.p
              initial={shouldReduceMotion ? false : { y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: [0.76, 0, 0.24, 1] }}
              className="font-mono text-sm md:text-lg text-white/50 uppercase tracking-widest"
            >
              Creative Developer
            </motion.p>
          )}
        </div>

        <motion.h1
          style={{
            skewY: shouldReduceMotion ? 0 : rawSkewY,
            scaleY: shouldReduceMotion ? 1 : rawScaleY,
            transformOrigin: "bottom",
          }}
          className="text-[11vw] sm:text-[12vw] leading-[0.85] font-black tracking-tighter text-white mb-8 uppercase origin-bottom"
        >
          {introReady && (
            <>
              {shouldReduceMotion ? (
                personal.name.split(" ")[0]
              ) : (
                <RevealText delay={0.2} text={personal.name.split(" ")[0]} />
              )}
              <span className="text-white/30 block ml-6 md:ml-[10vw]">
                {shouldReduceMotion ? (
                  personal.name.split(" ")[1]
                ) : (
                  <RevealText delay={0.4} text={personal.name.split(" ")[1]} />
                )}
              </span>
            </>
          )}
        </motion.h1>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mt-20">
          <div className="max-w-xl">
            {introReady && (
              shouldReduceMotion ? (
                <p className="text-xl md:text-3xl text-white/70 leading-tight font-medium tracking-tight">
                  {personal.tagline}
                </p>
              ) : (
                <RevealText
                  delay={0.6}
                  className="text-xl md:text-3xl text-white/70 leading-tight font-medium tracking-tight"
                  text={personal.tagline}
                />
              )
            )}
          </div>

          <div className="flex gap-6">
            <Magnetic>
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 p-6 rounded-full border border-white/20 text-white hover:border-white hover:bg-white/10 transition-all duration-500"
              >
                <GithubIcon size={24} />
              </a>
            </Magnetic>
            
            <Magnetic>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-8 py-6 rounded-full border border-white/20 text-white font-bold hover:border-white hover:bg-white/10 transition-all duration-500 uppercase tracking-widest text-sm group"
              >
                <ScrambleText text="Explore" />
                <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform duration-300" />
              </a>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
