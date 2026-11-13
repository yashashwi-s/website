import { arrasProduct } from "@/data/arras-product";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";

export const metadata = supportMetadata("changelog", "Arras Changelog: Published Updates for Mac", "See what changed in Arras for Mac, including lower backup memory use, better desktop recovery, and linked-folder repairs in 2.5.2.");

export default async function ChangelogPage() {
  const links = await getArrasLinks();
  return <SupportPage links={links} active="changelog" label="Published updates" title="What’s new in Arras." intro="Published changes to the free Mac app. Apple reviews and distributes the Store edition separately."
    sections={[["v252", "2.5.2"], ["v251", "2.5.1"], ["v250", "2.5.0"]]}>
    <section id="v252">
      <h2>2.5.2</h2>
      <p>Large backups use less memory. Arras reads and writes media in small chunks, verifies imported files, and cleans up partial files if an import is cancelled or fails.</p>
      <p>Desktop setups and recovery snapshots stay in sync when a save is interrupted. Linked folders can rebuild missing local copies, and the updater keeps the previous app until the new version finishes starting.</p>
      <p><a href={`${arrasProduct.repositoryUrl}/releases/tag/v2.5.2`} referrerPolicy="origin">Full 2.5.2 release notes ↗</a></p>
    </section>
    <section id="v251"><h2>2.5.1 · 1 November 2026</h2><p>Keep visible videos, animated images and slideshows playing when macOS reports its full-display Dock helper above them. Real covering windows and energy-saving policies still pause playback.</p><p>Recover unreadable libraries from a backup while preserving damaged data. Prepare backups in the background with bounded resource use, and report failed widget changes to Shortcuts.</p><p>The free Photos footer puts Update, Star and Support together. Privacy explains the separate paid Store edition without Arras usage statistics. The Store 2.5.1 footer shows Supported with a red heart.</p><p><a href="https://github.com/yashashwi-s/Arras/releases/tag/v2.5.1" referrerPolicy="origin">Full 2.5.1 release notes ↗</a></p></section>
    <section id="v250"><h2>2.5.0 · 18 October 2026</h2><p>Editable desktop collages with independent photos, live boundary fitting and text labels. Visual appearance presets, Copy Appearance, Reference Tools, linked Photos albums and folders, saved Setups and arrangement Undo.</p><p>The universal direct download is Developer ID signed and notarized by Apple. Limited configuration and milestone statistics are disclosed in Privacy; photos, filenames, paths and layouts are excluded.</p><p><a href="https://github.com/yashashwi-s/Arras/releases/tag/v2.5.0" referrerPolicy="origin">Full 2.5.0 release notes ↗</a></p></section>
    <p><a href={`${links.home}#install`}>Get Arras →</a> · <a href={links.faqs}>Setup and feature questions</a></p>
  </SupportPage>;
}
