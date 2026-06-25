/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/stats',
        destination: 'https://vercel.com/yashashwi-singhanias-projects/website/analytics',
        permanent: false, // Keep false so you can change it later if needed
      },
    ];
  },
};

export default nextConfig;
