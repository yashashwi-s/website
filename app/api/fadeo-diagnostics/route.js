import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { diagnosticsConfigured, submitSummary, allSummaries, aggregate } from "@/lib/fadeo-diagnostics";

function isAuthorizedAdmin(request) {
  const secret = process.env.ADMIN_KEY;
  const provided = request.headers.get("x-admin-secret");
  if (!secret || !provided) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(provided);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Called by the app itself, at most once a day, only when the user opted in (see
// DiagnosticsUploader.swift). Deliberately unauthenticated -- there's nothing sensitive
// in the payload (no personal data, no config contents; see ShareableUsageSummary) and
// requiring a shared secret in a client binary wouldn't actually be a secret anyway.
export async function POST(request) {
  if (!diagnosticsConfigured()) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const record = await submitSummary(body);
  if (!record) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

// Admin-only: the dashboard's data source. Requires x-admin-secret to match ADMIN_KEY.
export async function GET(request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!diagnosticsConfigured()) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  const rows = await allSummaries();
  rows.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  return NextResponse.json({ summary: aggregate(rows), installs: rows });
}
