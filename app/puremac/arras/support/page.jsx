import { getArrasProduct } from "@/lib/arras-product";
import { getArrasStoreFaqs, ARRAS_SUPPORT_EMAIL } from "@/lib/arras-support.mjs";
import { FaqJsonLd } from "../../faq-section";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";
import ArrasContact from "../arras-contact";
import ArrasAnswer from "../arras-answer";

export const metadata = supportMetadata(
  "support",
  "Arras Widgets Support — Setup, Purchases & Troubleshooting",
  "Get help with Arras Widgets for Mac. Contact the developer, find your menu bar controls, move your library, and manage App Store downloads and updates.",
);

export default async function ArrasSupportPage() {
  const [links, product] = await Promise.all([getArrasLinks(), getArrasProduct()]);
  const storeFaqs = getArrasStoreFaqs(product);
  return (
    <>
      <FaqJsonLd faqs={storeFaqs} />
      <SupportPage
        links={links}
        active="support"
        pageType="ContactPage"
        label="Arras Widgets support"
        title={<>Your desktop.<br /><em>Back on track.</em></>}
        intro="Help for Arras Widgets on the Mac App Store and the free Arras direct download. A few useful fixes, and a direct line to the developer."
        headerAside={<ArrasContact links={links} />}
        sections={[["contact", "Contact the developer"], ["first-launch", "Find Arras & add a photo"], ["photos", "Photos & permissions"], ["app-store", "App Store & your library"], ["updates", "Updates & purchases"]]}
      >
        <section id="first-launch">
          <h2>Opened Arras, but don’t see a window?</h2>
          <p>Arras lives in your Mac’s menu bar. Click its icon to open Settings or add a photo. Closing Settings leaves your desktop widgets running. You can reopen Settings from the menu or with Command-comma.</p>
          <p>For a first widget, choose Add → Add Photos or Videos. To explore without choosing personal photos, choose Add → Try an Example and edit the bundled scene.</p>
          <p><a href={`${links.faqs}#how-to-use`}>Your first photo, step by step →</a></p>
        </section>
        <section id="photos">
          <h2>A photo or album isn’t showing?</h2>
          <p>Start with a local picture through Add → Add Photos or Videos. Photos albums require Photos access; review it in System Settings → Privacy &amp; Security → Photos. Downloading an iCloud-only photo also needs a connection.</p>
          <p>Ordinary photo widgets do not need Screen Recording, Full Disk Access or Accessibility permission. Screen Recording is only needed for the optional screen-region capture command.</p>
          <p>Linked albums and folders keep managed local snapshots. Check that the source collection still contains your images. <a href={`${links.faqs}#photo-workflows`}>Collections, slideshows &amp; collage help →</a></p>
        </section>
        <section id="app-store">
          <h2>App Store &amp; your existing library</h2>
          {storeFaqs.map(faq => <ArrasAnswer key={faq.id} {...faq} />)}
        </section>
        <section id="updates">
          <h2>Updates, downloads &amp; purchases</h2>
          <p><strong>Mac App Store edition.</strong> Apple manages your purchase, downloads and app updates. Open the App Store on your Mac to check for updates. To download a previous purchase, use the Apple Account that bought Arras Widgets.</p>
          <p><a href="https://support.apple.com/en-us/102417">Apple’s redownload instructions ↗</a> · <a href="https://support.apple.com/billing">Apple purchase and billing support ↗</a></p>
          <p><strong>Free direct download.</strong> Updates come from the official GitHub release. Review the update controls in Arras Preferences. <a href={`${links.home}#install`}>Download and installation instructions →</a></p>
          <p>For an app problem, email <a href={`mailto:${ARRAS_SUPPORT_EMAIL}`}>{ARRAS_SUPPORT_EMAIL}</a>. For a privacy request, see <a href={`${links.security}#contact`}>Security &amp; Privacy</a>. Report a security issue through the <a href={product.documentation.securityPolicyUrl} referrerPolicy="origin">private reporting instructions ↗</a>.</p>
        </section>
      </SupportPage>
    </>
  );
}
