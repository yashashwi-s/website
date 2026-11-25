// Arras serves exclusively from tryarras.tech (legacy yashashwi.me/puremac/arras
// routes 301-redirect in next.config.mjs). Keeping link resolution pure avoids
// calling headers() on every request and unlocks Vercel edge ISR caching.
export async function getArrasLinks() {
  return {
    download: "/download",
    home: "/",
    faqs: "/faq",
    support: "/support",
    guide: "/mac-desktop-customization",
    guides: "/guides",
    security: "/security",
    privacyDetails: "/security#scope",
  };
}
