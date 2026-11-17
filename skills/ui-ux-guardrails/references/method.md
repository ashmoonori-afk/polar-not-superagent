# Define the ideal before checking the screen

## Scope and people

Write the actual requested outcome and the routes, components and shared consumers affected. For a read-only review, corrections remain proposals. Use one work artifact; separate files are not mandatory.

For each materially different person or situation, record:

| Person or role | Current goal | Experience | Situation and constraints | Evidence or hypothesis |
|---|---|---|---|---|
| Describe a real role, not a demographic stereotype. | Name an observable result. | First-time, returning, expert or unfamiliar with this task. | Time pressure, emotion, ability, input, device, connection and privacy only when relevant. | Cite known context; label assumptions. |

Do not create extra personas solely to fill a quota. Different constraints can belong to the same person at different times.

## Journey and ideal state

Map entry through return, including handoffs to people, external services or another device. At every meaningful step, answer the following before choosing a layout.

| Step | Person needs to understand | Person can do | Ideal evidence of progress or completion | Recovery or alternative |
|---|---|---|---|---|
| Entry, decision, prerequisite, action, waiting, result, departure or return. | State availability, cost, disclosure and consequence where relevant. | Name an action that actually exists. | Distinguish a button press, accepted request, completed operation and fulfilled outcome. | Cover the relevant failure, interruption or inaccessible channel. |

A marketing page has a journey too. Its conversion action must match what is available now. A preview can remain a preview; the gap is misleading context or a dead-end route, not the absence of a feature the brief never promised to implement.

## Fix the cases before comparing

List only relevant cases, but account for the full scope: normal, loading, empty, error, validation, unavailable/disabled, permission denied, offline, long/localized content, enlarged text, keyboard/assistive input, interruption and return. Explain N/A rather than silently omitting a case.

For supported web surfaces, set 1440px and 390px baseline widths and fixed heights appropriate to the journey. Add an intermediate breakpoint when behavior changes there. Use supported themes and system preferences. Native, driving, spatial, tactile or audio cases require the appropriate device or modality; do not invent desktop/mobile screenshots as substitutes.

## Compare and prioritize

List every gap. Omitting a gap because it is small or out of scope is a review FAIL; record its disposition (fix now, defer with reason, product decision) instead.

For each gap, record: affected person and step, ideal state, observed fact, inferred consequence, source-linked rule IDs, proposed correction and required proof. Keep an unknown separate from a failure.

Prioritize blocked completion, unintended consequences, loss of data or access, and exposed sensitive information before cosmetic inconsistency. Then address misleading state, difficult recovery and repeated effort. Art-direction polish follows a usable journey.

Use the source catalogs to understand context, not to turn every advisory sentence into a demand. Apply only the conditions that exist. The standards-and-scope reference distinguishes source guidance, adopted house rules and actual web standards.

## Implement and prove

Correct the cause in the smallest appropriate shared location. Follow the existing frontend and design skills for implementation. Keep the same data and case set when comparing before and after.

Run one complete scoped pass, then repair in-scope failures. Rerun checks affected by a change or prior failure; do not repeatedly revalidate an unchanged pass.

| Case or rule IDs | Applicability | Actual evidence | Verdict | Remaining action |
|---|---|---|---|---|
| Use stable identifiers. | Applicable or N/A with reason. | Capture, measured value or named behavioral result, including device and state. | PASS, FAIL, N/A or UNVERIFIED. | Specific correction or missing test. |

A static screenshot can show a label, layout or visible state. It cannot prove keyboard order, a screen-reader announcement, permission enforcement, recording cessation, data deletion, synchronization, successful payment or recovery. Use the named behavioral probe.

UI completion requires all applicable required cases to pass, with genuine N/A cases explained. Disclose pre-existing out-of-scope problems without claiming they are fixed. A paper-review artifact can be complete with UNVERIFIED runtime cases, provided it makes no visual or operational completion claim.

## Handoff

State what people can now do, what evidence proves it and what remains unknown. Include the contract, relevant rule IDs, fixed cases and actual results. Do not substitute a checklist count for usability proof, claim an independent review was performed when it was not, or say the method finds defects an ordinary review misses without comparative evidence.
