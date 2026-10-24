"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CodeXml,
  Copy,
  Download,
  Pause,
  Play,
  Plus,
  Star,
} from "lucide-react";
import Image from "next/image";
import KineticSculpture from "@/components/portfolio/kinetic-sculpture";
import ArrasFilm from "@/components/portfolio/arras-film";
import { arrasCanonicalUrl, arrasProduct } from "@/data/arras-product";
import { getArrasAppStoreOffer } from "@/lib/arras-installation.mjs";
import "./portfolio.css";

const EASE = [0.23, 1, 0.32, 1];
const appStoreOffer = getArrasAppStoreOffer(arrasProduct);
const NAV_ITEMS = [
  { id: "work", label: "The work", number: "01" },
  { id: "proof", label: "The proof", number: "02" },
  { id: "about", label: "The person", number: "03" },
];

function AppStoreMark({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="7"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="m12 7 11 19M20 7 9 26M6 21h13m4 0h3"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionLabel({ number, children, light = false }) {
  return (
    <div className={`ys-section-label${light ? " ys-label-light" : ""}`}>
      <span className="ys-cross">+</span>
      <span>
        {number} / {children}
      </span>
    </div>
  );
}

function Reveal({ children, className = "", delay = 0, paused }) {
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={
        paused
          ? undefined
          : {
              opacity: [0.45, 1],
              transform: ["translateY(28px)", "translateY(0px)"],
            }
      }
      viewport={{ once: true, margin: "0px 0px -45px 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function LocalClock() {
  const [time, setTime] = useState(null);
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="ys-local-time">
      Varanasi, IN <span>{time || "--:--"} IST</span>
    </span>
  );
}

function MagneticLink({ children, className = "", href, paused, ...rest }) {
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 18, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 150, damping: 18, mass: 0.2 });
  const transform = useTransform(
    [sx, sy],
    ([xx, yy]) => `translate3d(${xx}px, ${yy}px, 0)`,
  );
  function move(event) {
    if (paused || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.12);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.2);
  }
  return (
    <motion.a
      href={href}
      className={className}
      style={paused ? undefined : { transform }}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onFocus={() => {
        x.jump(0);
        y.jump(0);
      }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

function AppStoreLabel({ className = "" }) {
  if (!appStoreOffer) return null;

  return (
    <a
      className={`ys-store-label ${className}`}
      href={appStoreOffer.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Arras Widgets on the Mac App Store"
    >
      <div className="ys-store-label-top">
        <span>THE NEXT CHAPTER</span>
        <span>↗</span>
      </div>
      <div className="ys-store-label-main">
        <AppStoreMark size={29} />
        <span>
          App Store<em>available now.</em>
        </span>
      </div>
      <div className="ys-store-label-bottom">
        <span className="ys-store-dot" />
        <span>ARRAS WIDGETS IS HERE.</span>
      </div>
    </a>
  );
}

function Hero({ personal, paused }) {
  const hero = useRef(null);
  const { scrollYProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });
  const artworkTransform = useTransform(
    scrollYProgress,
    [0, 1],
    ["translate3d(0,0px,0)", "translate3d(0,70px,0)"],
  );
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rx = useSpring(x, { stiffness: 100, damping: 16 });
  const ry = useSpring(y, { stiffness: 100, damping: 16 });
  const tilt = useTransform(
    [rx, ry],
    ([a, b]) =>
      `perspective(1000px) rotateX(${b}deg) rotateY(${a}deg) rotate(-5deg)`,
  );
  function move(event) {
    if (paused || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 9);
    y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -9);
  }
  return (
    <section ref={hero} className="ys-hero" aria-labelledby="ys-hero-heading">
      <div className="ys-hero-eyebrow">
        <span>
          <i className="ys-status-dot" /> An engineer with a curious streak.
        </span>
        <span>Independent mind. IIT (BHU).</span>
      </div>
      <div className="ys-hero-grid">
        <div className="ys-hero-copy">
          <div className="ys-hero-intro">
            Hi, I’m Yashashwi <span>↘</span>
          </div>
          <h1 id="ys-hero-heading">
            <span className="ys-title-mask">
              <span>Curiosity,</span>
            </span>
            <span className="ys-title-mask">
              <span>
                compiled<span className="ys-red">.</span>
              </span>
            </span>
          </h1>
          <div className="ys-hero-description">
            <p>
              Creator of{" "}
              <a
                href={arrasCanonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Arras
              </a>
              . I turn a slightly obsessive attention to detail into things
              people love using.
            </p>
            <div className="ys-hero-actions">
              <MagneticLink
                href={arrasCanonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ys-button ys-button-dark"
                paused={paused}
              >
                Meet Arras <ArrowUpRight size={18} />
              </MagneticLink>
              <a href="#work" className="ys-text-link">
                Explore the work <ArrowDown size={16} />
              </a>
            </div>
            <div className="ys-hero-downloads">
              <Download size={14} />
              <strong>1,000+</strong>
              <span>downloads. And just getting started.</span>
            </div>
          </div>
        </div>
        <motion.div
          className="ys-hero-art"
          style={paused ? undefined : { transform: artworkTransform }}
          onPointerMove={move}
          onPointerLeave={() => {
            x.set(0);
            y.set(0);
          }}
        >
          <div className="ys-art-coordinates">
            <span>FIG. 001 / ARRAS</span>
            <span>FROM AN IDEA TO YOUR DESKTOP.</span>
          </div>
          <KineticSculpture paused={paused} />
          <span className="ys-art-cross ys-art-cross-a">+</span>
          <span className="ys-art-cross ys-art-cross-b">+</span>
          <motion.a
            href={arrasCanonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ys-hero-product"
            style={paused ? undefined : { transform: tilt }}
            aria-label="Explore Arras, my free Mac app"
          >
            <div className="ys-mac-chrome">
              <span>
                <i />
                <i />
                <i />
              </span>
              <span>your desktop. your world.</span>
              <ArrowUpRight size={11} />
            </div>
            <Image
              src="/puremac/arras/features/collages.webp"
              alt="Arras turns a Mac desktop into a personal canvas of photographs and editable collages"
              width={1200}
              height={750}
              sizes="(max-width: 760px) 90vw, 46vw"
              preload
            />
            <div className="ys-hero-product-name">
              <Image
                src="/puremac/arras/icon.svg"
                alt=""
                width={38}
                height={38}
              />
              <span>
                <strong>Arras</strong>
                <small>A more personal Mac.</small>
              </span>
              <span className="ys-free-tag">NATIVE & FREE</span>
            </div>
          </motion.a>
          <AppStoreLabel className="ys-hero-store" />
          <div className="ys-art-note">
            a little more <em>you.</em>
            <span>↖</span>
          </div>
        </motion.div>
      </div>
      <div className="ys-hero-bottom">
        <span className="ys-hero-footer-note">
          Independent work. A slightly obsessive standard.
        </span>
        <a href="#work">
          Made with intent. Scroll to explore{" "}
          <span className="ys-scroll-circle">
            <ArrowDown size={14} />
          </span>
        </a>
      </div>
    </section>
  );
}

function DisciplineStrip({ paused }) {
  const strip = useRef(null);
  const { scrollYProgress } = useScroll({
    target: strip,
    offset: ["start end", "end start"],
  });
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    ["translateX(3%)", "translateX(-12%)"],
  );
  return (
    <div
      ref={strip}
      className="ys-discipline-strip"
      aria-label="Native macOS. Reinforcement learning. Systems. Competitive programming."
    >
      <motion.div aria-hidden="true" style={paused ? undefined : { transform }}>
        {[0, 1].map((i) => (
          <span key={i}>
            NATIVE macOS <span>✳</span> REINFORCEMENT LEARNING <span>✳</span>{" "}
            SYSTEMS <span>✳</span> COMPETITIVE PROGRAMMING <span>✳</span>{" "}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const PROOFS = [
  {
    id: "competitive",
    tag: "01 / THE PROBLEM SOLVER",
    value: "1720",
    unit: "EXPERT",
    title: "A thing for hard problems.",
    copy: "Codeforces Expert. A lot of thinking, a lot of wrong answers, and the occasional very satisfying accepted.",
    detail: "hackerman15",
    href: "https://codeforces.com/profile/hackerman15",
    foot: "Competitive programming",
    color: "sage",
  },
  {
    id: "hackathon",
    tag: "02 / THE BUILDER",
    value: "01",
    unit: "FIRST PRIZE",
    title: "Built it. Shipped it. Won it.",
    copy: "First prize at DevBits, Udyam 2025. The best part of a deadline? Finding out how much you can actually build.",
    detail: "Udyam · IIT (BHU) · 2025",
    foot: "DevBits hackathon",
    color: "orange",
  },
  {
    id: "national",
    tag: "03 / THE MATHEMATICAL MIND",
    value: "13",
    unit: "ALL INDIA RANK",
    title: "Thinking beyond the obvious.",
    copy: "All India Rank 13 in POSTERIOR at AMS Derive 2026. Also AIR 39 in PRIOR. Two national top-50 finishes.",
    detail: "POSTERIOR + PRIOR · AMS Derive 2026",
    foot: "A national stage",
    color: "lilac",
  },
  {
    id: "community",
    tag: "04 / THE MULTIPLIER",
    value: "3,000",
    suffix: "+",
    unit: "PARTICIPANTS",
    title: "Better when we build together.",
    copy: "As a COPS Category Head, organised Byte the Bits at Technex across 5+ events. Helped 200+ students get started with Python.",
    detail: "Club of Programmers · IIT (BHU)",
    foot: "Community, at scale",
    color: "cream",
  },
];

function ProofGraphic({ index }) {
  if (index === 0)
    return (
      <div className="ys-proof-code" aria-hidden="true">
        <span>{"while (curious) {"}</span>
        <span> solve(harder_problem);</span>
        <span>{"}"}</span>
        <i>✓ accepted</i>
      </div>
    );
  if (index === 1)
    return (
      <svg
        className="ys-proof-trophy"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M35 20h50v29c0 22-11 34-25 34S35 71 35 49V20Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M35 28H18v12c0 17 9 22 21 22M85 28h17v12c0 17-9 22-21 22M60 83v20m-21 0h42M43 110h34"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m60 32 4 9 10 1-8 7 2 10-8-5-8 5 2-10-8-7 10-1 4-9Z"
          stroke="currentColor"
        />
      </svg>
    );
  if (index === 2)
    return (
      <div className="ys-proof-math" aria-hidden="true">
        <span>∑</span>
        <small>curiosity → clarity</small>
      </div>
    );
  return (
    <div className="ys-proof-dots" aria-hidden="true">
      {Array.from({ length: 72 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

function ProofCard({ item, index, progress, paused }) {
  const entry = (index - 1) / 3;
  const transform = useTransform(
    progress,
    [
      index === 0 ? 0 : Math.max(0, entry),
      index === 0 ? 1 : Math.min(1, entry + 0.3),
    ],
    [
      index === 0
        ? "translate3d(0,0%,0) rotate(-2deg)"
        : `translate3d(0,125%,0) rotate(${8 - index * 2}deg)`,
      `translate3d(0,${index * -2}%,0) rotate(${index % 2 === 0 ? -2 : 2}deg)`,
    ],
  );
  return (
    <motion.article
      className={`ys-proof-card ys-proof-${item.color}`}
      style={paused ? { zIndex: index + 1 } : { transform, zIndex: index + 1 }}
      aria-labelledby={`proof-${item.id}`}
    >
      <div className="ys-proof-card-top">
        <span>{item.tag}</span>
        <Plus size={17} />
      </div>
      <div className="ys-proof-number">
        {item.value}
        <span>{item.suffix}</span>
        <small>{item.unit}</small>
      </div>
      <ProofGraphic index={index} />
      <div className="ys-proof-card-copy">
        <h3 id={`proof-${item.id}`}>{item.title}</h3>
        <p>{item.copy}</p>
      </div>
      <div className="ys-proof-card-bottom">
        <span>{item.detail}</span>
        {item.href ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View hackerman15 on Codeforces"
          >
            <ArrowUpRight size={22} />
          </a>
        ) : (
          <span className="ys-proof-stamp">{item.foot}</span>
        )}
      </div>
    </motion.article>
  );
}

function ProofSection({ paused, achievements }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progressTransform = useTransform(
    scrollYProgress,
    (value) => `scaleY(${0.05 + value * 0.95})`,
  );
  const exams =
    achievements.find((group) => group.category === "National Examinations")
      ?.items || [];
  return (
    <>
      <section
        ref={ref}
        id="proof"
        className={`ys-proof-section${paused ? " ys-proof-static" : ""}`}
        aria-labelledby="ys-proof-heading"
      >
        <div className="ys-proof-sticky">
          <div className="ys-proof-intro">
            <SectionLabel number="02" light>
              The proof
            </SectionLabel>
            <h2 id="ys-proof-heading">
              Less talk.
              <br />
              More <em>proof.</em>
            </h2>
            <p>
              A few milestones from a very persistent habit of asking{" "}
              <span>“what if?”</span>
            </p>
            <div className="ys-proof-progress">
              <span>01</span>
              <span className="ys-proof-progress-track">
                <motion.i
                  style={paused ? undefined : { transform: progressTransform }}
                />
              </span>
              <span>04</span>
            </div>
            <a href="#about" className="ys-proof-skip">
              The person behind all this <ArrowDownRight size={18} />
            </a>
          </div>
          <div className="ys-proof-deck">
            {PROOFS.map((item, index) => (
              <ProofCard
                key={item.id}
                item={item}
                index={index}
                progress={scrollYProgress}
                paused={paused}
              />
            ))}
            <span className="ys-deck-caption">
              A SMALL COLLECTION OF REASONS TO KEEP GOING.
            </span>
          </div>
        </div>
      </section>
      <div className="ys-early-signals">
        <div className="ys-early-title">
          <span className="ys-red-dot" />
          <span>
            EARLY SIGNALS
            <br />
            <small>The curiosity started early.</small>
          </span>
        </div>
        {exams.map((item) => (
          <div className="ys-exam" key={item.label}>
            <span>{item.stat.replace("SR", "STATE RANK")}</span>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function ArrasShowcase({ project, paused, stars }) {
  const visual = useRef(null);
  const { scrollYProgress } = useScroll({
    target: visual,
    offset: ["start end", "end start"],
  });
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "translate3d(0,30px,0) rotate(-3deg) scale(0.94)",
      "translate3d(0,-20px,0) rotate(1deg) scale(1.02)",
    ],
  );
  return (
    <Reveal className="ys-arras-feature" paused={paused}>
      <div className="ys-arras-visual" ref={visual}>
        <div className="ys-visual-topline">
          <span>THE FLAGSHIP / NATIVE macOS</span>
          <a
            href={arrasCanonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Explore Arras — desktop photo widgets and collages for Mac"
          >
            MADE TO FEEL AT HOME. ↗
          </a>
        </div>
        <span className="ys-arras-wordmark" aria-hidden="true">
          arras
        </span>
        <motion.div
          className="ys-arras-image"
          style={paused ? undefined : { transform }}
        >
          <ArrasFilm paused={paused} />
        </motion.div>
        <div className="ys-arras-icon">
          <Image src="/puremac/arras/icon.svg" alt="" width={62} height={62} />
        </div>
        <a
          href={arrasCanonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ys-project-visit"
          aria-label="Visit the Arras website"
        >
          <ArrowUpRight size={22} />
        </a>
      </div>
      <div className="ys-arras-copy">
        <div>
          <span className="ys-project-category">MY FLAGSHIP PROJECT</span>
          <h3>
            Arras<span className="ys-red">.</span>
          </h3>
          <p>
            Your desktop, a little more yours. Free photo widgets, editable
            collages, and slideshows. Built with obsessive attention to how a
            Mac app should feel.
          </p>
          <div className="ys-arras-milestone">
            <strong>
              1k<span>+</span>
            </strong>
            <span>
              downloads
              <br />& counting.
            </span>
          </div>
        </div>
        <div>
          {appStoreOffer && (
            <a
              className="ys-store-inline"
              href={appStoreOffer.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Arras Widgets on the Mac App Store"
            >
              <AppStoreMark size={18} />
              <span>
                Mac App Store <em>available now</em>
              </span>
              <span className="ys-store-dot" />
            </a>
          )}
          <div className="ys-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="ys-project-links">
            <a
              href={arrasCanonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Arras <ArrowUpRight size={17} />
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star Arras on GitHub"
            >
              <CodeXml size={17} />
              {Number.isSafeInteger(stars) && stars > 0 ? (
                <>
                  <Star size={13} />
                  <span>{stars}</span>
                </>
              ) : (
                "Source"
              )}
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function PacmanBoard({ paused }) {
  const [running, setRunning] = useState(true);
  return (
    <div
      className={`ys-pacman-stage${paused || !running ? " ys-pacman-paused" : ""}`}
    >
      <div className="ys-pacman-grid" aria-hidden="true">
        {Array.from({ length: 80 }, (_, i) => (
          <span
            key={i}
            className={
              [
                0, 1, 2, 7, 8, 9, 20, 23, 24, 26, 29, 30, 33, 36, 39, 40, 41,
                43, 46, 48, 49, 60, 63, 66, 69, 70, 71, 72, 77, 78, 79,
              ].includes(i)
                ? "is-wall"
                : ""
            }
          />
        ))}
      </div>
      <div className="ys-pacman-agent ys-agent-one" aria-hidden="true" />
      <div className="ys-pacman-agent ys-agent-two" aria-hidden="true" />
      <div className="ys-pacman-agent ys-agent-three" aria-hidden="true" />
      <div className="ys-pacman-hud">
        <span>
          <i /> MULTI-AGENT ARENA
        </span>
        <button
          type="button"
          onClick={() => setRunning((value) => !value)}
          aria-label={
            running ? "Pause arena illustration" : "Play arena illustration"
          }
          aria-pressed={!running}
        >
          {running ? <Pause size={12} /> : <Play size={12} />}
        </button>
      </div>
      <span className="ys-pacman-caption">
        AN ILLUSTRATION OF A COMPETITIVE ENVIRONMENT.
      </span>
    </div>
  );
}

function WorkSection({ projects, stars, paused }) {
  const arras = projects.find((project) => project.title === "Arras");
  const fadeo = projects.find((project) => project.title === "Fadeo");
  const pacman = projects.find((project) => project.title === "FFA-Pacman");
  const [expanded, setExpanded] = useState(false);
  const remaining = projects.filter(
    (project) => !["Arras", "Fadeo", "FFA-Pacman"].includes(project.title),
  );
  const visible = expanded ? remaining : remaining.slice(0, 3);
  return (
    <section id="work" className="ys-work" aria-labelledby="ys-work-heading">
      <div className="ys-section-heading">
        <div>
          <SectionLabel number="01">The work</SectionLabel>
          <Reveal paused={paused}>
            <h2 id="ys-work-heading">
              Thoughtfully built.
              <br />
              <em>Personally obsessed.</em>
            </h2>
          </Reveal>
        </div>
        <p>
          Arras is the main story.
          <br />A few other rabbit holes follow.
        </p>
      </div>
      {arras && <ArrasShowcase project={arras} stars={stars} paused={paused} />}
      <div className="ys-work-pair">
        {fadeo && (
          <Reveal className="ys-work-card" paused={paused}>
            <a
              href={fadeo.live}
              target="_blank"
              rel="noopener noreferrer"
              className="ys-fadeo-visual"
              aria-label="Explore Fadeo, a workflow-aware audio app"
            >
              <div className="ys-visual-topline">
                <span>02 / FADEO · SOUND, IN CONTEXT</span>
                <ArrowUpRight size={16} />
              </div>
              <div className="ys-fadeo-equalizer" aria-hidden="true">
                {Array.from({ length: 37 }, (_, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${Math.round(18 + Math.abs(Math.sin(i * 0.53) * Math.cos(i * 0.21)) * 130)}px`,
                      animationDelay: `${(i * -0.09).toFixed(2)}s`,
                    }}
                  />
                ))}
              </div>
              <div className="ys-fadeo-mini">
                <Image
                  src="/puremac/fadeo-icon.png"
                  alt=""
                  width={37}
                  height={37}
                />
                <div>
                  <strong>Fadeo, in your flow.</strong>
                  <span>Sound that knows when to step back.</span>
                </div>
                <div className="ys-fadeo-toggle">
                  <i />
                </div>
              </div>
            </a>
            <div className="ys-work-card-title">
              <h3>Fadeo</h3>
              <a
                href={fadeo.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Fadeo source on GitHub"
              >
                <CodeXml size={19} />
              </a>
            </div>
            <p className="ys-work-card-description">
              A native Mac app that adapts audio to your workflow. The right
              sound, the right moment. Every rule is yours.
            </p>
            <div className="ys-tags">
              {fadeo.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </Reveal>
        )}
        {pacman && (
          <Reveal className="ys-work-card" paused={paused} delay={0.06}>
            <div className="ys-pacman-visual">
              <div className="ys-visual-topline">
                <span>03 / TEACHING MACHINES TO PLAY</span>
                <a
                  href={pacman.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FFA-Pacman on GitHub"
                >
                  <ArrowUpRight size={16} />
                </a>
              </div>
              <PacmanBoard paused={paused} />
            </div>
            <div className="ys-work-card-title">
              <h3>FFA-Pacman</h3>
              <a
                href={pacman.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Explore FFA-Pacman on GitHub"
              >
                <ArrowUpRight size={21} />
              </a>
            </div>
            <p className="ys-work-card-description">
              An arena built from scratch. Multiple agents learning to compete,
              collect energy, and survive with deep reinforcement learning.
            </p>
            <div className="ys-tags">
              {pacman.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </Reveal>
        )}
      </div>
      <div className="ys-lab-heading">
        <span>THE REST OF THE RABBIT HOLE</span>
        <span>
          {String(remaining.length).padStart(2, "0")} MORE EXPLORATIONS
        </span>
      </div>
      <div id="ys-project-archive" className="ys-project-archive">
        {visible.map((project, i) => (
          <a
            key={project.title}
            href={project.github}
            className="ys-archive-row"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ys-archive-number">
              {String(i + 4).padStart(2, "0")}
            </span>
            <h3>
              {project.title}
              {project.wip && <small>IN PROGRESS</small>}
            </h3>
            <span className="ys-archive-description">
              {project.description}
            </span>
            <span className="ys-archive-tech">
              {project.tags.slice(0, 2).join(" / ")}
            </span>
            <ArrowUpRight size={22} />
          </a>
        ))}
      </div>
      <button
        className="ys-archive-toggle"
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls="ys-project-archive"
      >
        {expanded
          ? "A little less"
          : `Open the archive (${remaining.length - 3} more)`}
        <Plus
          size={16}
          style={{ transform: expanded ? "rotate(45deg)" : undefined }}
        />
      </button>
    </section>
  );
}

function AboutSection({ personal, experience, skills, paused }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    ["rotate(-9deg)", "rotate(9deg)"],
  );
  return (
    <section
      id="about"
      className="ys-about"
      ref={ref}
      aria-labelledby="ys-about-heading"
    >
      <SectionLabel number="03">The person behind the projects</SectionLabel>
      <div className="ys-about-grid">
        <div>
          <Reveal paused={paused}>
            <h2 id="ys-about-heading">
              A biochemical
              <br />
              engineer.
              <br />
              <em>Plot twist, I know.</em>
            </h2>
          </Reveal>
          <motion.div
            className="ys-id-card"
            style={paused ? undefined : { transform }}
          >
            <div>
              <span>STUDENT OF THE HARD PROBLEM</span>
              <Plus size={15} />
            </div>
            <span className="ys-id-monogram">
              ys<span>✳</span>
            </span>
            <div>
              <strong>IIT (BHU) Varanasi</strong>
              <p>B.Tech + M.Tech · Biochemical Engineering</p>
            </div>
            <footer>
              <span>CLASS OF 2028</span>
              <span>{personal.cgpa} CGPA</span>
            </footer>
          </motion.div>
        </div>
        <div className="ys-about-body">
          <Reveal paused={paused}>
            <p className="ys-about-lead">
              My degree says biochemical engineering.
              <br />
              My browser tabs tell a different story.
            </p>
            <p>
              I’m a dual-degree student at IIT (BHU), happiest somewhere between
              a hard algorithm and a tool someone will actually use.
            </p>
            <p>
              That’s taken me from two-agent reinforcement games and Nash
              equilibria to C++ systems, open-source contributions, and native
              Mac apps. I like understanding how things work. I like making them
              work even more.
            </p>
          </Reveal>
          <div className="ys-experience">
            <h3>A LITTLE CONTEXT</h3>
            {experience.map((item) => (
              <Reveal
                key={item.company}
                className="ys-experience-row"
                paused={paused}
              >
                <div>
                  <span className="ys-red-dot" />
                  <strong>{item.company}</strong>
                  <span className="ys-experience-period">{item.period}</span>
                </div>
                <h4>{item.role}</h4>
                <p>
                  {item.type === "research"
                    ? "Two-agent reinforcement games, non-shared states, value/policy iteration, and convergence to Nash equilibrium."
                    : "Multimodal RAG pipelines, enterprise document understanding, and automated analytical reporting."}
                </p>
                <div className="ys-tags">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
          <div className="ys-toolbox">
            <h3>THE CURRENT TOOLBOX</h3>
            <div>
              {[
                ...skills[0].items.filter((item) => item !== "LaTeX"),
                "Swift",
                "SwiftUI",
                "React",
                "PettingZoo",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="ys-about-footnote">
        <span>Outside the editor?</span>
        <p>
          Probably overthinking a chess algorithm.
          <br />
          Or debugging a segfault at 3 AM.
        </p>
        <span className="ys-footnote-asterisk" aria-hidden="true">
          ✳
        </span>
      </div>
    </section>
  );
}

function Contact({ personal, paused }) {
  const [copyState, setCopyState] = useState("idle");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyState("idle"), 2500);
  }
  return (
    <footer id="contact" className="ys-contact">
      <SectionLabel number="04">An open invitation</SectionLabel>
      <div className="ys-contact-top">
        <h2>
          Got a good
          <br />
          <em>“what if?”</em>
        </h2>
        <div>
          <p>
            A hard problem. A strange idea.
            <br />
            Something worth building together.
            <br />
            I’d like to hear it.
          </p>
          <MagneticLink
            href={`mailto:${personal.email}`}
            className="ys-button ys-button-dark"
            paused={paused}
          >
            Let’s make it happen <ArrowUpRight size={18} />
          </MagneticLink>
          <button className="ys-copy-email" onClick={copyEmail} type="button">
            {copyState === "copied" ? <Check size={13} /> : <Copy size={13} />}
            <span aria-live="polite">
              {copyState === "copied"
                ? "Email copied"
                : copyState === "failed"
                  ? "Use the email link above"
                  : "Or copy my email"}
            </span>
          </button>
        </div>
      </div>
      <div className="ys-footer-links">
        <a href={personal.github} target="_blank" rel="noopener noreferrer">
          GitHub <ArrowUpRight size={15} />
        </a>
        <a href={personal.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn <ArrowUpRight size={15} />
        </a>
        <a href={personal.codeforces} target="_blank" rel="noopener noreferrer">
          Codeforces <ArrowUpRight size={15} />
        </a>
        <a href={personal.resume} target="_blank" rel="noopener noreferrer">
          Résumé <ArrowUpRight size={15} />
        </a>
        <a className="ys-back-top" href="#top">
          Back to the top <ArrowUpRight size={15} />
        </a>
      </div>
      <a
        className="ys-footer-name"
        href="#top"
        aria-label="Yashashwi — back to top"
      >
        yashashwi<span>✳</span>
      </a>
      <div className="ys-colophon">
        <span>© {new Date().getFullYear()} Yashashwi Singhania</span>
        <span>Made with intent. Always in progress.</span>
        <span>VARANASI → EVERYWHERE</span>
      </div>
    </footer>
  );
}

export default function HomeClient({
  personal,
  projects,
  experience,
  achievements,
  skills,
  arrasStars,
  fontClass,
}) {
  const prefersReduced = useReducedMotion();
  const [motionPreferenceReady, setMotionPreferenceReady] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const systemReduced = Boolean(motionPreferenceReady && prefersReduced);
  const paused = systemReduced || userPaused;
  useEffect(() => setMotionPreferenceReady(true), []);
  const { scrollYProgress } = useScroll();
  const progressTransform = useTransform(
    scrollYProgress,
    (value) => `scaleX(${value})`,
  );
  useEffect(() => {
    const elements = [
      document.querySelector(".ys-hero"),
      ...NAV_ITEMS.map((item) => document.getElementById(item.id)),
    ].filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: "-20% 0px -50% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const elements = [...document.querySelectorAll(".ys-hero, .ys-work-card")];
    const visible = new Set();
    const update = () =>
      elements.forEach((element) => {
        const state =
          !paused && !document.hidden && visible.has(element)
            ? "running"
            : "paused";
        element
          .querySelectorAll(
            ".ys-hero-store, .ys-fadeo-equalizer > i, .ys-pacman-agent",
          )
          .forEach((animation) => {
            animation.style.animationPlayState = state;
          });
      });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      update();
    });
    elements.forEach((element) => observer.observe(element));
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [paused]);
  useEffect(() => {
    if (paused || !window.matchMedia("(pointer: fine)").matches) return;
    let cancelled = false,
      cleanup = () => {};
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        // Native hash navigation stays immediate for keyboard and skip links.
        anchors: false,
        autoRaf: false,
      });
      let frame = 0;
      function tick(time) {
        lenis.raf(time);
        frame = requestAnimationFrame(tick);
      }
      function visibility() {
        cancelAnimationFrame(frame);
        if (!document.hidden) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
      document.addEventListener("visibilitychange", visibility);
      cleanup = () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("visibilitychange", visibility);
        lenis.destroy();
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [paused]);
  return (
    <MotionConfig reducedMotion={paused ? "always" : "user"}>
      <div
        id="top"
        className={`ys-site ${fontClass}`}
        data-motion={paused ? "paused" : "full"}
      >
        <a className="ys-skip-link" href="#main-content">
          Skip to content
        </a>
        <motion.div
          className="ys-reading-progress"
          style={{ transform: progressTransform }}
        />
        <header className="ys-header">
          <a
            className="ys-brand"
            href="#top"
            aria-label="Yashashwi Singhania, home"
          >
            <span className="ys-brand-symbol">
              y<span>✳</span>
            </span>
            <span>
              yashashwi
              <br />
              <strong>singhania</strong>
            </span>
          </a>
          <nav aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeSection === item.id ? "is-active" : ""}
              >
                <span>{item.number}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="ys-header-end">
            <LocalClock />
            <button
              type="button"
              className="ys-motion-toggle"
              onClick={() => setUserPaused((value) => !value)}
              aria-label={paused ? "Enable motion" : "Pause motion"}
              aria-pressed={paused}
              disabled={systemReduced}
              title={
                systemReduced
                  ? "Following your device’s reduced motion preference"
                  : paused
                    ? "Enable motion"
                    : "Pause motion"
              }
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
              <span>Motion {paused ? "off" : "on"}</span>
            </button>
            <a href="#contact" className="ys-nav-contact">
              Let’s talk <ArrowUpRight size={16} />
            </a>
          </div>
        </header>
        <main id="main-content">
          <Hero personal={personal} paused={paused} />
          <DisciplineStrip paused={paused} />
          <WorkSection projects={projects} stars={arrasStars} paused={paused} />
          <ProofSection paused={paused} achievements={achievements} />
          <AboutSection
            personal={personal}
            experience={experience}
            skills={skills}
            paused={paused}
          />
        </main>
        <Contact personal={personal} paused={paused} />
      </div>
    </MotionConfig>
  );
}
