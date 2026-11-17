# Product demonstrations

Use this reference within the existing design-taste research and planning
flow when a page needs to explain a product action through a still image or
an animated UI illustration. Existing project rules, project tokens,
implementation ownership and visual-qa requirements remain authoritative.

## Establish the claim

Write down the reader, the product action, the visible result and the
evidence for that result before choosing a composition. Select one useful
moment: a setting taking effect, an item moving between states, a comparison
the product actually supports, or a result the reader needs to understand.

Identify the evidence type:

- A capture from the real product can show the state that was observed.
  Record the environment and any limitations of that observation.
- An authored illustration explains a workflow. Its simulated pointer,
  loading state and success message do not prove that a real action ran.
- A measured claim needs the measurement and its conditions. A number in a
  scene script is content, not a measurement.

Use supported product copy and approved assets. Preserve names, amounts,
units, dates and qualifications that matter to the claim. When the task
explicitly calls for illustrative data, identify it as illustrative. Do not
turn another company's identity or an example scene's invented result into
the product's own evidence.

## Choose the composition

Choose a composition for the relationship the reader needs to see:

| Relationship | Useful composition | Check before choosing it |
|---|---|---|
| One action and its result | One focused product surface | The changed state is legible without surrounding decoration. |
| A detail inside a larger workflow | Context surface with a focused detail | The detail keeps its connection to the original location. |
| Several states of the same object | Aligned sequence or repeated object | Identity and order remain clear. |
| Complementary product capabilities | A small group of distinct panels | Each panel adds evidence for the same page claim. |

These are choices, not a template library. Use the project's existing type,
color, spacing and component system. Keep the real controls when the
deliverable is interactive; a styled span or a scripted pointer is not a
replacement for control behavior, accessible naming or keyboard support.

Compose a narrow version deliberately. Reorder or reduce surrounding
context before shrinking essential text. A crop may remove decoration but
must not remove the action, a material value or the qualification that makes
the claim true.

## Plan state and motion together

Describe the starting state, the initiating event and the completed state.
State which object changes and which objects retain their identity. Give
each motion a purpose under the motion rule in SKILL.md: locating the change,
explaining continuity or showing feedback from an action.

Keep feedback attached to its cause. Do not imply that a backend action
finished because a decorative timeline reached its final frame. Allow the
result to remain visible long enough to read. If a loop is needed, make its
reset understandable and inspect the boundary between the last and first
state.

Provide a complete still state for reduced motion, paused playback and
contexts where animation cannot run. The still must communicate the same
claim. Preserve the existing rules for interruption, hidden surfaces and
stable layout rather than importing a demonstration kit's runtime.

## Hand off a reviewable plan

Include the following in the existing design plan:

1. The claim, the product action and the evidence source.
2. The chosen composition and what stays visible at narrow widths.
3. The starting and completed states, the purpose of motion and the still
   treatment.
4. The real behavior and accessibility checks required if the surface is
   interactive.

Implementation still belongs to the existing frontend workflow. Verify the
result with the existing browser and visual-qa workflow at the required
desktop and mobile sizes. Inspect actual playback as well as representative
states. Check the transition and loop boundary, reduced motion, legibility
and the promised product outcome.

An endpoint image proves only that endpoint. A contact sheet leaves gaps
between samples. A simulated-clock recording does not establish native
frame rate. Report missing samples, execution errors and untested behavior
as incomplete evidence, even when a renderer also prints a success message.

## Provenance and limits

Independently written from the completed review of
`benjitaylor/skills@ccb6a382ae0bd3c9bdfc010d7fdfaec23ee2be21`, scoped to
`stageshow/` and its local imports. This revision includes an MIT source
license and separate notices for artwork and third-party assets.

No upstream prose, components, illustrations, artwork, fonts, virtual clock
or checker is included. Source review and isolated color-parser probes do
not establish browser appearance, interaction, accessibility or performance.
