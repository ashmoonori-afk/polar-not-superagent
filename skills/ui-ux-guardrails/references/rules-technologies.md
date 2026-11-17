# System experiences and conditional domains

37 guardrails. These are conditional principles extracted from system and integration pages. They do not require a web product to implement Apple services, payments, health features or spatial UI.

Apply a rule only when its condition exists; units, web baselines, native-device cases and conflicts are in [standards and scope](standards-and-scope.md). A screenshot never replaces the named behavior test.

- [T-01] MUST keep shortcuts focused on useful tasks and clarify missing information before an ambiguous action. Topic: App Shortcuts. Source: https://developer.apple.com/design/human-interface-guidelines/app-shortcuts. Why: People get the intended result without opening unrelated screens. Check@1440/390: Invoke complete, incomplete and ambiguous requests; inspect clarification and final task result.

- [T-02] MUST distinguish action confirmation from a completed result in compact responses. Topic: Snippets. Source: https://developer.apple.com/design/human-interface-guidelines/snippets. Why: People know whether approval or more work remains. Check@1440/390: Capture proposed, canceled, completed and failed outcomes; test visual and spoken equivalence where supported.

- [T-03] MUST make quick-access controls recognizable, purposeful and safe in locked or glanceable contexts. Topic: Controls. Source: https://developer.apple.com/design/human-interface-guidelines/controls. Why: People can act confidently outside the full application. Check@1440/390: Capture label/state and test locked-device access, authentication and unintended activation with harmless data.

- [T-04] MUST prioritize useful current information in very small persistent displays. Topic: Complications. Source: https://developer.apple.com/design/human-interface-guidelines/complications. Why: People can understand a glance without opening the full product. Check@1440/390: Capture smallest/longest values and stale or missing data; verify accessible descriptions and the detail destination.

- [T-05] MUST keep compact information fresh enough for its purpose and reveal data age when freshness matters. Topic: Widgets. Source: https://developer.apple.com/design/human-interface-guidelines/widgets. Why: People do not mistake a snapshot for live tracking. Check@1440/390: Compare update timestamps with source data; capture current, stale, unavailable and refreshing states.

- [T-06] MUST preserve the same primary purpose across widget sizes and link to the exact relevant content. Topic: Widgets. Source: https://developer.apple.com/design/human-interface-guidelines/widgets. Why: People recognize the tool and can continue the task. Check@1440/390: Compare supported sizes and configuration states; activate each destination.

- [T-07] MUST bind live tracking to a definite task lifecycle and end the active state when the task ends. Topic: Live Activities. Source: https://developer.apple.com/design/human-interface-guidelines/live-activities. Why: People do not confuse old status with ongoing work. Check@1440/390: Run start, update, complete, cancel and expired cases; compare the displayed state with actual events.

- [T-08] MUST keep live updates concise, private and nonduplicative with other alerts. Topic: Live Activities. Source: https://developer.apple.com/design/human-interface-guidelines/live-activities. Why: People can glance without extra interruption or exposure. Check@1440/390: Inspect locked/ambient variants and event logs; test disable-tracking and detail entry.

- [T-09] MUST redact sensitive information and preserve important legibility in unattended or dimmed views. Topic: Always On. Source: https://developer.apple.com/design/human-interface-guidelines/always-on. Why: Bystanders cannot read private details while owners retain useful status. Check@1440/390: Capture active, dim and unattended states with synthetic data; inspect transition continuity and disabled controls.

- [T-10] MUST keep persistent auxiliary controls findable without obscuring the main content. Topic: Ornaments. Source: https://developer.apple.com/design/human-interface-guidelines/ornaments. Why: People can operate an ongoing task while viewing it. Check@1440/390: Compare scrolled and immersive states; test control restoration and neighboring hit areas.

- [T-13] MUST make external playback status and control clear while preserving expected continuation and privacy. Topic: AirPlay. Source: https://developer.apple.com/design/human-interface-guidelines/airplay. Why: People know what another device receives. Check@1440/390: Stream, background, lock and browse unrelated content; inspect receiver output and remote controls.

- [T-14] MUST let a lightweight entry complete its promised task without avoidable setup or promotion. Topic: App Clips. Source: https://developer.apple.com/design/human-interface-guidelines/app-clips. Why: People with limited time receive the value they entered for. Check@1440/390: Open a contextual entry on a constrained network; complete the task without optional installation or account creation.

- [T-15] MUST preserve task context when moving from a lightweight entry to the full product. Topic: App Clips. Source: https://developer.apple.com/design/human-interface-guidelines/app-clips. Why: People do not repeat completed work. Check@1440/390: Transition with known content/account state and verify the correct continuation screen.

- [T-16] MUST present the actual items, final price and required fulfillment information before payment authorization. Topic: Apple Pay. Source: https://developer.apple.com/design/human-interface-guidelines/apple-pay. Why: People know what they are buying and paying. Check@1440/390: Compare checkout review with the final order using discounts, tax, shipping and pickup cases that the product supports.

- [T-17] MUST distinguish payment processing, failure and completed purchase with an actionable result. Topic: Apple Pay. Source: https://developer.apple.com/design/human-interface-guidelines/apple-pay. Why: People do not mistake initiation for a paid order. Check@1440/390: Exercise approved, declined and interrupted payment using a safe test environment; compare confirmation, receipt and order status.

- [T-18] MUST explain purchase value, full price and applicable recurring terms before commitment. Topic: Apple In-App Purchase. Source: https://developer.apple.com/design/human-interface-guidelines/apple-in-app-purchase. Why: House rule; the HIG page asks for try-before-buy and an informed choice. Check@1440/390: Inspect item/plan descriptions, billing period, trial-to-paid transition and additional requirements using actual product terms.

- [T-19] MUST preserve purchased access and provide understandable restoration, subscription management or cancellation where applicable. Topic: Apple In-App Purchase. Source: https://developer.apple.com/design/human-interface-guidelines/apple-in-app-purchase. Why: People retain access and control across return visits. Check@1440/390: Test returning, restored, expired and canceled states in a safe test environment; do not infer success from a confirmation screen alone.

- [T-20] MUST explain spatial setup, tracking failure and recovery without assuming perfect sensing or unrestricted movement. Topic: Augmented reality. Source: https://developer.apple.com/design/human-interface-guidelines/augmented-reality. Why: People can use the experience in a real environment. Check@1440/390: Test initial scanning, weak light, tracking loss, interruption, reset and constrained-space alternatives in-device.

- [T-21] MUST preserve real-world scale and stable placement when the task depends on physical fit. Topic: Augmented reality. Source: https://developer.apple.com/design/human-interface-guidelines/augmented-reality. Why: People are not misled about size or location. Check@1440/390: Inspect several angles against a measured reference; test movement and refinement without replacing distance with scale.

- [T-22] MUST preserve comfort, awareness and accessible participation through immersive transitions. Topic: Immersive experiences. Source: https://developer.apple.com/design/human-interface-guidelines/immersive-experiences. Why: People can choose focus without losing control of their environment. Check@1440/390: Test seated use, limited space, tracking loss, exit and reduced motion in the intended device.

- [T-23] MUST minimize interaction and avoid requiring a companion device in a driving task. Topic: CarPlay. Source: https://developer.apple.com/design/human-interface-guidelines/carplay. Why: People can remain focused on driving. Check@1440/390: Inspect task length and setup before driving; test the current surface while the phone is inaccessible or prompts independently.

- [T-24] MUST make recurring personal tasks, schedules, completion and meaningful progress clear. Topic: CareKit. Source: https://developer.apple.com/design/human-interface-guidelines/carekit. Why: People know what to do, what is done and how to get help. Check@1440/390: Capture due, partial, complete and history states; inspect timestamps, chart context and trusted contact access.

- [T-25] MUST make sensitive-data access purposeful, understandable and revocable. Topic: HealthKit. Source: https://developer.apple.com/design/human-interface-guidelines/healthkit. Why: People control how personal information is used. Check@1440/390: Test permission denial/revocation with synthetic data; inspect policy access, actual use and privacy-preserving previews.

- [T-26] MUST keep shared device identity, location and state consistent while making conflicts and capability limits clear. Topic: HomeKit. Source: https://developer.apple.com/design/human-interface-guidelines/homekit. Why: People control the intended object rather than a stale or similarly named one. Check@1440/390: Test two locations, unsupported capabilities, external state changes and unresolved conflicts.

- [T-27] MUST make offline changes, synchronization conflicts and cross-device deletion consequences understandable. Topic: iCloud. Source: https://developer.apple.com/design/human-interface-guidelines/icloud. Why: People do not lose work or act on stale content unknowingly. Check@1440/390: Edit offline, reconnect, create a conflict and delete a synthetic item; verify propagation and recovery.

- [T-28] MUST request only the identity facts needed and make the requester and decision explicit. Topic: ID Verifier. Source: https://developer.apple.com/design/human-interface-guidelines/id-verifier. Why: People know who asks and avoid disclosing more than necessary. Check@1440/390: Capture purpose, requested facts, requester identity and separate match/nonmatch outcomes with synthetic data.

- [T-30] MUST let people preview the full information in motion media before sharing and provide a supported still alternative. Topic: Live Photos. Source: https://developer.apple.com/design/human-interface-guidelines/live-photos. Why: People control what recipients receive. Check@1440/390: Review full motion/audio, edits, sharing and unsupported-viewer fallback.

- [T-32] MUST keep location, selection, density and route context understandable at every supported map scale. Topic: Maps. Source: https://developer.apple.com/design/human-interface-guidelines/maps. Why: People can find and reach the intended place. Check@1440/390: Test dense points, search, selection, clustering, place details and floor changes where present; preserve surrounding orientation.

- [T-33] MUST explain scanning in task language and retain an explicit path when automatic detection is unavailable. Topic: NFC. Source: https://developer.apple.com/design/human-interface-guidelines/nfc. Why: People know what object to scan and can recover. Check@1440/390: Test first/repeated scans and disabled background detection using the actual supported device.

- [T-34] MUST preserve original media and make preview, save and discard outcomes explicit. Topic: Photo editing. Source: https://developer.apple.com/design/human-interface-guidelines/photo-editing. Why: People can recover valuable edits. Check@1440/390: Edit a fixed image, preview, save, cancel and retrieve the original; confirm discarding only when changes exist.

- [T-35] MUST make participation requirements, consent, progress and withdrawal understandable throughout a study journey. Topic: ResearchKit. Source: https://developer.apple.com/design/human-interface-guidelines/researchkit. Why: People retain informed control after joining. Check@1440/390: Inspect eligibility, full consent access, task timing, confirmation, record access and withdrawal; actual legal/clinical adequacy is outside this UI checklist.

- [T-36] MUST stop sensitive sensing when its task is complete and obtain separate intent for optional persistent storage. Topic: ShazamKit. Source: https://developer.apple.com/design/human-interface-guidelines/shazamkit. Why: A brief recognition action does not become ongoing capture or unwanted history. Check@1440/390: Inspect recording lifecycle and storage before/after opt-in with synthetic data.

- [T-37] MUST preserve existing account content and privacy choices when introducing federated authentication. Topic: Sign in with Apple. Source: https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple. Why: People do not lose their account or private contact preference. Check@1440/390: Test linking, fresh sign-in, declined optional fields, relay identity and return to the original task.

- [T-38] MUST make voice responses concise, context-complete and clear about actions, ambiguity and failure. Topic: Siri. Source: https://developer.apple.com/design/human-interface-guidelines/siri. Why: People can understand without looking at a screen. Check@1440/390: Complete the task audio-only, then compare visual results, clarification and recovery; consider bystanders.

- [T-39] MUST distinguish reading a payment instrument from receiving authorization and offer a usable failure path. Topic: Tap to Pay on iPhone. Source: https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone. Why: Merchants do not treat a card-read checkmark as a paid sale. Check@1440/390: Test successful read followed by delayed/declined authorization, retry and alternate method in a safe payment environment.

- [T-40] MUST keep passes and order tracking current, retrievable and explicit about split fulfillment or problems. Topic: Wallet. Source: https://developer.apple.com/design/human-interface-guidelines/wallet. Why: People can receive an order or use a credential when needed. Check@1440/390: Inspect pending, shipped/pickup, partial, canceled, expired and unsupported-device cases with direct management/help routes.

- [T-41] MUST make progress, invitations and competitive comparisons understandable and fair to their stated task. Topic: Game Center. Source: https://developer.apple.com/design/human-interface-guidelines/game-center. Why: Players can join and interpret results without hidden prerequisites. Check@1440/390: Test beginner/returning invitations, achievement states, scoring periods and late join/rejoin against fixed game data.

