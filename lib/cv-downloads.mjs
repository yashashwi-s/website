// Public download counts only. Refresh on the first visit after a week;
// this does not count users or contact the app's statistics endpoint.
export async function arrasDownloadMilestone(fetcher = fetch) {
  try {
    let total = 0;
    for (let page = 1; page <= 20; page++) {
      const response = await fetcher(`https://api.github.com/repos/yashashwi-s/Arras/releases?per_page=100&page=${page}`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 604800 },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return 1000;
      const releases = await response.json();
      if (!Array.isArray(releases)) return 1000;
      for (const release of releases) {
        if (release.draft || release.prerelease) continue;
        for (const asset of release.assets ?? []) {
          if (/\.(dmg|zip)$/i.test(asset.name ?? "") && Number.isSafeInteger(asset.download_count) && asset.download_count >= 0) {
            total += asset.download_count;
          }
        }
      }
      if (releases.length < 100) return Math.max(1000, Math.floor(total / 100) * 100);
    }
  } catch { /* Keep the published résumé milestone if GitHub is unavailable. */ }
  return 1000;
}
