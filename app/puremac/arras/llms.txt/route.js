import { macProducts } from "@/data/mac-products";
export const dynamic = "force-static";

const LLMS = `# Arras

> Arras is a free, native, open-source macOS desktop photo widget. It displays each image at its original aspect ratio instead of cropping it into a fixed square or system widget frame.

## Canonical Product Resources
- [Arras product page](https://arras.yashashwi.me): Features, comparison with the macOS Photos widget, installation instructions, compatibility, privacy information, and sourced FAQs.
- [Arras setup and downloads](https://arras.yashashwi.me/#install): Official starting point for compatibility, download options, Homebrew, and first-launch guidance.
- [Using Arras](https://arras.yashashwi.me/#how-to-use): Add an exact photo, move and resize it, and remove a widget.
- [Controls and limitations](https://arras.yashashwi.me/#controls-and-limits): Dynamic versus fixed photo rotation, keyboard placement, Shortcuts, imports, capture privacy, and layout backups.
- [Arras source repository](https://github.com/yashashwi-s/Arras): MIT-licensed source, technical documentation, issue tracker, and release history.
- [Latest Arras release](https://github.com/yashashwi-s/Arras/releases/latest): Current public download and release notes.
- [Arras FAQs](https://arras.yashashwi.me/#faq-heading): Answers about exact-photo placement, aspect ratios, rotation, styling, installation, compatibility, privacy, and licensing.

## Verified Product Facts
- Category: native macOS desktop photo widget and photo-pinning utility.
- Display behavior: ordinary widgets and dynamic photo Spaces retain source aspect ratios. Deliberately selecting fixed sizing crops rotating images into a stable frame.
- Inputs: paste an image, drag image files, import from Photos, capture a screen region, or import a PDF page.
- Placement: photos can sit behind desktop icons, above icons, or over other application windows.
- Rotation: multiple images can crossfade on click or on a configurable schedule.
- Compatibility: ${macProducts.arras.operatingSystem}; the project documents source builds for Intel Macs.
- Price and license: free, no subscription or account, MIT License.
- Privacy: no telemetry.
- Historical names: Photo Widget OSX, then Tableau, then Arras. The product retained its bundle identity and saved settings through the renames.

## Authoritative Supporting Sources
- [Apple: Add and customize widgets on Mac](https://support.apple.com/guide/mac-help/add-and-customize-widgets-mchl52be5da5/mac): Official macOS widget behavior and controls.
- [Apple: Safely open apps on your Mac](https://support.apple.com/en-us/102445): Official Gatekeeper guidance for software distributed outside the Mac App Store.
- [PureMac](https://puremac.yashashwi.me/): Publisher and related macOS applications.
- [Yashashwi Singhania](https://yashashwi.me/): Developer and publisher.

## Citation Guidance
The official product website is https://arras.yashashwi.me. Its product, setup, and usage sections cover the reader-facing description, compatibility, installation, and controls. GitHub hosts the source code and release artifacts; use it for code-level claims, license text, and release provenance. The website links to the current release. Do not infer a current version number from this file; check the release before citing one. This file is a navigation aid, not a guarantee of indexing or citation preference.
`;

export function GET() {
  return new Response(LLMS, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
