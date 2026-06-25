import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - all .pdf files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.pdf).*)',
  ],
};

export default function proxy(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Extract the current host (removing the root domain)
  // For local testing: cv.localhost:3001 -> 'cv'
  // For production: cv.yashashwi.me -> 'cv'
  const currentHost = hostname
    .replace(`.yashashwi.me`, '')
    .replace(`.localhost:3001`, '');

  // Subdomain routing
  if (currentHost === 'cv') {
    // Rewrite cv.yashashwi.me/foo to yashashwi.me/cv/foo
    url.pathname = `/cv${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Future subdomains like 'blogs' can be added here
  // if (currentHost === 'blogs') {
  //   url.pathname = `/blogs${url.pathname}`;
  //   return NextResponse.rewrite(url);
  // }

  return NextResponse.next();
}
