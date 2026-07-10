"use client";

import Image from "next/image";
import {
  Download,
  Code2,
  ArrowUpRight,
  ArrowLeft,
  Crop,
  Pin,
  Move,
  PictureInPicture,
  FolderOpen,
  SlidersHorizontal,
  Gauge,
} from "lucide-react";
import CustomCursor from "@/components/CustomCursor";

const ACCENT = "#f2b06d";

const FEATURES = [
  {
    icon: Crop,
    title: "Any aspect ratio",
    body: "Each photo gets its own custom-sized window matching its real proportions. A 16:9 landscape stays 16:9. No cropping, no black bars, no forced grid.",
  },
  {
    icon: Pin,
    title: "Lock position",
    body: "Right-click any photo to lock it in place, or leave it free to drag anywhere on the desktop.",
  },
  {
    icon: Move,
    title: "Corner resize",
    body: "Drag any corner to resize. Aspect ratio stays locked automatically, so nothing ever distorts.",
  },
  {
    icon: PictureInPicture,
    title: "Floating mode",
    body: "Turn any photo into a floating reference that stays above every window. Click-through by default; hold Option to interact with it at any time.",
  },
  {
    icon: FolderOpen,
    title: "Smart canvas",
    body: "Point a widget at a folder instead of a single photo. It rotates on click, on a timer, or on a custom interval as low as 5 seconds.",
  },
  {
    icon: SlidersHorizontal,
    title: "Per-photo opacity",
    body: "Scroll on any photo to adjust its opacity from 10% to 100%, independently of every other photo on the desktop.",
  },
];

export default function TableauClient({ release }) {
  const downloadUrl = release?.dmg ?? release?.zip ?? null;
  const downloadLabel = release?.dmg ? "Download .dmg" : release?.zip ? "Download .zip" : null;

  return (
    <div id="puremac-page" className="cursor-auto min-h-screen bg-[#050505] text-white" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
      <style>{`body:has(#puremac-page) .noise-bg { display: none; }`}</style>
      <CustomCursor />

      <header className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 pb-2 flex items-center justify-between">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors"
          data-cursor="snap"
        >
          <ArrowLeft size={13} />
          PureMac
        </a>
        <span className="text-[13px] text-white/30">by Yashashwi Singhania</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Hero */}
        <section className="pt-20 pb-16">
          <div className="flex items-center gap-5 mb-8">
            <Image
              src="/puremac/tableau-icon.png"
              alt="Tableau icon"
              width={72}
              height={72}
              className="rounded-[18px]"
            />
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Tableau</h1>
              <p className="text-white/55 text-[15px] mt-0.5">for macOS 14 and later, formerly Photo Widget OSX</p>
            </div>
          </div>

          <h2 className="text-4xl sm:text-[3.2rem] font-semibold tracking-tight leading-[1.08] max-w-2xl">
            Any photo, perfectly fitted on your desktop.
          </h2>
          <p className="text-white/55 text-[16.5px] mt-5 max-w-lg leading-relaxed">
            Tableau places photos directly on your desktop as borderless, always-on overlays
            that match each image's real aspect ratio. Unlike Apple's built-in widgets, nothing
            gets locked to a fixed size or cropped to fit.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-9">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-black transition-opacity hover:opacity-85"
                style={{ backgroundColor: ACCENT }}
                data-cursor="snap"
              >
                <Download size={16} strokeWidth={2.25} />
                {downloadLabel}
                {release?.tag && <span className="opacity-60 font-normal">{release.tag}</span>}
              </a>
            ) : (
              <a
                href="https://github.com/yashashwi-s/Tableau"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[14px] font-medium text-white/80 transition-colors hover:border-white/30"
                data-cursor="snap"
              >
                Build from source
                <ArrowUpRight size={15} />
              </a>
            )}
            <a
              href="https://github.com/yashashwi-s/Tableau"
              className="inline-flex items-center gap-1.5 text-[13.5px] text-white/45 hover:text-white/75 transition-colors"
              data-cursor="snap"
            >
              <Code2 size={15} />
              View source
            </a>
            <span className="text-[13.5px] text-white/35">Free, open source, MIT</span>
          </div>
        </section>

        {/* Demo */}
        <section className="pb-20">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
            <video
              src="/puremac/tableau/demo.mp4"
              poster="/puremac/tableau/demo-poster.jpg"
              className="w-full h-auto block"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </section>

        {/* Features */}
        <section className="py-20 border-t border-white/8">
          <p className="text-[13px] tracking-wide uppercase text-white/40 mb-3">Features</p>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight max-w-lg mb-12">
            Every photo, exactly as shot.
          </h3>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <f.icon size={18} style={{ color: ACCENT }} className="mb-3" />
                <h4 className="text-[16px] font-medium mb-1.5">{f.title}</h4>
                <p className="text-white/55 text-[14.5px] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 border-t border-white/8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
            <div className="flex-1">
              <p className="text-[13px] tracking-wide uppercase text-white/40 mb-3">Pricing</p>
              <p className="text-3xl font-semibold tracking-tight mb-2">Free</p>
              <p className="text-white/60 text-[14.5px] leading-relaxed max-w-md">
                Tableau is free, always. Source is MIT; read it, fork it, ship your own build.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-white/40">
              <Gauge size={15} />
              ~20MB RAM, zero CPU at idle
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto px-6 sm:px-8 pb-14 pt-6 border-t border-white/8 flex items-center justify-between text-[12.5px] text-white/30">
        <span>Ad-hoc signed. Gatekeeper will ask once, which is expected for indie apps outside the App Store.</span>
        <a
          href="https://github.com/yashashwi-s/Tableau"
          className="hover:text-white/60 transition-colors shrink-0 ml-4"
          data-cursor="snap"
        >
          github.com/yashashwi-s/Tableau
        </a>
      </footer>
    </div>
  );
}
