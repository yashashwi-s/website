import { handleArrasDownload } from "@/lib/arras-download.mjs";

import { after } from "next/server";
import { websiteObservation, recordWebsiteObservation } from "@/lib/arras-website-statistics.mjs";

export const dynamic = "force-dynamic";

export function GET(request) {
  const response = handleArrasDownload(request);
  const observation = websiteObservation(request, "download");
  if (observation) after(() => recordWebsiteObservation(observation));
  return response;
}

// Next otherwise derives HEAD from GET, which would inflate request logs.
export function HEAD(request) {
  return handleArrasDownload(request);
}
