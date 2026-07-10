"use client";

import Image from "next/image";
import { Download, Code2, ArrowUpRight, ArrowLeft } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";

const APPS = [
  {
    id: "fadeo",
    name: "Fadeo",
    icon: "/puremac/fadeo-icon.png",
    tagline: "The right sound for what you're doing, automatically.",
    description:
      "Fadeo watches your workflow: the app in front, the desktop you're on, whether you're in a meeting. It plays, fades, or switches audio to match. Every rule is yours to define, down to the second.",
    features: [
      "Per-app and per-workspace audio rules, down to fade timing",
      "Ambient noise synthesized on-device, no shipped audio files",
      "Meeting-aware, Focus-mode-aware, zero steady-state polling",
      "Idle CPU near 0%, single-digit MB resident",
    ],
    accent: "#67e4d2",
    license: "Open source · GPLv3",
    price: "$2 lifetime license",
    priceNote: "Fully functional either way. The license just removes a small reminder.",
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
    features: [
      "Any aspect ratio, exactly as shot",
      "Floating mode: click-through, stays above windows",
      "Folder rotation with custom intervals",
      "~20MB RAM, zero CPU at idle",
    ],
    accent: "#f2b06d",
    license: "Open source · MIT",
    price: "Free",
    priceNote: null,
    repo: "Tableau",
  },
];

function AppCard({ app, release }) {
  const downloadUrl = release?.dmg ?? release?.zip ?? null;
  const downloadLabel = release?.dmg ? "Download .dmg" : release?.zip ? "Download .zip" : null;

  return (
    <section
      className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 flex flex-col gap-6"
      style={{ "--accent": app.accent }}
    >
      <div className="flex items-start gap-5">
        <Image
          src={app.icon}
          alt={`${app.name} icon`}
          width={72}
          height={72}
          className="rounded-[18px] shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-semibold tracking-tight">{app.name}</h2>
            {app.page && (
              <a
                href={app.page}
                className="text-[11.5px] font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/70 hover:bg-white/15 hover:text-white transition-colors"
                data-cursor="snap"
              >
                Learn more
              </a>
            )}
          </div>
          <p className="text-white/60 mt-1 text-[15px] leading-snug">{app.tagline}</p>
        </div>
      </div>

      <p className="text-white/70 text-[15px] leading-relaxed">{app.description}</p>

      <ul className="flex flex-col gap-2">
        {app.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-white/55">
            <span
              className="mt-[7px] h-1 w-1 rounded-full shrink-0"
              style={{ backgroundColor: app.accent }}
            />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-white/45">{app.license}</span>
          <span className="font-medium" style={{ color: app.accent }}>
            {app.price}
          </span>
        </div>
        {app.priceNote && (
          <p className="text-[12px] text-white/35 leading-snug -mt-1">{app.priceNote}</p>
        )}

        <div className="flex items-center gap-3 pt-1">
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
        <div className="mb-16">
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

        <div className="grid sm:grid-cols-2 gap-6">
          {APPS.map((app) => (
            <AppCard key={app.id} app={app} release={releases[app.id]} />
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
