# DESIGN.md — Generative UI Streaming Agent-Run Demo

## 1. Visual Direction & Grounding
- **Surface archetype:** Operational streaming task UI card ("Research Brief Card") that builds itself live as agent events arrive.
- **Reference anchors:** Distilled from production generative-UI research and PR-merge cards—warm neutral canvas, crisp white card container, vertical multi-track timeline spine, brief decode-text reveal + highlight-on-insert wash, morphing status chips with stable geometry, right-aligned monospace domains, and bottom composer.

## 2. Color Tokens (Light & Dark Mode)
| Token | Light Value | Dark Value | Role & Contrast |
|---|---|---|---|
| `--bg-canvas` | `#f3f2ee` | `#0f1115` | Quiet warm-neutral page backdrop |
| `--bg-surface` | `#ffffff` | `#161920` | Primary card and composer surface |
| `--bg-subtle` | `#f8f7f4` | `#1e222b` | Skeleton slot and footer bar fill |
| `--bg-highlight` | `#fdf6e7` | `#262318` | Highlight-on-insert row wash (fades to transparent) |
| `--text-primary` | `#111827` | `#f3f4f6` | Card title and resolved finding text (16.8:1 on white) |
| `--text-secondary` | `#374151` | `#d1d5db` | Secondary rows and chip labels (10.3:1 on white) |
| `--text-muted` | `#525866` | `#9ca3af` | Monospace domains and timestamps (7.0:1 on white, AA pass) |
| `--border-subtle` | `rgba(17, 24, 39, 0.09)` | `rgba(255, 255, 255, 0.10)` | Card, chip, and divider hairlines |
| `--accent-blue` | `#1d4ed8` | `#60a5fa` | Active `checking` status dot and focus rings (6.7:1) |
| `--accent-green` | `#047857` | `#34d399` | Completed `done` checkmarks and status (5.4:1) |
| `--accent-danger` | `#b91c1c` | `#f87171` | Failed step indicator and error banner (6.4:1) |
| `--pill-people-bg` / `--pill-people-fg` | `#eef4ff` / `#1e40af` | `#1e293b` / `#93c5fd` | `people` category tag (7.6:1) |
| `--pill-news-bg` / `--pill-news-fg` | `#ecfdf5` / `#065f46` | `#064e3b` / `#6ee7b7` | `news` category tag (7.3:1) |
| `--pill-company-bg` / `--pill-company-fg` | `#f3f4f6` / `#374151` | `#1f2937` / `#e5e7eb` | `company` category tag (9.5:1) |

## 3. Typography & Spacing Scale
- **Font stacks:**
  - `--font-sans`: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - `--font-mono`: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
- **Type scale:**
  - `--text-title`: `15px` (`line-height: 1.35`, `font-weight: 600`)
  - `--text-body`: `13px` (`line-height: 1.45`, `font-weight: 400`)
  - `--text-meta`: `12px` (`line-height: 1.35`, `font-variant-numeric: tabular-nums`)
- **Spacing scale:** `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 20px`, `--space-6: 24px`.

## 4. Layout
`Layout: centered single-column workspace (max-width 640px, 16px mobile / 32px desktop gutter) stacking Research Brief Card -> Context Pill -> Prompt Composer; 0 sticky bars.`

## 5. Screen Brief
- **Primary action:** `Copy brief` (in card footer once streaming finishes; `Stop` while streaming).
- **Information priorities:**
  1. Target company header (`Northstar Freight · northstarfreight.io`) and live run state (`Researching` -> `Brief ready`).
  2. Streaming findings timeline with category pills (`people`, `news`, `company`) and source domains.
  3. In-place category status chips (`Company`, `Funding`, `News`, `People`) and source progress counter (`11 of 11 sources in 18s`).
- **Left out on purpose:** Decorative side stripes on cards, unacted-on KPI stat tiles above the card, marketing slogans, and multi-line unreserved text expansion.
- **Required content:** Company title + domain, status indicator, 6 timeline finding slots, 4 morphing status chips, progress footer with elapsed time + primary action button, state switcher (`Replay`, `Empty`, `Error`), and prompt composer.
