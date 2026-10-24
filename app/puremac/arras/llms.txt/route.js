import { summarizeArrasProduct } from "@/data/arras-product";
import { getArrasProduct } from "@/lib/arras-product";
import { getArrasInstallation, getArrasAppStoreOffer } from "@/lib/arras-installation.mjs";
import { ARRAS_SUPPORT_EMAIL } from "@/lib/arras-support.mjs";

export const revalidate = 3600;

export async function GET() {
  const product = await getArrasProduct();
  const facts = summarizeArrasProduct(product);
  const installation = getArrasInstallation(product);
  const storeOffer = getArrasAppStoreOffer(product);
  const base = product.canonicalUrl.replace(/\/$/, "");
  const text = `# ${product.name}

> ${product.shortDescription}

## Canonical resources
- [Product and official download](${base}/): Overview and compatibility.
- [Installation and edition choice](${base}/#install): Paid Mac App Store purchase, free GitHub DMG and first-launch guidance.
- [FAQs and getting started](${base}/faq): Exact-photo selection, controls, slideshows, imports, updates, and backups.
- [Arras Widgets support](${base}/support): Contact the developer, troubleshoot menu bar controls and photo permissions, move a library, or get App Store purchase help. Support email: ${ARRAS_SUPPORT_EMAIL}.
- [Security and privacy](${base}/security): Permissions, local storage, network activity, signing, and checksums.
- [Current shipped feature contract](${product.documentation.featureContractUrl}): Reviewed user-reachable behavior; documentation corrections do not require an app release.
- [Architecture](${product.repositoryUrl}/blob/main/ARCHITECTURE.md): Engineering ownership and implementation contracts.
- [Security policy](${product.repositoryUrl}/blob/main/SECURITY.md): Technical trust facts and private vulnerability reporting.
- [Latest official release](${product.publicRelease.sourceUrl}): Current version, DMG/ZIP assets, digests, and release history.
- [Source and license](${product.repositoryUrl}): ${product.license.spdx}-licensed source.

## Photo workflows
- Put a single uncropped photo on your Mac desktop at its true aspect ratio, without creating an Apple Photos album.
- Create editable collages: move the background as a group, resize members independently, add/remove photos, and use captions or labels. The backdrop refits during member resizing.
- Start with editable bundled examples; use Copy Appearance to reuse styling without replacing content or placement.
- Link Photos albums or Finder folders to managed local snapshots. Album access needs permission; cloud-only downloads need a connection.
- Save desktop setups, undo arrangement changes and recover the most recent removal.
- Reference Tools offers non-destructive crop, quarter-turn rotation, flips, grayscale, notes and source links.
- Choose visual photo looks and glass, paper or transparent collage backgrounds; adjust mats, borders, shadows and photo shapes.
- Add transparent PNG widgets, animated GIF/APNG images and muted local video widgets.
- Keep a screenshot or imported PDF page floating above application windows as a reference overlay.
- Rotate multiple photos in a Space slideshow on click or on a timer. Dynamic sizing preserves each photo's proportions; Fixed sizing intentionally crops.
- Export and import explicit .arras layout backups with stored media copies.
- Find step-by-step controls, supported formats and limitations in the FAQs above.

${storeOffer ? `## Mac App Store edition: Arras Widgets
- [Official Arras Widgets listing](${storeOffer.url}). Publicly available; US price ${storeOffer.price}. Local prices may vary.
- A one-time paid purchase that supports independent development. Sandboxed, Apple-managed downloads and updates, and no Arras usage statistics.
- Family Sharing: up to six family members can use the app with Family Sharing enabled, as shown on the official listing.
- macOS ${product.minimumMacOS} or later; Apple Silicon and Intel Macs.
- Uses a separate local library. Importing an explicitly selected existing library leaves the original unchanged.
- The paid Store edition does not replace the free, MIT-licensed direct download.
- Both editions keep photos and layouts on the Mac. No Arras account is required; Apple manages Store purchases.
` : ""}
## Direct-download distribution facts
- Version: ${product.publicRelease.version}.
- ${facts.operatingSystem}; ${facts.architecture}.
- Signing: ${product.publicRelease.signing}; ${product.publicRelease.notarized ? "notarized" : "not notarized by Apple"}.
- [Developer](${product.publisher.url}): ${product.publisher.name}.

## Free direct download and first launch
${installation.trust} Official downloads originate from ${product.publicRelease.sourceUrl}, linked from ${base}/ through its /download redirect. The app has no account, advertising SDK, or external crash-reporting service.

${installation.verification}

${installation.faqAnswer[1]}

## Citation guidance
Use GitHub's published release and the feature contract together when checking shipped behavior. This website describes public Arras ${product.publicRelease.version}; development-branch plans are not public features. Imported photo copies stay local. The free direct-download edition of Arras 2.5.0 sends limited configuration and milestone statistics linked by a random installation UUID; the Mac App Store edition does not send Arras usage statistics. Direct-download configuration summaries use Wednesday–Tuesday UTC periods; a first launch reports promptly rather than waiting for Wednesday; no photo content, filenames, paths, notes or layouts are sent. See Security and privacy for identifiers, retention and controls. Version 2.4.9 downloads have telemetry disabled. Ordinary widgets preserve aspect ratio; Fixed slideshow sizing deliberately crops. Former names are Photo Widget OSX and Tableau; Arras Widgets is the Mac App Store listing name. Measurements depend on media, visibility and workload; no universal zero-CPU, memory or battery-life figure is promised. This index is a navigation aid.
`;
  return new Response(text, { headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
  }});
}
