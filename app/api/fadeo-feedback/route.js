import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { feedbackConfigured, submitFeedback, allFeedback } from "@/lib/fadeo-feedback";

function isAuthorizedAdmin(request) {
  const secret = process.env.ADMIN_KEY;
  const provided = request.headers.get("x-admin-secret");
  if (!secret || !provided) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(provided);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Called by the app when a user submits a rating/feedback (Feedback.swift). Unauthenticated
// by design -- the payload is anonymous (a random installID, no personal data).
export async function POST(request) {
  if (!feedbackConfigured()) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const record = await submitFeedback(body);
  if (!record) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

// Admin-only: the dashboard's feedback feed.
export async function GET(request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!feedbackConfigured()) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  const feedback = await allFeedback();
  return NextResponse.json({ feedback });
}
