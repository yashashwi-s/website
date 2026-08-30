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
        // Arras now has its own canonical host. Match the old PureMac URL by
        // host so the same /arras pathname can still be served elsewhere.
        source: '/arras',
        has: [
          {
            type: 'host',
            value: 'puremac.yashashwi.me',
          },
        ],
        destination: 'https://arras.yashashwi.me',
        permanent: true,
      },
      {
        source: '/puremac/arras',
        has: [
          {
            type: 'host',
            value: 'puremac.yashashwi.me',
          },
        ],
        destination: 'https://arras.yashashwi.me',
        permanent: true,
      },
      {
        source: '/arras',
        has: [
          {
            type: 'host',
            value: 'arras.yashashwi.me',
          },
        ],
        destination: 'https://arras.yashashwi.me',
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
        destination: '/puremac/arras',
        permanent: true,
      },
      {
        source: '/tableau',
        destination: '/arras',
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
