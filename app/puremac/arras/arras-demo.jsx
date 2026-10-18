"use client";

import { useEffect, useRef, useState } from "react";

export default function ArrasDemo({ posterProps, setupUrl }) {
  const demoRef = useRef(null);
  const manuallyPaused = useRef(false);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [demoHasFrame, setDemoHasFrame] = useState(false);
  const [allowAutoplay, setAllowAutoplay] = useState(false);
  const [demoNearViewport, setDemoNearViewport] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const demo = demoRef.current;
    let frameRequest = null;
    const cancelFrame = () => {
      if (frameRequest !== null) demo.cancelVideoFrameCallback(frameRequest);
      frameRequest = null;
    };
    const revealFrame = () => {
      cancelFrame();
      // `play` only changes paused state; keep the poster until a frame is presented.
      if (demo.requestVideoFrameCallback) {
        frameRequest = demo.requestVideoFrameCallback(() => {
          frameRequest = null;
          setDemoHasFrame(true);
        });
      } else if (demo.readyState >= 2) {
        setDemoHasFrame(true);
      }
    };
    const resetFrame = () => {
      cancelFrame();
      setDemoHasFrame(false);
      setDemoPlaying(false);
    };
    demo.addEventListener("playing", revealFrame);
    demo.addEventListener("emptied", resetFrame);
    demo.addEventListener("error", resetFrame);
    return () => {
      cancelFrame();
      demo.removeEventListener("playing", revealFrame);
      demo.removeEventListener("emptied", resetFrame);
      demo.removeEventListener("error", resetFrame);
    };
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

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
    if (!demoNearViewport || !pageVisible) {
      demo.pause();
      return;
    }
    if (!allowAutoplay || manuallyPaused.current) return;
    demo.play().catch(() => {});
  }, [allowAutoplay, demoNearViewport, pageVisible]);

  return (
    <section className="ar-wrap ar-demo" aria-label="Arras product demonstration">
      <div className="ar-demo-media">
        <img {...posterProps} className="ar-demo-poster" aria-hidden="true" />
        <video id="arras-demo" ref={demoRef} muted loop playsInline preload="none" poster={posterProps.src} data-frame-ready={demoHasFrame} onPlay={() => setDemoPlaying(true)} onPause={() => setDemoPlaying(false)} aria-label="Arras photo widgets being arranged on a Mac desktop"><source src="/puremac/arras/launch-2.5.0.mp4" type="video/mp4" />Your browser does not support video.</video>
      </div>
      <div className="ar-caption"><a href={setupUrl}>Read the setup instructions →</a><button type="button" aria-controls="arras-demo" onClick={async () => {
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
