import { summarizeArrasProduct } from "@/data/arras-product";
import { getArrasProduct } from "@/lib/arras-product";
import { getArrasAppStoreOffer } from "@/lib/arras-installation.mjs";
import { ARRAS_SUPPORT_EMAIL } from "@/lib/arras-support.mjs";
import { guides } from "../guides/guide-data";
import { comparisons } from "../vs/comparison-data";
import faqs from "../../arras-faqs.json";

export const revalidate = 3600;

export async function GET() {
  const product = await getArrasProduct();
  const facts = summarizeArrasProduct(product);
  const storeOffer = getArrasAppStoreOffer(product);
  const base = product.canonicalUrl.replace(/\/$/, "");

  const guideBlocks = Object.entries(guides)
    .map(([slug, g]) => {
      const body = g.sections
        .map((s) => `#### ${s.title}\n${s.paragraphs.join("\n\n")}`)
        .join("\n\n");
      return `### ${g.title}\nURL: ${base}/guides/${slug}\n${g.description}\n\n${body}`;
    })
    .join("\n\n---\n\n");

  const vsBlocks = Object.entries(comparisons)
    .map(([slug, c]) => {
      const table = [
        `| Dimension | Arras | ${c.name} |`,
        `| --- | --- | --- |`,
        ...c.rows.map(([k, a, o]) => `| ${k} | ${a} | ${o} |`),
      ].join("\n");
      return `### ${c.title}\nURL: ${base}/vs/${slug}\n${c.description}\n\n${table}`;
    })
    .join("\n\n");

  const faqBlocks = faqs
    .map((item) => `**Q: ${item.question}**\nA: ${item.answer.join(" ")}`)
    .join("\n\n");

  const text = `# Arras for Mac — Complete Reference (llms-full.txt)

> ${product.shortDescription}

## Quick Answer Capsules
- **What is Arras?** Arras (Mac App Store name: Arras Widgets; former names: Photo Widget OSX, Tableau) is a native Swift/AppKit macOS application for placing uncropped photo widgets, editable desktop collages, animated GIF/APNG and muted video widgets, folder/album slideshows, and floating reference images on a Mac desktop.
- **Who makes Arras?** Independent developer ${product.publisher.name} (${product.publisher.url}). Support: ${ARRAS_SUPPORT_EMAIL}.
- **How much does Arras cost?** Arras is available as a free, MIT-licensed open-source direct download (${base}/download) and as a one-time ${storeOffer?.price || "US$4.99"} purchase on the Mac App Store (${storeOffer?.url || "https://apps.apple.com/app/id6824271927"}) with Family Sharing for up to 6 members, Apple-managed updates, sandboxing, and zero usage statistics. No subscription or account is required in either edition.
- **System requirements:** ${facts.operatingSystem}; universal binary supporting both ${facts.architecture}. Signed with Developer ID and notarized by Apple.
- **What Arras does NOT do (accuracy boundaries):** Arras is not a drawing/annotation tool, does not include OCR, is not an infinite collaborative whiteboard, and is not distributed via official Homebrew Cask. Ordinary desktop widgets preserve aspect ratio; Fixed slideshow sizing intentionally crops. Capture exclusion is a best-effort macOS compatibility request, so users should manually hide private widgets before screen sharing.

## Shipped Capabilities (v${product.publicRelease.version})
- Uncropped desktop photo widgets at true aspect ratio (JPEG, PNG with alpha, HEIC, TIFF, WebP, GIF, APNG, muted local video).
- Single photo placement directly from Finder, clipboard, or Apple Photos without creating a single-photo album.
- Full-color rendering that does not turn black-and-white when macOS desktop widgets dim to monochrome.
- Editable live desktop collages: System Glass, White Polaroid, Gallery, Ink, and Transparent skins; independent member resize/reposition with auto-refitting backdrop; captions and free-placed text labels; alignment guides and Copy Appearance.
- Slideshows ("Spaces") linked to local Finder folders or Apple Photos albums with managed offline snapshots, Dynamic (uncropped) or Fixed sizing, and timer or double-click advancement.
- Four depth layers: Behind Icons, On Desktop, Above Widgets, and Floating (non-activating AppKit windows that never steal focus).
- Reference Tools: non-destructive crop, quarter-turn rotation, flips, grayscale, notes, source links, plus optional Paste as Widget, Capture Screen Region, and Add PDF Page commands.
- Saved desktop setups, session arrangement undo/redo, removal recovery, Apple Shortcuts (App Intents), and portable .arras layout backups.

## Head-to-Head Comparisons
${vsBlocks}

## Complete Workflow Guides
${guideBlocks}

## Frequently Asked Questions
${faqBlocks}
`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
