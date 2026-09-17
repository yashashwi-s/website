# Deployed insights-driven improvements

Source commit: 4e57574. Lighthouse 13.4.1, normal mobile throttling and desktop preset, sequential cold-cache runs. All six reports passed exactly 3/3 agentic checks and scored 100 in accessibility, best practices, SEO, and agentic browsing.

| Site | Mobile performance | Desktop performance | Agentic checks, both devices |
| --- | ---: | ---: | --- |
| yashashwi.me | 97 | 100 | 3/3 |
| Arras | 100 | 100 | 3/3 |
| PureMac | 100 | 100 | 3/3 |

## Useful insights implemented

- Arras startup JavaScript and hydration: static content, release information, tables, installation copy, and FAQs now render outside the client boundary. Only video controls hydrate as the Arras demo component.
- Arras layout/painting: distant sections use content visibility while remaining present in rendered HTML. Anchor navigation is retained.
- Shared font dependency chain: Nunito and JetBrains Mono are scoped to Fadeo instead of every product page. Arras and the catalog already use system typography, so their styling remains consistent and their unused inherited font requests are removed.
- Responsive image delivery: additional 480px/672px image candidates prevent small screens rounding the demo poster up to 750px, retaining device pixel density and image quality.
- PureMac layout/painting: distant editorial and FAQ sections defer rendering.

## Arras mobile comparison

A fresh baseline before these changes scored 98; the earlier 85 was a slower single lab run. Compare the fresh baseline rather than claiming the entire 85-to-100 difference was caused by code.

| Metric | Fresh baseline | Updated live |
| --- | ---: | ---: |
| Performance | 98 | 100 |
| LCP | 1.34 s | 1.06 s |
| Total blocking time | 162.5 ms | 13.5 ms |
| Main-thread work | 1,633 ms | 1,213 ms |
| Script transfer | 174,329 bytes | 167,708 bytes |
| Font transfer | 21,452 bytes | 0 bytes |
| Poster transfer | 19,708 bytes | 17,323 bytes |
| CLS | 0 | 0 |

These are single lab measurements and timing varies, while the removed font requests, smaller script payload, and smaller image candidate are direct resource reductions.

## Insights left unchanged

Small residual unused JavaScript and legacy polyfills belong primarily to the shared Next/React runtime. Removing browser support solely to clear that warning would be a broader compatibility change. The image audit also flags high-density images relative to CSS dimensions; the revised candidates retain sharpness rather than reducing every device to a one-pixel-density image. Editable media filenames keep a bounded cache lifetime instead of being cached indefinitely.

## Validation

Production build, Arras product metadata, routing/cache assertions, whitespace verification, local and deployed AEO checks passed. Browser checks confirmed mobile layout, video play/pause, and installation-anchor navigation. All six deployed Lighthouse runs completed and the explicit 3/3 gate passed. Fadeo's existing fonts were preserved in its own layout.

Raw reports: /private/tmp/portfolio-insights-deployed. Fresh Arras baseline: /private/tmp/arras-before-insights.json. Per-check evidence is recorded in summary.json.
