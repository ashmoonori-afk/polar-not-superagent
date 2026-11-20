import { existsSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

import { parseSync } from "oxc-parser";
import { add, disableKey, isHygieneRule, isMetric } from "./ledger.ts";
import type { Ledger } from "./ledger.ts";

const config = "scripts/test-hygiene/oxlint.json";
const sourceFile = /\.(?:[cm]?[jt]s|[jt]sx)$/;
const disable = /^[\s*]*(?:oxlint|eslint)-disable(?:-next-line|-line)?(?=\s|$)/;

function isDisable(value: string): boolean {
  const prefix = disable.exec(value)?.[0];
  if (prefix === undefined) return false;
  const [ruleList = ""] = value.slice(prefix.length).split("--", 1);
  const rules = ruleList.trim();
  return !rules || rules.split(/[\s,]+/).some(isHygieneRule);
}

function command(root: string, args: string[], accepted: readonly number[] = [0]): string {
  const result = Bun.spawnSync(args, { cwd: root, stdout: "pipe", stderr: "pipe" });
  if (!accepted.includes(result.exitCode)) {
    throw new Error(`${args[0]} exited ${result.exitCode}:\n${result.stderr.toString() || result.stdout.toString()}`);
  }
  return result.stdout.toString();
}

function* batches(paths: readonly string[]): Generator<readonly string[]> {
  // Keep well below the command-line size limit, even when file names are long.
  let batch: string[] = [];
  let bytes = 0;
  for (const path of paths) {
    const size = Buffer.byteLength(path) + 3;
    if (bytes + size > 48_000) {
      yield batch;
      batch = [];
      bytes = 0;
    }
    batch.push(`./${path}`);
    bytes += size;
  }
  if (batch.length) yield batch;
}

type Diagnostic = { readonly filename: string; readonly code?: string | null; readonly message: string };
type LintReport = { readonly diagnostics: readonly Diagnostic[]; readonly number_of_files: number };

export function survey(root: string): Ledger {
  const index = new Set(command(root, ["git", "ls-files", "-z"]).split("\0"));
  const paths = [...index].filter((path) => sourceFile.test(path) && existsSync(join(root, path)));
  const ledger: Ledger = new Map();
  for (const batch of batches(paths)) {
    const output = command(
      root,
      [join(root, "node_modules/.bin/oxlint"), "-c", config, "--no-ignore", "--format", "json", ...batch],
      [0, 1],
    );
    const report: LintReport = JSON.parse(output);
    if (report.number_of_files !== batch.length) {
      const difference = batch.length - report.number_of_files;
      throw new Error(
        difference > 0
          ? `Oxlint skipped ${difference} tracked file(s). Check the ratchet config for ignorePatterns.`
          : `Oxlint reported an unexpected file count: ${report.number_of_files} for ${batch.length} paths.`,
      );
    }
    for (const finding of report.diagnostics) {
      if (!finding.code) throw new Error(`${finding.filename}: cannot count an unparseable file: ${finding.message}`);
      const rule = finding.code.replace(/^polar-tests\(([^()]+)\)$/, "polar-tests/$1");
      if (!isMetric(rule) || rule === disableKey) throw new Error(`Unexpected oxlint rule: ${finding.code}.`);
      const path = relative(root, resolve(root, finding.filename)).split(sep).join("/");
      if (!index.has(path)) throw new Error(`Unexpected oxlint path: ${finding.filename}.`);
      add(ledger, path, rule);
    }
  }
  // Oxlint's output omits suppressed findings. Count the actual comments separately.
  for (const path of paths) {
    const parsed = parseSync(path, readFileSync(join(root, path), "utf8"));
    const errors = parsed.errors.filter((error) => error.severity === "Error");
    if (errors.length) {
      throw new Error(`${path}: cannot count an unparseable file: ${errors.map((error) => error.message).join("; ")}`);
    }
    add(ledger, path, disableKey, parsed.comments.filter(({ value }) => isDisable(value)).length);
  }
  return ledger;
}
