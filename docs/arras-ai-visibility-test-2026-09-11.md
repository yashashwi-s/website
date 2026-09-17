# Arras AI visibility test — 11 September 2026

Target: https://arras.yashashwi.me/

## Method

One neutral discovery prompt per available service, followed by a clearly separate direct-URL retrieval prompt. Arras was not named in the discovery prompt. These tests observe individual answers, not recommendation frequency, index coverage, or a production crawler run.

Discovery prompt:

> Search the web for a free macOS app that can place a specific photo on my desktop at its original aspect ratio, without forcing it into a square widget. Which options fit? Link to the official product websites and explain any important limitations. If web search is unavailable, say so rather than guessing.

Retrieval prompt:

> Now directly open https://arras.yashashwi.me/ and summarize only what you can verify from that website: what the app does, compatibility, price, and installation. Link to the website. Explicitly say if you cannot fetch the page; do not silently substitute GitHub. This is a separate direct-URL retrieval test, not an unprompted recommendation.

## Observed results

| Service | Session | Neutral discovery | Direct website retrieval |
| --- | --- | --- | --- |
| ChatGPT | Signed out; model not identified in interface | Recommended Arras first. Included an official website link to `https://arras.yashashwi.me/?utm_source=chatgpt.com`, alongside GitHub citations. The link destination was inspected in its Sources dialog. | Reported fetching the website directly and cited Arras for features, compatibility, price, and installation. |
| Claude | Existing session became available automatically; used Incognito, Sonnet 5 Medium as displayed | Searched the web but did not mention Arras. Suggested GeekTool and Übersicht, with other photo-widget alternatives. | Displayed a fetched-page result for `https://arras.yashashwi.me/` and cited the website in its answer. |
| Gemini | Attempted the public landing page; browser reused an existing managed Google session | Blocked before a prompt could be submitted. “Chat with Gemini” led to Google's Service Not Allowed page. | Not run. |

Claude Incognito is not equivalent to signed-out access. No login credentials were entered, no account was created, and no plan was upgraded. Gemini's account or organization settings were not changed to bypass its restriction.

## Interpretation

- ChatGPT can link visitors to the website in a neutral search answer; GitHub citations may still appear alongside that link.
- Claude can retrieve and cite the website when given its URL. Its failure to discover Arras in this one neutral query is therefore consistent with a discovery/selection gap, not an observed blanket fetch block. This does not prove the cause or guarantee future recommendations.
- There is no Gemini recommendation result from this test. Its access error is not evidence about Arras visibility.
- Direct-URL prompts are seeded tests and must not be counted as organic recommendations.

## Technical baseline and boundaries

The live `npm run check:arras` audit passed: metadata, canonical identity, ten FAQs and structured data, crawler rules, sitemap, guide anchors, and images/favicon. This is a fetch from our audit, not an authenticated request from any vendor's crawler infrastructure.

No indexing request, scheduled task, public marketing post, or website deployment was performed in this test. No server-side bot logs or referral analytics were used to claim a crawler visit or a traffic increase.
