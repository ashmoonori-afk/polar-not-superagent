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

| small | 460 px | +40 px | 70 px | about 34% (hero-prop pages only) |

Face box, used by the overlap check: the top 55% of the character box, inset 12% on each side, starting 8% down. Cut-out poses scale up to about 1.9x for the close framing; soft hand-drawn lines survive that, crisp vector lines may need a larger source.

## Scene grid and prop boxes

The scene below the narration band is a 3 x 3 grid of cells, about 360 x 370 px each:

| | left 0-360 | middle 360-720 | right 720-1080 |
|---|---|---|---|
| top 220-590 | A1 | A2 | A3 |
| middle 590-960 | B1 | B2 | B3 |
| bottom 960-1330 | C1 | C2 | C3 |

Mark the cells the character's face box touches; props go in the other cells. An `s` prop fits inside one cell, an `m` prop spans one to two cells, a `hero` prop takes a 2 x 2 block. A held prop sits where the character's lower half is. On full framing the free cells are the top row and the column away from the character; on big and close framing only the top row and the outer corners stay free.

| Class | Longest side (rotation included) | Use |
|---|---|---|
| s | 150-299 px | a second prop, a held object, a corner reminder |
| m | 300-599 px | the page's main object, a phone or window with text |
| hero | 540-960 px and at least 40% of the page height | the subject of a hero-prop page; at most 2 per post |

Line weight: every stroke 4-6.5 px on the page (draw with a non-scaling stroke, or scale the pen with the drawing). Fills and strokes: only colours from the style lock and the prop fills chosen from the character.

## Checks

| Check | Pass when |
|---|---|
| Fonts | every style-lock face reports loaded (`document.fonts.check`) before the screenshot |
| Images | every image decoded, natural width above 0, and two animation frames waited before the screenshot |
| Overflow | no text element scrolls (scroll size within 2 px of client size) |
| Margins | every text shape stays 20 px inside the page |
| Text overlap | no two text shapes (title, tag, narration, balloons, props, end line) overlap by more than 4 px |
| Face | no text shape overlaps the face box by more than 6 px |
| Character size | the visible character covers at least 40% of the page height on every page with a character, except a page whose hero prop covers at least 40% |
| Narration | at most 2 rendered lines, at most 20 characters per written line |
| Balloons | at most 3 per page, at most 12 characters per line, at most 1 shout |
| Marks | at most 2 per page |
| Prop set | 3-6 topic props, each with a reason, each drawn at least once, nothing drawn outside the set (`scripts/check-spec.mjs`) |
| Props per page | cover at least 1; at least 75% of the other pages at least 1; at most 3 on any page; at most 2 hero-prop pages (`scripts/check-spec.mjs`) |
| Prop size | the longest side of each prop box falls inside its declared class |
| Prop place | each prop box 20 px inside the page, off the face box by 6 px or more, not under any text shape by more than 4 px; a held prop touches the lower 55% of the character box |
| Prop drawing | every stroke 4-6.5 px; every fill and stroke colour from the palette; no raster image on the page except the character |
| Framing | the post uses full, big and close; the cover is big or close; no two consecutive pages share framing and side |
| Contrast | the style-lock contrast floors in SKILL.md |
| Phone size | each page looked at by eye scaled to 390 px wide: every balloon and prop line readable |

Run `bun scripts/check-spec.mjs <plan.json>` on the page plan before drawing. The plan file is the page plan as JSON: `propSet` (`[{ id, name, why }]`), `alt` (one line per page) and `pages`, each with `role`, `pose`, `frame` (`full | big | close | small`), `side`, `narration` or `title`, `balloons` (`[{ who: mine | other | shout, text }]`), `marks`, `art` (drawn props, `[{ id, size: s | m | hero }]`) and `props` (text props; give `id` and `size` when the prop is a topic object). The checker covers the rows that need only the plan (page count, text budget, framing, prop set and counts) and prints one line per failure. The rows that need the laid-out page run in the renderer.

The pixel side still needs eyes: a layout that passes can hide a pose that failed to paint, so also check the finished PNG (for example, the share of the character's main colour on the page) before handover.
