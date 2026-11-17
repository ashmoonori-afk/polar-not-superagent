# Components: make each control truthful

52 guardrails. This file selects transferable interaction and information principles; it does not mandate Apple component appearance.

Apply a rule only when its condition exists; units, web baselines, native-device cases and conflicts are in [standards and scope](standards-and-scope.md). A screenshot never replaces the named behavior test.

- [C-01] MUST make a button’s purpose and interactive state clear. Topic: Buttons. Source: https://developer.apple.com/design/human-interface-guidelines/buttons. Why: People know what will happen and whether a press registered. Check@1440/390: Capture idle, hover/focus, pressed, disabled and working states as applicable; exercise activation.

- [C-02] MUST distinguish primary, secondary and destructive actions consistently. Topic: Buttons. Source: https://developer.apple.com/design/human-interface-guidelines/buttons. Why: People can identify the intended choice and its consequence. Check@1440/390: Compare adjacent actions and repeated component use; inspect labels and semantics, not color alone.

- [C-03] MUST preserve a stable understandable control while its action is processing. Topic: Buttons. Source: https://developer.apple.com/design/human-interface-guidelines/buttons. Why: People can see that their request is underway. Check@1440/390: Record activation through completion, including repeat input; inspect loading state and final outcome.

- [C-04] MUST keep essential actions available without requiring discovery of a context menu. Topic: Context menus. Source: https://developer.apple.com/design/human-interface-guidelines/context-menus. Why: People using other inputs can complete the task. Check@1440/390: Locate the visible or menu-bar alternative; operate it with keyboard and touch.

- [C-05] MUST label and group menu actions by their purpose with a predictable order. Topic: Menus. Source: https://developer.apple.com/design/human-interface-guidelines/menus. Why: People find the intended command. Check@1440/390: Inspect full and narrow menus, separators and repeated action names; compare grouping with the task.

- [C-06] MUST distinguish unavailable commands from commands that do not apply to the context. Topic: Menus. Source: https://developer.apple.com/design/human-interface-guidelines/menus. Why: People understand what is possible now. Check@1440/390: Capture no-selection, valid-selection and unavailable-action cases; document context-driven hiding versus stable disabled commands.

- [C-07] MUST distinguish a menu of commands from selection among values. Topic: Pull-down buttons. Source: https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons. Why: Opening a control does not unexpectedly execute an action. Check@1440/390: Capture the trigger, open menu and resulting action; compare selected-value semantics where applicable.

- [C-08] MUST display the current value for a single-choice value selector. Topic: Pop-up buttons. Source: https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons. Why: People know the setting without reopening it. Check@1440/390: Capture initial, changed and longest values; verify only one selection where the control promises one.

- [C-09] MUST prioritize frequent commands and preserve access to overflowed commands in constrained space. Topic: Toolbars. Source: https://developer.apple.com/design/human-interface-guidelines/toolbars. Why: People can still act in a narrow layout. Check@1440/390: Resize the same toolbar and activate every overflowed command; avoid copying native-only overflow implementation rules.

- [C-10] MUST keep familiar editing actions available in their relevant context. Topic: Edit menus. Source: https://developer.apple.com/design/human-interface-guidelines/edit-menus. Why: People can copy, cut, paste or select using learned methods. Check@1440/390: Test text and content selection, empty clipboard and standard supported shortcuts.

- [C-11] MUST use top-level tabs for destinations rather than unrelated actions. Topic: Tab bars. Source: https://developer.apple.com/design/human-interface-guidelines/tab-bars. Why: People understand where they are in the product. Check@1440/390: Compare tab labels with destinations, selected state and direct-entry routes.

- [C-12] MUST keep top-level destinations stable and recognizable through navigation. Topic: Tab bars. Source: https://developer.apple.com/design/human-interface-guidelines/tab-bars. Why: People do not lose their current section. Check@1440/390: Capture transitions, empty sections and overflow navigation; verify destinations remain discoverable.

- [C-13] MUST organize sidebar destinations around the product hierarchy and show the current selection. Topic: Sidebars. Source: https://developer.apple.com/design/human-interface-guidelines/sidebars. Why: People can understand location and next navigation. Check@1440/390: Inspect grouped destinations, selection and compact sidebar access.

- [C-14] MUST preserve the relationship between selection and detail when a split view collapses. Topic: Split views. Source: https://developer.apple.com/design/human-interface-guidelines/split-views. Why: People know which item they are viewing. Check@1440/390: Select an item, narrow the view, navigate back and widen it again; compare selection and content.

- [C-15] MUST make hierarchical location and available ancestor navigation understandable. Topic: Path controls. Source: https://developer.apple.com/design/human-interface-guidelines/path-controls. Why: People can move upward without losing place. Check@1440/390: Capture a deep path including truncation; activate accessible ancestors and verify destinations.

- [C-16] MUST communicate current position in a finite page set and provide an operable way to move. Topic: Page controls. Source: https://developer.apple.com/design/human-interface-guidelines/page-controls. Why: People understand that more pages exist. Check@1440/390: Capture first/middle/last positions; test both gesture and control/keyboard navigation.

- [C-17] MUST make search scope, input, clearing and exit behavior clear. Topic: Search fields. Source: https://developer.apple.com/design/human-interface-guidelines/search-fields. Why: People can revise a query and return to browsing. Check@1440/390: Enter, refine, clear and cancel a query; inspect results, retained scope and restored browsing state.

- [C-18] MUST keep scrolling predictable and avoid confusing nested same-direction regions. Topic: Scroll views. Source: https://developer.apple.com/design/human-interface-guidelines/scroll-views. Why: People can reach content without fighting the container. Check@1440/390: Scroll each region using supported inputs; inspect beginning/end, indicators and intentional independent regions.

- [C-19] MUST keep list rows and table columns readable for their data and selection behavior. Topic: Lists and tables. Source: https://developer.apple.com/design/human-interface-guidelines/lists-and-tables. Why: People can compare and act on records. Check@1440/390: Use short, long, empty and extreme-value data; inspect labels, row selection and truncation access.

- [C-20] MUST expose sorting, filtering and editing when the task requires them without hiding their current effect. Topic: Lists and tables. Source: https://developer.apple.com/design/human-interface-guidelines/lists-and-tables. Why: People understand why a record moved or disappeared. Check@1440/390: Exercise each supported operation on fixed records; capture current sort/filter state and no-result recovery.

- [C-21] MUST choose grid or collection density for recognizable content rather than filling space. Topic: Collections. Source: https://developer.apple.com/design/human-interface-guidelines/collections. Why: People can distinguish and select items. Check@1440/390: Capture sparse/dense and longest-label sets; inspect focus, selection and responsive reflow.

- [C-22] MUST make hierarchy and expansion state visible in tree-like content. Topic: Outline views. Source: https://developer.apple.com/design/human-interface-guidelines/outline-views. Why: People understand parent-child relationships. Check@1440/390: Expand/collapse nested items and inspect indentation, disclosure state and selection.

- [C-23] MUST preserve readable names and current hierarchy when using multiple navigation columns. Topic: Column views. Source: https://developer.apple.com/design/human-interface-guidelines/column-views. Why: People can follow a deep selection. Check@1440/390: Choose a deep item and longest names; test resizing or a full-name alternative.

- [C-24] MUST group related content without creating ambiguous nested boundaries. Topic: Boxes. Source: https://developer.apple.com/design/human-interface-guidelines/boxes. Why: People can identify which controls belong together. Check@1440/390: Compare group title, spacing and content relationship; FAIL when a box groups controls acting on different objects, or nested boxes have no distinguishing title.

- [C-25] MUST make expandable detail discoverable and keep its relationship to the controlling item clear. Topic: Disclosure controls. Source: https://developer.apple.com/design/human-interface-guidelines/disclosure-controls. Why: People can find more information without losing context. Check@1440/390: Capture collapsed/expanded states; operate by keyboard and inspect programmatic expanded state.

- [C-26] MUST keep a label close to the content it describes and avoid making static text look actionable. Topic: Labels. Source: https://developer.apple.com/design/human-interface-guidelines/labels. Why: People associate information with the right value or control. Check@1440/390: Inspect dense groups, wrapping and alignment; compare appearance with actual interaction semantics.

- [C-27] MUST preserve important image content at each crop, scale and interaction state. Topic: Image views. Source: https://developer.apple.com/design/human-interface-guidelines/image-views. Why: People do not lose the subject or mistake an image for a control. Check@1440/390: Capture supported crops and zoom states; compare with intended source content and accessible description.

- [C-28] MUST use a text presentation suited to the expected amount of reading or editing. Topic: Text views. Source: https://developer.apple.com/design/human-interface-guidelines/text-views. Why: People can read and navigate long content. Check@1440/390: Capture longest content, selection and editing states; verify expected links and keyboard behavior.

- [C-29] MUST preserve familiar browsing behavior when showing web content in another surface. Topic: Web views. Source: https://developer.apple.com/design/human-interface-guidelines/web-views. Why: People can follow links and return predictably. Check@1440/390: Test loading, navigation, external links, back and errors; do not claim native controls prove web accessibility.

- [C-30] MUST reserve interrupting alerts for information or decisions that require attention. Topic: Alerts. Source: https://developer.apple.com/design/human-interface-guidelines/alerts. Why: Routine status does not disrupt the task. Check@1440/390: Compare alerts with inline/status alternatives and record the decision each alert requires.

- [C-31] MUST state the problem or consequence clearly and label actions by their result. Topic: Alerts. Source: https://developer.apple.com/design/human-interface-guidelines/alerts. Why: People can choose without guessing. Check@1440/390: Capture representative alerts with longest text; test the focused/default action and dismissal.

- [C-32] MUST make consequential destructive choices deliberate and provide the appropriate cancellation path. Topic: Alerts. Source: https://developer.apple.com/design/human-interface-guidelines/alerts. Why: People avoid accidental loss. Check@1440/390: Attempt keyboard default activation and cancellation using harmless data; compare consequences with the final result.

- [C-33] MUST keep a modal task focused and provide an understandable exit. Topic: Modality. Source: https://developer.apple.com/design/human-interface-guidelines/modality. Why: People can complete or leave without getting trapped. Check@1440/390: Open, complete and dismiss the task; test keyboard focus containment and restoration where modality requires it.

- [C-34] MUST keep sheet content relevant to its parent task and preserve work according to explicit completion/cancel semantics. Topic: Sheets. Source: https://developer.apple.com/design/human-interface-guidelines/sheets. Why: People understand what closing the sheet will do. Check@1440/390: Capture parent context and sheet states; test save, cancel, dismiss and unsaved changes.

- [C-35] MUST anchor contextual information clearly and adapt its presentation to available space. Topic: Popovers. Source: https://developer.apple.com/design/human-interface-guidelines/popovers. Why: People know what the popover refers to. Check@1440/390: Open at edges and narrow widths; inspect clipping, dismissal and whether edits commit or require confirmation.

- [C-36] MUST present a focused choice set tied to the initiating action. Topic: Action sheets. Source: https://developer.apple.com/design/human-interface-guidelines/action-sheets. Why: People can resolve one decision quickly. Check@1440/390: Capture trigger, choices and cancellation; inspect destructive choices separately.

- [C-37] MUST keep auxiliary controls focused on useful task details without obscuring the main work. Topic: Panels. Source: https://developer.apple.com/design/human-interface-guidelines/panels. Why: People can inspect or edit while retaining context. Check@1440/390: Capture open/closed panels, resizing and main-task interaction.

- [C-38] MUST preserve understandable window identity, active input state and related content. Topic: Windows. Source: https://developer.apple.com/design/human-interface-guidelines/windows. Why: People know where their actions apply. Check@1440/390: Inspect active/inactive, multiple-window and restored states on supported desktop platforms; mark mobile window cases N/A when absent.

- [C-39] MUST distinguish choosing a suggested value from entering a valid custom value. Topic: Combo boxes. Source: https://developer.apple.com/design/human-interface-guidelines/combo-boxes. Why: People can use common and uncommon values confidently. Check@1440/390: Capture the labeled list, longest choice and custom-entry state; exercise both paths.

- [C-40] MUST order choices predictably and choose a selection control suited to option count and available space. Topic: Pickers. Source: https://developer.apple.com/design/human-interface-guidelines/pickers. Why: People find a value without excessive scanning. Check@1440/390: Inspect first/middle/last choices and the longest locale; keep the edited field in context.

- [C-41] MUST group closely related peer choices and keep current selection clear. Topic: Segmented controls. Source: https://developer.apple.com/design/human-interface-guidelines/segmented-controls. Why: People understand what the group changes. Check@1440/390: Capture every selected state; verify consistent selection versus action behavior and label fit.

- [C-42] MUST make slider purpose, range and current effect understandable and provide precision when needed. Topic: Sliders. Source: https://developer.apple.com/design/human-interface-guidelines/sliders. Why: People can reach the intended value. Check@1440/390: Inspect endpoints and scale, drag while observing the result and enter an exact value through the precision path.

- [C-43] MUST show the value changed by a stepper and provide a faster path for large changes when needed. Topic: Steppers. Source: https://developer.apple.com/design/human-interface-guidelines/steppers. Why: People avoid repeated taps for a distant value. Check@1440/390: Capture value association and use both incremental and direct-entry methods.

- [C-44] MUST use toggles for opposing states, label the affected setting and distinguish states without color alone. Topic: Toggles. Source: https://developer.apple.com/design/human-interface-guidelines/toggles. Why: People can predict the change. Check@1440/390: Capture off/on and mixed hierarchical states where applicable; verify independent versus exclusive selection semantics.

- [C-45] MUST match field shape, label and input behavior to the requested data. Topic: Text fields. Source: https://developer.apple.com/design/human-interface-guidelines/text-fields. Why: People can enter and inspect the correct value. Check@1440/390: Capture empty, filled, long, private and invalid values; test keyboard order, masking, clearing and supported paste.

- [C-46] MUST explain a sensitive short-code request and conceal its entered value when appropriate. Topic: Digit entry views. Source: https://developer.apple.com/design/human-interface-guidelines/digit-entry-views. Why: People understand the request without exposing a secret. Check@1440/390: Use a synthetic code; capture purpose, entry, error and completion.

- [C-47] MUST make image replacement and clearing behavior predictable. Topic: Image wells. Source: https://developer.apple.com/design/human-interface-guidelines/image-wells. Why: People retain a meaningful required image or known empty state. Check@1440/390: Replace, paste and clear a synthetic image; compare default/required-image behavior with the control contract.

- [C-48] MUST remove active progress after completion and keep ongoing progress located consistently. Topic: Progress indicators. Source: https://developer.apple.com/design/human-interface-guidelines/progress-indicators. Why: People can distinguish working from finished. Check@1440/390: Run related tasks to completion; compare active, failed and completed states.

- [C-49] MUST explain the current gauge value and range rather than relying on an unlabeled graphic. Topic: Gauges. Source: https://developer.apple.com/design/human-interface-guidelines/gauges. Why: People can interpret the amount. Check@1440/390: Capture low/middle/high and unavailable values; inspect endpoints, units and accessible descriptions.

- [C-50] MUST make rating scale and editability understandable. Topic: Rating indicators. Source: https://developer.apple.com/design/human-interface-guidelines/rating-indicators. Why: People can interpret or change a rating without guessing. Check@1440/390: Capture read-only/editable and changed-rating states using representative values.

- [C-51] MUST keep status overlays readable and recoverable when hidden for immersive content. Topic: Status bars. Source: https://developer.apple.com/design/human-interface-guidelines/status-bars. Why: People can check status without abandoning the task. Check@1440/390: Capture scrolled, busy-background and hidden/restored states; test the restore action.

- [C-52] MUST keep chart encodings, scales and contextual annotations understandable in every presentation size. Topic: Charts. Source: https://developer.apple.com/design/human-interface-guidelines/charts. Why: People can compare the same data without a misleading visual change. Check@1440/390: Use the same fixed data at preview/full sizes and supported themes; compare marks, labels, scales and accessible values.

