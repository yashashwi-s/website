# Portfolio and PureMac websites

This Next.js repository serves [yashashwi.me](https://yashashwi.me),
[cv.yashashwi.me](https://cv.yashashwi.me),
[puremac.yashashwi.me](https://puremac.yashashwi.me), and the
[Arras product website](https://tryarras.tech). Host routing is defined in
`proxy.js`; legacy URL redirects are in `next.config.mjs`.

## Local development

```sh
npm ci
npm run dev
```

Use `http://localhost:3000` for the portfolio and
`http://arras.localhost:3000` for Arras. The project uses Next.js App Router,
React, Tailwind CSS, Framer Motion and ordinary CSS. Read the bundled Next.js
documentation before changing framework behavior, as directed by `AGENTS.md`.

## Content and ownership

- `data/personal.js`, `data/projects.js`, `data/achievements.js` and `data/skills.js`
  contain portfolio content.
- `data/resume.tex` feeds the CV page. `lib/cv-downloads.mjs` refreshes Arras's
  public release-download milestone weekly, rounded down to hundreds, with a
  verified 700+ fallback. Downloads are not active users or successful installs.
  The downloadable PDF is a separate artifact and must be reviewed when updated.
- `data/arras-product.json` owns the Arras version, platform requirements and
  release links. Its shared readers keep product pages and metadata consistent.
- `app/puremac/arras/` contains the Arras landing page, FAQs, policy pages,
  structured data, sitemap and `llms.txt` route. FAQ content is in
  `app/puremac/arras-faqs.json`. Canonical public routes are `/`, `/faq` and `/security` on `tryarras.tech`;
  `/faqs` and `/security-privacy` are compatibility 301 aliases.
  Portfolio Arras links use this host directly, with descriptive anchor text.
- `app/api/telemetry/v1/route.js` and `lib/arras-telemetry-*.mjs` implement the
  telemetry endpoint. The [app's SECURITY.md](https://github.com/yashashwi-s/Arras/blob/main/SECURITY.md)
  owns the protocol and operations guidance. Keep web analytics and app statistics
  separate. Credentials belong in hosting configuration, never source or assets.

## Arras 2.5.0 release and domains

**tryarras.tech** is the primary Arras website. Old `arras.yashashwi.me` pages
permanently redirect to their matching new URLs. `/faq` and `/security` are the
canonical support pages; legacy aliases remain compatible. Both domains retain
a direct `/api/telemetry/v1` endpoint for installed copies, without a redirect.

The site describes the Developer ID signed, notarized **2.5.0** release for Apple
Silicon and Intel on macOS 14+. Its film and feature screenshots are real native
Arras captures using sample media. Release facts, download destinations, FAQs,
structured data and privacy disclosure must stay consistent with GitHub Releases
and the app’s feature/security contracts.

This is a shared Vercel project. Preserve the published portfolio, CV and PureMac
pages, API routes and environment configuration during Arras deployments. Unrelated
local Fadeo edits are outside this release. App statistics and anonymous website
counters use separate namespaces; never join visitors to installation UUIDs.

## Verification

```sh
npm run build
npm run check:arras-product
node --test scripts/arras-product.test.mjs
npm run test:arras-telemetry
```

The Redis integration test requires `ARRAS_TELEMETRY_TEST_REDIS_URL` pointing to
an isolated loopback Redis instance; it skips when unset and refuses remote
hosts. It must never run against production. To check rendered Arras routes
against a local production server:

```sh
ARRAS_REQUEST_BASE_URL=http://127.0.0.1:3000 \
ARRAS_REQUEST_HOST=tryarras.tech \
node scripts/check-puremac-aeo.mjs --arras-only

ARRAS_REQUEST_BASE_URL=http://127.0.0.1:3000 npm run check:arras-seo
```

The SEO check inspects Googlebot HTML and response headers, canonical and social
URLs, SoftwareApplication JSON-LD, robots rules, every canonical sitemap route,
and portfolio anchors. It also checks exact 301 redirects for legacy Arras URLs,
including queries and trailing slashes. `npm run check:arras` includes these
checks. Metadata synchronization reads the published release tag and keeps a
different release pending website-content review; development-branch metadata
must not silently change the public feature scope.

Check desktop and mobile layouts, keyboard navigation, download links, policy
redirects and Lighthouse before publication. Structured-data validation alone
does not prove rankings, indexing, accessibility or a complete user journey.
Keep development recordings and one-off audit artifacts outside this repository.

### Arras 2.5.0 download attribution

Arras download buttons use `/download` on either Arras domain, backed by
`app/puremac/arras/download/route.js`. A fixed, uncached 302 points to the official
latest GitHub DMG; user input cannot select its destination. Plain anchors keep
working without JavaScript. The shared Arras navigation captures the tab's first
`utm_source` or referring hostname in session storage, including entry through
FAQ/Security pages, and enhances the download URL with `ref`.

Filter Vercel Runtime Logs for the structured event `arras_download_request`.
Fields are `source`, `referrer` (hostname/short label), `agent` (coarse category),
and `userInitiated` (the browser's optional fetch hint). Full referring paths,
query strings, raw user agents, IPs and visitor IDs are not in this custom event.
HEAD/prefetch requests are not logged; recognized automated clients are marked.
Repeated requests and unrecognized bots remain possible. These logs are bounded
by the provider's retention and are not a permanent counter of humans, downloads
or installs. These logs add no cookies or app-ID joins. Optional daily counters
use separate anonymous Redis buckets as described below.
GitHub links explicitly send only the origin. Star badges are server-rendered
from GitHub's API, revalidated hourly, and omit the count if unavailable.

Run `node --test scripts/arras-download.test.mjs scripts/arras-product.test.mjs`
and `npm run check:arras`. Verify the published app release before changing
release-specific website claims.


### Launch state — 18 October 2026

The owner selected **tryarras.tech as the primary domain going forward**. The
launch redirects old Arras page URLs permanently to matching new paths,
including one-hop FAQ/privacy aliases and preserved queries. Canonicals, social
metadata, robots, sitemap, llms, portfolio links and new app telemetry configuration
use tryarras.tech. `/api/telemetry/v1` stays directly available on both hosts for
existing app copies; static media paths remain compatible. The owner approved
the paired app/site release and primary-domain cutover on 18 October 2026.

The landing page includes the actual 10.4-second desktop film and real native
sample-only collage, slideshow/layer, appearance, Preferences and Privacy captures.
Versioned film/poster filenames avoid stale optimized-image caches. Individual
screenshots can be enlarged. No fabricated interface or personal media is used.

Daily website counters are enabled with `ARRAS_WEBSITE_ANALYTICS_ENABLED=1` in the reviewed
**Production** environment. They reuse the existing Redis connection setting,
with separate `arras:website:v1:production` keys. Leave Preview disabled. The
default `ARRAS_WEBSITE_ANALYTICS_MONTHLY_LIMIT` is 5000 admitted write attempts;
this is a retention/write bound, not a provider billing guarantee. The separate
Redis disabled key is an emergency stop. Errors do not block pages or downloads.
Only anonymous day totals, short referring-host/source labels and five sanitized
UTM labels are kept, with absolute 90-day expiry and bounded cardinality. No raw
visits, IPs, raw user agents, cookies or visitor IDs are added. Address/UUID-shaped
labels are discarded. Browser session attribution is not joined to app UUIDs.

The personal monitor archives Vercel daily referrer/path aggregates privately.
Vercel rejected UTM queries with a Plus/Enterprise requirement; no upgrade was
purchased. New first-party UTM counters start when enabled at launch, without
invented historical backfill. Collector failure, gaps and shared-project Vercel
scope are visible in the three-column `~/bss.sh` dashboard.

`npm run test:arras-metadata` verifies product/download contracts and the review
calendar. CI retains main's deterministic/live audits and adds isolated Redis 8
telemetry tests. The AEO prompt/apply workflows were removed from deployed main
on 29 September; their restoration uses the 17th of each month and a safe
changed-base publication check. October issue #5 is now closed after the validated
apply workflow committed its evidence archive and Vercel deployed the resulting
main commit. Its ten launch answers needed no further changes. See
`docs/arras-aeo-roadmap.md` for exact questions, citations, workflow evidence and limits.

The normal `~/bss.sh` launcher uses system Python and its existing Keychain
identity. Launch verification read the new first-party buckets successfully and
all three dashboard sources reported OK. Do not invoke the installed collector
with another Python and mistake that process's denied credential access for a
production storage failure. First-party statistics start at launch; historical
Vercel project totals remain separately labeled and cannot be backfilled with UTM data.
