import { arrasCanonicalUrl } from "@/data/arras-product";
import { latestRelease } from "@/lib/github-release";

const SITE_URL = arrasCanonicalUrl;
const LAST_UPDATED = "2026-09-11";

export default async function sitemap() {
  const release = await latestRelease("Arras");
  const lastModified = new Date(
    Math.max(Date.parse(LAST_UPDATED), Date.parse(release?.publishedAt ?? "1970-01-01"))
  ).toISOString().slice(0, 10);

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE_URL}/puremac/arras/demo-poster.jpg`],
    },
  ];
}
