import { afterAll, beforeAll, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";

type Case = readonly [label: string, source: string, expected: readonly string[]];
const sleep = "no-fixed-sleep";
const mock = "no-module-mock";
const flake = "no-flake-masking";
const retry = `${flake}: Do not retry a failing test. Make the first attempt reliable by waiting for the event it needs.`;
const timeout = `${flake}: Do not raise the test timeout. Wait for the right event or move shared setup into a hook.`;
const callback = "async () => {}";

const cases: readonly Case[] = [
  ["awaiting Bun's clock in a test", `test('flush', async () => { await Bun.sleep(12) })`, [sleep]],
  ["using scheduler.wait in a hook", `afterEach(async () => { await scheduler.wait(3) })`, [sleep]],
  ["delaying inside a concurrent test", `it.concurrent('flush', async () => { await Bun.sleep(25) })`, [sleep]],
  ["delaying inside a parameterized test", `test.each([3])('flush', async (ms) => { await Bun.sleep(ms) })`, [sleep]],
  [
    "delaying inside a conditional test",
    `it.skipIf(offline)('flush', async function () { await Bun.sleep(30) })`,
    [sleep],
  ],
  ["wrapping a plain timer", `it('flush', async () => { await new Promise(done => setTimeout(done, 8)) })`, [sleep]],
  [
    "wrapping a window timer in a block",
    `it('flush', async () => {
    await new Promise(ok => { window.setTimeout(ok, 2) })
  })`,
    [sleep],
  ],
  [
    "wrapping a global timer and resolver",
    `it('flush', async () => {
    await new Promise<void>(ok => globalThis.setTimeout(() => ok(), 4))
  })`,
    [sleep],
  ],
  [
    "using an imported timer alias",
    `import { setTimeout as pause } from 'node:timers/promises'
    it('flush', async () => { await pause(25) })`,
    [sleep],
  ],
  [
    "using the bare timers module",
    `import { setTimeout } from 'timers/promises'
    it('flush', async () => { await setTimeout(25) })`,
    [sleep],
  ],
  ["advancing a virtual clock", `it('tick', async () => { vi.useFakeTimers(); await Bun.sleep(25) })`, []],
  [
    "waiting on work or a resolver signal",
    `test('flush', async () => {
    await operation()
    await Promise.withResolvers().promise
  })`,
    [],
  ],
  [
    "delays inside helpers and non-test callbacks",
    `function schedule(cb) { cb() }
    schedule(async () => { await Bun.sleep(4) })
    it('poll', async () => { async function backoff() { await Bun.sleep(5) } await backoff() })`,
    [],
  ],
  [
    "timers for deadlines and cancellation",
    `test('race', async () => {
    const clock = setTimeout(stop, 8)
    await Promise.race([work, new Promise(ok => setTimeout(ok, 9))])
    clearTimeout(clock)
  })`,
    [],
  ],
  [
    "a promise that schedules more than a delay",
    `it('flush', async () => {
    await new Promise(ok => { queueMicrotask(ok); setTimeout(ok, 3) })
  })`,
    [],
  ],
  ...["test", "it", "describe", "suite", "test.concurrent", "test.each([1])"].map(
    (entry): Case => [`retry option for ${entry}`, `${entry}('loads', { retry: 1 }, ${callback})`, [retry]],
  ),
  ["retry after callback", `test('loads', ${callback}, { retry: 1 })`, [retry]],
  ["retry in global defaults", `vi.setConfig({ retry: 2 })`, [retry]],
  ["retry in project configuration", `defineConfig({ test: { retry: 2 } })`, [retry]],
  ["retry inside a nested project", `defineConfig({ test: { projects: [{ test: { retry: 1 } }] } })`, [retry]],
  ...["12000", "budget * 3", "budget"].map(
    (value): Case => [`positional timeout ${value}`, `test('loads', ${callback}, ${value})`, [timeout]],
  ),
  ["timeout before callback", `test('loads', { timeout: budget }, ${callback})`, [timeout]],
  ["timeout after callback", `it('loads', ${callback}, { timeout: budget })`, [timeout]],
  ["timeout in suite options", `describe('loads', { timeout: budget }, () => {})`, [timeout]],
  ["test timeout in global defaults", `vi.setConfig({ testTimeout: budget })`, [timeout]],
  ["hook timeout in global defaults", `vi.setConfig({ hookTimeout: budget })`, [timeout]],
  [
    "setup deadlines and polling",
    `beforeAll(start, 9000); afterAll(stop, 9000);
    await expect.poll(read, { timeout: 200 }).toBe(1); await vi.waitFor(read, { timeout: 300 });`,
    [],
  ],
  [
    "unrelated options and defaults",
    `test('loads', ${callback});
    it('loads', { concurrent: true, tags: ['slow'] }, function run() {});
    const policy = { retry: true }; queue.retry({ timeout: 10 });
    defineConfig({ test: { testTimeout: 300, hookTimeout: 500 } }); vi.setConfig({ fakeTimers: {} });`,
    [],
  ],
  ["an uncalled parameterized test factory", `test.each(rows, { retry: 2 });`, []],
  ...[
    ["Bun named import", `import { mock } from 'bun:test'; mock.module('./clock', factory)`],
    ["Bun renamed import", `import { mock as stub } from 'bun:test'; stub.module('./clock', factory)`],
    ["Bun namespace import", `import * as runner from 'bun:test'; runner.mock.module('./clock', factory)`],
    ["CommonJS destructuring", `const { mock: stub } = require('bun:test'); stub.module('./clock', factory)`],
    ["dynamic import destructuring", `const { mock } = await import('bun:test'); mock.module('./clock', factory)`],
    ["CommonJS namespace", `const runner = require('bun:test'); runner.mock.module('./clock', factory)`],
    [
      "cast and transitive alias",
      `import { mock } from 'bun:test'
      const later = stub; const stub = (mock as typeof mock)!; later['module']('./clock', factory)`,
    ],
    ["usage before import", `stub.module('./clock', factory); import { mock as stub } from 'bun:test'`],
    [
      "inline createRequire",
      `const { mock } = createRequire(import.meta.url)('bun:test'); mock.module('./clock', factory)`,
    ],
    ["direct require member", `require('bun:test').mock.module('./clock', factory)`],
    [
      "inline createRequire namespace",
      `const runner = createRequire(import.meta.url)('bun:test')
      runner.mock.module('./clock', factory)`,
    ],
    ["Bun vi alias", `import { vi } from 'bun:test'; vi.mock('./clock', factory)`],
    ["Bun without the Vitest spy exemption", `import { vi } from 'bun:test'; vi.mock('./clock', { spy: true })`],
    ["test-runner global", `vi.mock('./clock', factory)`],
  ].map(([label = "", source = ""]): Case => [label, source, [mock]]),
  [
    "Vitest mock and doMock",
    `import { vitest as runner } from 'vitest'
    runner.mock('./clock'); runner.doMock('./db')`,
    [mock, mock],
  ],
  [
    "Jest mock, doMock and ESM mocking",
    `import { jest as runner } from '@jest/globals';
    runner.mock('./clock'); runner.doMock('./db'); runner.unstable_mockModule('./fs', factory)`,
    [mock, mock, mock],
  ],
  [
    "observation and ordinary spies",
    `import { vi } from 'vitest'
    vi.mock('./clock', { spy: true }); vi.fn(); vi.spyOn(clock, 'read');
    import { mock } from 'bun:test'; mock(() => {}); mock.restore()`,
    [],
  ],
  ["Bun ordinary spies and stubs", `import { vi } from 'bun:test'; vi.fn(); vi.spyOn(clock, 'read')`, []],
  [
    "unrelated bindings, alias cycles and type imports",
    `import { vi } from './view'
    import type { mock as mockType } from 'bun:test'
    const mock = { module() {} }; mock.module('./clock'); vi.mock('./clock'); mockType.module('./clock');
    const a = b; const b = a; a.mock('./clock'); registry.module('./clock')`,
    [],
  ],
];

const findings = new Map<string, string[]>();
let scratch: string | undefined;

beforeAll(() => {
  const root = resolve(import.meta.dir, "../..");
  scratch = mkdtempSync(join(tmpdir(), "polar-rules-"));
  const filenames = cases.map(([, source], index) => {
    const path = join(scratch ?? "", `probe-${index}.ts`);
    writeFileSync(path, source);
    return path;
  });
  const result = Bun.spawnSync(
    [
      join(root, "node_modules/.bin/oxlint"),
      "-c",
      "scripts/test-hygiene/oxlint.json",
      "--no-ignore",
      "-f",
      "json",
      ...filenames,
    ],
    { cwd: root, stdout: "pipe", stderr: "pipe" },
  );
  if (result.exitCode !== 1) throw new Error(`Expected rejected fixtures: ${result.stderr}`);
  const output: {
    readonly number_of_files: number;
    readonly diagnostics: readonly { readonly code?: string; readonly filename: string; readonly message: string }[];
  } = JSON.parse(result.stdout.toString());
  expect(output.number_of_files).toBe(cases.length);
  for (const { code, filename, message } of output.diagnostics) {
    const file = basename(filename);
    const rule = code?.match(/^polar-tests\(([^()]+)\)$/)?.[1];
    if (!rule) throw new Error(`Unexpected diagnostic in ${filename}: ${code}: ${message}`);
    const existing = findings.get(file) ?? [];
    existing.push(rule === flake ? `${rule}: ${message}` : rule);
    findings.set(file, existing);
  }
});

afterAll(() => {
  if (scratch) rmSync(scratch, { recursive: true, force: true });
});

for (const [index, [label, , expected]] of cases.entries()) {
  test(label, () => {
    expect(findings.get(`probe-${index}.ts`) ?? []).toEqual([...expected]);
  });
}
