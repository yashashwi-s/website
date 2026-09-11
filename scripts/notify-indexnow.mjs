import { execFileSync } from "node:child_process";
import { indexNowKey, changedProductUrls, productUrls } from "../lib/indexnow.mjs";

const args = process.argv.slice(2);
let urls;
if (args.includes("--all")) urls = productUrls;
else {
  const { INDEXNOW_BEFORE: before, INDEXNOW_AFTER: after } = process.env;
  if (![before, after].every(ref => /^[a-f0-9]{40}$/.test(ref || ""))) throw new Error("Expected explicit full commit hashes");
  urls = changedProductUrls(execFileSync("git", ["diff", "--name-only", before, after], { encoding: "utf8" }).trim().split("\n"));
}
console.log("Changed public product pages:", urls);
if (!urls.length || args.includes("--dry-run")) process.exit(0);
const request = (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
if (process.env.INDEXNOW_WAIT_FOR_DEPLOY === "true") {
  const sha = process.env.INDEXNOW_AFTER;
  if (process.env.GITHUB_REPOSITORY !== "yashashwi-s/website") throw new Error("Unexpected repository");
  let ready = false;
  for (let attempt = 0; attempt < 20; attempt++) {
    const response = await request(`https://api.github.com/repos/yashashwi-s/website/commits/${sha}/status`, { headers: { Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`Deployment status HTTP ${response.status}`);
    const status = (await response.json()).statuses.find(s => s.context === "Vercel");
    if (status?.state === "success") { ready = true; break; }
    if (["error", "failure"].includes(status?.state)) throw new Error("Deployment failed; no URLs submitted");
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
  if (!ready) throw new Error("Deployment not confirmed; no URLs submitted");
}
for (const host of new Set(urls.map(url => new URL(url).host))) {
  const keyLocation = `https://${host}/${indexNowKey}.txt`;
  const verification = await request(keyLocation);
  if (!verification.ok || (await verification.text()).trim() !== indexNowKey) throw new Error(`Ownership verification failed for ${host}`);
  const urlList = urls.filter(url => new URL(url).host === host);
  for (const url of urlList) {
    const response = await request(url, { redirect: "manual" });
    if (response.status !== 200) throw new Error(`Product URL not ready: ${url}: ${response.status}`);
  }
  const response = await request("https://api.indexnow.org/indexnow", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ host, key: indexNowKey, keyLocation, urlList }) });
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow HTTP ${response.status} for ${host}`);
  console.log(`${host}: ${response.status} — notification received${response.status === 202 ? "; key validation pending" : ""}. This does not confirm indexing.`);
}
