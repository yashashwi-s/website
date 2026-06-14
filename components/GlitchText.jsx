"use client";

import { useState } from "react";

export default function GlitchText({ children, className = "" }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Text */}
      <span className="relative z-10">{children}</span>

      {/* Red Glitch Channel */}
      <span 
        className={`absolute top-0 left-0 z-0 text-red-500 mix-blend-screen transition-transform duration-75 ${
          isHovered ? "translate-x-1 -translate-y-[1px] opacity-70" : "translate-x-0 translate-y-0 opacity-0"
        }`}
        aria-hidden="true"
      >
        {children}
      </span>

      {/* Blue Glitch Channel */}
      <span 
        className={`absolute top-0 left-0 z-0 text-blue-500 mix-blend-screen transition-transform duration-75 ${
          isHovered ? "-translate-x-1 translate-y-[2px] opacity-70" : "translate-x-0 translate-y-0 opacity-0"
        }`}
        aria-hidden="true"
      >
        {children}
      </span>
      
      {/* Green Glitch Channel */}
      <span 
        className={`absolute top-0 left-0 z-0 text-green-500 mix-blend-screen transition-transform duration-100 ${
          isHovered ? "translate-x-[2px] translate-y-[-2px] opacity-70" : "translate-x-0 translate-y-0 opacity-0"
        }`}
        aria-hidden="true"
      >
        {children}
      </span>
    </div>
  );
}
