export function LegalSection({ title, children }) {
  return (
    <section className="border-t border-white/8 pt-8 first:border-t-0 first:pt-0">
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-white/90">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-7 text-white/60">
        {children}
      </div>
    </section>
  );
}

export default function LegalPage({
  label,
  title,
  summary,
  updated,
  children,
}) {
  return (
    <div
      id="puremac-page"
      className="min-h-screen cursor-auto overflow-x-clip bg-[#050505] text-white"
      style={{
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <style>{`body:has(#puremac-page) .noise-bg { display: none; }`}</style>

      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 pb-2 pt-10 sm:px-8">
        <a
          href="/puremac/fadeo"
          className="text-[13px] text-white/45 transition-colors hover:text-white/80"
        >
          ← Fadeo
        </a>

        <nav className="flex items-center gap-5 text-[13px] text-white/40">
          <a
            href="/puremac/fadeo/privacy"
            className="transition-colors hover:text-white/75"
          >
            Privacy
          </a>
          <a
            href="/puremac/fadeo/terms"
            className="transition-colors hover:text-white/75"
          >
            Terms
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:px-8 sm:pt-24">
        <p className="mb-4 text-[13px] uppercase tracking-[0.16em] text-[#67e4d2]">
          {label}
        </p>

        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-[16px] leading-7 text-white/55">
          {summary}
        </p>

        <p className="mt-4 text-[13px] text-white/30">
          Effective and last updated: {updated}
        </p>

        <div className="mt-16 space-y-10">{children}</div>
      </main>

      <footer className="mx-auto flex max-w-4xl flex-col gap-3 border-t border-white/8 px-6 py-10 text-[12.5px] text-white/30 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>Fadeo is developed by Yashashwi Singhania.</span>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="mailto:fadeo.puremac@gmail.com"
            className="transition-colors hover:text-white/65"
          >
            Contact
          </a>
          <a
            href="https://yashashwi.me"
            className="transition-colors hover:text-white/65"
          >
            Developer
          </a>
          <a
            href="https://github.com/yashashwi-s/Fadeo"
            className="transition-colors hover:text-white/65"
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  );
}
