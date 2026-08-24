const SITE_URL = "https://puremac.yashashwi.me";

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/arras`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/fadeo`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
