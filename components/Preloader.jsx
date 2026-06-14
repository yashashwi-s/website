"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";

    const duration = 2000; // 2 seconds
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
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
          {/* Expanding Circle Exit (Shrinking mask) */}
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
            <div className="relative overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[12vw] md:text-[8vw] font-black leading-none text-white tracking-tighter mix-blend-difference"
              >
                {progress}%
              </motion.div>
            </div>
            
            <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 overflow-hidden">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-mono text-xs md:text-sm text-white/50 uppercase tracking-widest"
              >
                INITIALIZING CORE...
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
