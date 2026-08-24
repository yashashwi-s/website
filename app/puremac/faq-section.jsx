export function FaqJsonLd({ faqs }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: Array.isArray(answer) ? answer.join("\n\n") : answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function FaqSection({
  faqs,
  accent,
  className = "",
  light = false,
  title = "Questions, answered.",
}) {
  const border = light ? "border-black/12" : "border-white/10";
  const muted = light ? "text-black/48" : "text-white/45";
  const question = light ? "text-black/80" : "text-white/85";

  return (
    <section
      aria-labelledby="faq-heading"
      className={`border-t ${border} py-20 sm:py-28 ${className}`}
    >
      <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <div>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.04em]"
          >
            {title}
          </h2>
          <p className={`mt-5 max-w-sm text-[14.5px] leading-[1.7] ${muted}`}>
            Practical answers about features, compatibility, pricing, privacy, and installation.
          </p>
        </div>

        <div>
          {faqs.map(({ question: prompt, answer, sources = [] }, index) => {
            const paragraphs = Array.isArray(answer) ? answer : [answer];

            return (
              <details key={prompt} className={`group border-t ${border} first:border-t-0`}>
                <summary
                  data-cursor="snap"
                  className="cursor-pointer list-none marker:content-none"
                >
                  <h3
                    className={`flex items-start justify-between gap-6 py-5 text-[16px] font-semibold leading-snug sm:text-[17px] ${question}`}
                  >
                    <span className="flex gap-4">
                      <span
                        className="mt-0.5 shrink-0 font-mono text-[10px] font-normal tracking-[0.12em] opacity-70"
                        style={{ color: accent }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {prompt}
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-xl font-light leading-none transition-transform duration-200 group-open:rotate-45"
                      style={{ color: accent }}
                    >
                      +
                    </span>
                  </h3>
                </summary>
                <div className={`max-w-2xl space-y-3 pb-6 pl-10 text-[14.5px] leading-[1.75] ${muted}`}>
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {sources.length > 0 && (
                    <p className="flex flex-wrap gap-x-3 gap-y-1 pt-1 font-mono text-[10.5px] leading-relaxed uppercase tracking-[0.1em]">
                      <span className="opacity-60">Sources</span>
                      {sources.map((source) => (
                        <a
                          key={source.href}
                          href={source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-current/30 underline-offset-4 transition-opacity hover:opacity-70"
                          style={{ color: accent }}
                        >
                          {source.label}
                        </a>
                      ))}
                    </p>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
