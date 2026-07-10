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
