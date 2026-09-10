# Arras website-first review — 10 September 2026

Target: https://arras.yashashwi.me. This is a one-time content and technical review, not an instruction to create another schedule.

## Findings and changes

- The existing reviewer prompt and importer allowed Apple and GitHub sources but excluded the official Arras website. Both now accept the exact official hostname. Lookalike domains remain rejected.
- The page already had an Arras canonical URL, indexable HTML, a sitemap, and explicit crawler access. Baseline live checks passed; this was not a discovered robots.txt block.
- Product FAQ links previously led repeatedly to GitHub. They now point to relevant first-party usage and installation sections; Apple citations and the underlying project/license/release links remain available where appropriate.
- Added a visible usage guide at `/#how-to-use` and an explicit, answer-first product description. The product offer in structured data points to `/#install`; the binary download URL still truthfully identifies GitHub hosting.
- Removed idle-memory, idle-CPU, and two-minute-install estimates from structured data because this run did not measure them.
- Added `npm run check:arras`, a website-only audit that does not require the PureMac site to succeed. It also checks the advertised favicon, installation/usage anchors, and product offer destination.

## Search evidence

All eight existing review queries were searched. Google People Also Ask questions were observed for six of them. No PAA text was captured for “Arras Mac app” or “free open-source Mac desktop photo widget” after bounded waits; this does not establish universal absence. The complete observations and ten reviewed FAQs are in `data/arras-aeo-reviews/2026-09.json`.

For “photo widget without cropping on Mac”, the inspected Google AI Overview called the app **Tableau** and cited the maker’s [older Reddit post](https://www.reddit.com/r/MacOS/comments/1uh79nz/i_built_a_macos_desktop_photo_widget_that_doesnt/). This demonstrates stale naming in that observed result. It is not a ChatGPT or Gemini-app citation test. A brand query also surfaced an unrelated Arras darts app, reinforcing the value of the descriptive name “Arras — Mac photo widget.”

The repository and older community posts surfaced in search results. Their prominence is a plausible contributor to GitHub-directed discovery, but the exact cause of the user’s ChatGPT citation choice is not observable from this run.

## Validation

- Production build passed.
- Local production Arras-only audit passed: canonical identity, metadata, ten FAQs, schema, robots, sitemap, first-party guide anchors, images, and advertised favicon.
- Review data passed importer validation.
- Negative tests rejected an unapproved lookalike source, nine instead of ten FAQs, and a blocked review.
- New usage section inspected in the rendered browser preview.

## Boundaries

This agent fetched and inspected the website. It did not trigger or impersonate OpenAI’s production crawler, submit an indexing request, or force a citation. [OpenAI documents OAI-SearchBot as its search crawler](https://developers.openai.com/api/docs/bots); allowing access is distinct from controlling which source an answer selects.

No independent conversations were run in ChatGPT, Claude, Gemini, or Perplexity. Search Console and server-side authenticated bot logs were not inspected. No indexing or citation improvement is claimed yet. No Reddit posts, GitHub app README, or existing schedules were changed.

The useful next distribution correction, if requested, is to update old maker-controlled posts and the app README introduction to identify Arras’s current name and official website. That work is separate from this website deployment.
