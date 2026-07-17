"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Download,
  Code2,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Gift,
  Mail,
  Layers,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import CustomCursor from "@/components/CustomCursor";

const ACCENT = "#67e4d2";

const BANDS = [
  {
    n: "01",
    title: "Override",
    body: "Any workspace marked as an override that matches pre-empts everything else. \"Meetings\" pausing audio unconditionally is the canonical example.",
  },
  {
    n: "02",
    title: "Candidates",
    body: "Every enabled, non-override workspace whose rules currently hold becomes a candidate. Usually there's one. Sometimes several apps overlap.",
  },
  {
    n: "03",
    title: "Tiebreak chain",
    body: "When more than one candidate matches, an ordered chain narrows it to one: stickiness, specificity, priority, recency, stable order. You control the order.",
  },
  {
    n: "04",
    title: "Fallback",
    body: "Nothing matched. Keep the current audio, resume whatever played before, or fade to silence. Your call, set once.",
  },
];

const SCREENSHOTS = [
  {
    src: "/puremac/fadeo/screenshot-workspaces.png",
    title: "Workspaces",
    body: "Define what a workspace is: which apps pull you into it, which Space, whether it needs a meeting or a Focus mode, even a time window. Apps can be \"weak\": they keep a workspace playing but never yank you into it.",
  },
  {
    src: "/puremac/fadeo/screenshot-precedence.png",
    title: "Precedence",
    body: "The tiebreak chain, the fallback behavior, and global fade timing, all editable, all with real numeric fields, not just sliders you have to eyeball.",
  },
  {
    src: "/puremac/fadeo/screenshot-soundlibrary.png",
    title: "Sound Library",
    body: "Ambient noise is synthesized on-device in real time. No shipped audio files, no looping seams. Or conduct Spotify and Apple Music directly, including specific playlists.",
  },
];

const STATS = [
  { icon: Gauge, label: "Idle CPU", value: "near 0%" },
  { icon: Layers, label: "Steady-state polling", value: "none, all OS push" },
  { icon: ShieldCheck, label: "System volume touched", value: "never" },
];

function SubscribeBand() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/fadeo-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "fadeo-page" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setError("Couldn't reach the server. Try again.");
      setState("error");
    }
  }

  return (
    <section className="py-20 border-t border-white/8">
      <div className="mx-auto max-w-xl text-center">
        <div className="inline-flex items-center gap-2 mb-4 text-white/40">
          <Mail size={15} />
          <span className="text-[13px] tracking-wide uppercase">Stay in the loop</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">Hear when Fadeo gets better.</h3>
        <p className="text-white/55 text-[15px] mt-3 leading-relaxed">
          An occasional note when there's a real new release worth your time. No spam, no more than a
          handful a year, and one reply unsubscribes you.
        </p>

        {state === "done" ? (
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[14px] text-white/80">
            <Check size={16} style={{ color: ACCENT }} />
            You're on the list. Thanks.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full flex-1 rounded-full border border-white/12 bg-black/30 px-5 py-3 text-[14px] text-white/85 placeholder:text-white/30 outline-none focus:border-white/35 transition-colors"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="shrink-0 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-black transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ backgroundColor: ACCENT }}
              data-cursor="snap"
            >
              {state === "sending" ? "Adding…" : "Notify me"}
              {state !== "sending" && <ArrowRight size={15} />}
            </button>
          </form>
        )}
        {state === "error" && <p className="text-red-400/80 text-[13px] mt-3">{error}</p>}
      </div>
    </section>
  );
}

function Screenshot({ shot, reverse }) {
  return (
    <div className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${reverse ? "md:[direction:rtl]" : ""}`}>
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40" style={{ direction: "ltr" }}>
        <Image src={shot.src} alt={`${shot.title} screenshot`} width={1800} height={1264} className="w-full h-auto" />
      </div>
      <div style={{ direction: "ltr" }}>
        <h3 className="text-xl font-semibold tracking-tight mb-3">{shot.title}</h3>
        <p className="text-white/60 text-[15px] leading-relaxed max-w-md">{shot.body}</p>
      </div>
    </div>
  );
}

function GiveawayCard({ initialPromo }) {
  const [promo, setPromo] = useState(initialPromo);
  const [state, setState] = useState("idle");
  const [licenseKey, setLicenseKey] = useState(null);
  const [claimNumber, setClaimNumber] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [mustActivateBy, setMustActivateBy] = useState(null);
  const [emailed, setEmailed] = useState(false);

  // Restore a previously claimed key after mount, never during render: this component is
  // server-rendered too, and reading localStorage in a useState initializer causes a
  // hydration mismatch for anyone who already claimed.
  useEffect(() => {
    const saved = localStorage.getItem("fadeo-promo-key");
    if (saved) {
      setLicenseKey(saved);
      setState("claimed");
    }
  }, []);

  async function claim() {
    setState("claiming");
    setError(null);
    try {
      const res = await fetch("/api/fadeo-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setState("idle");
        return;
      }
      setLicenseKey(data.key);
      setClaimNumber(data.claimNumber);
      setMustActivateBy(data.mustActivateBy);
      setEmailed(Boolean(data.emailed));
      localStorage.setItem("fadeo-promo-key", data.key);
      setState("claimed");
      setPromo((p) => ({ ...p, claimed: data.claimNumber }));
    } catch {
      setError("Couldn't reach the server. Try again.");
      setState("idle");
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const remaining = promo?.max != null && promo?.claimed != null ? Math.max(0, promo.max - promo.claimed) : null;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-8 sm:p-10">
      <div className="flex items-center gap-2 mb-4">
        <Gift size={16} style={{ color: ACCENT }} />
        <span className="text-[13px] tracking-wide uppercase font-medium" style={{ color: ACCENT }}>
          First 100, free
        </span>
      </div>

      {state === "claimed" ? (
        <div>
          <p className="text-white/85 text-[15px] mb-1">
            {claimNumber ? `You're #${claimNumber}. ` : ""}Here's your license key:
          </p>
          <div className="mt-3 flex items-stretch gap-2">
            <code className="flex-1 min-w-0 truncate rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[12.5px] text-white/80 font-mono">
              {licenseKey}
            </code>
            <button
              onClick={copyKey}
              className="shrink-0 rounded-xl border border-white/15 px-4 flex items-center gap-2 text-[13px] text-white/70 hover:border-white/30 transition-colors"
              data-cursor="snap"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-white/40 text-[12.5px] mt-3 leading-relaxed">
            Open Fadeo, About, Enter License Key. Your key also stays saved in this browser, so it
            will still be here if you come back on this device. Copy it somewhere safe anyway.
            {emailed && " We also emailed you a copy."}
          </p>
          {mustActivateBy && (
            <p className="text-white/40 text-[12.5px] mt-1.5 leading-relaxed">
              Activate it by {new Date(mustActivateBy).toDateString()} (7 days). An unused code expires after
              that and returns to the pool. Once activated, it's yours for good.
            </p>
          )}
        </div>
      ) : (
        <div>
          <p className="text-white/60 text-[15px] leading-relaxed max-w-md">
            The first 100 people who ask get a lifetime license free, no card required. When they're gone or the
            window closes, this card disappears and it's back to paying what you want.
          </p>

          {promo == null || !promo.active ? (
            <p className="text-white/35 text-[13px] mt-5">
              {promo?.claimed != null && promo.max != null && promo.claimed >= promo.max
                ? "All 100 have been claimed. Thank you."
                : "Not live right now, check back soon."}
            </p>
          ) : (
            <>
              {remaining != null && (
                <div className="mt-5 mb-4">
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${((promo.max - remaining) / promo.max) * 100}%`, backgroundColor: ACCENT }}
                    />
                  </div>
                  <p className="text-white/40 text-[12.5px] mt-2">{remaining} of {promo.max} left</p>
                </div>
              )}
              <input
                type="email"
                aria-label="Email address (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email me a copy too (optional)"
                className="w-full max-w-xs rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-[13px] text-white/80 placeholder:text-white/30 outline-none focus:border-white/30 mb-3"
              />
              <div>
                <button
                  onClick={claim}
                  disabled={state === "claiming"}
                  className="mt-1 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium text-black transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ backgroundColor: ACCENT }}
                  data-cursor="snap"
                >
                  {state === "claiming" ? "Claiming…" : "Claim a free license"}
                </button>
              </div>
              <p className="text-white/35 text-[12px] mt-3">Must be activated within 7 days, or the code expires.</p>
              {error && <p className="text-red-400/80 text-[12.5px] mt-3">{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function FadeoClient({ release, initialPromo, paymentLink }) {
  const downloadUrl = release?.dmg ?? release?.zip ?? null;
  const downloadLabel = release?.dmg ? "Download .dmg" : release?.zip ? "Download .zip" : null;
  const checkoutUrl = paymentLink || "mailto:fadeo.puremac@gmail.com?subject=Fadeo%20license";
  const checkoutLabel = paymentLink ? "Get a license" : "Get a license (email)";

  return (
    <div id="puremac-page" className="cursor-auto min-h-screen overflow-x-clip bg-[#050505] text-white" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
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
        {/* Hero: the interactive demo is the centerpiece, everything else frames it */}
        <section className="pt-14 sm:pt-20 pb-16 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <Image
              src="/puremac/fadeo-icon.png"
              alt="Fadeo icon"
              width={30}
              height={30}
              className="rounded-[8px]"
            />
            <span className="text-[14px] text-white/70 font-medium">Fadeo</span>
            <span className="text-white/20">·</span>
            <span className="text-[14px] text-white/40">macOS 14 and later</span>
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.04]">
            The right sound for what you're doing, automatically.
          </h1>
          <p className="mx-auto max-w-xl text-white/55 text-[16.5px] mt-6 leading-relaxed">
            Fadeo watches the app in front of you, the desktop you're on, whether you're in a
            meeting or heads-down, and plays, fades, or switches audio to match. Rules you define,
            down to the second.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-9">
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
                href="https://github.com/yashashwi-s/Fadeo"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[14px] font-medium text-white/80 transition-colors hover:border-white/30"
                data-cursor="snap"
              >
                Build from source
                <ArrowUpRight size={15} />
              </a>
            )}
            <a
              href="https://github.com/yashashwi-s/Fadeo"
              className="inline-flex items-center gap-1.5 text-[13.5px] text-white/45 hover:text-white/75 transition-colors"
              data-cursor="snap"
            >
              <Code2 size={15} />
              View source
            </a>
          </div>

          <div className="mx-auto max-w-lg grid grid-cols-3 gap-4 mt-16">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center">
                <s.icon size={16} className="text-white/40 mb-2" />
                <p className="text-[13.5px] font-medium">{s.value}</p>
                <p className="text-[12px] text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it thinks */}
        <section className="py-20 border-t border-white/8">
          <p className="text-[13px] tracking-wide uppercase text-white/40 mb-3">How it decides</p>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight max-w-lg mb-12">
            Four ordered bands, every time, no surprises.
          </h3>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
            {BANDS.map((b) => (
              <div key={b.n}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[13px] font-mono" style={{ color: ACCENT }}>{b.n}</span>
                  <h4 className="text-[16px] font-medium">{b.title}</h4>
                </div>
                <p className="text-white/55 text-[14.5px] leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Screenshots */}
        <section className="py-20 border-t border-white/8 flex flex-col gap-20">
          {SCREENSHOTS.map((shot, i) => (
            <Screenshot key={shot.title} shot={shot} reverse={i % 2 === 1} />
          ))}
        </section>

        {/* Pricing + giveaway */}
        <section className="py-20 border-t border-white/8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 flex flex-col">
              <p className="text-[13px] tracking-wide uppercase text-white/40 mb-3">Pricing</p>
              <p className="text-3xl font-semibold tracking-tight mb-1">Pay what you want</p>
              <p className="text-white/50 text-[14px] mb-6">$2 minimum, lifetime, one time</p>
              <p className="text-white/60 text-[14.5px] leading-relaxed">
                Fadeo is fully functional without a license, forever. The license just removes
                a small, occasional reminder. Pay $2 if that's what you can spare, or more if
                you use it daily and it feels worth it, you decide. Source is GPLv3; read it,
                fork it, build it yourself for free.
              </p>
              <a
                href={checkoutUrl}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium text-black transition-opacity hover:opacity-85 self-start"
                style={{ backgroundColor: ACCENT }}
                data-cursor="snap"
              >
                {checkoutLabel}
              </a>
              {!paymentLink && (
                <p className="text-[12px] text-white/35 mt-2.5">
                  Checkout is coming soon. For now this opens an email, reply with what you'd
                  like to pay and I'll send a key back.
                </p>
              )}
              <p className="text-[12px] text-white/35 mt-2.5">
                Your license key arrives by email within a few minutes of purchase. If it
                doesn't show up, check your spam folder first.
              </p>
              <a
                href="https://github.com/yashashwi-s/Fadeo"
                className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] text-white/45 hover:text-white/75 transition-colors"
                data-cursor="snap"
              >
                <Code2 size={14} />
                Read the source
              </a>
            </div>

            <GiveawayCard initialPromo={initialPromo} />
          </div>
        </section>

        {/* Email capture */}
        <SubscribeBand />
      </main>

      <footer className="max-w-4xl mx-auto px-6 sm:px-8 pb-14 pt-6 border-t border-white/8 flex items-center justify-between text-[12.5px] text-white/30">
        <span>Ad-hoc signed. Gatekeeper will ask once, which is expected for indie apps outside the App Store.</span>
        <a
          href="https://github.com/yashashwi-s/Fadeo"
          className="hover:text-white/60 transition-colors shrink-0 ml-4"
          data-cursor="snap"
        >
          github.com/yashashwi-s/Fadeo
        </a>
      </footer>
    </div>
  );
}
