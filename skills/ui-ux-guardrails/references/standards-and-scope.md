# Standards, scope and source strength

## What a rule means

The 190 rules are product-neutral acceptance requirements adapted from HIG advice. `MUST` is this skill's acceptance contract; it does not claim Apple used that word or that every recommendation is a universal law. The topic and source URL identify the originating guidance. The proof procedure is authored for this guardrail, not quoted from Apple.

Apply the condition first. A website without payments, spatial input, accounts or notifications does not need those features to satisfy this skill. Record the relevant rules as N/A with a reason. Do not add product scope to make a checklist applicable.

The candidate catalogs preserve the earlier extraction, including advice phrased too strongly, native units and occasional formatting inconsistencies. They are evidence for review, not an additional rule set.

## Units and web accessibility

Apple native logical points, CSS pixels and CSS typographic points are different concepts. There is no blanket rule that an Apple `pt` equals a CSS `px`. In CSS absolute-unit conversion, 1pt is 4/3px; this does not convert every native interface metric into a web requirement.

For web work, the following W3C WCAG 2.2 baselines supplement HIG. This short list is not a complete accessibility-conformance assessment.

| Subject | Web baseline | Limits and evidence |
|---|---|---|
| Text contrast | 4.5:1 for ordinary text; 3:1 for large text | Large text is at least 18pt regular (24 CSS px) or 14pt bold (about 18.67 CSS px), or the relevant equivalent for the font/script. Bold text at any size does not automatically qualify. Measure actual rendered colors and backgrounds. |
| Non-text contrast | 3:1 for visual information necessary to identify controls, states and meaningful graphics | Compare with adjacent colors. Inactive controls and certain unmodified user-agent appearances have exceptions; do not call every low-contrast decorative line a WCAG failure. |
| Pointer target minimum | 24 by 24 CSS px under SC 2.5.8, with defined exceptions | Spacing, equivalent controls, inline targets, user-agent controls and essential presentation can qualify for exceptions. Record the exact exception and measurement. This is not a general recommendation to make touch controls only 24px. House floor adopted from frontend and visual-qa D1: 44x44 CSS px for touch targets, 8-12 px between neighbours. |
| Text resizing | Up to 200% without loss of content or functionality under SC 1.4.4 | Captions and images of text have specific exceptions. Test actual resizing; two ordinary screenshots do not prove compliance. |

Primary sources, fetched successfully on 2026-11-04 KST:

- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html

A project can adopt a stronger house floor, such as larger touch targets or readable disabled text. Label it as a house requirement rather than attributing it to WCAG or treating its failure as a WCAG violation.

Native-only contexts need the real supported device; mark web widths N/A with a reason rather than fabricating captures.

## Apple-specific exclusions

Do not promote these into universal web requirements:

- Apple logos, trademarks, marketing copy, official button artwork or service integration requirements.
- SF Symbols, San Francisco, Liquid Glass, Apple system tints, AppKit/UIKit/SwiftUI APIs and component availability.
- Platform-specific point sizes, safe zones, device dimensions, duration limits, image specifications or fixed item counts.
- Apple permission-sheet anatomy, system shortcut mappings, app-store policies and default control placement.
- Spatial-distance, vehicle, medical-study or payment-specific requirements without that context.

A native implementation can still be subject to applicable platform requirements. This product-neutral extraction does not repeal them. Current legal, clinical, financial and platform-distribution obligations need their own appropriate review; this skill does not certify them.

## Authority and overlap

1. The current explicit task and its approved product scope determine what to build. Accessibility needs and applicable obligations cannot be silently waived by a visual preference.
2. This skill defines the user-outcome and journey checks. `design-taste` owns reference research and art direction; `frontend` owns implementation practice; `generative-ui` owns streaming interface patterns; `visual-qa` owns the actual capture and visual-verdict procedure.
3. When an installed checklist contains a stronger numeric house rule, record that provenance. If it misstates a standard or conflicts with the product contract, state the conflict and resolve it explicitly; never silently relabel it as Apple or WCAG.
4. A source-only paper check cannot receive a visual or behavioral PASS. Use UNVERIFIED for unrun tests and N/A only for genuinely absent conditions.

## Evidence boundaries

The fixed reading corpus contains 173 saved HIG pages fetched on 2026-11-03 KST. It includes index pages, resource sections and platform-specific guidance. Some text exports contain broken outbound links, absent images or malformed table cells. Do not reconstruct missing content from memory. The coverage ledger records page-level reading and candidate extraction; it is not a claim that every sentence was promoted or that every current HIG page on the internet is in this snapshot.

Source auditing for curation compares selected claims with the relevant saved prose and records the source topic. No runtime UI, assistive-technology or payment test is asserted merely because its required procedure is written here.
