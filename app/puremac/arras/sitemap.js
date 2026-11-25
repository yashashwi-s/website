import { arrasCanonicalUrl } from "@/data/arras-product";
import { latestRelease } from "@/lib/github-release";

import { guidePublishedDate, guides } from "./guides/guide-data";
import { comparisonDate, comparisons } from "./vs/comparison-data";

const SITE_URL = arrasCanonicalUrl;
const HOME_UPDATED = comparisonDate;
const GUIDES_UPDATED = Object.values(guides).reduce(
  (latest, { updated }) => updated && updated > latest ? updated : latest,
  comparisonDate,
);
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
    { url: `${SITE_URL}/guides`, lastModified: GUIDES_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    ...Object.entries(guides).map(([slug, guide]) => ({
      url: `${SITE_URL}/guides/${slug}`,
      lastModified: guide.updated ?? guidePublishedDate,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [`${SITE_URL}/puremac/arras/features/${guide.image}.webp`],
    })),
    { url: `${SITE_URL}/changelog`, lastModified: lastModified, changeFrequency: "monthly", priority: 0.6 },
    ...Object.entries(comparisons).map(([slug, item]) => ({
      url: `${SITE_URL}/vs/${slug}`,
      lastModified: comparisonDate,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [`${SITE_URL}/puremac/arras/features/${item.image}.webp`],
    })),
    ...["faq", "security", "support"].map(path => ({ url: `${SITE_URL}/${path}`, lastModified: SUPPORT_UPDATED[path], changeFrequency: "monthly", priority: 0.7 })),
  ];
}
