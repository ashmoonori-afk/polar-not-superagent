# Page geometry and measured checks

Numbers for a 1080 x 1350 page. Scale them by width for other canvases. On the overlay route, run these checks on the laid-out page (DOM boxes) before taking the screenshot, and fail the page on any miss.

## Zones

| Element | Box |
|---|---|
| Cover series tag | pill centred, top 70 px, title face or bold hand 44-48 px, dark fill, white text |
| Cover title | left/right 70 px, top about 160 px, 2-3 lines, 130-170 px |
| Narration band | left/right 90 px, top 64 px, at most 2 lines (height 210 px or less) |
| Scene | everything below the narration band |
| End line | centred, bottom 44 px, narration face 38 px, `line` colour |

## Framing boxes

The character box is the cut-out pose (or the drawn character) at the listed height. Heights are for a pose whose image is about as wide as it is tall.

| Framing | Box height | Bottom offset | Side inset | Visible share of page height |
|---|---|---|---|---|
| full | 680 px | +40 px (floor shadow under it) | 60 px | about 50% |
| big | 880 px | -170 px (cut by the edge) | 10 px | about 53% |
| close | 1120 px | -430 px (cut by the edge) | centred | about 51% |

Face box, used by the overlap check: the top 55% of the character box, inset 12% on each side, starting 8% down. Cut-out poses scale up to about 1.9x for the close framing; soft hand-drawn lines survive that, crisp vector lines may need a larger source.

## Checks

| Check | Pass when |
|---|---|
| Fonts | every style-lock face reports loaded (`document.fonts.check`) before the screenshot |
| Images | every image decoded, natural width above 0, and two animation frames waited before the screenshot |
| Overflow | no text element scrolls (scroll size within 2 px of client size) |
| Margins | every text shape stays 20 px inside the page |
| Text overlap | no two text shapes (title, tag, narration, balloons, props, end line) overlap by more than 4 px |
| Face | no text shape overlaps the face box by more than 6 px |
| Character size | the visible character covers at least 40% of the page height on every page with a character |
| Narration | at most 2 rendered lines, at most 20 characters per written line |
| Balloons | at most 3 per page, at most 12 characters per line, at most 1 shout |
| Marks | at most 2 per page |
| Framing | the post uses full, big and close; the cover is big or close; no two consecutive pages share framing and side |
| Contrast | the style-lock contrast floors in SKILL.md |
| Phone size | each page looked at by eye scaled to 390 px wide: every balloon and prop line readable |

The pixel side still needs eyes: a layout that passes can hide a pose that failed to paint, so also check the finished PNG (for example, the share of the character's main colour on the page) before handover.
