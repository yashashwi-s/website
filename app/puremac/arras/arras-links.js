import { headers } from "next/headers";

// Rewrites can replace Host with the internal server address. Next preserves
// the original host in X-Forwarded-Host, including in local subdomain previews.
export async function getArrasLinks() {
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "")
    .split(",")[0].trim().split(":")[0].toLowerCase();
  const base = host === "tryarras.tech" || host === "www.tryarras.tech" || host.startsWith("arras.") ? "" : "/puremac/arras";
  return { download: `${base}/download`, home: `${base}/`, faqs: `${base}/faq`, security: `${base}/security`, privacyDetails: `${base}/security#telemetry` };
}
