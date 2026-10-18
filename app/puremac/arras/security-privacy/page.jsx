import { getArrasProduct } from "@/lib/arras-product";
import { getArrasInstallation } from "@/lib/arras-installation.mjs";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";

export const metadata = supportMetadata("security-privacy", "Arras — Statistics & Privacy Details", "What Arras 2.5.0 sends in limited weekly statistics, how its installation identifier works, and how data is retained. Photo content stays local.");

export default async function ArrasPrivacy() {
  const [links, product] = await Promise.all([getArrasLinks(), getArrasProduct()]);
  const installation = getArrasInstallation(product);
  return <SupportPage links={links} active="security-privacy" label="Statistics & privacy · Arras 2.5.0" title={<>Your photos.<br /><em>Kept out of reports.</em></>} intro="No account, no advertising, and no uploaded photo content. Here is what limited statistics contain and how they work."
    sections={[["scope", "What is sent"], ["identifier", "Installation identifier"], ["network-retention", "Network & retention"], ["controls", "Controls & older versions"], ["website", "Website measurements"]]}>
    <p><a href={links.security}>← Security &amp; Privacy</a></p>
    <section id="scope">
      <h2>Configuration summaries are weekly.</h2>
      <p>Arras 2.5.0 includes limited configuration and milestone statistics to understand which features are used. Broad configuration counts are reported once per seven-day UTC period. First-run, version and first-feature milestones may be sent earlier. Weekly reports are not a live-online-user counter.</p>
      <p>The schema contains a version and development/production environment, a random installation UUID, random event IDs for retry deduplication, Arras version and build, macOS major/minor, running architecture, and UTC day. Events cover first run, app update, first widget/collage/feature use and configuration. The legacy event name <code>daily_configuration</code> does not change the seven-day public reporting cadence.</p>
      <p>Counts use ranges: 0, 1, 2–4, 5–9, 10–19 and 20+. They cover total widgets, collages and broad media/source types such as photos, animation, video, slideshows, linked folders and Photos collections. Hidden widgets count as configured. The protocol retains a legacy container value for compatibility; that does not describe a separate current product feature.</p>
      <p>Reports exclude photos or media bytes, filenames, paths, EXIF, notes, source links, layouts and coordinates, desktop or clipboard contents, names, email, Apple IDs, serial numbers, hardware UUIDs, MAC addresses, display identifiers and precise location. Arras does not report click streams, drag paths, resize ticks, session durations or playback history.</p>
    </section>
    <section id="identifier">
      <h2>One random installation identifier.</h2>
      <p>A UUID is generated independently of hardware and macOS identifiers. It links reports from one installation and is a pseudonymous identifier, rather than an unlinked anonymous total. It survives upgrades while its local file remains.</p>
      <p>The ID is stored in <code>~/Library/Application Support/PhotoWidget/Telemetry/install-id</code>. A separate <code>state.json</code> holds a bounded local queue and deduplication state. Neither enters a layout backup. Removing the ID generates a new one; an invalid or unreadable existing file disables sending rather than silently replacing the identity.</p>
    </section>
    <section id="network-retention">
      <h2>Bounded requests and retention.</h2>
      <p>The endpoint is <code>https://arras.yashashwi.me/api/telemetry/v1</code>. An identifier-free GET checks the public kill switch before upload. A failed check prevents uploading. Requests use short timeouts, no cookies or credentials, and do not follow redirects. Batches are at most 16 KiB, with at most 32 queued events. Queued events expire after seven days.</p>
      <p>Failures use persistent exponential backoff from six hours up to seven days, with at most three attempts per UTC day. Telemetry failure does not replace photo data or prevent the app from opening. The service can pause sending and discard queued events without an app update.</p>
      <p>Validated raw events and identifiers expire 30 days after their UTC day ends. Separate aggregate counts without installation/event IDs expire after 400 days. Deduplication expires with raw records; abuse counters expire within two days.</p>
      <p>Vercel hosts the endpoint and Upstash stores reports over encrypted connections. HTTP providers necessarily see source IPs and transport headers. The Arras route does not read or profile them and does not log request bodies. Current Vercel runtime-log retention is one hour. Infrastructure logs and provider backups are separate from active-record expiry.</p>
      <p>No scheduled telemetry backups or exports are enabled. Upstash may archive an inactive free database after at least 30 days; when the service is retired, its database and archived backups must be removed. Upstash’s policy permits retained backup copies for up to four weeks after database termination. The <a referrerPolicy="origin" href="https://github.com/yashashwi-s/Arras/blob/main/SECURITY.md#telemetry-protocol-and-activation">technical protocol and operating policy</a> records these responsibilities.</p>
    </section>
    <section id="controls">
      <h2>Controls and older versions.</h2>
      <p>This version has no in-app opt-out switch. The server kill switch is an operational control, not an individual preference. Arras 2.4.9 downloads have telemetry disabled; the limited-statistics description above applies to 2.5.0.</p>
      <p>Update checks are separate and follow the frequency selected in Preferences. They contact GitHub for the feed and release assets. Preferences can separately read the public repository star count; results and failures are cached in memory for an hour, with no polling timer, cookies, credentials or installation ID. macOS may contact Apple for requested Photos/iCloud downloads. {installation.signingSummary} The <a href={`${links.security}#first-launch`}>installation guidance</a> explains the first launch.</p>
    </section>
    <section id="website">
      <h2>Website measurements are separate.</h2>
      <p>The website uses Vercel Web Analytics and Speed Insights on Vercel deployments. Download links also record source-attributed requests in Vercel Runtime Logs, using a short source label or hostname and coarse browser category. The initial source is stored only for the browser tab’s session. The custom event contains no full referrer URL, raw user agent, IP address or visitor ID; normal hosting access logs are separate. HEAD/prefetch requests are excluded and known automated clients are marked. Logs follow the hosting provider’s retention limits. Website visits, download requests and GitHub asset downloads are separate from app installation UUIDs. Comparing coarse totals does not identify a person or prove an installation, currently online Mac, or source of a specific report.</p>
    </section>
  </SupportPage>;
}
