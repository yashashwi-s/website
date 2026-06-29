"use client";

import { useState, useCallback } from "react";
import {
  Share2,
  Download,
  Mail,
  MessageCircle,
  Check,
} from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import { motion } from "framer-motion";

// ── Premium Toast ─────────────────────────────────────────

function Toast({ show, message }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-[0.22,1,0.36,1] ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-mono text-sm tracking-wide shadow-[0_8px_40px_rgba(255,255,255,0.15)]">
        <Check className="w-4 h-4" />
        <span>{message}</span>
      </div>
    </div>
  );
}

// ── Markdown Renderer (**bold** and [text](url)) ──────────

function Md({ children }) {
  if (typeof children !== "string") return children;

  const tokens = [];
  let remaining = children;

  while (remaining.length > 0) {
    const boldIdx = remaining.indexOf("**");
    const linkIdx = remaining.indexOf("[");

    let firstIdx = Infinity;
    let type = null;

    if (boldIdx !== -1 && boldIdx < firstIdx) {
      firstIdx = boldIdx;
      type = "bold";
    }
    if (linkIdx !== -1 && linkIdx < firstIdx) {
      firstIdx = linkIdx;
      type = "link";
    }

    if (type === null) {
      tokens.push({ type: "text", value: remaining });
      break;
    }

    if (firstIdx > 0) {
      tokens.push({ type: "text", value: remaining.slice(0, firstIdx) });
    }

    if (type === "bold") {
      const endBold = remaining.indexOf("**", firstIdx + 2);
      if (endBold === -1) {
        tokens.push({ type: "text", value: remaining.slice(firstIdx) });
        break;
      }
      tokens.push({
        type: "bold",
        value: remaining.slice(firstIdx + 2, endBold),
      });
      remaining = remaining.slice(endBold + 2);
    } else {
      const linkMatch = remaining
        .slice(firstIdx)
        .match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        tokens.push({
          type: "link",
          label: linkMatch[1],
          url: linkMatch[2],
        });
        remaining = remaining.slice(firstIdx + linkMatch[0].length);
      } else {
        tokens.push({ type: "text", value: "[" });
        remaining = remaining.slice(firstIdx + 1);
      }
    }
  }

  return (
    <>
      {tokens.map((t, i) => {
        if (t.type === "bold")
          return (
            <strong key={i} className="font-bold text-white">
              {t.value}
            </strong>
          );
        if (t.type === "link")
          return (
            <a
              key={i}
              href={t.url}
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-white underline decoration-white/20 hover:decoration-white/60 underline-offset-4 transition-colors"
            >
              {t.label}
            </a>
          );
        return <span key={i}>{t.value}</span>;
      })}
    </>
  );
}

// ── Main CV Client ────────────────────────────────────────

export default function CVClient({ data }) {
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.name} \u2014 Resume`,
          text: `Check out ${data.name}'s resume`,
          url: "https://cv.yashashwi.me",
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText("https://cv.yashashwi.me");
      showToast("Link copied to clipboard");
    }
  };

  const waLink = data.phone
    ? `https://wa.me/${data.phone.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <>
      <CustomCursor />
      <Toast show={toast.show} message={toast.message} />

      <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans relative">
        {/* ── Floating Action Dock ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-1/2 right-4 md:right-8 -translate-y-1/2 flex flex-col gap-3 z-50 print:hidden"
        >
          <ActionBtn
            as="a"
            href="https://yashashwi.me/Yashashwi_Singhania_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            download="Yashashwi_Singhania_Resume.pdf"
            title="Download PDF"
            icon={<Download className="w-5 h-5" />}
          />
          <ActionBtn
            as="button"
            onClick={handleShare}
            title="Share"
            icon={<Share2 className="w-5 h-5" />}
          />
          <ActionBtn
            as="a"
            href={`mailto:${data.email}`}
            title="Email"
            icon={<Mail className="w-5 h-5" />}
          />
          {waLink && (
            <ActionBtn
              as="a"
              href={waLink}
              target="_blank"
              rel="noreferrer"
              title="WhatsApp"
              icon={<MessageCircle className="w-5 h-5" />}
            />
          )}
        </motion.div>

        {/* ── CV Document ────────────────────────────── */}
        <div className="max-w-[900px] mx-auto py-24 px-8 md:px-16 bg-[#0a0a0a] min-h-screen border-x border-white/5">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest mb-6">
              {data.name}
            </h1>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 font-mono text-xs md:text-sm text-white/50">
              {data.phone && <span>{data.phone}</span>}
              {data.email && (
                <>
                  <Sep />
                  <a
                    href={`mailto:${data.email}`}
                    className="hover:text-white transition-colors underline decoration-white/15 underline-offset-4"
                  >
                    {data.email}
                  </a>
                </>
              )}
              {data.links?.map((link) => (
                <span key={link.label} className="contents">
                  <Sep />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors underline decoration-white/15 underline-offset-4"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </div>
          </motion.header>

          {/* Dynamic Sections */}
          {data.sections?.map((section, si) => (
            <SectionBlock key={si} section={section} isLast={si === data.sections.length - 1} />
          ))}
        </div>
      </div>
    </>
  );
}

// ── Section Renderer ──────────────────────────────────────

function SectionBlock({ section, isLast }) {
  return (
    <section className={isLast ? "" : "mb-10"}>
      <h2 className="text-xl font-bold uppercase tracking-[0.2em] mb-6 pb-2 text-white/90">
        {section.title}
      </h2>

      {section.type === "subheadings" && (
        <div className="space-y-8">
          {section.entries.map((e, i) => (
            <div key={i}>
              <Row left={e.line1Left} right={e.line1Right} bold />
              {(e.line2Left || e.line2Right) && (
                <Row left={e.line2Left} right={e.line2Right} italic muted />
              )}
              {e.bullets.length > 0 && <BulletList items={e.bullets} />}
            </div>
          ))}
        </div>
      )}

      {section.type === "projects" && (
        <div className="space-y-6">
          {section.entries.map((e, i) => (
            <div key={i}>
              <div className="flex flex-col md:flex-row md:justify-between items-baseline mb-1">
                <h3 className="text-lg font-bold">
                  {e.name}
                  <span className="font-normal italic text-white/60 text-base ml-2">
                    — {e.tech}
                  </span>
                </h3>
                <span className="font-mono text-sm text-white/50 shrink-0">
                  {e.date}
                </span>
              </div>
              {e.bullets.length > 0 && <BulletList items={e.bullets} />}
            </div>
          ))}
        </div>
      )}

      {section.type === "items" && <BulletList items={section.entries} />}

      {section.type === "skills" && (
        <ul className="space-y-2 text-white/80 text-sm">
          {section.entries.map((s) => (
            <li key={s.category}>
              <strong className="font-bold text-white">
                {s.category}:
              </strong>{" "}
              {s.items}
            </li>
          ))}
        </ul>
      )}

      {section.type === "raw" && (
        <p className="text-white/70 text-sm leading-relaxed">
          <Md>{section.content}</Md>
        </p>
      )}
    </section>
  );
}

// ── Primitives ────────────────────────────────────────────

function Row({ left, right, bold, italic, muted }) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between items-baseline mb-1">
      <span
        className={`${bold ? "text-lg font-bold" : ""} ${
          italic ? "italic text-sm" : ""
        } ${muted ? "text-white/60" : ""}`}
      >
        <Md>{left}</Md>
      </span>
      {right && (
        <span className="font-mono text-sm text-white/50 shrink-0">
          {right}
        </span>
      )}
    </div>
  );
}

function BulletList({ items }) {
  const validItems = items.filter((item) => item && item.trim() !== "");
  if (validItems.length === 0) return null;

  return (
    <ul className="space-y-2 text-white/75 text-sm list-disc list-outside ml-4 mt-2">
      {validItems.map((item, i) => (
        <li key={i} className="leading-relaxed">
          <Md>{item}</Md>
        </li>
      ))}
    </ul>
  );
}

function Sep() {
  return <span className="text-white/15">|</span>;
}

function ActionBtn({ as: Tag = "button", icon, ...props }) {
  return (
    <Tag
      {...props}
      className="w-12 h-12 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md text-white/50 hover:text-white"
    >
      {icon}
    </Tag>
  );
}
