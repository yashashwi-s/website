"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import Magnetic from "@/components/Magnetic";
import ScrambleText from "@/components/ScrambleText";
import { GRAIN } from "./puremac/grain";

const ACCENT = "#ccff2e";

/* Where you probably meant to go. A 404 that only apologises wastes the visit;
   this one is mostly a list of things that do exist. */
const ELSEWHERE = [
  { label: "Home", href: "/", note: "the work, the receipts" },
  { label: "PureMac", href: "https://puremac.yashashwi.me", note: "two native macOS apps" },
  { label: "Arras", href: "https://arras.yashashwi.me", note: "photos on your desktop" },
  { label: "Fadeo", href: "https://puremac.yashashwi.me/fadeo", note: "audio that follows your work" },
  { label: "CV", href: "https://cv.yashashwi.me", note: "one page, print-ready" },
  { label: "GitHub", href: "https://github.com/yashashwi-s", note: "everything, unedited" },
];

export default function NotFoundClient({ fontClass = "" }) {
  const wrap = useRef(null);

  /* The 404 leans toward the pointer instead of strobing.
     The old version ran two glitch layers on `repeat: Infinity, duration: 0.2`,
     which is a 5Hz flicker sitting on screen for as long as you stay. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 18 });

  const onMove = useCallback(
    (e) => {
      const r = wrap.current?.getBoundingClientRect();
      if (!r) return;
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    },
    [px, py]
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  // The one joke: it counts how long you have been lost.
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      id="nf-page"
      ref={wrap}
      className={`${fontClass} relative min-h-screen overflow-hidden bg-[#0b0b0c] text-white`}
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      <style>{`
        body:has(#nf-page) .noise-bg { display: none; }
        #nf-page h1, #nf-page h2, #nf-page .display {
          font-family: var(--font-poster), ui-sans-serif, system-ui, sans-serif;
          font-weight: 400; text-transform: uppercase;
        }
        #nf-page .editorial {
          font-family: var(--font-editorial), ui-serif, Georgia, serif;
          font-style: italic; text-transform: none;
        }
        #nf-page ::selection { background: ${ACCENT}; color: #000; }
      `}</style>

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: GRAIN }} />
      <CustomCursor />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <Link
            href="/"
            data-cursor="snap"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
          >
            <span style={{ color: ACCENT }}>●</span> ys
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">
            error 404
          </span>
        </header>

        <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <motion.h1
              style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
              className="select-none text-[clamp(6rem,26vw,17rem)] leading-[0.78] tracking-[0.01em]"
            >
              <span className="block">404</span>
            </motion.h1>

            <p className="mt-8 max-w-md text-[17px] leading-[1.6] text-white/60">
              This page doesn&apos;t exist. It may have been renamed{" "}
              <span className="editorial text-white">twice</span>, like most things around here,
              or it may never have existed at all.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Magnetic>
                <Link
                  href="/"
                  data-cursor="snap"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-semibold text-black"
                  style={{ backgroundColor: ACCENT }}
                >
                  Take me home
                </Link>
              </Magnetic>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/25">
                lost for {secs}s
              </span>
            </div>
          </div>

          {/* The useful half */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
              Things that do exist
            </p>
            <ul className="mt-6">
              {ELSEWHERE.map((item, i) => {
                const external = item.href.startsWith("http");
                const Tag = external ? "a" : Link;
                return (
                  <li key={item.label}>
                    <Tag
                      href={item.href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      data-cursor="snap"
                      className="group flex items-baseline gap-4 border-t border-white/10 py-4 last:border-b"
                    >
                      <span className="w-6 shrink-0 font-mono text-[10.5px] text-white/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span className="display block text-[clamp(1.3rem,3vw,1.8rem)] leading-none transition-colors group-hover:text-[color:var(--acc)]" style={{ "--acc": ACCENT }}>
                          <ScrambleText text={item.label} />
                        </span>
                        <span className="mt-1.5 block text-[13.5px] text-white/40">{item.note}</span>
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="mt-1 shrink-0 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        style={{ color: ACCENT }}
                      />
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <footer className="py-8 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/20">
          Varanasi, India
        </footer>
      </div>
    </div>
  );
}
