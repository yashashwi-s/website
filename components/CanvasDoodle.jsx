"use client";

import { useEffect, useRef } from "react";

export default function CanvasDoodle() {
  const canvasRef = useRef(null);
  
  // Neon chalk colors
  const colors = ["#ff9ff3", "#feca57", "#48dbfb", "#1dd1a1"];
  let currentColorIndex = 0;

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Shake-to-erase logic
    let shakeCount = 0;
    let lastShakeTime = 0;
    let lastShakeDir = 0; // 1 for right, -1 for left

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const clearCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dispatch a custom event to optionally trigger particle explosions elsewhere
      window.dispatchEvent(new CustomEvent("chalk-erased", {
        detail: { x: lastX, y: lastY }
      }));
    };

    const draw = (x, y) => {
      if (!isDrawing) return;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = colors[currentColorIndex];
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      // Neon glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors[currentColorIndex];
      
      ctx.stroke();
      
      // Shake detection
      const dx = x - lastX;
      const now = Date.now();
      
      if (Math.abs(dx) > 15) { // Needs significant movement
        const currentDir = dx > 0 ? 1 : -1;
        if (currentDir !== lastShakeDir) {
          if (now - lastShakeTime < 200) { // Fast change of direction
            shakeCount++;
            if (shakeCount > 5) { // 5 back-and-forth motions
              clearCanvas();
              shakeCount = 0;
            }
          } else {
            shakeCount = 1; // Reset if too slow
          }
          lastShakeDir = currentDir;
          lastShakeTime = now;
        }
      }
      
      lastX = x;
      lastY = y;
    };

    const handlePointerDown = (e) => {
      isDrawing = true;
      lastX = e.clientX;
      lastY = e.clientY;
      // Pick a random color for this stroke
      currentColorIndex = Math.floor(Math.random() * colors.length);
    };

    const handlePointerMove = (e) => {
      if (isDrawing) {
        draw(e.clientX, e.clientY);
      }
    };

    const handlePointerUp = () => {
      isDrawing = false;
      shakeCount = 0; // Reset shake count when you let go
    };

    // Use global window events so they can draw everywhere
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerleave", handlePointerUp);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerleave", handlePointerUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] opacity-70"
    />
  );
}
