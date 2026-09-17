import { Anton, Instrument_Serif } from "next/font/google";

const poster = Anton({ subsets: ["latin"], variable: "--font-poster", display: "swap", preload: false, weight: "400" });
const editorial = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
  preload: false,
  weight: "400",
  style: "italic",
});

export const metadata = {
  title: "404 — nothing here",
  description: "That page does not exist.",
};

export default function NotFound() {
  return (
    <div
      id="nf-page"
      className={`${poster.variable} ${editorial.variable} relative min-h-screen overflow-hidden bg-[#0b0b0c] text-white`}
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      <style>{`
        body:has(#nf-page) .noise-bg { display: none; }
        #nf-page h1, #nf-page h2, #nf-page .display {
          font-family: var(--font-poster), ui-sans-serif, system-ui, sans-serif;
          font-weight: 400; text-transform: uppercase;
        }
        #nf-page .editorial {
          font-family: var(--font-editorial), ui-serif, Georgia, serif;
          font-style: italic; text-transform: none;
        }
        #nf-page ::selection { background: #ccff2e; color: #000; }
        #nf-page .nf-link { transition: color 160ms ease, transform 160ms ease; }
        #nf-page .nf-link:hover .nf-title { color: #ccff2e; }
        #nf-page .nf-link:hover .nf-arrow { opacity: 1; transform: translateX(0); }
        #nf-page .nf-home { transition: transform 160ms ease, box-shadow 160ms ease; }
        #nf-page .nf-home:hover { box-shadow: 0 0 24px rgba(204, 255, 46, 0.25); transform: translateY(-2px); }
        @media (hover: hover) and (pointer: fine) {
          #nf-page, #nf-page * { cursor: auto !important; }
          #nf-page a { cursor: pointer !important; }
        }
      `}</style>

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <a href="/" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white">
            <span style={{ color: "#ccff2e" }}>●</span> ys
          </a>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">error 404</span>
        </header>

        <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <h1 className="select-none text-[clamp(6rem,26vw,17rem)] leading-[0.78] tracking-[0.01em]">404</h1>
            <p className="mt-8 max-w-md text-[17px] leading-[1.6] text-white/60">
              This page doesn&apos;t exist. It may have been renamed <span className="editorial text-white">twice</span>, like most things around here, or it may never have existed at all.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a href="/" className="nf-home inline-flex items-center gap-2 rounded-full bg-[#ccff2e] px-7 py-3.5 text-[14px] font-semibold text-black">
                Take me home
              </a>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/25">you are here</span>
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">Things that do exist</p>
            <ul className="mt-6">
              {ELSEWHERE.map((item, i) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="nf-link group flex items-baseline gap-4 border-t border-white/10 py-4 last:border-b"
                  >
                    <span className="w-6 shrink-0 font-mono text-[10.5px] text-white/25">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">
                      <span className="nf-title display block text-[clamp(1.3rem,3vw,1.8rem)] leading-none">{item.label}</span>
                      <span className="mt-1.5 block text-[13.5px] text-white/40">{item.note}</span>
                    </span>
                    <svg aria-hidden viewBox="0 0 16 16" fill="none" className="nf-arrow mt-1 size-4 shrink-0 -translate-x-1 opacity-0" style={{ color: "#ccff2e" }}>
                      <path d="M3 13 13 3M6 3h7v7" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="py-8 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/20">Varanasi, India</footer>
      </div>
    </div>
  );
}

const ELSEWHERE = [
  { label: "Home", href: "/", note: "the work, the receipts" },
  { label: "PureMac", href: "https://puremac.yashashwi.me", note: "two native macOS apps" },
  { label: "Arras", href: "https://arras.yashashwi.me", note: "photos on your desktop" },
  { label: "Fadeo", href: "https://puremac.yashashwi.me/fadeo", note: "audio that follows your work" },
  { label: "CV", href: "https://cv.yashashwi.me", note: "one page, print-ready" },
  { label: "GitHub", href: "https://github.com/yashashwi-s", note: "everything, unedited" },
];
