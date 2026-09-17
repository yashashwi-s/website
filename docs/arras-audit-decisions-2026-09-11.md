# Arras: Gemini and Claude audit decisions

Reviewed 11 September 2026. Model audit claims are recommendations, not proof of ranking or missing functionality.

## Completed

- Added accurate GitHub topics: `photo-widget`, `macos-widgets`, `photos`, preserving existing topics.
- Added prominent official website, quick-start, and installation links at the top of the app README. Published commit: https://github.com/yashashwi-s/Arras/commit/03c93145a159cac22b119aa505369783d6cd19f8
- Verified the repository homepage already points to https://arras.yashashwi.me/.
- Live Arras crawl check passed; existing structured data includes SoftwareApplication and FAQPage. Both `#details` and `#how-to-use` already exist.

These changes improve categorization and visitor routing. They do not guarantee AI recommendations or force citations to the website instead of GitHub.

## Rejected or deferred

| Suggestion | Decision |
| --- | --- |
| Add missing FAQPage / SoftwareApplication schema | No change: already present. |
| Add missing details / how-to-use anchors | No change: already present. |
| Update README from 2.4.5 | No change: it already states 2.4.6. |
| Copy current FAQs into a new guide | Rejected: no additional reader value from duplication. |
| Link AlternativeTo from footer for citation benefit | Deferred: no demonstrated need for a reciprocal link. |
| Add wallpaper topic | Rejected: Arras is not a wallpaper engine. |
| Submit to Homebrew's main cask repository now | Deferred: unnotarized build and current Gatekeeper requirements; no placeholder hashes or speculative deletion paths. The existing personal tap is separate. |
| Expand advanced-feature documentation | Optional, not a demonstrated discovery blocker. Released documentation confirms Shortcuts, selected PDF-page/screen-region import, Command snap override and Shift axis constraint. A future guide should add practical examples rather than keyword filler. |
| Treat reported search positions as universal | Rejected: rankings and model answers vary; audit statements alone do not establish stable positions. |

Homebrew policy: https://docs.brew.sh/Acceptable-Casks
Released feature reference: https://github.com/yashashwi-s/Arras/blob/v2.4.6/FEATURES.md

## Useful external corrections still pending

1. DevHunt: https://devhunt.org/tool/photowidgetosx
   - Live browser verified old PhotoWidgetOSX name and Live preview link to the old GitHub repository.
   - Change name to Arras, destination to https://arras.yashashwi.me/, and retain former name in a short historical note.
   - Page also displays a September 19, 2028 launch date; inspect dashboard before changing it.
   - Not changed: current browser is signed out and has no listing editor.
2. Medium: https://medium.com/@yashashwi.singhania.bce23/how-i-bypassed-apples-widgetkit-to-build-a-true-borderless-photo-widget-for-macos-29ae52663b25
   - Public article uses Tableau and old installation/source links. Add a dated rename note and route readers to the official current installation guide; preserve the historical article.
   - Not changed: authenticated editor not established.
3. Reddit: https://www.reddit.com/r/MacOS/comments/1vcs4m5/
   - Audit reports a stale destination, but live retrieval was inconclusive. Verify post contents and author before editing. No new promotional comments or posts created.

No new schedules, AI submissions, app releases, notarization changes, or website deployment were needed for the completed repository-only fixes. Unrelated local work was left untouched.
