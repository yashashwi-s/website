"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { projects } from "@/data/projects";
import WebGLDistortion from "./WebGLDistortion";
import { GithubIcon } from "./icons/GithubIcon";
import { ExternalLink } from "lucide-react";

export default function HorizontalGallery() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]); // Adjust based on number of items
  const imageX = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  // Sort projects like before
  const sortedProjects = [...projects].sort((a, b) => (a.order || 99) - (b.order || 99)).slice(0, 5); // Take top 5 for gallery

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#050505]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden pl-6 md:pl-20">
        <motion.div style={{ x }} className="flex gap-20 items-center h-full">
          {/* Title Slide */}
          <div className="w-[80vw] md:w-[40vw] flex-shrink-0">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white">
              Selected <br /> Works
            </h2>
            <div className="h-1 w-24 bg-white mt-8" />
          </div>

          {/* Project Slides */}
          {sortedProjects.map((project, idx) => (
            <div key={idx} className="w-[85vw] md:w-[60vw] h-[70vh] flex-shrink-0 flex flex-col justify-center group">
              <div className="w-full h-[60%] md:h-[70%] relative overflow-hidden mb-6 bg-[#111] group-hover:bg-[#222] transition-colors border border-white/10">
                <motion.div style={{ x: imageX, scale: 1.2 }} className="w-full h-full">
                  <WebGLDistortion 
                    imageUrl={`https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop`} // using placeholder texture since real projects lack images
                    isHovered={false} // hover handled inside WebGL component usually
                  />
                </motion.div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm text-white/50 font-mono mb-2">0{idx + 1} // {project.type}</div>
                  <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">{project.title}</h3>
                </div>
                <div className="flex gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                      <GithubIcon size={24} />
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                      <ExternalLink size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* End spacer */}
          <div className="w-[20vw] flex-shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}
