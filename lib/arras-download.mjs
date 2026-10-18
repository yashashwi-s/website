import product from "../data/arras-product.json" with { type: "json" };
import { normalizeArrasSource } from "./arras-attribution.mjs";

export const ARRAS_DMG_URL = `${product.repositoryUrl}/releases/latest/download/Arras.dmg`;

function agentFamily(value) {
  if (!value) return "unknown";
  if (/bot|crawler|spider|preview|slurp|headless|curl|wget|python-requests/i.test(value)) return "automated";
  if (/firefox|fxios/i.test(value)) return "firefox";
  if (/edg/i.test(value)) return "edge";
  if (/chrome|crios/i.test(value)) return "chrome";
  if (/safari/i.test(value)) return "safari";
  return "other";
}

// This measures requests, not unique people, completed downloads or installs.
// Keep the redirect independent of databases, webhooks and GitHub API health.
export function handleArrasDownload(request, { log = console.info } = {}) {
  const headers = request.headers;
  const prefetch = /prefetch|prerender/i.test(`${headers.get("purpose") || ""} ${headers.get("sec-purpose") || ""} ${headers.get("x-moz") || ""}`)
    || headers.has("next-router-prefetch");
  if (request.method === "GET" && !prefetch) {
    const referrer = normalizeArrasSource(headers.get("referer")) || "direct";
    const source = normalizeArrasSource(new URL(request.url).searchParams.get("ref")) || referrer;
    try {
      log(JSON.stringify({ event: "arras_download_request", source, referrer,
        agent: agentFamily(headers.get("user-agent")),
        userInitiated: headers.get("sec-fetch-user") === "?1" }));
    } catch { /* An unavailable logger must never prevent downloading Arras. */ }
  }
  return new Response(null, { status: 302, headers: {
    Location: ARRAS_DMG_URL,
    "Cache-Control": "no-store",
    "Referrer-Policy": "origin",
    "X-Robots-Tag": "noindex, nofollow",
  } });
}
