"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Download,
  Code2,
  Globe,
  Video,
  Terminal,
  Volume2,
  VolumeX,
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

// The interactive centerpiece. Each tile stands for an app being frontmost; clicking it
// runs the exact same four-band decision the real app runs and switches the ambient sound
// to match. Textures are synthesized live in the browser (Web Audio) so a visitor can hear
// the crossfade, not just watch it. `texture: "silence"` is the Meetings override pausing
// everything, which is the whole point of band 01.
const CONTEXTS = [
  {
    id: "xcode",
    app: "Xcode",
    Icon: Code2,
    workspace: "Deep Work",
    color: "#67E4D2",
    texture: "brown",
    sound: "brown noise",
    why: "Xcode is frontmost on Desktop 1. Deep Work wins on specificity.",
  },
  {
    id: "safari",
    app: "Safari",
    Icon: Globe,
    workspace: "Reading",
    color: "#8AB4F8",
    texture: "rain",
    sound: "light rain",
    why: "Safari is frontmost. Reading is the only candidate that matches.",
  },
  {
    id: "zoom",
    app: "Zoom",
    Icon: Video,
    workspace: "Meetings",
    color: "#F2A65A",
    texture: "silence",
    sound: "paused",
    why: "Camera and mic are live. The Meetings override pre-empts everything, audio pauses.",
  },
  {
    id: "terminal",
    app: "Terminal",
    Icon: Terminal,
    workspace: "Terminal, Desktop 2",
    color: "#5AD1B4",
    texture: "ocean",
    sound: "ocean",
    why: "Terminal on Desktop 2. Lowest priority, but nothing outranks it here.",
  },
];

const MASTER = 0.22;
const TEXTURES = {
  brown: { type: "lowpass", freq: 380, Q: 0.7, gain: 0.95, swell: 0 },
  rain: { type: "highpass", freq: 1200, Q: 0.5, gain: 0.5, swell: 0 },
  ocean: { type: "lowpass", freq: 300, Q: 0.9, gain: 0.85, swell: 0.45 },
  silence: null,
};

function makeNoiseBuffer(ctx, seconds) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

// A still, gentle waveform for when motion is reduced or the demo is idle: a fixed shape,
// flatter for a paused (silence) context.
function paintStaticBars(bars, isSilence) {
  for (let i = 0; i < bars.length; i++) {
    const el = bars[i];
    if (!el) continue;
    const v = isSilence ? 0.07 : 0.1 + 0.34 * (0.5 + 0.5 * Math.sin(i * 0.5));
    el.style.transform = `scaleY(${v.toFixed(3)})`;
  }
}

function ContextDemo() {
  const [activeId, setActiveId] = useState("xcode");
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);
  const barsRef = useRef([]);
  const activeRef = useRef(CONTEXTS[0]);
  const soundOnRef = useRef(false);
  const fadeTimerRef = useRef(null);
  const reduceRef = useRef(false);

  const active = CONTEXTS.find((c) => c.id === activeId) || CONTEXTS[0];
  activeRef.current = active;

  // One noise source through a reconfigurable filter -> swell (LFO-modulated for ocean)
  // -> master (fades) -> analyser -> out. Built lazily on the first user gesture so nothing
  // ever autoplays.
  function initAudio() {
    if (audioRef.current) return audioRef.current;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx, 2);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 380;
    const swell = ctx.createGain();
    swell.gain.value = 1;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 0;
    lfo.connect(lfoDepth).connect(swell.gain);
    const master = ctx.createGain();
    master.gain.value = 0;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    src.connect(filter).connect(swell).connect(master).connect(analyser).connect(ctx.destination);
    src.start();
    lfo.start();
    audioRef.current = { ctx, filter, lfoDepth, master, analyser, data: new Uint8Array(analyser.frequencyBinCount) };
    return audioRef.current;
  }

  // Fade the current texture out, swap the filter, fade the new one in. Reads as a crossfade
  // at this timescale and honestly mirrors the app's "fade or switch" behavior.
  function applyTexture(textureKey) {
    const a = audioRef.current;
    if (!a) return;
    const now = a.ctx.currentTime;
    a.master.gain.cancelScheduledValues(now);
    a.master.gain.setValueAtTime(a.master.gain.value, now);
    a.master.gain.linearRampToValueAtTime(0, now + 0.25);
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = window.setTimeout(() => {
      const a2 = audioRef.current;
      if (!a2 || !soundOnRef.current) return;
      const tex = TEXTURES[textureKey];
      if (!tex) return; // silence: leave master at 0
      const t = a2.ctx.currentTime;
      a2.filter.type = tex.type;
      a2.filter.frequency.setValueAtTime(tex.freq, t);
      a2.filter.Q.setValueAtTime(tex.Q, t);
      a2.lfoDepth.gain.setValueAtTime(tex.swell, t);
      a2.master.gain.setValueAtTime(0, t);
      a2.master.gain.linearRampToValueAtTime(MASTER * tex.gain, t + 0.5);
    }, 280);
  }

  function selectContext(ctx) {
    setActiveId(ctx.id);
    if (soundOnRef.current) applyTexture(ctx.texture);
  }

  async function toggleSound() {
    if (soundOnRef.current) {
      const a = audioRef.current;
      if (a) {
        const now = a.ctx.currentTime;
        a.master.gain.cancelScheduledValues(now);
        a.master.gain.setValueAtTime(a.master.gain.value, now);
        a.master.gain.linearRampToValueAtTime(0, now + 0.3);
      }
      soundOnRef.current = false;
      setSoundOn(false);
      return;
    }
    const a = initAudio();
    if (!a) return;
    if (a.ctx.state === "suspended") await a.ctx.resume();
    soundOnRef.current = true;
    setSoundOn(true);
    applyTexture(activeRef.current.texture);
  }

  // Visualizer: real frequency data when sound is on, a gentle synthetic sway otherwise, and
  // nearly flat for a paused (silence) context. Bars are mutated directly so this never
  // re-renders React each frame. When the visitor prefers reduced motion, hold a still shape
  // instead of animating.
  useEffect(() => {
    const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    reduceRef.current = Boolean(mq && mq.matches);
    if (reduceRef.current) {
      paintStaticBars(barsRef.current, activeRef.current.texture === "silence");
      return;
    }
    let raf;
    const loop = () => {
      const bars = barsRef.current;
      const a = audioRef.current;
      const isSilence = activeRef.current.texture === "silence";
      if (a && soundOnRef.current && !isSilence) {
        a.analyser.getByteFrequencyData(a.data);
        for (let i = 0; i < bars.length; i++) {
          const el = bars[i];
          if (!el) continue;
          const v = a.data[(i * 2) % a.data.length] / 255;
          el.style.transform = `scaleY(${(0.06 + v * 0.98).toFixed(3)})`;
        }
      } else {
        const time = performance.now() / 1000;
        const amp = isSilence ? 0.03 : 0.16;
        for (let i = 0; i < bars.length; i++) {
          const el = bars[i];
          if (!el) continue;
          const v = 0.06 + amp * (0.5 + 0.5 * Math.sin(time * 1.6 + i * 0.55));
          el.style.transform = `scaleY(${v.toFixed(3)})`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Under reduced motion the loop is off, so repaint the still shape when the context changes.
  useEffect(() => {
    if (reduceRef.current) paintStaticBars(barsRef.current, active.texture === "silence");
  }, [activeId, soundOn, active.texture]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      const a = audioRef.current;
      if (a) a.ctx.close();
    };
  }, []);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-16 -inset-y-10 opacity-60 blur-3xl"
        style={{ background: `radial-gradient(50% 60% at 50% 40%, ${active.color}22, transparent 70%)`, transition: "background 600ms" }}
      />
      <div className="relative rounded-[26px] border border-white/12 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 sm:p-5 shadow-2xl shadow-black/50">
        {/* Faux menu-bar strip: the apps you can be "in" */}
        <div className="flex items-center justify-between gap-2 flex-wrap rounded-2xl bg-black/40 border border-white/8 px-3 py-2.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {CONTEXTS.map((c) => {
              const on = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => selectContext(c)}
                  data-cursor="snap"
                  className="group relative flex flex-col items-center gap-1 rounded-xl px-2.5 sm:px-3.5 py-2 transition-colors"
                  style={{ backgroundColor: on ? `${c.color}1f` : "transparent" }}
                >
                  <span
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[10px] border transition-colors"
                    style={{
                      borderColor: on ? `${c.color}80` : "rgba(255,255,255,0.12)",
                      color: on ? c.color : "rgba(255,255,255,0.55)",
                      backgroundColor: on ? `${c.color}14` : "rgba(255,255,255,0.03)",
                    }}
                  >
                    <c.Icon size={17} strokeWidth={2} />
                  </span>
                  <span className="text-[10.5px] sm:text-[11px]" style={{ color: on ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }}>
                    {c.app}
                  </span>
                  <span
                    className="absolute -top-1 h-1 w-1 rounded-full transition-opacity"
                    style={{ backgroundColor: c.color, opacity: on ? 1 : 0 }}
                  />
                </button>
              );
            })}
          </div>
          <button
            onClick={toggleSound}
            data-cursor="snap"
            aria-label={soundOn ? "Mute" : "Turn on sound"}
            className="shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors"
            style={{
              borderColor: soundOn ? `${ACCENT}66` : "rgba(255,255,255,0.15)",
              color: soundOn ? ACCENT : "rgba(255,255,255,0.55)",
            }}
          >
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span className="hidden sm:inline">{soundOn ? "Sound on" : "Hear it"}</span>
          </button>
        </div>

        {/* Now playing: workspace, texture, live visualizer, and the reasoning trace */}
        <div className="mt-4 px-2 sm:px-3 pb-2">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: active.color, transition: "background 500ms" }} />
            <span className="text-[15px] font-medium">{active.workspace}</span>
            <span className="text-white/30">·</span>
            <span className="text-[13.5px] text-white/50">{active.sound}</span>
          </div>

          <div className="mt-4 flex items-end gap-[3px] h-14">
            {Array.from({ length: 32 }).map((_, i) => (
              <span
                key={i}
                ref={(el) => { barsRef.current[i] = el; }}
                className="flex-1 rounded-full origin-bottom"
                style={{ height: "100%", backgroundColor: active.color, opacity: 0.85, transition: "background-color 500ms", transform: "scaleY(0.06)" }}
              />
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-black/30 border border-white/6 px-3.5 py-2.5">
            <span className="mt-[1px] text-[11px] font-mono shrink-0" style={{ color: active.color }}>why</span>
            <p className="text-[13px] text-white/65 leading-relaxed">{active.why}</p>
          </div>
        </div>
      </div>
      <p className="text-center text-[12.5px] text-white/35 mt-4">
        Click an app to switch context. Turn on sound to hear Fadeo fade between them.
      </p>
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

          {/* The artifact you can play with, front and center */}
          <div className="mx-auto max-w-2xl mt-16 sm:mt-20 text-left">
            <ContextDemo />
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
