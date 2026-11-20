const checks = ["no-fixed-sleep", "no-flake-masking", "no-module-mock"] as const;
const ruleIds = checks.map((name) => `polar-tests/${name}` as const);
export const disableKey = "disable-directive";
const metrics = [...ruleIds, disableKey] as const;
export type Metric = (typeof metrics)[number];
type Tally = Partial<Record<Metric, number>>;
export type Ledger = Map<string, Tally>;

export function isMetric(name: string): name is Metric {
  return metrics.some((metric) => metric === name);
}

export function isHygieneRule(name: string): boolean {
  return checks.some((check) => name === check || name === `polar-tests/${check}`);
}

export function add(ledger: Ledger, path: string, metric: Metric, amount = 1): void {
  if (amount === 0) return;
  const tally = ledger.get(path) ?? {};
  tally[metric] = (tally[metric] ?? 0) + amount;
  ledger.set(path, tally);
}

export function decodeLedger(raw: string): Ledger {
  const parsed: unknown = JSON.parse(raw);
  if (!isObject(parsed)) throw new Error("Expected a baseline object keyed by file.");
  const ledger: Ledger = new Map();
  for (const [path, tally] of Object.entries(parsed)) {
    if (!isObject(tally)) throw new Error(`Invalid baseline for ${path}.`);
    for (const [metric, count] of Object.entries(tally)) {
      if (!isMetric(metric) || typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) {
        throw new Error(`Invalid baseline count for ${path}: ${metric}.`);
      }
      add(ledger, path, metric, count);
    }
  }
  return ledger;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function encodeLedger(ledger: Ledger): string {
  const entries = [...ledger].sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0));
  return `${JSON.stringify(
    Object.fromEntries(
      entries.map(([path, tally]) => [
        path,
        Object.fromEntries(
          metrics.filter((metric) => tally[metric] !== undefined).map((metric) => [metric, tally[metric]]),
        ),
      ]),
    ),
    null,
    2,
  )}\n`;
}

export function drift(saved: Ledger, measured: Ledger) {
  return [...new Set([...saved.keys(), ...measured.keys()])].sort().flatMap((path) => {
    const prev = saved.get(path);
    const next = measured.get(path);
    return metrics.flatMap((metric) => {
      const before = prev?.[metric] ?? 0;
      const after = next?.[metric] ?? 0;
      return before === after ? [] : [{ path, metric, before, after }];
    });
  });
}
