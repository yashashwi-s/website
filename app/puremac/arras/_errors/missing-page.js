const content = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <link rel="icon" href="/puremac/arras/favicon.ico">
  <title>Page not found | Arras</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #f5f1e8; color: #292927; font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif; }
    a { color: inherit; }
    a:focus-visible { outline: 2px solid #8b3f29; outline-offset: 5px; }
    .wrap { width: min(1100px, calc(100% - 40px)); margin-inline: auto; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 25px 0; border-bottom: 1px solid #29292730; }
    .brand { display: inline-flex; gap: 10px; align-items: center; font-size: 25px; font-weight: 650; letter-spacing: -.04em; text-decoration: none; }
    .code { color: #73412e; font-size: 13px; font-weight: 650; letter-spacing: .14em; }
    main { min-height: 65vh; display: grid; grid-template-columns: 1.25fr 1fr; gap: clamp(26px, 7vw, 96px); align-items: center; padding-block: clamp(54px, 9vw, 112px); }
    h1 { font-size: clamp(45px, 7vw, 92px); font-weight: 550; line-height: .99; letter-spacing: -.06em; margin: 0; }
    main p { color: #615b53; margin: 22px 0; max-width: 38ch; }
    .home { display: inline-flex; gap: 25px; align-items: center; padding: 12px 19px; border-radius: 6px; background: #292927; color: #f5f1e8; text-decoration: none; }
    .home:hover { background: #73412e; }
    nav a { display: block; padding: 15px 2px; border-bottom: 1px solid #29292730; text-decoration: none; }
    nav a:first-child { border-top: 1px solid #29292730; }
    nav a:hover strong { color: #73412e; text-decoration: underline; text-underline-offset: 4px; }
    nav span { display: block; color: #615b53; font-size: 14px; }
    @media (max-width: 680px) { main { min-height: 0; grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header class="wrap">
    <a class="brand" href="/"><img src="/puremac/arras/mark.svg" width="34" height="30" alt="">Arras</a>
    <span class="code">404</span>
  </header>
  <main class="wrap">
    <div>
      <h1>Page not found</h1>
      <p>The link may be out of date. Find a guide or head back to the Arras homepage.</p>
      <a class="home" href="/">Back to Arras <span aria-hidden="true">→</span></a>
    </div>
    <nav class="ar-missing-links" aria-label="Find your way around Arras">
      <a href="/guides"><strong>Browse guides</strong><span>Set up photos, collages, or floating references.</span></a>
      <a href="/faq"><strong>Frequently asked questions</strong><span>Find installation and setup answers.</span></a>
      <a href="/support"><strong>Contact support</strong><span>Get help with Arras or report a broken link.</span></a>
    </nav>
  </main>
</body>
</html>`;

export function missingArrasPage() {
  // Explicit status and markup keep recovery links visible without hydration.
  return new Response(content, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}
