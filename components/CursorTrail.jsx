"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles = [];
    let animationFrameId;
    let mouse = { x: -1000, y: -1000 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = ["#ff9ff3", "#feca57", "#48dbfb", "#1dd1a1"];

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        // Float upwards and drift slowly
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = Math.random() * -2 - 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size += 0.1; // expand as it fades like smoke
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.life * 0.5); // Max 50% opacity
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    const handlePointerMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Spawn particles
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.x + (Math.random()-0.5)*10, mouse.y + (Math.random()-0.5)*10));
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      
      particles = particles.filter(p => p.life > 0);
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
