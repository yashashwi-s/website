import { arrasCanonicalUrl } from "@/data/arras-product";
import { latestRelease } from "@/lib/github-release";

const SITE_URL = arrasCanonicalUrl;
const HOME_UPDATED = "2026-10-24";
const SUPPORT_UPDATED = { faq: "2026-10-24", security: "2026-10-24", support: "2026-10-24" };

export default async function sitemap() {
  const release = await latestRelease("Arras");
  const lastModified = new Date(
    Math.max(Date.parse(HOME_UPDATED), Date.parse(release?.publishedAt ?? "1970-01-01"))
  ).toISOString().slice(0, 10);

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: ["launch-2.5.0-poster.jpg", "features/collages.webp", "features/slideshow-layers.webp", "features/appearance.webp"].map(path => `${SITE_URL}/puremac/arras/${path}`),
    },
    { url: `${SITE_URL}/mac-desktop-customization`, lastModified: "2026-10-24", changeFrequency: "monthly", priority: 0.7, images: ["collages", "appearance", "slideshow-layers"].map(name => `${SITE_URL}/puremac/arras/features/${name}.webp`) },
    ...["faq", "security", "support"].map(path => ({ url: `${SITE_URL}/${path}`, lastModified: SUPPORT_UPDATED[path], changeFrequency: "monthly", priority: 0.7 })),
  ];
}
