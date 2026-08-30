/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Arras now has its own canonical host. Keep every legacy path as a
        // direct permanent redirect so crawlers never see duplicate content.
        source: '/arras/:path*',
        destination: 'https://arras.yashashwi.me/:path*',
        permanent: true,
      },
      {
        source: '/puremac/arras/:path*',
        destination: 'https://arras.yashashwi.me/:path*',
        permanent: true,
      },
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
        destination: 'https://arras.yashashwi.me',
        permanent: true,
      },
      {
        source: '/tableau',
        destination: 'https://arras.yashashwi.me',
        permanent: true,
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
