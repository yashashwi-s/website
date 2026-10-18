# Arras SEO audit — 15 October 2026

Implemented and verified against a local production build with the real
portfolio, Arras and PureMac Host headers. These changes have not been deployed;
the checks establish crawlability and metadata correctness, not Google’s actual
indexing status or selected canonical in Search Console.

## Indexing and canonical URLs

- `/`, `/faq`, `/security` and the existing `/security-privacy` details page
  return HTTP 200 for Googlebot without blocking robots metadata or
  `X-Robots-Tag` headers. Each has one self-referencing canonical.
- Canonical, OpenGraph URL, OpenGraph/Twitter image and website JSON-LD URLs use
  `https://arras.yashashwi.me`. SoftwareApplication identity, offer and media
  URLs use the same origin. GitHub release, source and license links and the
  developer’s identity retain their appropriate external URLs.
- `/robots.txt` permits public routes for every configured crawler and excludes
  only `/api/`. Its sitemap link points to the Arras HTTPS origin.
- `/sitemap.xml` includes every canonical public route exactly once, with no
  redirected `/faqs` or legacy page paths. The existing privacy details page
  remains included because it is public and linked from Security.
- `/faqs` permanently redirects to `/faq`. Both legacy `/arras` and
  `/puremac/arras` page prefixes redirect directly to the Arras origin using
  **301**, including trailing slashes and preserved query strings. Old FAQ
  paths land directly on `/faq`. Legacy Tableau page redirects remain intact.
- Public media retains its existing `/puremac/` asset paths without extra
  redirects. Arras, Fadeo and portfolio trailing-slash normalization still works.

Google documents redirects, canonical tags and sitemap inclusion as compatible
canonicalization signals, and recommends linking directly to canonical URLs:
[canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
and [permanent redirect guidance](https://developers.google.com/search/docs/crawling-indexing/301-redirects).

## Public feature scope and portfolio links

The official [published release](https://github.com/yashashwi-s/Arras/releases/tag/v2.4.9)
was verified as v2.4.9, published 23 September 2026. Its tagged FEATURES,
CHANGELOG, product metadata and relevant controls were inspected from the local
Arras Git repository. Development-branch 2.5.0 marketing was removed from public
product copy and structured data.

The landing page, FAQ, portfolio card, AI summaries and press copy cover:
uncropped true-aspect-ratio desktop photos; a single photo without extra Apple
Photos albums; Polaroid and Gallery frames; transparent PNG and animated
GIF/APNG widgets; floating screenshot/PDF-page reference overlays; and
multi-photo Space slideshows. Dynamic sizing preserves proportions; Fixed
sizing deliberately crops. No linked-album sync, editable collage, video,
saved-setup, appearance-copy or reference-editing feature is advertised.

Public 2.4.9 download facts describe Apple Silicon artifacts, Intel source
builds and disabled public-app telemetry. The existing telemetry API is retained,
and private-test disclosure is identified separately. Stable-tag metadata
synchronization preserves reviewed website URLs and requires a content review
before a different release changes the feature scope.

Arras project, navigation, studio and footer links across the portfolio now go
directly to `https://arras.yashashwi.me`, with descriptive anchor text. Fadeo’s
destination remains `https://puremac.yashashwi.me/fadeo`. All 23 external portfolio
links were verified as standard anchors with hrefs and text after hydration;
the initial Googlebot HTML also contains the product links.

## Remaining reference audit

A case-insensitive search covered app, component, data, library, public, script,
documentation and workflow sources, plus repository configuration and README.

- **PureMac:** retained for its catalog, Fadeo, implementation folders, static
  media URLs, legacy redirect coverage and historical audit records. Active
  portfolio links no longer route Arras traffic through the catalog.
- **Tableau:** retained in the unchanged macOS bundle identifier, historical
  names, rename explanations, old URL redirects, historical search prompts and
  unused legacy media (`public/puremac/tableau/` and `tableau-icon.png`). It is
  removed from current marketing keywords.
- **Homebrew:** no current public installation claim remains. Occurrences are
  in legacy-metadata migration, regression guards/tests and historical docs.
- **noindex:** the only explicit source directive is on Fadeo’s diagnostics
  utility. It is intentional and outside the Arras public pages; Next.js also
  adds its normal noindex to missing pages.

## Verification

- `npm run build -- --webpack` passed on the final source. Default Turbopack was
  blocked by this environment’s local-worker port restriction; no build-script
  change was made. Existing Edge Runtime deprecation warnings remain.
- `npm run check:arras` passed against the built site: 19 matching visible/JSON-LD
  FAQ answers, 55-character title, 156-character description, Googlebot HTML,
  canonical/social/schema origins, robots, sitemap and portfolio anchors.
- Exact 301 checks passed for **102** legacy URL variants, with one-hop HTTP 200
  destinations. Normal Arras/Fadeo slash redirects also passed without loops.
- `npm run check:aeo` passed for the full PureMac/Fadeo/Arras set. The existing
  direct-route CI preview shape also passed.
- `node scripts/sync-arras-product.mjs --check` passed against the public stable
  tag. All 11 product tests and routing/media-cache checks passed.
- All 6 non-Redis telemetry tests passed. Four Redis integration tests skipped
  because an isolated test database was not configured.
- Desktop and mobile browser review found no horizontal overflow, broken
  landing images or portfolio console errors. FAQ links and disclosure controls
  work. `git diff --check` passed.

Run the new checks against a local production server with:

```sh
ARRAS_REQUEST_BASE_URL=http://127.0.0.1:3000 npm run check:arras-seo
```

The same checks are included in the existing `check:arras` command.


## 18 October 2026 — unpublished 2.5.0 launch preparation

This section supersedes the earlier local target described above. Public app and
website downloads are still 2.4.9. tryarras.tech is the selected primary host for
the prepared 2.5.0 launch. The old Arras page URLs and www host have matching 301
redirects; API compatibility and physical media paths are preserved. `/faqs` and
`/security-privacy` redirect directly to `/faq` and `/security`; only canonical
routes are in the sitemap. Canonicals/social metadata, schema, robots, llms,
portfolio links and new app telemetry configuration use the new domain.

The final site has the actual 10.4-second desktop film and native sample-only
feature screenshots, including Preferences/Privacy. Its optimized movie is about
1.8 MB. Versioned poster/movie names avoid stale image caches. Ten visible FAQs
match their JSON-LD answers. Existing useful comparison/media guidance remains
outside the ten-question schema. The AEO payload is validated, held for owner
approval, and sourced only to Apple/GitHub. The exact Google questions and AI
citation observations are consolidated in `arras-aeo-roadmap.md`.

Verification: production build; 32 product/download/calendar tests; 14 telemetry
handler and Redis checks with no skipped integrations; 34 personal-monitor tests;
rendered SEO/AEO on Arras and PureMac/Fadeo; 117 exact legacy redirects; media,
query-preservation and trailing-slash checks. Desktop/mobile browser review showed
no horizontal overflow, no broken loaded images and no console errors. Movie
playback reports 10.4 seconds with no media error. The Preferences/Privacy images
are real native windows; original sample data was restored after capture.

Final local Lighthouse: desktop 99 performance, mobile 97; accessibility, best
practices, SEO and agentic browsing 100 on both. Both measured zero layout shift.
An earlier mobile pass scored 86 while other work was active; the cold local
reports are observations, not a production performance promise. Schema.org code
validation reports zero errors/warnings. Google accepts software/video metadata;
its optional aggregateRating warning is retained because no verified ratings are
available. An unsupported codeRepository property on SoftwareApplication was
removed rather than inventing an additional claim.

The current public 2.4.9 pages, FAQ schema and both control endpoints were checked
read-only. No 2.5.0 workflow, commit or deployment has occurred. After publication
approval, confirm the resulting main commit in Vercel and rerun the production
version of these checks. Evidence, actual screenshots and full Lighthouse reports
are in `/tmp/arras-launch-prep-20261018/`.
