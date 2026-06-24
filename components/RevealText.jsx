"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function RevealText({ text, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  // Split text into words, but keep spaces as distinct elements so they don't collapse
  const words = text.split(" ").map(word => word + " ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay * i },
    }),
  };

  const child = {
    hidden: {
      y: "120%",
      rotateZ: 5,
      opacity: 0,
    },
    visible: {
      y: "0%",
      rotateZ: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {words.map((word, index) => (
        <span key={index} style={{ overflow: "hidden", display: "inline-block", paddingRight: "0.15em", paddingBottom: "0.1em", marginRight: "-0.15em" }}>
          <motion.span style={{ display: "inline-block", transformOrigin: "left bottom", paddingRight: "0.05em" }} variants={child}>
            {word === " " ? "\u00A0" : word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
