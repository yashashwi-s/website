# Website-first discovery: 60 applicable actions

Audit date: 11 September 2026. Scope: Arras, PureMac and Fadeo; GitHub stays public and useful. This is a prioritized backlog, not a claim that all 60 items are missing or that completing them guarantees citations.

## Findings and strategy

Make the website the best place to understand, evaluate and start using each product. Keep GitHub authoritative for source code, issue discussion, licenses and release artifacts. Give both places distinct jobs rather than attempting to suppress GitHub.

Live HTTP inspection found PureMac's fallback favicon returned 404; PureMac and Fadeo emitted the portfolio's Twitter title. Source inspection found stale performance figures in PureMac's llms.txt, missing publisher/catalog identity on the catalog itself, an absolute Arras title contradicted by optional fixed-frame rotation, and useful feature limitations absent from the website. Public pages already have working canonical URLs and crawlable text. An exploratory search surfaced the Arras README; this is not a controlled ranking study and does not establish that the website is unindexed.

First-pass implementation adds the fixes and answers listed below. No external posts, directory edits, account changes or new recurring jobs are included. Unrelated local Fadeo edits remain untouched.

Status: **Implemented** = this implementation; **Maintain** = already present, retain/check; **Next** = useful follow-up; **Account** = requires authenticated account data or controls; **Owner** = original evidence, editorial approval or outreach handled with the owner. P0 = correctness/access, P1 = next growth work, P2 = conditional improvement.

## Access, indexing and reliability

1. **P0 · Implemented — Repair PureMac's fallback favicon.** Route `/favicon.ico` to the new SVG, removing the verified 404 and keeping the approved brand recognizable.
2. **P0 · Implemented — Add a discovery regression check.** Check canonical URLs, social titles, key answer anchors, catalog identity and fallback icon responses together after changes.
3. **P0 · Maintain — Keep each product self-canonical.** Arras points to its own domain; Fadeo to its PureMac page. A canonical is a signal, not a command to cite it.
4. **P0 · Next — Expand the legacy-URL test matrix.** Test old Tableau/Arras paths, trailing slashes and query strings for one-hop permanent redirects; retain useful tracking parameters.
5. **P0 · Account — Verify all product properties in Google Search Console.** A domain property may already cover the subdomains; inspect before creating redundant properties.
6. **P0 · Account — Inspect Google's selected canonical for each product.** Compare it with the declared URL and inspect rendered content; this reveals issues that public search cannot establish.
7. **P0 · Account — Submit the existing Arras and PureMac sitemaps.** Check processing status and excluded URLs rather than repeatedly submitting unchanged pages.
8. **P0 · Account — Verify/import the properties in Bing Webmaster Tools.** Inspect crawl errors and indexed URLs; do not assume Google coverage implies Bing coverage.
9. **P0 · Maintain — Keep Claude's search and user-fetch agents allowed.** Existing robots rules already name Claude-SearchBot and Claude-User; adding them again is unnecessary.
10. **P0 · Account — Check hosting firewall logs for genuine crawler failures.** Investigate 403/429/challenge responses; do not disable security globally or treat a spoofed user-agent request as proof.
11. **P1 · Next — Add change-driven IndexNow notifications.** Use an ownership key and notify supported engines only when public URLs materially change; it is not a Google indexing submission.
12. **P0 · Implemented — Use honest sitemap modification dates.** Update the changed PureMac catalog and Arras page, leaving unrelated page dates alone.

Canonical guidance: [Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). Sitemap guidance: [Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). Agent roles: [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler). Change notifications: [IndexNow](https://www.indexnow.org/documentation).

## Clear product identity and search presentation

13. **P0 · Implemented — Give PureMac its own social title and description.** Stop sharing the unrelated portfolio identity when its URL is pasted.
14. **P0 · Implemented — Give Fadeo its own social title and description.** Describe workflow audio, not the developer's portfolio.
15. **P0 · Implemented — Remove “never crops” from Arras's title.** The new title names free Mac photo widgets and original ratios without contradicting optional fixed-frame behavior.
16. **P1 · Implemented — Describe the PureMac publisher in structured data.** Use the same stable organization ID already referenced by Arras.
17. **P1 · Implemented — Connect PureMac's founder identity.** Link the catalog's publisher to the existing developer website, without inventing credentials or endorsements.
18. **P1 · Implemented — Describe the catalog as a collection of actual product pages.** Its ItemList points to Arras and Fadeo websites, not GitHub download URLs.
19. **P1 · Implemented — Connect the approved logo to publisher identity.** Keep a publicly fetchable, consistent logo URL on both catalog and Arras publisher data.
20. **P1 · Maintain — Keep product-category wording near the main heading.** “Native Mac photo widget” and “workflow audio” disambiguate names without keyword stuffing.
21. **P1 · Next — Consolidate repeated product facts into shared data.** Generate visible compatibility/price summaries and machine-readable summaries from one maintained source to prevent drift.
22. **P1 · Next — Add accurate Fadeo SoftwareApplication data.** First reconcile current license/price and promo behavior, then match visible content; never invent reviews for rich-result eligibility.
23. **P2 · Next — Audit preview images per product.** Reuse suitable existing product artwork rather than inherited portfolio imagery; new designed social cards need a separate asset brief.
24. **P1 · Account — Compare title changes against actual query impressions and clicks.** Do not rotate titles daily or enforce a mythical exact character count.

Presentation references: [titles](https://developers.google.com/search/docs/appearance/title-link), [descriptions](https://developers.google.com/search/docs/appearance/snippet), [software structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app). Schema clarifies entities; it does not guarantee special results or AI preference.

## Give answer engines something useful to cite on your website

25. **P0 · Implemented — Remove stale Arras RAM and download-size figures from PureMac's summary.** Unqualified measurements become misleading as versions and workloads change.
26. **P0 · Implemented — Explain dynamic versus fixed photo rotation.** The website now states when original ratios are preserved and when cropping is intentional.
27. **P1 · Implemented — Explain precise keyboard placement.** Document Command's snap override and Shift's axis constraint at a linkable answer.
28. **P1 · Implemented — Explain behind-icons locking.** Tell users why dragging fails in that depth and where to change it.
29. **P1 · Implemented — Document Shortcuts coverage.** State the shipped categories and action count, without guessing exact action names or promising unshipped automation.
30. **P1 · Implemented — Document PDF-page and screen-region imports.** Clarify that these are opt-in commands, not always-on screen collection.
31. **P0 · Implemented — Publish capture-privacy limitations.** Mention AirPlay/HDMI and browser-call limitations so users can make an informed choice.
32. **P1 · Implemented — Explain layout backup boundaries.** Distinguish .arras layouts from original-photo archives and avoid implying automatic history exists.
33. **P1 · Implemented — Add stable anchors for these answers.** Individual questions now have shareable website destinations instead of requiring a repository link.
34. **P0 · Implemented — Cite a release-pinned feature source.** Mark the expanded answers as checked against v2.4.6, not as newly performed hands-on tests.
35. **P0 · Implemented — Align installation schema with visible safety guidance.** Stop presenting quarantine removal as an unconditional required step.
36. **P1 · Implemented — Link deeper answers from the existing machine-readable navigation.** Keep llms.txt accurate, but treat it as optional documentation rather than a ranking mechanism.

Product evidence: [Arras v2.4.6 feature contract](https://github.com/yashashwi-s/Arras/blob/v2.4.6/FEATURES.md). The owner controls this source. Website copies are concise product documentation, not independent validation.

## Original content and useful entry points

37. **P1 · Owner — Publish a reproducible resource-usage test.** Record Mac model, macOS/app versions, image count and sizes, animation state, sample duration and raw results; only then publish RAM/CPU claims.
38. **P1 · Owner — Record a beginner walkthrough with actual current UI.** Cover adding, resizing, arranging and removing a photo; put the website URL in the video description.
39. **P1 · Next — Add a text companion to the walkthrough.** Describe the demonstrated steps and limitations so watching a video is optional; avoid a fake transcript of unreviewed footage.
40. **P1 · Owner — Create a genuinely tested Photos-widget comparison.** Show the same portrait and panorama in both tools; disclose macOS version and when Apple's option is sufficient.
41. **P1 · Owner — Publish a Fadeo workflow example from a real setup.** Explain a coding-to-meeting transition, rules, expected result and edge cases rather than an abstract feature list.
42. **P1 · Next — Add reader-friendly release highlights on the website.** Explain what changed and why, linking the corresponding GitHub release; do not fabricate release dates or republish development notes as shipped.
43. **P2 · Owner — Publish permission explanations with verified screenshots.** Distinguish optional Screen Recording from ordinary image widgets and verify every current permission prompt.
44. **P1 · Next — Turn recurring support questions into troubleshooting answers.** Start with real issue patterns and tested resolutions; do not manufacture questions to hit a content quota.
45. **P2 · Owner — Build a small reusable press/resource kit.** Offer approved logos, real screenshots, accurate one-line descriptions and website-first links for reviewers.
46. **P2 · Owner — Explain the native architecture in an original case study.** Use actual engineering decisions, diagrams and tradeoffs; link both product and code with distinct purposes.
47. **P2 · Next — Create standalone guides only for distinct reader tasks.** A guide must add screenshots, tested instructions or examples beyond the homepage FAQ; no near-duplicate keyword pages.
48. **P1 · Maintain — Keep known limits and author attribution visible.** Honest documentation makes the website a stronger evaluation source than an unqualified sales pitch.

Editorial standard: [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Video-specific discoverability: [Google video guidance](https://developers.google.com/search/docs/appearance/video). These are proposed Arras/Fadeo editorial projects, not guaranteed ranking tactics.

## Distribution, measurement and experience

49. **P1 · Owner — Update the old DevHunt listing.** Rename PhotoWidgetOSX to Arras and use the product website destination. Check its displayed 2028 launch date in the dashboard.
50. **P1 · Owner — Add a dated correction to the Medium case study.** Retain the historical story, but identify Arras and point installation readers to the current website guide.
51. **P1 · Owner — Verify and correct old Reddit links.** Check authorship and post editability first; do not create duplicate promotional replies. The previously reported post was not verified live.
52. **P1 · Maintain — Keep the GitHub README's prominent website links.** Already added; retain source/build instructions and repository discoverability rather than hiding them.
53. **P1 · Owner — Pitch relevant Mac reviewers with one specific use case.** Provide a current build, accurate limitations and website link. Seek genuine coverage, not paid link packages or mass unsolicited outreach.
54. **P1 · Account — Track non-brand search queries separately from brand queries.** “Photo widget for Mac” growth answers a different question than searches for “Arras.”
55. **P1 · Account — Inspect Bing's AI Performance report where available.** Record cited URLs and grounding queries; its coverage is Microsoft and participating experiences, not all Claude/Gemini activity.
56. **P1 · Next — Keep a repeatable neutral-prompt evaluation set.** Record engine, date, web-search state, exact prompt, cited URL and recommendation position; don't seed Arras in discovery prompts.
57. **P1 · Account — Measure website-to-download conversion separately from referrals.** Existing analytics may provide some data; assess privacy and plan limits before adding events. Visits are not installations.
58. **P1 · Account — Review real-user Core Web Vitals on mobile and desktop.** Use existing Speed Insights/Search Console data before optimizing guessed bottlenecks; missing field data is not a pass.
59. **P1 · Next — Audit media transfer size and reduced-motion behavior.** Keep the requested autoplay experience where appropriate, while testing a reduced-motion alternative and avoiding oversized assets.
60. **P1 · Next — Test keyboard navigation, zoom and mobile overflow on every product page.** Fix concrete usability failures; accessibility helps visitors use the product information, not through a guaranteed ranking bonus.

Measurement references: [Bing AI Performance announcement](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).

## What not to spend time on

No repeated “crawl my website” chats as an indexing strategy; no fake statistics, fabricated reviews, hidden keyword blocks, irrelevant FAQ quotas, bought backlink bundles, prompt-injection text, mass directory spam, or turning off GitHub indexing. Keep useful FAQs, but do not sell FAQ schema as a guaranteed rich-result or citation shortcut. Do not equate crawl permission, an HTTP 200, search indexing, recommendation, citation and actual visitor conversion: they are different observations.

Google's [AI-features guidance](https://developers.google.com/search/docs/appearance/ai-features) says ordinary search foundations apply and special AI files/markup are not required. Its newer [generative-AI guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) should also be checked alongside actual Search Console controls because documentation and product settings evolve. We have not inspected this account's controls and do not claim its current eligibility setting is enabled.

## Next execution order

First validate and publish this correctness/documentation pass. Then inspect Search Console/Bing properties and firewall evidence (5–10, 24, 54–58). Next build a real demonstration/comparison with original evidence (37–41) and fix owner-controlled external references (49–51). Add change-driven notifications and shared product data after confirming the existing automation setup, rather than creating duplicate schedules.
