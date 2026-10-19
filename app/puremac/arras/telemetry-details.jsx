// Server-rendered policy details live on the canonical Security page.
export default function ArrasTelemetryDetails({ installation, links }) {
  return <details id="telemetry-details">
    <summary>Direct-download statistics: exact data, identifier and retention</summary>
    <section id="scope">
      <h3>Configuration summaries are weekly.</h3>
      <p>The direct download of Arras 2.5.0 includes limited configuration and milestone statistics to understand which features are used. Broad configuration counts are reported once per Wednesday–Tuesday UTC week. First-run, version and first-feature milestones may be sent earlier. Weekly reports are not a live-online-user counter.</p>
      <p>The schema contains a version and development/production environment, a random installation UUID, random event IDs for retry deduplication, Arras version and build, macOS major/minor, running architecture, and UTC day. Events cover first run, app update, first widget/collage/feature use and configuration. The legacy event name <code>daily_configuration</code> does not change the seven-day public reporting cadence.</p>
      <p>Counts use ranges: 0, 1, 2–4, 5–9, 10–19 and 20+. They cover total widgets, collages and broad media/source types such as photos, animation, video, slideshows, linked folders and Photos collections. Hidden widgets count as configured. The protocol retains a legacy container value for compatibility; that does not describe a separate current product feature.</p>
      <p>Reports exclude photos or media bytes, filenames, paths, EXIF, notes, source links, layouts and coordinates, desktop or clipboard contents, names, email, Apple IDs, serial numbers, hardware UUIDs, MAC addresses, display identifiers and precise location. Arras does not report click streams, drag paths, resize ticks, session durations or playback history.</p>
    </section>
    <section id="identifier">
      <h3>One random installation identifier.</h3>
      <p>A UUID is generated independently of hardware and macOS identifiers. It links reports from one installation and is a pseudonymous identifier, rather than an unlinked anonymous total. It survives upgrades while its local file remains.</p>
      <p>The ID is stored in <code>~/Library/Application Support/PhotoWidget/Telemetry/install-id</code>. A separate <code>state.json</code> holds a bounded local queue and deduplication state. Neither enters a layout backup. Removing the ID generates a new one; an invalid or unreadable existing file disables sending rather than silently replacing the identity.</p>
    </section>
    <section id="network-retention">
      <h3>Bounded requests and retention.</h3>
      <p>The primary endpoint is <code>https://tryarras.tech/api/telemetry/v1</code>; the former Arras domain keeps a directly compatible endpoint. An identifier-free GET checks the public kill switch before upload. A failed check prevents uploading. Requests use short timeouts, no cookies or credentials, and do not follow redirects. Batches are at most 16 KiB, with at most 32 queued events. Queued events expire after seven days.</p>
      <p>Failures use persistent exponential backoff from six hours up to seven days, with at most three attempts per UTC day. Telemetry failure does not replace photo data or prevent the app from opening. The service can pause sending and discard queued events without an app update.</p>
      <p>Validated raw events and identifiers expire 30 days after their UTC day ends. Separate aggregate counts without installation/event IDs expire after 400 days. Deduplication expires with raw records; abuse counters expire within two days.</p>
      <p>Vercel hosts the endpoint and Upstash stores reports over encrypted connections. HTTP providers necessarily see source IPs and transport headers. The Arras route does not read or profile them and does not log request bodies. Infrastructure logs and provider backups have separate retention; application expiry does not erase provider backups.</p>
      <p>Arras does not schedule raw-report backups or exports. The operator’s local dashboard archives anonymous daily aggregates for comparison; these do not include installation or event IDs. When the service is retired, its database and provider archives must be removed. The <a referrerPolicy="origin" href="https://github.com/yashashwi-s/Arras/blob/main/SECURITY.md#telemetry-protocol-and-activation">technical protocol and operating policy</a> records the retention and emergency controls.</p>
    </section>
    <section id="controls">
      <h3>Controls and older versions.</h3>
      <p>This version has no in-app opt-out switch. The server kill switch is an operational control, not an individual preference. Arras 2.4.9 downloads have telemetry disabled; the limited-statistics description above applies to the direct download of 2.5.0. The sandboxed TestFlight and App Store edition excludes these statistics.</p>
      <p>Update checks are separate and follow the frequency selected in Preferences. They contact GitHub for the feed and release assets. Preferences can separately read the public repository star count; results and failures are cached in memory for an hour, with no polling timer, cookies, credentials or installation ID. macOS may contact Apple for requested Photos/iCloud downloads. {installation.signingSummary} The <a href={`${links.security}#first-launch`}>installation guidance</a> explains the first launch.</p>
    </section>
  </details>;
}
