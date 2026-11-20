import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { decodeLedger, drift, encodeLedger } from "./ledger.ts";
import { survey } from "./survey.ts";

function main(): number {
  const flags = new Set(process.argv.slice(2));
  const update = flags.delete("--update");
  const allowIncrease = flags.delete("--allow-increase");
  if (flags.size || (allowIncrease && !update)) {
    throw new Error("Usage: lint:ratchet [--update [--allow-increase]]");
  }

  const root = process.cwd();
  const path = join(root, "scripts/test-hygiene/baseline.json");
  const saved = update && !existsSync(path) ? new Map() : decodeLedger(readFileSync(path, "utf8"));
  const measured = survey(root);
  const changes = drift(saved, measured);
  const blocked = update ? changes.filter(({ before, after }) => after > before && !allowIncrease) : changes;

  if (blocked.length) {
    for (const { path, metric, before, after } of blocked) {
      console.error(`${path}: ${metric} ${before} -> ${after}`);
    }
    if (blocked.some(({ before, after }) => after > before)) {
      console.error(
        update
          ? "test-hygiene: --update only lowers counts unless you pass --allow-increase."
          : "test-hygiene: remove the new findings or disable directives.",
      );
    } else {
      console.error("test-hygiene: run `bun run lint:ratchet:update` and commit the lower baseline.");
    }
    return 1;
  }
  if (update) {
    writeFileSync(path, encodeLedger(measured));
    console.log(`test-hygiene: wrote baseline for ${measured.size} files.`);
  } else {
    console.log("test-hygiene: all counts match the baseline.");
  }
  return 0;
}

try {
  process.exitCode = main();
} catch (error) {
  console.error(`test-hygiene: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
