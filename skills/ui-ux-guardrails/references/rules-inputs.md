# Inputs: support the way people can act

19 guardrails. Hardware-specific cases apply only when that input is supported. Record N/A explicitly; do not invent a hardware feature for a website.

Apply a rule only when its condition exists; units, web baselines, native-device cases and conflicts are in [standards and scope](standards-and-scope.md). A screenshot never replaces the named behavior test.

- [I-01] MUST preserve familiar gesture meanings and reserve custom gestures for a justified task. Topic: Gestures. Source: https://developer.apple.com/design/human-interface-guidelines/gestures. Why: People can reuse learned behavior. Check@1440/390: Perform supported standard gestures and the custom alternative; capture discoverability and result.

- [I-03] MUST keep keyboard navigation logical and expose shortcuts for important repeated commands when the platform supports them. Topic: Keyboards. Source: https://developer.apple.com/design/human-interface-guidelines/keyboards. Why: People can work without switching input. Check@1440/390: Run a fixed keyboard-only journey; record focus order and shortcut outcomes.

- [I-04] MUST preserve reserved system shortcuts and use familiar meanings for standard commands. Topic: Keyboards. Source: https://developer.apple.com/design/human-interface-guidelines/keyboards. Why: The product does not break learned system behavior. Check@1440/390: Exercise standard and custom bindings on each supported platform and keyboard layout.

- [I-05] MUST keep task outcomes consistent across supported pointer and touch input. Topic: Pointing devices. Source: https://developer.apple.com/design/human-interface-guidelines/pointing-devices. Why: People can switch tools without relearning the product. Check@1440/390: Repeat the same task with each input, including modifiers and multiselection where supported.

- [I-06] MUST make essential hover-hidden actions available to touch and keyboard users. Topic: Pointing devices; Accessibility. Source: https://developer.apple.com/design/human-interface-guidelines/pointing-devices, https://developer.apple.com/design/human-interface-guidelines/accessibility. Why: A hidden control does not block the task. Check@1440/390: Reveal and activate every essential action without hover; capture equivalent paths.

- [I-07] MUST use pointer feedback to communicate an actual action or state. Topic: Pointing devices. Source: https://developer.apple.com/design/human-interface-guidelines/pointing-devices. Why: People do not confuse decorative effects with functionality. Check@1440/390: Compare cursor/hover effects across text, links and controls; probe hit boundaries and neighboring regions.

- [I-08] MUST distinguish focus, selection, pressing and unavailability. Topic: Focus and selection. Source: https://developer.apple.com/design/human-interface-guidelines/focus-and-selection. Why: People know what is targeted versus chosen. Check@1440/390: Capture applicable states and verify activation does not occur merely while navigating focus unless explicitly intended.

- [I-09] MUST keep focus visible, logically ordered and stable through updates. Topic: Focus and selection. Source: https://developer.apple.com/design/human-interface-guidelines/focus-and-selection. Why: People do not lose their place. Check@1440/390: Navigate groups, update/remove the focused item and return from overlays; record focus position and unclipped frames.

- [I-10] MUST expose meaningful accessible names, roles, states and relationships for custom controls. Topic: VoiceOver. Source: https://developer.apple.com/design/human-interface-guidelines/voiceover. Why: Assistive output communicates the same task. Check@1440/390: Inspect accessibility output, then complete the task with the relevant screen reader; screenshots alone are insufficient.

- [I-11] MUST offer navigable alternatives to precision or direct-touch-only interaction. Topic: VoiceOver. Source: https://developer.apple.com/design/human-interface-guidelines/voiceover. Why: People using assistive navigation can reach the same result. Check@1440/390: Run essential tasks with screen-reader navigation and supported alternative controls.

- [I-12] MUST keep the active field and necessary next action visible when a virtual keyboard opens. Topic: Virtual keyboards. Source: https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards. Why: People can see and finish their entry. Check@1440/390: Capture focused fields at top and bottom, longest input and orientation change with the keyboard open.

- [I-13] MUST match keyboard semantics to the data and keep custom keyboards understandable and escapable. Topic: Virtual keyboards. Source: https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards. Why: People enter values with appropriate keys and can regain familiar input. Check@1440/390: Test relevant input types, submit keys, switching and setup help; inspect host and custom controls together.

- [I-14] MUST provide comfortable, stable gaze targets with alternative input. Topic: Eyes. Source: https://developer.apple.com/design/human-interface-guidelines/eyes. Why: People can interact without rapid eye motion or involuntary activation. Check@1440/390: Not screenshot-checkable: test intended distance, duration, target separation and an accessible alternative in-device; attach representative views.

- [I-15] MUST make pen marking immediate and predictable while preserving hand comfort and tool access. Topic: Apple Pencil and Scribble. Source: https://developer.apple.com/design/human-interface-guidelines/apple-pencil-and-scribble. Why: People can write naturally without losing controls under their hand. Check@1440/390: Test left/right-handed marking, hover prediction and common controls on supported hardware.

- [I-16] MUST keep handwriting input stationary and free of overlapping suggestions during a stroke. Topic: Apple Pencil and Scribble. Source: https://developer.apple.com/design/human-interface-guidelines/apple-pencil-and-scribble. Why: People can see and control their writing. Check@1440/390: Record long handwriting, selection and pauses; inspect placeholder, resize and scroll behavior.

- [I-19] MUST make controller requirements, mappings and available alternatives clear. Topic: Game controls. Source: https://developer.apple.com/design/human-interface-guidelines/game-controls. Why: Players can join with the equipment and abilities they have. Check@1440/390: Test missing/connected/switched controller states, touch/keyboard alternatives and rebinding; use actual supported hardware.

- [I-20] MUST use motion sensing for a specific benefit and avoid unnecessary motion-only ordinary tasks. Topic: Gyroscope and accelerometer. Source: https://developer.apple.com/design/human-interface-guidelines/gyro-and-accelerometer. Why: People can operate the product without precise physical movement. Check@1440/390: Compare sensing permission and data use with the feature; complete ordinary tasks without tilt or shake.

- [I-21] MUST explain proximity guidance and sensor limits while retaining another route to the task. Topic: Nearby interactions. Source: https://developer.apple.com/design/human-interface-guidelines/nearby-interactions. Why: People can recover when location or hardware is unreliable. Check@1440/390: Test approach, obstruction, out-of-range and unsupported-device cases; complete the alternative path.

- [I-22] MUST keep remote navigation and activation predictable and resistant to incidental contact. Topic: Remotes. Source: https://developer.apple.com/design/human-interface-guidelines/remotes. Why: People can operate a distant display without accidental actions. Check@1440/390: Test focus movement, deliberate activation, incidental touch and expected playback commands.

