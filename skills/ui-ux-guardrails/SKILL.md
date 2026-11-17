---
name: ui-ux-guardrails
description: "Mandatory before any UI/UX design, build, polish or review, and before calling UI work done. Define the ideal experience from the real people, their situations and the full journey; list every gap between the product and that ideal; fix the gaps; prove each fix with source-linked guardrails adapted from Apple's Human Interface Guidelines (190 rules, checked at 1440 and 390 px). Product-neutral: no Apple visual style. Art direction stays with design-taste, implementation with frontend, streaming UI with generative-ui, capture procedure with visual-qa."
---

# UI/UX guardrails

Start with the person and the outcome they came for. A polished screen fails when someone cannot understand the offer, finish the task, recover from a mistake or come back later.

## Required use

Use this skill before you design, build or change a screen, navigation path, form, component, interaction, UI copy or generated task interface. Use it again as the completion gate for the same scope. Use it for a requested UI review too, but keep a read-only review read-only.

Do not grow the product to satisfy a checklist. A small fix gets a short contract for the journey it touches; a shared-component change covers every screen that uses that component. "Full pass" means every screen and state in the agreed scope, not an unrequested redesign of the whole product.

Read [method.md](references/method.md) before starting. Keep the contract, the case list, the gap list and the evidence in one work file.

## Before coding

1. Name the people and their situations: goal, prior experience, relevant ability or access limit, device and input, time or emotional pressure. Separate known facts from guesses. Do not invent demographic personas.
2. Map the whole journey: arrival, understanding, prerequisites, action, feedback, completion, leaving and coming back. Include at least one realistic failure or interruption. A handoff to another app, a phone call or a person is part of the journey.
3. Describe the ideal state for each step before choosing components: what the person sees, understands, can do and gets as proof. Keep what works today apart from previews and promises.
4. Fix the test cases before comparing: desktop and mobile widths, supported themes, enlarged text, and the loading, empty, error, permission-denied, long-content, interruption and return states that apply. Mark a missing condition N/A with a reason.
5. Read the applicable rule files below. List every gap between the current and ideal states, including small, cosmetic and out-of-scope ones; do not rank the small ones away. Give each gap a disposition (fix now, defer with reason, product decision), then order the fixes by harm to the journey. A taste preference is not a source requirement.

If the brief leaves a routine detail open, choose a reasonable default from the product and label it. Ask only when the answer changes the intended outcome and cannot be found in existing context.

## Rule routing

Read foundations and patterns for every UI task; then open the component, input and domain files that match what the product actually has.

| File | Apply to |
|---|---|
| [rules-foundations.md](references/rules-foundations.md) | Accessibility, inclusion, writing, hierarchy, layout, typography, color, imagery, privacy and motion. |
| [rules-patterns.md](references/rules-patterns.md) | Entry, onboarding, help, loading, errors, editing, accounts, search, sharing, media, automation and return paths. |
| [rules-components.md](references/rules-components.md) | The controls, navigation, content regions, dialogs and indicators actually present. |
| [rules-inputs.md](references/rules-inputs.md) | Supported keyboard, touch, pointer, assistive and specialized input. |
| [rules-technologies.md](references/rules-technologies.md) | Compact system surfaces and conditional domains such as payment, sync, sensing, maps or shared activity. |
| [standards-and-scope.md](references/standards-and-scope.md) | Source strength, units, web standards, exceptions and conflicts. |

The five rule files hold 190 rules. `MUST` is this skill's acceptance contract, adapted from HIG advice; apply a rule only when its condition exists (standards-and-scope.md).

Every rule has an ID, a source topic and URL, the benefit to the person, and a `Check@1440/390` line. The two widths are the baseline for web surfaces, not a replacement for real native hardware or extra breakpoints.

[coverage.md](references/coverage.md) lists all 173 source pages read (2026-11-03/04 KST) with their HIG links. The raw extraction catalogs are not included in this copy; the curated rules are the requirements.

## Fix the actual gap

Make the smallest change that restores the intended experience. Fix a shared cause rather than adding one-off guards or cosmetic exceptions.

Keep required content, meaningful states and user control when simplifying. Do not remove an error state, hide a failed check or relabel an untested behavior as N/A to get a clean result.

The core loop:

**person and situation -> full journey -> ideal state -> observed gap -> correction -> proof**

The loop uses the same fixed cases throughout. Change the contract only when new evidence or an explicit product decision changes it, and record why; never move the target after a failure.

## Before calling the UI done

Do one full pass over the agreed journey and every applicable state:

- Look at the real rendered desktop and mobile surfaces at 1440 px and 390 px where supported, plus any intermediate width or native device that matters. Compare them with the contract.
- Use `visual-qa` for the capture procedure and visual verdict. Include supported themes, longer content, enlarged text and the state changes the work affects.
- Run the behavior tests the rules name: keyboard and assistive input, permission changes, saved data, network failure, recovery, and any payment or other action that cannot be undone. Screenshots cannot prove these.
- Record each applicable rule as PASS, FAIL, N/A with reason, or UNVERIFIED (a grouped row lists every rule ID it covers). Reading source code alone never earns a rendered PASS.
- Fix in-scope failures, then rerun only the checks the fix or an earlier failure touched. A passed, unchanged check stays settled.
- Report what actually happened and what is still unknown. The UI is not done while any applicable required case is FAIL or UNVERIFIED. A read-only paper review can be complete while saying plainly that the UI is unverified.

Do not claim this method beats an ordinary review without a side-by-side comparison on a fixed case set.

## Existing skills and overlap

- `design-taste` owns reference research, candidate selection and art direction; this skill supplies the person, task and ideal-outcome contract. Do not turn an art-direction choice into a usability law. design-taste wins on reference choice and art direction; this skill wins when a taste choice breaks F-03, F-20 or F-25.
- `frontend` owns implementation, responsive layout and code practice; this skill does not replace its design system. `frontend/references/design/grounding.md` step 1 asks you to read the HIG in full; read the rules-*.md files here instead and cite rule IDs in its gap ledger. grounding.md wins on ledger format and DESIGN.md placement; this skill wins on HIG content and the journey contract.
- `generative-ui` owns streaming and task-card patterns. Its output still needs a complete journey, honest states and user control.
- `visual-qa` owns the visual evidence and inspection procedure. Its checklist (A-I) and capture matrix win on capture procedure and numeric thresholds (D1 targets, C1 text sizes, E2 contrast, A6 nested scroll, G4 reduced motion). When a rule here and a checklist item cover the same thing, run the checklist item and record both IDs. This skill wins on which people, journeys and states must be covered.
- The motion rule in `design-taste/SKILL.md` wins on motion choice and timing (one named motion per screen, 100-400 ms, prefers-reduced-motion). F-28 to F-30 only check that a motion has a cause and an equivalent without motion.

Do not modify those skills from here. Do not expand product scope to satisfy a rule; a scope change is the task owner's decision.
