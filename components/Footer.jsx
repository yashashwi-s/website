"use client";

import { personal } from "@/data/personal";

export default function Footer() {
  return (
    <div 
      className="relative h-[80vh] bg-black"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed bottom-0 h-[80vh] w-full flex flex-col justify-end pb-12 px-6 md:px-20 z-0">
        <h2 className="text-[15vw] leading-none font-black text-white tracking-tighter uppercase mb-10">
          Let's Talk
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-t border-white/20 pt-10">
          <a href={`mailto:${personal.email}`} className="text-2xl md:text-4xl text-white/50 hover:text-white transition-colors">
            {personal.email}
          </a>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex gap-8">
              <a href={personal.github} target="_blank" rel="noreferrer" className="text-lg uppercase text-white hover:text-white/50">Github</a>
              <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-lg uppercase text-white hover:text-white/50">LinkedIn</a>
            </div>
            <p className="text-white/30 text-sm mt-4 md:mt-0">© {new Date().getFullYear()} {personal.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
