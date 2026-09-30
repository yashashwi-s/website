import { getArrasProduct } from "@/lib/arras-product";
import { getArrasInstallation } from "@/lib/arras-installation.mjs";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";

export const metadata = supportMetadata("security", "Arras — Security & Privacy", "Arras is open source, keeps photos on your Mac, and has no app telemetry. Learn about official downloads, first launch, permissions, and updates.");

export default async function SecurityPage() {
  const [links, product] = await Promise.all([getArrasLinks(), getArrasProduct()]);
  const source = product.repositoryUrl;
  const securityPolicy = product.documentation.securityPolicyUrl;
  const releaseApi = `https://api.github.com/repos/${new URL(source).pathname.slice(1)}/releases/latest`;
  const installation = getArrasInstallation(product);
  return (
    <SupportPage links={links} active="security" label="Security & privacy" title={<>Your photos.<br /><em>Your choice.</em></>} intro="Open source. Photos stored locally. No account or app telemetry. Official downloads published directly from the public GitHub repository."
      sections={[["at-a-glance", "At a glance"], ["first-launch", "First launch on macOS"], ["permissions", "Permissions"], ["local-data", "Your photos"], ["connections", "Connections & updates"], ["capture-privacy", "Screen sharing"], ["download-trust", "For technical users"], ["website", "This website"]]}>
      <section id="at-a-glance">
        <h2>Open source. Photos stay local.</h2>
        <p>Arras is free, <a href={product.license.url}>MIT-licensed open-source software</a>. Its <a href={source}>source is public</a>, and the download button on this site takes you directly to the <a href={product.publicRelease.sourceUrl}>official yashashwi-s/Arras GitHub Release</a>.</p>
        <p>Arras does not upload your photos. The app has no account, advertising SDK, analytics, telemetry, or external crash-reporting service. Normal photo widgets need neither Full Disk Access nor Accessibility permission.</p>
      </section>
      <section id="first-launch">
        <h2>The first launch on macOS</h2>
        <p>{installation.verification}</p>
        <ol className="ar-steps">
          <li>Download the DMG from this website’s button or the <a href={product.publicRelease.sourceUrl}>official GitHub Release</a>.</li>
          <li>Open the DMG, drag Arras into Applications, and try opening Arras.</li>
          <li>{product.publicRelease.notarized ? installation.explanation : installation.approval}</li>
        </ol>
        <p className="ar-fine">This approval applies to Arras. Its controls appear in your menu bar. <a href="https://support.apple.com/en-us/102445">Apple’s first-launch instructions ↗</a></p>
      </section>
      <section id="permissions">
        <h2>You choose what to share</h2>
        <p>Import pictures from Finder, drag and drop, the clipboard, or the optional Photos picker. The picker passes Arras the pictures you select. macOS may ask for access to a protected folder when you choose a file there. Full Disk Access is not required.</p>
        <p>The optional Capture Screen Region command starts macOS’s interactive screenshot tool; any Screen Recording approval relates to that feature. Ordinary photo widgets do not need Screen Recording or Accessibility permission. Arras does not continuously capture your screen.</p>
        <p>Update notifications and Launch at Login are optional. You can control them in Settings.</p>
      </section>
      <section id="local-data">
        <h2>Your pictures stay on your Mac</h2>
        <p>Photo copies and layouts are stored in <code>~/Library/Application Support/PhotoWidget/</code>. Arras does not upload them. macOS may download a selected iCloud photo so you can import it.</p>
        <p>Exported <code>.arras</code> backups include your stored pictures and layout. Keep your original photos separately: imported copies may be downsampled or re-encoded. You choose where to save or share a backup.</p>
      </section>
      <section id="connections">
        <h2>Updates come from GitHub</h2>
        <p>Your photos and layouts work offline. Arras connects to GitHub to check for new releases and download updates; your pictures and layout are not part of those requests. Opening a project or announcement link visits that destination in your browser.</p>
        <p>Automatic installation is on by default, with daily checks. Turn it off to review updates before installation, or choose Never to stop scheduled checks while keeping Check Now available. Both installation modes follow the frequency selected in Settings.</p>
      </section>
      <section id="capture-privacy">
        <h2>When you share your screen</h2>
        <p>Capture exclusion asks macOS to omit photo windows from compatible screenshots and recordings. AirPlay and HDMI mirroring show your display, so they are outside this setting. Optional hiding checks for known conferencing or recording apps; browser meetings are not detected. Check your sharing preview to see what others will see.</p>
      </section>
      <section id="download-trust">
        <h2>For technical users</h2>
        <details>
          <summary>Signing, storage, and update validation</summary>
          <p>The current public build uses {product.publicRelease.signing} signing and is {product.publicRelease.notarized ? "notarized by Apple" : "not notarized by Apple"}.{product.publicRelease.signing === "ad-hoc" && " It has no Developer ID certificate."} Arras uses the hardened runtime and is not sandboxed; it runs with your account’s normal access, subject to macOS privacy controls. This allows the in-place updater to replace the app bundle.</p>
          <p>The updater validates HTTPS, the release version, minimum macOS version, SHA-256, the extracted app’s bundle identifier, and its advertised version before installing. It does not verify a Developer ID signature. The update feed and checksums are published through the same GitHub infrastructure as the release files.</p>
          <p>It removes quarantine from the validated replacement and keeps the previous app until the new version reports a successful startup, allowing rollback if replacement or startup fails. <a href={securityPolicy}>Read the security policy ↗</a></p>
        </details>
        <details>
          <summary>Check a download’s checksum</summary>
          <p>Open <a href={releaseApi}>GitHub’s release metadata ↗</a>, find your filename under <code>assets</code>, and compare its <code>digest</code> value with your file’s SHA-256. Check that <code>tag_name</code> matches your downloaded version. The DMG and ZIP have different digests.</p>
          <p>On your Mac, <code>shasum -a 256 ~/Downloads/Arras.dmg</code> prints the DMG’s hash. Compare it with the characters after <code>sha256:</code> in that asset’s digest. A match confirms your download has the same bytes as the published GitHub asset.</p>
        </details>
        <details>
          <summary>Network endpoints and update timing</summary>
          <p>The feed comes from <code>raw.githubusercontent.com</code>. ZIPs start at <code>github.com</code> and may redirect to GitHub’s release-asset CDN. Requests include normal connection information such as your IP address. The ZIP URL includes <code>source=arras-updater</code>, the target release version, and a fresh request UUID for each attempt. This is a request identifier, not a persistent device identifier; no photos, layouts, filenames, accounts, or hardware identifiers are sent.</p>
          <p>After wake or activation, Arras checks whether an update is due. Failed automatic checks have a 15-minute retry floor. Last checked records a successful check. Settings keeps the displayed elapsed time up to date while open. <a href={product.documentation.featureContractUrl}>Current shipped behavior ↗</a></p>
        </details>
      </section>
      <section id="website">
        <h2>This website</h2>
        <p>The website uses Vercel Analytics and Speed Insights for visits and performance. Those website measurements are separate from the app; no analytics SDK is embedded in Arras.</p>
      </section>
      <p className="ar-document-end">Report a vulnerability using <a href={securityPolicy}>the private reporting instructions</a>. Need help getting started? <a href={links.faqs}>Read the FAQs →</a></p>
    </SupportPage>
  );
}
