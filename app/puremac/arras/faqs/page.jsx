import { getArrasInstallation } from "@/lib/arras-installation.mjs";
import { arrasFeatureContractUrl } from "@/data/arras-product";
import { getArrasProduct } from "@/lib/arras-product";
import { arrasFaqs } from "../../faq-data";
import { FaqJsonLd } from "../../faq-section";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";
import ArrasAnswer from "../arras-answer";

export const metadata = supportMetadata("faq", "Arras FAQ — Photo Widgets, Collages & Saved Setups", "Arrange photo widgets and editable collages, link Photos albums, add motion, copy appearance and save desktop setups in Arras 2.5.0.");

export default async function FaqPage() {
  const [links, product] = await Promise.all([getArrasLinks(), getArrasProduct()]);
  const featureUrl = arrasFeatureContractUrl();
  const installation = getArrasInstallation(product);
  const faqs = arrasFaqs.map(faq => faq.id === "gatekeeper" ? {
    ...faq, question: installation.faqQuestion, answer: installation.faqAnswer,
  } : faq);
  const groups = [["getting-started", "Getting started"], ["photo-workflows", "Collages, collections & references"], ["personalize", "Appearance & slideshows"], ["controls-and-limits", "Controls & limits"], ["first-launch", "Before you open it"]];
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <SupportPage links={links} active="faqs" label="FAQs & getting started" title={<>Mac photo widgets.<br /><em>Your questions, answered.</em></>} intro="Start with one uncropped photo or an editable example, then build a collage, link an album or save a setup. These answers cover Arras 2.5.0."
        sections={[["how-to-use", "Your first photo"], ...groups]}>
        <section id="how-to-use">
          <h2>Your first photo, in three steps.</h2>
          <ol className="ar-steps">
            <li><strong>Add a picture.</strong> Choose Add → Add Photos or Videos, drag a file onto the menu bar icon, or paste a copied image. Try an Example adds a ready-made scene you can edit.</li>
            <li><strong>Find its place.</strong> Drag the picture to move it. Drag a corner to resize it while keeping its proportions.</li>
            <li><strong>Make it yours.</strong> Open a photo’s Appearance controls to choose a look or adjust its mat, border, shape, shadow or tilt. Copy Appearance reuses that look on another photo. Setups keeps an arrangement before you experiment.</li>
          </ol>
          <h3>How is Arras different from the macOS Photos widget?</h3>
          <p>Apple’s Photos widget belongs to the macOS widget gallery. Arras places independent photo windows on the desktop: choose a single file, preserve its aspect ratio, arrange an editable collage, or keep a reference floating above your work.</p>
          <p className="ar-fine"><a href="https://support.apple.com/guide/mac-help/add-and-customize-widgets-mchl52be5da5/mac" referrerPolicy="origin">Apple’s widget guide ↗</a> · <a href={featureUrl} referrerPolicy="origin">Arras feature documentation ↗</a></p>
          <p className="ar-fine">Arras lives in the menu bar. <a href={`${links.home}#install`}>Download and installation →</a></p>
        </section>
        {groups.map(([id, title]) => <section id={id} key={id}>
          <h2>{title}</h2>
          {id === "photo-workflows" && <><p><strong>Editable collages.</strong> Choose Add → Create Collage. Drag the background to move the group, or hover a member’s corner to resize that photo. The boundary refits as members change. Edit Collage adds and removes members; depth and Space pinning apply to the group. <a href={`${links.home}#collages`}>See the collage →</a></p><p><strong>Linked collections.</strong> A Photos album or Finder folder can supply a slideshow. Arras keeps a managed local snapshot for offline use; downloading cloud-only Photos assets needs permission and a connection.</p></>}
          {id === "personalize" && <p>Polaroid and Gallery are starting points for a photo’s frame, mat and shadow. Transparent PNG images keep their cutouts; GIF and APNG images can animate. A Space slideshow rotates several images in one widget.</p>}
          {id === "controls-and-limits" && <p>Muted local video widgets pause when hidden. Reference Tools adds non-destructive crop, rotation, flips, grayscale, a note and a source link to a reference photo.</p>}
          {faqs.filter(faq => faq.group === id).map(faq => <ArrasAnswer key={faq.id} {...faq} />)}
          {id === "controls-and-limits" && <p className="ar-fine">For the full reviewed behavior contract, read <a href={featureUrl} referrerPolicy="origin">Current shipped features ↗</a>.</p>}
          {id === "first-launch" && <p>For permissions, network connections, local storage, and download verification, read <a href={links.security}>Security &amp; Privacy →</a>.</p>}
        </section>)}
        <p className="ar-fine">Previously called Photo Widget OSX, then Tableau. Saved settings and bundle identity are retained. <a href={product.repositoryUrl} referrerPolicy="origin">Browse the source ↗</a></p>
      </SupportPage>
    </>
  );
}
