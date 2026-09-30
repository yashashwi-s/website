# Historical Arras AEO reviews

These JSON files record past search observations and proposed copy from their
`reviewedAt` dates. They are audit archives, not current product facts, fixtures,
or published page data. No current app route or validation script imports them.

In particular, `2026-09.json` reflects the September 18 review, including the
then-current Homebrew flow and first-launch wording. Preserve those observations
as history; do not copy its proposed FAQ answers into current pages.

Current facts come from `data/arras-product.json` and the canonical Arras product
metadata resolver. Current first-launch copy comes from
`lib/arras-installation.mjs`; the live FAQ uses it for both visible answers and
structured data. Product and AEO checks enforce this consistency.
