# Foundations: make the task understandable and usable

42 guardrails. The full candidate extraction is not included in this copy; it was never an additional normative rule set.

Apply a rule only when its condition exists; units, web baselines, native-device cases and conflicts are in [standards and scope](standards-and-scope.md). A screenshot never replaces the named behavior test.

- [F-01] MUST define the person, task and successful outcome before choosing the interface. Topic: Design principles. Source: https://developer.apple.com/design/human-interface-guidelines/design-principles. Why: The design serves a real purpose. Check@1440/390: Compare the named journey and ideal-state contract with the first usable screen; FAIL if the contract's first step and its next action are not identifiable in the first viewport at either width.

- [F-02] MUST include relevant permanent, temporary and situational constraints in the journey. Topic: Inclusion. Source: https://developer.apple.com/design/human-interface-guidelines/inclusion. Why: The path remains usable outside an ideal desk setting. Check@1440/390: For each named constraint (for example one-handed at 390, keyboard-only at 1440, 200% text) complete the task once; FAIL on any step that needs an input the constraint removes.

- [F-03] MUST NOT communicate essential meaning through color, sound, position or motion alone. Topic: Accessibility. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility. Why: People can perceive the message through an available channel. Check@1440/390: Inspect status/error/selection frames without color or sound; separately test equivalent assistive output.

- [F-04] MUST support text enlargement without losing content or function. Topic: Accessibility. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility. Why: People can read at their preferred size. Check@1440/390: Capture default and 200% enlarged text; check wrapping, clipping and reachable controls. The 200% web case is adopted acceptance, not a conversion of native points.

- [F-05] MUST give controls sufficient hit area and separation for the intended input. Topic: Accessibility. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility. Why: People can activate the intended target. Check@1440/390: Measure hit rectangles and gaps. Touch layouts: at least 44x44 CSS px with 8-12 px between neighbours (house floor from frontend and visual-qa D1). Pointer-only: at least 24x24 CSS px (WCAG 2.5.8); record any exception used.

- [F-06] MUST make essential actions operable by keyboard and supported assistive input. Topic: Accessibility. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility. Why: People do not need a particular physical gesture. Check@1440/390: Not screenshot-checkable: complete essential journeys keyboard-only and with relevant assistive input; attach focus frames.

- [F-07] MUST give gesture-dependent actions an accessible control alternative. Topic: Accessibility. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility. Why: People with limited dexterity reach the same outcome. Check@1440/390: Locate the alternative in both captures, then perform both paths and compare outcomes.

- [F-08] MUST keep timed messages and controls available long enough or provide an explicit way to retain or retrieve them. Topic: Accessibility. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility. Why: Slow readers do not lose essential information. Check@1440/390: Not screenshot-checkable: observe timeout and retrieval with the longest content; record the product-specific time allowance.

- [F-09] MUST provide controllable playback and appropriate text or audio alternatives for meaningful media. Topic: Accessibility. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility. Why: People can understand media without relying on one sense. Check@1440/390: Capture controls and captions/transcript entry; separately check synchronization and descriptions.

- [F-10] MUST honor reduced-motion and flashing-light accommodations applicable to the surface. Topic: Accessibility. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility. Why: Sensitive viewers can use the same task. Check@1440/390: Not screenshot-checkable: record default/reduced-motion behavior and analyze flashing content where present.

- [F-11] MUST keep text legible at its real size, weight and viewing conditions. Topic: Typography. Source: https://developer.apple.com/design/human-interface-guidelines/typography. Why: Present text can actually be read. Check@1440/390: Inspect smallest and longest text at intended distances; FAIL if meaningful text renders below the visual-qa C1 house floor (body 17 pt-equivalent and secondary 15 pt at 390, 14 px on desktop). Use project tokens rather than copied Apple point values.

- [F-12] MUST preserve text hierarchy when text size or available space changes. Topic: Typography. Source: https://developer.apple.com/design/human-interface-guidelines/typography. Why: People still recognize the main information. Check@1440/390: Compare heading, body and supporting roles at default/enlarged sizes; allow browser zoom to scale the whole page.

- [F-13] MUST expose the full meaning of necessary text instead of clipping it. Topic: Typography. Source: https://developer.apple.com/design/human-interface-guidelines/typography. Why: People do not lose instructions or values. Check@1440/390: Capture longest labels and enlarged text; exercise the full-value view for deliberate truncation.

- [F-14] MUST give multiline text enough line spacing and measure for comfortable reading. Topic: Typography. Source: https://developer.apple.com/design/human-interface-guidelines/typography. Why: People can track lines without confusion. Check@1440/390: Inspect real paragraphs using project text-spacing rules; test enlarged text and spacing overrides.

- [F-15] MUST order and group content according to the person’s information priorities. Topic: Layout. Source: https://developer.apple.com/design/human-interface-guidelines/layout. Why: People find the next meaningful action. Check@1440/390: Compare declared priorities with reading order, alignment, proximity and grouping in each state; FAIL if the contract's top-priority item is not first in reading order or sits below a lower-ranked item.

- [F-16] MUST adapt to available space while preserving reachable functionality and context. Topic: Layout. Source: https://developer.apple.com/design/human-interface-guidelines/layout. Why: Small windows do not become lesser products. Check@1440/390: Compare narrow/intermediate/wide layouts, rotation and resizing; walk destinations after each transition.

- [F-17] MUST keep essential content and controls clear of occluding system UI and safe-area boundaries. Topic: Layout. Source: https://developer.apple.com/design/human-interface-guidelines/layout. Why: People can see and operate them. Check@1440/390: Capture cutout, keyboard, sticky-overlay and scroll-end cases; probe hit and focus regions.

- [F-18] MUST let containers grow, wrap or stack for enlarged and localized text. Topic: Layout. Source: https://developer.apple.com/design/human-interface-guidelines/layout. Why: Translation and accessibility do not cause overlap. Check@1440/390: Use longest supported strings and enlarged text; inspect every affected shared-component consumer.

- [F-19] MUST maintain consistent semantic color meanings across the product. Topic: Color. Source: https://developer.apple.com/design/human-interface-guidelines/color. Why: People reuse learned status and action cues. Check@1440/390: Compare roles across routes and states; distinguish decorative from semantic color.

- [F-20] MUST meet the applicable contrast standard in every supported appearance. Topic: Accessibility. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility. Why: Text and meaningful controls remain perceivable. Check@1440/390: Measure against the actual painted background; web thresholds and exceptions are in standards-and-scope.md, not the native HIG table.

- [F-21] MUST preserve legibility, hierarchy and recognizable assets when a supported appearance changes. Topic: Dark Mode. Source: https://developer.apple.com/design/human-interface-guidelines/dark-mode. Why: People can continue through a theme switch. Check@1440/390: Capture supported themes and a mid-task switch, including images and overlays; do not require a new theme outside scope.

- [F-22] MUST use recognizable icon meanings and consistent optical weight within a component family. Topic: Icons. Source: https://developer.apple.com/design/human-interface-guidelines/icons. Why: People identify actions without decoding a new visual language. Check@1440/390: Inspect icons at rendered size with adjacent text; FAIL if an icon without a text label is outside the product's shared icon set or lacks an accessible name.

- [F-23] MUST localize meaningful text or direction encoded in icons. Topic: Icons. Source: https://developer.apple.com/design/human-interface-guidelines/icons. Why: Icons retain their intended meaning across languages. Check@1440/390: Capture supported direction/script variants and inspect embedded characters.

- [F-24] MUST supply artwork appropriate to the rendered size and display density. Topic: Images. Source: https://developer.apple.com/design/human-interface-guidelines/images. Why: Images remain clear without distorted presentation. Check@1440/390: Inspect supported density and size; compare intended aspect and crop with the source.

- [F-25] MUST keep brand treatment from obstructing the task or replacing familiar behavior. Topic: Branding. Source: https://developer.apple.com/design/human-interface-guidelines/branding. Why: People reach content without waiting through promotion. Check@1440/390: Compare first usable state and repeated task screens; record justified brand elements and verify standard actions.

- [F-26] MUST avoid unsupported assumptions about identity, family, ability or cultural experience. Topic: Inclusion. Source: https://developer.apple.com/design/human-interface-guidelines/inclusion. Why: People outside a narrow stereotype can complete the task. Check@1440/390: Review required fields, defaults, copy and imagery against the persona range and supported locales.

- [F-27] MUST keep foreground information readable over changing or translucent backgrounds. Topic: Materials. Source: https://developer.apple.com/design/human-interface-guidelines/materials. Why: A readable resting state does not fail after scrolling. Check@1440/390: Capture the busiest background and reduced-transparency equivalent; measure contrast without mandating glass or blur.

- [F-28] MUST give each animation an information or interaction purpose. Topic: Motion. Source: https://developer.apple.com/design/human-interface-guidelines/motion. Why: Movement clarifies rather than distracts. Check@1440/390: Record its cause and benefit; inspect rest, transition and settled frames.

- [F-29] MUST let people act without waiting for decorative or repeated transition motion. Topic: Motion. Source: https://developer.apple.com/design/human-interface-guidelines/motion. Why: The interface remains responsive. Check@1440/390: Not screenshot-checkable: interrupt and retarget transitions; verify accepted input and coherent state.

- [F-30] MUST provide equivalent information when optional motion is reduced or removed. Topic: Motion. Source: https://developer.apple.com/design/human-interface-guidelines/motion. Why: People do not need animation to understand a result. Check@1440/390: Record reduced-motion behavior and compare final content and available actions.

- [F-31] MUST request only necessary data at the task moment that needs it. Topic: Privacy. Source: https://developer.apple.com/design/human-interface-guidelines/privacy. Why: People can judge a specific request. Check@1440/390: Walk first use, denial and the feature needing permission; compare requested data with its purpose.

- [F-32] MUST explain collection and use before the person commits. Topic: Privacy. Source: https://developer.apple.com/design/human-interface-guidelines/privacy. Why: People can make an informed choice. Check@1440/390: Capture purpose text and privacy entry; compare the statement with actual data flow, which screenshots cannot prove.

- [F-33] MUST provide a clear way to review or change applicable privacy choices. Topic: Privacy. Source: https://developer.apple.com/design/human-interface-guidelines/privacy. Why: Consent remains under the person’s control. Check@1440/390: Capture settings or a direct system-settings route; test changing and revoking the choice.

- [F-34] MUST NOT disguise a permission explanation as consent or manipulate the real choice. Topic: Privacy. Source: https://developer.apple.com/design/human-interface-guidelines/privacy. Why: People distinguish information from authorization. Check@1440/390: Compare preprompt and actual permission states; do not import Apple-only one-button anatomy into every web consent form.

- [F-35] MUST adapt reading-direction navigation while preserving real-world direction, number order and brand identity. Topic: Right to left. Source: https://developer.apple.com/design/human-interface-guidelines/right-to-left. Why: Localization does not reverse the wrong meaning. Check@1440/390: Capture supported RTL layouts with mixed-script names, numbers, back/next and real-direction icons.

- [F-36] MUST use clear, consistent, audience-appropriate terms and tone. Topic: Writing. Source: https://developer.apple.com/design/human-interface-guidelines/writing. Why: People understand instructions in their situation. Check@1440/390: List every verb used for the same action across captures; FAIL if one action has two names or one name has two actions.

- [F-37] MUST label actions by a recognizable outcome and links by their destination or purpose. Topic: Writing. Source: https://developer.apple.com/design/human-interface-guidelines/writing. Why: People can decide without surrounding explanation. Check@1440/390: List control/link names from captures and accessibility output; reject ambiguous approval labels.

- [F-38] MUST make an empty state explain its meaning and provide the relevant next step. Topic: Writing. Source: https://developer.apple.com/design/human-interface-guidelines/writing. Why: A blank result does not become a dead end. Check@1440/390: Capture first-use, genuinely empty and filtered-no-result cases; keep enduring instructions available later.

- [F-39] MUST place error guidance near the problem and state a useful correction without blame. Topic: Writing. Source: https://developer.apple.com/design/human-interface-guidelines/writing. Why: People recover while retaining context. Check@1440/390: Trigger relevant validation/error cases; capture cause and recovery beside the affected item.

- [F-40] MUST retain field purpose and expected format while people enter information. Topic: Writing. Source: https://developer.apple.com/design/human-interface-guidelines/writing. Why: HIG asks for clear labels plus format hints; a placeholder that vanishes on input loses both, so the label and format hint must persist. Check@1440/390: Capture empty, focused, filled and invalid fields with labels and format guidance.

- [F-41] MUST make flow start, continuation and completion explicit. Topic: Writing. Source: https://developer.apple.com/design/human-interface-guidelines/writing. Why: People know what remains and when they are done. Check@1440/390: Capture every journey step and compare wording with actual resulting state.

- [F-42] MUST localize text and culturally meaningful formatting for every supported locale. Topic: Inclusion. Source: https://developer.apple.com/design/human-interface-guidelines/inclusion. Why: Dates, money and meaning are understood correctly. Check@1440/390: Capture representative formats and longest strings; review meaningful color and imagery.
