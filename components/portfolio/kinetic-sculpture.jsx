"use client";

import { useEffect, useRef } from "react";

// Geometry is cached. Drawing stops offscreen, in hidden tabs, or when paused.
export default function KineticSculpture({ paused = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;
    let frame = 0,
      width = 0,
      height = 0,
      lastTime = 0;
    let inView = false,
      visible = !document.hidden,
      angle = 0.4;
    let pointerX = 0,
      pointerY = 0,
      easedX = 0,
      easedY = 0;
    const curves = [];
    const tau = Math.PI * 2;
    function point(u, v) {
      const radius = 1.38 + 0.14 * Math.cos(3 * u);
      return [
        (radius + 0.63 * Math.cos(v)) * Math.cos(u),
        (radius + 0.63 * Math.cos(v)) * Math.sin(u),
        0.63 * Math.sin(v) + 0.16 * Math.sin(3 * u),
      ];
    }
    for (let i = 0; i < 56; i++) {
      const points = [];
      for (let j = 0; j <= 40; j++)
        points.push(point((i / 56) * tau, (j / 40) * tau));
      curves.push({ points, accent: i > 26 && i < 40 });
    }
    for (let i = 0; i < 12; i++) {
      const points = [];
      for (let j = 0; j <= 80; j++)
        points.push(point((j / 80) * tau, (i / 12) * tau));
      curves.push({ points, cross: true });
    }
    function draw(now) {
      frame = 0;
      const delta = lastTime ? Math.min(now - lastTime, 50) : 16;
      lastTime = now;
      if (!paused) angle += delta * 0.000065;
      const damping = 1 - Math.exp(-delta / 180);
      easedX += (pointerX - easedX) * damping;
      easedY += (pointerY - easedY) * damping;
      const rx = 0.88 + easedY * 0.32,
        ry = angle + easedX * 0.45;
      const sx = Math.sin(rx),
        cx = Math.cos(rx),
        sy = Math.sin(ry),
        cy = Math.cos(ry);
      const sz = Math.sin(-0.3),
        cz = Math.cos(-0.3);
      const size = Math.min(width, height) * 0.205;
      context.clearRect(0, 0, width, height);
      for (const curve of curves) {
        context.beginPath();
        let depth = 0;
        curve.points.forEach(([x, y, z], index) => {
          const yy = y * cx - z * sx,
            zz = y * sx + z * cx;
          const xx = x * cy + zz * sy,
            zzz = -x * sy + zz * cy;
          const perspective = 5.8 / (5.8 + zzz);
          const px = width / 2 + (xx * cz - yy * sz) * size * perspective;
          const py = height / 2 + (xx * sz + yy * cz) * size * perspective;
          if (!index) context.moveTo(px, py);
          else context.lineTo(px, py);
          depth += zzz;
        });
        const opacity = Math.max(
          0.15,
          Math.min(0.64, 0.37 - (depth / curve.points.length) * 0.16),
        );
        context.strokeStyle = curve.accent
          ? `rgba(225,73,45,${opacity + 0.18})`
          : `rgba(32,43,37,${curve.cross ? opacity * 0.5 : opacity})`;
        context.lineWidth = curve.accent ? 1.1 : 0.75;
        context.stroke();
      }
      if (inView && visible && !paused) frame = requestAnimationFrame(draw);
    }
    function start() {
      if (!frame && inView && visible) {
        lastTime = 0;
        frame = requestAnimationFrame(draw);
      }
    }
    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (paused || !inView) draw(performance.now());
      else start();
    }
    function move(event) {
      if (paused || event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
      pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
    }
    function leave() {
      pointerX = 0;
      pointerY = 0;
    }
    function visibility() {
      visible = !document.hidden;
      if (visible) start();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [paused]);
  return (
    <canvas
      ref={canvasRef}
      className="ys-sculpture-canvas"
      aria-hidden="true"
    />
  );
}
