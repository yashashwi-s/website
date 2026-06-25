import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - all .pdf files
     */
    '/((?!api|_next/static|_next/image|.*\\.pdf).*)',
  ],
};

export default function proxy(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Extract the current host (removing the root domain)
  // For local testing: cv.localhost:3000 -> 'cv'
  // For production: cv.yashashwi.me -> 'cv'
  const currentHost = hostname
    .replace(`.yashashwi.me`, '')
    .replace(`.localhost:3000`, '');

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
  } else {
    // Main domain favicon fallback
    if (url.pathname === '/favicon.ico') {
      url.pathname = '/icon';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
