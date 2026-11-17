# Patterns: complete the journey

40 guardrails. Evaluate relevant entry, interruption, error and return paths before polishing an isolated happy state.

Apply a rule only when its condition exists; units, web baselines, native-device cases and conflicts are in [standards and scope](standards-and-scope.md). A screenshot never replaces the named behavior test.

- [P-01] MUST make the useful starting state available promptly and restore relevant prior context on return. Topic: Launching. Source: https://developer.apple.com/design/human-interface-guidelines/launching. Why: People resume instead of retracing their steps. Check@1440/390: Test fresh entry and return after interruption; capture restored task, selection and scroll where relevant.

- [P-02] MUST keep onboarding brief and make optional education skippable and available later. Topic: Onboarding. Source: https://developer.apple.com/design/human-interface-guidelines/onboarding. Why: People can start now and learn when ready. Check@1440/390: Walk first use, skip, contextual help and later retrieval; do not make critical task meaning depend on a dismissed tip.

- [P-03] MUST provide help near the relevant task and prioritize unresolved guidance over completed steps. Topic: Offering help. Source: https://developer.apple.com/design/human-interface-guidelines/offering-help. Why: People find the answer when they need it. Check@1440/390: Capture help before/after completion and the route back from instructions.

- [P-04] MUST make status, success and failure clear with feedback proportional to their importance. Topic: Feedback. Source: https://developer.apple.com/design/human-interface-guidelines/feedback. Why: People know what happened without needless interruption. Check@1440/390: Capture idle, active, success and failure; verify feedback corresponds to actual system state.

- [P-05] MUST show meaningful loading progress or partial content rather than an unexplained blank state. Topic: Loading. Source: https://developer.apple.com/design/human-interface-guidelines/loading. Why: People know the task is working. Check@1440/390: Throttle the actual operation; capture initial, partial and completed states and measure time to usable content.

- [P-06] MUST distinguish indeterminate work from measurable progress and keep reported completion honest. Topic: Progress indicators. Source: https://developer.apple.com/design/human-interface-guidelines/progress-indicators. Why: People can decide whether to wait. Check@1440/390: Compare progress with completed work through a slow final stage; switch modes without changing indicator form.

- [P-07] MUST provide applicable cancel, pause or retry behavior and explain any lost work. Topic: Progress indicators. Source: https://developer.apple.com/design/human-interface-guidelines/progress-indicators. Why: People control waiting and recover safely. Check@1440/390: Exercise each exposed action, including a stall; compare final state with its promised consequence.

- [P-08] MUST request the minimum information needed and reuse appropriate values already provided. Topic: Entering data. Source: https://developer.apple.com/design/human-interface-guidelines/entering-data. Why: People avoid redundant effort. Check@1440/390: Walk first entry and returning entry; list every required field and its task justification.

- [P-09] MUST support convenient entry methods such as appropriate keyboard, paste and relevant choices. Topic: Entering data. Source: https://developer.apple.com/design/human-interface-guidelines/entering-data. Why: People can enter data using their available tools. Check@1440/390: Complete representative inputs by keyboard, paste and supported choices; capture mobile keyboard visibility.

- [P-10] MUST validate at an appropriate task moment and preserve a clear correction path. Topic: Text fields. Source: https://developer.apple.com/design/human-interface-guidelines/text-fields. Why: People can fix errors without premature interruption. Check@1440/390: Enter incomplete then invalid values, move focus and submit; inspect timing, guidance and retained context.

- [P-11] MUST let people reverse meaningful reversible edits and identify the affected action. Topic: Undo and redo. Source: https://developer.apple.com/design/human-interface-guidelines/undo-and-redo. Why: Mistakes need not destroy work. Check@1440/390: Perform grouped edits, undo and redo; compare content and labels at each step.

- [P-12] MUST protect current work during navigation, renaming, synchronization and save conflicts. Topic: File management. Source: https://developer.apple.com/design/human-interface-guidelines/file-management. Why: People do not lose edits while managing files. Check@1440/390: Exercise supported lifecycle cases with a fixed document and verify saved/unsaved and conflicting versions.

- [P-13] MUST preserve appropriate task state through backgrounding, resizing and interruptions. Topic: Multitasking. Source: https://developer.apple.com/design/human-interface-guidelines/multitasking. Why: People can return without starting over. Check@1440/390: Background/reopen, resize and interrupt the task; compare content, selection and continuation state.

- [P-14] MUST require an account only for a task that needs one and explain the benefit. Topic: Managing accounts. Source: https://developer.apple.com/design/human-interface-guidelines/managing-accounts. Why: Account creation does not become an arbitrary barrier. Check@1440/390: Walk guest and required-account paths; compare each gate with the promised value.

- [P-15] MUST make account access and recovery straightforward without repeatedly asking for authentication unnecessarily. Topic: Managing accounts. Source: https://developer.apple.com/design/human-interface-guidelines/managing-accounts. Why: People can return to their information. Check@1440/390: Test remembered sessions, explicit sign-out, expired sessions and recovery without exposing private data.

- [P-16] MUST provide a discoverable account-deletion path when account creation is offered and explain its consequences. Topic: Managing accounts. Source: https://developer.apple.com/design/human-interface-guidelines/managing-accounts. Why: People retain control of their account and data. Check@1440/390: Capture initiation, consequences, confirmation and completion; separately verify actual deletion handling. Legal retention exceptions require current qualified review.

- [P-17] MUST make search scope, useful suggestions and relevant results understandable. Topic: Searching. Source: https://developer.apple.com/design/human-interface-guidelines/searching. Why: People know where they are searching and what matched. Check@1440/390: Use a fixed query set including exact, ambiguous and no-result cases; inspect scope and result context.

- [P-18] MUST respect privacy when retaining or displaying search history. Topic: Searching. Source: https://developer.apple.com/design/human-interface-guidelines/searching. Why: Sensitive queries do not surprise people later. Check@1440/390: Test history controls and account/session boundaries with synthetic sensitive queries.

- [P-19] MUST keep settings purposeful, discoverable and consistent with applicable system preferences. Topic: Settings. Source: https://developer.apple.com/design/human-interface-guidelines/settings. Why: People do not hunt through duplicate controls. Check@1440/390: Review each setting’s need, default and effect; test supported accessibility preferences without overriding them. FAIL for any setting that duplicates a readable system preference or has no observable effect in the captures.

- [P-20] MUST match interruption urgency to the actual event and obtain the applicable notification consent. Topic: Managing notifications. Source: https://developer.apple.com/design/human-interface-guidelines/managing-notifications. Why: People control interruptions. Check@1440/390: Inspect permission and settings states, then deliver representative events; never treat promotion as urgent safety information.

- [P-21] MUST keep notifications concise, private and actionable without duplicating the same event. Topic: Notifications. Source: https://developer.apple.com/design/human-interface-guidelines/notifications. Why: People can respond without exposing or repeating information. Check@1440/390: Capture preview-hidden/visible and missed-notification paths; inspect event delivery history separately.

- [P-22] MUST make sharing scope, participant access and collaboration state visible and manageable. Topic: Collaboration and sharing. Source: https://developer.apple.com/design/human-interface-guidelines/collaboration-and-sharing. Why: People know who can see or change content. Check@1440/390: Share synthetic content with distinct roles; inspect invitations, permissions, edits and access removal.

- [P-23] MUST preserve meaningful shared context while leaving personal comfort and accessibility settings under individual control. Topic: SharePlay. Source: https://developer.apple.com/design/human-interface-guidelines/shareplay. Why: People can collaborate without overriding one another. Check@1440/390: Run two participant contexts, including join/leave/rejoin and a personal-setting change.

- [P-24] MUST match audio behavior to the selected task and handle interruptions predictably. Topic: Playing audio. Source: https://developer.apple.com/design/human-interface-guidelines/playing-audio. Why: People retain control over listening. Check@1440/390: Test start, mute, temporary interruption, replacement audio and resume; screenshots alone cannot prove this.

- [P-25] MUST preserve meaningful video content and offer expected playback and accessibility controls. Topic: Playing video. Source: https://developer.apple.com/design/human-interface-guidelines/playing-video. Why: People can watch without distortion or losing essential content. Check@1440/390: Compare intended aspect/crop with rendered video; exercise controls, captions and fullscreen transitions.

- [P-26] MUST tie tactile feedback consistently to an event and provide other essential feedback. Topic: Playing haptics. Source: https://developer.apple.com/design/human-interface-guidelines/playing-haptics. Why: People understand success or failure without depending on vibration. Check@1440/390: Test equivalent events on haptic-capable and incapable devices; compare accompanying visible/audible information.

- [P-27] MUST choose a chart that communicates the relevant comparison, pattern or change without overstating it. Topic: Charting data. Source: https://developer.apple.com/design/human-interface-guidelines/charting-data. Why: People interpret evidence correctly. Check@1440/390: Use fixed data with extremes and missing values; inspect scale, annotations, units and the claimed takeaway.

- [P-28] MUST provide understandable chart context and an accessible path to important values. Topic: Charting data. Source: https://developer.apple.com/design/human-interface-guidelines/charting-data. Why: People can grasp and inspect the data. Check@1440/390: Compare title/summary/legend with underlying data; verify text or assistive access to essential values.

- [P-29] MUST state what a generative feature can do, where it can fail and what it requires to be available. Topic: Generative AI. Source: https://developer.apple.com/design/human-interface-guidelines/generative-ai. Why: People form realistic expectations. Check@1440/390: Capture entry, unavailable/offline, first-use and limitation states using actual capability conditions.

- [P-30] MUST retain human control over consequential generated actions and make results reviewable or reversible where applicable. Topic: Generative AI. Source: https://developer.apple.com/design/human-interface-guidelines/generative-ai. Why: Automation does not bypass a meaningful decision. Check@1440/390: Generate, review, edit, cancel and apply using harmless test data; verify no consequential action occurs before required intent.

- [P-31] MUST protect sensitive input and make remote processing or sharing understandable. Topic: Generative AI. Source: https://developer.apple.com/design/human-interface-guidelines/generative-ai. Why: People know where their information goes. Check@1440/390: Inspect disclosures against the actual processing route and permission boundary; source-only review is insufficient.

- [P-32] MUST communicate generation progress, errors and useful recovery without hiding the current task. Topic: Generative AI. Source: https://developer.apple.com/design/human-interface-guidelines/generative-ai. Why: People can continue after an unreliable result. Check@1440/390: Exercise slow, failed, canceled and retried generation; inspect preserved input and next actions.

- [P-33] MUST calibrate uncertainty and confidence information to the decision people need to make. Topic: Machine learning. Source: https://developer.apple.com/design/human-interface-guidelines/machine-learning. Why: People do not mistake probabilistic output for certainty. Check@1440/390: Use known high/low-confidence and wrong outputs; inspect explanation and available correction rather than invented numeric confidence.

- [P-34] MUST let people correct important inferred values or provide voluntary feedback when useful. Topic: Machine learning. Source: https://developer.apple.com/design/human-interface-guidelines/machine-learning. Why: The experience can recover from a wrong inference. Check@1440/390: Correct a known error, inspect the visible result and test persistence only where it is promised.

- [P-35] MUST retest the user experience when model behavior changes. Topic: Generative AI. Source: https://developer.apple.com/design/human-interface-guidelines/generative-ai. Why: House rule derived from HIG Continuous improvement; an update does not silently break an established task. Check@1440/390: Run the same fixed journey cases and known failure cases before and after the change; compare outcomes and disclose untested cases.

- [P-36] MUST request optional feedback at a suitable pause rather than interrupting an unfinished task. Topic: Ratings and reviews. Source: https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews. Why: People can finish the reason they came. Check@1440/390: Capture the request trigger and test dismissal; confirm it does not repeatedly reappear in the same journey.

- [P-37] MUST expose printing choices appropriate to the actual output and make their effect understandable. Topic: Printing. Source: https://developer.apple.com/design/human-interface-guidelines/printing. Why: People can predict the document they will receive. Check@1440/390: Inspect print preview and required settings at both UI widths; separately inspect generated pages or physical output.

- [P-38] MUST keep an understandable route into and out of fullscreen while preserving the ongoing task. Topic: Going full screen. Source: https://developer.apple.com/design/human-interface-guidelines/going-full-screen. Why: People do not lose place or controls. Check@1440/390: Enter/exit fullscreen and restore hidden controls; compare content and playback/edit state.

- [P-39] MUST make a transition to greater immersion deliberate and keep an understandable return path. Topic: Immersive experiences. Source: https://developer.apple.com/design/human-interface-guidelines/immersive-experiences. Why: People retain control over context. Check@1440/390: Capture entry, interruption and exit; use the actual spatial device when applicable rather than a flat screenshot claim.

- [P-40] MUST distinguish user-requested media from incidental interface sound. Topic: Playing audio. Source: https://developer.apple.com/design/human-interface-guidelines/playing-audio. Why: A small interaction does not displace chosen listening. Check@1440/390: Play external media while using ordinary interface controls; inspect audio-session behavior and visible controls.
