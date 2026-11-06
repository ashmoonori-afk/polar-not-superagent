# Models, context compaction and token use in Polar

This guide covers four things: which model leads and which models do the other work, how context compaction is tuned per model and per project, how omo builds the system prompt for each model, and the token-saving rules every Polar session follows.

Ready-made settings files are in [examples/polar](../../examples/polar): `settings.global.json` and `settings.project.json`.

Statements about omo's behavior come from the installed package `omo-ai` 5.1.60 and the `senpi` runtime 2026.11.2-3 it bundles. Source paths below are relative to the `omo-ai` package directory (find it with `npm root -g`). Most of them sit in the `dist/` directory of the `senpi` package under `node_modules`, written here as `senpi/dist/`.

## Orchestrator and model roles

**Run the orchestrator on Claude Opus 5.5 through the subscription.** In this setup Opus 5.5 is the one model that runs every phase of the lead's job: it plans, delegates, verifies and talks to {user}. It runs for days, so it runs on the subscription rather than a pay-per-token key, and the compaction values and the fallback chain below are built around it.

Every other model has a narrower job:

| Role | Model | Rule |
|---|---|---|
| Orchestrator | `anthropic-subscription/claude-opus-5-5` | Plans, delegates, verifies, talks to {user}. |
| Design documents and plans | Fable | Writes the design or plan only. When the design is done, switch the session to Opus or hand off to an Opus lead. Fable does not orchestrate implementation, experiments or sub-agents. |
| Worker sub-agent | GPT-6 Astra (high) | Only as a worker under an Opus lead, never as the orchestrator. |
| Research and investigation | `claude-haiku-5-5` and `gpt-6-luna` (non-fast) | A swarm of cheap models in parallel, one sub-question each; a cheap lead merges the answers. No expensive model on research unless {user} asks. |
| Review | One separate reviewer | Once, at the very end, on the exact final commit. Not a panel, and not midway. |
| GPT subscription models | Non-fast variants | Non-fast is the default. |
| DeepSeek | Discounted promo ids only, for example `opengateway/deepseek/deepseek-v4.1-flash-ultrafast` | Only inside the provider's discount window. |
| Google | `gemini-4-argon` only | omo's `visual-engineering` and `writing` categories already default to it (see below). |
| Pay-per-token API keys | Pinned explicitly | Last resort, only for the always-on sessions. Never for workers, reviewers or chat helpers. Keep the key out of the machine-wide auth file so other sessions cannot fall onto it. |

## Context compaction per model and per task

**The orchestrator compacts early and often on purpose; everything else stays close to omo's defaults.** The orchestrator runs for days. A small working set means each turn re-reads less from the prompt cache, so its compaction is set to fire long before the context window is full. Haiku runs short research shards and keeps only a small recent tail.

### The values

All Claude models used here have a 1M-token context window.

| Where | Model | reserveTokens | keepRecentTokens |
|---|---|---|---|
| Global, `~/.omo/agent/settings.json` (every session on the machine) | `anthropic-subscription/claude-opus-5-5` | 700000 | default (20000) |
| Global | `anthropic-subscription/claude-sonnet-5-5` | 700000 | default (20000) |
| Global | `anthropic-subscription/claude-haiku-5-5` | 4096 | 12000 |
| Project, `<project>/.omo/settings.json`: the orchestrator project | `anthropic-subscription/claude-opus-5-5` | 700000 | default (20000) |
| Project: the general work project (workers, chat helpers) | `anthropic-subscription/claude-opus-5-5` | 500000 | default (20000) |

`examples/polar/settings.project.json` is the orchestrator project's file. For a worker project, change the Opus `reserveTokens` to 500000.

### How omo picks the value for a session

- **Per-model override first, then the plain setting, then the built-in default.** omo looks up `compaction.modelOverrides["<provider>/<modelId>"]`, then `compaction.reserveTokens` or `compaction.keepRecentTokens`, then its defaults of 16384 and 20000. Source: `senpi/dist/core/compaction-settings-access.js` (`compactionTokenSetting`).
- **The key must match the provider and model id exactly.** If your Opus runs under a different provider id than `anthropic-subscription`, rename the keys, or the override never applies.
- **A bad value stops the session instead of being ignored.** Each value must be a non-negative whole number. Anything else throws an error, so a typo cannot quietly change the budget (same file).
- **Project settings win over global settings key by key.** omo deep-merges the global file with the project file, and the project value replaces the global one only where both set the same key. A project that overrides Opus keeps the global Sonnet and Haiku entries. Source: `senpi/dist/core/settings-manager.js` (`deepMergeObjects`, `deepMergeSettings`).

### What reserveTokens does

**reserveTokens sets the hard limit: compaction runs once the context is larger than the window minus the reserve.** Source: `senpi/dist/core/compaction/compaction.js` (`shouldCompact`).

- **omo raises small reserves.** With `reserveScalingEnabled` on (the default), the reserve used is the larger of your value and 4% of the window, with that 4% part capped at 49,152 tokens. Source: `senpi/dist/core/extensions/builtin/compaction/policy.js` (`resolveReserveTokens`, `resolveEffectiveReserveTokens`).
- **A second, proactive trigger runs at a share of the window.** The share starts at 0.8 for windows above 512,000 tokens. After each compaction it moves 0.05 down if that compaction freed more than half of the context, and 0.05 up if it freed less than a tenth. It always stays between 0.4 and 0.85. A background (speculative) compaction starts earlier, at 0.75 of that trigger by default. Source: same `policy.js` (`baseThresholdRatioForWindow`, `computeEffectiveThreshold`, `shouldStartSpeculativeCompaction`).
- **reserveTokens also caps the summary length.** The summary request may use at most 80% of the reserveTokens it is given, or the model's own output limit if that is lower. Source: `compaction.js` (`generateSummaryWithUsage`).

Worked out with these rules for a 1M window:

| Setting | Hard limit fires above | Which trigger fires first |
|---|---|---|
| Opus or Sonnet, reserveTokens 700000 | 300,000 tokens (1,000,000 - 700,000) | The hard limit, well before the proactive trigger near 800,000 |
| Opus in the work project, reserveTokens 500000 | 500,000 tokens | The hard limit |
| Haiku, reserveTokens 4096 | 960,000 tokens, because omo raises the reserve to 40,000 (4% of the window) | The proactive trigger near 800,000 |

So on a 1M window the Haiku reserve of 4096 does not change when Haiku compacts.

### What keepRecentTokens does

**keepRecentTokens is the recent tail that survives compaction word for word.** omo walks back from the newest message and adds up message sizes until it reaches this budget. Everything older is summarized, and the cut never lands on a tool result. Source: `compaction.js` (`findCutPoint`).

**On large windows omo can raise the tail.** When the window is above 409,600 tokens and the setting is at least 10,000, omo raises it to 5% of the window, with that part capped at 60,000 tokens. The speculative path and the model budget check use this raised value. Source: `policy.js` (`computeEffectiveKeepRecentTokens`), used in `speculative.js` and `model-usability-budget.js` in the same directory. On a 1M window, Haiku's 12000 becomes 50,000 on those paths, which is larger than the small tail the setting intends. A Haiku value below 10,000 would not be raised.

## How omo injects prompts per model

**Each model gets its own core prompt, and everything after the core is shared.** The core decides how the model works (intent, tool use, verification, style). Your instruction files, skills, memory and machine details come after it and are the same for every model.

### The shared assembly

`senpi/dist/core/dynamic-prompt/build.js` (`buildDynamicSystemPromptParts`) builds the system prompt in this order:

1. **core**: the model's preset core, or omo's generic core (identity, intent gate, working rules, verification, tools, policies, handoff, style).
2. **tuning**: an optional preset tuning section.
3. **User instruction files**, then **project instruction files** (see below). The code notes that instruction files outrank the core's default working style.
4. **skills**: the list of available skills, from `senpi/dist/core/skills.js` (`formatSkillsForPrompt`).
5. **workstation**: OS, shell and tool details for the machine.
6. **append_system_prompt**: text added through the loader's append option.

A custom system prompt (`--system-prompt` or an SDK loader override) replaces all of this except the append. It also switches the per-model preset off.

### The per-model part

- **A built-in extension swaps in the preset for the session's model.** It runs before each agent turn and again whenever the model changes. Source: `senpi/dist/core/extensions/builtin/prompt-preset/index.js`.
- **The preset name comes from three places, in order.** First the `promptPreset` setting (project over global, default `auto`), then the model's own `promptPreset`, then a match on the model id. Source: `prompt-preset/presets.js` (`resolvePresetName`), `prompt-preset/settings.js`, `prompt-preset/contract.js`.
- **The id match checks specific releases before families.** `opus-5-5` matches before `opus-5`, and Fable 5.5 before `fable-5`. Presets exist for Claude Opus, Sonnet, Haiku and Fable, GPT-5.x and GPT-6 Astra, Gemini 4 Argon, DeepSeek V4, GLM, Grok and Kimi. Each is one file in `prompt-preset/` (for example `claude-opus-5-5.js`, `gemini-4-argon.js`).
- **A preset replaces only the core.** For example, `claude-opus-5-5.js` passes its own `corePrompt` to `buildDynamicSystemPrompt`, so instruction files, skills and the workstation section still come from the shared builder.
- **The Fable 5.5 preset reuses the Fable 5.1 prompt.** The file says this is a launch baseline: no Fable 5.5-specific behavior is asserted yet. Source: `prompt-preset/claude-fable-5-5.js`.
- **Switching models rewrites the system prompt.** That invalidates the prompt cache, which is one reason for the "freeze the prefix" rule below.

### Instruction files (AGENTS.md / CLAUDE.md)

- **omo reads one file per directory.** It takes the first that exists of `AGENTS.override.md`, `AGENTS.md`, `AGENTS.MD`, `CLAUDE.md`, `CLAUDE.MD`. Source: `senpi/dist/core/context-files.js` (`loadContextFileFromDir`).
- **The order is the agent directory first, then each directory from the filesystem root down to the working directory.** The agent-directory file and a file in your home directory count as user instructions; the others count as project context (`loadProjectContextFiles`).
- **Large files are trimmed.** The defaults allow 64 KiB per file and 128 KiB in total (`DEFAULT_CONTEXT_FILE_MAX_BYTES`, `DEFAULT_CONTEXT_FILES_MAX_TOTAL_BYTES`).

### Memory

**The omo extension adds memory as one block at the end of the system prompt.** The block holds the memory projections and an agent id, wrapped in `<!-- senpi-memory:<id>:begin -->` and `<!-- senpi-memory:<id>:end -->` comments. On later turns the block between those markers is replaced, not duplicated. Source: `plugin/extensions/omo.js`. This file is a bundled build, so search it for `senpi-memory:` to find the code.

### Category defaults (the Argon prompts)

**Delegated tasks in some categories run on Gemini 4 Argon by default.** omo's task categories each carry a default model and a `promptAppend` block (`<Category_Context>`) that is added to the child's prompt. `visual-engineering` and `writing` default to `google/gemini-4-argon` with variant `low`. A child on Argon then also gets the `gemini-4-argon` preset as its core. Source: `plugin/extensions/omo.js` (search for `name:"visual-engineering"` and `name:"writing"`).

## Fallback chain

**Only the projects that opt in fall back; the global file turns fallback off.** omo itself defaults `modelFallback` to true (`senpi/dist/core/retry-fallback/settings.js`), so the global file sets it to false explicitly. The project file turns it back on for Opus:

```json
"retry": {
  "modelFallback": true,
  "fallbackChains": {
    "anthropic-subscription/claude-opus-5-5": [
      "chatgpt-subscription/gpt-6.1-terra:high",
      "opengateway/deepseek/deepseek-v4.1-flash-ultrafast",
      "anthropic/claude-opus-5-5:low",
      "google/gemini-4-argon"
    ]
  }
}
```

The order is intentional:

1. The other subscription first.
2. Then a discounted fast model.
3. Then the pay-per-token API key: emergency only, and only for the few sessions that must run 24 hours.
4. Then Gemini.

How omo reads this (same `settings.js`):

- **Your chain replaces omo's shipped chain for the same key.** omo ships one for Opus 5.5 that steps down to `claude-opus-5`. Chains for other keys stay as shipped.
- **An empty list removes a shipped chain.**
- **The session returns to the primary model when its cooldown expires.** That is the default `fallbackRevertPolicy`.

## Token-saving rules

**Safety comes first, then correctness, then cost.** Never trade correctness or reversibility for a better cache ratio. Every Polar session follows these rules.

1. **Keep a durable record.** Write decisions (one line each), paths touched, and commands that mattered with their results into `HANDOFF.md` the moment they happen. What is not in the file counts as lost.
2. **Scale effort to the task.** Long sessions keep cumulative read:write at or below 10:1.

   | Task size | Context cap | Turn batching | Subagents | Handoff |
   |---|---|---|---|---|
   | Trivial (1 file, under 10 minutes) | ~20K | Batch freely, 1-2 turns | None | Skip |
   | Medium (a few files) | ~40K | Batch related checks | For search | Update at the end |
   | Large (multi-hour) | ~40K | Small batches, checkpoint | Parallel | Every milestone |

3. **Compact when over the cap.** Write a summary to `HANDOFF.md` with five parts: Goal, Settled decisions, Facts (file:line, command, result), Remaining work, Next first action. Continue in a fresh session seeded with only that summary.
4. **Write once, read little.** A subtask starts in a fresh short context with a 3-5 line brief and file paths. A worker reports one RESULT line, never a transcript. Research goes to subagents that return a 3-5 line conclusion.
5. **Do not re-read.** Never reopen a file you already summarized. Search first, then read only 30-80 lines, and trim tool output.
6. **Batch reads; run destructive steps one at a time.** Put independent read-only checks in one turn. Run each destructive operation alone and read the result back: deletes, overwrites, history rewrites, force pushes, bulk edits, migrations, credential changes.
7. **Freeze the prefix.** Do not edit the system prompt, tool list, instruction files or config mid-task, because any change rewrites the whole prompt cache. Do not leave a large context idle past the cache TTL.
8. **Add a self-check line every turn:** `ctx~Nk / read~Nk / write~Nk`.
