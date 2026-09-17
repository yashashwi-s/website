"use client";

import { useEffect } from "react";

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    if (motionQuery.matches || !pointerQuery.matches) return;

    let cancelled = false;
    let cleanup = () => {};
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      let rafId;
      let isVisible = !document.hidden;
      function raf(time) {
        lenis.raf(time);
        if (isVisible) rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);

      const onVisibilityChange = () => {
        isVisible = !document.hidden;
        cancelAnimationFrame(rafId);
        if (isVisible) rafId = requestAnimationFrame(raf);
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      cleanup = () => {
        cancelAnimationFrame(rafId);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        lenis.destroy();
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return <>{children}</>;
}
