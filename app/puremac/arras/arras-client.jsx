import Image from "next/image";
import { ArrasNavigation, ArrasFooter } from "./arras-navigation";
import ArrasDemo from "./arras-demo";
import { ArrasDownloadLink } from "./arras-attribution";
import ArrasStar from "./arras-star";
import { getArrasInstallation } from "@/lib/arras-installation.mjs";
import "./arras.css";

function DesktopShot({ src, alt, caption }) {
  return <figure className="ar-desktop-shot"><a href={src} aria-label={`Enlarge: ${caption}`}><Image src={src} width={1470} height={956} sizes="(max-width: 800px) calc(100vw - 40px), 1180px" alt={alt} /></a><figcaption>{caption}<span aria-hidden="true">↗</span></figcaption></figure>;
}

export default function ArrasClient({ release, downloads, stars, links, posterProps, product }) {
  const SOURCE = product.repositoryUrl;
  const download = links.download;
  const installation = getArrasInstallation(product);
  return (
    <main id="arras-page">
      <ArrasNavigation links={links} />
      <header id="arras-content" tabIndex={-1} className="ar-wrap ar-hero">
        <div><p className="ar-label">Mac desktop photo widgets · 2.5.0</p><h1>Your photos.<br /><em>Your kind of desktop.</em></h1></div>
        <div className="ar-hero-copy"><p>Make a little world on your Mac. Arrange an editable collage, let a favorite collection change, or keep a reference floating beside your work. Every picture has a place.</p><div className="ar-download-actions"><ArrasDownloadLink className="ar-button" href={download}>Download Arras <span aria-hidden="true">↙</span></ArrasDownloadLink><ArrasStar repository={SOURCE} stars={stars} /></div><p className="ar-fine">Free &amp; open source · No account · Photos stored locally</p><p className="ar-fine">{product.operatingSystem} · {product.architecture}</p><a className="ar-text-link" href={links.security}>Security &amp; Privacy →</a><br /><a className="ar-text-link" href="#install">{product.publicRelease.notarized ? "Installation →" : "First time installing? Read this first →"}</a></div>
      </header>
      <ArrasDemo posterProps={posterProps} setupUrl={`${links.faqs}#how-to-use`} />

      <section className="ar-wrap ar-section ar-showcase" id="details">
        <div className="ar-split" id="collages"><div><p className="ar-label">01 / Editable collages</p><h2>Better together.<br /><em>Still your own.</em></h2></div><div className="ar-feature-copy"><p className="ar-intro">A collage holds your pictures together without flattening them into one image. Glass, paper or an open canvas. A caption, wherever it belongs.</p><p>Drag the background to move the group. Move or resize a photo on its own; the boundary grows and shrinks with it. Add and remove members, give each its own look, then lock the arrangement when it feels right.</p></div></div>
        <DesktopShot src="/puremac/arras/features/collages.webp" alt="Arras on a Mac desktop: three individually framed photos inside a paper collage, with a second transparent group and editable captions." caption="One arrangement. Individual photos. Paper and transparent collage styles." />
      </section>

      <section className="ar-wrap ar-section ar-showcase" id="workflows">
        <div className="ar-split"><div><p className="ar-label">02 / Slideshows &amp; layers</p><h2>A changing view.<br /><em>A steady reference.</em></h2></div><p className="ar-intro">Let one widget cycle through a collection while another stays exactly where you need it. Your desktop can be a moodboard and a useful place to work.</p></div>
        <DesktopShot src="/puremac/arras/features/slideshow-layers.webp" alt="A real Arras desktop with a three-image slideshow and a separate photo marked Floating in Settings, against a warm sand-dune wallpaper." caption="A three-photo slideshow beside a separate Floating reference." />
        <div className="ar-feature-pair"><article id="slideshows"><p className="ar-label">Let the picture change</p><h3>Your Space slideshow, in rotation.</h3><p>Advance on double-click or on a timer. Add, remove and reorder images in Edit Slideshow. Dynamic sizing keeps each picture’s proportions; Fixed sizing deliberately fills one frame. Link a Photos album or Finder folder to keep a collection current.</p></article><article id="layers"><p className="ar-label">Choose its place</p><h3>From wallpaper to above your work.</h3><p>Keep photos behind desktop icons, on the desktop, above system widgets, or Floating above app windows. A collage controls depth and Space pinning for its whole group. Standalone settings are kept when a photo leaves it.</p><p className="ar-layer-legend">Behind Icons <span> / </span> On Desktop <span> / </span> Above Widgets <span> / </span> Floating</p></article></div>
      </section>

      <section className="ar-wrap ar-section ar-showcase" id="appearance">
        <div className="ar-split"><div><p className="ar-label">03 / Make it yours</p><h2>A frame of mind.<br /><em>Not a fixed grid.</em></h2></div><div className="ar-feature-copy"><p className="ar-intro">Tall portraits. Wide panoramas. A single photo, uncropped and at its true aspect ratio.</p><p>Start with Polaroid or Gallery, then make the mat, border, shape, shadow and tilt your own. Copy Appearance carries the style to another photo without replacing its content or position.</p></div></div>
        <DesktopShot src="/puremac/arras/features/appearance.webp" alt="Arras photo widgets with independent rounded, elliptical and arched shapes and carefully arranged collage captions on a real Mac desktop." caption="Independent photo shapes, frames and placement. One desktop that feels like you." />
        <div className="ar-feature-pair ar-small-features"><article><h3>Motion, when you want it.</h3><p>Transparent PNGs, animated GIF/APNG images and muted local video widgets fit into the same desktop. Hidden media pauses; your still photos stay still.</p></article><article><h3>A reference, with context.</h3><p>Reference Tools adds non-destructive crop, rotation, flips, grayscale, a note and a source link. Screenshot and PDF commands can be enabled in Preferences → Menu bar.</p></article><article><h3>Keep the arrangement.</h3><p>Save named setups before experimenting. Undo moves, resizing and membership changes, recover the latest removal, or export a portable .arras backup with stored media.</p></article><article><h3>Your media, close at hand.</h3><p>Import from Finder, Photos, the clipboard or drag-and-drop. Managed local copies keep saved photos available when the original source is disconnected.</p></article></div>
      </section>

      <section className="ar-wrap ar-section" id="your-controls">
        <div className="ar-split"><div><p className="ar-label">Native. Local. Yours.</p><h2>The details<br /><em>are yours, too.</em></h2></div><p className="ar-intro">Set snapping, shortcuts and update checks in Preferences. Use Privacy to choose when widgets hide, review permissions and understand the limited statistics. Your photo content stays on your Mac.</p></div>
        <div className="ar-settings-gallery">{[
          ["preferences", "Preferences", "Snapping, shortcuts and verified updates, together.", "Arras Preferences with native sections for everyday behavior, alignment, the desktop shortcut and update scheduling."],
          ["privacy", "Privacy", "Clear controls. Honest limits. Your photos stay local.", "Arras Privacy with screen-sharing compatibility limits, optional automatic hiding and macOS permission controls."],
        ].map(([name,title,caption,alt])=><figure key={name}><a href={`/puremac/arras/features/${name}.webp`} aria-label={`Enlarge ${title} screenshot`}><Image src={`/puremac/arras/features/${name}.webp`} width={1094} height={1501} sizes="(max-width: 650px) calc(100vw - 60px), 520px" alt={alt} /></a><figcaption><h3>{title}</h3><p>{caption}</p></figcaption></figure>)}</div>
        <p className="ar-gallery-note"><a href={links.security}>Read what stays local, what connects, and what the privacy controls can do →</a></p>
      </section>

      <section id="install" className="ar-wrap ar-section"><div className="ar-split"><div><p className="ar-label">Yours to use. Yours to inspect.</p><h2>A little room<br /><em>for your photos.</em></h2><p className="ar-intro">No subscription. No account. Photos stay local.<br />Just a native app, and your desktop.</p><div className="ar-download-actions"><ArrasDownloadLink className="ar-button" href={download}>Download for Mac <span aria-hidden="true">↙</span></ArrasDownloadLink><ArrasStar repository={SOURCE} stars={stars} /></div><p className="ar-fine">{`v${product.publicRelease.version}`}{downloads?.total ? ` · ${new Intl.NumberFormat("en-US").format(downloads.total)} GitHub asset downloads` : ""}</p><p className="ar-fine"><a href={links.security}>Security &amp; Privacy →</a></p><a className="ar-text-link" href={`${SOURCE}/releases`} referrerPolicy="origin">Release notes ↗</a></div><div className="ar-install-notes"><h3>Install Arras</h3><ol className="ar-steps">{installation.steps.map(step=><li key={step.name}>{step.text}</li>)}</ol><a className="ar-text-link" href={`${links.security}#first-launch`}>{installation.helpLabel}</a></div></div></section>
      <section className="ar-wrap ar-help" aria-label="Help and information"><div id="how-to-use"><span id="controls-and-limits" /><a id="faq-heading" href={links.faqs}>FAQs &amp; getting started <span>→</span></a><p>Adding photos, arranging your desktop, and the details that matter.</p></div><div><a id="security-and-privacy" href={links.security}>Security &amp; Privacy <span>→</span></a><p>Permissions, local storage, updates, and official downloads.</p></div></section>
      <ArrasFooter links={links} />
    </main>
  );
}
