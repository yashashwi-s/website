import { arrasProduct } from "@/data/arras-product";
import { getArrasProduct } from "@/lib/arras-product";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";

const SOURCE = arrasProduct.repositoryUrl;
const SECURITY_POLICY = `${SOURCE}/blob/main/SECURITY.md`;
export const metadata = supportMetadata("security", "Arras — Security & Privacy", "What Arras can access, where your photos stay, how updates work, and the current signing and notarization status of official downloads.");

export default async function SecurityPage() {
  const [links, product] = await Promise.all([getArrasLinks(), getArrasProduct()]);
  const source = product.repositoryUrl;
  const releaseApi = `https://api.github.com/repos/${new URL(source).pathname.slice(1)}/releases/latest`;
  return (
    <SupportPage links={links} active="security" label="Security & privacy" title={<>Your photos.<br /><em>Your choice.</em></>} intro="A clear account of permissions, local storage, network connections, and download trust."
      sections={[["at-a-glance", "At a glance"], ["permissions", "Permissions"], ["local-data", "Your photos"], ["capture-privacy", "Screen sharing"], ["connections", "Connections & updates"], ["download-trust", "Download trust"], ["first-launch", "First launch"], ["website", "Website analytics"]]}>
      <section id="at-a-glance">
        <p className="ar-document-lead">No account. No photo uploads. No app analytics.</p>
        <p>Arras stores imported pictures on your Mac. The app has no analytics or crash-report uploader; it connects to GitHub for updates. The public distribution uses {product.publicRelease.signing === "ad-hoc" ? "ad-hoc signing" : product.publicRelease.signing} and is <strong>{product.publicRelease.notarized ? "notarized by Apple" : "not notarized by Apple"}</strong>.</p>
        <p className="ar-fine">These facts describe the current shipped product. <a href={SECURITY_POLICY}>Read the canonical security policy ↗</a> and <a href={`${SOURCE}/releases/latest`}>inspect the current release ↗</a>.</p>
      </section>
      <section id="permissions">
        <h2>What you choose to share</h2>
        <p>Arras imports the files you select in Finder, drop, or paste. macOS may ask for access to a protected folder; you can cancel or choose another location. Full Disk Access is not required. The Photos picker hands Arras only the pictures you select. Using Photos is optional.</p>
        <p>Screen Recording is only relevant to the optional Capture Screen Region command, which starts macOS’s interactive screenshot tool. Ordinary photo widgets do not need it. Arras does not continuously capture your screen or request Accessibility access. Update notifications and Launch at Login are optional too.</p>
      </section>
      <section id="local-data">
        <h2>What stays on your Mac</h2>
        <p>Arras does not upload your pictures. Its photo copies and layouts are stored in <code>~/Library/Application Support/PhotoWidget/</code>, using your Mac’s normal storage protections. A selected iCloud photo may be downloaded by macOS. Backups you export contain pictures, so share them only when you intend to.</p>
        <p>Arras is not sandboxed: it runs with your account’s normal access, subject to macOS privacy controls. This lets its updater replace the installed app. Choosing a file describes the app’s behavior, not a guarantee that the operating system restricts it to that file.</p>
      </section>
      <section id="capture-privacy">
        <h2>Sharing and fullscreen limits</h2>
        <p>Capture exclusion asks macOS to leave photo windows out of screenshots and recordings. It does not cover AirPlay or HDMI mirroring. Optional complete hiding detects whether known conferencing or recording apps are running, not whether a call or share is active; browser meetings are not detected. Fullscreen hiding is also a heuristic. Test your sharing preview rather than treating these settings as a confidentiality guarantee.</p>
      </section>
      <section id="connections">
        <h2>Updates connect to GitHub</h2>
        <p>Arras checks GitHub for release information and downloads updates from GitHub. The appcast is fetched from raw.githubusercontent.com; update ZIPs start at github.com and may redirect to GitHub’s release-asset CDN. Requests expose normal connection information such as your IP address. The ZIP URL includes source=arras-updater, the target release version from the feed, and a fresh request UUID for each download attempt. This is a request identifier, not a persistent device identifier. Your pictures and layout are not included. Opening a project or announcement link also visits that destination in your browser.</p>
        <p>Automatic installation is on by default, with daily checks. The selected interval applies whether automatic installation is on or off. You can turn installation off to review updates first, or choose Never to stop scheduled checks while keeping Check Now available. After wake or activation, Arras checks whether an update is due. Failed automatic checks have a 15-minute retry floor. The last-checked time records successful checks and updates while Settings is open. Your imported pictures work offline.</p>
      </section>
      <section id="download-trust">
        <h2>Signing and official downloads</h2>
        <p>Official files come from <a href={`${source}/releases/latest`}>yashashwi-s/Arras on GitHub Releases ↗</a>, linked from this site. The public app uses {product.publicRelease.signing} signing and {product.publicRelease.notarized ? "is notarized by Apple" : "is not notarized by Apple"}. {product.publicRelease.signing === "ad-hoc" && "It has no Developer ID certificate."} This explains the first-launch warning; it does not establish that a download is safe.</p>
        <details>
          <summary>Checking a download’s checksum</summary>
          <p>For the latest download, open <a href={releaseApi}>GitHub’s release metadata ↗</a>, find your filename under <code>assets</code>, and compare its <code>digest</code> value with your file’s SHA-256. Check that <code>tag_name</code> matches your downloaded version. The DMG and ZIP have different digests.</p>
          <p>On your Mac, the optional Terminal command <code>shasum -a 256 ~/Downloads/Arras.dmg</code> prints the DMG’s hash. Compare it with the characters after <code>sha256:</code> in that asset’s digest. This checks file integrity against GitHub’s copy; it is not Apple notarization.</p>
          <p>The updater checks SHA-256, the bundle identifier, the expected version, and the minimum OS before installing. It clears quarantine on the verified replacement and keeps the previous app for rollback if replacement or startup fails. It does not verify a Developer ID signature. Its checksum comes from the same release feed as the download URL, so a match checks file integrity, not independent proof of the publisher.</p>
        </details>
      </section>

      <section id="first-launch">
        <h2>If macOS blocks the first launch</h2>
        <p>Start from <a href={`${source}/releases/latest`}>the official GitHub release</a>. If you trust that download, try opening Arras, then follow <a href="https://support.apple.com/en-us/102445">Apple’s guidance</a>: System Settings → Privacy &amp; Security → Open Anyway.</p>
        <p>Do not bypass a warning about detected malware or a damaged app. A Terminal command or system-wide Gatekeeper change is not part of this guide.</p>
        <p>{product.publicRelease.signing === "ad-hoc" ? "Ad-hoc signing does not provide Developer ID publisher verification." : "Check the official release’s signing information before installing."} {product.publicRelease.notarized ? "The public distribution is notarized by Apple." : "The public distribution is not notarized by Apple."} A matching checksum verifies bytes, not safety.</p>
      </section>
      <section id="website">
        <h2>This website</h2>
        <p>The app’s no-telemetry statement is separate from this site. The website uses Vercel Analytics and Speed Insights for visits and performance when hosted on Vercel.</p>

      </section>
      <p className="ar-document-end">Report a vulnerability using <a href={SECURITY_POLICY}>the private reporting instructions</a>. Need help getting started? <a href={links.faqs}>Read the FAQs →</a></p>
    </SupportPage>
  );
}
