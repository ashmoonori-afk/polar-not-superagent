# Landing Page Conversion, Copy and Token System

Adapted from `elayadesign/ai-design-skills` (`landing-page-design`, commit `456d9e0d3e2d`) and `elayadesign/redesign-skill`, reconciled with `design-taste` (`tells.md`) and the motion rule in `design-taste/SKILL.md`.

A landing page is not a homepage. A homepage serves multiple intents; a landing page wins one intent:
**one offer -> one audience -> one primary action.**

When the user's explicit brief or `DESIGN.md` pins a font, palette, radius or motion, the brief wins.

---

## Part A — Conversion Strategy and Copy Structure

### A1. Intake (gather or state a 1-line assumption before building)
- **Purpose**: What is the ONE primary action (trial, demo, buy, waitlist, download)? What exact offer do they get? What counts as conversion?
- **Audience & context**: Who is the ICP? What problem do they solve? Top 3 objections stopping conversion today? Traffic source (ads, search, social, email) and what visitors already know?
- **Proof & assets**: Real logos, numbers, testimonials, case studies, product screenshots/video, guarantees/refund terms.

### A2. Layout Archetypes (pick one in `plan` and state why)
| Type | Use when |
|---|---|
| **A. Product-led hero + sections** | The product is understandable from a hero preview or interactive fragment. |
| **B. Long-form argument** | High skepticism or a new category that needs problem -> mechanism -> proof education. |
| **C. Minimal conversion page** | High-intent traffic (existing audience, waitlist, single download or event). |
| **D. Comparison page** | Search intent targets alternatives ("X vs Y", switching from a named tool). |

### A3. Section Architecture and Build Order
Do not dump a stock 12-section template without an argument (`tells.md`). Every section must carry one claim plus proof; delete sections without a claim. When building a full conversion page, work **section by section** so diffs stay reviewable:
1. **Above the fold**: Headline (outcome + audience), subheadline (how + specificity), ONE primary CTA (verb + what they get; never competing CTAs above the fold), one real proof signal, and the hero product artifact.
2. **The argument**: Problem -> mechanism/benefits (3-5 outcome-driven points; never 3 identical icon-in-box cards — use a 2-column zig-zag, asymmetric split or real UI fragment) -> how it works (3 steps).
3. **Proof & objection handling**: Specific proof beside the claim it supports; FAQ (6-12 real objection questions, moved earlier for high-friction offers); risk reversal (free trial, cancel anytime, guarantee — never invented); final CTA matching the top.

### A4. Conversion Copy Rules
- **Match message to traffic source**: mirror the ad or link promise in the hero.
- **Benefit before feature**: state what changes for the user, with specific numbers over vague verbs ("Cut weekly reporting from 4 hours to 15 minutes", never "Save time and streamline").
- **CTA wording**: verb + what they get ("Start free trial", "Get the checklist"). Never "Learn more" or "Submit".
- **Banned filler**: never write "revolutionize", "supercharge", "cutting edge", "effortless", "transform your workflow", "take it to the next level", "harness the power", or "world class".
- **No invented facts**: prices, stats, customer counts, logos and testimonials must come from the user or a verified source. Use `{{price}}` or `{{testimonial}}` when missing.
- **Typography hygiene in copy**:
  - Sentence case for English headings and buttons.
  - No orphans: apply `text-wrap: balance` on headings and `text-wrap: pretty` on body copy.
  - Intentional line breaks: cap hero heading and subheading at `680px` max-width and break lines where the thought breaks (never split a Korean or English phrase awkwardly).
  - No eyebrow pill above headings unless requested or shown in a chosen reference (`tells.md`).
  - Calm, specific system messages ("Upload failed. The file is over 20 MB." — never `window.alert()`, no exclamation marks).
- **SEO / AEO**: `noindex` ad-only or time-bound campaign pages; index evergreen pages with plain Q&A FAQ markup.

---

## Part B — Visual Token and Geometry System

Use these concrete tokens when a project does not already define its own `DESIGN.md` scale.

### B1. Typography and Named Text Styles
- **Typeface**: derive from the subject (`design-taste`). When a neutral sans/mono default is needed and none is pinned, Geist, Manrope, Geist Mono (for code/numbers with `tabular-nums`), or Poppins are safe defaults; avoid lazy browser defaults (Inter, Roboto, Arial, Open Sans, Helvetica). One typeface per site unless the brief pairs a display/serif voice on purpose.
- **Weight & style**: no italics in UI chrome; cap weights at Semibold (600) or Bold (700) — never 900/Black.
- **Tailwind scale snapping**: every font size must land on the scale below. Never leave arbitrary sizes (`text-[19px]`, `22px`, `1.4rem`); snap any off-scale value to the **closest step below** with its paired line-height.

| Style | Scale step | Size / line-height (px) | Weight | Role |
|---|---|---|---|---|
| `heading-1` | `text-6xl` | 60 / 60 | Semibold | Hero headline |
| `heading-2` | `text-5xl` | 48 / 48 | Semibold | Major section headline |
| `heading-3` | `text-4xl` | 36 / 40 | Semibold | Section headline |
| `heading-4` | `text-3xl` | 30 / 36 | Semibold | Sub-section headline |
| `heading-5` | `text-2xl` | 24 / 32 | Semibold | Large callout |
| `heading-6` | `text-xl` | 20 / 28 | Semibold | Compact heading |
| `title-1..5` | `text-xl`..`text-xs` | 20/28, 18/28, 16/24, 14/20, 12/16 | Medium | Card titles, list leads, nav |
| `body-1..3` | `text-base` | 16 / 24 | Semibold, Medium, Regular | Primary running copy |
| `body-4..6` | `text-sm` | 14 / 20 | Semibold, Medium, Regular | Secondary copy, dense UI |
| `button-lg..xsm` | `text-lg`..`text-xs` | 18/28, 16/24, 14/20, 12/16 | Semibold | Button labels (`button-md` main, `button-sm` header) |
| `caption-1..2` | `text-sm` | 14 / 20 | Medium, Regular | Helper text, timestamps |
| `caption-3..5` | `text-xs` | 12 / 16 | Semibold, Medium, Regular | Badges, metadata, fine print |

### B2. Spacing Scale
Use only these values (px): `0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96` (`Spacing-0` through `Spacing-900`).
- **Main buttons**: `8px` vertical padding (`Spacing-75`), `12px` horizontal padding (`Spacing-100`).

### B3. Corner Radius and Nested Radius Formula
Use Tailwind radius steps (`0, 2, 4, 6, 8, 12, 16, 24, 9999`).
- **Nested radius formula**: when a shape sits inside another shape and the gap between them is **less than 32px**:
  `inner radius = outer radius - gap`
  Apply when the result is **greater than 2px**; otherwise keep the inner shape square or unchanged. (Example: outer card `16px` radius with `8px` padding -> inner element `8px` radius.)

### B4. Surfaces, Borders and Icons
- **Flat surfaces**: no background gradients (linear, radial or mesh). Keep accent saturation under 80% and commit to one accent color.
- **Dark mode neutral surfaces** (when dark mode is used and no brand palette overrides): `#000000`, `#181818`, `#1F1F1F`, `#272727`, `#313131`, `#131209`. Do not drop a random dark section into a light page without a neighbouring shade transition.
- **Card borders**: never apply a border to only one side of a card. Borders go all the way around or not at all; divide rows with a `1px` rule element.
- **Viewport height**: use `min-height: 100dvh` instead of `100vh` on full-screen sections to avoid mobile browser bar jumps.
- **Icons**: Phosphor, Solar, or Iconamoon at one consistent stroke weight. Never Material Icons or Material Symbols.

### B5. Motion (governed by the motion rule in `design-taste/SKILL.md`)
- **The motion rule wins over upstream defaults**: pick **one main motion per screen** by reason, keep durations in **100-400ms** (`200-300ms` for layout/screen changes, `100-200ms` for hover/press feedback; `500ms+` feels like a drag), use ease-out `cubic-bezier(0.22, 1, 0.36, 1)` on arrival, animate only `transform` and `opacity`, use `IntersectionObserver` (never unthrottled `scroll` listeners), and stop movement under `prefers-reduced-motion`.
- **Do NOT apply fade-and-rise on every section** (`tells.md`).
- **Optional signature move — word-by-word tagline reveal**: only when chosen in the `design-taste` plan as that screen's one main motion, a mid-page 2+ line benefit statement (`heading-3` to `heading-1`, max-width `680px`) may transition word by word from ~30% opacity to 100% opacity via `IntersectionObserver` or `requestAnimationFrame`-throttled scroll, rendering at full opacity immediately under `prefers-reduced-motion`.

### B6. Interactive States and Ship Checklist
- **Every interactive element** ships with: Hover, Active (`scale(0.98)` or `translateY(1px)`), visible Focus ring (at least 3:1 contrast), skeleton Loading shaped like the layout (no spinner), composed Empty state, and specific inline Error. No dead `#` links; indicate current nav item.
- **Ship requirements**: footer privacy/terms links, branded 404, client-side form validation, skip-to-content link, favicon, `<title>` + meta description + `og:image`, alt text on meaningful images, semantic HTML (`<nav>`, `<main>`, `<section>`), and a verified **390px mobile check** (no horizontal overflow, button labels stay inside, primary CTA visible on the first screen).
