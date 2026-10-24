import ArrasTelemetryDetails from "../telemetry-details";
import { personal } from "@/data/personal";
import { getArrasProduct } from "@/lib/arras-product";
import { getArrasInstallation } from "@/lib/arras-installation.mjs";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";
import { ARRAS_SUPPORT_EMAIL } from "@/lib/arras-support.mjs";

const supportEmail = ARRAS_SUPPORT_EMAIL;

export const metadata = supportMetadata("security", "Arras — Security & Privacy", "Arras keeps photos local. Read about permissions, the direct-download edition’s limited statistics, and the sandboxed Store edition’s storage and updates.");

export default async function SecurityPage() {
  const [links, product] = await Promise.all([getArrasLinks(), getArrasProduct()]);
  const source = product.repositoryUrl;
  const securityPolicy = product.documentation.securityPolicyUrl;
  const releaseApi = `https://api.github.com/repos/${new URL(source).pathname.slice(1)}/releases/latest`;
  const installation = getArrasInstallation(product);
  return (
    <SupportPage links={links} active="security" label="Security & privacy" title={<>Your photos.<br /><em>Your choice.</em></>} intro="Open source. Photos stored locally. No account or advertising. The free direct download is published from the public GitHub repository."
      sections={[["at-a-glance", "At a glance"], ["first-launch", "First launch on macOS"], ["permissions", "Permissions"], ["local-data", "Your photos"], ["connections", "Connections & updates"], ["telemetry", "App statistics"], ["capture-privacy", "Screen sharing"], ["download-trust", "For technical users"], ["website", "This website"], ["contact", "Contact & privacy requests"]]}>
      <section id="at-a-glance">
        <h2>Open source. Photos stay local.</h2>
        <p>The direct download is free, <a referrerPolicy="origin" href={product.license.url}>MIT-licensed open-source software</a>. Its <a referrerPolicy="origin" href={source}>source is public</a>, and the download button on this site redirects to the <a referrerPolicy="origin" href={product.publicRelease.sourceUrl}>official yashashwi-s/Arras GitHub Release</a>.</p>
        <p>The sandboxed edition distributed through TestFlight or the Mac App Store keeps a separate library, uses Apple-managed updates and excludes Arras usage statistics. It does not replace the free direct download.</p>
        <p>Arras does not upload your photos. The app has no account and embeds no advertising or third-party crash-reporting SDK. Normal photo widgets need neither Full Disk Access nor Accessibility permission.</p>
      </section>
      <section id="first-launch">
        <h2>The first launch on macOS</h2>
        <p><strong>Arras Widgets from the Mac App Store:</strong> install and open it through Apple. Its controls appear in your menu bar; Apple manages Store updates. The DMG steps below apply to the free direct download.</p>
        <p>{installation.verification}</p>
        <ol className="ar-steps">
          <li>Download the DMG from this website’s button or the <a referrerPolicy="origin" href={product.publicRelease.sourceUrl}>official GitHub Release</a>.</li>
          <li>Open the DMG, drag Arras into Applications, and try opening Arras.</li>
          <li>{installation.approval}</li>
        </ol>
        <p className="ar-fine">Its controls appear in your menu bar. <a href="https://support.apple.com/en-us/102445">Apple’s first-launch instructions ↗</a></p>
      </section>
      <section id="permissions">
        <h2>You choose what to share</h2>
        <p>Import pictures from Finder, drag and drop, the clipboard or the Photos picker. Individual selection passes Arras the pictures you choose. Linking a Photos collection requests Photos library access so the album can refresh. A linked Finder folder uses access to the folder you choose. Full Disk Access is not required.</p>
        <p>The optional Capture Screen Region command uses macOS’s interactive screenshot tool in the direct download and ScreenCaptureKit in the sandboxed edition. Only your selected region is captured after the selection controls close; Screen Recording approval relates to that feature. Ordinary photo widgets do not need Screen Recording or Accessibility permission. Arras does not continuously capture your screen.</p>
        <p>Launch at Login is optional in both editions. The direct download also offers optional update notifications. These controls are in Preferences.</p>
      </section>
      <section id="local-data">
        <h2>Your pictures stay on your Mac</h2>
        <p>The direct download stores photo copies and layouts in <code>~/Library/Application Support/PhotoWidget/</code>. TestFlight and App Store copies store them inside their own app container. Importing an existing library requires an explicit folder selection in Preferences; it does not change the original library. Arras does not upload your photos. macOS may download a selected iCloud photo so you can import it.</p>
        <p>Saved Setups and removal recovery keep arrangements on this Mac. Exported <code>.arras</code> backups include your stored pictures and layout. Keep your original photos separately: imported copies may be downsampled or re-encoded. You choose where to save or share a backup.</p>
      </section>
      <section id="connections">
        <h2>Updates follow your edition</h2>
        <p>Your photos and layouts work offline. The direct download connects to GitHub to check for new releases and download updates; your pictures and layout are not part of those requests. Preferences can also read the public GitHub star count, cached for an hour without cookies, credentials or an installation ID. Opening a project or announcement link visits that destination in your browser.</p>
        <p>TestFlight manages beta updates, and the Mac App Store manages updates for Store purchases. The sandboxed app does not download or install its own executable updates.</p>
        <p>In the direct download, automatic installation is on by default, with daily checks. Turn it off to review updates before installation, or choose Never to stop scheduled checks while keeping Check Now available. Both installation modes follow the frequency selected in Settings.</p>
      </section>
      <section id="telemetry">
        <h2>App statistics depend on your edition</h2>
        <p>The sandboxed TestFlight and App Store edition does not collect or send Arras usage statistics. Apple separately manages TestFlight feedback and distribution diagnostics.</p>
        <p>The direct download of Arras 2.5.0 sends limited configuration counts and first-use or version milestones. Configuration summaries are weekly. A random installation UUID links reports from the same installation; reports do not contain photos, filenames, paths, notes, layouts or desktop contents.</p>
        <p>The direct download has no in-app opt-out switch in this version. Reports are not a live-online-user counter. <a href={links.privacyDetails}>Read the identifiers, exact data and retention details →</a></p>
        <ArrasTelemetryDetails installation={installation} links={links} />
      </section>
      <section id="capture-privacy">
        <h2>When you share your screen</h2>
        <p>Capture exclusion makes a compatibility request. Modern recording and sharing apps may still capture visible widgets. <a href="https://developer.apple.com/documentation/appkit/nswindow/sharingtype-swift.enum/none">Apple describes the underlying setting as legacy.</a> Hide widgets before starting a share if they must stay private, and check your sharing preview.</p>
        <p>AirPlay and HDMI mirroring are not covered. Optional hiding checks for known conferencing or recording apps; browser meetings are not detected.</p>
      </section>
      <section id="download-trust">
        <h2>For technical users</h2>
        <details>
          <summary>Direct-download signing, storage, and update validation</summary>
          <p>{installation.signingSummary}{product.publicRelease.signing === "ad-hoc" && " It has no Developer ID certificate."} The direct download uses the hardened runtime and is not sandboxed; it runs with your account’s normal access, subject to macOS privacy controls. This allows the in-place updater to replace the app bundle.</p>
          <p>The updater validates HTTPS, the release version, minimum macOS version, SHA-256, the extracted app’s bundle identifier, and its advertised version before installing. It does not verify a Developer ID signature. The update feed and checksums are published through the same GitHub infrastructure as the release files.</p>
          <p>It removes quarantine from the validated replacement and keeps the previous app until the new version reports a successful startup, allowing rollback if replacement or startup fails. <a referrerPolicy="origin" href={securityPolicy}>Read the security policy ↗</a></p>
        </details>
        <details>
          <summary>Check a download’s checksum</summary>
          <p>Open <a href={releaseApi}>GitHub’s release metadata ↗</a>, find your filename under <code>assets</code>, and compare its <code>digest</code> value with your file’s SHA-256. Check that <code>tag_name</code> matches your downloaded version. The DMG and ZIP have different digests.</p>
          <p>On your Mac, <code>shasum -a 256 ~/Downloads/Arras.dmg</code> prints the DMG’s hash. Compare it with the characters after <code>sha256:</code> in that asset’s digest. A match confirms your download has the same bytes as the published GitHub asset.</p>
        </details>
        <details>
          <summary>Direct-download network endpoints and update timing</summary>
          <p>The feed comes from <code>raw.githubusercontent.com</code>. ZIPs start at <code>github.com</code> and may redirect to GitHub’s release-asset CDN. Requests include normal connection information such as your IP address. The ZIP URL includes <code>source=arras-updater</code>, the target release version, and a fresh request UUID for each attempt. This is a request identifier, not a persistent device identifier; no photos, layouts, filenames, accounts, or hardware identifiers are sent.</p>
          <p>After wake or activation, Arras checks whether an update is due. Failed automatic checks have a 15-minute retry floor. Last checked records a successful check. Settings keeps the displayed elapsed time up to date while open. <a href={product.documentation.featureContractUrl} referrerPolicy="origin">Current shipped behavior ↗</a></p>
        </details>
      </section>
      <section id="website">
        <h2>This website</h2>
        <p>The website uses Vercel Analytics and Speed Insights for visits and performance. Those website measurements are separate from the app; no analytics SDK is embedded in Arras.</p>
        <p>Download links pass through this site before redirecting to GitHub. They record a short source label or referring hostname and a coarse browser category in Vercel Runtime Logs. The first source is kept in this browser tab’s session storage; no cookie or visitor identifier is added. The custom event excludes full referring URLs, IP addresses and raw user-agent strings. Hosting providers still receive normal connection information. Logs follow the hosting provider’s retention limits.</p>
        <p>Daily Arras page and download-request totals also retain short referring-host and UTM campaign labels for up to 90 days. No IP address, full referring URL, cookie, visitor identifier or raw user-agent string is added to these counters. An event allowance bounds stored requests; a service failure can leave gaps. Historical Vercel reports cover the shared portfolio project, and its paid UTM export is not enabled.</p>
        <p>These are download requests, not unique people, completed transfers or installations. Known automated requests are marked separately, and HEAD and prefetch requests are excluded. The GitHub star count is fetched by the server and cached for up to an hour; opening GitHub sends only this site’s origin as the referrer. No app installation identifier is joined to these website measurements.</p>
      </section>
      <section id="contact">
        <h2>Contact &amp; privacy requests</h2>
        <p>Arras is made and maintained by <a href="https://yashashwi.me">{personal.name}</a>. For support, privacy questions or a request to access or delete retained app statistics, email <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.</p>
        <p>Do not send photos or library backups. To locate installation-linked reports, we may need the random installation identifier described above. Website counters have no visitor identifier and cannot be looked up by a visitor’s name.</p>
      </section>
      <p className="ar-document-end">Report a vulnerability using <a referrerPolicy="origin" href={securityPolicy}>the private reporting instructions</a>. Need help getting started? <a href={links.faqs}>Read the FAQs →</a></p>
    </SupportPage>
  );
}
