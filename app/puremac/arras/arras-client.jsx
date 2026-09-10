"use client";

import FaqSection from "../faq-section";
import "./arras.css";

const SOURCE = "https://github.com/yashashwi-s/Arras";
const features = [
  ["Keep the whole picture.", "Panoramas stay wide. Portraits stay tall. Arras follows your photo’s proportions, not a fixed widget grid."],
  ["Find its place.", "Arrange photos below desktop icons, above them, or over your windows. Move and resize without stealing focus from your work."],
  ["Make it yours.", "Adjust the frame, shadow, opacity, and tilt. Keep it quiet or make it personal. Each photo gets its own treatment."],
  ["Let it change.", "Rotate a collection of images in one widget, or bring GIFs and APNGs to your desktop."],
];

export default function ArrasClient({ release, downloads, faqs }) {
  const download = release?.dmg ?? release?.zip ?? `${SOURCE}/releases/latest`;
  return (
    <main id="arras-page">
      <nav className="ar-wrap ar-nav" aria-label="Main navigation">
        <a className="ar-brand" href="#"><img src="/puremac/arras/mark.svg" width="34" height="30" alt="" />Arras<span>FOR MAC</span></a>
        <div><a href="#details">The details</a><a href={SOURCE}>Source ↗</a><a className="ar-nav-download" href="#install">Get Arras ↓</a></div>
      </nav>

      <header className="ar-wrap ar-hero">
        <div><p className="ar-label">A small app. A more personal desktop.</p><h1>Your photos.<br /><em>Not squares.</em></h1></div>
        <div className="ar-hero-copy"><p>A photo widget that leaves your photos alone. Their shape, their edges, their place on your Mac. Exactly as you intended.</p><a className="ar-button" href={download}>Download Arras <span>↙</span></a><p className="ar-fine">Free & open source · macOS 14+ · Apple silicon</p><a className="ar-text-link" href="#install">First time installing? Read this first →</a></div>
      </header>

      <section className="ar-wrap ar-demo" aria-label="Arras product demonstration">
        <video controls playsInline preload="none" poster="/puremac/arras/demo-poster.jpg" aria-label="Watch Arras photo widgets being arranged on a Mac desktop"><source src="/puremac/arras/demo.mp4" type="video/mp4" />Your browser does not support video.</video>
        <div className="ar-caption"><span>01 / A desktop, made yours.</span><span>Real app. Real desktop. Press play.</span></div>
      </section>

      <section className="ar-wrap ar-section" id="details">
        <div className="ar-split"><div><p className="ar-label">Built around the picture</p><h2>The photo decides<br />the shape.</h2></div><p className="ar-intro">Most widgets start with a box. Arras starts with your image. It’s a native macOS tool for the little things that make a desktop feel like yours—without an account, a subscription, or telemetry.</p></div>
        <div className="ar-features">{features.map(([title, body], i) => <article key={title}><span className="ar-number">0{i + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="ar-comparison"><div className="ar-wrap ar-section"><p className="ar-label">A different starting point</p><h2>How is Arras different from<br className="ar-desktop-break" /> the macOS Photos widget?</h2><p className="ar-intro">The built-in widget is convenient. Arras is for when you want control over the image itself.</p><div className="ar-table-scroll"><table><thead><tr><th scope="col">What matters</th><th scope="col">macOS Photos widget</th><th scope="col">Arras</th></tr></thead><tbody>{[["Photo shape", "Fixed widget formats", "Original aspect ratio"], ["Placement", "Desktop or Notification Center", "Below icons through above apps"], ["Personal styling", "System widget appearance", "Per-photo frames, shadows & tilt"], ["Price & source", "Included with macOS", "Free, MIT-licensed source"]].map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div><p className="ar-fine">For Apple’s current widget controls, see the <a href="https://support.apple.com/guide/mac-help/add-and-customize-widgets-mchl52be5da5/mac">macOS User Guide ↗</a>.</p></div></section>

      <section id="install" className="ar-wrap ar-section"><div className="ar-split"><div><p className="ar-label">Yours to use. Yours to inspect.</p><h2>A little room<br />for your photos.</h2><p className="ar-intro">No subscription. No account. No telemetry.<br />Just a small native app, and your desktop.</p><a className="ar-button" href={download}>Download for Mac <span>↙</span></a><p className="ar-fine">{release?.tag ?? "Latest release"}{downloads?.total ? ` · ${new Intl.NumberFormat("en-US").format(downloads.total)} GitHub asset downloads` : ""}</p><a className="ar-text-link" href={`${SOURCE}/releases`}>Release notes ↗</a></div><div className="ar-install-notes"><h3>Before you open it</h3><p>Arras isn’t notarized yet. macOS may block the first launch. Download only from the official GitHub release linked here and review the source if you’d like.</p><h3>Prefer Homebrew?</h3><pre><code>{"brew tap yashashwi-s/tap\nbrew install --cask arras"}</code></pre><p>If macOS blocks the app after you’ve verified its source, this removes its quarantine flag:</p><pre><code>xattr -dr com.apple.quarantine /Applications/Arras.app</code></pre><p className="ar-fine">This bypasses the quarantine check for Arras. Intel users can build from source; the published download is for Apple silicon.</p></div></div></section>

      <section className="ar-wrap ar-faq"><FaqSection faqs={faqs} light accent="#ad583c" title="A few useful answers." /></section>
      <section className="ar-wrap ar-lineage"><p className="ar-label">Same project. Its own name.</p><h2>Photo Widget OSX → Tableau → Arras</h2><p>If you found an older name in a post or a download, you’re in the right place. Arras is the continuation of that project.</p></section>
      <footer className="ar-wrap ar-footer"><div className="ar-brand"><img src="/puremac/arras/mark.svg" width="34" height="30" alt="" />Arras</div><p>Small by intention. Yours by design.</p><div><a href="https://yashashwi.me">Made by Yashashwi ↗</a><a href={SOURCE}>GitHub ↗</a><a href="https://puremac.yashashwi.me">PureMac ↗</a></div></footer>
    </main>
  );
}
