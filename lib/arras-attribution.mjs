export const ARRAS_SOURCE_KEY = "arras:entry-source";
const OWN_HOSTS = new Set(["tryarras.tech", "www.tryarras.tech", "arras.yashashwi.me", "yashashwi.me", "www.yashashwi.me", "puremac.yashashwi.me"]);

// Reject obvious address and identifier shapes even when supplied as campaign
// labels; attribution is for sources and campaigns, not individual visitors.
function identifierLike(value) {
  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(value) ||
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value) ||
    /^[a-f0-9]{32,64}$/i.test(value);
}

// Attribution is a short source label or hostname, never a referring URL's
// path/query, an email address, an IP address or a persistent visitor identifier.
export function normalizeArrasSource(value) {
  if (typeof value !== "string" || value.length > 2048 || /[\u0000-\u001f\u007f]/.test(value)) return null;
  let source = value.trim().toLowerCase();
  if (source.includes("://")) {
    try {
      const url = new URL(source);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
      source = url.hostname;
    } catch { return null; }
  }
  source = source.replace(/^www\./, "");
  if (!/^[a-z0-9](?:[a-z0-9._-]{0,61}[a-z0-9])?$/.test(source) || source.includes("..") || /^[\d.]+$/.test(source)) return null;
  if (identifierLike(source)) return null;
  if (OWN_HOSTS.has(source) || source === "localhost" || source.endsWith(".localhost")) return "same-site";
  return source;
}

export function arrasEntrySource(url, referrer) {
  const campaign = normalizeArrasSource(new URL(url).searchParams.get("utm_source"));
  return campaign || normalizeArrasSource(referrer) || "direct";
}

export function rememberArrasSource({ url, referrer, storage }) {
  try {
    const saved = normalizeArrasSource(storage.getItem(ARRAS_SOURCE_KEY));
    if (saved) return saved;
  } catch { /* Downloads still work when session storage is unavailable. */ }
  const source = arrasEntrySource(url, referrer);
  try { storage.setItem(ARRAS_SOURCE_KEY, source); } catch { /* No cookie fallback. */ }
  return source;
}

export function normalizeArrasCampaign(value) {
  if (typeof value !== "string") return null;
  const label = value.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9 ._-]{0,63}$/.test(label) && !identifierLike(label) ? label : null;
}

const CAMPAIGN_KEY = "arras:entry-campaign";
const CAMPAIGN_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
export function rememberArrasCampaign({ url, storage }) {
  let raw;
  try { raw = JSON.parse(storage.getItem(CAMPAIGN_KEY)); } catch { /* A plain download still works. */ }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    raw = Object.fromEntries(new URL(url).searchParams);
  }
  const campaign = Object.fromEntries(CAMPAIGN_FIELDS.flatMap(key => {
    const value = normalizeArrasCampaign(raw[key]);
    return value ? [[key, value]] : [];
  }));
  try { storage.setItem(CAMPAIGN_KEY, JSON.stringify(campaign)); } catch { /* No cookie or ID fallback. */ }
  return campaign;
}

export function arrasDownloadHref(href, source, campaign = {}) {
  const params = new URLSearchParams({ ref: normalizeArrasSource(source) || "direct" });
  for (const key of CAMPAIGN_FIELDS) {
    const value = normalizeArrasCampaign(campaign[key]);
    if (value) params.set(key, value);
  }
  return `${href}?${params}`;
}
