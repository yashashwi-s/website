# Arras scheduled evidence review — 18 September 2026

The locally validated submission is recorded at https://github.com/yashashwi-s/website/issues/4#issuecomment-5729550411. It contains all eight query observations, exact visible PAA questions, ten FAQs and supporting sources. No browsing history, account details or unrelated local edits were included.

## Discovery findings

- Claude's completed web-search response to a neutral, unbranded prompt recommended Arras as the closest match. It linked https://github.com/yashashwi-s/Arras, not the product website.
- Perplexity's completed response to the same prompt recommended Arras first, drawing on Reddit and SourceForge. It emitted the incorrect repository URL `github.com/yashash-s/Arras` (missing `wi`). No product website link appeared in the inspected answer. This is an observed model error, not a link to publish or adopt.
- Google AI Overview for “Arras Mac app” described Arras but linked the old repository path https://github.com/yashashwi-s/Tableau/blob/main/FEATURES.md. It also mixed in an unrelated darts app.
- Google AI Overview for “photo widget without cropping on Mac” recommended Tableau under the old name, citing https://www.reddit.com/r/MacOS/comments/1uh79nz/i_built_a_macos_desktop_photo_widget_that_doesnt/.
- Google AI Overview for “Tableau photo widget Mac” cited https://sourceforge.net/projects/tableau-macos/ and Reddit under the old name.
- Generic widget queries mostly surfaced built-in macOS guidance and other apps. No official Arras website citation appeared in the inspected Google AI excerpts. This is not proof of global absence or deindexing.
- Gemini's entry flow redirected to a managed Google Workspace origin. The approval system blocked that destination because it could expose private workspace/session information outside this public review. No bypass was attempted; continuing that access would require explicit approval. Google Search AI observations remain separate from Gemini-app results.
- ChatGPT navigation timed out, and a subsequent attempt to inspect that same tab also timed out. No current ChatGPT recommendation or citation result was recorded.

Prompt used for Claude and Perplexity: “Search the web for a free open-source Mac desktop photo widget that preserves original aspect ratio. Recommend suitable options and link official product websites.” These are individual session observations, not controlled rankings.

## Content decision

The latest release is v2.4.7, published 11 September: a new icon, explicitly no other feature changes. Retain all ten existing FAQ topics. Clarify that fixed-frame rotation intentionally crops; replace the unsupported term “vignettes” with documented “edge fade.” Constrain FAQ source links to the Apple/GitHub domains required by this scheduled run. No new FAQ topics were added merely to match unrelated PAA questions.

Production AEO checks passed before submission. The importer accepted the full `/submit-aeo-review` payload in validate-only mode. The GitHub application workflow owns the build, publication commit and issue closure; final status is reported separately after verification.

## Priority for the owner

The strongest new evidence is that Claude and Perplexity now find Arras, but website-first attribution and naming remain weak. Correct your existing Reddit and SourceForge/DevHunt references where you control them, using the Arras name and https://arras.yashashwi.me/. Keep GitHub useful and visible. No external listing edits were made during this scheduled review.

## Verified publication

- GitHub Actions run https://github.com/yashashwi-s/website/actions/runs/35341514719 succeeded, including validation, build, rendered audit, publication and issue closure.
- Published commit: `122b707fab4aff9faae12d037125e7e5cad72dad` (`content: apply Arras AEO review 2026-09-18`). Issue #4 is closed.
- Vercel reports successful deployment for that exact commit: https://vercel.com/yashashwi-singhanias-projects/website/GEMBGvVcZYVMYHsqioK1of75SgKK.
- Post-deployment `npm run check:aeo` passed: Arras has a 54-character title, 131-character description and ten FAQs with the expected structured data.
- Unrelated local Fadeo changes were left untouched. This report is local and uncommitted.
