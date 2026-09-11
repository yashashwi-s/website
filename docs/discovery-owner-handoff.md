# Discovery handoff — 11 September 2026

## What is now handled

- Corrected metadata, site identity, canonicals, favicon routing, stale claims and first-party Arras answers (first pass).
- Deployment-triggered IndexNow notifications for affected public product pages. No laptop or LLM is needed. The job waits for Vercel success, verifies the public ownership file, and rejects non-200 product URLs before submitting. GitHub Actions availability and repository permissions still apply; notification receipt does not mean indexing.
- Shared product facts for catalog pricing and product compatibility, plus version-pinned release summaries on Arras and Fadeo. Review these summaries at future releases; they are not an automatic release-writing system.
- Fadeo SoftwareApplication identity without invented reviews or promo prices, plus its real workspace screenshot for social previews.
- A public press resource sheet using existing assets and website-first links.
- Neutral discovery prompts and an observation template in `docs/ai-discovery-evaluation.md`.
- Legacy redirects, including tracking parameters, verified. Product layouts checked at 390, 820 and 1440px, image loading and initial keyboard focus checked, and Arras reduced-motion pause/ordinary autoplay tested in an isolated browser.
- Demo size inspected: approximately 2.3 MB. No speculative re-encoding; preserved actual product footage. Written setup instructions are linked beside it. This is a text alternative, not a claimed verbatim transcript.
- Arras issues API returned no non-PR issues in the inspected response. No fabricated recurring-support articles or duplicate guides were published.

## Your remaining tasks, in order

### 1. Search Console and Bing Webmaster Tools

Inspect existing properties first; a verified `yashashwi.me` domain property may cover the subdomains.

- Inspect `https://arras.yashashwi.me/`, `https://puremac.yashashwi.me/`, and `https://puremac.yashashwi.me/fadeo`.
- Check indexing status, Google-selected canonical, crawl/render errors and any current AI-inclusion controls.
- Submit/check `https://arras.yashashwi.me/sitemap.xml` and `https://puremac.yashashwi.me/sitemap.xml`.
- Export search queries and pages for a consistent period; separate branded and non-branded searches.
- Inspect Bing's AI citation report where available. It is not a complete Claude/Gemini report.
- In hosting logs, investigate genuine bot challenges, 403s and 429s. Keep security enabled.
- Share exports/screenshots if you want analysis. No need to send passwords or tokens.

### 2. Correct the existing external references

- DevHunt: https://devhunt.org/tool/photowidgetosx — rename to Arras, point the destination to https://arras.yashashwi.me/, inspect the displayed 2028 launch date.
- Medium: https://medium.com/@yashashwi.singhania.bce23/how-i-bypassed-apples-widgetkit-to-build-a-true-borderless-photo-widget-for-macos-29ae52663b25 — add a dated rename/install-link correction, preserving the historical article.
- Reddit: https://www.reddit.com/r/MacOS/comments/1vcs4m5/ — verify this is your post and its current link before editing. Its contents were not verified live.

Suggested correction: “Update: this project is now called Arras (formerly Tableau / Photo Widget OSX). The official website, current download and installation guidance are at https://arras.yashashwi.me/.”

### 3. Supply original evidence

- Record a current beginner walkthrough: add, resize, position, style and remove a photo.
- Capture the same portrait and panorama in Arras and Apple's Photos widget; include macOS and app versions and explain when Apple's option is sufficient.
- Record one actual Fadeo workflow, including the transition into and out of a meeting.
- For performance claims, record Mac model, OS/app versions, image sizes/count, static versus animated workload, observation duration and raw Activity Monitor results. Keep sensitive desktop information out of screenshots.
- Confirm current permission prompts and screenshots before publishing a permissions article.
- Review the press sheet's asset reuse restrictions before sending it to reviewers. No broad rights to personal photos are implied.

### 4. Measure and review

- Compare qualified website visits and download clicks, not just referrers or GitHub download totals.
- Review existing real-user Speed Insights data before treating a lab check as a performance pass.
- Finish manual 200% browser-zoom and full keyboard/screen-reader checks; automated checks here are a smoke test, not a complete accessibility audit.
- Run the fixed neutral prompts across engines without naming Arras first. Record exact citations; a direct URL-fetch test is separate.
- Seek genuine, relevant Mac coverage using the resource sheet. No bought backlinks or mass promotional posting.

## Explicitly not done

No Search Console/Bing/firewall account settings changed; no external posts edited or outreach sent; no new app build, notarization, invented benchmark, fake review or keyword-only guide. Full price/FAQ deduplication and original case studies remain future editorial/maintenance work, not discovery blockers that justify speculative copy.
