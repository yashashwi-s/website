import { arrasProduct, arrasFeatureContractUrl } from "@/data/arras-product";
import { latestRelease } from "@/lib/github-release";
import { arrasFaqs } from "../../faq-data";
import { FaqJsonLd } from "../../faq-section";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";

export const metadata = supportMetadata("faqs", "Arras — FAQs & Getting Started", "Practical answers about adding photos to your Mac desktop, arranging widgets, rotation, compatibility, backups, and first-launch warnings.");

const details = [
  { id: "comparison", question: "How is Arras different from the macOS Photos widget?", answer: "The built-in widget fits Apple’s fixed widget formats. Arras creates independent desktop windows: each picture can keep its original proportions, position, frame, opacity, and depth. Choose the built-in widget for the system widget experience, or Arras when you want control over the image itself." },
  { id: "keyboard-controls", question: "How do I position photos precisely?", answer: "Arras snaps to nearby edges and alignment guides. Hold Command to temporarily disable snapping, or Shift to constrain movement to one axis. Photos behind desktop icons are locked because Finder covers that layer; change their depth in Arras before repositioning them." },
  { id: "shortcuts-and-imports", question: "Does Arras support Shortcuts, PDFs, and screenshots?", answer: "Seven Shortcuts actions cover adding photos, visibility, opacity, and photo-Space navigation. PDF-page import and screen-region capture are optional menu commands. Ordinary photo widgets work without Accessibility or Screen Recording permission." },
  { id: "sharing-privacy", question: "Will my photos stay hidden when I share my screen?", answer: "Capture exclusion asks macOS to hide the photo windows from screenshots and recordings. It cannot protect AirPlay or HDMI mirroring. App-based hiding is best effort and does not detect browser calls. Check your actual sharing preview before displaying sensitive photos." },
  { id: "layout-backups", question: "Can I back up my desktop arrangement?", answer: "Export an .arras layout archive to keep widgets and their stored media together. Archives contain Arras’s stored or re-encoded images, not archival originals. Keep your original photos separately. Automatic layout history is not part of the current release." },
];

function Answer({ question, answer, sources = [], id }) {
  return (
    <details className="ar-answer" id={id}>
      <summary>{question}<span aria-hidden="true">+</span></summary>
      <div>{(Array.isArray(answer) ? answer : [answer]).map(text => <p key={text}>{text}</p>)}
        {sources.length > 0 && <p className="ar-answer-sources">{sources.map(source => <a key={source.href} href={source.href}>{source.label} ↗</a>)}</p>}
      </div>
    </details>
  );
}

export default async function FaqPage() {
  const [links, release] = await Promise.all([getArrasLinks(), latestRelease("Arras")]);
  const featureUrl = arrasFeatureContractUrl(release?.tag);
  const faqs = arrasFaqs.map(faq => ({ ...faq, sources: faq.sources.map(source => ({
    ...source, href: source.href.endsWith("/FEATURES.md") ? featureUrl : source.href,
  })) }));
  return (
    <>
      <FaqJsonLd faqs={[...faqs, ...details]} />
      <SupportPage links={links} active="faqs" label="FAQs & getting started" title={<>A little help.<br /><em>Then make it yours.</em></>} intro="From your first photo to the finer controls. Pick a question and get back to your desktop."
        sections={[["how-to-use", "Your first photo"], ["getting-started", "Getting started"], ["personalize", "Make it yours"], ["controls-and-limits", "Controls & limits"], ["first-launch", "First launch"]]}>
        <section id="how-to-use">
          <h2>Your first photo, in three steps.</h2>
          <ol className="ar-steps">
            <li><strong>Add a picture.</strong> Open Arras’s menu bar controls. Choose a photo, drag an image file onto the icon, or paste with Command-V.</li>
            <li><strong>Find its place.</strong> Drag the picture to move it. Drag a corner to resize it while keeping its proportions.</li>
            <li><strong>Make it yours.</strong> Open Settings for frames, shadows, tilt, and layering. Remove a picture from its menu whenever you like.</li>
          </ol>
          <p className="ar-fine">Arras lives in the menu bar, rather than the Dock. <a href={`${links.home}#install`}>Download and installation →</a></p>
        </section>
        <section id="getting-started">
          <h2>Getting started</h2>
          {[8, 9, 1, 2, 4].map(index => <Answer key={index} {...faqs[index]} />)}
        </section>
        <section id="personalize">
          <h2>Make it yours</h2>
          {[3, 5, 6, 0].map(index => <Answer key={index} {...faqs[index]} id={index === 6 ? "photo-rotation" : undefined} />)}
        </section>
        <section id="controls-and-limits">
          <h2>Controls &amp; limits</h2>
          {details.map(faq => <Answer key={faq.id} {...faq} />)}
          <p className="ar-fine">Checked against <a href={featureUrl}>{release?.tag ?? "current"} feature documentation ↗</a>. These are capabilities, not performance benchmarks.</p>
        </section>
        <section id="first-launch">
          <h2>Before you open it</h2>
          <Answer {...faqs[7]} />
          <p>For permissions, network connections, local storage, and download verification, read <a href={links.security}>Security &amp; Privacy →</a>.</p>
        </section>
        <p className="ar-fine">Previously called Photo Widget OSX, then Tableau. Arras is the same project, with its saved settings and bundle identity retained. <a href={arrasProduct.repositoryUrl}>Browse the source ↗</a></p>
      </SupportPage>
    </>
  );
}
