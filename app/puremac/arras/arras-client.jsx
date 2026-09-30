import { ArrasNavigation, ArrasFooter } from "./arras-navigation";
import ArrasDemo from "./arras-demo";
import { getArrasInstallation } from "@/lib/arras-installation.mjs";
import "./arras.css";

const features = [
  ["Keep the whole picture.", "Panoramas stay wide. Portraits stay tall. Arras follows your photo’s proportions, not a fixed widget grid."],
  ["Find its place.", "Arrange photos below desktop icons, above them, or over your windows. Move and resize without stealing focus from your work."],
  ["Make it yours.", "Adjust the frame, shadow, opacity, and tilt. Keep it quiet or make it personal. Each photo gets its own treatment."],
  ["Let it change.", "Rotate a collection of images in one widget, or bring GIFs and APNGs to your desktop."],
];

export default function ArrasClient({ release, downloads, links, posterProps, product }) {
  const SOURCE = product.repositoryUrl;
  const download = `${SOURCE}/releases/latest/download/Arras.dmg`;
  const installation = getArrasInstallation(product);
  return (
    <main id="arras-page">
      <ArrasNavigation links={links} />

      <header id="arras-content" tabIndex={-1} className="ar-wrap ar-hero">
        <div><p className="ar-label">A native macOS photo widget.</p><h1>Your photos.<br /><em>Not squares.</em></h1></div>
        <div className="ar-hero-copy"><p>Arras is a free, native Mac photo widget that keeps each image’s original aspect ratio. Your photos, without forced cropping. Their shape, their place, your desktop.</p><a className="ar-button" href={download}>Download Arras <span>↙</span></a><p className="ar-fine">Open source · No account · Photos stored locally</p><p className="ar-fine">{product.operatingSystem} · {product.architecture}</p><a className="ar-text-link" href={links.security}>Security &amp; Privacy →</a><br /><a className="ar-text-link" href="#install">First time installing? Read this first →</a></div>
      </header>

      <ArrasDemo posterProps={posterProps} setupUrl={`${links.faqs}#how-to-use`} />

      <section className="ar-wrap ar-section" id="details">
        <div className="ar-split"><div><p className="ar-label">Built around the picture</p><h2>The photo decides<br />the shape.</h2></div><p className="ar-intro">Most widgets start with a box. Arras starts with your image. It’s a native macOS tool for the little things that make a desktop feel like yours—without an account, a subscription, or telemetry.</p></div>
        <div className="ar-features">{features.map(([title, body], i) => <article key={title}><span className="ar-number">0{i + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section id="install" className="ar-wrap ar-section">
        <div className="ar-split">
          <div>
            <p className="ar-label">Yours to use. Yours to inspect.</p>
            <h2>A little room<br />for your photos.</h2>
            <p className="ar-intro">No subscription. No account. No app telemetry.<br />Just a small native app, and your desktop.</p>
            <a className="ar-button" href={download}>Download for Mac <span>↙</span></a>
            <p className="ar-fine">{release?.tag ?? "Latest release"}{downloads?.total ? ` · ${new Intl.NumberFormat("en-US").format(downloads.total)} GitHub asset downloads` : ""}</p>
            <a className="ar-text-link" href={`${SOURCE}/releases`}>Release notes ↗</a>
          </div>
          <div className="ar-install-notes">
            <h3>Install Arras</h3>
            <ol className="ar-steps">{installation.steps.map(step => <li key={step.name}>{step.text}</li>)}</ol>
            <a className="ar-text-link" href={`${links.security}#first-launch`}>Why does this message appear? →</a>
          </div>
        </div>
      </section>

      <section className="ar-wrap ar-help" aria-label="Help and information">
        <div id="how-to-use"><span id="controls-and-limits" /><a id="faq-heading" href={links.faqs}>FAQs &amp; getting started <span>→</span></a><p>Adding photos, arranging your desktop, and the details that matter.</p></div>
        <div><a id="security-and-privacy" href={links.security}>Security &amp; Privacy <span>→</span></a><p>Permissions, local storage, updates, and official downloads.</p></div>
      </section>
      <ArrasFooter links={links} />
    </main>
  );
}
