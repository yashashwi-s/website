"use client";

import { useEffect, useRef, useState } from "react";

export default function ArrasDemo({ posterProps }) {
  const demoRef = useRef(null);
  const manuallyPaused = useRef(false);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const [allowAutoplay, setAllowAutoplay] = useState(false);
  const [demoNearViewport, setDemoNearViewport] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      // Keep mobile bandwidth available for the poster and page content.
      const connection = navigator.connection;
      setAllowAutoplay(!preference.matches && !window.matchMedia("(pointer: coarse)").matches && !connection?.saveData);
      if (preference.matches) demoRef.current?.pause();
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const demo = demoRef.current;
    if (!demo) return;
    const observer = new IntersectionObserver(([entry]) => {
      setDemoNearViewport(entry.intersectionRatio >= 0.5);
    }, { threshold: 0.5 });
    observer.observe(demo);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const demo = demoRef.current;
    if (!demo) return;
    if (!demoNearViewport) {
      demo.pause();
      return;
    }
    if (!allowAutoplay || manuallyPaused.current) return;
    demo.play().catch(() => {});
  }, [allowAutoplay, demoNearViewport]);

  return (
    <section className="ar-wrap ar-demo" aria-label="Arras product demonstration">
      <div className="ar-demo-media">
        <video id="arras-demo" ref={demoRef} muted loop playsInline preload="none" onPlay={() => { setDemoPlaying(true); setDemoStarted(true); }} onPause={() => setDemoPlaying(false)} aria-label="Arras photo widgets being arranged on a Mac desktop"><source src="/puremac/arras/demo.mp4" type="video/mp4" />Your browser does not support video.</video>
        {!demoStarted && <img {...posterProps} className="ar-demo-poster" aria-hidden="true" />}
      </div>
      <div className="ar-caption"><a href="#how-to-use">Read the setup instructions ↓</a><button type="button" aria-controls="arras-demo" onClick={async () => {
        const demo = demoRef.current;
        if (!demo) return;
        if (!demo.paused) {
          manuallyPaused.current = true;
          demo.pause();
        } else {
          manuallyPaused.current = false;
          try { await demo.play(); } catch { setDemoPlaying(false); }
        }
      }}>{demoPlaying ? "Pause demo" : "Play demo"}</button></div>
    </section>
  );
}
