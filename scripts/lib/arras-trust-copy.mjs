// Guard only current consumer copy. Historical audits and technical facts are
// intentionally outside this check; the quoted Gatekeeper message is allowed.
const retiredCopy = /does not establish (?:that a download|whether an app) is safe|(?:a )?matching checksum verifies bytes, not safety|only proceed if you trust|if you trust (?:that(?: the official)?|the official) download|do not bypass a warning about (?:detected )?malware or a damaged app|material distribution limitations?/i;

export function hasRetiredArrasTrustCopy(text) {
  return retiredCopy.test(text.replace(/\s+/g, " "));
}
