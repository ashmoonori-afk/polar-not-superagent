# Prompt blocks and repair recipes

Fill the `<...>` slots and paste the character card and style lock from SKILL.md in full every time. Image models forget anything you leave out, so repeat it in each call instead of writing "same as before". Page text goes in quotes, in Korean, exactly as it should appear.

## A. Anchor page (first body page)

```
Make page <N> of a <total>-page Instagram carousel comic, <canvas>.
Attached image 1 is the character. Copy its looks exactly; change only pose and expression.

<CHARACTER card>
<STYLE LOCK block>

Page plan:
- title (one line, centred in the title band): "<title>"
- info card (rounded, card colour, line outline): "<card text>"
- scene: <what the character does>, with one speech balloon: "<balloon text>"

Keep empty space around text. Korean text must be spelled exactly as quoted.
Leave out everything on the style lock's "no" list.
```

## B. Every other page

```
Make page <N> of the same carousel, <canvas>.
Image 1 is the character: copy its looks exactly.
Image 2 is the approved page <anchor N>: match its title font, size, colour and height,
its balloon and card style, its palette and the character's size on the page.
Do not copy image 2's text or scene.

<CHARACTER card>
<STYLE LOCK block>

Page plan:
- role: <cover | body | close>
- title: "<title>"
- <card / panels / scene description>
- balloon(s): "<text>"
```

For the cover, add: "The title may run over 2-3 lines and fill the top third. No info card."
For a comparison page, add: "Two rounded panels side by side, left: <A>, right: <B>, the same character in both."

## C. Text-free page for the overlay route

```
Same as block <A or B> for page <N>, but draw NO letters anywhere.
Keep the title band empty, keep each balloon and card empty, sized for: "<text it will hold>".
```

Then set the text with HTML/CSS at the canvas size, in the style-lock fonts and colours, and render to PNG. Put `<meta charset="utf-8">` first in the head, or Korean renders as garbage, and check that the web fonts loaded (`document.fonts.check(...)`) before the screenshot. Compare the title position with the anchor page by laying one over the other.

## Repair recipes

Attach the page to fix. Name one defect, what to change and what must not move.

**R1 Character drift**
```
Image 1 is the character as designed; image 2 is the page to fix.
Redraw the character in image 2 so face, eyes, mouth, colours and proportions match image 1.
Remove <added feature>. Keep the pose, expression meaning, balloons, text and layout.
```

**R2 Title drift**
```
Image 1 is the page to fix; image 2 is the approved anchor page.
Change only the title: same font, size, colour, centre line and height as image 2's title.
Keep the text "<title>". Everything below the title band stays as it is.
```

**R3 Change one line of text**
```
Change only this text: "<current>" -> "<new>".
Same font, colour, size and place; no overlap with other shapes. Nothing else changes.
```

**R4 Text keeps breaking**
```
Remove every letter from this page. Keep balloons, cards, the character, the background and the
empty space where text goes.
```
Then finish the page through the overlay route (block C).

**R5 Palette off**
```
Recolour only the background to <paper> and balloons and cards to <card>.
Do not change the character's colours or lines. Text stays <ink>.
```

**R6 Unwanted decoration**
```
Remove <sparkles / burst lines / highlighter / underline / frame / page number> and fill the
background behind them in the same colour. Keep arrows, chart lines and icons that explain something.
```
