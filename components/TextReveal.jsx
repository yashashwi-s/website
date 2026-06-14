"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function TextReveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  // If children is a string, split into words
  if (typeof children === "string") {
    const words = children.split(" ");
    
    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: delay * i },
      }),
    };

    const child = {
      hidden: {
        y: "110%",
      },
      visible: {
        y: "0%",
        transition: {
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1], // Custom expo-out ease
        },
      },
    };

    return (
      <motion.span
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={`flex flex-wrap ${className}`}
      >
        {words.map((word, index) => (
          <span key={index} className="overflow-hidden inline-block pr-[0.3em] pb-[0.2em] -mb-[0.2em]">
            <motion.span variants={child} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    );
  }

  // Fallback for non-string children
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
