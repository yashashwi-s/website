"use client";

import Link from "next/link";
import { motion, useMouseMove, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Magnetic from "@/components/Magnetic";
import CustomCursor from "@/components/CustomCursor";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const smoothMouseX = useSpring(mousePosition.x, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mousePosition.y, { damping: 50, stiffness: 400 });

  return (
    <>
      <CustomCursor />
      <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-white selection:text-black">
        
        {/* Interactive Ambient Glow */}
        <motion.div
          className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full mix-blend-screen pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(80px)",
            x: smoothMouseX,
            y: smoothMouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />

        {/* Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[25vw] md:text-[15vw] leading-none font-black tracking-tighter mix-blend-difference select-none pointer-events-none relative">
              <span className="relative z-10">404</span>
              <motion.span 
                animate={{ x: [-2, 2, -2], y: [-1, 1, -1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                className="absolute inset-0 text-white/30 mix-blend-difference pointer-events-none -ml-1 mt-1"
              >
                404
              </motion.span>
              <motion.span 
                animate={{ x: [2, -2, 2], y: [1, -1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
                className="absolute inset-0 text-white/20 mix-blend-difference pointer-events-none ml-2 -mt-1"
              >
                404
              </motion.span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 md:mt-2 space-y-4"
          >
            <h2 className="text-xl md:text-3xl font-bold uppercase tracking-widest text-white/80">
              Reality Disconnected
            </h2>
            <p className="font-mono text-sm tracking-widest text-white/40 max-w-sm mx-auto uppercase leading-loose">
              The sector you are looking for has been purged or never existed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 flex justify-center"
          >
            <Magnetic>
              <Link
                href="/"
                className="group relative inline-flex items-center gap-4 px-8 py-5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white text-white uppercase tracking-widest text-sm font-bold overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white transform translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-[0.22,1,0.36,1] z-0" />
                <span className="relative z-10 mix-blend-difference">Initialize Return</span>
                <span className="relative z-10 text-white/30 mix-blend-difference font-mono mt-0.5">{"//"}</span>
                <span className="relative z-10 mix-blend-difference group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300">
                  ↗
                </span>
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Scanlines Overlay */}
        <div 
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 50%)",
            backgroundSize: "100% 4px"
          }}
        />
      </div>
    </>
  );
}
