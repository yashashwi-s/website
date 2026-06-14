"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const starRotate = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  return (
    <div className="fixed right-4 md:right-8 top-[20vh] bottom-[20vh] w-12 z-50 pointer-events-none hidden md:flex flex-col items-center">
      <div className="flex-1 w-[2px] bg-white/10 relative rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full bg-[var(--chalk-mint)] origin-top shadow-[0_0_10px_var(--chalk-mint)]"
          style={{ scaleY, height: "100%" }}
        />
      </div>
      
      {/* Little chalk star at the bottom that fills based on scroll */}
      <motion.div 
        className="mt-4 text-[var(--chalk-mint)]"
        style={{
          rotate: starRotate,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <motion.path 
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
            strokeLinejoin="round" 
            strokeLinecap="round"
            style={{
              pathLength: scaleY
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
