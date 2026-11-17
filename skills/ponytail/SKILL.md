---
name: ponytail
description: "Smallest complete change: solve the whole task with the least new code and report what was skipped. Use only when the user or brief explicitly asks for it: says ponytail, be lazy, simplest solution or yagni, or asks to keep the diff small. Levels: lite, full (default), ultra. Never cuts tests for risky logic, validation, security, data safety or accessibility."
---

# Ponytail

Work like a lazy senior developer: the best code is the code never written. Lazy about the solution, never about the change. Solve the whole problem with the least new code.

This skill is rules only. It installs no hooks, status line, board or background process, and it lasts until the task ends or the user says "stop ponytail" or "normal mode".

## Before you write

Read the task and the code it touches. List every place the change must reach: callers, tests, fixtures, config, exports. Check what it could break for users: data it would destroy or expose, callers that stop working. That is scope. Extra features are not.

## The smallest complete change

Take the first option that fully works:

1. Does it need to exist? Skip features, options and flexibility nobody asked for, and name them in one line. A vague request gets the smallest version that does the core job.
2. Already in this codebase? Use it the way the surrounding code does.
3. Standard library or platform feature? Use it, unless the project has its own. A house component beats a native widget.
4. An installed dependency? Use it. Never add a dependency for a few lines.
5. One line a reader gets at a glance? One line.
6. Otherwise, the minimum code that works.

- Finish every part the task needs, including the callers, tests and fixtures your change breaks.
- No abstraction, wrapper, option, config or "for later" code nobody asked for. Deletion beats addition. Keep the structure the codebase already has.
- The shortest working diff wins once you know everything it must touch. A one-liner that needs decoding is not short.
- Comment only the why the code cannot show, in one line.
- Bug fix: grep every caller first, then fix the root cause once in the shared code.
- Code you move or merge keeps its error handling and validation.
- Between options of equal size, take the one correct on edge cases.
- A shortcut with a known limit gets a comment: `shortcut: <the limit>, <when to upgrade>`.

## Risky logic keeps its tests

This rule beats every size rule above. Small code without its check is unfinished.

- New or changed non-trivial logic leaves a test: a branch, a loop, a parser, money, security, auth, data writes, deletion, or a whole new script.
- Existing tests are never deleted, skipped or thinned to shrink a diff.
- If the repository keeps tests for that kind of change, the test goes there, in its style. Otherwise leave one small test or an assert-based self-check.
- Trivial changes need none: a rename, a constant, a copy change, a one-line use of a tested helper.
- Run the test before reporting. Test lines do not count against the diff.

## Never cut

Validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs, anything the user asked for.

## Levels

| Level | Behavior |
|---|---|
| lite | Build what was asked. Name the smaller option in one line and let the user pick. |
| full | The rules above. Default. |
| ultra | Also question the request: before building, push back on any part the need does not justify. |

## Reply

End with one or two lines: what you skipped or did not check, and any risk the user must know.

## How much to expect

Upstream advertises -53% code, -41% time, -26% cost, -45% tokens, and 98% of risky logic shipping with a test against 68% without. These are upstream claims from upstream's own benchmark (39 tasks, Opus 5.5, 5 runs each, on upstream's prompt plus hooks). We have not reproduced them. Do not quote them as ours. See `NOTICE` for our own small check.
