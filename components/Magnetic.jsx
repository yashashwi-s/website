"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Magnetic({ children, className = "" }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    const distance = Math.sqrt(middleX * middleX + middleY * middleY);
    const maxPull = 50;

    // Apply a subtle pull towards the mouse, with rotation and scale stretch
    setPosition({ 
      x: middleX * 0.3, 
      y: middleY * 0.3,
      rotateX: -(middleY * 0.1),
      rotateY: (middleX * 0.1),
      scale: 1 + (Math.min(distance, maxPull) * 0.002) // Stretch slightly
    });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 });
  };

  const { x, y, rotateX, rotateY, scale } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y, rotateX, rotateY, scale }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
