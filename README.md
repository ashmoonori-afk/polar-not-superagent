# polar-not-superagent

Polar's fork of [sisyphuslabs/dori-superagent](https://github.com/sisyphuslabs/dori-superagent): not a new superagent, but a record of how one working agent harness uses Dori.

The upstream README is kept unchanged as [UPSTREAM-README.md](UPSTREAM-README.md), and the translated READMEs (Korean, Simplified Chinese, Japanese) are upstream's own. The code in this repository is upstream's code at 766630f. This page, [SETUP.md](SETUP.md) and the picture below are the only things we added.

## Set up your own Polar

Paste this one line into an OmO session:

```text
Read https://raw.githubusercontent.com/ashmoonori-afk/polar-not-superagent/main/SETUP.md and set yourself up exactly as it says, step by step, asking me only where it tells you to.
```

[SETUP.md](SETUP.md) walks the agent through it: install agent-messenger and ask which platform to use, log in, create the bot, name itself and pick an avatar, greet you, take every request through a monitor, connect calendars and accounts through zele, onboard itself, and keep the session alive across reboots.

Model roles, per-model context compaction, how omo builds each model's prompt, and the token-saving rules: [docs/polar/models-and-context.md](docs/polar/models-and-context.md).

## What Polar is

Polar is the owner's ([ashmoonori-afk](https://github.com/ashmoonori-afk)) orchestrator agent. One lead session on a Mac talks to the owner in chat and hands work to worker sessions on three machines, the Mac and two Windows PCs running WSL, reached over SSH. It runs on [omo](https://github.com/code-yeongyu/oh-my-openagent). Polar's own code lives in a private workspace; this page describes it and does not ship it.

## Where each piece acts

![Polar's harness: the owner in chat, the Polar lead session on the Mac, worker sessions on the Mac and two WSL PCs, and the checks placed on the steps they guard](docs/polar/polar-harness.png)

Each check sits on the step it guards. The night gate sits on posts to the owner. Instruction receipts sit on the way out to workers. Four checks run before a lane closes. The heavy slot sits on the 8 GB Mac. Blue lines are the work path; the dashed line is the work watch.

## Taken from Dori, and how we changed it

These parts came from Dori (MIT, Copyright (c) 2026 YeonGyu Kim). Each port keeps the upstream LICENSE next to it.

| Piece | Where it came from | What it does in Polar | What we changed, and why |
|---|---|---|---|
| Dori mode bundle (items 1-5) | `omo-dori-mode-experimental` at 742f09d, installed 2026-10-07 next to the existing agent; nothing upstream was overwritten | An installable CLI and config with tests; per-lane JSON state with history and live sync; a resource-aware launch queue with heavy slots; one send/edit path across chat platforms | We kept our own pieces where we already had them: the owner's Korean voice instead of Dori's style, status relays from remote machines over SSH, our scheduler and watchdogs, and tmux as the backend, with herdr only as a view. |
| Objection window and lane close | Same bundle | A lane closes only after a 300-second objection window and a live check of its Done condition. It refuses to close with dirty or unpushed work. | Every close path is guarded, because upstream's direct close skipped the objection window. Untracked files and the lane's own working directory now count as dirty. |
| Resource checks in the launch queue | Same bundle | Decides whether a machine has room for another session | Memory on Linux and WSL is sampled for real, and a missing measurement fails closed. On WSL we check the Windows disk behind the guest, because the guest disk is thin-provisioned: it reported about 951 GiB free while Windows had about 41 GiB. |
| Done signals | dori-mode `scripts/src/signals.ts`, ported 2026-11-02 | Every task carries a Done condition written at launch in the Dori grammar (merged, closed, published, command, file, url), and a watcher re-reads it live. | Our earlier checker parsed evidence out of prose and rejected 818 of 834 claims. Changes: paths and working directories must be absolute; command, file and url checks run on the task's own machine; each option may appear once; a line holds at most one command. |
| Heavy slot | dori-superagent `heavy-slot.ts` | One heavy job at a time on the 8 GB Mac, and only while it has room | The memory check is ours. Nested calls inside a slot run directly, so a build cannot wait on itself. |

## Ideas from DeepSeek's prototype

From [dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype) we took one idea, not code. The code is our own.

| Piece | What it does | Why it exists |
|---|---|---|
| Unread-input check | A delivered message counts as admitted, not read. The session's own transcript decides. If a worker writes DONE while an instruction sent before it never reached its transcript, an alert fires and the closer refuses to close that session. | It happened: a worker wrote DONE while another delivery to it was still held. |

## Our own additions

These parts are ours and run around the Dori loop.

| Piece | What it does |
|---|---|
| Instruction receipts | Every instruction gets an id (`J-YYMMDD-NNN`). The worker writes `ACK id` when it starts, then either `DONE id` with evidence or `BLOCKED id: reason` when it ends. No ACK within 10 minutes raises an alert, and a BLOCKED goes to a person. |
| Completion checks | Every DONE is verified on its own. File paths must exist. A PR must be merged, or open with every check green when the claim says "opened". A commit must be reachable from the remote default branch. A deployed file must read back exactly. Claims that cannot be verified are rejected with a reason and retried on a schedule, six attempts over about 31 hours. |
| Delivery into a running session | Messages go through the session's own control socket as a real user turn. When the session is idle the message starts a turn; when it is busy the message queues behind the running turn. A terminal fallback exists. Held sessions are refused rather than typed into. |
| Work watch | Every 10 minutes in the daytime it looks for trouble: a worker's tmux session that disappeared; a session that is paused or gets no model reply; a PR that is green and mergeable but untouched for 3 hours, too big, or too old; a remote session that needs a model switch. |
| Close-finished | Finished worker sessions are closed automatically, but never while an instruction is unread or its state is unknown. |
| Night gate | Routine posts to the owner between 22:00 and 07:30 KST wait in a queue for the morning. Only a direct reply or a real outage goes through. |
| Promise ledger | Every "I will do X at T" the agent says to the owner is recorded. At T it fires, and it keeps firing until it is closed with evidence. |

## Keeping up with upstream

- Synced to upstream `main` at 766630f on 2026-11-05. Apart from this README, SETUP.md, the picture and the renamed upstream README, `main` is upstream's tree.
- Since 2026-11-05 we read new upstream commits every evening and compare the useful ones with the tables above.
- We have not contributed anything to the upstream repository yet.

## License

Upstream's MIT license applies and is kept unchanged in [LICENSE](LICENSE). The picture was made with stack-diagram, using icons from Lucide.
