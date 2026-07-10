"use client";

import Image from "next/image";
import {
  Download,
  Code2,
  ArrowUpRight,
  ArrowLeft,
  Gauge,
  Layers,
  ShieldCheck,
  Crop,
  MousePointerClick,
} from "lucide-react";
import CustomCursor from "@/components/CustomCursor";

const APPS = [
  {
    id: "fadeo",
    name: "Fadeo",
    icon: "/puremac/fadeo-icon.png",
    tagline: "The right sound for what you're doing, automatically.",
    description:
      "Fadeo watches your workflow: the app in front, the desktop you're on, whether you're in a meeting. It plays, fades, or switches audio to match. Every rule is yours to define, down to the second.",
    stats: [
      { icon: Gauge, label: "near 0% idle CPU" },
      { icon: Layers, label: "no steady-state polling" },
      { icon: ShieldCheck, label: "never touches system volume" },
    ],
    accent: "#67e4d2",
    license: "Open source · GPLv3",
    price: "pay what you want",
    repo: "Fadeo",
    page: "/fadeo",
  },
  {
    id: "tableau",
    name: "Tableau",
    icon: "/puremac/tableau-icon.png",
    tagline: "Any photo, perfectly fitted on your desktop.",
    description:
      "Tableau places photos directly on your desktop as borderless, always-on overlays that match each image's real aspect ratio: no cropping, no black bars, no forced grid sizes.",
    stats: [
      { icon: Crop, label: "any aspect ratio, exactly as shot" },
      { icon: MousePointerClick, label: "click-through floating mode" },
      { icon: Gauge, label: "~20MB RAM, zero CPU idle" },
    ],
    accent: "#f2b06d",
    license: "Open source · MIT",
    price: "Free",
    repo: "Tableau",
    page: "/tableau",
  },
];

function AppRow({ app, release }) {
  const downloadUrl = release?.dmg ?? release?.zip ?? null;
  const downloadLabel = release?.dmg ? "Download .dmg" : release?.zip ? "Download .zip" : null;

  return (
    <section className="py-12 first:pt-0 border-b border-white/8 last:border-b-0">
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-10">
        <a href={app.page} className="group flex items-start gap-5 sm:flex-col sm:items-start sm:w-40 shrink-0" data-cursor="snap">
          <Image
            src={app.icon}
            alt={`${app.name} icon`}
            width={80}
            height={80}
            className="rounded-[20px] shrink-0 transition-transform duration-300 group-hover:scale-[1.04] group-hover:-translate-y-0.5"
          />
          <div className="sm:mt-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-2xl font-semibold tracking-tight group-hover:text-white/80 transition-colors">
                {app.name}
              </h2>
              <ArrowUpRight
                size={16}
                className="text-white/30 -translate-x-0.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              />
            </div>
            <p className="text-[13px] mt-0.5" style={{ color: app.accent }}>
              {app.price}
            </p>
          </div>
        </a>

        <div className="flex-1 min-w-0">
          <p className="text-white/70 text-[16px] leading-relaxed max-w-lg">{app.description}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-2.5 mt-5">
            {app.stats.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-[13px] text-white/45">
                <s.icon size={14} className="shrink-0" />
                {s.label}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-6">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium text-black transition-opacity hover:opacity-85"
                style={{ backgroundColor: app.accent }}
                data-cursor="snap"
              >
                <Download size={15} strokeWidth={2.25} />
                {downloadLabel}
                {release?.tag && <span className="opacity-60 font-normal">{release.tag}</span>}
              </a>
            ) : (
              <a
                href={`https://github.com/yashashwi-s/${app.repo}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13.5px] font-medium text-white/80 transition-colors hover:border-white/30"
                data-cursor="snap"
              >
                Build from source
                <ArrowUpRight size={14} />
              </a>
            )}
            <a
              href={`https://github.com/yashashwi-s/${app.repo}`}
              className="inline-flex items-center gap-1.5 text-[13px] text-white/45 hover:text-white/75 transition-colors"
              data-cursor="snap"
            >
              <Code2 size={14} />
              Source
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PureMacClient({ fadeo, tableau }) {
  const releases = { fadeo, tableau };

  return (
    <div id="puremac-page" className="cursor-auto min-h-screen bg-[#050505] text-white" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
      {/* The portfolio's root layout renders a global film-grain/static overlay
          (.noise-bg) as a sibling of this tree. It fits the main site's look but not
          PureMac's. Root layout is shared and off-limits, so suppress it scoped to this
          page only, via a selector that requires #puremac-page to be present. */}
      <style>{`body:has(#puremac-page) .noise-bg { display: none; }`}</style>
      <CustomCursor />

      <header className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 pb-2 flex items-center justify-between">
        <a
          href="https://yashashwi.me"
          className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors"
          data-cursor="snap"
        >
          <ArrowLeft size={13} />
          yashashwi.me
        </a>
        <span className="text-[13px] text-white/30">by Yashashwi Singhania</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 pt-16 pb-24">
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#67e4d2" }} />
            <span className="text-[13px] tracking-wide text-white/45 uppercase">PureMac</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] max-w-xl">
            Small, native macOS apps.
          </h1>
          <p className="text-white/55 text-[16px] mt-4 max-w-lg leading-relaxed">
            No Electron, no subscriptions, no telemetry you didn't ask for. Built for macOS,
            signed ad-hoc, fully open source. Audit every line or build it yourself.
          </p>
        </div>

        <div>
          {APPS.map((app) => (
            <AppRow key={app.id} app={app} release={releases[app.id]} />
          ))}
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-6 sm:px-8 pb-14 flex items-center justify-between text-[12.5px] text-white/30">
        <span>Ad-hoc signed. Gatekeeper will ask once, which is expected for indie apps outside the App Store.</span>
        <a
          href="https://github.com/yashashwi-s"
          className="hover:text-white/60 transition-colors shrink-0 ml-4"
          data-cursor="snap"
        >
          github.com/yashashwi-s
        </a>
      </footer>
    </div>
  );
}
