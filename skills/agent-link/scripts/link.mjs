#!/usr/bin/env bun
// Lead-side client for one agent-link mailbox pair (Bun or Node >= 22, no dependencies).
//
//   link.mjs health            GET /healthz (no token)
//   link.mjs whoami            GET /api/whoami
//   link.mjs send <text...>    POST /api/send; text over the limit is split into [n/m] lines
//   link.mjs poll              print each new outbox line once, advance the cursor
//   link.mjs watch [sec]       poll forever (default 30 s); for a standing monitor
//
// Output lines: "<TAG>_MSG <ts> <text>", "<TAG>_ERR <ts> <error>" (once per distinct error),
// "<TAG>_OK <ts> gateway reachable again". Watch with a filter like ^MBX_.
//
// Environment:
//   MBX_URL or MBX_URL_FILE   gateway origin, e.g. https://mailbox.example.com (file: first line)
//   MBX_TOKEN_CMD             command that prints the lead's mirror token (preferred), e.g.
//                             security find-generic-password -s agent-link-NAME -a lead -w
//   MBX_TOKEN                 the token itself, when no secret store is available
//   MBX_NAME                  agent name, used for the cursor file (default "agent")
//   MBX_STATE_DIR             where the cursor lives (default ~/.agent-link)
//   MBX_TAG                   output prefix (default MBX)
// The token is read inside this process and never printed or passed on a command line.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const MAX_TEXT = 4000;
const env = process.env;
const tag = env.MBX_TAG || "MBX";
const name = env.MBX_NAME || "agent";
const stateDir = env.MBX_STATE_DIR || path.join(os.homedir(), ".agent-link");
const cursorFile = path.join(stateDir, `${name}.cursor.json`);
const isoSeconds = (d) => d.toISOString().replace(/\.\d{3}Z$/, "Z");

function baseUrl() {
  const raw = env.MBX_URL || (env.MBX_URL_FILE ? fs.readFileSync(env.MBX_URL_FILE, "utf8").split("\n")[0] : "");
  if (!raw.trim()) throw new Error("set MBX_URL or MBX_URL_FILE");
  return raw.trim().replace(/\/$/, "");
}

function token() {
  if (env.MBX_TOKEN_CMD) return execFileSync("/bin/sh", ["-c", env.MBX_TOKEN_CMD], { encoding: "utf8" }).trim();
  if (env.MBX_TOKEN) return env.MBX_TOKEN.trim();
  throw new Error("set MBX_TOKEN_CMD or MBX_TOKEN");
}

async function api(p, init = {}, auth = true) {
  const headers = { "content-type": "application/json" };
  if (auth) headers.authorization = `Bearer ${token()}`;
  const res = await fetch(baseUrl() + p, { ...init, headers, signal: AbortSignal.timeout(20000) });
  const body = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} ${body.slice(0, 200)}`);
  return JSON.parse(body);
}

// Splits text into lines of at most MAX_TEXT chars, each prefixed "[n/m] " when more than one.
export function split(text) {
  const flat = text.replace(/\s*\n\s*/g, " ").trim();
  if (flat.length <= MAX_TEXT) return [flat];
  const room = MAX_TEXT - 12;
  const parts = [];
  for (let i = 0; i < flat.length; i += room) parts.push(flat.slice(i, i + room));
  return parts.map((p, i) => `[${i + 1}/${parts.length}] ${p}`);
}

function loadCursor() {
  return fs.existsSync(cursorFile) ? JSON.parse(fs.readFileSync(cursorFile, "utf8")) : null;
}

function saveCursor(c) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(`${cursorFile}.tmp`, JSON.stringify(c));
  fs.renameSync(`${cursorFile}.tmp`, cursorFile);
}

// Picks the lines after the cursor. The gateway's since= is strictly newer and ts has 1 s
// resolution, so the caller asks from one second before cursor.ts and this skips the cursor.n
// lines already printed at cursor.ts. Returns the new lines and the advanced cursor.
export function advance(cursor, msgs) {
  let { ts, n } = cursor;
  let skip = n;
  const fresh = [];
  for (const m of msgs) {
    if (m.ts < ts) continue;
    if (m.ts === ts && skip > 0) {
      skip--;
      continue;
    }
    fresh.push(m);
    if (m.ts === ts) n++;
    else {
      // A newer second: the skip budget belonged to the old cursor second only.
      ts = m.ts;
      n = 1;
      skip = 0;
    }
  }
  return { fresh, cursor: { ts, n } };
}

async function poll() {
  const cur = loadCursor();
  let msgs;
  try {
    const since = cur?.ts ? isoSeconds(new Date(Date.parse(cur.ts) - 1000)) : "";
    ({ messages: msgs } = await api(`/api/messages?limit=200${since ? `&since=${encodeURIComponent(since)}` : ""}`));
  } catch (e) {
    if (cur?.err !== e.message) console.log(`${tag}_ERR ${isoSeconds(new Date())} ${e.message}`);
    saveCursor({ ...(cur ?? { ts: isoSeconds(new Date()), n: 0 }), err: e.message });
    return false;
  }
  if (!cur) {
    // First run starts at the newest existing line and prints nothing.
    const last = msgs.at(-1);
    const ts = last?.ts ?? isoSeconds(new Date());
    saveCursor({ ts, n: last ? msgs.filter((m) => m.ts === ts).length : 0 });
    return true;
  }
  if (cur.err) console.log(`${tag}_OK ${isoSeconds(new Date())} gateway reachable again`);
  const { fresh, cursor } = advance(cur, msgs);
  for (const m of fresh) console.log(`${tag}_MSG ${m.ts} ${m.text.replace(/\p{Cc}/gu, " ")}`);
  saveCursor(cursor);
  return true;
}

async function main(argv) {
  const [cmd, ...rest] = argv;
  if (cmd === "health") return console.log(JSON.stringify(await api("/healthz", {}, false)));
  if (cmd === "whoami") return console.log(JSON.stringify(await api("/api/whoami")));
  if (cmd === "send") {
    const text = rest.join(" ").trim();
    if (!text) throw new Error("usage: link.mjs send <text>");
    for (const line of split(text)) {
      console.log(JSON.stringify(await api("/api/send", { method: "POST", body: JSON.stringify({ text: line }) })));
    }
    return;
  }
  if (cmd === "poll") {
    if (!(await poll())) process.exitCode = 1;
    return;
  }
  if (cmd === "watch") {
    const sec = Number(rest[0] || 30);
    for (;;) {
      await poll();
      await new Promise((r) => setTimeout(r, sec * 1000));
    }
  }
  throw new Error("usage: link.mjs health | whoami | send <text> | poll | watch [sec]");
}

if (import.meta.main ?? process.argv[1] === new URL(import.meta.url).pathname) {
  main(process.argv.slice(2)).catch((e) => {
    console.error(`link: ${e.message}`);
    process.exit(1);
  });
}
