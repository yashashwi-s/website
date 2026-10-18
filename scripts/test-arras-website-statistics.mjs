import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import Redis from 'ioredis';
import { websiteObservation, recordWebsiteObservation, makeWebsiteStore, WEBSITE_RETENTION_DAYS } from '../lib/arras-website-statistics.mjs';
import { rememberArrasCampaign, arrasDownloadHref } from '../lib/arras-attribution.mjs';
const request = (path = '/', headers = {}, method = 'GET') => new Request('https://tryarras.tech' + path, { method, headers });

test('server attribution keeps short campaign labels, never full URLs, emails, user agents or identities', () => {
  const observation = websiteObservation(request('/?utm_source=Reddit&utm_campaign=arras-250&utm_term=person@example.com', {
    referer: 'https://google.com/search?q=private', 'user-agent': 'Safari private-device-string',
  }));
  assert.deepEqual(observation, {event: 'page', fields: ['event:page','path:/','referrer:google.com','utm_source:reddit','utm_campaign:arras-250']});
  assert.ok(!JSON.stringify(observation).includes('private'));
  assert.ok(!JSON.stringify(observation).includes('example.com'));
  for (const label of ['192.168.1.1', '7df550eb-5095-47e4-b100-a271b7c44b94', 'b6f06204ceb84060baac7c9e6dfb37a8']) {
    const unsafe = websiteObservation(request('/?utm_campaign=' + label + '&ref=' + label));
    assert.ok(!JSON.stringify(unsafe).includes(label), 'Address/identifier-shaped campaign labels must be discarded');
  }
  assert.equal(websiteObservation(new Request('https://yashashwi.me/')), null);
  for (const req of [request('/', {}, 'HEAD'), request('/api/telemetry/v1'), request('/', {'next-router-prefetch':'1'}), request('/', {'rsc':'1'}), request('/', {'sec-purpose':'prefetch'})]) assert.equal(websiteObservation(req), null);
  assert.deepEqual(websiteObservation(request('/', {'user-agent':'ExampleBot/1'})), {event:'automated',fields:['event:automated']});
});

test('first-entry UTMs survive same-tab navigation without cookies or arbitrary query fields', () => {
  const memory = new Map(), storage = {getItem:k=>memory.get(k), setItem:(k,v)=>memory.set(k,v)};
  const first = rememberArrasCampaign({url:'https://tryarras.tech/?utm_source=reddit&utm_medium=social&utm_campaign=launch&email=private@example.com',storage});
  const second = rememberArrasCampaign({url:'https://tryarras.tech/faq?utm_source=changed',storage});
  assert.deepEqual(first, second);
  const href = arrasDownloadHref('/download','reddit',second);
  assert.ok(href.includes('utm_campaign=launch'));
  assert.ok(!href.includes('email'));
  assert.ok(!href.includes('changed'));
});

test('disabled or failed analytics cannot block pages or the download redirect', async () => {
  let writes = 0;
  await recordWebsiteObservation({fields:[]},{enabled:false}, {record:async()=>{writes++;}});
  assert.equal(writes,0);
  const prior = console.warn, logs = [];
  try {
    console.warn = text=>logs.push(text);
    await recordWebsiteObservation({fields:[]},{enabled:true,redisURL:'fixture'}, {record:async()=>{throw Error('secret-url');}});
    assert.equal(logs.length,1);
    assert.ok(!logs[0].includes('secret'));
  } finally {console.warn=prior;}
});

const url = process.env.ARRAS_TELEMETRY_TEST_REDIS_URL;
if (url && !['127.0.0.1','localhost','::1'].includes(new URL(url).hostname)) throw Error('Website tests require an isolated loopback Redis.');
test('anonymous Redis day buckets enforce the monthly write allowance and fixed retention', {skip:!url}, async () => {
  const prefix = 'arras:test:'+randomUUID()+':website', redis = new Redis(url);
  const store = makeWebsiteStore({redisURL:url,monthlyLimit:2},prefix);
  const now=Date.now(), day=Math.floor(now/86400000), month=new Date(now).toISOString().slice(0,7);
  const page=websiteObservation(request('/?utm_source=reddit'));
  try {
    assert.equal(await store.record(page,now),204);
    assert.equal(await store.record(websiteObservation(request('/download?ref=reddit&utm_campaign=launch'), 'download'),now),204);
    assert.equal(await store.record(page,now),429);
    const data=await redis.hgetall(`${prefix}:day:${day}`), counts=JSON.parse(data._aggregate);
    assert.equal(data._schema,'1');
    assert.equal(counts['event:page'],1);
    assert.equal(counts['event:download'],1);
    assert.equal(counts['referrer:reddit'],1);
    assert.equal(counts['referrer:direct'],1);
    assert.equal(counts['utm_source:reddit'],1);
    assert.equal(await redis.get(`${prefix}:month:${month}`),'2');
    assert.deepEqual(Object.keys(data).sort(),['_aggregate','_schema']);
    const [expiry]=await redis.call('HEXPIRETIME',`${prefix}:day:${day}`,'FIELDS',1,'_aggregate');
    assert.equal(expiry,(day+WEBSITE_RETENTION_DAYS+1)*86400);
    const next=Date.UTC(new Date(now).getUTCFullYear(),new Date(now).getUTCMonth()+1,1);
    assert.equal(await store.record(page,next),204);
    await redis.set(`${prefix}:disabled`,'1');
    assert.equal(await store.record(page,next),410);
  } finally {
    for (const key of await redis.keys(prefix+':*')) await redis.del(key);
    redis.disconnect();
  }
});
