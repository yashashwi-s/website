import assert from 'node:assert/strict';
import { AsyncLocalStorage } from 'node:async_hooks';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import nextConfig from '../next.config.mjs';

globalThis.AsyncLocalStorage = AsyncLocalStorage;
const require = createRequire(import.meta.url);
const { unstable_doesMiddlewareMatch: matches } = require('next/experimental/testing/server');
const { pathToRegexp } = require('next/dist/compiled/path-to-regexp');
// Resolve the extensionless Next import as the framework does during compilation.
const source = (await readFile(new URL('../proxy.js', import.meta.url), 'utf8'))
  .replace("'next/server'", JSON.stringify(pathToFileURL(require.resolve('next/server')).href));
const { config, default: proxy } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const { NextRequest } = require('next/server');

const redirects = (await nextConfig.redirects()).map(r => ({ ...r, re: pathToRegexp(r.source) }));
const headers = await nextConfig.headers();
for (const host of ['yashashwi.me', 'arras.yashashwi.me', 'puremac.yashashwi.me']) {
  for (const path of ['/puremac/arras/demo.mp4', '/puremac/arras/demo-poster.jpg', '/puremac/arras/mark.svg', '/puremac/fadeo-icon.png']) {
    const url = `https://${host}${path}`;
    assert.equal(matches({ config, nextConfig, url }), false, `${url} should bypass proxy`);
    assert.equal(redirects.some(r => r.re.test(path)), false, `${url} should not redirect`);
    assert(headers.some(r => pathToRegexp(r.source).test(path)), `${url} should have a media cache policy`);
  }
  assert.equal(headers.some(r => pathToRegexp(r.source).test('/api/fadeo-license')), false);
}
for (const path of ['/puremac/arras', '/puremac/arras/', '/puremac/arras/robots.txt']) {
  assert(redirects.some(r => r.re.test(path)), `${path} must retain legacy redirects`);
}
for (const [host, path, target] of [
  ['arras.yashashwi.me', '/', '/puremac/arras'],
  ['arras.yashashwi.me', '/demo.mp4', '/puremac/arras/demo.mp4'],
  ['arras.yashashwi.me', '/sitemap.xml', '/puremac/arras/sitemap.xml'],
  ['puremac.yashashwi.me', '/fadeo', '/puremac/fadeo'],
  ['puremac.yashashwi.me', '/fadeo/privacy', '/puremac/fadeo/privacy'],
  ['arras.localhost:3100', '/', '/puremac/arras'],
  ['puremac.localhost:3100', '/', '/puremac'],
]) {
  const url = `https://${host}${path}`;
  assert(matches({ config, nextConfig, url }));
  const response = proxy(new NextRequest(url, { headers: { host } }));
  assert.equal(new URL(response.headers.get('x-middleware-rewrite')).pathname, target);
}
console.log('PASS: media bypasses redirects/proxy on all three hosts; caching and page rewrites remain correct.');
