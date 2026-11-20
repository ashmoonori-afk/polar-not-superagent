import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const home = "scripts/test-hygiene";
const repo = resolve(import.meta.dir, "../..");
const baseline = `${home}/baseline.json`;
const config = `${home}/oxlint.json`;
const sleeper = "it('must not stall', async () => { await Bun.sleep(15) });\n";
const sleepKey = "polar-tests/no-fixed-sleep";

function sandbox(run: (root: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), "polar-ratchet-"));
  try {
    mkdirSync(join(root, home), { recursive: true });
    symlinkSync(join(repo, "node_modules"), join(root, "node_modules"));
    symlinkSync(join(repo, home, "plugin.ts"), join(root, home, "plugin.ts"));
    writeFileSync(join(root, config), readFileSync(join(repo, config)));
    writeFileSync(join(root, baseline), "{}\n");
    git(root, "init", "-q");
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function git(root: string, ...args: string[]): void {
  const result = Bun.spawnSync(["git", ...args], { cwd: root, stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) throw new Error(`git ${args.join(" ")}: ${result.stderr}`);
}

function tracked(root: string, path: string, content: string): void {
  writeFileSync(join(root, path), content);
  git(root, "add", "--", path);
}

function ratchet(root: string, ...flags: string[]) {
  const result = Bun.spawnSync([process.execPath, join(repo, home, "ratchet.ts"), ...flags], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  return { code: result.exitCode, out: result.stdout.toString(), err: result.stderr.toString() };
}

test("matches per-file counts and requires lowering the baseline when findings disappear", () => {
  sandbox((root) => {
    tracked(root, "unit.ts", sleeper.repeat(2));
    tracked(root, "other.cjs", "jest.doMock('./store');");
    tracked(root, "notes.md", sleeper);
    writeFileSync(join(root, "not-indexed.ts"), sleeper);
    expect(ratchet(root, "--update", "--allow-increase").code).toBe(0);
    expect(JSON.parse(readFileSync(join(root, baseline), "utf8"))).toEqual({
      "unit.ts": { [sleepKey]: 2 },
      "other.cjs": { "polar-tests/no-module-mock": 1 },
    });
    expect(ratchet(root).code).toBe(0);
    writeFileSync(join(root, "unit.ts"), sleeper);
    const reduced = ratchet(root);
    expect(reduced.code).toBe(1);
    expect(reduced.err).toContain(`unit.ts: ${sleepKey} 2 -> 1`);
    expect(ratchet(root, "--update").code).toBe(0);
    expect(ratchet(root).code).toBe(0);
  });
});

test("an update cannot hide a rise in another file, even when the total drops", () => {
  sandbox((root) => {
    tracked(root, "older.ts", sleeper.repeat(2));
    expect(ratchet(root, "--update", "--allow-increase").code).toBe(0);
    const before = readFileSync(join(root, baseline), "utf8");
    rmSync(join(root, "older.ts"));
    tracked(root, "fresh.ts", sleeper);
    const result = ratchet(root, "--update");
    expect(result.code).toBe(1);
    expect(result.err).toContain(`fresh.ts: ${sleepKey} 0 -> 1`);
    expect(readFileSync(join(root, baseline), "utf8")).toBe(before);
  });
});

test("uses parser comments, not strings or descriptions, to count disable directives", () => {
  sandbox((root) => {
    const source = [
      `// oxlint-disable-next-line ${sleepKey}`,
      sleeper,
      "/* eslint-disable -- Legacy exception. */",
      `const hint = "oxlint-disable-line ${sleepKey}";`,
      `const guide = \`/* eslint-disable ${sleepKey} */\`;`,
      "/* oxlint-disable-next-line no-unused-vars -- unrelated */",
      "const label = 'done'; // eslint-disable-line",
      `/*\n  eslint-disable-next-line ${sleepKey}\n*/`,
      `// eslint-disable-next-line no-console -- not ${sleepKey}`,
      "console.log(label);",
    ].join("\n");
    tracked(root, "comments.ts", source);
    const result = ratchet(root);
    expect(result.code).toBe(1);
    expect(result.err).toBe(
      "comments.ts: disable-directive 0 -> 4\ntest-hygiene: remove the new findings or disable directives.\n",
    );
  });
});

test("still finds the violation when .eslintignore names the tracked test", () => {
  sandbox((root) => {
    tracked(root, "pipeline.test.ts", sleeper);
    tracked(root, ".eslintignore", "pipeline.test.ts\n");
    const result = ratchet(root);
    expect(result.code).toBe(1);
    expect(result.err).toContain(`pipeline.test.ts: ${sleepKey} 0 -> 1`);
  });
});

test("refuses to write a baseline when config ignorePatterns hide a tracked test", () => {
  sandbox((root) => {
    tracked(root, `${home}/covered.test.ts`, sleeper);
    tracked(root, "healthy.ts", "export const healthy = 1;");
    const settings = JSON.parse(readFileSync(join(root, config), "utf8"));
    writeFileSync(join(root, config), JSON.stringify({ ...settings, ignorePatterns: ["covered.test.ts"] }));
    const result = ratchet(root, "--update", "--allow-increase");
    expect(result.code).toBe(1);
    expect(result.err).toContain("Oxlint skipped 1 tracked file(s)");
    expect(readFileSync(join(root, baseline), "utf8")).toBe("{}\n");
  });
});

test("refuses to rewrite the baseline when a tracked source cannot parse", () => {
  sandbox((root) => {
    tracked(root, "broken.ts", "export const = ;");
    const result = ratchet(root, "--update", "--allow-increase");
    expect(result.code).toBe(1);
    expect(result.err).toContain("broken.ts: cannot count an unparseable file:");
    expect(readFileSync(join(root, baseline), "utf8")).toBe("{}\n");
  });
});
