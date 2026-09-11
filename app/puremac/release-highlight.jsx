export default function ReleaseHighlight({ entry, light = false }) {
  return <section id="release-highlights" style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px", color: light ? "#292927" : "#e8e8e8", borderTop: "1px solid #8885" }}>
    <p style={{ fontSize: 13, marginBottom: 12 }}>{entry.version} · <time dateTime={entry.date}>{entry.date}</time></p>
    <h2 style={{ fontSize: 28, lineHeight: 1.25, marginBottom: 18 }}>Release highlight: {entry.title}</h2>
    <p style={{ fontSize: 16, lineHeight: 1.8, maxWidth: 760 }}>{entry.text}</p>
    <a href={entry.url} style={{ display: "inline-block", marginTop: 18, fontSize: 14, textDecoration: "underline", textUnderlineOffset: 4 }}>Read the {entry.version} release notes ↗</a>
  </section>;
}
