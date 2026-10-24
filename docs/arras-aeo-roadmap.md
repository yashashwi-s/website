# Arras AEO operating plan

Last updated: 2026-10-24

This plan converts the public AEO playbook into work that is relevant and supportable for Arras. It deliberately excludes invented testimonials, keyword-density targets, fake expertise, and unverified industry statistics.

## Shipped foundation

- Answer-first Arras summary immediately below the H1.
- Ten useful FAQs informed by observed Google questions and verified release evidence; native disclosure controls keep each answer accessible.
- Two-paragraph answers where the question needs context, with Apple and project documentation links beneath the answer capsule.
- Matching FAQPage, SoftwareApplication, VideoObject, HowTo, WebPage, WebSite and Person structured data.
- A source-backed explanation of Arras versus the macOS Photos widget.
- Live GitHub release links and aggregate release-download data.
- Visible content verification date plus sitemap `lastModified` values.
- Explicit access for current OpenAI, Anthropic, Perplexity, Google, Common Crawl, and Apple crawler tokens while API and diagnostic routes remain excluded.
- A concise, Arras-first `/llms.txt` file.
- An executable `npm run check:aeo` production audit.

## Monthly review

Run once per month. The prepared GitHub issue calendar uses the 17th in Asia/Kolkata. A configured Codex evidence pass can submit the review; the issue remains a durable prompt and notification fallback:

1. Run `npm run check:aeo` against production.
2. Verify current Google People Also Ask questions for the core Arras query set.
3. Test whether ChatGPT, Perplexity, Gemini, and Google AI answers cite or accurately describe Arras for those queries.
4. Record the exact query, result, citation URL, and observation date; do not infer a citation that is not visible.
5. Check GitHub releases and the Arras README for changed version, compatibility, size, features, or installation steps.
6. Update content only when a source, user question, release, or observable result warrants it.
7. Rebuild, rerun the audit, and deploy only validated changes.

### GitHub handoff

The repository owns the long-term schedule, so this process does not depend on a Codex, ChatGPT, Claude, or Gemini subscription:

1. The first full evidence round was run, validated, and deployed on August 28, 2026.
2. Starting September 17, review dates fall on the 17th of each month. The restored GitHub schedule uses the same date rather than the older first-Monday calendar. A manual dispatch reviews its actual current date. Local Codex execution still depends on that task being configured and available.
3. GitHub also creates an assigned `arras-aeo` issue containing the complete prompt. The issue is an audit trail and fallback; no manual paste is required when the Codex task completes normally.
4. Codex posts the JSON response to that issue as a comment beginning with `/submit-aeo-review` after locally validating the response contract.
5. GitHub accepts the command only on the scheduled Arras issue and only from an owner, member, or collaborator. It validates all fields and source domains before treating the result as data.
6. A valid response on the restored workflow updates the ten Arras FAQs, archives the evidence under `data/arras-aeo-reviews/`, refreshes the verification date, builds the site, runs the rendered AEO audit, commits to `main`, and closes the issue. The normal hosting integration then deploys the commit.
7. A blocked, malformed, stale, or failed response leaves production unchanged and links the failed workflow run from the issue.

GitHub email delivery depends on the repository owner's notification settings. Assignment still creates a GitHub notification; enable email for participating or assigned issue activity when an email copy is wanted.

Core query set:

- macOS desktop photo widget
- add photo widgets to MacBook desktop
- put a specific photo on a widget on Mac
- photo widget without cropping on Mac
- free open-source Mac desktop photo widget
- Arras Mac app
- Tableau photo widget Mac
- Photo Widget OSX

## Quarterly deep review

Run in January, April, July, and October:

1. Perform the monthly review.
2. Recheck every outbound source and download link.
3. Validate rendered JSON-LD and metadata with current Google and Schema.org tooling.
4. Review Search Console and available analytics for impressions, clicks, referring domains, AI referrals, and top queries. Report “not configured” when access is unavailable.
5. Compare page claims with the shipped app and GitHub documentation.
6. Refresh the visible verification date only when the page was substantively checked.
7. Review whether a new sourced guide, use case, or comparison page would answer an observed search gap.

## 90-day content queue

Publish only when the product documentation and real user questions provide enough evidence.

- Month 1: establish the baseline for the core query set and collect real Search Console language.
- Month 2: write one Arras installation and Gatekeeper troubleshooting guide if support questions justify a dedicated page.
- Month 3: write one photo-widget workflow guide based on real Arras issues or discussions; include screenshots and measured steps.

Each new page must have one H1, a direct answer after question headings, sources placed after the answer capsule, a visible update date, appropriate schema, and a passing production audit.


## 18 October 2026 launch evidence review

At the start of this review, production on both Arras domains served 2.4.9. The new domain then
has its own canonical links; the old domain remains active independently. The
local release prepares 2.5.0 and selects tryarras.tech as primary, with matching
old-page redirects and compatible API/media paths. Public GitHub's latest release
is v2.4.9 (23 September). New 2.5.0 claims were checked against the local app
contract and notarized package; their GitHub sources must be rechecked after the
paired app-source publication before submitting the launch FAQ payload.

Both AEO workflows report `deleted` on GitHub, last updated 29 September. Their
restoration is prepared locally. The missing October issue was created from the
review prompt: [issue #5](https://github.com/yashashwi-s/website/issues/5). The apply command was initially held for owner approval; the completed publication result is recorded below.

The ten launch FAQs keep accurate core answers for single photos, compatibility,
free/open-source licensing, aspect ratio and references. Verified 2.5.0 evidence
adds editable collage behavior, current slideshow/setups guidance, limited weekly
statistics and notarized installation. The comparison and additional useful media
controls remain visible outside the ten-question schema. A separate ten-answer
2.4.9 baseline is retained so unreleased claims cannot be submitted accidentally.
Every publishable FAQ source is on Apple or GitHub. Both full command payloads
pass `scripts/import-arras-aeo-review.mjs --validate-only`.

### Exact visible Google People Also Ask observations

Observed signed out in the in-app browser on 18 October: 24 question observations,
21 distinct wordings. An absent block is recorded as absent, not supplemented.

**macOS desktop photo widget**

- How do I add a photo widget to my Mac desktop?
- How to put a photo widget on desktop?
- How do I get rid of the photo widget on my Mac desktop?
- How to create a macOS desktop widget?

**add photo widgets to MacBook desktop**

- How do I add a photo widget to my Mac desktop?
- How to put a photo widget on desktop?
- Can I add Pinterest widgets to my Mac desktop?
- How do I move widgets to the desktop on my Mac?

**put a specific photo on a widget on Mac**

- How to make a specific picture a widget on Mac?
- How do I put one specific picture on a widget?
- How do I change the image of a widget on my Mac?
- How do I add an image in a widget?

**photo widget without cropping on Mac**

- How to make a specific photo a widget on a MacBook?
- How can I resize a photo without cropping?
- How do I resize an image in the Mac photos app?
- How to edit which photos show on widget on Mac?

**free open-source Mac desktop photo widget**

No People Also Ask block was visible.

**Arras Mac app**

No People Also Ask block was visible.

**Tableau photo widget Mac**

- Can I add a photo as a widget on Mac?
- Can I use Tableau on a Mac?
- How do I add a photo as a widget?
- How to get photo widget off Mac desktop?

**Photo Widget OSX**

- Can I add a photo as a widget on Mac?
- How do I get the photo widget off my Mac?
- How do I change what Photos show on the widget on my Mac?
- Is photo widget free?

### AI citation observations

Each neutral query was tested in a fresh conversation. These are session
observations, not rankings or a guarantee of global presence/absence. Google AI
Overview was observed for all eight Google queries. No tryarras.tech citation was
seen. The free/open-source query cited the official GitHub repository in Google
AI. Generic results mostly named Apple's widget or other products. The no-cropping
and old-name searches still surfaced legacy Tableau/Photo Widget OSX coverage.

| Query | ChatGPT | Perplexity | Gemini |
| --- | --- | --- | --- |
| macOS desktop photo widget | No Arras citation observed | No Arras citation observed | No Arras citation observed |
| add photo widgets to MacBook desktop | No Arras citation observed | No Arras citation observed | No Arras citation observed |
| put a specific photo on a widget on Mac | No Arras citation observed | No Arras citation observed | No Arras citation observed |
| photo widget without cropping on Mac | No Arras citation observed | [Visible product link](https://sourceforge.net/projects/tableau-macos/) | No Arras citation observed |
| free open-source Mac desktop photo widget | [Visible product link](https://github.com/yashashwi-s/Arras); [Visible product link](https://github.com/yashashwi-s/Arras/releases/latest) | [Visible product link](https://github.com/yashashwi-s/Arras); [Visible product link](https://sourceforge.net/projects/tableau-macos/) | No Arras citation observed |
| Arras Mac app | [Visible product link](https://github.com/yashashwi-s/Arras); [Visible product link](https://github.com/yashashwi-s/Arras/releases/latest) | [Visible product link](https://arras.yashashwi.me/); [Visible product link](https://github.com/yashashwi-s/Arras); [Visible product link](https://github.com/yashashwi-s/Arras/blob/main/appcast.json); [Visible product link](https://sourceforge.net/projects/tableau-macos/) | [Visible product link](https://arras.yashashwi.me/) |
| Tableau photo widget Mac | No Arras citation observed | [Visible product link](https://github.com/yashashwi-s/Tableau); [Visible product link](https://sourceforge.net/projects/tableau-macos/) | No Arras citation observed |
| Photo Widget OSX | No Arras citation observed | Provider returned an error; no answer available | No Arras citation observed |

Gemini's branded answer contained an old-site link in its answer, while its source
buttons cited Reddit; a visible product link is not necessarily a primary-source
citation. Some AI answers repeated unsupported performance/privacy or legacy
installation claims. None were adopted as evidence. Perplexity's Photo Widget OSX
query returned “Sorry, something went wrong”; no answer was fabricated. Twenty-three
AI answers and that explicit failure are retained. No unrelated account history or
conversation IDs are included in the publishable review object.

Search Console data could not be obtained through the available connector:
`payment_required`, trial ended/no active subscription. No paid upgrade was
requested. This does not establish a site-indexing problem. Google/Schema.org code
validation used the actual rendered launch JSON-LD: Schema.org reports zero errors
and warnings; Google accepts Software Apps and Videos, with only the optional
aggregateRating field absent. No ratings were invented. Code validation does not
prove that the unpublished 2.5.0 pages have been crawled or indexed.

Evidence and the full validated command are in `/tmp/arras-launch-prep-20261018/`:
`aeo-review.json`, `aeo-submission.txt`, `ai-citation-evidence.json`, independent
validator results and `production-aeo-observation.json`. The source-controlled
archive remains owned by the apply workflow. After approval, publish the paired
app facts, restore the workflows on main, recheck the GitHub claims, submit to
issue #5, monitor its validated commit and Vercel deployment, and rerun production
checks against that exact deployed commit. No user copy/paste is required.

### Approved publication and completed review

The owner approved both pushes and the full cutover on 18 October. The official
[Arras 2.5.0 release](https://github.com/yashashwi-s/Arras/releases/tag/v2.5.0)
now supplies the verified Developer ID signed, Apple-notarized universal app.
README, FEATURES and SECURITY were read back from the GitHub API after push;
search-tool copies of the unversioned pages still showed cached 2.4.9 content.
The publishable FAQ evidence uses the actual new GitHub source and Apple guidance.

The complete ten-FAQ/eight-query payload passed validate-only locally and was
[submitted to issue #5](https://github.com/yashashwi-s/website/issues/5#issuecomment-6246435731).
The [Apply Arras AEO review workflow](https://github.com/yashashwi-s/website/actions/runs/39103213906)
passed on attempt 2, committed `aaba2ec1078263140056899ef2a0fe8312d09a66`, and closed
the issue. Attempt 1 failed because the audit requested `/puremac/` rather than
its canonical `/puremac` root. The request construction was corrected and the
exact original command passed locally before rerunning; no FAQ assertions were removed.

The workflow retained the ten already-reviewed launch answers unchanged and
added the October evidence archive. Vercel production deployment
`dpl_A2TjrjtX64UQ6teuDDWhgcXXL1BC` is READY for that exact main-branch commit.
The new domain is canonical, old Arras pages redirect, and both telemetry API
hosts return direct compatible responses. Production AEO, SEO and all 117
legacy-redirect checks passed. The new film was played in the browser: 10.4 seconds,
1470×956, muted, without a media error.

The PAA wording and AI observations above remain the actual pre-publication
observations, not a claim that answer engines have already refreshed. No
`tryarras.tech` AI citation was observed during that review. The Search Console
connector required a paid subscription; browser access was subsequently verified
on 19 October, as recorded below. No paid upgrade was made.

### Search setup follow-up, 19 October 2026

The school Google account can access the verified `tryarras.tech` property directly
in Search Console. Its sitemap reports Success and three discovered pages. URL
Inspection confirms the homepage, `/faq` and `/security` are each indexed; this is
separate from Bing's earlier discovered-but-not-crawled state. The homepage's last
recorded Google crawl was 18 October at 03:05:43, as displayed by Search Console,
before the 19 October PNG/ICO favicon fix. Google accepted one fresh homepage crawl
request. Request receipt does not prove that search-result favicon caches refreshed.
Keep icon URLs stable, as [Google's favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search)
requires; DuckDuckGo documents its own [favicon refresh delay](https://duckduckgo.com/duckduckgo-help-pages/privacy/favicons).

Search Console has insufficient Chrome UX Report data for mobile and desktop Core
Web Vitals. The existing [19 October production audit](https://github.com/yashashwi-s/website/actions/runs/39240522906)
measured Lighthouse performance 96 mobile / 100 desktop, accessibility, best
practices and SEO 100 on both, with measured CLS 0. These are lab results, not
real-user INP, continuous uptime or proof of complete accessibility compliance.
The existing weekly live report owns ongoing route and Lighthouse checks.

The [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
were read in the browser. Retain crawlable HTML, canonical links, accurate
structured data and useful original product evidence. Do not add keyword-stuffed
image alternatives, invented endorsements, duplicate feature pages or special
AI-only markup. Existing analytics already cover website visits; adding GA4 is
not a prerequisite for indexing. The download-only site has no local storefront,
customer accounts, paid web checkout or marketing-email signup to provision.

The Security page includes the maker’s personal Gmail support contact, with
access/deletion-request guidance that does not ask for photos or backups.
The shared footer identifies the maker and links to that contact section. This
is an operational contact path, not a claim of automated per-installation deletion
or a legal-compliance certification. Existing disclosure of identifiers, data
exclusions and retention remains in place.

### Earlier review record and document ownership

The September review remains in `data/arras-aeo-reviews/2026-09.json`,
[issue #4](https://github.com/yashashwi-s/website/issues/4) and its
[successful apply workflow](https://github.com/yashashwi-s/website/actions/runs/35341514719).
Its deployment commit was `122b707fab4aff9faae12d037125e7e5cad72dad`.
Those dated observations preceded the new domain and 2.5.0; they do not describe
current downloads or current citation visibility. This roadmap owns the evidence
review, README owns current verification commands, and the distribution plan owns
launch media. Redundant static audit/handoff files were consolidated here rather
than maintained as competing descriptions of what is public.

The canonical Security page now renders the full statistics policy, including
exact fields, the installation identifier, Wednesday UTC cadence, retries and
30/400-day retention. The old privacy-details URL stays a compatibility redirect.
A rendered assertion checks the details on `/security` itself, preventing source
text in an unreachable page from being mistaken for published disclosure.


## 22 October 2026 search and recommendation review

The owner requested direct Search Console inspection using the school account and review of at least 500 SEO/AEO/GEO recommendations. The account was accessible through the normal browser. Current URL Inspection confirms that the homepage, `/faq` and `/security` are indexed with their intended canonical URLs; the older page-indexing summary predates those records. The submitted sitemap was read successfully with three discovered pages. No manual action or security issue was reported. Private performance numbers, query rows and account screenshots stay outside this public repository.

The research reviewed **528 source checklist items**, counting cross-source overlaps explicitly: [Seodar](https://seodar.io/checks) 195, [Semrush](https://www.semrush.com/blog/seo-checklist/) 43, [Shopify](https://www.shopify.com/ca/blog/seo-checklist-online-store) 50, [Backlinko](https://backlinko.com/seo-checklist) 48, [Illucrum](https://illucrum.com/blog/seo-checklist/) 54 and [Digital Applied](https://www.digitalapplied.com/blog/technical-seo-audit-checklist-200-items) 138. The last article advertises 200+ but only its 138 explicit recommendations were counted. This is relevance triage, not 528 distinct defects or passed tests. Temporary item references and decisions are in the local search-review evidence folder, outside source control.

Apply advice against [Google's current AI-search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), rather than treating vendor checklists as engine requirements. Useful changes are a direct product explanation in the opening copy, three compact native disclosures reusing the reviewed FAQ answers, an actual collage screenshot in SoftwareApplication metadata, and sitemap dates that follow substantive page edits. The shared answer renderer keeps the homepage and FAQ display consistent. The existing rendered audit now rejects duplicate document IDs and broken local fragment links, preserving feature links when answers appear on both pages.

Keep all ten reviewed questions on `/faq`; the three homepage answers are a convenient introduction, not a promise of rich-result eligibility. Google's [current documentation changelog](https://developers.google.com/search/updates) records retirement of the FAQ rich-result feature in 2026. Do not add artificial ratings, search boxes or unnecessary markup to chase unavailable results. The [sitelinks search box was retired](https://developers.google.com/search/blog/2024/10/sitelinks-search-box), and the [Mobile Usability report was retired](https://developers.google.com/search/blog/2016/05/a-new-mobile-friendly-testing-tool); validate actual responsive rendering instead.

Reject fixed keyword-density or word-count targets, manufactured mentions, mass-produced query-variation pages, fake reviews and claims that special AI files guarantee citations. Retain the existing llms.txt as a factual navigation aid, with no ranking promise. Do not add new analytics vendors or session recording solely because a checklist suggests them. Field Core Web Vitals and long-term search trends require enough real traffic; a lab build or a short reporting window cannot establish those outcomes.


## 24 October 2026 Store conversion and search review

The public Apple listing for [Arras Widgets](https://apps.apple.com/app/id6824271927) was opened from the live website. It shows a US$4.99 purchase, macOS 14 compatibility, Data Not Collected and Family Sharing for up to six family members. The price is identified as a US price; local prices can differ. The website continues to distinguish the paid, sandboxed edition with Apple-managed updates and no Arras usage statistics from the free, open-source direct download. Buying supports independent development; no extra feature, lifetime-upgrade promise, rating or sales figure is invented.

The purchase explanation now sits beside the Store badge and in the portfolio's Arras project. A shared answer explains why someone might buy while retaining the free option. Family Sharing and purchase support link to [Apple's Mac instructions](https://support.apple.com/guide/mac-help/share-purchases-family-sharing-group-mchlc2b37692/mac) and [refund eligibility guidance](https://support.apple.com/en-us/118223). The portfolio description and AI navigation distinguish the editions. Its Person identity matches the maker referenced by the product site's structured data.

The portfolio now has its own robots file and canonical sitemap. IndexNow covers the new Arras Support URL and portfolio content changes; ownership is served on the portfolio host. The deterministic build audit now runs the rendered SEO and legacy-redirect assertions as well as AEO checks. This catches missing public routes, broken edition links and inconsistent structured answers before deployment.

A fresh browser query, “Arras Widgets Mac App Store”, showed an outdated Google AI Overview claiming that Arras is unavailable on the Store and mentioning the retired Homebrew distribution. Its visible citations included the official FEATURES.md and Reddit; the result also linked tryarras.tech. No People Also Ask block was visible for that query. The current GitHub README and feature guide still described the Store target as awaiting review, so a separate documentation-only correction is appropriate. This is one observed result, not a general citation ranking. Do not adopt its obsolete claims or interpret notification acceptance as an answer-engine refresh.

The previous 528-item relevance triage is reused rather than counted again. Current [Google AI-search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [software-app markup guidance](https://developers.google.com/search/docs/appearance/structured-data/software-app), [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) and [Apple marketing guidance](https://developer.apple.com/app-store/marketing/guidelines/) support crawlable, accurate edition facts and genuine listing links. Search appearance and purchases must be measured after publication; neither is guaranteed by markup or wording.
