import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import Redis from "ioredis";
import { makeStore, INGEST_SCRIPT, AGGREGATE_DAYS } from "../lib/arras-telemetry-store.mjs";
import { TYPES } from "../lib/arras-telemetry-schema.mjs";

const url = process.env.ARRAS_TELEMETRY_TEST_REDIS_URL;
if (url && !["127.0.0.1", "localhost", "::1"].includes(new URL(url).hostname)) throw new Error("Tests require an isolated loopback Redis instance.");
const dayKey = (prefix, day) => `${prefix}:day:${day}`;
async function readAggregate(r, prefix, day) {
  const value = await r.hget(dayKey(prefix, day), "_aggregate");
  return Object.fromEntries(Object.entries(value ? JSON.parse(value) : {}).map(([key, count]) => [key, String(count)]));
}
async function rawEvents(r, prefix, day) {
  const fields = await r.hgetall(dayKey(prefix, day));
  return Object.fromEntries(Object.entries(fields).filter(([key]) => key.startsWith("raw:")).map(([key, value]) => [key.slice(4), value]));
}
async function rawExpiry(r, prefix, day) {
  const first = Object.keys(await rawEvents(r, prefix, day))[0];
  assert.ok(first, "Expected a retained raw event");
  return (await r.call("HEXPIRETIME", dayKey(prefix, day), "FIELDS", 1, "raw:" + first))[0];
}
async function aggregateExpiry(r, prefix, day) {
  return (await r.call("HEXPIRETIME", dayKey(prefix, day), "FIELDS", 1, "_aggregate"))[0];
}
function assertDeadline(actual, expected) {
  assert.ok(actual <= expected && actual >= expected - 1, "Absolute expiry must not extend retention");
}

test("Redis atomic retry, daily deduplication, budgets, retention and environment isolation", { skip: !url }, async () => {
  const namespace = `arras:test:${randomUUID()}`, prefix = `${namespace}:development`;
  const r = new Redis(url), today = Math.floor(Date.now() / 86_400_000), id = randomUUID();
  const settings = { enabled: true, environment: "development", redisURL: url };
  const store = makeStore(settings, namespace);
  const event = { event_id: randomUUID(), event: "daily_configuration", day: today,
    app_version: "2.4.6", build: "19", os_version: "27.0", architecture: "arm64",
    configuration: { widget_count: "1", collage_count: "0", counts_by_type: Object.fromEntries(TYPES.map((t) => [t, t === "photo" ? "1" : "0"])) } };
  const body = { schema_version: 1, environment: "development", install_id: id, events: [event] };
  try {
    assert.deepEqual(await Promise.all([store.ingest(body), store.ingest(body)]), [204, 204]);
    assert.equal((await readAggregate(r, prefix, today))["event:daily_configuration"], "1");
    assert.equal(Object.keys(await rawEvents(r, prefix, today)).length, 1);
    const second = { ...body, events: [{ ...event, event_id: randomUUID() }] };
    assert.equal(await store.ingest(second), 204);
    assert.equal((await readAggregate(r, prefix, today))["event:daily_configuration"], "1");
    for (let n = 0; n < 3; n++) assert.equal(await store.ingest(body), 204);
    assert.equal(await store.ingest(body), 429);
    const expected = {
      "event:daily_configuration": "1", "version:2.4.6": "1", "build:19": "1",
      "os:27.0": "1", "architecture:arm64": "1", "widgets:1": "1", "collages:0": "1",
      ...Object.fromEntries(TYPES.map(t => [`type:${t}:${t === "photo" ? "1" : "0"}`, "1"])),
    };
    assert.deepEqual(await readAggregate(r, prefix, today), expected);
    const { configuration, ...milestoneFields } = event;
    const additional = Array.from({ length: 20 }, () => ({ ...body, install_id: randomUUID(), events: [
      { ...event, event_id: randomUUID() },
      { ...milestoneFields, event_id: randomUUID(), event: "first_run", existing_configuration: true },
    ] }));
    assert.deepEqual(await Promise.all(additional.map(b => store.ingest(b))), Array(20).fill(204));
    const totals = await readAggregate(r, prefix, today);
    for (const field of Object.keys(expected)) assert.equal(totals[field], "21", field);
    assert.equal(totals["event:first_run"], "20");
    assert.equal(totals["existing_configuration:true"], "20");
    assert.equal(Object.keys(await rawEvents(r, prefix, today)).length, 41, "Batched raw writes retain every accepted event");
    const previousDay = today - 1;
    const mixedDays = { ...body, install_id: randomUUID(), events: [
      { ...milestoneFields, event_id: randomUUID(), event: "first_run", day: previousDay, existing_configuration: false },
      { ...milestoneFields, event_id: randomUUID(), event: "first_widget_created", day: previousDay },
      { ...milestoneFields, event_id: randomUUID(), event: "first_collage_created" },
    ] };
    assert.equal(await store.ingest(mixedDays), 204);
    assert.equal(await store.ingest(mixedDays), 204);
    assert.equal(Object.keys(await rawEvents(r, prefix, previousDay)).length, 2);
    assert.equal(Object.keys(await rawEvents(r, prefix, today)).length, 42);
    assert.equal((await readAggregate(r, prefix, previousDay))["event:first_run"], "1");
    assert.equal((await readAggregate(r, prefix, today))["event:first_collage_created"], "1");
    assert.equal(await rawExpiry(r, prefix, previousDay), (previousDay + 31) * 86400);

    const budgetTTL = await r.ttl(`${prefix}:budget:${today}`);
    assert.ok(budgetTTL > 86400 && budgetTTL <= 2 * 86400);
    const rawTTL = await rawExpiry(r, prefix, today) - Math.floor(Date.now() / 1000), aggregateTTL = await aggregateExpiry(r, prefix, today) - Math.floor(Date.now() / 1000);
    assert.ok(rawTTL > 29 * 86400 && rawTTL <= 31 * 86400);
    assert.ok(aggregateTTL > (AGGREGATE_DAYS - 1) * 86400 && aggregateTTL <= (AGGREGATE_DAYS + 1) * 86400);
    await r.set(`${prefix}:disabled`, "1");
    assert.equal(await store.requestStatus(), 410);
    assert.equal(await store.ingest({ ...body, install_id: randomUUID() }), 410);
    assert.equal(await makeStore({ ...settings, environment: "production" }, namespace).requestStatus(), 204);
    await r.del(`${prefix}:disabled`);
    assert.equal(await store.requestStatus(), 204);
    const minute = Math.floor(Date.now() / 60_000);
    await r.set(`${prefix}:requests:${minute}`, "1000", "EX", 120);
    assert.equal(await store.requestStatus(), 429);
    assert.equal(await store.ingest({ ...body, install_id: randomUUID() }), 429, "Uploads share the control request budget");
    await r.set(`${prefix}:disabled`, "1");
    assert.equal(await store.ingest({ ...body, install_id: randomUUID() }), 410, "Upload kill switch precedes rate limits");
    assert.equal(await store.requestStatus(), 410, "Kill switch takes precedence over the rate limit");
    await r.del(`${prefix}:disabled`);
    await r.del(`${prefix}:requests:${minute}`);
    await r.set(`${prefix}:budget:${today}`, "10000");
    assert.equal(await store.ingest({ ...body, install_id: randomUUID() }), 429);
    const aggregate = await readAggregate(r, prefix, today);
    assert.equal(JSON.stringify(aggregate).includes(id), false);
    assert.equal(JSON.stringify(aggregate).includes(event.event_id), false);
  } finally {
    // Every key here has a unique test namespace; never FLUSHDB or touch app keys.
    const keys = await r.keys(`${namespace}:*`);
    if (keys.length) await r.del(...keys);
    r.disconnect();
  }
});


test("Redis mixed retries preserve new events across days and repeated IDs", { skip: !url }, async () => {
  const namespace = `arras:test:${randomUUID()}`, prefix = `${namespace}:development`;
  const r = new Redis(url), today = Math.floor(Date.now() / 86_400_000);
  const store = makeStore({ enabled: true, environment: "development", redisURL: url }, namespace);
  const body = { schema_version: 1, environment: "development", install_id: randomUUID(), events: [] };
  const core = { app_version: "2.5.0", build: "2209", os_version: "27.0", architecture: "arm64" };
  const event = (name, day = today, extras = {}) => ({ ...core, event_id: randomUUID(), event: name, day, ...extras });
  const older = event("first_widget_created", today - 1);
  const first = event("first_run", today, { existing_configuration: false });
  const feature = event("first_feature_used", today, { widget_type: "photo" });
  const collage = event("first_collage_created");
  try {
    assert.equal(await store.ingest({ ...body, events: [older, first] }), 204);
    const expiry = await rawExpiry(r, prefix, today);
    assert.equal(await store.ingest({ ...body, events: [first, feature, older, collage] }), 204);
    assert.equal(await store.ingest({ ...body, events: [feature, feature, older, collage] }), 204);
    assert.equal(Object.keys(await rawEvents(r, prefix, today - 1)).length, 1);
    assert.equal(Object.keys(await rawEvents(r, prefix, today)).length, 3);
    const retained = Object.values(await rawEvents(r, prefix, today)).map(value => JSON.parse(value).event_id).sort();
    assert.deepEqual(retained, [first, feature, collage].map(e => e.event_id).sort());
    const totals = await readAggregate(r, prefix, today);
    assert.equal(totals["event:first_run"], "1");
    assert.equal(totals["event:first_feature_used"], "1");
    assert.equal(totals["feature:photo"], "1");
    assert.equal(totals["event:first_collage_created"], "1");
    assert.equal((await readAggregate(r, prefix, today - 1))["event:first_widget_created"], "1");
    assert.equal(await rawExpiry(r, prefix, today), expiry);
    assert.equal(await rawExpiry(r, prefix, today - 1), (today + 30) * 86400);
  } finally {
    const keys = await r.keys(`${namespace}:*`);
    if (keys.length) await r.del(...keys);
    r.disconnect();
  }
});

test("Redis interrupted day commits retry without lost counts or unexpired raw fields", { skip: !url }, async () => {
  const namespace = `arras:test:${randomUUID()}`, r = new Redis(url);
  const today = Math.floor(Date.now() / 86_400_000), now = Math.floor(Date.now() / 1000);
  const event = { event_id: randomUUID(), event: "daily_configuration", day: today,
    app_version: "2.5.0", build: "2209", os_version: "27.0", architecture: "arm64",
    configuration: { widget_count: "1", collage_count: "0", counts_by_type: { photo: "1" } } };
  const injected = `local n=0
local function checkpoint(...) n=n+1;if n==tonumber(ARGV[6]) then error('TEST command failure') end;return redis.call(...) end
` + INGEST_SCRIPT.replaceAll("redis.call(", "checkpoint(").replace("return 204\n", "return {204,n}\n");
  const request = () => ({ schema_version: 1, environment: "development", install_id: randomUUID(), events: [{ ...event, event_id: randomUUID() }] });
  try {
    for (let boundary = 1; boundary <= 8; boundary++) {
      const prefix = `${namespace}:${boundary}`, body = request();
      await assert.rejects(() => r.eval(injected, 0, prefix, JSON.stringify(body), today, 10000, now, boundary), /TEST command failure/);
      const before = await readAggregate(r, prefix, today);
      const raw = await rawEvents(r, prefix, today);
      assert.ok(Object.keys(before).length === 0 || before["event:daily_configuration"] === "1");
      if (Object.keys(before).length) {
        assert.equal(Object.keys(raw).length, 1, "Counters and deduplication must commit together");
        assertDeadline(await rawExpiry(r, prefix, today), (today + 31) * 86400);
      } else { assert.equal(Object.keys(raw).length, 0); }
      for (let retry = 0; retry < 2; retry++) {
        assert.equal(await r.eval(INGEST_SCRIPT, 0, prefix, JSON.stringify(body), today, 10000, now), 204);
        assert.equal((await readAggregate(r, prefix, today))["event:daily_configuration"], "1");
        assert.equal(Object.keys(await rawEvents(r, prefix, today)).length, 1);
        assertDeadline(await rawExpiry(r, prefix, today), (today + 31) * 86400);
        assertDeadline(await aggregateExpiry(r, prefix, today), (today + 401) * 86400);
      }
    }
    const prefix = `${namespace}:days`, body = request();
    body.events.unshift({ ...event, event_id: randomUUID(), event: "first_widget_created", day: today - 1 });
    await assert.rejects(() => r.eval(injected, 0, prefix, JSON.stringify(body), today, 10000, now, 11), /TEST command failure/);
    assert.equal((await readAggregate(r, prefix, today - 1))["event:first_widget_created"], "1");
    assert.deepEqual(await readAggregate(r, prefix, today), {});
    assert.equal(await r.eval(INGEST_SCRIPT, 0, prefix, JSON.stringify(body), today, 10000, now), 204);
    assert.equal((await readAggregate(r, prefix, today - 1))["event:first_widget_created"], "1");
    assert.equal((await readAggregate(r, prefix, today))["event:daily_configuration"], "1");
  } finally {
    const keys = await r.keys(`${namespace}:*`);
    if (keys.length) await r.del(...keys);
    r.disconnect();
  }
});

test("Redis legacy migration repairs partial claims and preserves ambiguous history", { skip: !url }, async () => {
  const namespace = `arras:test:${randomUUID()}`, r = new Redis(url), today = Math.floor(Date.now() / 86_400_000);
  const event = { event_id: randomUUID(), event: "daily_configuration", day: today,
    app_version: "2.5.0", build: "2209", os_version: "27.0", architecture: "arm64",
    configuration: { widget_count: "1", collage_count: "0", counts_by_type: { photo: "1" } } };
  try {
    for (const hasRaw of [false, true]) {
      const base = `${namespace}:${hasRaw}`, prefix = `${base}:development`, install = randomUUID();
      const body = { schema_version: 1, environment: "development", install_id: install, events: [event] };
      await r.sadd(`${prefix}:snapshots:${today}`, install);
      if (hasRaw) await r.hset(`${prefix}:raw:${today}`, `${install}:${event.event_id}`, JSON.stringify(event));
      const oldRaw = await r.hgetall(`${prefix}:raw:${today}`);
      const store = makeStore({ enabled: true, environment: "development", redisURL: url }, base);
      assert.equal(await store.ingest(body), 204);
      assert.equal((await readAggregate(r, prefix, today))["event:daily_configuration"], "1");
      assert.equal(Object.keys(await rawEvents(r, prefix, today)).length, 1);
      assert.deepEqual(await r.hgetall(`${prefix}:raw:${today}`), oldRaw);
      assert.equal(await r.scard(`${prefix}:snapshots:${today}`), 1);
      assert.equal(await store.ingest(body), 204);
      assert.equal((await readAggregate(r, prefix, today))["event:daily_configuration"], "1");
    }
    const base = `${namespace}:ambiguous`, prefix = `${base}:development`;
    const store = makeStore({ enabled: true, environment: "development", redisURL: url }, base);
    await r.hset(`${prefix}:aggregate:${today}`, "event:daily_configuration", 1);
    await assert.rejects(() => store.ingest({ schema_version: 1, environment: "development", install_id: randomUUID(), events: [event] }), /needs reconciliation/);
    assert.equal(await r.hget(`${prefix}:aggregate:${today}`, "event:daily_configuration"), "1");
    assert.equal(await r.exists(dayKey(prefix, today)), 0, "Do not erase or silently replace history without raw evidence");
    await r.set(dayKey(prefix, today), "wrong-type");
    await assert.rejects(() => store.ingest({ schema_version: 1, environment: "development", install_id: randomUUID(), events: [event] }), /WRONGTYPE/);
  } finally {
    const keys = await r.keys(`${namespace}:*`);
    if (keys.length) await r.del(...keys);
    r.disconnect();
  }
});
