/** @type {import('next').NextConfig} */
const nextConfig = {
  // Let legacy URLs (including trailing slashes) reach the one-hop 301 rules.
  // Proxy retains trailing-slash normalization for the other page routes.
  skipTrailingSlashRedirect: true,
  images: {
    // Narrower candidates avoid rounding small screens up to a 750px poster.
    deviceSizes: [480, 640, 672, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [{
      // These filenames are editable: cache briefly, never mark them immutable.
      source: '/:asset(.*\\.(?:png|jpg|jpeg|webp|avif|svg|gif|mp4|webm))',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
    }];
  },
  async redirects() {
    const arrasHost = [{ type: 'host', value: '(arras\\.yashashwi\\.me|tryarras\\.tech|www\\.tryarras\\.tech)' }];
    const siteHosts = [{ type: 'host', value: '(.*\\.)?yashashwi\\.me' }];
    return [
      {
        source: '/faqs',
        has: arrasHost,
        destination: 'https://tryarras.tech/faq',
        statusCode: 301,
      },
      ...['/arras', '/puremac/arras'].map(base => ({
        source: `${base}/security-privacy`,
        has: siteHosts,
        destination: 'https://tryarras.tech/security',
        statusCode: 301,
      })),
      ...['/arras', '/puremac/arras'].map(base => ({
        source: `${base}/faqs`,
        has: siteHosts,
        destination: 'https://tryarras.tech/faq',
        statusCode: 301,
      })),
      {
        source: '/security-privacy',
        has: arrasHost,
        destination: 'https://tryarras.tech/security',
        statusCode: 301,
      },
      {
        // Arras now has its own canonical host. Keep every legacy path as a
        // direct permanent redirect so crawlers never see duplicate content.
        source: '/arras/:path*',
        has: siteHosts,
        destination: 'https://tryarras.tech/:path*',
        statusCode: 301,
      },
      {
        // Public media already lives at this path. Redirect pages only so
        // posters and demos do not pay an extra network round trip.
        source: '/puremac/arras/:path((?!.*\\.(?:png|jpg|jpeg|webp|avif|svg|gif|mp4|webm)$).*[^/])?',
        has: siteHosts,
        destination: 'https://tryarras.tech/:path*',
        statusCode: 301,
      },
      ...['arras\\.yashashwi\\.me', 'www\\.tryarras\\.tech'].map(host => ({
        source: '/:path((?!api(?:/|$)|_next(?:/|$)|puremac/.*\\.(?:png|jpg|jpeg|webp|avif|svg|gif|mp4|webm)$).*)',
        has: [{ type: 'host', value: host }],
        destination: 'https://tryarras.tech/:path*',
        statusCode: 301,
      })),
      {
        // /latest was where this design lived before it replaced the homepage.
        source: '/latest',
        destination: '/',
        permanent: true,
      },
      {
        // Tableau was renamed to Arras in v2.3.1; old links must keep resolving.
        // Both shapes: the path under the main site, and the bare path as served
        // on puremac.yashashwi.me.
        source: '/puremac/tableau',
        destination: 'https://tryarras.tech',
        statusCode: 301,
      },
      {
        source: '/tableau',
        destination: 'https://tryarras.tech',
        statusCode: 301,
      },
      {
        source: '/stats',
        destination: 'https://vercel.com/yashashwi-singhanias-projects/website/analytics',
        permanent: false, // Keep false so you can change it later if needed
      },
    ];
  },
};

export default nextConfig;
