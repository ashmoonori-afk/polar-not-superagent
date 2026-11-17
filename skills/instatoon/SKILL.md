---
name: instatoon
description: "Make a Korean Instagram carousel comic (instatoon) from one character image and a topic: a written page plan, a locked palette and type spec, an anchor page, then every page as its own image, with a repair loop and a pre-post check. Use when asked for an instatoon, an Instagram comic or carousel with a character, or to fix pages of one."
version: "0.1.0"
---

# Instatoon

An instatoon is a short carousel: one cover, a few explanation pages, one closing page. Each page is its own image and the same character carries the story. The hard part is not drawing one good page. It is keeping six of them alike: same character, same title size and spot, same colours. This skill gets there by writing the decisions down once (the **character card**, the **page plan** and the **style lock**), drawing one page as the **anchor**, and making every other page from those three plus the anchor.

Prompt blocks and repair recipes: `references/prompts.md`.

## What you need

| Input | Required | Notes |
|---|---|---|
| Character image | yes | Full body, plain background, colours clearly visible. No image and no request to design one: ask for it. Never invent a stand-in character. |
| Topic | yes | One topic per post ("주 3회 운동 습관", "통장 쪼개기"). |
| Must-say points, exact numbers or lines | no | Exact text is used word for word. |
| Page count | no | Default 6. |
| Brand or background colour | no | Overrides the palette method below. |
| Closing action | no | What the reader should do at the end (save, comment a keyword, follow). Only what the account really offers. |

Ask nothing else. If the topic is clear, plan and draw.

## Image tool

Use whatever image generator the agent has that accepts reference images and edits an existing image (an image model with image input, such as a GPT image model or Gemini image model, or an MCP image tool). Read that tool's own skill or docs before the first call. The skill relies on three abilities:

1. generate from text plus one or more reference images,
2. edit one image while keeping the rest,
3. return a separate file per page.

If the tool cannot take a reference image, say so before you start: page-to-page consistency will be weak, and the overlay text route below matters more.

## Step 1: Character card

Look at the character image and write this card. It goes into every page prompt.

```
CHARACTER
name: <given name, or "none" - never make one up>
body shape: <e.g. round bean body, short legs, head ~60% of height>
colours: main <colour>, second <colour>, line <colour and weight>
face: <eyes, mouth, nose, cheeks exactly as drawn>
keeps: <outfit, hair clip, freckles, any deliberate asymmetry>
never adds: <lashes, nose, accessories, highlights it does not have>
```

Rules:
- The character image is the only authority on looks. Poses, expressions and props may change per page; shape, face and colours do not.
- Do not take the upload's background colour for the character's colour.
- Say "estimated" for colour values you judged by eye. Say "sampled" only when you read real pixel values.
- Several characters: the named lead sets the palette, or the most central one if none is named. Every character keeps its own looks.

## Step 2: Page plan

Write the plan as a table before any image. Default six pages:

| # | Role | Title | Scene | Text on page |
|---|---|---|---|---|
| 1 | Cover | topic title, 2-3 lines allowed | character doing the topic | optional one-line subtitle |
| 2 | Hook | "1. ..." | the problem the reader has | one balloon, one short line |
| 3-5 | Body | "2. ...", "3. ...", ... | one idea per page | a card plus one balloon |
| 6 | Close | short wrap-up title | character at rest or waving | the takeaway and the closing action |

Rules:
- One idea per page. If an idea needs two pages, split it and move the count, and say why in one line.
- Body pages follow the user's order. Do not invent results, earnings, dates, events or giveaways.
- Comparisons get two side-by-side panels; a single idea gets one big scene.
- At most about 25 Korean characters per balloon and 2 balloons per page. Longer text goes into a card.
- The title is not repeated inside the page.
- The user's own name for the character, or none, appears on the page. The skill's name never does.

If the user asked to see the plan first, stop here. Otherwise go on.

## Step 3: Style lock

Fix colour, type and layout once and write them as one block. Every page uses this block unchanged.

### Canvas and layout

- Default 1080 x 1350 (4:5 portrait), which fills more of the feed than a square. Use 1080 x 1080 only if asked. Same size on every page.
- Vertical zones, as a share of page height: title band 4-16%, info card 18-48%, scene with character and balloons 50-94%. The cover drops the card and gives the title 8-36%.
- Side margins of 7% on every page. Rounded corners on cards and panels; no outer frame, no page numbers, no watermark.

### Palette by role

Pick five colours by role, never by taste alone:

| Role | How to choose it |
|---|---|
| `paper` (background) | The character's main hue, made very light (HSL lightness 93-97%, saturation under 35%). It may fade toward warm white at the bottom. If the character itself is very light (white, cream, pale grey) or would blend in, use a neutral paper one step away instead: warm off-white for cool characters, cool pale grey for warm ones. |
| `card` | White or near-white, a little lighter than `paper`, so cards and balloons read as separate shapes. |
| `ink` (titles and text) | A very dark shade of a colour related to the character (deep cocoa, ink navy, dark plum, forest black). Not pure black and not a fixed brown for every post. |
| `line` | The character's own line colour, for balloon and card outlines too. |
| `accent` | One of the character's own colours at full strength, for at most two key words or one meaningful icon per page. |

Checks, run on the hex values before drawing (WCAG contrast ratio):
- `ink` on `paper`: at least 7:1. `ink` on `card`: at least 7:1.
- `accent` on `card`, where used for words: at least 3:1, and the word is bold.
- The character must stand off `paper`. For a mid or dark character, its main colour against `paper` is at least 1.4:1. For a white or very pale character no light paper can reach that, so its outline carries it: `line` against `paper` at least 3:1, and `paper` one step darker (lightness 88-92%). If either check fails, move `paper`, never the character.

Colours that carry meaning (up/down, warning, chart series) keep one meaning across the whole post.

Starting points only, and they never beat the checks: a green character works on pale mint-cream with forest-black ink; an orange one on peach-cream with deep cocoa ink; a purple one on lavender-white with dark plum ink; a black one on warm off-white with charcoal ink and its own cheek or accessory colour as accent.

### Type

- Korean in a rounded, heavy sans for titles and a rounded regular weight for body text (for the overlay route: Jua or Gowun Dodum for titles, Pretendard for body, all free licences).
- Body page titles all use the same font, size, `ink` colour, baseline and centre alignment. The number is in the same style as the words: no badge, no circle.
- Size the titles once: find the longest body title, set the largest size at which it fits on one line inside the margins, and use that size on every body page. A short title is not made bigger.
- No outline, stroke, shadow, banner or underline on titles.

Write the block:

```
STYLE LOCK
canvas: 1080x1350; margins 7%; zones title 4-16 / card 18-48 / scene 50-94
paper #...  card #...  ink #...  line #...  accent #...
contrast: ink/paper x:1, ink/card x:1, accent/card x:1
title: rounded heavy Korean sans, <size> px, ink, centred, one line
body: rounded Korean sans, ink; balloons in card with line outline
no: sparkles, stars, burst lines, highlighter, underlines, doodles, frames, page numbers
```

## Step 4: Anchor page

Draw the first body page (page 2) before the cover. It is the page that fixes the title spec, the balloon style and the character's on-page scale, and it is the page every other page copies.

Prompt it from the character card, the style lock and its plan row, with the character image as reference (block A in `references/prompts.md`). Inspect it (Step 6). Repeat until it passes. If the user wanted a check-in, show it now.

## Step 5: The other pages

For each remaining page, cover included, give the generator:
- the character image (looks),
- the passed anchor page (title, balloons, palette and scale),
- the character card, the style lock and that page's plan row, written out in full each time (block B).

Make one page per call. If the tool limits the number of images, say which pages are done and which are left.

### Text: in the image or on top

Image models still misspell Korean. Choose per page:
- **In-image text** for titles and lines up to about 12 characters.
- **Overlay text** for longer lines, exact numbers or anything that failed twice: generate the page with empty balloons and cards (block C), then set the text yourself with HTML/CSS (or any layout tool) in the style-lock fonts and colours, and render to PNG at the canvas size. This route is exact and repeatable.

## Step 6: Inspect and repair

Open every page and check it against the card, the lock and the plan. Write one line per page: `page N: pass` or `page N: <defect>`.

Defects to look for:
- text: typos, cut-off letters, text outside a balloon, lines too small to read on a phone,
- content: missing or repeated points, wrong numbers, claims the user did not give,
- title: different size, colour, height or alignment from the anchor,
- palette: a new background or ink colour; character blending into the background,
- character: changed face, colours or proportions; features it never had; details from another image leaking in,
- clutter: sparkles, burst lines, highlighter, frames, page numbers.

Repair one defect per pass, with the page plus the anchor (and for character defects, the character image) attached, saying what to change and what to keep (recipes R1-R6: character, title, one line of text, broken text, palette, decoration). After two failed passes on the same text defect, switch that page to the overlay route.

## Step 7: Before posting

- [ ] Korean read through once by eye: no typos, no clipped letters, readable at phone size.
- [ ] Every must-say point present once; numbers match what the user gave.
- [ ] The closing action names only what the account really gives, with the exact comment keyword if there is one.
- [ ] Pages viewed side by side as thumbnails: body titles identical in size, colour and position; one palette from cover to close.
- [ ] Same character on every page, nothing added.
- [ ] No decoration from the "no" list.

Then hand over:
- `page-01.png` ... `page-NN.png` in posting order,
- `caption.txt`: a 2-4 line caption with the hook and the closing action, then 5-10 topic hashtags,
- `alt.txt`: one plain Korean line per page describing the image, for Instagram's alt text,
- the character card and style lock, so the next post with this character can reuse them.

Reuse: a new post with the same character keeps the saved palette unless the user changes it. A new character gets a new palette.
