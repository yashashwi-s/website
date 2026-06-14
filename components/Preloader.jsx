"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";

    const duration = 1800; // 1.8 seconds
    const intervalTime = 20; // 50fps
    const steps = duration / intervalTime;
    let currentStep = 0;

    // Custom easing function for counter (easeOutExpo)
    const easeOutExpo = (x) => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const interval = setInterval(() => {
      currentStep++;
      const progressRatio = currentStep / steps;
      const currentProgress = Math.floor(easeOutExpo(progressRatio) * 100);
      
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "";
          // Dispatch event so Hero text can start animating
          window.dispatchEvent(new Event("preloader-finished"));
        }, 400); // Wait slightly at 100%
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
          {/* Solid Black Background that shrinks into a circle and disappears */}
          <motion.div
            initial={{ clipPath: "circle(150% at 50% 50%)" }}
            exit={{ clipPath: "circle(0% at 50% 50%)" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-[#050505]"
          />

          <motion.div
            key="preloader-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* The massive kinetic percentage */}
            <div className="relative overflow-hidden h-[15vw] flex items-center justify-center">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[15vw] md:text-[12vw] font-black leading-none text-white tracking-tighter mix-blend-difference tabular-nums"
              >
                {progress}%
              </motion.div>
            </div>
            
            {/* Minimalist progress bar */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/10 overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            
            <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 overflow-hidden">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-mono text-xs md:text-sm text-white/40 uppercase tracking-widest"
              >
                Simulating...
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
