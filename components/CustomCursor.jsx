"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [hoverState, setHoverState] = useState("default"); // default, pointer, project, text, snap
  const [snapRect, setSnapRect] = useState(null);
  
  // Use springs for ultra-smooth physical cursor movement
  const cursorX = useSpring(-100, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorY = useSpring(-100, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorWidth = useSpring(16, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorHeight = useSpring(16, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorRadius = useSpring(8, { damping: 25, stiffness: 300, mass: 0.5 });
  
  const hoveredEl = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const updateCursor = () => {
      if (hoverState === "snap" && hoveredEl.current) {
        const rect = hoveredEl.current.getBoundingClientRect();
        const style = window.getComputedStyle(hoveredEl.current);
        // Use borderTopLeftRadius as shorthand borderRadius can return empty strings
        let radius = parseFloat(style.borderTopLeftRadius) || 0;
        
        // Explicitly check for rounded-full class which is used on all pill buttons
        if (hoveredEl.current.classList.contains("rounded-full")) {
          radius = rect.height / 2;
        }
        
        // If it's a text-only link (height < 30 and no border radius), make it an underline
        if (rect.height < 35 && radius === 0) {
          cursorX.set(rect.left);
          cursorY.set(rect.bottom - 2); // 2px underline
          cursorWidth.set(rect.width);
          cursorHeight.set(2);
          cursorRadius.set(0);
        } else {
          // Snap perfectly to the button
          cursorX.set(rect.left);
          cursorY.set(rect.top);
          cursorWidth.set(rect.width);
          cursorHeight.set(rect.height);
          cursorRadius.set(radius);
        }
      } else {
        // Normal following
        let w = 16, h = 16, r = 8, ox = -8, oy = -8;
        if (hoverState === "project") { w = 180; h = 180; r = 90; ox = -90; oy = -90; }
        else if (hoverState === "text") { w = 4; h = 32; r = 2; ox = -2; oy = -16; }
        
        cursorX.set(mousePosition.x + ox);
        cursorY.set(mousePosition.y + oy);
        cursorWidth.set(w);
        cursorHeight.set(h);
        cursorRadius.set(r);
      }
    };

    updateCursor();
  }, [mousePosition, hoverState, cursorX, cursorY, cursorWidth, cursorHeight, cursorRadius]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const link = target.closest("a, button");
      
      if (target.closest(".project-card")) {
        setHoverState("project");
        hoveredEl.current = null;
      } else if (link) {
        setHoverState("snap");
        hoveredEl.current = link;
      } else if (target.tagName.toLowerCase() === "p" || target.tagName.toLowerCase() === "h1" || target.tagName.toLowerCase() === "h2" || target.tagName.toLowerCase() === "h3") {
        setHoverState("text");
        hoveredEl.current = null;
      } else {
        setHoverState("default");
        hoveredEl.current = null;
      }
    };

    const handleScroll = () => {
      // Re-trigger update on scroll so snapped elements stick to their position
      if (hoverState === "snap" && hoveredEl.current) {
        setMousePosition(prev => ({ ...prev }));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hoverState]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 bg-white pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center overflow-hidden"
      style={{
        x: cursorX,
        y: cursorY,
        width: cursorWidth,
        height: cursorHeight,
        borderRadius: cursorRadius,
      }}
    >
      <motion.span 
        className="text-black font-black text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: hoverState === "project" ? 1 : 0 }}
      >
        VIEW
      </motion.span>
    </motion.div>
  );
}
