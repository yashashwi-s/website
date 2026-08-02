"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Download,
  Gift,
  Mail,
} from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import { GRAIN } from "../grain";

/* Fadeo is an audio app that decides things, so the page is built like a signal
   chain: one column, top to bottom, every stage numbered and metered. Teal on
   near-black is the oscilloscope reading it borrows from. Deliberately nothing
   like Arras next door — that page is a gallery wall, this one is a rack unit. */
const TEAL = "#67e4d2";
const DIM = "#2b6f66";

const STATS = [
  { k: "idle cpu", v: "~0%" },
  { k: "polling", v: "none" },
  { k: "system volume", v: "untouched" },
];

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

/* A static level-meter strip. Purely decorative, but it is the page's one motif
   and it carries the "audio" idea without an animation loop running forever. */
function Meter({ bars = 34, className = "" }) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        // A fixed pseudo-random envelope: deterministic, so server and client
        // render the same thing and hydration stays quiet.
        const h = 6 + ((i * 37) % 23) + (i % 5 === 0 ? 10 : 0);
        const hot = i > bars - 7;
        return (
          <span
            key={i}
            className="w-[3px] rounded-full"
            style={{ height: h, backgroundColor: hot ? TEAL : DIM, opacity: hot ? 0.9 : 0.5 }}
          />
        );
      })}
    </div>
  );
}

function Rule({ label }) {
  return (
    <div className="flex items-center gap-4 py-1">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/25">{label}</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

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
    <section className="py-20">
      <Rule label="mailing list" />
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <h3 className="display text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Hear when Fadeo
            <br />
            gets better.
          </h3>
          <p className="mt-4 max-w-sm text-[14.5px] leading-[1.7] text-white/45">
            An occasional note when there is a real release worth your time. No more
            than a handful a year, and one reply unsubscribes you.
          </p>
        </div>

        {state === "done" ? (
          <div className="flex items-center gap-2 border border-white/12 px-5 py-3.5 text-[14px] text-white/75">
            <Check size={16} style={{ color: TEAL }} />
            You&apos;re on the list. Thanks.
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="flex items-stretch border border-white/12 focus-within:border-white/30">
              <input
                type="email"
                required
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 font-mono text-[13px] text-white/85 outline-none placeholder:text-white/25"
              />
              <button
                type="submit"
                disabled={state === "sending"}
                data-cursor="snap"
                className="shrink-0 px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-black transition-opacity hover:opacity-85 disabled:opacity-50"
                style={{ backgroundColor: TEAL }}
              >
                {state === "sending" ? "…" : "Subscribe"}
              </button>
            </div>
            {error && <p className="mt-2.5 text-[12.5px] text-red-400/80">{error}</p>}
          </form>
        )}
      </div>
    </section>
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
    <div className="border border-white/12 p-7 sm:p-8" style={{ backgroundColor: "rgba(103,228,210,0.03)" }}>
      <div className="mb-5 flex items-center gap-2">
        <Gift size={14} style={{ color: TEAL }} />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em]" style={{ color: TEAL }}>
          First 100, free
        </span>
      </div>

      {state === "claimed" ? (
        <div>
          <p className="text-[15px] text-white/85">
            {claimNumber ? `You're #${claimNumber}. ` : ""}Here&apos;s your license key:
          </p>
          <div className="mt-4 flex items-stretch gap-2">
            <code className="min-w-0 flex-1 truncate border border-white/10 bg-black/40 px-4 py-3 font-mono text-[12.5px] text-white/80">
              {licenseKey}
            </code>
            <button
              onClick={copyKey}
              className="flex shrink-0 items-center gap-2 border border-white/15 px-4 text-[13px] text-white/70 transition-colors hover:border-white/30"
              data-cursor="snap"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-4 text-[12.5px] leading-relaxed text-white/40">
            Open Fadeo, About, Enter License Key. Your key also stays saved in this browser, so it
            will still be here if you come back on this device. Copy it somewhere safe anyway.
            {emailed && " We also emailed you a copy."}
          </p>
          {mustActivateBy && (
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/40">
              Activate it by {new Date(mustActivateBy).toDateString()} (7 days). An unused code expires after
              that and returns to the pool. Once activated, it&apos;s yours for good.
            </p>
          )}
        </div>
      ) : (
        <div>
          <p className="max-w-md text-[14.5px] leading-[1.7] text-white/55">
            The first 100 people who ask get a lifetime license free, no card required. When
            they&apos;re gone or the window closes, this card disappears and it&apos;s back to
            paying what you want.
          </p>

          {promo == null || !promo.active ? (
            <p className="mt-5 text-[13px] text-white/35">
              {promo?.claimed != null && promo.max != null && promo.claimed >= promo.max
                ? "All 100 have been claimed. Thank you."
                : "Not live right now, check back soon."}
            </p>
          ) : (
            <>
              {remaining != null && (
                <div className="mt-6 mb-5">
                  <div className="h-[3px] overflow-hidden bg-white/10">
                    <div
                      className="h-full transition-all"
                      style={{ width: `${((promo.max - remaining) / promo.max) * 100}%`, backgroundColor: TEAL }}
                    />
                  </div>
                  <p className="mt-2 font-mono text-[11px] tracking-[0.1em] text-white/40">
                    {remaining} of {promo.max} left
                  </p>
                </div>
              )}
              <input
                type="email"
                aria-label="Email address (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email me a copy too (optional)"
                className="mb-3 w-full max-w-xs border border-white/10 bg-black/30 px-3.5 py-2.5 font-mono text-[12.5px] text-white/80 outline-none placeholder:text-white/25 focus:border-white/30"
              />
              <div>
                <button
                  onClick={claim}
                  disabled={state === "claiming"}
                  className="mt-1 inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-black transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ backgroundColor: TEAL }}
                  data-cursor="snap"
                >
                  {state === "claiming" ? "Claiming…" : "Claim a free license"}
                </button>
              </div>
              <p className="mt-3 text-[12px] text-white/35">Must be activated within 7 days, or the code expires.</p>
              {error && <p className="mt-3 text-[12.5px] text-red-400/80">{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function FadeoClient({ release, initialPromo, paymentLink, fontClass = "" }) {
  const downloadUrl = release?.dmg ?? release?.zip ?? null;
  const downloadLabel = release?.dmg ? "Download .dmg" : release?.zip ? "Download .zip" : null;
  const checkoutUrl = paymentLink || "mailto:fadeo.puremac@gmail.com?subject=Fadeo%20license";
  const checkoutLabel = paymentLink ? "Get a license" : "Get a license (email)";

  return (
    <div
      id="fadeo-page"
      className={`${fontClass} min-h-screen overflow-x-clip bg-[#050807] text-white selection:bg-[#67e4d2] selection:text-black`}
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      {/* The root layout's grain overlay strobes (steps(1), eleven frames in 0.8s).
          Suppressed and replaced with the same texture held still. */}
      <style>{`
        body:has(#fadeo-page) .noise-bg { display: none; }
        #fadeo-page h1, #fadeo-page h2, #fadeo-page h3, #fadeo-page .display {
          font-family: var(--font-fadeo), ui-sans-serif, system-ui, sans-serif;
        }
      `}</style>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: GRAIN }} />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(90% 55% at 12% 0%, rgba(103,228,210,0.13) 0%, transparent 62%)",
        }}
      />

      <CustomCursor />

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
        {/* ------------------------------------------------------------------ nav */}
        <header className="flex items-center justify-between py-7">
          <a
            href="/"
            data-cursor="snap"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/80"
          >
            <ArrowLeft size={12} />
            PureMac
          </a>
          <a
            href="https://github.com/yashashwi-s/Fadeo"
            data-cursor="snap"
            className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/80"
          >
            Source
            <ArrowUpRight size={12} />
          </a>
        </header>

        {/* ----------------------------------------------------------------- hero */}
        <section className="pt-12 sm:pt-20">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            <Image src="/puremac/fadeo-icon.png" alt="" width={24} height={24} className="rounded-[6px]" />
            <span style={{ color: TEAL }}>Fadeo</span>
            <span className="text-white/15">/</span>
            <span>macOS 14+</span>
            {release?.tag && (
              <>
                <span className="text-white/15">/</span>
                <span>{release.tag}</span>
              </>
            )}
          </div>

          <h1 className="mt-8 max-w-4xl text-[clamp(2.6rem,7.4vw,5.4rem)] font-bold leading-[0.95] tracking-[-0.045em]">
            The right sound
            <br />
            for what you&apos;re doing,{" "}
            <span style={{ color: TEAL }}>automatically.</span>
          </h1>

          <div className="mt-10 grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
            <div>
              <p className="max-w-lg text-[16px] leading-[1.68] text-white/55">
                Fadeo watches the app in front of you, the desktop you&apos;re on, and whether
                you&apos;re in a meeting or heads-down — then plays, fades or switches audio to
                match. Rules you define, down to the second.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={downloadUrl || "https://github.com/yashashwi-s/Fadeo"}
                  data-cursor="snap"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-semibold text-black transition-transform hover:scale-[1.03]"
                  style={{ backgroundColor: TEAL }}
                >
                  <Download size={16} strokeWidth={2.4} />
                  {downloadLabel || "Build from source"}
                </a>
                <a
                  href="https://github.com/yashashwi-s/Fadeo"
                  data-cursor="snap"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/80"
                >
                  <Code2 size={13} />
                  Read the source
                </a>
              </div>
            </div>

            <div className="md:justify-self-end">
              <Meter className="mb-6 h-10" />
              <dl className="grid grid-cols-3 gap-x-5 border-t border-white/10 pt-5">
                {STATS.map(({ k, v }) => (
                  <div key={k}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">{k}</dt>
                    <dd className="mt-1 font-mono text-[14px] text-white/80">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- signal chain */}
        <section className="py-24 sm:py-32">
          <Rule label="how it decides" />
          <h2 className="mt-8 max-w-2xl text-[clamp(1.9rem,4.6vw,3.1rem)] font-bold leading-[1.02] tracking-[-0.035em]">
            Four ordered bands, every time,
            <span className="text-white/30"> no surprises.</span>
          </h2>

          {/* The chain drawn as a chain. Fadeo's whole pitch is that the decision
              is deterministic and inspectable, so the section reads top to bottom
              with the signal line running through it. */}
          <ol className="mt-14 relative">
            <span
              aria-hidden
              className="absolute left-[13px] top-3 bottom-3 w-px"
              style={{ background: `linear-gradient(${TEAL}, ${DIM} 55%, transparent)` }}
            />
            {BANDS.map((b) => (
              <li key={b.n} className="relative flex gap-6 pb-10 last:pb-0 sm:gap-9">
                <span
                  className="relative z-10 mt-1 grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full border font-mono text-[10px]"
                  style={{ borderColor: DIM, backgroundColor: "#050807", color: TEAL }}
                >
                  {b.n}
                </span>
                <div className="pt-0.5">
                  <h3 className="text-[19px] font-bold tracking-[-0.02em] sm:text-[21px]">{b.title}</h3>
                  <p className="mt-2 max-w-xl text-[14.5px] leading-[1.72] text-white/50">{b.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- screenshots */}
        <section className="pb-24 sm:pb-32">
          <Rule label="the app" />
          <div className="mt-12 flex flex-col gap-20">
            {SCREENSHOTS.map((shot, i) => (
              <div
                key={shot.title}
                className={`grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14 ${
                  i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
                }`}
              >
                <figure className="overflow-hidden border border-white/10 bg-black/40">
                  <Image
                    src={shot.src}
                    alt={`${shot.title} screenshot`}
                    width={1800}
                    height={1264}
                    className="block h-auto w-full"
                  />
                </figure>
                <div>
                  <h3 className="text-[22px] font-bold tracking-[-0.025em]">{shot.title}</h3>
                  <p className="mt-3 max-w-md text-[14.5px] leading-[1.72] text-white/50">{shot.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------- pricing */}
        <section className="pb-24 sm:pb-32">
          <Rule label="pricing" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col border border-white/12 p-7 sm:p-8">
              <p className="display text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-none tracking-[-0.035em]">
                Pay what you want
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: TEAL }}>
                $2 minimum · lifetime · one time
              </p>
              <p className="mt-6 text-[14.5px] leading-[1.72] text-white/55">
                Fadeo is fully functional without a license, forever. The license just removes a
                small, occasional reminder. Pay $2 if that&apos;s what you can spare, or more if you
                use it daily and it feels worth it. Source is GPLv3 — read it, fork it, build it
                yourself for free.
              </p>
              <a
                href={checkoutUrl}
                data-cursor="snap"
                className="mt-7 inline-flex self-start items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-black transition-opacity hover:opacity-85"
                style={{ backgroundColor: TEAL }}
              >
                {checkoutLabel}
              </a>
              {!paymentLink && (
                <p className="mt-3 text-[12px] text-white/35">
                  Checkout is coming soon. For now this opens an email — reply with what
                  you&apos;d like to pay and I&apos;ll send a key back.
                </p>
              )}
              <p className="mt-3 text-[12px] text-white/35">
                Your license key arrives by email within a few minutes of purchase. If it
                doesn&apos;t show up, check your spam folder first.
              </p>
            </div>

            <GiveawayCard initialPromo={initialPromo} />
          </div>
        </section>

        <SubscribeBand />

        {/* --------------------------------------------------------------- footer */}
        <footer className="flex flex-col gap-4 border-t border-white/10 py-10 sm:flex-row sm:items-center sm:justify-between">
          <span className="max-w-md font-mono text-[10.5px] uppercase leading-[1.9] tracking-[0.14em] text-white/25">
            Ad-hoc signed. Gatekeeper asks once, which is expected outside the App Store.
          </span>
          <div className="flex shrink-0 items-center gap-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/30">
            <a href="/puremac/fadeo/privacy" data-cursor="snap" className="transition-colors hover:text-white/70">
              Privacy
            </a>
            <a href="/puremac/fadeo/terms" data-cursor="snap" className="transition-colors hover:text-white/70">
              Terms
            </a>
            <a href="https://github.com/yashashwi-s/Fadeo" data-cursor="snap" className="transition-colors hover:text-white/70">
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
