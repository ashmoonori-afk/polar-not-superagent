# Contributing

Thanks for looking. This repository is a small, strict codebase; a change lands when it is one concern, it has evidence, and every gate is green.

## Upstream contribution policy

This is a modified fork. [CLA.md](CLA.md) records the upstream project's agreement, not a signature request for this fork. The retained CLA workflow runs only when the repository is `sisyphuslabs/dori-superagent`; it does not collect signatures or create a signature branch here. If you submit a separate contribution upstream, follow that project's current contribution policy.

## Run the gates

```sh
bun install --frozen-lockfile
(cd skills/dori-mode/scripts && bun install --frozen-lockfile)
bun run ci
```

`bun run ci` is the same chain CI runs:

- `check` — Biome lint and format.
- `typecheck` — `tsc --noEmit` for the harness and for the skill's scripts.
- `knip` — no unused files, exports or dependencies.
- `lint:loc` — the file-length check: every TypeScript source and test file is at most 250 lines.
- `test` — the harness suite.
- `test:skill` — the skill's script suite.

The unit suites need `bun` and `git`, run offline, and use recorded stand-ins for `herdr` and `gh`. `test/e2e.test.ts` starts a real `herdr` server and is skipped when `herdr` is not on `PATH`.

## A pull request

- One concern per pull request, with a title that says what changed and a body that says why.
- Evidence, not adjectives: the command you ran and what it printed, or the file and line you read. A claim you did not verify is written as unverified.
- Tests where behaviour changed; a test that cannot fail is not a test.
- Public surfaces — issues, pull requests, commits, review comments — are English.
- Do not edit another person's work to make your change pass; report it instead.

## Licence

Current upstream code is licensed under the [Sustainable Use License](LICENSE), with third-party components under their own licences. Earlier MIT revisions retain their notice in [LICENSE-MIT](LICENSE-MIT). Fork contributions use the repository's current licence; submitting a fork pull request does not sign the upstream CLA.
