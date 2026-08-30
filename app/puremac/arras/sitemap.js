const SITE_URL = "https://arras.yashashwi.me";
const LAST_UPDATED = "2026-08-30";

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE_URL}/puremac/arras/demo-poster.jpg`],
    },
  ];
}
