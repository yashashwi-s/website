export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://yashashwi.me/sitemap.xml",
  };
}
