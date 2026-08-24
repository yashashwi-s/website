"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import Magnetic from "@/components/Magnetic";
import { GRAIN } from "./grain";
import FaqSection from "./faq-section";

/* The index is the one light page in the set.
 *
 * Both product pages are dark and saturated — Arras indigo/amber, Fadeo
 * teal-on-black. If the index were dark too, the three would read as one long
 * site. Paper white with heavy black type makes it a catalogue instead, and
 * opening either app feels like stepping into that app rather than scrolling
 * further down the same page. Each app's accent appears here only as a small
 * chip, so the colour belongs to the product, not to the index.
 */
const INK = "#111014";

const APPS = [
  {
    id: "arras",
    index: "01",
    name: "Arras",
    icon: "/puremac/arras-icon.png",
    tagline: "Any photo, perfectly fitted on your desktop.",
    description:
      "The built-in Photos widget fits images into supported widget frames. Arras gives every photo its own window at its own proportions — no cropping, no black bars, no forced grid.",
    facts: ["any aspect ratio", "layer it anywhere in the stack", "~20MB RAM, no idle CPU"],
    accent: "#ff9e5e",
    price: "Free",
    license: "MIT",
    repo: "Arras",
    page: "/arras",
  },
  {
    id: "fadeo",
    index: "02",
    name: "Fadeo",
    icon: "/puremac/fadeo-icon.png",
    tagline: "The right sound for what you're doing, automatically.",
    description:
      "Fadeo watches the app in front of you, the desktop you're on, and whether you're in a meeting — then plays, fades or switches audio to match. Every rule is yours to define.",
    facts: ["four ordered decision bands", "no polling, all OS push", "never touches system volume"],
    accent: "#67e4d2",
    price: "Pay what you want",
    license: "GPLv3",
    repo: "Fadeo",
    page: "/fadeo",
  },
];

/* Counts the real GitHub download total up once, when the row scrolls in.
   Seeded with the final figure so a missed observer or reduced motion leaves the
   true number rather than a zero. */
function Count({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return <span ref={ref}>{shown.toLocaleString()}</span>;
}

function AppEntry({ app, release, downloads }) {
  const downloadUrl = release?.dmg ?? release?.zip ?? null;

  /* The row warms toward the app's own colour under the pointer. On paper this
     has to stay faint — the index is the calm page in the set, so it is a tint
     that follows the cursor rather than a fill that switches on. */
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const sx = useSpring(mx, { stiffness: 180, damping: 28 });
  const sy = useSpring(my, { stiffness: 180, damping: 28 });
  const [wash, setWash] = useState("transparent");
  const [lift, setLift] = useState(false);

  useEffect(() => {
    const paint = () =>
      setWash(
        `radial-gradient(38% 90% at ${sx.get().toFixed(1)}% ${sy.get().toFixed(1)}%, ${app.accent}26, transparent 72%)`
      );
    const a = sx.on("change", paint);
    const b = sy.on("change", paint);
    return () => {
      a();
      b();
    };
  }, [sx, sy, app.accent]);

  const onMove = useCallback(
    (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width) * 100);
      my.set(((e.clientY - r.top) / r.height) * 100);
    },
    [mx, my]
  );

  return (
    <article
      onMouseMove={onMove}
      onMouseEnter={() => setLift(true)}
      onMouseLeave={() => setLift(false)}
      className="group relative border-t border-black/12 py-12 sm:py-16"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: wash }}
      />
      <div className="relative grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-start lg:gap-12">
        {/* index + icon */}
        <div className="flex items-center gap-5 lg:w-[132px] lg:flex-col lg:items-start lg:gap-6">
          <span
            className="font-mono text-[11px] tracking-[0.2em] transition-colors duration-300"
            style={{ color: lift ? app.accent : "rgba(0,0,0,0.3)" }}
          >
            {app.index}
          </span>
          <motion.div
            animate={lift ? { y: -6, rotate: -3, scale: 1.04 } : { y: 0, rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            style={{ filter: lift ? `drop-shadow(0 14px 22px ${app.accent}55)` : "none" }}
          >
            <Image src={app.icon} alt="" width={72} height={72} className="rounded-[18px]" />
          </motion.div>
        </div>

        {/* body */}
        <div className="min-w-0">
          <a href={app.page} data-cursor="snap" className="inline-flex items-baseline gap-2">
            <h2
              className="display text-[clamp(2.4rem,6vw,4rem)] font-normal leading-[0.95] tracking-[-0.02em] transition-colors duration-300"
              style={{ color: lift ? app.accent : INK }}
            >
              {app.name}
            </h2>
            <ArrowUpRight size={20} className="translate-y-[-0.35em] text-black/25 transition-transform group-hover:translate-x-1 group-hover:translate-y-[-0.5em]" />
          </a>

          <p className="mt-2 max-w-lg text-[17px] leading-snug text-black/60">{app.tagline}</p>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.7] text-black/50">{app.description}</p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {app.facts.map((f) => (
              <li key={f} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-black/40">
                <span className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: app.accent }} />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Magnetic>
              <a
                href={app.page}
                data-cursor="snap"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white"
                style={{ backgroundColor: INK }}
              >
                Open {app.name}
              </a>
            </Magnetic>
            {downloadUrl && (
              <a
                href={downloadUrl}
                data-cursor="snap"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-black/45 underline-offset-4 transition-colors hover:text-black hover:underline"
              >
                Download {release?.tag ?? "latest"}
              </a>
            )}
            <a
              href={`https://github.com/yashashwi-s/${app.repo}`}
              data-cursor="snap"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-black/45 underline-offset-4 transition-colors hover:text-black hover:underline"
            >
              Source
            </a>
          </div>
        </div>

        {/* spec column */}
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-black/10 pt-5 lg:w-[158px] lg:grid-cols-1 lg:border-t-0 lg:border-l lg:border-black/10 lg:pl-7 lg:pt-0">
          {downloads?.total > 0 && (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/30">
                downloads
              </dt>
              <dd className="mt-1 text-[14px] font-medium" style={{ color: INK }}>
                <Count value={downloads.total} />
                {downloads.releaseCount > 0 && (
                  <span className="text-black/35"> · {downloads.releaseCount} releases</span>
                )}
              </dd>
            </div>
          )}
          {[
            ["price", app.price],
            ["license", app.license],
            ["requires", "macOS 14+"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/30">{k}</dt>
              <dd className="mt-1 text-[14px] font-medium" style={{ color: INK }}>
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export default function PureMacClient({ fadeo, arras, downloads = {}, faqs = [], fontClass = "" }) {
  const releases = { fadeo, arras };

  return (
    <div
      id="puremac-index"
      className={`${fontClass} min-h-screen bg-[#f4f1ea] selection:bg-[#111014] selection:text-[#f4f1ea]`}
      style={{ color: INK, fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      {/* The root layout's grain overlay is white-on-dark and animated in steps(1),
          so on a light page it both strobes and inverts wrong. Suppressed, and
          replaced with the same texture held still at a much lower opacity. */}
      <style>{`
        body:has(#puremac-index) .noise-bg { display: none; }
        #puremac-index h1, #puremac-index h2, #puremac-index .display {
          font-family: var(--font-index), ui-serif, Georgia, serif;
          font-weight: 400;
        }
      `}</style>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />

      <CustomCursor />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <header className="flex items-center justify-between py-7">
          <a
            href="https://yashashwi.me"
            data-cursor="snap"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-black"
          >
            <ArrowLeft size={12} />
            yashashwi.me
          </a>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/30">
            Yashashwi Singhania
          </span>
        </header>

        <section className="pt-20 pb-16 sm:pt-32 sm:pb-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/40">PureMac</p>
          <h1 className="mt-7 max-w-4xl text-[clamp(3rem,10vw,7.5rem)] leading-[0.88] tracking-[-0.03em]">
            Small, native
            <br />
            macOS apps.
          </h1>
          <div className="mt-10 grid gap-8 sm:grid-cols-[1.1fr_0.9fr] sm:items-end">
            <p className="max-w-md text-[16.5px] leading-[1.65] text-black/55">
              No Electron, no subscriptions, no telemetry you didn&apos;t ask for. Each one does a
              single thing, natively, and gets out of the way. Read every line or build it
              yourself.
            </p>
            <p className="font-mono text-[11px] uppercase leading-[2] tracking-[0.16em] text-black/35 sm:justify-self-end sm:text-right">
              Two apps
              <br />
              Both open source
              <br />
              Both free to run
            </p>
          </div>
        </section>

        <main className="pb-12">
          {APPS.map((app) => (
            <AppEntry
              key={app.id}
              app={app}
              release={releases[app.id]}
              downloads={downloads[app.id]}
            />
          ))}
        </main>

        <FaqSection
          faqs={faqs}
          accent="#a64e20"
          light
          title="Before you download."
        />

        <footer className="flex flex-col gap-4 border-t border-black/12 py-10 sm:flex-row sm:items-center sm:justify-between">
          <span className="max-w-md font-mono text-[10.5px] uppercase leading-[1.9] tracking-[0.14em] text-black/35">
            Ad-hoc signed. Gatekeeper asks once, which is expected outside the App Store.
          </span>
          <a
            href="https://github.com/yashashwi-s"
            data-cursor="snap"
            className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.16em] text-black/35 transition-colors hover:text-black"
          >
            github.com/yashashwi-s
          </a>
        </footer>
      </div>
    </div>
  );
}
