import { arrasProduct } from "@/data/arras-product";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";

export const metadata = supportMetadata("thanks", "Rate Arras Widgets or Support the Project", "Leave an honest App Store review, star the Arras source, or tell the developer what needs fixing. No rewards, prompts or account required by Arras.");

export default async function ThanksPage() {
  const links = await getArrasLinks();
  return <SupportPage links={links} active="thanks" label="Support Arras" title="Thank you for using Arras." intro="Your feedback helps a small, independent project improve. Choose what works for you."
    sections={[["review", "Write a review"], ["source", "Star the source"], ["feedback", "Send feedback"]]}>
    <section id="review"><h2>Leave an honest review</h2><p>If you use Arras Widgets from the Mac App Store, you can rate it and describe your experience. Useful feedback includes what works and what needs improving.</p><p><a className="ar-text-link" href="https://apps.apple.com/app/id6824271927?action=write-review">Rate Arras Widgets on the App Store →</a></p></section>
    <section id="source"><h2>Follow the open-source project</h2><p>Star the repository to keep it close and help other Mac users discover it.</p><p><a href={arrasProduct.repositoryUrl} referrerPolicy="origin">Star Arras on GitHub ↗</a></p></section>
    <section id="feedback"><h2>Tell me what needs fixing</h2><p>For a bug, setup question or suggestion, contact the developer or open a GitHub issue. A purchase or review is never required to get help.</p><p><a href={links.support}>Contact support →</a></p></section>
  </SupportPage>;
}
