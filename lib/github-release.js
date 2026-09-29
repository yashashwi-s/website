// Sums release-asset downloads across ALL releases -- downloads accumulate per release, so
// the latest release alone undercounts. GitHub's auto-generated source tarballs aren't in
// `assets` and don't carry a download_count, so this is just the real .dmg/.zip tally.
// Optionally authenticates with GITHUB_TOKEN to lift the 60/hour unauthenticated limit.
// Returns null on any failure so callers degrade to "-" rather than break the dashboard.
export async function totalDownloads(repo) {
  if (process.env.ARRAS_METADATA_OFFLINE === "1" && repo === "Arras") return null;
  if (!["Arras", "Fadeo"].includes(repo)) return null;
  try {
    const headers = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/yashashwi-s/${repo}/releases?per_page=100`, {
      headers,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const releases = await res.json();
    if (!Array.isArray(releases)) return null;
    let total = 0;
    const byRelease = {};
    for (const rel of releases) {
      const n = (rel.assets || []).reduce((acc, asset) => {
        const count = asset?.download_count;
        return acc + (Number.isSafeInteger(count) && count >= 0 ? count : 0);
      }, 0);
      total += n;
      byRelease[rel.tag_name || rel.name || "untagged"] = n;
    }
    return { total, byRelease, releaseCount: releases.length };
  } catch {
    return null;
  }
}

export async function latestRelease(repo) {
  if (process.env.ARRAS_METADATA_OFFLINE === "1" && repo === "Arras") return null;
  if (!["Arras", "Fadeo"].includes(repo)) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/yashashwi-s/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== "object" || !/^v\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(data.tag_name)) return null;
    const expectedReleaseUrl = `https://github.com/yashashwi-s/${repo}/releases/tag/${data.tag_name}`;
    if (data.html_url !== expectedReleaseUrl || !Number.isFinite(Date.parse(data.published_at))) return null;
    const assetPrefix = `/yashashwi-s/${repo}/releases/download/${data.tag_name}/`;
    const assets = [];
    for (const asset of data.assets || []) {
      if (!asset || typeof asset.name !== "string" || !/\.(?:dmg|zip)$/i.test(asset.name)) continue;
      let url;
      try { url = new URL(asset.browser_download_url); } catch { return null; }
      if (url.protocol !== "https:" || url.hostname !== "github.com" || !url.pathname.startsWith(assetPrefix)) return null;
      if (decodeURIComponent(url.pathname.slice(assetPrefix.length)) !== asset.name) return null;
      assets.push({ name: asset.name, url: url.href });
    }
    return {
      tag: data.tag_name,
      dmg: assets.find((a) => a.name.endsWith(".dmg"))?.url ?? null,
      zip: assets.find((a) => a.name.endsWith(".zip"))?.url ?? null,
      url: data.html_url,
      publishedAt: data.published_at,
    };
  } catch {
    return null;
  }
}
