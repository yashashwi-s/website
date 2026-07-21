"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const hoveredEl = useRef(null);
  const hoverStateRef = useRef("default");
  const hasPositioned = useRef(false);

  // Use springs for ultra-smooth physical cursor movement
  const cursorX = useSpring(-100, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorY = useSpring(-100, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorWidth = useSpring(16, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorHeight = useSpring(16, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorRadius = useSpring(8, { damping: 25, stiffness: 300, mass: 0.5 });
  const textOpacity = useSpring(0, { damping: 25, stiffness: 300 });

  const updateCursorShape = useCallback((mx, my) => {
    const state = hoverStateRef.current;
    // First-ever positioning after mount should snap instantly instead of
    // spring-animating in from the seeded (-100, -100) off-screen origin.
    const firstMove = !hasPositioned.current;
    hasPositioned.current = true;
    const setX = firstMove ? cursorX.jump.bind(cursorX) : cursorX.set.bind(cursorX);
    const setY = firstMove ? cursorY.jump.bind(cursorY) : cursorY.set.bind(cursorY);
    const setW = firstMove ? cursorWidth.jump.bind(cursorWidth) : cursorWidth.set.bind(cursorWidth);
    const setH = firstMove ? cursorHeight.jump.bind(cursorHeight) : cursorHeight.set.bind(cursorHeight);
    const setR = firstMove ? cursorRadius.jump.bind(cursorRadius) : cursorRadius.set.bind(cursorRadius);

    if (state === "snap" && hoveredEl.current) {
      const rect = hoveredEl.current.getBoundingClientRect();
      const style = window.getComputedStyle(hoveredEl.current);
      let radius = parseFloat(style.borderTopLeftRadius) || 0;

      if (hoveredEl.current.classList.contains("rounded-full")) {
        radius = rect.height / 2;
      }

      if (rect.height < 35 && radius === 0) {
        setX(rect.left);
        setY(rect.bottom - 2);
        setW(rect.width);
        setH(2);
        setR(0);
      } else {
        setX(rect.left);
        setY(rect.top);
        setW(rect.width);
        setH(rect.height);
        setR(radius);
      }
    } else {
      let w = 16, h = 16, r = 8, ox = -8, oy = -8;
      if (state === "project") { w = 180; h = 180; r = 90; ox = -90; oy = -90; }
      else if (state === "text") { w = 4; h = 32; r = 2; ox = -2; oy = -16; }

      setX(mx + ox);
      setY(my + oy);
      setW(w);
      setH(h);
      setR(r);
    }

    textOpacity.set(state === "project" ? 1 : 0);
  }, [cursorX, cursorY, cursorWidth, cursorHeight, cursorRadius, textOpacity]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lastMx = -100, lastMy = -100;

    const handleMouseMove = (e) => {
      lastMx = e.clientX;
      lastMy = e.clientY;
      updateCursorShape(lastMx, lastMy);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const link = target.closest("a, button");
      
      if (target.closest(".project-card")) {
        hoverStateRef.current = "project";
        hoveredEl.current = null;
      } else if (link) {
        hoverStateRef.current = "snap";
        hoveredEl.current = link;
      } else if (["p", "h1", "h2", "h3"].includes(target.tagName.toLowerCase())) {
        hoverStateRef.current = "text";
        hoveredEl.current = null;
      } else {
        hoverStateRef.current = "default";
        hoveredEl.current = null;
      }
      updateCursorShape(lastMx, lastMy);
    };

    const handleScroll = () => {
      if (hoverStateRef.current === "snap" && hoveredEl.current) {
        updateCursorShape(lastMx, lastMy);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateCursorShape]);

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
        style={{ opacity: textOpacity }}
      >
        VIEW
      </motion.span>
    </motion.div>
  );
}
