const cases = [
  ["https://puremac.yashashwi.me/arras", "https://arras.yashashwi.me"],
  ["https://puremac.yashashwi.me/arras?utm_source=legacy-check", "https://arras.yashashwi.me?utm_source=legacy-check"],
  ["https://yashashwi.me/puremac/arras", "https://arras.yashashwi.me"],
  ["https://puremac.yashashwi.me/tableau", "https://arras.yashashwi.me"],
  ["https://yashashwi.me/puremac/tableau", "https://arras.yashashwi.me"],
];
for (const [source, target] of cases) {
  const response = await fetch(source, { redirect: "manual", signal: AbortSignal.timeout(20000) });
  const actual = new URL(response.headers.get("location") || source, source);
  const expected = new URL(target);
  if (![301, 308].includes(response.status) || actual.href !== expected.href) throw new Error(`${source}: ${response.status} → ${actual.href}, expected ${expected.href}`);
  const destination = await fetch(actual, { redirect: "manual", signal: AbortSignal.timeout(20000) });
  if (destination.status !== 200) throw new Error(`${actual.href}: extra hop or failure ${destination.status}`);
  console.log(`PASS ${source} → ${actual.href}`);
}
