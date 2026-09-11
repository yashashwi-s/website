# Repeatable AI discovery checks

Use a fresh conversation with web search enabled, if available. Run the same prompts once per review; do not seed the product names or the website URL before these queries. Search results vary: record observations, not a universal ranking.

## Unbranded prompts

1. What free Mac apps can put a specific photo on the desktop without forcing it into a square? Link official websites and explain limitations.
2. How can I keep a panorama on my Mac desktop at its original aspect ratio without setting it as wallpaper?
3. Is there a native Mac app for arranging several desktop photos with independent sizes and frames?
4. Which Mac tools can rotate several photos in a desktop widget without cropping each image?
5. Can a Mac app automatically pause or change my background audio when I switch apps or join a meeting? Compare relevant options and link their websites.
6. What open-source Mac apps let me customize desktop photos or automate workflow audio without subscriptions?

## Separate access diagnostic, after discovery tests

Open https://arras.yashashwi.me/ and summarize its current compatibility and known limitations, citing the sections you actually accessed. Say explicitly if access failed. Do not infer product facts from the URL alone.

Direct fetching is an access test, not evidence of organic discovery. Don't count your own prompted visits as acquired customers.

## Observation fields

Record timestamp/timezone, engine and model if shown, signed-in state, web-search availability, exact prompt, mentioned products in order, exact cited URLs, website-versus-GitHub destination, incorrect claims and screenshot/transcript path. Leave unavailable fields unknown.

Suggested results columns: date, engine, query_id, search_enabled, arras_mentioned, fadeo_mentioned, recommendation_position, website_cited, github_cited, cited_urls, factual_error, evidence_file.

Never automatically claim a missing product is deindexed. Look at multiple observations and actual webmaster data before changing strategy. This document creates no scheduled job.
