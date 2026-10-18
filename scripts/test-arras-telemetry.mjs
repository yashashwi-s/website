import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { validateBatch, readBoundedJSON, TYPES, MAX_BYTES } from "../lib/arras-telemetry-schema.mjs";
import { makeHandlers } from "../lib/arras-telemetry-handler.mjs";
import { telemetrySettings } from "../lib/arras-telemetry-store.mjs";

const day = Math.floor(Date.now() / 86_400_000);
export function fixture() {
  const core = { day, app_version: "2.4.6", build: "19", os_version: "27.0", architecture: "arm64" };
  return { schema_version: 1, environment: "development", install_id: randomUUID(), events: [
    { ...core, event_id: randomUUID(), event: "first_run", existing_configuration: false },
    { ...core, event_id: randomUUID(), event: "app_updated", previous_version: "2.4.5" },
    { ...core, event_id: randomUUID(), event: "first_widget_created" },
    { ...core, event_id: randomUUID(), event: "first_collage_created" },
    { ...core, event_id: randomUUID(), event: "first_feature_used", widget_type: "collage" },
    { ...core, event_id: randomUUID(), event: "daily_configuration", configuration: {
      widget_count: "2-4", collage_count: "1", counts_by_type: Object.fromEntries(TYPES.map((t) => [t, t === "collage" || t === "photo" ? "1" : "0"])),
    } },
  ] };
}
const request = (body, headers = {}) => new Request("http://127.0.0.1:3000/api/telemetry/v1", {
  method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body),
});
const settings = { enabled: true, environment: "development" };
function fakeStore(changes = {}) {
  return { configured: true, requestStatus: async () => 204, ingest: async () => 204, ...changes };
}

test("accepts only the complete fixed schema in the correct environment", () => {
  assert.ok(validateBatch(fixture(), "development"));
  assert.equal(validateBatch(fixture(), "production"), null);
  for (const field of ["filename", "path", "photo", "email", "ip", "name", "user_text", "layout", "clipboard"]) {
    const body = fixture(); body[field] = "private";
    assert.equal(validateBatch(body, "development"), null, field);
    const nested = fixture(); nested.events[0][field] = "private";
    assert.equal(validateBatch(nested, "development"), null, `event.${field}`);
    const config = fixture(); config.events[5].configuration[field] = "private";
    assert.equal(validateBatch(config, "development"), null, `configuration.${field}`);
  }
});
test("rejects malformed identities, dimensions, dates, flags, enums, buckets and arbitrary map keys", () => {
  for (const edit of [
    (b) => b.install_id = "hardware-derived", (b) => b.schema_version = true,
    (b) => b.events[0].day = day - 8, (b) => b.events[0].day = day + 2,
    (b) => b.events[0].day = 0.2, (b) => b.events[0].existing_configuration = 1,
    (b) => b.events[0].app_version = "private-name", (b) => b.events[0].build = "x".repeat(1000),
    (b) => b.events[0].os_version = "27.0.1", (b) => b.events[0].architecture = "serial-number",
    (b) => b.events[4].widget_type = "custom user text", (b) => b.events[5].configuration.widget_count = 2,
    (b) => b.events[5].configuration.counts_by_type.private = "1",
    (b) => delete b.events[5].configuration.counts_by_type.photo,
    (b) => b.events.push(b.events[0]), (b) => b.events.push({ ...b.events[5], event_id: randomUUID() }),
    (b) => b.events = Array.from({ length: 33 }, () => ({ ...b.events[2], event_id: randomUUID() })),
    (b) => b.events[1].previous_version = "/private/path",
  ]) {
    const body = fixture(); edit(body); assert.equal(validateBatch(body, "development"), null);
  }
});
test("stream limit rejects oversized payloads even with no content length or a lying length", async () => {
  for (const headers of [{}, { "content-length": "1" }, { "content-length": "20000" }]) {
    const req = request({ extra: "a".repeat(MAX_BYTES) }, headers);
    await assert.rejects(readBoundedJSON(req), RangeError);
  }
});
test("route status, private-field rejection and fail-closed storage behavior", async () => {
  const api = makeHandlers(settings, fakeStore());
  assert.equal((await api.POST(request(fixture()))).status, 204);
  const privateBody = fixture(); privateBody.events[0].filename = "private.jpg";
  assert.equal((await api.POST(request(privateBody))).status, 422);
  assert.equal((await api.POST(request(fixture(), { origin: "https://other.example" }))).status, 403);
  assert.equal((await api.POST(request(fixture(), { "content-type": "text/plain" }))).status, 415);
  assert.equal((await api.POST(request(fixture(), { "content-encoding": "gzip" }))).status, 415);
  assert.equal((await api.POST(request({ large: "x".repeat(MAX_BYTES) }))).status, 413);
  const broken = makeHandlers(settings, fakeStore({ ingest: async () => { throw new Error("secret connection string"); } }));
  const failure = await broken.POST(request(fixture()));
  assert.equal(failure.status, 503); assert.equal((await failure.text()).includes("secret"), false);
  assert.equal((await makeHandlers(settings, fakeStore({ configured: false })).POST(request(fixture()))).status, 503);
  assert.equal((await makeHandlers(settings, fakeStore({ requestStatus: async () => 429, ingest: async () => 429 })).POST(request(fixture()))).status, 429);
});
test("global and Redis kill switches suppress upload and public control responses have no identifiers", async () => {
  for (const api of [makeHandlers({ ...settings, enabled: false }, fakeStore()),
                     makeHandlers(settings, fakeStore({ requestStatus: async () => 410, ingest: async () => 410 }))]) {
    assert.equal((await api.POST(request(fixture()))).status, 410);
    const response = await api.GET(new Request("http://localhost/api/telemetry/v1"));
    assert.deepEqual(await response.json(), { schema_version: 1, enabled: false });
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  for (const status of [0, undefined, 500]) {
    const api = makeHandlers(settings, fakeStore({ requestStatus: async () => status, ingest: async () => status }));
    assert.equal((await api.POST(request(fixture()))).status, 503);
    assert.equal((await api.GET(new Request("http://localhost/api/telemetry/v1"))).status, 503);
  }
  const unavailable = makeHandlers(settings, fakeStore({ requestStatus: async () => { throw new Error("private URL"); } }));
  assert.equal((await unavailable.GET(new Request("http://localhost/api/telemetry/v1"))).status, 503);
  assert.equal(telemetrySettings({}).enabled, false);
  assert.equal(telemetrySettings({}).environment, "development");
});

test("uploads use one atomic gate and rejected payloads remain rate limited", async () => {
  let controls = 0, writes = 0;
  const api = makeHandlers(settings, fakeStore({
    requestStatus: async () => { controls++; return 429; },
    ingest: async () => { writes++; return 204; },
  }));
  assert.equal((await api.POST(request(fixture()))).status, 204);
  assert.equal(controls, 0);
  assert.equal(writes, 1);
  const invalid = fixture(); invalid.filename = "private.jpg";
  assert.equal((await api.POST(request(invalid))).status, 429);
  assert.equal(controls, 1);
  assert.equal(writes, 1, "Invalid data never reaches ingestion");
});
