"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, Copy, Download } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import { GRAIN } from "../grain";
import FaqSection from "../faq-section";

/* Palette sampled off the demo footage itself — the wallpaper in the video sits
   around #181830/#303060, and the warm sunset print is the only hot thing on
   screen. Amber on indigo is why that frame reads, so the page borrows it
   rather than inventing a scheme that fights the product shots. */
const AMBER = "#ff9e5e";
const VIOLET = "#8b7bf7";

const MARQUEE = [
  "no crop",
  "no black bars",
  "no fixed grid",
  "no subscription",
  "no account",
  "no telemetry",
];

/* Deliberately the real ratios, drawn at the real ratios. The section argues
   that shape is the point, so the section is made of shapes. */
const RATIOS = [
  // Each fill echoes one of the widgets actually on screen in the demo — the
  // aurora, the sunset print, the blue gradient, the mountain wallpaper.
  {
    label: "21:9",
    css: "21 / 9",
    name: "panorama",
    fill: "linear-gradient(135deg,#123b3a,#2f7d6b 45%,#7fd6b0)",
  },
  {
    label: "16:9",
    css: "16 / 9",
    name: "landscape",
    fill: "linear-gradient(135deg,#1a1338,#5b3a86 55%,#c98bd6)",
  },
  {
    label: "1:1",
    css: "1 / 1",
    name: "square",
    fill: "linear-gradient(135deg,#12294d,#2f6fb0 50%,#7fc4f2)",
  },
  {
    label: "3:4",
    css: "3 / 4",
    name: "portrait",
    fill: "linear-gradient(160deg,#f6c98a,#e8834f 45%,#4a2b52 92%)",
  },
];

const FEATURES = [
  {
    n: "01",
    title: "Sized to the photo, not to a template",
    body: "Every widget is its own window with its own dimensions. A panorama stays a panorama. Nothing is cropped, letterboxed or padded to fit a grid that was never yours.",
  },
  {
    n: "02",
    title: "Anywhere in the stack",
    body: "Right-click and send a photo behind your desktop icons, above them, over macOS's own widgets, or floating above every app you have open. Keep clicking and it walks the whole stack.",
  },
  {
    n: "03",
    title: "Spaces rotate",
    body: "Pick several images and they become one widget that crossfades between them — on click, every 30 seconds, hourly, or an interval you set. Each image keeps its own size and position.",
  },
  {
    n: "04",
    title: "Snapping that actually snaps",
    body: "Photos align to screen edges, to each other, and to other apps' windows, with guides while you drag. It snaps the visible edge, not the invisible window frame. No permissions needed.",
  },
  {
    n: "05",
    title: "Four ways in, all fast",
    body: "⌘V pastes a copied image straight onto the desktop. Drag files onto the menu bar icon. Pull up to 20 from your Photos library. Or drag a rectangle to grab part of your screen and pin it.",
  },
  {
    n: "06",
    title: "Styled, not decorated",
    body: "Gallery, Polaroid, Minimal and Modern in one click — or set your own shape mask, photo mat, two-layer shadow, border, vignette and a few degrees of tilt so a cluster looks scattered.",
  },
  {
    n: "07",
    title: "It never takes your focus",
    body: "The widgets are non-activating panels. Click one, drag it, resize it — the menu bar stays with whatever you were actually working in. GIFs animate on the render server, so they cost no CPU.",
  },
];

const SPECS = [
  ["memory", "~20 MB"],
  ["idle cpu", "~0%"],
  ["download", "2.4 MB"],
  ["requires", "macOS 14+"],
  // The release build is thin arm64. Worth stating plainly: an Intel user who
  // downloads it gets an app that cannot launch.
  ["silicon", "Apple only"],
  ["license", "MIT"],
];

/* Photo Widget OSX -> Tableau -> Arras. Two renames is a slightly absurd
   history and hiding it just makes old links look like a different product. */
const LINEAGE = [
  { name: "Photo Widget OSX", note: "2025" },
  { name: "Tableau", note: "→ v2.3.0" },
  { name: "Arras", note: "v2.3.1 →", current: true },
];

function CopyLine({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      data-cursor="snap"
      className="group flex w-full items-center justify-between gap-4 border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-white/25"
    >
      <code className="font-mono text-[12.5px] leading-relaxed text-white/70 sm:text-[13.5px]">
        {text}
      </code>
      <span className="shrink-0 text-white/30 transition-colors group-hover:text-white/70">
        {copied ? <Check size={14} style={{ color: AMBER }} /> : <Copy size={14} />}
      </span>
    </button>
  );
}

export default function ArrasClient({ release, faqs = [], fontClass = "" }) {
  const downloadUrl = release?.dmg ?? release?.zip ?? "https://github.com/yashashwi-s/Arras/releases/latest";
  const tag = release?.tag ?? "v2.4.4";

  const videoWrap = useRef(null);
  const { scrollYProgress } = useScroll({
    target: videoWrap,
    offset: ["start end", "end start"],
  });
  // A slow counter-drift on the frame while it passes. Small on purpose — the
  // footage is the moving part, the container should not compete with it.
  const videoY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <div
      id="arras-page"
      className={`${fontClass} min-h-screen overflow-x-hidden bg-[#08070e] text-white selection:bg-[#ff9e5e] selection:text-black`}
      // Body copy runs on the system face: this is a page about a Mac app, and
      // SF Pro is what the app itself is set in.
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      {/* The root layout renders a global film-grain overlay that animates in
          steps(1), so it strobes about eleven times a second. Suppressed here and
          replaced with the same texture held still — the grain was doing useful
          work against the flat background, the movement was not. */}
      <style>{`body:has(#arras-page) .noise-bg { display: none; }`}</style>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.045]" style={{ backgroundImage: GRAIN }} />

      {/* The indigo the footage sits in, bled behind the whole page so the video
          never looks pasted onto a flat black rectangle. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(48,48,96,0.55) 0%, rgba(24,24,48,0.22) 38%, transparent 70%)",
        }}
      />

      <CustomCursor />

      <div className="relative z-10">
        {/* ---------------------------------------------------------------- nav */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-7 sm:px-8">
          <a
            href="/"
            data-cursor="snap"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/80"
          >
            <ArrowLeft size={12} />
            PureMac
          </a>
          <a
            href="https://github.com/yashashwi-s/Arras"
            data-cursor="snap"
            className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/80"
          >
            Source
            <ArrowUpRight size={12} />
          </a>
        </header>

        {/* --------------------------------------------------------------- hero */}
        <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 sm:pt-24">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            <Image
              src="/puremac/arras-icon.png"
              alt=""
              width={26}
              height={26}
              className="rounded-[7px]"
            />
            <span style={{ color: AMBER }}>{tag}</span>
            <span className="text-white/15">/</span>
            <span>macOS 14+</span>
            <span className="text-white/15">/</span>
            <span>MIT</span>
          </div>

          <h1 className="mt-7 text-[clamp(3.4rem,13vw,10.5rem)] font-extrabold leading-[0.82] tracking-[-0.055em]">
            <span className="block">Your photos.</span>
            <span className="block text-white/25">Not squares.</span>
          </h1>

          <div className="mt-10 grid gap-10 sm:grid-cols-[1.1fr_0.9fr] sm:gap-14">
            <div>
              <p className="max-w-md text-[16px] leading-[1.65] text-white/60">
                macOS gives desktop widgets four fixed sizes and crops whatever
                you put in them. Arras gives every photo its own window at its
                own proportions, and then gets out of the way — around 20 MB of
                memory and effectively no CPU while it sits there.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={downloadUrl}
                  data-cursor="snap"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-semibold text-black transition-transform hover:scale-[1.03]"
                  style={{ backgroundColor: AMBER }}
                >
                  <Download size={16} strokeWidth={2.4} />
                  Download for Mac
                </a>
                <a
                  href="#install"
                  data-cursor="snap"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 underline-offset-4 transition-colors hover:text-white/80 hover:underline"
                >
                  or install with brew
                </a>
              </div>
            </div>

            {/* A spec sheet rather than a second paragraph — the right column
                would otherwise be dead space at desktop widths. */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-end border-t border-white/8 pt-6 sm:max-w-sm sm:justify-self-end">
              {[
                ["works on", "macOS 14+, Apple Silicon"],
                ["costs", "nothing, ever"],
                ["weighs", "2.4 MB"],
                ["sends home", "nothing"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                    {k}
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium text-white/75">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* -------------------------------------------------------------- video */}
        <section ref={videoWrap} className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 sm:pt-20">
          <motion.div
            style={{ y: videoY }}
            className="relative overflow-hidden rounded-[20px] border border-white/10 bg-black shadow-[0_40px_120px_-30px_rgba(80,60,180,0.5)]"
          >
            <video
              src="/puremac/arras/demo.mp4"
              poster="/puremac/arras/demo-poster.jpg"
              className="block h-auto w-full"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </motion.div>
        </section>

        {/* ------------------------------------------------------------ marquee */}
        <section className="relative mt-20 overflow-hidden border-y border-white/8 py-5 sm:mt-28">
          <div className="flex w-max animate-[arras-marquee_34s_linear_infinite] gap-8">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-8" aria-hidden={copy === 1}>
                {MARQUEE.map((word) => (
                  <span key={word} className="flex items-center gap-8">
                    <span className="display text-[clamp(1.6rem,4.4vw,3.2rem)] font-extrabold tracking-[-0.04em] text-white/85">
                      {word}
                    </span>
                    <span
                      className="text-[clamp(1.6rem,4.4vw,3.2rem)] leading-none"
                      style={{ color: AMBER }}
                    >
                      ·
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- the thesis */}
        <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            The whole idea
          </p>
          <h2 className="mt-5 max-w-2xl text-[clamp(2rem,5.4vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            A shape is information.
            <span className="text-white/30"> Cropping deletes it.</span>
          </h2>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {RATIOS.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="self-end"
              >
                <div
                  className="w-full rounded-lg shadow-[0_18px_50px_-18px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
                  style={{ aspectRatio: r.css, background: r.fill }}
                />
                <div className="mt-3 flex items-baseline justify-between font-mono text-[11px] tracking-[0.1em] text-white/40">
                  <span style={{ color: AMBER }}>{r.label}</span>
                  <span className="uppercase">{r.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 max-w-lg font-mono text-[12px] leading-[1.9] text-white/35">
            Four windows, four shapes, drawn here at the ratios they claim. The
            built-in widget would return all four as the same rectangle.
          </p>
        </section>

        {/* ------------------------------------------------------------ features */}
        <section className="mx-auto max-w-6xl border-t border-white/8 px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-20 lg:self-start">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
                What it does
              </p>
              <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                Seven things,
                <br />
                done properly.
              </h2>
              <p className="mt-6 max-w-xs text-[14.5px] leading-[1.7] text-white/45">
                No feature here exists because a competitor had it. Most of them
                exist because someone filed an issue.
              </p>
            </div>

            <ul className="space-y-0">
              {FEATURES.map((f, i) => (
                <motion.li
                  key={f.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="group border-t border-white/8 py-7 first:border-t-0 first:pt-0"
                >
                  <div className="flex gap-5 sm:gap-7">
                    <span
                      className="shrink-0 pt-1 font-mono text-[11px] tracking-[0.1em] text-white/25 transition-colors group-hover:text-[color:var(--amber)]"
                      style={{ "--amber": AMBER }}
                    >
                      {f.n}
                    </span>
                    <div>
                      <h3 className="text-[19px] font-bold leading-tight tracking-[-0.02em] sm:text-[22px]">
                        {f.title}
                      </h3>
                      <p className="mt-2.5 max-w-xl text-[14.5px] leading-[1.72] text-white/50">
                        {f.body}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------------------- specs */}
        <section className="border-y border-white/8">
          <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {SPECS.map(([k, v]) => (
              <div
                key={k}
                className="border-b border-r border-white/8 px-5 py-7 last:border-r-0 sm:px-6 lg:border-b-0"
              >
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/30">
                  {k}
                </p>
                <p className="display mt-2 text-[20px] font-bold tracking-[-0.02em] sm:text-[23px]">{v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------- install */}
        <section id="install" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            Install
          </p>
          <h2 className="mt-5 max-w-xl text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            Two routes. Both take a minute.
          </h2>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: AMBER }}>
                  01
                </span>
                <h3 className="text-[19px] font-bold tracking-[-0.02em]">Homebrew</h3>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
                  no warning
                </span>
              </div>
              <p className="mt-3 max-w-md text-[14.5px] leading-[1.7] text-white/50">
                Homebrew 6 removed the <code className="font-mono text-[13px] text-white/70">--no-quarantine</code>{" "}
                flag and shipped no replacement, so casks are quarantined
                unconditionally. The third line clears the flag and Arras opens
                without the dialog.
              </p>
              <div className="mt-5 space-y-2">
                <CopyLine text="brew tap yashashwi-s/tap" />
                <CopyLine text="brew install --cask arras" />
                <CopyLine text="xattr -dr com.apple.quarantine /Applications/Arras.app" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: AMBER }}>
                  02
                </span>
                <h3 className="text-[19px] font-bold tracking-[-0.02em]">Direct download</h3>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
                  one prompt
                </span>
              </div>
              <p className="mt-3 max-w-md text-[14.5px] leading-[1.7] text-white/50">
                Arras is ad-hoc signed, not notarized — that needs Apple&apos;s $99/year
                certificate and this app is free. So macOS warns you once, and once only.
              </p>
              <ol className="mt-5 space-y-3">
                {[
                  "Open the .dmg and drag Arras onto Applications",
                  "Launch it. macOS says it can't verify the app — click Done",
                  "System Settings → Privacy & Security → Open Anyway",
                ].map((step, i) => (
                  <li key={step} className="flex gap-4 text-[14px] leading-[1.6] text-white/55">
                    <span className="shrink-0 font-mono text-[11px] text-white/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href={downloadUrl}
                data-cursor="snap"
                className="mt-6 inline-flex items-center gap-2 border-b border-white/20 pb-1 text-[14px] font-semibold transition-colors hover:border-[color:var(--amber)]"
                style={{ "--amber": AMBER }}
              >
                Download {tag}
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- lineage */}
        <section className="mx-auto max-w-6xl border-t border-white/8 px-5 py-20 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            It has had three names
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-4">
            {LINEAGE.map((l, i) => (
              <div key={l.name} className="flex items-center gap-4">
                <div className={l.current ? "" : "opacity-40"}>
                  <p
                    className="display text-[19px] font-bold tracking-[-0.02em] sm:text-[24px]"
                    style={l.current ? { color: AMBER } : undefined}
                  >
                    {l.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
                    {l.note}
                  </p>
                </div>
                {i < LINEAGE.length - 1 && (
                  <span className="text-[20px] text-white/15">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-xl text-[14.5px] leading-[1.7] text-white/45">
            Photo Widget OSX described the file type. Tableau collided with a
            data-visualization giant and lost every search. Arras is a woven wall
            hanging, which is closer to the point. Nothing about the app moved:
            same bundle identifier, same settings, same photos, and it updates in
            place.
          </p>
        </section>

        <FaqSection
          faqs={faqs}
          accent={AMBER}
          className="mx-auto max-w-6xl px-5 sm:px-8"
          title="Arras, in plain terms."
        />

        {/* -------------------------------------------------------------- footer */}
        <footer className="mx-auto max-w-6xl border-t border-white/8 px-5 py-12 sm:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="display text-[clamp(1.8rem,5vw,3rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
                Free. Forever.
                <br />
                <span className="text-white/25">Read the source.</span>
              </p>
              <a
                href="https://github.com/yashashwi-s/Arras"
                data-cursor="snap"
                className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11.5px] tracking-[0.1em] text-white/45 transition-colors hover:text-white/85"
              >
                github.com/yashashwi-s/Arras
                <ArrowUpRight size={13} />
              </a>
            </div>
            <p className="max-w-[16rem] font-mono text-[10.5px] uppercase leading-[1.9] tracking-[0.14em] text-white/25">
              PureMac
              <br />
              by Yashashwi Singhania
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        /* Display face on the big type only. Applied here rather than as a
           class on each node so the two faces can never drift apart. */
        #arras-page h1,
        #arras-page h2,
        #arras-page h3,
        #arras-page .display {
          font-family: var(--font-display), ui-sans-serif, system-ui, sans-serif;
          font-feature-settings: "ss01";
        }
        @keyframes arras-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          #arras-page .animate-\\[arras-marquee_34s_linear_infinite\\] {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
