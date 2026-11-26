import { describe, expect, test } from "bun:test";
import { advance, split } from "./link.mjs";

describe("advance", () => {
  test("skips lines already printed at the cursor second and prints the rest in order", () => {
    // The caller re-reads from one second before the cursor, so the cursor second comes back.
    const msgs = [
      { ts: "2026-01-01T00:00:09Z", text: "old" },
      { ts: "2026-01-01T00:00:10Z", text: "seen" },
      { ts: "2026-01-01T00:00:10Z", text: "same second, new" },
      { ts: "2026-01-01T00:00:11Z", text: "next" },
    ];
    const { fresh, cursor } = advance({ ts: "2026-01-01T00:00:10Z", n: 1 }, msgs);
    expect(fresh.map((m) => m.text)).toEqual(["same second, new", "next"]);
    expect(cursor).toEqual({ ts: "2026-01-01T00:00:11Z", n: 1 });
  });

  test("counts several new lines in one second so the next poll skips all of them", () => {
    const msgs = [
      { ts: "2026-01-01T00:00:20Z", text: "[1/2] a" },
      { ts: "2026-01-01T00:00:20Z", text: "[2/2] b" },
    ];
    const first = advance({ ts: "2026-01-01T00:00:10Z", n: 1 }, msgs);
    expect(first.cursor).toEqual({ ts: "2026-01-01T00:00:20Z", n: 2 });
    expect(advance(first.cursor, msgs).fresh).toEqual([]);
  });
});

describe("split", () => {
  test("keeps a short message as one line with newlines flattened", () => {
    expect(split("done\n  found 3 seats")).toEqual(["done found 3 seats"]);
  });

  test("numbers long messages and keeps every part within the gateway limit", () => {
    const parts = split("x".repeat(9000));
    expect(parts.length).toBe(3);
    expect(parts[0]?.startsWith("[1/3] ")).toBe(true);
    expect(parts[2]?.startsWith("[3/3] ")).toBe(true);
    for (const p of parts) expect(p.length).toBeLessThanOrEqual(4000);
    expect(parts.map((p) => p.replace(/^\[\d+\/3\] /, "")).join("")).toBe("x".repeat(9000));
  });
});
