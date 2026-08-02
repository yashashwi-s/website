"use client";

import { useCallback, useState } from "react";
import { Check, Download, Mail, MessageCircle, Share2 } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";

/* The CV is the paper one.
 *
 * Everything else in the family is dark — the homepage is acid on near-black,
 * Arras and Fadeo likewise. A CV is a document, not a landing page, so it gets
 * ink on paper: serif headings, a real measure, generous margins. That is also
 * the only version of this page that prints correctly, which is the one thing a
 * CV genuinely has to do.
 *
 * The parsed shape from lib/parse-resume is unchanged: section.type is one of
 * subheadings | projects | items | skills | raw.
 */
const INK = "#14131a";
const PAPER = "#f5f2ea";

// ── Toast ─────────────────────────────────────────────────

function Toast({ show, message }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 transition-all duration-500 ease-[0.22,1,0.36,1] print:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div
        className="flex items-center gap-3 rounded-full px-6 py-3 font-mono text-[13px] tracking-wide text-[#f5f2ea] shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
        style={{ backgroundColor: INK }}
      >
        <Check className="h-4 w-4" />
        <span>{message}</span>
      </div>
    </div>
  );
}

// ── Markdown renderer (**bold** and [text](url)) ──────────

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
      tokens.push({ type: "bold", value: remaining.slice(firstIdx + 2, endBold) });
      remaining = remaining.slice(endBold + 2);
    } else {
      const linkMatch = remaining.slice(firstIdx).match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        tokens.push({ type: "link", label: linkMatch[1], url: linkMatch[2] });
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
            <strong key={i} className="font-semibold" style={{ color: INK }}>
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
              className="underline decoration-black/25 underline-offset-[3px] transition-colors hover:decoration-black/70"
              style={{ color: INK }}
            >
              {t.label}
            </a>
          );
        return <span key={i}>{t.value}</span>;
      })}
    </>
  );
}

// ── Main ──────────────────────────────────────────────────

export default function CVClient({ data, fontClass = "" }) {
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.name} — Resume`,
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

  const waLink = data.phone ? `https://wa.me/${data.phone.replace(/[^0-9]/g, "")}` : null;

  return (
    <div
      id="cv-page"
      className={`${fontClass} min-h-screen`}
      style={{ backgroundColor: "#e8e4da", color: INK, fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      <style>{`
        body:has(#cv-page) .noise-bg { display: none; }
        #cv-page h1, #cv-page h2, #cv-page h3, #cv-page .display {
          font-family: var(--font-cv), ui-serif, Georgia, serif;
          font-weight: 400;
        }
        #cv-page ::selection { background: ${INK}; color: ${PAPER}; }
        /* A CV has one job it must not fail at. The sheet becomes the page,
           the dock and the desk background go away, and links stop being blue. */
        @media print {
          #cv-page { background: #fff !important; }
          #cv-page .sheet {
            box-shadow: none !important;
            margin: 0 !important;
            max-width: none !important;
            padding: 0 !important;
            background: #fff !important;
          }
          #cv-page a { text-decoration: none !important; color: ${INK} !important; }
          @page { margin: 14mm; }
        }
      `}</style>

      <CustomCursor />
      <Toast show={toast.show} message={toast.message} />

      {/* ── Action dock ─────────────────────────────────── */}
      <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2.5 print:hidden md:right-8">
        <ActionBtn
          as="a"
          href="https://yashashwi.me/Yashashwi_Singhania_Resume.pdf"
          target="_blank"
          rel="noreferrer"
          download="Yashashwi_Singhania_Resume.pdf"
          title="Download PDF"
          icon={<Download className="h-[18px] w-[18px]" />}
        />
        <ActionBtn as="button" onClick={handleShare} title="Share" icon={<Share2 className="h-[18px] w-[18px]" />} />
        <ActionBtn
          as="a"
          href={`mailto:${data.email}`}
          title="Email"
          icon={<Mail className="h-[18px] w-[18px]" />}
        />
        {waLink && (
          <ActionBtn
            as="a"
            href={waLink}
            target="_blank"
            rel="noreferrer"
            title="WhatsApp"
            icon={<MessageCircle className="h-[18px] w-[18px]" />}
          />
        )}
      </div>

      {/* ── The sheet ───────────────────────────────────── */}
      <div className="px-4 py-8 sm:px-6 sm:py-14">
        <article
          className="sheet mx-auto max-w-[860px] px-7 py-12 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_60px_-24px_rgba(0,0,0,0.28)] sm:px-16 sm:py-16"
          style={{ backgroundColor: PAPER }}
        >
          <header className="border-b border-black/15 pb-7">
            <h1 className="text-[clamp(2.4rem,7vw,3.9rem)] leading-[0.95] tracking-[-0.015em]">
              {data.name}
            </h1>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11.5px] tracking-[0.04em] text-black/55">
              {data.phone && <span>{data.phone}</span>}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="underline decoration-black/20 underline-offset-[3px] transition-colors hover:text-black hover:decoration-black/60"
                >
                  {data.email}
                </a>
              )}
              {data.links?.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-black/20 underline-offset-[3px] transition-colors hover:text-black hover:decoration-black/60"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </header>

          {data.sections?.map((section, si) => (
            <SectionBlock key={si} section={section} />
          ))}
        </article>

        <p className="mx-auto mt-6 max-w-[860px] px-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-black/30 print:hidden">
          Generated from resume.tex ·{" "}
          <a href="https://yashashwi.me" className="underline underline-offset-2 transition-colors hover:text-black">
            yashashwi.me
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────

function SectionBlock({ section }) {
  return (
    <section className="mt-10 break-inside-avoid">
      <h2 className="mb-5 border-b border-black/12 pb-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-black/45">
        {section.title}
      </h2>

      {section.type === "subheadings" && (
        <div className="space-y-7">
          {section.entries.map((e, i) => (
            <div key={i} className="break-inside-avoid">
              <Row left={e.line1Left} right={e.line1Right} lead />
              {(e.line2Left || e.line2Right) && <Row left={e.line2Left} right={e.line2Right} muted />}
              {e.bullets.length > 0 && <BulletList items={e.bullets} />}
            </div>
          ))}
        </div>
      )}

      {section.type === "projects" && (
        <div className="space-y-6">
          {section.entries.map((e, i) => (
            <div key={i} className="break-inside-avoid">
              <div className="mb-1 flex flex-col items-baseline justify-between gap-x-4 sm:flex-row">
                <h3 className="text-[19px] leading-tight">
                  {e.name}
                  {e.tech && <span className="text-[15px] text-black/45"> — {e.tech}</span>}
                </h3>
                {e.date && (
                  <span className="shrink-0 font-mono text-[11.5px] text-black/45">{e.date}</span>
                )}
              </div>
              {e.bullets.length > 0 && <BulletList items={e.bullets} />}
            </div>
          ))}
        </div>
      )}

      {section.type === "items" && <BulletList items={section.entries} />}

      {section.type === "skills" && (
        <dl className="space-y-2.5">
          {section.entries.map((s) => (
            <div key={s.category} className="grid gap-x-5 sm:grid-cols-[10rem_1fr]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-black/45">
                {s.category}
              </dt>
              <dd className="text-[14.5px] leading-[1.6] text-black/75">{s.items}</dd>
            </div>
          ))}
        </dl>
      )}

      {section.type === "raw" && (
        <p className="max-w-[62ch] text-[14.5px] leading-[1.7] text-black/70">
          <Md>{section.content}</Md>
        </p>
      )}
    </section>
  );
}

// ── Primitives ────────────────────────────────────────────

function Row({ left, right, lead, muted }) {
  return (
    <div className="mb-0.5 flex flex-col items-baseline justify-between gap-x-4 sm:flex-row">
      <span
        className={lead ? "text-[19px] leading-tight" : "text-[14.5px] italic text-black/55"}
        style={lead ? { fontFamily: "var(--font-cv), ui-serif, Georgia, serif" } : undefined}
      >
        <Md>{left}</Md>
      </span>
      {right && (
        <span className={`shrink-0 font-mono text-[11.5px] ${muted ? "text-black/40" : "text-black/50"}`}>
          {right}
        </span>
      )}
    </div>
  );
}

function BulletList({ items }) {
  const valid = items.filter((item) => item && item.trim() !== "");
  if (valid.length === 0) return null;

  return (
    <ul className="mt-2.5 space-y-1.5">
      {valid.map((item, i) => (
        <li key={i} className="flex max-w-[68ch] gap-3 text-[14.5px] leading-[1.65] text-black/70">
          <span className="mt-[0.62em] h-[4px] w-[4px] shrink-0 rounded-full bg-black/30" />
          <span>
            <Md>{item}</Md>
          </span>
        </li>
      ))}
    </ul>
  );
}

function ActionBtn({ as: Tag = "button", icon, ...props }) {
  return (
    <Tag
      {...props}
      data-cursor="snap"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-black/12 bg-[#f5f2ea] text-black/45 shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-black/35 hover:text-black"
    >
      {icon}
    </Tag>
  );
}
