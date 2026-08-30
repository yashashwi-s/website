export const dynamic = "force-static";

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
];

const AI_RULES = AI_CRAWLERS.map(
  (crawler) => `User-agent: ${crawler}\nAllow: /`
).join("\n\n");

const ROBOTS = `# Arras is public to search engines and answer engines.
${AI_RULES}

User-agent: *
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
