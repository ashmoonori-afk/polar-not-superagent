---
name: instatoon
description: "Make a Korean Instagram carousel comic (instatoon) from one character image and a topic: a story-first page plan, the topic's own objects drawn as props in the character's style, a locked palette, hand-lettered type and framing rules, an anchor page, then every page as its own image, with a repair loop, a plan checker and a pre-post check. Use when asked for an instatoon, an Instagram comic or carousel with a character, or to fix pages of one."
version: "0.3.0"
---

# Instatoon

An instatoon is a short carousel comic: a cover that hooks, a few scene pages, one closing page. Each page is its own image and the same character carries the story. Two things decide whether it looks like a comic or like a slide deck:

1. **It is told as scenes.** Every page is a moment: a one-line narration, the character reacting at a real size, and short hand-lettered balloons. Facts live inside things the character holds or looks at (a phone screen, a memo, a sign), never in a big white info box.
2. **The topic is drawn, not only the character.** The objects the topic is about (for a post on asking AI with photos: the error window, the phone, the camera, the receipt, the menu) appear as drawings in the character's own line and colour, held by the character or standing on their own. A reader should guess the topic from the pictures before reading a word.
3. **It stays alike.** Same character, same paper, same lettering, same balloon style, same prop drawing style on every page, while the framing changes from page to page.

This skill gets there by writing the decisions down once (the **character card**, the **page plan** with its **prop set**, and the **style lock**), drawing one page as the **anchor**, and making every other page from those plus the anchor.

Prompt blocks and repair recipes: `references/prompts.md`. Page geometry, prop boxes and the measured checks: `references/layout.md`. Plan checker: `scripts/check-spec.mjs`.

## What you need

| Input | Required | Notes |
|---|---|---|
| Character image | yes | Full body, plain background, colours clearly visible. No image and no request to design one: ask for it. Never invent a stand-in character. |
| Topic | yes | One topic per post ("주 3회 운동 습관", "통장 쪼개기"). |
| Must-say points, exact numbers or lines | no | Exact text is used word for word. |
| Page count | no | Default 9 (8-10). |
| Series name | no | A short label for the cover tag ("<character>의 생활 한입 · 통장편"). |
| Brand or background colour | no | Overrides the palette method below. |
| Closing action | no | What the reader should do at the end (save, comment a keyword, follow). Only what the account really offers. |

Ask nothing else. If the topic is clear, plan and draw.

## Image tool

Use whatever image generator the agent has that accepts reference images and edits an existing image (an image model with image input, such as a GPT image model or Gemini image model, or an MCP image tool). Read that tool's own skill or docs before the first call. The skill relies on three abilities:

1. generate from text plus one or more reference images,
2. edit one image while keeping the rest,
3. return a separate file per page.

If the tool cannot take a reference image, say so before you start: page-to-page consistency will be weak, and the overlay route below matters more. With a fixed set of approved character poses (cut-out images), the whole page can be built on the overlay route: poses placed and cropped per the framing rules, props and balloons drawn in HTML/SVG.

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
signature colour: <the one colour that is most "this character" - used for its balloons>
```

Rules:
- The character image is the only authority on looks. Poses, expressions, framing and props may change per page; shape, face and colours do not.
- Do not take the upload's background colour for the character's colour.
- Say "estimated" for colour values you judged by eye. Say "sampled" only when you read real pixel values.
- Several characters: the named lead sets the palette, or the most central one if none is named. Every character keeps its own looks and its own balloon colour.

## Step 2: Page plan

Write the plan as a table before any image. The default nine pages follow a small story arc:

| # | Role | Narration (top band) | Scene and framing | Balloons | Topic props |
|---|---|---|---|---|---|
| 1 | Cover | none: series tag + title | character big or close-up, reacting to the problem | title 2-3 lines; optional one emotion mark | the problem object beside the character |
| 2 | Setup | the everyday moment | the problem appears (big) | one shout or reaction balloon | the problem object, large |
| 3 | Stuck | why it is hard | character stuck (full) | one or two balloons, a second voice allowed | the problem object again, small |
| 4 | Turn | the one idea of the post | character lights up (big), colour field allowed | one shout ("찰칵!") plus one line | the tool or action object |
| 5-7 | Body | "1. ...", "2. ...", "3. ..." | one tip per page, framing alternates | one balloon reacting | the tip's own object; exact words or numbers inside a text prop |
| 8 | Caution | the one thing to watch | close-up, worried | none or one | the caution inside a memo, plus the object it is about |
| 9 | Close | short wrap-up | character waving (full) | one balloon, "- 끝 -" or the closing action | checklist memo, one small prop from the set |

Rules:
- One idea per page. If an idea needs two pages, split it and move the count, and say why in one line.
- Body pages follow the user's order. Do not invent results, earnings, dates, events or giveaways.
- The cover hook is a moment or a question the reader has lived ("이 오류, 말로 어떻게 설명하지?"), not a bare list title ("사진 질문 팁 4가지"). The tip count may appear on page 4 or in the caption instead.
- Text budget per page: narration at most 2 lines of 20 Korean characters; at most 3 balloons of at most 12 characters per line; anything longer goes into a prop.
- Exact prompts, numbers and steps the reader should copy go inside a prop (a phone chat bubble, a memo, a screen), word for word.
- The user's own name for the character, or none, appears on the page. The skill's name never does.

### Prop set

Before the table is final, pick the topic's props and write them as a list: id, Korean name, and one line on why it belongs to this topic.

```
PROP SET
error   | 오류 창        | the problem the story starts from
phone   | 휴대폰         | the tool the reader uses
camera  | 카메라         | the turn: a photo instead of words
receipt | 영수증         | what tip 2 is about
menu    | 외국어 메뉴판  | what tip 3 is about
idcard  | 가린 신분증 사진 | the caution: hide personal details
```

How to pick them:
- **3-6 props per post**, each a concrete object a reader can picture (a phone, a receipt), never an abstract idea (efficiency, safety) or a logo.
- Take one from each part of the story: the **problem** (setup), the **tool or action** (turn), **one per tip** if the tip has its own object, and the **caution**. If more than 6 qualify, drop the ones that only repeat a meaning; if fewer than 3, look at what the character would hold, open, see or send in each scene.
- Each prop keeps one meaning and one look for the whole post. The same phone is the same phone on every page.
- No brand marks, real product shapes that identify a maker, stock photos or screenshots. When the topic needs a real screen (an error, a chat), **redraw** it in the prop style: window frame, a symbol, grey lines for unreadable text, and only the words the page needs.

Where they go (counts are checked by `scripts/check-spec.mjs`):
- At least **1 prop on the cover** and on **at least 75% of the other pages** (6 of 8 in a nine-page post).
- **At most 3 props per page**, counting text props (phone screen, memo, error window) that carry a prop id. A plain memo with no topic object behind it does not count.
- Every prop in the set is drawn at least once; nothing outside the set is drawn as a prop.
- A prop is either **held** (it touches the lower half of the character, as if held or used), **beside** the character (in a free part of the scene), or the **hero** of the page (see below).
- A **hero-prop page** makes the object the subject: the prop is drawn large (at least 40% of the page height) and the character may shrink to the `small` framing beside it. At most 2 hero-prop pages per post, never the cover.

Put the prop id in the plan table's prop column for each page.

If the user asked to see the plan first, stop here. Otherwise go on.

## Step 3: Style lock

Fix paper, colour, lettering, balloons and framing once and write them as one block. Every page uses this block unchanged.

### Canvas and zones

- 1080 x 1350 (4:5 portrait) by default, the shape most of the studied Korean instatoon accounts use and the one that fills more of the feed. Use 1080 x 1080 only if asked. Same size on every page.
- Narration band: top 64-210 px, centred. Scene: the rest of the page.
- Safe margin: no text within 20 px of any edge; narration and cover title keep 70-90 px from the sides.
- No outer frame, no page numbers, no watermark.

### Paper and palette by role

| Role | How to choose it |
|---|---|
| `paper` | A warm off-white, HSL lightness 93-97% and saturation under 30%, with a fine grain (noise at 3-6% opacity, multiplied) so it reads as paper, not a screen. Not white. If the character is very light, move `paper` one step darker (lightness 88-92%) and let `line` carry the outline. |
| `ink` | Very dark warm brown or a very dark shade related to the character, for narration and balloon text. Not pure black. |
| `line` | One dark line colour for balloons, props and marks, 4-6 px at 1080 width, slightly wobbly (hand-drawn). |
| `mine` | The character's signature colour, very pale: the fill of its own balloons and of its message bubbles in props. |
| `other` | Near-white card colour: other voices' balloons, props. |
| `shout` | One warm yellow for jagged shout balloons and one or two marks. |
| `accent` | One of the character's own colours, darkened for text: at most two key words per page (narration or prop), never in balloons. |

Checks, run on the hex values before drawing (WCAG contrast ratio):
- `ink` on `paper`, on `mine` and on `shout`: at least 7:1.
- `line` on `paper`: at least 3:1.
- `accent` on `other`: at least 4.5:1, and the word is bold or in the title face.
- The character must stand off `paper`: its main colour against `paper` at least 1.4:1, or its own outline against `paper` at least 3:1. If either check fails, move `paper`, never the character.

A soft **colour field** (a large radial fill in `mine`, `shout` or a pale pink behind the character) is allowed on at most 3 pages: the cover, the turn and one climax. Colours that carry meaning (warning, up/down) keep one meaning across the post.

### Lettering

Three faces, all hand-lettered Korean, each with one job:

| Role | Face | Size at 1080 | Notes |
|---|---|---|---|
| Cover title | a heavy brush or marker hand (for example Yeon Sung) | 130-170 px, 2-3 lines, filling 25-40% of the page height | `ink`, one phrase in `accent` |
| Narration | a light, plain hand (for example Poor Story) | 50-56 px, line height 1.3 | centred, top band |
| Balloons and props | a bold round hand (for example Gaegu Bold) | balloons 56-64 px, props 54-60 px | tighten letter spacing (about -0.08em for wide hand faces) |

All three examples are free under the SIL Open Font License. Measure the face, not the number: some hand faces draw small inside their em box, so check the rendered text at 390 px wide (phone) and raise the size until a balloon line is clearly readable. No outline, stroke or shadow on text.

### Balloons

- Speech: a soft round shape (not a rectangle), `line` outline with a slight wobble, a short tail pointing at the speaker, or at the page edge for an off-page voice.
- Fill by speaker: the character in `mine`, everyone else in `other`. Readers learn who speaks from the colour.
- Shout: a jagged burst in `shout`, title face, one or two words ("으악?!", "찰칵!"). At most one per page.
- Never over the character's face (the top 55% of its body box, minus 12% at each side).

### Framing

Three framings, every post uses all three:

| Framing | Character height | Placement |
|---|---|---|
| full | about 50% of the page | whole body, feet on a soft floor shadow, left or right |
| big | about 65% of the image height, cut by the bottom edge | head and chest, left or right |
| close | head fills the page width, cut by the bottom edge | face only, centred |
| small | about 34% of the page | whole body beside a hero prop; only on a hero-prop page |

Rules: the character's visible part covers at least 40% of the page height on every scene page except a hero-prop page; the cover uses big or close; full, big and close all appear; two pages in a row never share both framing and side. Big and close leave little room beside the face, so put `m` and larger props on full or small pages and keep big and close pages to `s` or `m` props in the free corners.

### Props

Props are drawn by the same hand as the character, so they never look pasted in:

- **Line**: the style lock's `line` colour at 4-6 px on the 1080 px page, the same weight at every size (draw small props with the same pen, do not shrink the lines), round joins, the same slight wobble as the balloons.
- **Fill**: flat pale colours taken from the character (its accent colour, cheek pink, fur or skin tone) plus the lock's `shout` yellow and `other` card colour. No gradients, no shading, no new colours; check every prop colour against the palette.
- **Shape**: simple and rounded, at most about 12 parts (a camera is body, top, lens rings, flash, button), proportions true to the real object (a phone is taller than wide, a receipt has a torn edge). For a real-world object, look at real reference photos of it first and draw from them; the photos are inputs only and never go on a page.
- **Scale**: say the prop's real size against the character in the plan ("phone about the size of its head"). A held prop keeps that scale; a beside or hero prop may be drawn larger, like a close-up insert.
- **Size classes** (longest side on the 1080 x 1350 page): `s` 150-299 px, `m` 300-599 px, `hero` 540-960 px and at least 40% of the page height. Smaller than 150 px reads as clutter; use an emotion mark or nothing.
- **Placement**: in the scene below the narration band, at least 20 px inside the page, never over the character's face box (layout.md), never under a balloon, narration or title. Use the scene grid in `references/layout.md` to find free cells.
- **Text**: a drawn prop carries no letters. Words a prop must show (a chat message, an error title) go into a text prop (phone screen, error window, memo), which is also drawn in this style.

### Emotion marks

Small drawn marks that say what the face says: sweat drop, sparkle, shock lines, question mark, heart. At most 2 per page, placed around the head, and only when they match the expression. Still left out: random sparkles and stars, highlighter, underlines, frames, page numbers, doodles that mean nothing.

Write the block:

```
STYLE LOCK
canvas 1080x1350; narration band 64-210; text margin 20 (narration/title 70-90)
paper #... (+grain 3-6%)  ink #...  line #... (4-6px, wobble)
mine #...  other #...  shout #...  accent #...
contrast: ink/paper x:1, ink/mine x:1, ink/shout x:1, line/paper x:1, accent/other x:1
title: <face> 130-170px | narration: <face> 50-56px | balloon: <face> 56-64px, props 54-60px
balloons: round, wobble outline, tail to speaker; character=mine, others=other; shout=jagged shout
framing: full / big / close, all three used; >=40% visible; no repeat of framing+side on consecutive pages
marks: <=2 per page, matching the face; colour field on <=3 pages
props: <ids from the prop set>; line #... 4-6px same pen; fills from the palette only; s 150-299 / m 300-599 / hero 540-960
props per page <=3; cover >=1; >=75% of other pages >=1; hero pages <=2; never over the face or text
no: text boxes over the face, rectangles for speech, random sparkles, frames, page numbers, stock photos, screenshots, logos
```

## Step 4: Anchor page

First draw the **prop sheet**: every prop in the set on one plain page, in the style lock's line and fills, at their planned scale next to the character (block D in `references/prompts.md`). Check it against the prop rules and the reference photos; it is the look every page copies for its props.

Then draw the setup page (page 2) before the cover. It fixes the narration style, the balloon style, the paper and the character's big framing, and it is the page every other page copies.

Prompt it from the character card, the style lock and its plan row, with the character image as reference (block A in `references/prompts.md`). Inspect it (Step 6). Repeat until it passes. If the user wanted a check-in, show it now.

## Step 5: The other pages

For each remaining page, cover included, give the generator:
- the character image (looks),
- the passed anchor page (paper, lettering, balloons, palette),
- the prop sheet, when the page draws a prop,
- the character card, the style lock and that page's plan row, written out in full each time (block B).

Make one page per call. If the tool limits the number of images, say which pages are done and which are left.

### Text: in the image or on top

Image models still misspell Korean. Choose per page:
- **In-image text** for shouts and lines up to about 8 characters.
- **Overlay text** for narration, prop text, exact numbers and anything that failed twice: generate the page with empty balloons and props (block C), then set the text yourself with HTML/CSS (or any layout tool) in the style-lock faces and colours, and render to PNG at the canvas size. This route is exact and repeatable, and lets the checks in `references/layout.md` run on the real layout.

## Step 6: Inspect and repair

Open every page and check it against the card, the lock and the plan. Write one line per page: `page N: pass` or `page N: <defect>`.

Defects to look for:
- text: typos, cut-off letters, text outside its balloon or prop, lines too small to read at 390 px wide, a balloon line over 12 characters,
- layout: two text shapes touching, a balloon or prop over the face, text within 20 px of an edge,
- content: missing or repeated points, wrong numbers, claims the user did not give,
- framing: the character smaller than 40% of the page height (unless the page's hero is a prop), the same framing and side as the page before, a framing missing from the post,
- props: a page that should carry a prop has none, a prop outside the set, a prop drawn with a different line weight or a colour off the palette, a photo or screenshot pasted in, a prop over the face or under text, the same prop looking different on two pages, a prop too small to recognise at 390 px,
- palette: a new paper or ink colour; character blending into the paper; a colour field on more than 3 pages,
- character: changed face, colours or proportions; features it never had; details from another image leaking in,
- clutter: marks that do not match the face, more than 2 marks, random sparkles, frames, page numbers.

Repair one defect per pass, with the page plus the anchor (and for character defects, the character image; for prop defects, the prop sheet) attached, saying what to change and what to keep (recipes R1-R8). After two failed passes on the same text defect, switch that page to the overlay route.

## Step 7: Before posting

- [ ] Korean read through once by eye: no typos, no clipped letters, every line readable at 390 px wide.
- [ ] Every must-say point present once; numbers and copied prompts match what the user gave, word for word.
- [ ] The cover reads as a moment or a question, with the character big or close.
- [ ] The closing action names only what the account really gives, with the exact comment keyword if there is one.
- [ ] Pages viewed side by side as thumbnails: one paper, one lettering set, one balloon style; framing visibly changes from page to page; all three framings present.
- [ ] Same character on every page, nothing added.
- [ ] `bun scripts/check-spec.mjs <plan.json>` prints PASS (page count, text budget, framing, prop counts).
- [ ] The topic can be guessed from the thumbnails alone: the props from the set are visible on the cover and most pages, in the character's line and palette, none of them a photo or screenshot.
- [ ] No text over the face, no clutter from the "no" list.

Then hand over:
- `page-01.png` ... `page-NN.png` in posting order,
- `caption.txt`: 3-5 lines that retell the hook as a relatable moment, the takeaway and the closing action, then 5-10 topic hashtags (about 150-400 characters before the hashtags),
- `alt.txt`: one plain Korean line per page describing the scene and its text, for Instagram's alt text,
- the character card, style lock, prop set and prop sheet, so the next post with this character can reuse them.

Reuse: a new post with the same character keeps the saved palette and faces unless the user changes them. A new character gets a new palette.
