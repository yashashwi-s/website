/**
 * A still film-grain tile.
 *
 * The portfolio's root layout renders `.noise-bg`, which is the same idea but
 * animated with `steps(1)` over eleven keyframes in 0.8s — so it strobes rather
 * than sits. Each PureMac page suppresses that overlay and uses this instead:
 * same texture, held still.
 *
 * Inline SVG turbulence rather than a PNG so it costs no request and stays
 * crisp at any density. Set the opacity at the call site — how much grain a page
 * wants depends on how dark its background is.
 */
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
