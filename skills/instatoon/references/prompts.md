# Prompt blocks and repair recipes

Fill the `<...>` slots and paste the character card and style lock from SKILL.md in full every time. Image models forget anything you leave out, so repeat it in each call instead of writing "same as before". Page text goes in quotes, in Korean, exactly as it should appear.

## A. Anchor page (the setup page)

```
Make page <N> of a <total>-page Instagram carousel comic, <canvas>, drawn as a comic scene.
Attached image 1 is the character. Copy its looks exactly; change only pose, expression and framing.

<CHARACTER card>
<STYLE LOCK block>

Page plan:
- paper: warm off-white with a fine paper grain, no white, no gradient banner
- narration (top band, centred, light hand lettering, at most 2 lines): "<narration>"
- framing: <full | big | close>, character on the <left | right | centre>, cut by the bottom edge if big or close
- scene: <what happens>; prop: <phone screen / memo / sign> showing "<exact prop text>"
- balloon(s): <round, wobbly outline, tail to the speaker; character's balloon in its signature colour> "<text>"
- shout (if any): <jagged yellow burst> "<one or two words>"
- emotion marks (at most 2, around the head): <sweat drop / sparkle / shock lines / question mark / heart>

Keep every balloon and prop off the character's face. Korean text must be spelled exactly as quoted.
Leave out everything on the style lock's "no" list.
```

## B. Every other page

```
Make page <N> of the same carousel, <canvas>.
Image 1 is the character: copy its looks exactly.
Image 2 is the approved page <anchor N>: match its paper and grain, its narration lettering, its balloon
shapes, outline weight and fills, and its palette. Do not copy image 2's text, scene or framing.

<CHARACTER card>
<STYLE LOCK block>

Page plan:
- role: <cover | setup | stuck | turn | body | caution | close>
- framing: <full | big | close>, side <left | right | centre> (different from page <N-1>)
- narration: "<narration>"
- scene and prop: <description>, prop text "<exact text>"
- balloon(s): "<text>" (speaker: <character | other>)
```

For the cover, add: "No narration. A small dark pill tag at the top reading \"<series>\". The title in heavy hand lettering over 2-3 lines fills the top 25-40% of the page: \"<title>\". The character is big or close below it, reacting."
For a two-sided comparison, add: "Split the scene in two halves with the same character in both: left <A>, right <B>; one balloon per half."

## C. Text-free page for the overlay route

```
Same as block <A or B> for page <N>, but draw NO letters anywhere.
Keep the narration band empty, keep each balloon and prop empty, sized for: "<text it will hold>".
```

Then set the text with HTML/CSS at the canvas size, in the style-lock faces and colours, and render to PNG. Put `<meta charset="utf-8">` first in the head, or Korean renders as garbage, and check that the web fonts loaded (`document.fonts.check(...)`) before the screenshot. Run the checks in `layout.md` on the laid-out page. A hand-drawn wobble for balloon and prop outlines can be made with one SVG filter (`feTurbulence` at about 0.035 plus `feDisplacementMap` at scale 4-6) applied to the shape layer only, never to the text, so the letters stay sharp.

## Repair recipes

Attach the page to fix. Name one defect, what to change and what must not move.

**R1 Character drift**
```
Image 1 is the character as designed; image 2 is the page to fix.
Redraw the character in image 2 so face, eyes, mouth, colours and proportions match image 1.
Remove <added feature>. Keep the pose, framing, expression meaning, balloons, text and layout.
```

**R2 Lettering drift**
```
Image 1 is the page to fix; image 2 is the approved anchor page.
Change only the <narration | balloon text>: same hand lettering, size, colour and place as image 2's.
Keep the text "<text>". Everything else stays as it is.
```

**R3 Change one line of text**
```
Change only this text: "<current>" -> "<new>".
Same lettering, colour, size and place; no overlap with other shapes. Nothing else changes.
```

**R4 Text keeps breaking**
```
Remove every letter from this page. Keep balloons, props, the character, the paper and the
empty space where text goes.
```
Then finish the page through the overlay route (block C).

**R5 Palette off**
```
Recolour only the paper to <paper> with its grain, the character's balloons to <mine> and the others to
<other>. Do not change the character's colours or lines. Text stays <ink>.
```

**R6 Clutter**
```
Remove <random sparkles / stars / highlighter / underline / frame / page number / extra marks> and fill the
paper behind them. Keep at most 2 emotion marks that match the face, and keep arrows and icons that
explain something.
```

**R7 Framing repeat or too small**
```
Image 1 is the character; image 2 is the page to fix.
Redraw the character in a <full | big | close> framing on the <left | right | centre>, so it covers at
least 40% of the page height<, cut by the bottom edge>. Keep the narration, balloons, props and their text
where they are, and keep them off the face.
```
