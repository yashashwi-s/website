"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [hoverState, setHoverState] = useState("default"); // default, pointer, project, text

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest(".project-card")) {
        setHoverState("project");
      } else if (target.closest("a") || target.closest("button")) {
        setHoverState("pointer");
      } else if (target.tagName.toLowerCase() === "p" || target.tagName.toLowerCase() === "h1" || target.tagName.toLowerCase() === "h2" || target.tagName.toLowerCase() === "h3") {
        setHoverState("text");
      } else {
        setHoverState("default");
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const variants = {
    default: { width: 16, height: 16, x: -8, y: -8, borderRadius: "50%", opacity: 1 },
    pointer: { width: 48, height: 48, x: -24, y: -24, borderRadius: "50%", opacity: 0.5 },
    project: { width: 120, height: 120, x: -60, y: -60, borderRadius: "50%", opacity: 1 },
    text: { width: 4, height: 32, x: -2, y: -16, borderRadius: "2px", opacity: 0.8 },
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 bg-white pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center overflow-hidden"
        animate={{
          x: mousePosition.x + variants[hoverState].x,
          y: mousePosition.y + variants[hoverState].y,
          width: variants[hoverState].width,
          height: variants[hoverState].height,
          borderRadius: variants[hoverState].borderRadius,
          opacity: variants[hoverState].opacity,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
      >
        <motion.span 
          className="text-black font-black text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: hoverState === "project" ? 1 : 0 }}
        >
          VIEW
        </motion.span>
      </motion.div>
    </>
  );
}
