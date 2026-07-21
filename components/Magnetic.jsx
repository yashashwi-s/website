"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_CONFIG = { type: "spring", stiffness: 350, damping: 15, mass: 0.5 };

export default function Magnetic({ children, className = "" }) {
  const ref = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawScale = useMotionValue(1);

  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);
  const rotateX = useSpring(rawRotateX, SPRING_CONFIG);
  const rotateY = useSpring(rawRotateY, SPRING_CONFIG);
  const scale = useSpring(rawScale, SPRING_CONFIG);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    const distance = Math.sqrt(middleX * middleX + middleY * middleY);
    const maxPull = 50;

    // Apply a subtle pull towards the mouse, with rotation and scale stretch
    rawX.set(middleX * 0.3);
    rawY.set(middleY * 0.3);
    rawRotateX.set(-(middleY * 0.1));
    rawRotateY.set(middleX * 0.1);
    rawScale.set(1 + Math.min(distance, maxPull) * 0.002); // Stretch slightly
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawScale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x, y, rotateX, rotateY, scale }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
