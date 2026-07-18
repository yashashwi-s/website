// Sums release-asset downloads across ALL releases -- downloads accumulate per release, so
// the latest release alone undercounts. GitHub's auto-generated source tarballs aren't in
// `assets` and don't carry a download_count, so this is just the real .dmg/.zip tally.
// Optionally authenticates with GITHUB_TOKEN to lift the 60/hour unauthenticated limit.
// Returns null on any failure so callers degrade to "-" rather than break the dashboard.
export async function totalDownloads(repo) {
  try {
    const headers = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/yashashwi-s/${repo}/releases?per_page=100`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const releases = await res.json();
    if (!Array.isArray(releases)) return null;
    let total = 0;
    const byRelease = {};
    for (const rel of releases) {
      const n = (rel.assets || []).reduce((acc, a) => acc + (a.download_count || 0), 0);
      total += n;
      byRelease[rel.tag_name || rel.name || "untagged"] = n;
    }
    return { total, byRelease, releaseCount: releases.length };
  } catch {
    return null;
  }
}

export async function latestRelease(repo) {
  try {
    const res = await fetch(`https://api.github.com/repos/yashashwi-s/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const assets = (data.assets || []).map((a) => ({ name: a.name, url: a.browser_download_url }));
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
