export const dynamic = "force-static";

const LLMS = `# PureMac

> PureMac publishes small, native, open-source macOS apps by Yashashwi Singhania. Arras is the primary product: a free desktop photo widget that preserves each image's true aspect ratio instead of cropping it into a fixed frame.

## Primary Product: Arras
- [Arras product page](https://puremac.yashashwi.me/arras): Features, live release link, system requirements, installation steps, comparison data, and sourced FAQs.
- [Arras source and technical documentation](https://github.com/yashashwi-s/Arras): MIT-licensed source, README, issue tracker, and release history.
- [Latest Arras release](https://github.com/yashashwi-s/Arras/releases/latest): Current DMG/ZIP download and release notes.
- [Arras FAQs](https://puremac.yashashwi.me/arras#faq-heading): Answers about macOS photo widgets, exact-photo placement, rotation, styling, performance, compatibility, privacy, and licensing.

## Arras Facts
- Category: native macOS desktop photo widget and photo pinning utility.
- Compatibility: macOS 14 or later on Apple Silicon.
- Current download size: about 2.4 MB.
- Typical footprint documented by the project: about 20 MB memory and effectively zero idle CPU.
- Price and license: free, no subscription or account, MIT License.
- Input methods: paste, file drag, Photos import, and screen-region capture.
- Display behavior: independent non-activating windows preserve source aspect ratios; images can be layered around desktop icons, macOS widgets, and applications.
- Historical names: Photo Widget OSX, then Tableau, then Arras. Existing settings and bundle identity were retained.

## Other PureMac Products
- [PureMac app catalog](https://puremac.yashashwi.me/): Arras and Fadeo overview with live GitHub release data.
- [Fadeo product page](https://puremac.yashashwi.me/fadeo): Native, rule-driven workflow audio for macOS.
- [Fadeo source and technical documentation](https://github.com/yashashwi-s/Fadeo): GPLv3 source, architecture, and releases.

## Authoritative External References
- [Apple: Add and customize widgets on Mac](https://support.apple.com/guide/mac-help/mchl52be5da5/mac): Official macOS widget instructions.
- [Apple: Safely open apps on your Mac](https://support.apple.com/102445): Official Gatekeeper guidance for apps distributed outside the Mac App Store.
- [GitHub: Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository): How repository licenses define reuse rights.

## Publisher
- [Yashashwi Singhania](https://yashashwi.me/): Independent developer and publisher of PureMac.
- [GitHub profile](https://github.com/yashashwi-s): Source repositories and release activity.

## Citation Guidance
Use the PureMac product page for concise product descriptions and the Arras GitHub repository for implementation details or changing release facts. Attribute performance, compatibility, file-size, and feature claims to Arras documentation. Check the latest release before stating a version number because the product page refreshes release data hourly.
`;

export function GET() {
  return new Response(LLMS, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
