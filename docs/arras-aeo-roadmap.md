# Arras AEO operating plan

Last updated: 2026-08-24

This plan converts the public AEO playbook into work that is relevant and supportable for Arras. It deliberately excludes invented testimonials, keyword-density targets, fake expertise, and unverified industry statistics.

## Shipped foundation

- Answer-first Arras summary immediately below the H1.
- Exact Google People Also Ask questions in an H3-based, ten-question FAQ.
- Two-paragraph answers where the question needs context, with Apple and project documentation links beneath the answer capsule.
- FAQPage, SoftwareApplication, HowTo, BreadcrumbList, WebPage, Organization, and Person structured data.
- A source-backed Arras versus macOS Photos widget comparison table.
- Live GitHub release links and aggregate release-download data.
- Visible content verification date plus sitemap `lastModified` values.
- Explicit access for current OpenAI, Anthropic, Perplexity, Google, Common Crawl, and Apple crawler tokens while API and diagnostic routes remain excluded.
- A concise, Arras-first `/llms.txt` file.
- An executable `npm run check:aeo` production audit.

## Monthly review

Run on the first Monday of each month:

1. Run `npm run check:aeo` against production.
2. Verify current Google People Also Ask questions for the core Arras query set.
3. Test whether ChatGPT, Perplexity, Gemini, and Google AI answers cite or accurately describe Arras for those queries.
4. Record the exact query, result, citation URL, and observation date; do not infer a citation that is not visible.
5. Check GitHub releases and the Arras README for changed version, compatibility, size, features, or installation steps.
6. Update content only when a source, user question, release, or observable result warrants it.
7. Rebuild, rerun the audit, and deploy only validated changes.

### GitHub handoff

The repository owns the long-term schedule, so this process does not depend on a Codex, ChatGPT, Claude, or Gemini subscription:

1. The initial evidence round is accelerated to fit the available LLM subscription window: GitHub creates the prompt issue on September 17, 2026, for review on September 18. Beginning October 4, it returns to the regular pattern of creating an issue one day before each first-Monday review.
2. The issue contains a complete prompt for any browsing-capable LLM. Paste that prompt into the service available to you.
3. Paste its JSON response into the issue as a comment beginning with `/submit-aeo-review`.
4. GitHub accepts the command only on the scheduled Arras issue and only from an owner, member, or collaborator. It validates all fields and source domains before treating the result as data.
5. A valid response updates the ten Arras FAQs, archives the evidence under `data/arras-aeo-reviews/`, refreshes the verification date, builds the site, runs the rendered AEO audit, commits to `main`, and closes the issue. The normal hosting integration then deploys the commit.
6. A blocked, malformed, stale, or failed response leaves production unchanged and links the failed workflow run from the issue.

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
