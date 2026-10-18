import { appendFileSync } from "node:fs";

// The review issue and evidence pass share the 17th in Asia/Kolkata.
// Manual dispatch reviews today; it never schedules a future dated submission.
const now = process.env.AEO_NOW ? new Date(process.env.AEO_NOW) : new Date();
if (!Number.isFinite(now.valueOf())) throw new Error("Invalid AEO review date");
const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
}).formatToParts(now).map(part => [part.type, part.value]));
const reviewDate = `${parts.year}-${parts.month}-${parts.day}`;
const forced = process.env.GITHUB_EVENT_NAME === "workflow_dispatch" || process.argv.includes("--force");
const date = new Date(`${reviewDate}T00:00:00Z`);
const outputs = {
  should_create: String(forced || reviewDate >= "2026-09-17" && Number(parts.day) === 17),
  notification_date: reviewDate,
  review_date: reviewDate,
  review_month: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(date),
  issue_key: reviewDate.slice(0, 7),
  quarterly: String([1, 4, 7, 10].includes(Number(parts.month))),
};
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT,
  Object.entries(outputs).map(([key, value]) => `${key}=${value}`).join("\n") + "\n");
console.log(JSON.stringify(outputs, null, 2));
