import { arrasCanonicalUrl } from "@/data/arras-product";
import { guidePublishedDate, guides } from "../guides/guide-data";
import { comparisonDate, comparisons } from "../vs/comparison-data";

export const revalidate = 3600;

const escapeXml = (str) =>
  String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export async function GET() {
  const base = arrasCanonicalUrl;
  const items = [
    ...Object.entries(guides).map(([slug, guide]) => ({
      title: guide.title,
      link: `${base}/guides/${slug}`,
      description: guide.description,
      date: new Date(`${guide.updated ?? guidePublishedDate}T00:00:00Z`).toUTCString(),
    })),
    ...Object.entries(comparisons).map(([slug, comp]) => ({
      title: comp.title,
      link: `${base}/vs/${slug}`,
      description: comp.description,
      date: new Date(`${comparisonDate}T00:00:00Z`).toUTCString(),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Arras for Mac, Guides &amp; Comparisons</title>
    <link>${base}/</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Guides, workflows, and comparisons for Arras desktop photo widgets, editable collages, slideshows, and floating references on macOS.</description>
    <language>en-us</language>
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <pubDate>${item.date}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
      )
      .join("\n    ")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
