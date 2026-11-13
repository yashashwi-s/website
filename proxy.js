import { NextResponse } from 'next/server';
import { guides } from './app/puremac/arras/guides/guide-data';
import { comparisons } from './app/puremac/arras/vs/comparison-data';
import { websiteObservation, recordWebsiteObservation } from './lib/arras-website-statistics.mjs';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - all .pdf files and physical /puremac media assets
     */
    '/((?!api|_next/static|_next/image|.*\\.pdf|puremac/.*\\.(?:png|jpg|jpeg|webp|avif|svg|gif|mp4|webm)$).*)',
  ],
};

export default function proxy(req, event) {
  const observation = websiteObservation(req);
  if (observation) event.waitUntil(recordWebsiteObservation(observation));
  const url = req.nextUrl;
  const hostname = (req.headers.get('host') || '').split(':')[0];

  // Config redirects run first, so legacy Arras URLs already received a 301.
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    // A plain URL avoids NextURL restoring the original trailingSlash flag.
    const normalized = new URL(req.url);
    normalized.pathname = normalized.pathname.replace(/\/+$/, '');
    return NextResponse.redirect(normalized, 308);
  }

  // Extract the current host (removing the root domain)
  // For local testing: cv.localhost:3000 -> 'cv'
  // For production: cv.yashashwi.me -> 'cv'
  const currentHost = hostname
    .replace(/\.yashashwi\.me$/, '')
    .replace(/\.localhost$/, '');

  // Subdomain routing
  if (currentHost === 'cv') {
    // Force browsers requesting the hardcoded favicon.ico to get our dynamic icon
    if (url.pathname === '/favicon.ico') {
      url.pathname = '/cv/icon';
      return NextResponse.rewrite(url);
    }

    // Prevent double-rewriting if Next.js directly requests a /cv asset (like /cv/icon)
    if (!url.pathname.startsWith('/cv')) {
      url.pathname = `/cv${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  } else if (currentHost === 'arras' || hostname === 'tryarras.tech' || hostname === 'www.tryarras.tech') {
    if (url.pathname === '/favicon.ico') {
      url.pathname = '/puremac/arras/favicon.ico';
      return NextResponse.rewrite(url);
    }

    // Keep API compatibility on both hosts; the reviewed page redirects select the primary domain. Keep the implementation in
    // its existing route group while exposing it at the subdomain root.
    if (!url.pathname.startsWith('/puremac/arras')) {
      const suffix = url.pathname === '/' ? '' : url.pathname;
      const detail = /^\/(guides|vs)\/([^/]+)$/.exec(suffix);
      if (detail) {
        const records = detail[1] === 'guides' ? guides : comparisons;
        try {
          if (!Object.hasOwn(records, decodeURIComponent(detail[2]))) {
            url.pathname = '/puremac/arras/page-not-found';
            return NextResponse.rewrite(url);
          }
        } catch (error) {
          if (!(error instanceof URIError)) throw error;
          url.pathname = '/puremac/arras/page-not-found';
          return NextResponse.rewrite(url);
        }
      }
      url.pathname = `/puremac/arras${suffix}`;
      return NextResponse.rewrite(url);
    }
  } else if (currentHost === 'puremac') {
    if (url.pathname === '/favicon.ico') {
      url.pathname = '/puremac/icon.svg';
      return NextResponse.rewrite(url);
    }

    if (!url.pathname.startsWith('/puremac')) {
      url.pathname = `/puremac${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  } else {
    // Main domain favicon fallback
    if (url.pathname === '/favicon.ico') {
      url.pathname = '/icon';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
