"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import Magnetic from "@/components/Magnetic";
import ScrambleText from "@/components/ScrambleText";
import { GRAIN } from "./puremac/grain";

/* Fourth identity in the family.
 *
 * PureMac's index is paper + serif, Arras is indigo + amber, Fadeo is teal +
 * instrument panel. This one is the personal site, so it gets to be the loudest:
 * poster-condensed display type, an acid accent, and one section that flips to
 * paper mid-scroll so the page has two temperatures instead of one.
 *
 * Everything moves on hover, scroll or time. Nothing loops on a timer except the
 * clock, and the grain is held still -- the root layout's animated one strobes.
 */

// Click the mark in the nav to cycle these. Small, pointless, findable.
const ACCENTS = ["#ccff2e", "#ff9e5e", "#67e4d2", "#c8a2ff"];

const STATS = [
  { value: 1720, label: "Codeforces", sub: "hackerman15", href: "https://codeforces.com/profile/hackerman15" },
  { value: 8.74, label: "CGPA", sub: "IIT (BHU)", decimals: 2 },
  { value: 13, label: "AMS Derive 2026", sub: "All India Rank", suffix: "th" },
  { value: 3000, label: "Participants", sub: "Byte the Bits", suffix: "+" },
];

/* Ranks read as positions here rather than "AIR 13" / "SR 20" — the acronym is
   the least interesting part of the number, and it forced the stat column wider
   than any of them needed. What the rank actually is moves to the detail line
   underneath, so nothing is lost. Applied at render rather than in
   data/achievements.js, since that file is shared with other renderers. */
function ordinal(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return null;
  const tens = num % 100;
  if (tens >= 11 && tens <= 13) return `${num}th`;
  return `${num}${["th", "st", "nd", "rd"][num % 10] || "th"}`;
}

const RANK_KINDS = { AIR: "All India Rank", SR: "State Rank" };

function asPosition(item) {
  const match = /^(AIR|SR)\s+(\d+)$/.exec(item.stat.trim());
  if (!match) return item;
  const position = ordinal(match[2]);
  if (!position) return item;
  return {
    ...item,
    stat: position,
    detail: item.detail ? `${RANK_KINDS[match[1]]} · ${item.detail}` : RANK_KINDS[match[1]],
  };
}

/* Time-aware, because the bio already claims 3AM segfaults. Resolved after mount
   so the server and client agree on first paint. */
function statusFor(hourIST) {
  if (hourIST >= 2 && hourIST < 6) return "debugging a segfault, probably";
  if (hourIST >= 6 && hourIST < 9) return "asleep, ideally";
  if (hourIST >= 9 && hourIST < 13) return "in a lecture, physically";
  if (hourIST >= 13 && hourIST < 18) return "shipping something";
  if (hourIST >= 18 && hourIST < 22) return "on a problem set";
  return "reading someone else's source";
}

function Clock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Nothing until mounted: rendering a clock on the server guarantees a
  // hydration mismatch, and a blank slot for one frame is cheaper than that.
  if (!now) return <span className="opacity-0">--:--:--</span>;

  const ist = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  const hourIST = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }).format(now)
  );

  return (
    <span>
      {ist} IST — {statusFor(hourIST)}
    </span>
  );
}

/* The site already has a VelocityMarquee, but it bakes in the main page's look:
   hollow outlined type, its own border and padding. This page wants filled type
   and its own rhythm, so it gets its own — same scroll-velocity idea, drifting
   faster the harder you scroll and reversing when you scroll back. */
function Ticker({ accent }) {
  const items = ["Reinforcement learning", "Systems", "Native macOS", "Competitive programming"];
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * 2.4 * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    // Two identical halves, so wrapping at -50% is seamless in both directions.
    baseX.set(((baseX.get() - move) % 50) - (baseX.get() - move > 0 ? 50 : 0));
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <div className="mt-20 overflow-hidden border-y border-white/10 py-5 sm:mt-28">
      <motion.div className="flex w-max gap-10" style={{ x }}>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-10" aria-hidden={half === 1}>
            {items.map((t) => (
              <span key={t} className="flex items-center gap-10">
                <span className="display whitespace-nowrap text-[clamp(1.7rem,4.6vw,3.4rem)] leading-none text-white/85">
                  {t}
                </span>
                <span className="text-[clamp(1.7rem,4.6vw,3.4rem)] leading-none" style={{ color: accent }}>
                  ✳
                </span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function CountUp({ value, decimals = 0, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  // Seeded with the real number, not zero. The count-up is decoration; if the
  // observer never fires, or JS is slow, or motion is reduced, the correct
  // figure is what stays on screen rather than a permanent 0.00.
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setShown,
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref}>
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* A project row that floods with its own colour on hover, and tracks the pointer
   so the wash follows rather than just switching on. */
function WorkRow({ project, index, accent }) {
  const mx = useMotionValue(50);
  const glow = useSpring(mx, { stiffness: 220, damping: 30 });
  const [hover, setHover] = useState(false);
  const colour = project.color || accent;
  const wash = usePointerWash(glow, colour);

  const onMove = useCallback(
    (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width) * 100);
    },
    [mx]
  );

  const href = project.live || project.github;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="snap"
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative block border-t border-white/10 px-1 py-7 sm:py-9"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: wash }}
      />
      <div className="flex items-baseline gap-4 sm:gap-7">
        <span className="w-8 shrink-0 font-mono text-[11px] tracking-[0.1em] text-white/25 transition-colors group-hover:text-white/70">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3
              className="display text-[clamp(1.7rem,4.6vw,3.1rem)] leading-[0.95] tracking-[0.005em] transition-colors"
              style={{ color: hover ? colour : "#fff" }}
            >
              {project.title}
            </h3>
            {project.wip && (
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                in progress
              </span>
            )}
          </div>
          <p className="mt-2.5 max-w-xl text-[14.5px] leading-[1.65] text-white/45 transition-colors group-hover:text-white/70">
            {project.description}
          </p>
          <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
            {project.tags.map((t) => (
              <li key={t} className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <ArrowUpRight
          size={20}
          className="mt-2 shrink-0 -translate-x-1 text-white/20 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          style={{ color: colour }}
        />
      </div>
    </motion.a>
  );
}

/* The hover wash follows the pointer horizontally. Subscribed to the spring
   rather than read during render, so a mousemove updates one string instead of
   re-rendering the row. */
function usePointerWash(glow, colour) {
  const [bg, setBg] = useState(`radial-gradient(60% 140% at 50% 50%, ${colour}1f, transparent 70%)`);
  useEffect(() => {
    const unsub = glow.on("change", (v) => {
      setBg(`radial-gradient(60% 140% at ${v.toFixed(1)}% 50%, ${colour}1f, transparent 70%)`);
    });
    return unsub;
  }, [glow, colour]);
  return bg;
}

export default function HomeClient({ personal, projects, experience, achievements, skills, fontClass = "" }) {
  const [accentIdx, setAccentIdx] = useState(0);
  const accent = ACCENTS[accentIdx];

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div
      id="latest-page"
      className={`${fontClass} min-h-screen overflow-x-clip bg-[#0b0b0c] text-white`}
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif", "--acc": accent }}
    >
      <style>{`
        body:has(#latest-page) .noise-bg { display: none; }
        #latest-page h1, #latest-page h2, #latest-page h3, #latest-page .display {
          font-family: var(--font-poster), ui-sans-serif, system-ui, sans-serif;
          font-weight: 400;
          text-transform: uppercase;
        }
        #latest-page .editorial {
          font-family: var(--font-editorial), ui-serif, Georgia, serif;
          font-style: italic;
          text-transform: none;
        }
        #latest-page ::selection { background: var(--acc); color: #000; }
      `}</style>

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: GRAIN }} />
      <CustomCursor />

      <div className="relative z-10">
        {/* ---------------------------------------------------------------- nav */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
          <button
            onClick={() => setAccentIdx((i) => (i + 1) % ACCENTS.length)}
            data-cursor="snap"
            title="go on, click it"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
          >
            <span style={{ color: accent }}>●</span> ys
          </button>
          <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            <a href="#work" data-cursor="snap" className="transition-colors hover:text-white">
              <ScrambleText text="Work" />
            </a>
            <a href="https://puremac.yashashwi.me" data-cursor="snap" className="transition-colors hover:text-white">
              <ScrambleText text="PureMac" />
            </a>
            <a href={personal.resume} data-cursor="snap" className="transition-colors hover:text-white">
              <ScrambleText text="CV" />
            </a>
          </nav>
        </header>

        {/* --------------------------------------------------------------- hero */}
        <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 sm:pt-24">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
              <Clock />
            </span>
          </div>

          <h1 className="mt-7 text-[clamp(3.2rem,15vw,12rem)] leading-[0.82] tracking-[0.01em]">
            Yashashwi
            <br />
            <span style={{ color: accent }}>Singhania</span>
          </h1>

          <div className="mt-10 grid gap-10 sm:grid-cols-[1.15fr_0.85fr] sm:gap-14">
            <div>
              <p className="max-w-lg text-[17px] leading-[1.6] text-white/65">
                I build <span className="editorial text-white">systems</span> and overthink{" "}
                <span className="editorial text-white">algorithms</span>. Dual degree at IIT (BHU),
                mostly writing reinforcement learning, systems code, and native macOS apps people
                actually keep installed.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <a
                    href="#work"
                    data-cursor="snap"
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-semibold text-black"
                    style={{ backgroundColor: accent }}
                  >
                    See the work
                  </a>
                </Magnetic>
                <a
                  href={`mailto:${personal.email}`}
                  data-cursor="snap"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Say hello
                </a>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-end border-t border-white/10 pt-6 sm:justify-self-end">
              {[
                ["based in", personal.location],
                ["studying", "Biochem. Eng."],
                ["graduating", personal.graduationYear.replace(" (Expected)", "")],
                ["shipping", "macOS apps"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">{k}</dt>
                  <dd className="mt-1 text-[14.5px] text-white/75">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------------------ marquee */}
        <Ticker accent={accent} />

        {/* -------------------------------------------------------------- stats */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {STATS.map((s) => {
              const Tag = s.href ? "a" : "div";
              return (
                <Tag
                  key={s.label}
                  {...(s.href ? { href: s.href, target: "_blank", rel: "noreferrer", "data-cursor": "snap" } : {})}
                  className="group block"
                >
                  <p
                    className="display text-[clamp(2.6rem,7vw,4.6rem)] leading-none tracking-[0.005em] transition-colors"
                    style={{ color: accent }}
                  >
                    <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                  </p>
                  <p className="mt-3 text-[15px] font-medium text-white/80">{s.label}</p>
                  <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
                    {s.sub}
                  </p>
                </Tag>
              );
            })}
          </div>
        </section>

        {/* --------------------------------------------------------------- work */}
        <section id="work" className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-end justify-between gap-6 pb-10">
            <h2 className="text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.9]">
              Selected
              <br />
              <span className="editorial normal-case text-white/40">work</span>
            </h2>
            <p className="hidden max-w-[15rem] text-right font-mono text-[10.5px] uppercase leading-[1.9] tracking-[0.14em] text-white/30 sm:block">
              {projects.length} repositories
              <br />
              most of them still running
            </p>
          </div>

          <div>
            {featured.map((p, i) => (
              <WorkRow key={p.title} project={p} index={i} accent={accent} />
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ puremac */}
        <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <a
            href="https://puremac.yashashwi.me"
            data-cursor="snap"
            className="group relative block overflow-hidden rounded-3xl border border-white/12 p-8 transition-colors hover:border-white/30 sm:p-12"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(80% 120% at 85% 0%, rgba(103,228,210,0.16), transparent 60%)" }}
            />
            <div className="relative grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">A small studio</p>
                <h2 className="mt-5 text-[clamp(2.2rem,6.5vw,4.6rem)] leading-[0.9]">
                  Pure<span className="text-white/35">Mac</span>
                </h2>
                <p className="mt-5 max-w-md text-[15.5px] leading-[1.65] text-white/55">
                  Two native macOS apps, both open source, both free to run.{" "}
                  <span className="text-white/85">Arras</span> puts photos on your desktop at their
                  real proportions. <span className="text-white/85">Fadeo</span> changes your audio
                  to match what you are doing.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70 transition-colors group-hover:border-white/50 group-hover:text-white sm:self-end">
                Visit PureMac
                <ArrowUpRight size={14} />
              </span>
            </div>
          </a>
        </section>

        {/* ------------------------------------------- paper section (inverted) */}
        <section className="bg-[#f2efe6] py-24 text-[#111014] sm:py-32">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">Where I have been</p>

            <div className="mt-12 space-y-14">
              {experience.map((e) => (
                <div key={e.role + e.company} className="grid gap-5 sm:grid-cols-[13rem_1fr] sm:gap-10">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-black/45">{e.period}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-black/30">
                      {e.location}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[clamp(1.5rem,3.4vw,2.3rem)] leading-[1] text-[#111014]">{e.role}</h3>
                    <p className="editorial mt-1 text-[19px] text-black/55">{e.company}</p>
                    <ul className="mt-4 space-y-2">
                      {e.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-[14.5px] leading-[1.65] text-black/60">
                          <span className="mt-[0.6em] h-[4px] w-[4px] shrink-0 rounded-full bg-black/30" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                      {e.tags.map((t) => (
                        <li key={t} className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-black/35">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* skills, as a dense strip rather than another card grid */}
            <div className="mt-20 border-t border-black/12 pt-10">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {skills.map((group) => (
                  <div key={group.category}>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-black/35">
                      {group.category}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {group.items.map((i) => (
                        <li key={i} className="text-[14.5px] text-black/70">
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- achievements */}
        <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <h2 className="text-[clamp(2rem,5.4vw,3.8rem)] leading-[0.92]">
            Receipts
          </h2>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {achievements.map((group) => (
              <div key={group.category}>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/30">
                  {group.category}
                </p>
                <ul className="mt-6 space-y-6">
                  {group.items.map(asPosition).map((it) => {
                    const Row = it.link ? "a" : "div";
                    return (
                      <li key={it.label}>
                        <Row
                          {...(it.link ? { href: it.link, target: "_blank", rel: "noreferrer", "data-cursor": "snap" } : {})}
                          className="group flex items-baseline gap-5"
                        >
                          {/* Stats here run from "1st" to "QUALIFIED", so the
                              size steps down with length — a fixed size either
                              wrapped the long ones or wasted the column. */}
                          <span
                            className="display w-[7rem] shrink-0 whitespace-nowrap leading-none"
                            style={{
                              color: accent,
                              fontSize:
                                it.stat.length > 7 ? "1.15rem" : it.stat.length > 4 ? "1.45rem" : "1.85rem",
                            }}
                          >
                            {it.stat}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[15px] text-white/80 transition-colors group-hover:text-white">
                              {it.label}
                            </span>
                            <span className="mt-0.5 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
                              {it.detail}
                            </span>
                          </span>
                        </Row>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- more work */}
        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">Also built</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {rest.map((p) => (
              <a
                key={p.title}
                href={p.live || p.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="snap"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/12 px-4 py-2.5 text-[13.5px] text-white/60 transition-colors hover:border-white/35 hover:text-white"
              >
                <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: p.color }} />
                {p.title}
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/25">
                  {p.tags[0]}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------- footer */}
        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <h2 className="text-[clamp(2.4rem,10vw,8rem)] leading-[0.85]">
              Let&apos;s build
              <br />
              <span style={{ color: accent }}>something</span>
            </h2>

            <div className="mt-14 flex flex-wrap items-end justify-between gap-10">
              <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                {[
                  ["Email", `mailto:${personal.email}`],
                  ["GitHub", personal.github],
                  ["LinkedIn", personal.linkedin],
                  ["Codeforces", personal.codeforces],
                  ["PureMac", "https://puremac.yashashwi.me"],
                  ["CV", personal.resume],
                ].map(([label, href]) => (
                  <a key={label} href={href} data-cursor="snap" className="transition-colors hover:text-white">
                    <ScrambleText text={label} />
                  </a>
                ))}
              </div>
              <p className="font-mono text-[10.5px] uppercase leading-[1.9] tracking-[0.14em] text-white/25">
                Varanasi, India
                <br />
                Built with too many rewrites
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
