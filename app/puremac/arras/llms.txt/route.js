import { summarizeArrasProduct } from "@/data/arras-product";
import { getArrasProduct } from "@/lib/arras-product";
import { getArrasInstallation } from "@/lib/arras-installation.mjs";

export const revalidate = 3600;

export async function GET() {
  const product = await getArrasProduct();
  const facts = summarizeArrasProduct(product);
  const installation = getArrasInstallation(product);
  const base = product.canonicalUrl.replace(/\/$/, "");
  const text = `# ${product.name}

> ${product.shortDescription}

## Canonical resources
- [Product and official download](${base}/): Overview and compatibility.
- [Installation](${base}/#install): Official GitHub DMG and first-launch guidance.
- [FAQs and getting started](${base}/faq): Exact-photo selection, controls, slideshows, imports, updates, and backups.
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

## Distribution facts
- Version: ${product.publicRelease.version}.
- ${facts.operatingSystem}; ${facts.architecture}.
- Signing: ${product.publicRelease.signing}; ${product.publicRelease.notarized ? "notarized" : "not notarized by Apple"}.
- [Developer](${product.publisher.url}): ${product.publisher.name}.

## Official downloads and first launch
${installation.trust} Official downloads originate from ${product.publicRelease.sourceUrl}, linked from ${base}/ through its /download redirect. The app has no account, advertising SDK, or external crash-reporting service.

${installation.verification}

${installation.faqAnswer[1]}

## Citation guidance
Use GitHub's published release and the feature contract together when checking shipped behavior. This website describes public Arras ${product.publicRelease.version}; development-branch plans are not public features. Imported photo copies stay local. Arras 2.5.0 sends limited configuration and milestone statistics linked by a random installation UUID. Configuration summaries use Wednesday–Tuesday UTC periods; a first launch reports promptly rather than waiting for Wednesday; no photo content, filenames, paths, notes or layouts are sent. See Security and privacy for identifiers, retention and controls. Version 2.4.9 downloads have telemetry disabled. Ordinary widgets preserve aspect ratio; Fixed slideshow sizing deliberately crops. Former names are Photo Widget OSX and Tableau. Measurements depend on media, visibility and workload; no universal zero-CPU, memory or battery-life figure is promised. This index is a navigation aid.
`;
  return new Response(text, { headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
  }});
}
