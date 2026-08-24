export const dynamic = "force-static";

const PRIVATE_PATHS = `Disallow: /api/
Disallow: /fadeo/diagnostics`;

const AI_CRAWLERS = [
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Applebot",
  "Bytespider",
];

const AI_RULES = AI_CRAWLERS.map(
  (crawler) => `User-agent: ${crawler}\nAllow: /\n${PRIVATE_PATHS}`
).join("\n\n");

const ROBOTS = `# Public product pages are available to search and answer engines.
# Private API and diagnostic endpoints stay excluded from every crawler group.
${AI_RULES}

User-agent: *
Allow: /
${PRIVATE_PATHS}

Sitemap: https://puremac.yashashwi.me/sitemap.xml
`;

export function GET() {
  return new Response(ROBOTS, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
