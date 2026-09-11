const SITE_URL = "https://puremac.yashashwi.me";
const LAST_UPDATED = "2026-09-11";

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: "2026-09-11",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/fadeo`,
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
