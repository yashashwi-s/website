import { summarizeArrasProduct } from "@/data/arras-product";
import { getArrasProduct } from "@/lib/arras-product";

export const revalidate = 3600;

export async function GET() {
  const product = await getArrasProduct();
  const facts = summarizeArrasProduct(product);
  const base = product.canonicalUrl.replace(/\/$/, "");
  const text = `# ${product.name}

> ${product.shortDescription}

## Canonical resources
- [Product and official download](${base}/): Overview and compatibility.
- [Installation](${base}/#install): Official GitHub DMG and first-launch guidance.
- [FAQs and getting started](${base}/faqs): Exact-photo selection, controls, slideshows, imports, updates, and backups.
- [Security and privacy](${base}/security): Permissions, local storage, update requests, signing, and checksums.
- [Current shipped feature contract](${product.documentation.featureContractUrl}): Reviewed user-reachable behavior; documentation corrections do not require an app release.
- [Architecture](${product.repositoryUrl}/blob/main/ARCHITECTURE.md): Engineering ownership and implementation contracts.
- [Security policy](${product.repositoryUrl}/blob/main/SECURITY.md): Technical trust facts and private vulnerability reporting.
- [Latest official release](${product.publicRelease.sourceUrl}): Current version, DMG/ZIP assets, digests, and release history.
- [Source and license](${product.repositoryUrl}): ${product.license.spdx}-licensed source.

## Distribution facts
- ${facts.operatingSystem}; ${facts.architecture}.
- Signing: ${product.publicRelease.signing}; ${product.publicRelease.notarized ? "notarized" : "not notarized by Apple"}.
- ${product.telemetry ? "See the security policy for app telemetry details" : "No app analytics or telemetry"}; update checks and downloads contact GitHub. The website uses Vercel Analytics and Speed Insights.
- [Developer](${product.publisher.url}): ${product.publisher.name}.

## Citation guidance
Use the current shipped feature contract for product behavior and GitHub Releases for release-specific facts. Do not infer a current version from this index or cite a historical release-tagged FEATURES file as the current contract. Imported photo copies stay local; no-telemetry does not mean no network requests. Ordinary widgets preserve aspect ratio; Fixed slideshow sizing deliberately crops. Former names are Photo Widget OSX and Tableau. This index is a navigation aid.
`;
  return new Response(text, { headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
  }});
}
