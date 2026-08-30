export const dynamic = "force-static";

const ROBOTS = `User-agent: *
Allow: /

Sitemap: https://arras.yashashwi.me/sitemap.xml
`;

export function GET() {
  return new Response(ROBOTS, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
