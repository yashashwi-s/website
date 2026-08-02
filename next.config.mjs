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
