import { appendFileSync } from "node:fs";

const TIME_ZONE = "Asia/Kolkata";
const FIRST_NOTIFICATION_DATE = process.env.AEO_FIRST_NOTIFICATION_DATE || "2026-10-04";
const now = process.env.AEO_NOW ? new Date(process.env.AEO_NOW) : new Date();
const forced = process.env.GITHUB_EVENT_NAME === "workflow_dispatch" || process.argv.includes("--force");

function partsInIndia(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(value.year),
    month: Number(value.month),
    day: Number(value.day),
  };
}

function utcDate({ year, month, day }) {
  return new Date(Date.UTC(year, month - 1, day));
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function isFirstMonday(date) {
  return date.getUTCDay() === 1 && date.getUTCDate() <= 7;
}

function nextFirstMonday(onOrAfter) {
  const cursor = new Date(onOrAfter);
  for (let offset = 0; offset < 40; offset += 1) {
    if (isFirstMonday(cursor)) return cursor;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  throw new Error("Unable to find the next first Monday");
}

const localToday = utcDate(partsInIndia(now));
const tomorrow = new Date(localToday);
tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
const scheduledReviewDate = forced ? nextFirstMonday(localToday) : tomorrow;
const todayIso = isoDate(localToday);
const shouldCreate = forced || (todayIso >= FIRST_NOTIFICATION_DATE && isFirstMonday(tomorrow));
const reviewDate = isoDate(scheduledReviewDate);
const reviewMonth = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(scheduledReviewDate);
const quarterly = [1, 4, 7, 10].includes(scheduledReviewDate.getUTCMonth() + 1);

const outputs = {
  should_create: String(shouldCreate),
  notification_date: todayIso,
  review_date: reviewDate,
  review_month: reviewMonth,
  issue_key: reviewDate.slice(0, 7),
  quarterly: String(quarterly),
};

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    Object.entries(outputs)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n") + "\n"
  );
}

console.log(JSON.stringify(outputs, null, 2));
