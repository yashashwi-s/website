import { arrasFeatureContractUrl } from "@/data/arras-product";
import { getArrasProduct } from "@/lib/arras-product";
import { arrasFaqs } from "../../faq-data";
import { FaqJsonLd } from "../../faq-section";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";
import { getArrasInstallation } from "@/lib/arras-installation.mjs";

export const metadata = supportMetadata("faqs", "Arras — FAQs & Getting Started", "Practical answers about adding photos to your Mac desktop, arranging widgets, rotation, compatibility, backups, and first-launch warnings.");

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
  const [links, product] = await Promise.all([getArrasLinks(), getArrasProduct()]);
  const featureUrl = arrasFeatureContractUrl();
  const architectures = product.publicRelease.architectures.map(arch => arch === "arm64" ? "Apple Silicon" : "Intel").join(" and ");
  const faqs = arrasFaqs.map(faq => faq.id === "compatibility" ? {
    ...faq, answer: `The official DMG and ZIP support ${architectures} Macs running macOS ${Number.parseFloat(product.minimumMacOS)} or later. Source builds are also available; see the contributor guide for build instructions.`,
  } : faq.id === "gatekeeper" ? { ...faq, answer: getArrasInstallation(product).faqAnswer } : faq);
  const groups = [["getting-started", "Getting started"], ["personalize", "Make it yours"], ["controls-and-limits", "Controls & limits"], ["first-launch", "Before you open it"]];
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <SupportPage links={links} active="faqs" label="FAQs & getting started" title={<>A little help.<br /><em>Then make it yours.</em></>} intro="From your first photo to the finer controls. Pick a question and get back to your desktop."
        sections={[["how-to-use", "Your first photo"], ...groups]}>
        <section id="how-to-use">
          <h2>Your first photo, in three steps.</h2>
          <ol className="ar-steps">
            <li><strong>Add a picture.</strong> Choose Add → Add Photo in the menu bar, drag an image file onto the icon, or paste with Command-V.</li>
            <li><strong>Find its place.</strong> Drag the picture to move it. Drag a corner to resize it while keeping its proportions.</li>
            <li><strong>Make it yours.</strong> Open Settings for frames, shadows, tilt, and layering. Remove a picture from its menu whenever you like.</li>
          </ol>
          <p className="ar-fine">Arras lives in the menu bar. <a href={`${links.home}#install`}>Download and installation →</a></p>
        </section>
        {groups.map(([id, title]) => <section id={id} key={id}>
          <h2>{title}</h2>
          {faqs.filter(faq => faq.group === id).map(faq => <Answer key={faq.id} {...faq} />)}
          {id === "controls-and-limits" && <p className="ar-fine">For the full reviewed behavior contract, read <a href={featureUrl}>Current shipped features ↗</a>.</p>}
          {id === "first-launch" && <p>For permissions, network connections, local storage, and download verification, read <a href={links.security}>Security &amp; Privacy →</a>.</p>}
        </section>)}
        <p className="ar-fine">Previously called Photo Widget OSX, then Tableau. Saved settings and bundle identity are retained. <a href={product.repositoryUrl}>Browse the source ↗</a></p>
      </SupportPage>
    </>
  );
}
