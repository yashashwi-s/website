export const dynamic = "force-static";

const ROBOTS = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /fadeo/diagnostics

Sitemap: https://puremac.yashashwi.me/sitemap.xml
`;

export function GET() {
  return new Response(ROBOTS, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
