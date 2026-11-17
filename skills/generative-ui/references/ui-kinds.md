# UI Kinds Reference (36 Patterns)

Practical layout, spacing, typography, and state rules for 36 UI kinds. Read the matching entries before building or restyling a screen.

---

## 1. Forms (General)
- **Single-column vertical flow:** Stack fields in one column (`max-width: 480px`) with `16px–20px` between fields and `24px–32px` between logical fieldsets; only pair closely coupled short inputs (e.g., City + Postal Code, First + Last Name on desktop).
- **Persistent labels above inputs:** Always render visible `<label>` elements `6px` above the input (`13px`, `font-weight: 500`); never rely on placeholder text as the label.
- **Input geometry:** Keep height at `40px–44px` (`min-height: 44px` on touch viewports), horizontal padding `12px`, `1px` border with `3:1` contrast, and a `2px` `focus-visible` ring.
- **Inline validation & states:** Reserve `18px` below inputs or render error messages with cause + fix right below the offending field (`role="alert"`); keep submit button dimensions identical across idle, submitting (spinner overlay), and disabled states.

## 2. Phone & Mobile Forms
- **Input modes and keyboards:** Set explicit `type` and `inputmode` (`tel`, `numeric`, `email`, `url`) plus `autocomplete` tokens (`one-time-code`, `tel-national`, `cc-number`) so mobile OS keyboards open the right layout immediately.
- **Prevent iOS auto-zoom:** Set input font size to at least `16px` on mobile (`@media (max-width: 640px)`) or lock viewport scaling cleanly without breaking pinch-zoom accessibility.
- **Touch targets and sticky CTA:** Make every field, checkbox row, and country-code selector at least `44x44px` with `8px+` vertical gap; pin the primary submit action in a bottom bar respecting `env(safe-area-inset-bottom)`.
- **Chunked formatting:** Auto-format phone numbers, OTP codes, and dates as the user types while allowing raw paste without stripping valid characters.

## 3. Data Tables
- **Alignment by data type:** Left-align text, IDs, and status pills; right-align numbers, currencies, and durations with `font-variant-numeric: tabular-nums`; center-align single icons or checkboxes only.
- **Row density and scanning:** Maintain `36px–44px` row height, `12px–16px` horizontal cell padding, and `1px` neutral row hairlines (`rgba(0,0,0,0.06)`); use subtle row hover wash rather than zebra striping plus heavy vertical gridlines.
- **Sticky headers & responsive overflow:** Keep `<thead>` sticky during vertical scroll; on narrow viewports (`390px`), wrap the table in an explicit horizontal scroll container (`overflow-x: auto`) with a sticky first identifier column or collapse secondary columns into an expandable row detail.
- **Empty, loading, and bulk states:** Render skeleton rows matching exact column widths while loading; show a contextual action bar when rows are selected without shifting table vertical position.

## 4. Dashboards & KPI Cards
- **Decision-backed metrics only:** Limit summary rows to 3–4 KPI cards maximum; every metric must include its comparison basis (`+12.4% vs last 30d`, `tabular-nums`) and unit.
- **Grid discipline:** Use a 12-column CSS Grid on desktop (`gap: 16px–20px`) collapsing to 1 column on `390px` mobile (or a 2x2 compact summary strip when values are short).
- **Card hierarchy:** Inside each KPI card, order: muted label (`12px`) -> primary value (`24px–28px`, `font-weight: 600`) -> delta + period (`12px`). Never add decorative side stripes or unacted-on sparklines that clip.
- **Independent region loading:** Load and error-handle each dashboard panel independently so one slow query never blanks the entire page.

## 5. Charts & Data Visualizations
- **Fixed coordinate space first:** Lock chart container height (`220px–320px`), SVG `viewBox`, and axis label gutters before data points arrive so streaming or filtering causes zero layout shift (`CLS = 0`).
- **Direct labeling over distant legends:** Limit series to 3–4 per chart; label lines directly at their terminal point or place a compact horizontal legend with `tabular-nums` values above the plot area.
- **Axis and grid restraint:** Use 3–5 horizontal Y-axis gridlines (`1px dashed` or `rgba(0,0,0,0.06)`), zero vertical gridlines unless time-scrubbing requires them, and unrotated axis labels (`12px`, `4.5:1` contrast).
- **Accessible fallback & tooltips:** Provide an interactive keyboard-reachable scrub/table toggle or `aria-label` summary with key highs, lows, and trends.

## 6. Pricing Pages & Plan Cards
- **3-tier maximum focal structure:** Present at most 3–4 plans side by side on desktop (`gap: 20px`), stacking vertically on mobile with the recommended plan visually distinguished by a subtle tonal fill or top eyebrow badge (`Most popular`), never by scaling the card taller to break row alignment.
- **Aligned anatomy across tiers:** Keep plan name, one-line audience description, price Lockup (`$29 / month`, `tabular-nums`), primary CTA button (`width: 100%`, `min-height: 44px`), and feature list starting at the exact same Y-coordinate across desktop columns.
- **Billing toggle stability:** Switching Monthly <-> Annual must update prices in place without shifting card height or reflowing the feature checklist below.
- **Incremental feature lists:** State "Everything in Starter, plus:" followed by 5–7 concrete capability bullets rather than repeating 25 identical rows in every card.

## 7. Comparison Tables
- **Sticky plan/option header:** Pin the top option header row (`position: sticky; top: 0`) with compact CTA buttons inside each column header so users can act after scrolling 30 rows down.
- **Grouped capability sections:** Group rows under clear category subheaders (`Security`, `Usage limits`, `Support`) with `12px–16px` vertical cell padding and left-aligned row labels.
- **Accessible boolean indicators:** Pair checkmarks (`✓`) and dashes (`—`) with `aria-label="Included"` / `"Not included"` and use distinct ink contrast (`#059669` vs `#9ca3af`), never color alone.
- **Mobile switcher or horizontal scroll:** On `390px` width, either provide a 2-tab plan switcher above a 2-column table or use a clean `overflow-x: auto` container with a sticky left feature column (`width: 140px`).

## 8. Settings & Preferences Screens
- **Sectioned horizontal split (desktop) / stack (mobile):** Pair a left section description (`240px` width: title + 1-sentence explanation) with a right control card (`max-width: 560px`), stacking cleanly on mobile.
- **Immediate vs. batched save clarity:** Toggles (`role="switch"`, `44x44px` hit area) that take effect immediately show an inline saved indicator; multi-field text changes use an explicit `Save changes` / `Discard` bar that activates only when dirty.
- **Destructive zone isolation:** Place irreversible actions (`Delete workspace`, `Revoke key`) at the bottom of the page in a neutral bordered container with an explicit confirmation modal requiring intent verification.
- **No orphan subtitles:** Keep setting labels self-explanatory; add a muted helper line only when the consequence of toggling is non-obvious.

## 9. Onboarding & Multi-Step Wizards
- **Progress visibility:** Show a compact step indicator (`Step 2 of 4` or segmented bar) at the top and keep the card container height stable across steps (`min-height`).
- **One decision per step:** Ask for one logical group of inputs per screen; always provide a visible `Back` button and a `Skip for now` option on non-mandatory steps.
- **Smart defaults & live preview:** Pre-select the 80% default option and, where possible, update a live preview panel on the right as the user configures their workspace.
- **Zero dead ends:** Completing the final step lands directly in the populated product surface with a pre-filled starter item, never an empty blank screen.

## 10. Authentication (Sign-In, Sign-Up, OTP, Passkeys)
- **Focused card geometry:** Center a single auth card (`max-width: 400px`, `padding: 28px–32px` on desktop, `20px` on mobile) with brand mark, clear title (`Sign in to Acme`), and zero marketing clutter.
- **SSO / Passkey priority:** Place primary passwordless/OAuth buttons at the top (`height: 44px`), separated from email/password by a neutral `1px` `or` divider.
- **Password & paste ergonomics:** Never block paste on password or OTP fields; include a `44x44px` Show/Hide password toggle with `aria-pressed` and set `autocomplete="current-password"` / `"new-password"`.
- **Specific error feedback:** Render auth failures above the form or beside the field in plain text (`Incorrect email or password`) without clearing the typed email address.

## 11. Command Palette (`Cmd+K`)
- **Top-anchored modal placement:** Position the palette at `15%–20%` from the top of the viewport (`width: min(600px, calc(100vw - 32px))`), never vertically centered, so changing result counts only grow/shrink the bottom edge.
- **Instant keyboard loop:** Auto-focus the search input on open; highlight index `0` by default; support `ArrowUp`/`ArrowDown`, `Enter` to execute, `Escape` to close, and group headers (`Recent`, `Actions`, `Navigation`).
- **Row anatomy:** Each result row (`height: 40px–44px`) shows leading icon (`16px`), primary label (`13px`), optional breadcrumb/category in muted ink, and right-aligned keyboard shortcut kbd pills (`⌘P`).
- **Zero-result fallback:** When no command matches, show a clear empty state offering a fallback search or creation action (`Create issue "<query>"`).

## 12. Menus, Dropdowns & Context Menus
- **Compact geometry & hit areas:** Constrain menu width to `180px–260px` (`padding: 4px`), with each item `min-height: 36px` (`44px` on touch devices) and `8px 10px` internal padding.
- **Logical grouping:** Separate distinct action groups with a `1px` neutral divider (`margin: 4px 0`); place destructive items (`Delete`) at the bottom in danger ink (`#dc2626` on hover/focus).
- **Viewport collision guard:** Flip or shift the popover automatically so it never overflows the `390px` mobile viewport or clips inside an `overflow: hidden` parent.
- **Keyboard & focus management:** Support `ArrowDown`/`ArrowUp`, `Home`/`End`, typeahead character jump, and `Escape` returning focus to the trigger button.

## 13. Modals & Dialogs
- **Use only for interruptive confirmations or focused sub-tasks:** Keep width between `400px` and `560px` (`calc(100vw - 24px)` on mobile) with `20px–24px` padding and a backdrop scrim (`rgba(0,0,0,0.45)`).
- **Action button order:** Right-align footer actions on desktop (Cancel on left, Primary/Confirm on right; stack full-width on narrow mobile with Primary on top); never make a destructive action the default `Enter` target without explicit focus.
- **Focus trap & dismissal:** Trap `Tab` focus strictly inside the dialog (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), close on `Escape` or backdrop click (unless unsaved data would be lost), and restore focus to the opener.
- **Internal scroll boundary:** Cap modal height at `85vh` and scroll only the modal body while keeping header and action footer pinned.

## 14. Toasts & Inline Notifications
- **Non-blocking corner stack:** Anchor toasts at `bottom-right` on desktop (`top-center` or `bottom-center` above bottom nav on mobile, `max-width: 380px`) with `12px` margin from viewport edges.
- **Concise payload:** Limit content to a status glyph, 1-line message (`13px`), and at most one action button (`Undo`, `View`) plus a `24x24px` (`44x44px` touch) dismiss button.
- **Timing & persistence:** Auto-dismiss routine confirmations after `4s–5s` (pause timer on hover/focus); never auto-dismiss error toasts that require user recovery.
- **Stack discipline:** Render at most 3 visible toasts at once; collapse older items or replace in-place when updates belong to the same job ID.

## 15. Empty States
- **Explain + offer the next action:** Center a concise block (`max-width: 360px`) inside the empty container with a simple monochrome icon, a plain-fact heading (`No deployments yet`), a 1-sentence explanation, and the primary creation CTA (`Deploy first branch`).
- **Context-sensitive variants:** Distinguish between *First-use empty* (onboarding CTA), *Filtered-to-zero empty* (`No results for "kestrel"` + `Clear filters` button), and *Cleared/Inbox-zero empty* (quiet confirmation, no noisy CTA).
- **Preserve container geometry:** Keep the empty state inside the exact table/list panel bounds so toggling between empty and populated states does not collapse surrounding layout chrome.

## 16. Search & Results Views
- **Search bar ergonomics:** Provide a prominent input (`height: 44px`) with leading magnifier glyph, instant clear (`×`) button when non-empty (`min 44x44px` touch hit area), and live result count (`24 results in 0.08s`, `tabular-nums`).
- **Result row hierarchy:** Highlight matched query terms with `font-weight: 600` or a subtle tint; display title, 1–2 line snippet (`max-width: 68ch`), category badge, and right-aligned timestamp/source.
- **Stable filtering & pagination:** Keep the search input and filter strip pinned while results update below; preserve scroll position when opening and returning from a result detail.
- **Debounced loading state:** Keep previous results dimmed (`opacity: 0.6`) or show inline row skeletons if a query takes `> 150ms` rather[ than flashing a blank white container.

## 17. Filters & Faceted Navigation
- **Horizontal pill bar (<= 6 facets) or sidebar (> 6 facets):** For operational lists, place quick filter pills (`Status`, `Owner`, `Date range`) in a single row above the list (`gap: 8px`, horizontal scroll or wrap on mobile).
- **Active filter visibility:** Clearly show active filter values inside the pill (`Status: Checking ×`) with a one-click `Reset all` button whenever one or more filters are applied.
- **Count badges:** Show matching item counts (`tabular-nums`) next to facet options so users never pick a filter that yields 0 results by surprise.
- **URL/state sync:** Reflect active filters in query parameters or history state so refresh and back-navigation preserve the filtered view.

## 18. Lists & Activity Feeds
- **Consistent row rhythm:** Use a 3-part row layout: leading avatar/status node (`24px–32px`), flexible main column (primary title + optional 1-line summary), and right-aligned metadata/actions (`tabular-nums` time).
- **Whitespace and hairline separation:** Separate rows with `10px–14px` vertical padding and a `1px` low-alpha divider aligned with the text column (indented past the leading icon) or clean whitespace on dense timelines.
- **Secondary actions on focus/hover + mobile menu:** On desktop, reveal secondary row actions (`Copy`, `Archive`) on `:hover` and `:focus-within` without shifting row height; on mobile, expose them via a `44x44px` `•••` button.
- **Streaming insertion:** When new feed items arrive live, either show a floating `3 new items ↑` pill when scrolled down or smoothly insert at top with a `700ms` highlight wash when at scroll top.

## 19. Detail Pages & Object Inspector
- **Header identity + single primary CTA:** Top bar shows breadcrumb back-link, object title + status badge on the left, and the single primary action button + secondary `•••` menu on the right.
- **2-column asymmetric split on desktop:** Main content/activity stream on the left (`65%–70%` width) and a structured metadata key-value sidebar on the right (`30%–35%` width, `280px–340px`), stacking main-first on mobile.
- **Key-value metadata grid:** Format sidebar properties as aligned rows (`12.5px` muted label on left, value/pill on right, `min-height: 32px`) with click-to-copy on IDs and URLs.
- **Inline editing stability:** Clicking an editable field swaps text for an input of identical box height and font metrics so the page does not jump.

## 20. Checkout & Payment Flows
- **Order summary always visible:** On desktop, place the editable cart/order summary in a sticky right column; on mobile, provide a collapsible top summary bar (`Order summary · $52.00 ▾`) that expands without losing form state.
- **Step progression:** Group into Contact -> Delivery -> Payment (accordion or linear steps) where completed steps collapse into a concise read-only summary with an `Edit` button.
- **Price breakdown clarity:** Right-align Subtotal, Shipping, Tax, Discount, and Total in `tabular-nums`, with the final Total in bold `16px–18px` and the exact charge amount repeated on the primary submit button (`Pay $52.00`).
- **Trust & error handling:** Keep card-number/expiry/CVC fields accessible with specific per-field validation errors and idempotent submit protection (disable double-charge while spinner runs).

## 21. Mobile Tab Bar & Bottom Navigation
- **3–5 top-level destinations maximum:** Fix the bottom bar (`height: 56px` + `env(safe-area-inset-bottom)`) across the full viewport width with equal-width flex slots (`min 44x44px` hit area per tab).
- **Icon + short label:** Always pair a `20px–22px` SVG icon with a `11px–12px` single-word label (`Home`, `Runs`, `Search`, `Settings`); never rely on mystery meat unlabeled icons.
- **Content bottom padding:** Add matching bottom padding (`>= 72px`) to the scrolling page container so the sticky tab bar never covers the last list row or footer action.
- **Active state contrast:** Indicate the active tab with high-contrast primary/accent ink (`>= 4.5:1`) and filled/heavier stroke icon—never by changing font size or shifting neighbor tabs.

## 22. AI Chat & Conversational Surfaces
- **Clear turn separation without heavy bubbles:** Keep user prompts compact (right-aligned or subtle surface pill, `max-width: 75%`) and render assistant responses full-width in the reading column (`max-width: 68ch`, `14px–15px`, `line-height: 1.55`) with embedded task UI cards for structured outputs.
- **Pinned bottom composer:** Anchor the prompt input box at the bottom with auto-growing textarea (`max-height: 180px`), skill/attachment trigger (`/`, `+`), and a `44x44px` Send button that transforms in place into a `Stop` button while streaming.
- **Scroll anchoring:** Auto-scroll only when the user is already near the bottom (`<= 48px` threshold); if the user scrolls up to read earlier output while streaming continues, pause auto-scroll and show a `↓ Jump to bottom` pill.
- **Actionable turn footer:** Below completed assistant turns, provide compact `24x24px+` (`44x44px` touch) actions (`Copy`, `Retry`, `Sources`) that occupy reserved space so they never cause a post-completion jump.

## 23. Agent Run & Execution Timeline Cards
- **Compact self-contained card:** Wrap multi-step agent work inside a bordered card (`border-radius: 12px`, `padding: 14px–18px`) with header title, live status dot (`• Researching` / `• Running`), and elapsed time (`tabular-nums`).
- **Vertical timeline spine:** Connect steps with a `1px` vertical line and `6px–8px` status dots (gray queued, blue/spinner active, green done, amber conflict, red failed).
- **Dense single-line rows:** Format each step on one line (`12.5px–13px`, `min-height: 28px`): action description + optional category/branch pill + right-aligned monospace domain/hash/duration.
- **In-place status chips & footer:** Below the timeline, render fixed-box summary chips (`✓ Company 6 pages`, `✓ Tests 42 passed`) and a footer progress bar (`Reading source · 6 of 11`) that resolves in place to the completion summary (`✓ Brief ready · 11 sources in 21s`) + primary action button (`Copy` / `Merge`).

## 24. Citations, Sources & Evidence Cards
- **Inline superscript pills:** Render inline citations as compact pill badges (`12px`, `padding: 1px 6px`, `border-radius: 4px`, muted surface fill) showing the source domain or number (`[1] freightwaves.com`) with `>= 4.5:1` text contrast.
- **Source drawer / strip:** Provide a horizontal source strip or expandable list showing favicon/monogram, article title (`1-line ellipsis`), domain in monospace, and snippet quote.
- **Verification highlight:** Hovering or focusing an inline citation highlights the corresponding source row (and vice versa) using a subtle background tint wash.
- **Broken/unverified source state:** Clearly badge unreachable or unverified sources (`Unverified` in muted/amber ink) rather than hiding them.

## 25. File Upload & Dropzones
- **Dashed drop target with keyboard button:** Render a clear dropzone (`min-height: 120px`, `1.5px dashed var(--border-strong)`, `border-radius: 10px`) containing an explicit `<button>` / `<input type="file">` trigger (`Browse files`), accepted formats, and max file size (`PDF, CSV up to 25 MB`).
- **Drag-over state without size shift:** On `dragenter`/`dragover`, swap background wash and border color to `--accent` without changing border width or box height.
- **Per-file progress rows:** Below the dropzone, list queued/uploading files with file icon, name, size (`tabular-nums`), horizontal progress bar, and a `44x44px` Cancel/Remove (`×`) button.
- **Inline error recovery:** If a file fails validation (wrong type or oversize), keep the row visible in red ink with the exact reason (`Exceeds 25 MB limit`) and a `Remove` / `Retry` button.

## 26. Calendars, Date Pickers & Schedulers
- **7-column fixed grid:** Render calendar months on a strict `repeat(7, minmax(36px, 1fr))` grid (`min-height: 40px–44px` per day cell on mobile) with `tabular-nums` day numbers.
- **State distinction without color alone:** Differentiate *Today* (subtle dot or bottom rule), *Selected* (solid high-contrast fill `#111827` or `#2563eb` with white text), *In-range* (low-alpha wash), and *Disabled/Unavailable* (muted text + strikethrough).
- **Direct text input alternative:** Always allow typing a date directly (`YYYY-MM-DD`) or picking quick presets (`Today`, `Last 7 days`, `Next 30 days`) alongside the visual grid.
- **Timezone clarity:** Explicitly display the active timezone (`KST · UTC+9`) beside time-slot pickers so scheduling never relies on implicit browser defaults.

## 27. Maps, Routes & Itinerary Cards
- **Synchronized split or stacked sheet:** Pair the map canvas with a structured itinerary list where stops are numbered (`1`, `2`, `3`) along a vertical timeline spine matching the map markers.
- **Streaming stop insertion:** When an AI builds a trip or route stop by stop, pre-allocate stop slots or smoothly append rows with distance/duration connectors (`18 min drive · 6.4 km`, `tabular-nums`) between stops while keeping the map viewport bounds stable.
- **Stop row anatomy:** Show stop number badge, place name (`13px–14px`, `font-weight: 600`), category pill (`Hotel`, `Dining`, `Transit`), time window in monospace on the right, and a secondary action (`Directions`).
- **Fallback without map tiles:** Ensure the itinerary timeline remains 100% readable and actionable even if map tiles are loading or offline.

## 28. Notifications & Inbox Views
- **Unread vs. read hierarchy:** Distinguish unread items with a `6px` accent dot in the leading gutter and `font-weight: 600` on the title—never by shifting row indentation when marked read.
- **Filter tabs & bulk mark-read:** Provide `All` / `Unread` filter tabs with counts (`tabular-nums`) and a keyboard-accessible `Mark all as read` action in the header.
- **Grouped by time horizon:** Bucket rows under sticky section headers (`Today`, `Yesterday`, `Earlier`) with right-aligned relative timestamps (`14m`, `2h`).
- **One-click inline triage:** Allow archiving or muting a thread directly from the row without navigating away from the inbox list.

## 29. User Profile & Account Cards
- **Identity header:** Pair an avatar (`48px–64px` with deterministic initials fallback if image fails, `alt` text set) with full name, handle/email in muted monospace, and role/status pill.
- **Structured sections:** Group account details into clean cards (`Personal info`, `Security & sessions`, `API keys`, `Billing`) with `16px–24px` vertical spacing between sections.
- **Copyable identifiers:** Format user IDs, organization slugs, and API key prefixes in monospace with a `Copy` button that swaps icon `⧉` -> `✓` in place for `1.5s`.

## 30. Landing Hero Sections
- **Single focal promise:** Order the hero stack as: optional factual eyebrow (version/release note) -> clear headline stating what the product does (`clamp(28px, 4.5vw, 48px)`, tight `-0.02em` tracking) -> 1–2 sentence plain-language subhead (`max-width: 58ch`) -> primary CTA + secondary docs/demo action.
- **Real product preview:** Below or beside the copy, render a real interactive or faithful product state (such as a live generative-UI card) at readable text scale (`>= 12px`), never tilted 3D mockup props or fake vanity stat tiles.
- **Mobile reflow:** At `390px` width, stack copy above the preview with `>= 16px` horizontal viewport padding and full-width or comfortably spaced (`44px+` tall) CTA buttons.

## 31. Code Diff & Merge Conflict Cards
- **File header bar:** Display file path in monospace (`src/middleware/auth.ts`), `+additions` / `-deletions` counts (`#059669` / `#dc2626`, `tabular-nums`), and collapse/expand control.
- **Readable line rows:** Use a monospace font (`12px`, `line-height: 1.5`), dual line-number gutters (`tabular-nums`, muted ink, `user-select: none`), and `+`/`-` prefix symbols alongside soft red/green background washes (`#fef2f2` / `#f0fdf4`) so diffs are distinguishable without color vision.
- **Inline conflict resolution actions:** Above or below conflicted hunks, provide clear one-click resolution buttons (`Accept current`, `Accept incoming`, `Resolve conflicts`) that collapse the conflict banner into a verified diff state in place.
- **Horizontal scroll isolation:** Scroll long code lines horizontally inside the `<pre>` container (`overflow-x: auto`) so the parent card and page never overflow at `390px`.

## 32.Kanban & Status Boards
- **Fixed-width columns in horizontal scroll:** Set columns to `280px–320px` width (`gap: 12px–16px`) inside an `overflow-x: auto` board container with sticky column headers showing status dot, title, and item count (`tabular-nums`).
- **Compact card anatomy:** Limit board cards to 3 data points: identifier + category pill, 1–2 line title (`13px`), and footer with assignee avatar + due/status badge.
- **Single-pointer move alternative:** Alongside drag-and-drop, every card must offer a keyboard/click status menu (`Move to...`) to satisfy WCAG 2.2 AA `2.5.7 Dragging Movements`.

## 33. Media Players, Audio & Voice Call Cards
- **Transport controls:** Provide a `44x44px` Play/Pause button (swapping icon in place), current time / total duration in `tabular-nums` (`01:14 / 03:42`), and a keyboard-scrubbable `<input type="range">` or progress bar (`role="slider"`).
- **Live waveform / transcript sync:** For AI voice or call agents, reserve a fixed-height waveform/status bar (`height: 36px`) and stream transcript turns below with speaker labels (`Agent`, `Customer`) and timestamps.
- **Mute / end-call safety:** Keep `Mute` and `End call` separated by at least `12px` with distinct iconography and ink so users never hang up by mistake.

## 34. Stepper & Progress Trackers
- **Linear state progression:** Display steps horizontally on desktop and vertically on `390px` mobile, clearly marking *Completed* (`✓`), *Current* (high-contrast pill/dot + `aria-current="step"`), and *Upcoming* (muted number/dot).
- **Sub-step progress:** When a step takes > 2 seconds, show deterministic sub-progress (`6 of 11 sources`, `27 of 42 tests`, `tabular-nums`) rather than an indeterminate spinner alone.

## 35. Filterable Directory & Card Grids
- **Responsive auto-fill grid:** Use `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))` (`gap: 16px`) so cards adapt smoothly from `390px` (1 column) to `1280px` (3–4 columns) without horizontal overflow.
- **Equal card heights per row:** Align card headers, descriptions (`line-clamp: 2`), and bottom metadata rows using flex column (`justify-content: space-between`) so neighbor cards form clean horizontal baselines.

## 36. API Keys, Tokens & Webhook Tables
- **Masked secrets by default:** Display only a prefix/suffix (`sk_live_...9f2a`) in monospace with a `Copy` button and explicit `Last used` / `Created` timestamps (`tabular-nums`).
- **One-time creation reveal:** When a new secret is generated, display it in a copyable monospace box with a clear notice (`Copy this key now; it won't be shown again`) and a `Done` acknowledgment button.
- **Scope badges & revoke action:** Show permission scopes as compact neutral pills (`read:orders`, `write:webhooks`) and provide a `Revoke` action guarded by confirmation.
