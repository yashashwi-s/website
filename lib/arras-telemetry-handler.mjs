import { readBoundedJSON, validateBatch } from "./arras-telemetry-schema.mjs";
import { telemetrySettings, makeStore } from "./arras-telemetry-store.mjs";

const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const json = (body, status = 200) => Response.json(body, { status, headers });

export function makeHandlers(settings = telemetrySettings(), store = makeStore(settings)) {
  async function gate(request, checkStorage = true) {
    if (new URL(request.url).search || request.headers.has("origin")) return json({ error: "Unsupported request." }, 403);
    if (!settings.enabled) return null;
    if (!store.configured) return json({ error: "Unavailable." }, 503);
    if (!checkStorage) return null;
    try {
      const status = Number(await store.requestStatus());
      if (status === 410) return json({ schema_version: 1, enabled: false }, 410);
      if (status === 429) return json({ error: "Rate limited." }, 429);
      if (status !== 204) return json({ error: "Unavailable." }, 503);
    } catch { return json({ error: "Unavailable." }, 503); }
    return null;
  }
  return {
    async GET(request) {
      const denied = await gate(request);
      if (denied?.status === 410) return json({ schema_version: 1, enabled: false });
      if (denied) return denied;
      return json({ schema_version: 1, enabled: settings.enabled });
    },
    async POST(request) {
      // Valid batches check the shared request budget and kill switch atomically
      // with ingestion. Invalid batches still consume the request gate, but are
      // never stored. Parsing is bounded before any Redis work.
      const denied = await gate(request, false);
      if (denied) return denied;
      if (!settings.enabled) return json({ error: "Disabled." }, 410);
      const reject = async (message, status) => (await gate(request)) || json({ error: message }, status);
      if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get("content-type") || "") ||
          request.headers.has("content-encoding")) return reject("JSON required.", 415);
      let body;
      try { body = await readBoundedJSON(request); }
      catch (e) { return reject("Invalid payload.", e instanceof RangeError ? 413 : 400); }
      const validated = validateBatch(body, settings.environment);
      if (!validated) return reject("Invalid schema.", 422);
      try {
        const status = Number(await store.ingest(validated));
        if (status === 204) return new Response(null, { status: 204, headers });
        if ([429, 410].includes(status)) return json({ error: status === 429 ? "Rate limited." : "Disabled." }, status);
        return json({ error: "Unavailable." }, 503);
      } catch { return json({ error: "Unavailable." }, 503); }
    },
  };
}

// Read the kill switch at request time, including warm serverless invocations.
export async function GET(request) { return makeHandlers().GET(request); }
export async function POST(request) { return makeHandlers().POST(request); }
