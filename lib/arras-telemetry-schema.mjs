export const MAX_BYTES = 16_384;
export const MAX_EVENTS = 32;
export const TYPES = ["photo", "animated_image", "video", "slideshow", "collage", "container", "linked_folder", "photos_collection", "live_photo"];
export const BUCKETS = ["0", "1", "2-4", "5-9", "10-19", "20+"];
const EVENTS = ["first_run", "app_updated", "first_widget_created", "first_collage_created", "first_feature_used", "daily_configuration"];
const CORE = ["event_id", "event", "day", "app_version", "build", "os_version", "architecture"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VERSION = /^\d{1,4}(\.\d{1,4}){0,3}$/;
const OS = /^\d{1,3}\.\d{1,3}$/;
const object = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const keys = (v, required) => object(v) && Object.keys(v).length === required.length && required.every((k) => Object.hasOwn(v, k));
const text = (v, regex) => typeof v === "string" && regex.test(v);

// Exact keys and primitive enums only. Never truncate, sanitize or store arbitrary
// JSON: a private or oversized field is an error, even inside a nested object.
export function validateBatch(body, environment, now = Date.now()) {
  if (!keys(body, ["schema_version", "environment", "install_id", "events"]) || body.schema_version !== 1 ||
      body.environment !== environment || !text(body.install_id, UUID) || !Array.isArray(body.events) ||
      body.events.length < 1 || body.events.length > MAX_EVENTS) return null;
  const today = Math.floor(now / 86_400_000), ids = new Set(), snapshots = new Set();
  for (const e of body.events) {
    if (!object(e) || !EVENTS.includes(e.event)) return null;
    const extras = {
      first_run: ["existing_configuration"], app_updated: ["previous_version"],
      first_feature_used: ["widget_type"], daily_configuration: ["configuration"],
      first_widget_created: [], first_collage_created: [],
    }[e.event];
    if (!keys(e, [...CORE, ...extras]) || !text(e.event_id, UUID) || ids.has(e.event_id.toLowerCase()) ||
        !Number.isSafeInteger(e.day) || e.day < today - 7 || e.day > today + 1 ||
        !text(e.app_version, VERSION) || !text(e.build, VERSION) || !text(e.os_version, OS) ||
        !["arm64", "x86_64"].includes(e.architecture)) return null;
    ids.add(e.event_id.toLowerCase());
    if (e.event === "first_run" && typeof e.existing_configuration !== "boolean") return null;
    if (e.event === "app_updated" && !text(e.previous_version, VERSION)) return null;
    if (e.event === "first_feature_used" && !TYPES.includes(e.widget_type)) return null;
    if (e.event === "daily_configuration") {
      const c = e.configuration;
      if (snapshots.has(e.day) || !keys(c, ["widget_count", "collage_count", "counts_by_type"]) ||
          !BUCKETS.includes(c.widget_count) || !BUCKETS.includes(c.collage_count) ||
          !keys(c.counts_by_type, TYPES) || !TYPES.every((t) => BUCKETS.includes(c.counts_by_type[t]))) return null;
      snapshots.add(e.day);
    }
  }
  return { ...body, install_id: body.install_id.toLowerCase(), events: body.events.map((e) => ({ ...e, event_id: e.event_id.toLowerCase() })) };
}

export async function readBoundedJSON(request) {
  const length = request.headers.get("content-length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) throw new RangeError("size");
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("body");
  const chunks = []; let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BYTES) { await reader.cancel(); throw new RangeError("size"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
