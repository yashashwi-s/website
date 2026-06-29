"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useVelocity, useSpring, useInView } from "framer-motion";
import { projects } from "@/data/projects";
import { GithubIcon } from "./icons/GithubIcon";
import { ExternalLink } from "lucide-react";

const DiagonalSlashImage = ({ project, imageX, skewVelocity }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div 
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{ skewX: skewVelocity }}
      className="w-full h-[70%] relative overflow-hidden mb-6 bg-[#111] border border-white/10 group"
    >
      <motion.div 
        style={{ x: imageX, scale: 1.1 }} 
        className="w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-100"
      >
        <img 
          src={project.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"} 
          alt={project.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
        />
      </motion.div>

      {/* Holographic Glare */}
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 400px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255,255,255,0.8), transparent 40%)`
        }}
      />


      
      {/* The Diagonal Slash Overlay */}
      <motion.div
         initial={{ x: "0%" }}
         animate={isInView ? { x: "150%" } : {}}
         transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
         className="absolute inset-[-50%] bg-[#050505] z-10 pointer-events-none"
         style={{ transformOrigin: "left", skewX: "-20deg" }}
      />
    </motion.div>
  );
};

export default function HorizontalGallery() {
  const targetRef = useRef(null);
  const { scrollYProgress, scrollY } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]); // Adjust based on number of items
  const imageX = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  // Kinetic Skew for Desktop
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const skewVelocity = useTransform(smoothVelocity, [-1000, 1000], [-5, 5]);

  // Mobile Drag constraints
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  // Sort projects like before
  const sortedProjects = [...projects].sort((a, b) => (a.order || 99) - (b.order || 99)).slice(0, 5); // Take top 5 for gallery

  return (
    <section id="projects" ref={targetRef} className="relative md:h-[400vh] bg-[#050505]">
      {/* Desktop Horizontal View */}
      <div className="hidden md:flex sticky top-0 h-screen items-center overflow-hidden pl-20">
        <motion.div style={{ x }} className="flex gap-20 items-center h-full">
          <div className="w-[40vw] flex-shrink-0">
            <h2 className="text-8xl font-black uppercase tracking-tighter text-white">
              Selected <br /> Works
            </h2>
            <div className="h-1 w-24 bg-white mt-8" />
          </div>

          {sortedProjects.map((project, idx) => (
            <div key={idx} className="w-[60vw] h-[70vh] flex-shrink-0 flex flex-col justify-center group">
              <DiagonalSlashImage project={project} imageX={imageX} skewVelocity={skewVelocity} />
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm text-white/50 font-mono mb-2">0{idx + 1} // {project.type}</div>
                  <h3 className="text-5xl font-black text-white uppercase tracking-tighter">{project.title}</h3>
                </div>
                <div className="flex gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/20 rounded-full hover:border-white hover:bg-white/10 transition-all">
                      <GithubIcon size={24} />
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/20 rounded-full hover:border-white hover:bg-white/10 transition-all">
                      <ExternalLink size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="w-[20vw] flex-shrink-0" />
        </motion.div>
      </div>

      {/* Mobile Drag Carousel View */}
      <div className="md:hidden flex flex-col py-20 overflow-hidden" ref={carouselRef}>
        <div className="px-6 mb-10">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white">
            Selected <br /> Works
          </h2>
          <div className="h-1 w-16 bg-white mt-6" />
        </div>

        <motion.div 
          drag="x" 
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-6 px-6 cursor-grab active:cursor-grabbing"
        >
          {sortedProjects.map((project, idx) => (
            <div key={idx} className="flex flex-col group min-w-[85vw]">
              <div className="w-full h-[50vh] relative overflow-hidden mb-4 bg-[#111] border border-white/10 rounded-xl pointer-events-none">
                <img 
                  src={project.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-xs text-white/50 font-mono mb-1">0{idx + 1} // {project.type}</div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{project.title}</h3>
                </div>
                <div className="flex gap-3">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/20 rounded-full bg-white/5 hover:border-white hover:bg-white/10 transition-all">
                      <GithubIcon size={20} />
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/20 rounded-full bg-white/5 hover:border-white hover:bg-white/10 transition-all">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
