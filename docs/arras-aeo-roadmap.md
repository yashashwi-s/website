# Arras AEO operating plan

Last updated: 2026-10-18

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

Production on both Arras domains still serves 2.4.9. The new domain currently
has its own canonical links; the old domain remains active independently. The
local release prepares 2.5.0 and selects tryarras.tech as primary, with matching
old-page redirects and compatible API/media paths. Public GitHub's latest release
is v2.4.9 (23 September). New 2.5.0 claims were checked against the local app
contract and notarized package; their GitHub sources must be rechecked after the
paired app-source publication before submitting the launch FAQ payload.

Both AEO workflows report `deleted` on GitHub, last updated 29 September. Their
restoration is prepared locally. The missing October issue was created from the
review prompt: [issue #5](https://github.com/yashashwi-s/website/issues/5). No apply
command has been posted: that would commit/push and deploy before the owner's
final approval. Therefore there is no October apply-run, publication commit or
new deployment to report. The existing production was preserved.

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
