---
name: generative-ui
description: Design, build, restyle, and browser-verify UI screens, components, and streaming AI-generated interfaces ("generative UI" / task UI cards instead of plain text). Use when asked to make a screen look designed, build an AI chat/agent-run/research/PR card that streams in live without layout shift (CLS ~0), or audit and fix spacing, contrast, tap targets, and missing states in a real browser.
---

# Generative UI

Turn plain-language requests into designed, browser-verified interfaces in the project's own stack—and replace walls of AI text with live, streaming task UI cards that build themselves without layout jumps.

## Workflow

Follow these seven steps in order on every UI build or restyle:

1. **Clarify with up to 3 pick-one questions.**
   If the request leaves material choices open (target surface, primary user action, density/tone, or streaming vs. static state), ask at most **3 concise questions**, each offering **2–4 concrete options** the user can pick from. Skip any question already answered by the prompt or existing codebase.
2. **State a one-paragraph build plan.**
   Before writing code, write one short paragraph naming:
   - **Primary action** (the single most prominent control on the screen).
   - **Information priorities 1–3** in reading order.
   - **Required content** (every field, datum, status chip, and control that must appear).
   - **Left out on purpose** (decorative badges, redundant summary tiles, marketing subtitles).
3. **Gather 2–4 real references and name what to borrow.**
   Use Mobbin Pro if connected; otherwise inspect free sources (live product sites, App Store screenshots, open-source repositories, or project reference frames). Name 2–4 concrete references and state the exact layout, typography, or state mechanic borrowed from each (never copy trademarks or proprietary assets).
4. **Build in the project's stack and tokens.**
   Consult `references/ui-kinds.md` for the UI kind(s) involved. Reuse the project's existing framework (React, Next.js, Vue, Svelte, or plain HTML/CSS), design tokens (`DESIGN.md`, CSS variables, Tailwind config), and component primitives. If the project has no tokens, define a minimal token block first (`--bg-canvas`, `--bg-surface`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border-subtle`, `--accent`, spacing scale, and type scale).
5. **Run the browser checker at 390 and 1280 widths.**
   Execute `scripts/ui-check.mjs` against the live URL or local HTML file:
   ```bash
   bun <skill-dir>/scripts/ui-check.mjs <url-or-html-path> --out <output-dir>
   ```
   The script launches the installed Google Chrome (`channel: 'chrome'`), renders at `390x844` (mobile) and `1280x800` (desktop), saves full-page screenshots, and outputs structured JSON findings (`must-fix` and `should-fix`).
   *Fallback:* If Node.js/Bun or Chrome/Edge is unavailable on the host, offer to install it or perform a static code audit against the same checklist while explicitly noting screenshots were skipped.
6. **Fix every `must-fix` finding and re-verify.**
   Resolve all `must-fix` issues—horizontal overflow, WCAG AA contrast failures, body font `< 12px`, mobile tap targets `< 44px`, overlapping/clipped text, mobile viewport edge crowding (`< 12px` padding), missing `alt` attributes, console errors, and layout shift (`CLS > 0.10`)—plus any applicable `should-fix` state gaps. Re-run `scripts/ui-check.mjs` until `must-fix` count is `0`.
7. **Report with screenshots and findings summary.**
   Present the mobile and desktop screenshots, the before/after finding counts by severity, and a concise summary of what was built and verified.

---

## Visual Language (Operational & Streaming Task UI)

When building generative UI cards, agent workflows, or operational tools without a conflicting brand guide, apply these rules distilled from production generative-UI surfaces:

- **Quiet neutral palette + one functional accent.**
  Set a warm or cool neutral canvas (`#f3f2ee` or `#f8fafc` in light mode; `#0f1115` in dark mode) behind a crisp card surface (`#ffffff` / `#161920`) with a `1px solid rgba(0, 0, 0, 0.07)` border and soft ambient shadow (`0 4px 20px rgba(0, 0, 0, 0.04)`). Keep 90% of the surface monochrome; reserve semantic color strictly for live status (`#2563eb` active blue, `#059669` verified green, `#d97706` conflict/warning amber, `#dc2626` error red).
- **Dense, scannable micro-typography.**
  Use `14px–15px` (`font-weight: 600`) for the card title, `12.5px–13px` (`line-height: 1.4`) for timeline and data rows, and `12px` for chips and secondary controls. Apply `font-variant-numeric: tabular-nums` to all counters, prices, percentages, and timers so digits never jitter as values tick.
- **Right-aligned monospace metadata.**
  Pin source domains (`linkedin.com`, `freightwaves.com`), git hashes (`7e0c3b`), and relative timestamps (`You · now`, `21s`) to the trailing edge in a monospace stack (`11.5px–12px`, muted ink). Keep primary findings left-aligned with `text-overflow: ellipsis` so the two columns never collide.
- **Soft semantic category pills.**
  Use compact inline tags (`padding: 2px 7px`, `border-radius: 5px`, `font-size: 11.5px`, `font-weight: 500`) in low-saturation pastel fills with WCAG AA ink (e.g., `people` in `#eef4ff` / `#1d4ed8`, `news` in `#ecfdf5` / `#047857`, `company` in `#f3f4f6` / `#374151`). Only attach pills to items carrying real category or branch state.
- **Status chips that morph in place.**
  Render a horizontal row of summary pills (`border: 1px solid var(--border-subtle)`, `border-radius: 999px`) that transition in place from `queued` (`• Funding queued`) to `checking` (`◌ Company checking`) to `done` (`✓ Company 6 pages`, `✓ Funding $52M`). Pre-allocate `min-width` and fixed height so state transitions never reflow neighboring chips.
- **Timeline / stepper spine with branch awareness.**
  Anchor activity rows to a left-hand vertical spine (`1px` line in `#d1d5db` or semantic accent) with `6px–8px` node dots. For parallel tasks or git histories, render clean branch/merge connector paths in SVG or CSS grid columns.
- **Highlight-on-insert wash.**
  When a new finding or step row enters the timeline, apply a subtle warm or accent background tint (`#fdf8ef` or `rgba(37, 99, 235, 0.06)`) that smoothly fades to transparent over `700ms`.
- **Decode-text reveal used sparingly.**
  At the single active streaming head, a newly arriving line may briefly show a single-line scrambled alphanumeric token string (`Priy3 37prl wg5h...`) of the exact target length for `250ms–400ms` before resolving into the verified sentence. Never use multi-line scramble blocks that change row height.
- **End-state summary bar with timing.**
  Place a footer bar at the bottom of the card that shows live progress during execution (`◌ Reading linkedin.com · 6 of 11 sources` + secondary action `Email me when ready`) and resolves in place to the final verdict (`✓ Brief ready · 11 sources in 21s` + primary action `Copy brief` or `Merge`).

---

## Task UI Instead of Text

When an AI agent performs research, executes code/git operations, or evaluates options, render a **structured task card** instead of streaming paragraphs of conversational markdown.

### Canonical Task Card Archetypes

1. **Research Brief Card**
   - *Header:* Subject name (`Kestrel Freight`) + muted domain (`kestrelfreight.com`) on the left; live status badge (`• Researching` -> `✓ Brief ready`) on the right.
   - *Body:* Fixed-slot or pre-reserved vertical timeline where findings insert with category pill (`company`, `news`, `people`) and right-aligned source domain.
   - *Summary strip:* Morphing status chips (`✓ Company 6 pages`, `✓ Funding $52M`, `✓ News 3 stories`, `✓ People 3 people`).
   - *Footer:* Source progress counter + elapsed time + `Copy brief` / `Export` action.
2. **Agent Run / Execution Timeline Card**
   - *Header:* Task title + live elapsed timer (`Worked for 5s`) + overall status chip.
   - *Body:* Ordered step rows with status icon, tool/command label, inline parameter badge, and right-aligned duration.
   - *Footer:* Current sub-step progress (`Running 27 of 42 tests`) + `Stop run` / `Retry failed step`.
3. **PR / Merge & Conflict Resolution Card**
   - *Header:* PR title and number (`Refresh sessions in the auth middleware #128`) + state dot (`• Open`).
   - *Body:* Commit/step graph showing branch merges (`feat/session-refresh`, `main`), right-aligned `hash author · time`, and check chips (`✓ Tests 42 passed`, `✓ Lint passed`, `✓ Types passed`, `✓ Preview ready`).
   - *Interactive resolution slot:* When a conflict occurs (`⚠ 3 conflicts with main`), render an inline code diff card with a primary `Resolve conflicts` action that transitions in place to `✓ Ready to merge` + `Merge`.
4. **Comparison / Decision Card**
   - *Header:* Decision question + recommended option badge.
   - *Body:* Structured comparison matrix with aligned criteria rows, trade-off pills, and tabular numbers.
   - *Footer:* One-click selection buttons (`Apply recommended`, `Customize`).

### Event-to-Component Mapping

| Stream Event | UI Target | Visual Update Rule |
|---|---|---|
| `run.started` | Card shell + Header badge | Mount card with pre-reserved body height; set header status to `checking` (`• Running`). |
| `step.queued` | Timeline row + Status chip | Render slot in muted ink (`queued`); reserve full row height (`min-height: 28px`). |
| `step.started` | Active timeline node + Footer | Swap node dot to animated spinner; update footer progress text in place. |
| `finding.decoding` | Active timeline row text | Render single-line fixed-width scrambled placeholder with warm highlight wash. |
| `finding.committed` | Active timeline row | Resolve text in place, attach category pill + right-aligned domain, fade highlight wash. |
| `chip.updated` | Summary status chip | Swap spinner/dot to `✓`, update count (`6 pages`, `$52M`) inside fixed-width pill. |
| `conflict.detected` | Inline resolution block | Reveal pre-allocated diff/action drawer; set footer status to `conflict` (`⚠`). |
| `run.completed` | Header badge + Card footer | Set status to `done` (`✓`), display total items + elapsed seconds, enable primary CTA. |
| `run.failed` | Active row + Card footer | Set status to `failed`, show plain-language error cause beside the failed step + `Retry`. |

### Deterministic State Machine

Every step row and status chip follows a strict four-state contract (`queued` -> `checking` -> `done` | `failed`, plus optional `conflict` branch):

- **`queued`**: Muted dot (`#9ca3af`), secondary ink, reserved box dimensions.
- **`checking`**: Animated spinner or pulsing blue dot (`#2563eb`), primary ink, active progress label, `Stop`/`Cancel` available.
- **`conflict` / `needs-input`**: Amber warning glyph (`#d97706`), inline context/diff preview, single primary resolution button.
- **`done`**: Checkmark glyph (`#059669`), verified metric/value in tabular numerals, primary completion action enabled.
- **`failed`**: Error glyph (`#dc2626`), concise failure reason in row, inline `Retry` button preserving completed prior steps.

---

## Generative UI (Streaming) Rules

Streaming interfaces fail when incoming tokens or events push the layout around while the user is reading or clicking. Enforce these eight rules on every streaming surface:

1. **Reserve space with skeletons sized to final content.**
   Allocate the exact container dimensions (`min-height`, grid tracks, row slots) on initial mount before the first event arrives. Skeleton placeholders must match the line height, padding, and border-box of the resolved rows so swapping skeleton -> content produces zero height delta.
2. **Append-only updates or slot-reserved top insertion.**
   Never mutate or re-order already-resolved rows above the fold. When inserting newest findings at the top of a feed, either pre-allocate a fixed-height timeline container with smooth internal transform transitions or replace pre-rendered skeleton slots from bottom to top so external page elements never shift.
3. **Stable keys on every node.**
   Key every list item, chip, and step by its deterministic domain ID (`step.id`, `source.url`, `commit.sha`), never by array index, so React/Vue/Svelte/DOM reconciliation updates nodes in place without remounting or losing focus.
4. **Zero layout shift (`CLS ~ 0`).**
   Cumulative Layout Shift during streaming must stay `<= 0.02` (and never exceed `0.10`). Buttons, chips, and status bars must keep identical `width` and `height` across `queued`, `checking`, and `done` states (`min-width` sized to the longest label).
5. **Progressive reveal per item.**
   Animate newly resolved items using compositor-only properties (`opacity`, `transform: translateY()`) over `180ms–260ms ease-out`. Collapse all motion to an instant opacity swap when `@media (prefers-reduced-motion: reduce)` matches.
6. **Charts that animate data in on fixed axes.**
   Lock chart container height, SVG `viewBox`, X/Y axis domains, tick labels, and legend dimensions on frame 1. Stream incoming data points by animating path `stroke-dashoffset`, bar scale, or point opacity inside the fixed coordinate space—never rescaling axes mid-stream without a smooth interpolation inside a fixed box.
7. **Complete state coverage (`loading`, `partial`, `empty`, `error`).**
   Every data region must declare and handle:
   - *Loading:* Immediate skeleton matching final geometry.
   - *Partial / Streaming:* Live progress indicator (`6 of 11 sources`) with usable partial rows.
   - *Empty:* Clear explanation + one primary action to populate or broaden the query.
   - *Error:* Cause displayed beside the affected step with a one-click `Retry` that preserves already-streamed data.
8. **Abort and retry controls.**
   While streaming is active, expose a keyboard-accessible `Stop` / `Cancel` button (at least `44x44px` hit target on mobile, `24x24px` on desktop) that cleanly halts the stream and leaves partial results readable. On interruption or error, swap in `Retry` in the exact same button slot.

---

## Reference Catalog & Browser Checker

- **UI Kinds Reference (`references/ui-kinds.md`):** Read the matching section(s) before building any of 36 common UI patterns (forms, tables, dashboards, charts, pricing, settings, onboarding, auth, command palette, menus, modals, toasts, empty states, search, filters, feeds, detail views, checkout, mobile nav, phone forms, AI chat, agent timelines, citations, file upload, calendars, maps/itineraries, notifications, profiles, heroes, comparison tables, and more).
- **Browser Checker (`scripts/ui-check.mjs`):** Run on every build and example to capture `390x844` and `1280x800` screenshots and verify zero `must-fix` layout, contrast, typography, tap-target, or CLS defects.
