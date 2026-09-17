import { macProducts, releaseHighlights } from "@/data/mac-products";
import { arrasFeatureContractUrl } from "@/data/arras-product";
import ReleaseHighlight from "../release-highlight";
import FaqSection from "../faq-section";
import ArrasDemo from "./arras-demo";
import "./arras.css";

const product = macProducts.arras;
const SOURCE = product.repo;
const features = [
  ["Keep the whole picture.", "Panoramas stay wide. Portraits stay tall. Arras follows your photo’s proportions, not a fixed widget grid."],
  ["Find its place.", "Arrange photos below desktop icons, above them, or over your windows. Move and resize without stealing focus from your work."],
  ["Make it yours.", "Adjust the frame, shadow, opacity, and tilt. Keep it quiet or make it personal. Each photo gets its own treatment."],
  ["Let it change.", "Rotate a collection of images in one widget, or bring GIFs and APNGs to your desktop."],
];

export default function ArrasClient({ release, downloads, faqs, dateModified, posterProps }) {
  const download = release?.dmg ?? release?.zip ?? `${SOURCE}/releases/latest`;
  return (
    <main id="arras-page">
      <nav className="ar-wrap ar-nav" aria-label="Main navigation">
        <a className="ar-brand" href="#"><img src="/puremac/arras/mark.svg" width="34" height="30" alt="" />{product.name}<span>FOR MAC</span></a>
        <div><a href="#details">The details</a><a href={SOURCE}>Source ↗</a><a className="ar-nav-download" href="#install">Get Arras ↓</a></div>
      </nav>

      <header className="ar-wrap ar-hero">
        <div><p className="ar-label">A native macOS photo widget.</p><h1>Your photos.<br /><em>Not squares.</em></h1></div>
        <div className="ar-hero-copy"><p>Arras is a free, native Mac photo widget that keeps each image’s original aspect ratio. Your photos, without forced cropping. Their shape, their place, your desktop.</p><a className="ar-button" href={download}>Download Arras <span>↙</span></a><p className="ar-fine">Free &amp; open source · {product.operatingSystem} · {product.architecture}</p><p className="ar-fine">Previously {product.historicalNames.join(" and ")}.</p><a className="ar-text-link" href="#install">First time installing? Read this first →</a></div>
      </header>

      <ArrasDemo posterProps={posterProps} />

      <section className="ar-wrap ar-section" id="details">
        <div className="ar-split"><div><p className="ar-label">Built around the picture</p><h2>The photo decides<br />the shape.</h2></div><p className="ar-intro">Most widgets start with a box. Arras starts with your image. It’s a native macOS tool for the little things that make a desktop feel like yours—without an account, a subscription, or telemetry.</p></div>
        <div className="ar-features">{features.map(([title, body], i) => <article key={title}><span className="ar-number">0{i + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="ar-comparison"><div className="ar-wrap ar-section"><p className="ar-label">A different starting point</p><h2>How is Arras different from<br className="ar-desktop-break" /> the macOS Photos widget?</h2><p className="ar-intro">The built-in widget is convenient. Arras is for when you want control over the image itself.</p><div className="ar-table-scroll"><table><thead><tr><th scope="col">What matters</th><th scope="col">macOS Photos widget</th><th scope="col">Arras</th></tr></thead><tbody>{[["Photo shape", "Fixed widget formats", "Original aspect ratio"], ["Placement", "Desktop or Notification Center", "Below icons through above apps"], ["Personal styling", "System widget appearance", "Per-photo frames, shadows & tilt"], ["Price & source", "Included with macOS", "Free, MIT-licensed source"]].map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div><p className="ar-fine">For Apple’s current widget controls, see the <a href="https://support.apple.com/guide/mac-help/add-and-customize-widgets-mchl52be5da5/mac">macOS User Guide ↗</a>.</p></div></section>

      <section id="install" className="ar-wrap ar-section"><div className="ar-split"><div><p className="ar-label">Yours to use. Yours to inspect.</p><h2>A little room<br />for your photos.</h2><p className="ar-intro">No subscription. No account. No telemetry.<br />Just a small native app, and your desktop.</p><a className="ar-button" href={download}>Download for Mac <span>↙</span></a><p className="ar-fine">{release?.tag ?? "Latest release"}{downloads?.total ? ` · ${new Intl.NumberFormat("en-US").format(downloads.total)} GitHub asset downloads` : ""}</p><a className="ar-text-link" href={`${SOURCE}/releases`}>Release notes ↗</a></div><div className="ar-install-notes"><h3>Before you open it</h3><p>Arras isn’t notarized yet. macOS may block the first launch. Download only from the official GitHub release linked here and review the source if you’d like.</p><h3>Installing the download</h3><p>Open the downloaded DMG and drag Arras into Applications. Launch it once. If macOS blocks it, and you trust the official download, open System Settings → Privacy &amp; Security and choose Open Anyway. Then open Arras from Applications and use its menu bar icon.</p><h3>Prefer Homebrew?</h3><pre><code>{product.homebrew.commands.join("\n")}</code></pre><p className="ar-fine">Homebrew tap trust verifies the tap’s formulae; it does not notarize Arras or change macOS Gatekeeper.</p><p>If macOS blocks the app after you’ve verified its source, this removes its quarantine flag:</p><pre><code>xattr -dr com.apple.quarantine /Applications/Arras.app</code></pre><p className="ar-fine">This bypasses the quarantine check for Arras. {product.architecture}.</p></div></div></section>

      <section id="how-to-use" className="ar-wrap ar-section">
        <div className="ar-split"><div><p className="ar-label">The official quick start</p><h2>How do I put a specific photo on my Mac desktop?</h2><p className="ar-intro">Install Arras, then choose your image from its menu bar controls. It creates a separate photo window at the image’s original proportions—not a fixed WidgetKit frame.</p><a className="ar-text-link" href="#install">Download and installation instructions ↑</a></div><div className="ar-install-notes">
          <h3>1. Add the exact image</h3><p>Open Arras from Applications and look for its menu bar icon. Add an image from the menu, drag an image file onto the icon, or paste a copied image with Command-V while using Arras. You can also choose a photo from your Photos library.</p>
          <h3>2. Place it without cropping</h3><p>Drag the photo to move it and drag a corner to resize it while keeping its aspect ratio. Open its controls to change layering, opacity, and frame styling. A rotating photo Space can use dynamic proportions or a deliberately fixed frame.</p>
          <h3>3. Change or remove it</h3><p>Use Settings to manage the photo, or right-click its desktop window for locking, layering, and removal actions. Arras runs in the menu bar rather than the Dock, so look there when you want to manage your photos again.</p>
          <p className="ar-fine">Product instructions checked against the <a href={SOURCE}>project documentation ↗</a>. Content reviewed <time dateTime={dateModified}>{dateModified}</time>.</p>
        </div></div>
      </section>
      <section id="controls-and-limits" className="ar-wrap ar-section">
        <div className="ar-split"><div><p className="ar-label">Beyond the first photo</p><h2>More control.<br />Clear limits.</h2><p className="ar-intro">The details that matter when you live with Arras every day.</p><p className="ar-fine">Checked against the <a href={arrasFeatureContractUrl(release?.tag)}>{release?.tag ?? "Current"} feature documentation ↗</a>. These are documented capabilities, not performance benchmarks.</p></div><div className="ar-install-notes">
          <h3 id="photo-rotation">Can I rotate photos without cropping them?</h3><p>Yes. Add several images to an Arras Space and choose dynamic sizing to preserve each image’s proportions. Fixed sizing is an intentional alternative: it crops changing images into one stable frame. Arras Spaces are photo collections, distinct from macOS desktop Spaces.</p>
          <h3 id="keyboard-controls">How do I position photos precisely?</h3><p>Arras snaps to nearby edges and alignment guides. Hold Command to temporarily disable snapping, or Shift to constrain movement to one axis. Photos placed behind desktop icons are locked because Finder covers that layer; change their depth in Arras before repositioning them.</p>
          <h3 id="shortcuts-and-imports">Does Arras support Shortcuts, PDFs, and screenshots?</h3><p>Arras provides seven Shortcuts actions covering adding photos, visibility, opacity, and photo-Space navigation. PDF-page import and screen-region capture are opt-in menu commands. Ordinary photo widgets remain usable without Accessibility or Screen Recording permission.</p>
          <h3 id="sharing-privacy">Will my photos stay hidden when I share my screen?</h3><p>Capture exclusion supports ordinary screenshots and screen recordings, but cannot protect AirPlay or HDMI mirroring. App-based hiding is best effort and does not detect browser calls. Check your actual sharing preview before showing sensitive photos.</p>
          <h3 id="layout-backups">Can I back up my desktop arrangement?</h3><p>Export an .arras layout archive to keep widgets and their stored media together. These archives contain Arras’s stored or re-encoded images, not archival originals. Keep your original photos separately; automatic layout history is not part of the current shipped scope.</p>
        </div></div>
      </section>
      <ReleaseHighlight entry={releaseHighlights.arras} light />
      <section className="ar-wrap ar-faq"><FaqSection faqs={faqs} light accent="#aa5539" title="A few useful answers." /></section>
      <section className="ar-wrap ar-lineage"><p className="ar-label">Same project. Its own name.</p><h2>Photo Widget OSX → Tableau → Arras</h2><p>If you found an older name in a post or a download, you’re in the right place. Arras is the continuation of that project.</p></section>
      <footer className="ar-wrap ar-footer"><div className="ar-brand"><img src="/puremac/arras/mark.svg" width="34" height="30" alt="" />{product.name}</div><p>Small by intention. Yours by design.</p><div><a href="https://yashashwi.me">Made by Yashashwi ↗</a><a href={SOURCE}>GitHub ↗</a><a href={product.publisher.url}>PureMac ↗</a></div></footer>
    </main>
  );
}
