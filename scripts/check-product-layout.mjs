import puppeteer from "puppeteer-core";
import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Local-only smoke test; uses a fresh browser profile, never personal sessions.
const directory = await mkdtemp(join(tmpdir(), "puremac-layout-"));
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3012"], { stdio: "ignore" });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { ready = (await fetch("http://127.0.0.1:3012/puremac")).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error("Preview unavailable");
  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const route of ["puremac", "puremac/arras", "puremac/fadeo"]) {
    for (const width of [390, 820, 1440]) {
      await page.setViewport({ width, height: 1000 });
      await page.goto(`http://127.0.0.1:3012/${route}`, { waitUntil: "networkidle2" });
      await page.evaluate(() => { for (const image of document.images) image.loading = "eager"; });
      await page.waitForFunction(() => [...document.images].every(image => image.complete), { timeout: 20000 });
      const state = await page.evaluate(() => ({ heading: document.querySelector("h1")?.innerText, overflow: document.documentElement.scrollWidth > innerWidth + 1, brokenImages: [...document.images].filter(i => i.getAttribute("src") && (!i.complete || !i.naturalWidth)).map(i => i.src) }));
      if (!state.heading || state.overflow || state.brokenImages.length) throw new Error(JSON.stringify({ route, width, ...state }));
      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => document.activeElement?.tagName);
      if (!["A", "BUTTON", "SUMMARY", "INPUT"].includes(focus)) throw new Error(`${route}: keyboard focus not interactive: ${focus}`);
      await page.screenshot({ path: join(directory, `${route.replaceAll("/", "-")}-${width}.png`), fullPage: true });
      console.log(`PASS ${route} at ${width}px: heading, image loading, page overflow, initial keyboard focus`);
    }
  }
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto("http://127.0.0.1:3012/puremac/arras", { waitUntil: "networkidle2" });
  if (!(await page.$eval("#arras-demo", video => video.paused))) throw new Error("Reduced-motion demo did not pause");
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.waitForFunction(() => !document.querySelector("#arras-demo").paused);
  console.log("PASS reduced-motion pause and ordinary autoplay");
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(`Screenshots: ${directory}`);
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
