"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, Copy, Download } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { GRAIN } from "../grain";
import FaqSection from "../faq-section";

/* Palette sampled off the demo footage itself — the wallpaper in the video sits
   around #181830/#303060, and the warm sunset print is the only hot thing on
   screen. Amber on indigo is why that frame reads, so the page borrows it
   rather than inventing a scheme that fights the product shots. */
const AMBER = "#ff9e5e";

const MARQUEE = [
  "no crop",
  "no black bars",
  "no fixed grid",
  "no subscription",
  "no account",
  "no telemetry",
];

const BENEFITS = [
  {
    n: "01",
    title: "No cropping",
    body: "Arras keeps the full image visible. No trimmed edges, filler, or black bars.",
  },
  {
    n: "02",
    title: "Any aspect ratio",
    body: "Panoramas stay wide. Portraits stay tall. Each widget matches its photo.",
  },
  {
    n: "03",
    title: "Place it anywhere",
    body: "Put a photo behind desktop icons, above them, or over your other windows.",
  },
  {
    n: "04",
    title: "Multiple and animated photos",
    body: "Rotate a set of images in one widget, or keep GIFs and APNGs moving.",
  },
];

const ADVANCED_FEATURES = [
  {
    n: "01",
    title: "Visible-edge snapping",
    body: "Photos align to screen edges, each other, and app windows. Guides show the exact alignment while you drag.",
  },
  {
    n: "02",
    title: "Paste, drag, import, or capture",
    body: "Press ⌘V, drop image files on the menu bar icon, choose from Photos, or pin part of your screen.",
  },
  {
    n: "03",
    title: "Per-photo styling",
    body: "Choose a preset or set the mask, mat, shadow, border, vignette, opacity, and tilt yourself.",
  },
  {
    n: "04",
    title: "Does not steal focus",
    body: "Move or resize a widget while the app you are working in stays active.",
  },
];

const COMPARISON = [
  ["Photo shape", "Fixed widget formats", "Original aspect ratio"],
  ["Choose an exact image", "Depends on Photos widget controls", "Paste, drag, Photos, or capture"],
  ["Window placement", "Desktop or Notification Center", "Below icons through above apps"],
  ["Rotation control", "Managed by the Photos widget", "Click, 30 seconds, hourly, or custom"],
  ["Source and price", "Included with macOS", "MIT licensed and free"],
];

/* Photo Widget OSX -> Tableau -> Arras. Two renames is a slightly absurd
   history and hiding it just makes old links look like a different product. */
const LINEAGE = [
  { name: "Photo Widget OSX", note: "2026" },
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

export default function ArrasClient({
  release,
  downloads,
  dateModified,
  faqs = [],
  fontClass = "",
}) {
  const downloadUrl = release?.dmg ?? release?.zip ?? "https://github.com/yashashwi-s/Arras/releases/latest";
  const tag = release?.tag ?? null;
  const verifiedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(dateModified));
  const downloadCount = downloads?.total
    ? new Intl.NumberFormat("en-US").format(downloads.total)
    : null;

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
            href="https://puremac.yashashwi.me"
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
            GitHub
            <ArrowUpRight size={12} />
          </a>
        </header>

        {/* --------------------------------------------------------------- hero */}
        <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 sm:pt-24">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            <Image
              src="/puremac/arras-icon.png"
              alt="Arras app icon"
              width={26}
              height={26}
              className="rounded-[7px]"
            />
            <span className="text-white/75">Arras</span>
            {tag && (
              <>
                <span className="text-white/15">/</span>
                <a
                  href={release?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                  style={{ color: AMBER }}
                >
                  {tag}
                </a>
              </>
            )}
            <span className="text-white/15">/</span>
            <span>macOS 14+</span>
          </div>

          <h1 className="mt-7 max-w-6xl text-[clamp(3rem,10.6vw,8.1rem)] font-extrabold leading-[0.88] tracking-[-0.055em]">
            A photo widget for Mac that never crops.
          </h1>

          <p className="display mt-6 text-[clamp(1.45rem,3.3vw,2.4rem)] font-bold tracking-[-0.035em] text-white/28">
            Your photos. Not squares.
          </p>

          <div className="mt-9 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
            <div>
              <p className="max-w-xl text-[16px] leading-[1.65] text-white/65 sm:text-[17px]">
                Put any photo on your desktop at its original shape. Resize it,
                layer it, or rotate several photos in the same spot.
              </p>
              <p className="mt-4 font-mono text-[10.5px] uppercase leading-[1.8] tracking-[0.13em] text-white/42">
                Free · Open source · Native · No telemetry
              </p>

              <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
                <a
                  href={downloadUrl}
                  data-cursor="snap"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-semibold text-black transition-transform hover:scale-[1.03]"
                  style={{ backgroundColor: AMBER }}
                >
                  <Download size={16} strokeWidth={2.4} />
                  Download for Mac
                </a>
                <a
                  href="https://github.com/yashashwi-s/Arras"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="snap"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/16 px-6 py-3.5 text-[14px] font-semibold text-white/75 transition-colors hover:border-white/35 hover:text-white"
                >
                  <GithubIcon size={16} />
                  GitHub
                </a>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-end border-t border-white/8 pt-6 md:max-w-sm md:justify-self-end">
              {[
                tag ? ["latest release", tag] : null,
                downloadCount ? ["GitHub downloads", downloadCount] : null,
                ["requires", "macOS 14+, Apple Silicon"],
                ["license", "MIT"],
              ].filter(Boolean).map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                    {k}
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium text-white/75">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-8 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/30">
            <time dateTime={dateModified}>Page checked {verifiedDate}</time>
            <span aria-hidden>·</span>
            <a
              href="#install"
              className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-white/65"
            >
              Install notes
            </a>
          </p>
        </section>

        {/* -------------------------------------------------------------- video */}
        <figure ref={videoWrap} className="mx-auto max-w-6xl px-5 pt-12 sm:px-8 sm:pt-16">
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
              aria-label="Arras photo widgets arranged at different shapes and sizes on a Mac desktop"
            />
          </motion.div>
          <figcaption className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/30">
            Arras running on macOS. Every photo keeps its own proportions.
          </figcaption>
        </figure>

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

        {/* ------------------------------------------------------ main benefits */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            The useful part
          </p>
          <h2 className="mt-5 max-w-2xl text-[clamp(2rem,5.4vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            Four things Arras does.
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {BENEFITS.map((benefit, i) => (
              <motion.article
                key={benefit.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#0d0b15] p-6 sm:p-8"
              >
                <span className="font-mono text-[11px] tracking-[0.12em]" style={{ color: AMBER }}>
                  {benefit.n}
                </span>
                <h3 className="mt-7 text-[22px] font-bold tracking-[-0.025em] sm:text-[26px]">
                  {benefit.title}
                </h3>
                <p className="mt-3 max-w-md text-[14.5px] leading-[1.7] text-white/50">
                  {benefit.body}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- comparison */}
        <section className="mx-auto max-w-6xl border-t border-white/8 px-5 py-24 sm:px-8 sm:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            Direct comparison
          </p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.8vw,3.3rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            How is Arras different from the macOS Photos widget?
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-white/52">
            The Photos widget fits images into Apple&apos;s supported widget sizes. Arras
            gives the window the same proportions as the source image.
          </p>

          <div className="mt-12 grid items-end gap-8 sm:grid-cols-2 sm:gap-10">
            <figure>
              <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-[20px] border border-white/10 bg-black">
                <Image
                  src="/puremac/arras/demo-poster.jpg"
                  alt="Arras desktop screenshot clipped to a square fixed widget frame"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-semibold text-white/72">Apple Photos widget</span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/32">
                  fixed frame crops
                </span>
              </figcaption>
            </figure>

            <figure>
              <div className="relative aspect-[1470/956] w-full overflow-hidden rounded-[20px] border bg-black" style={{ borderColor: AMBER }}>
                <Image
                  src="/puremac/arras/demo-poster.jpg"
                  alt="Full Arras desktop screenshot shown at its original landscape aspect ratio"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-semibold" style={{ color: AMBER }}>Arras</span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/42">
                  original shape stays
                </span>
              </figcaption>
            </figure>
          </div>

          <div className="mt-12 overflow-x-auto border-y border-white/10">
            <table className="w-full min-w-[660px] border-collapse text-left">
              <caption className="sr-only">
                Arras compared with the built-in macOS Photos widget
              </caption>
              <thead>
                <tr className="border-b border-white/10 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/35">
                  <th scope="col" className="px-4 py-4 font-normal sm:px-6">Capability</th>
                  <th scope="col" className="px-4 py-4 font-normal sm:px-6">macOS Photos widget</th>
                  <th scope="col" className="px-4 py-4 font-normal sm:px-6" style={{ color: AMBER }}>Arras</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([capability, macOS, arras]) => (
                  <tr key={capability} className="border-b border-white/8 last:border-b-0">
                    <th scope="row" className="px-4 py-5 text-[14px] font-semibold text-white/72 sm:px-6">
                      {capability}
                    </th>
                    <td className="px-4 py-5 text-[14px] leading-[1.6] text-white/42 sm:px-6">{macOS}</td>
                    <td className="px-4 py-5 text-[14px] leading-[1.6] text-white/68 sm:px-6">{arras}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/30">
            <span>Sources</span>
            <a
              href="https://support.apple.com/guide/mac-help/mchl52be5da5/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-white/65"
            >
              Apple widget guide
            </a>
            <a
              href="https://github.com/yashashwi-s/Arras"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-white/65"
            >
              Arras documentation
            </a>
          </p>
        </section>

        {/* ------------------------------------------------------------ features */}
        <section className="mx-auto max-w-6xl border-t border-white/8 px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-20 lg:self-start">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
                More control
              </p>
              <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                The details live down here.
              </h2>
              <p className="mt-6 max-w-xs text-[14.5px] leading-[1.7] text-white/45">
                These are useful once the photos are on your desktop. You do not
                need to configure them before you start.
              </p>
            </div>

            <ul className="space-y-0">
              {ADVANCED_FEATURES.map((f, i) => (
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
            {[
              ["memory", "~20 MB"],
              ["idle cpu", "~0%"],
              ["requires", "macOS 14+"],
              ["silicon", "Apple only"],
              ["license", "MIT"],
              ["telemetry", "none"],
            ].map(([k, v]) => (
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
            How do I install Arras?
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-white/50">
            Arras is distributed outside the Mac App Store and is not notarized.
            macOS may ask for one approval before the first launch. Both methods
            below install the same public release from GitHub.
          </p>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: AMBER }}>
                  01
                </span>
                <h3 className="text-[19px] font-bold tracking-[-0.02em]">Homebrew</h3>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
                  three commands
                </span>
              </div>
              <p className="mt-3 max-w-md text-[14.5px] leading-[1.7] text-white/50">
                The first two commands install Arras. The last command removes the
                downloaded-file quarantine flag from Arras only, so macOS can open it.
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
                  one approval
                </span>
              </div>
              <p className="mt-3 max-w-md text-[14.5px] leading-[1.7] text-white/50">
                macOS may stop the first launch because the current build is not
                notarized. Approve Arras once in Privacy &amp; Security, then open it normally.
              </p>
              <ol className="mt-5 space-y-3">
                {[
                  "Open the .dmg and drag Arras onto Applications",
                  "Launch it. If macOS says it cannot verify the app, click Done",
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
                Download for Mac
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
          <h2 className="mt-5 max-w-2xl text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            Why was Tableau renamed Arras?
          </h2>
          <p className="mt-6 max-w-2xl text-[14.5px] leading-[1.7] text-white/45">
            The name changed to avoid confusion with Tableau&apos;s data-visualization
            product. Arras kept the same bundle identifier, settings, saved photos,
            and in-place update path, so the rename did not create a separate app.
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
            data-visualization brand. Arras is a woven wall hanging, which is
            closer to the point of arranging pictures on a surface.
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
                Free and open source.
                <br />
                <span className="text-white/25">No account. No telemetry.</span>
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
