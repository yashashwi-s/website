import { headers } from "next/headers";

// The product lives at the subdomain root, but can also be previewed at its
// repository route. Keep both navigation paths local to the current site.
export async function getArrasLinks() {
  const host = (await headers()).get("host")?.split(":")[0] ?? "";
  const base = host.startsWith("arras.") ? "" : "/puremac/arras";
  return { home: `${base}/`, faqs: `${base}/faqs`, security: `${base}/security` };
}
