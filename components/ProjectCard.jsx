"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useSpring, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  
  // Mobile auto-hover when in center of screen
  const isInView = useInView(containerRef, { margin: "-40% 0px -40% 0px" });
  
  // Apply mobile hover state
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsHovered(isInView);
    }
  }, [isInView]);
  
  // Mouse position for floating image
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(0, springConfig);
  const smoothY = useSpring(0, springConfig);

  useEffect(() => {
    smoothX.set(mousePos.x);
    smoothY.set(mousePos.y);
  }, [mousePos.x, mousePos.y, smoothX, smoothY]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Calculate center of image relative to mouse
    setMousePos({
      x: e.clientX - rect.left - 150, // 150 is half image width
      y: e.clientY - rect.top - 100,  // 100 is half image height
    });
  };

  return (
    <div 
      ref={containerRef}
      className="project-card relative w-full border-t border-white/10 last:border-b py-8 md:py-12 group cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <a 
        href={project.live || project.github} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-between w-full relative z-10"
      >
        <div className="flex items-baseline gap-4 md:gap-8 overflow-hidden">
          <span className="text-[var(--color-text-muted)] font-mono text-sm md:text-lg transition-transform duration-500 group-hover:-translate-y-2">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-4xl md:text-7xl lg:text-8xl font-black text-white group-hover:translate-x-4 transition-transform duration-500 ease-out chalk-text mix-blend-difference">
            {project.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 group-hover:-translate-x-4 transition-all duration-500 ease-out">
          <span className="hidden md:block font-hand text-xl text-[var(--color-text-muted)]">
            {project.tags.slice(0, 2).join(", ")}
          </span>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowUpRight size={24} className="text-white group-hover:rotate-45 transition-transform duration-500" />
          </div>
        </div>
      </a>

      {/* Floating Image Preview */}
      <motion.div
        className="absolute top-0 left-0 w-[300px] h-[200px] rounded-2xl overflow-hidden pointer-events-none hidden md:flex items-center justify-center shadow-2xl"
        style={{
          x: smoothX,
          y: smoothY,
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
          background: `linear-gradient(135deg, ${project.color} 0%, #1e2024 100%)`,
          zIndex: 5
        }}
        transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.3 } }}
      >
        <span className="text-8xl mix-blend-overlay opacity-50 select-none">{project.emoji}</span>
      </motion.div>
    </div>
  );
}
