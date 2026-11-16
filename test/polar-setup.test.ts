import { afterEach, expect, test } from "bun:test";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const bootstrap = resolve(import.meta.dir, "../polar/bootstrap.sh");
const naming = resolve(import.meta.dir, "../polar/name.sh");
const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "polar-naming-"));
  roots.push(root);
  const home = join(root, "home");
  const bin = join(root, "bin");
  const config = join(home, ".polar");
  mkdirSync(bin, { recursive: true });
  mkdirSync(config, { recursive: true });
  mkdirSync(join(config, "node"));
  symlinkSync(bin, join(config, "node/bin"));
  writeFileSync(join(config, "user.md"), "Name: Existing user\nLanguage: Korean\n");
  function executable(name: string, body: string) {
    writeFileSync(join(bin, name), `#!/bin/bash\nset -eu\n${body}\n`);
    chmodSync(join(bin, name), 0o755);
  }
  executable("node", `echo 24`);
  executable(
    "omo",
    `if [ "\${1:-}" = auth ]; then echo '{"status":"ready"}'; else printf '%s\\n' "$@" > "$HOME/launch.txt"; fi`,
  );
  executable(
    "tmux",
    `case "$1" in
    has-session) exit 1 ;;
    new-session) shift 10; exec "$@" ;;
    *) exit 2 ;;
  esac`,
  );
  // A curl stand-in delivers the shipped helpers without network access.
  executable(
    "curl",
    `while [ "$1" != -o ]; do shift; done
cp '${resolve(import.meta.dir, "../polar")}/'"\${2##*/}" "$2"`,
  );
  const env = { ...process.env, HOME: home, POLAR_DIR: config, PATH: `${bin}:/usr/bin:/bin` };
  async function cli(script: string, args: readonly string[], input = "") {
    const child = Bun.spawn(["/bin/bash", script, ...args], {
      env,
      stdin: new Response(input),
      stdout: "pipe",
      stderr: "pipe",
    });
    const [code, out, err] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);
    return { code, out, err };
  }
  return { home, config, cli, env };
}

test.each(["Mira", "", `별 'Nova' "$(touch injected)" \`touch injected\` \\\\`])(
  "stores literal name %j and supplies it on setup and resume",
  async (choice) => {
    const { home, config, cli } = fixture();
    const name = choice || "Nova";
    const result = await cli(bootstrap, ["--no-autostart", "--assistant-name", choice]);
    expect({ code: result.code, err: result.err }).toEqual({ code: 0, err: "" });
    expect(readFileSync(join(config, "assistant-name"), "utf8")).toBe(`${name}\n`);
    expect(readFileSync(join(home, "launch.txt"), "utf8")).toContain(name);
    expect(readFileSync(join(config, "setup-prompt.txt"), "utf8")).toContain(name);
    expect(await cli(join(config, "bin/polar-session.sh"), ["run", "resume"])).toMatchObject({ code: 0 });
    expect(readFileSync(join(home, "launch.txt"), "utf8")).toContain(name);
    expect(readFileSync(join(config, "user.md"), "utf8")).toBe("Name: Existing user\nLanguage: Korean\n");
    expect(existsSync(join(config, "home/injected"))).toBe(false);
  },
);

test("keeps the first name across bootstrap reruns and process restarts", async () => {
  const { home, config, cli } = fixture();
  expect(await cli(bootstrap, ["--no-autostart", "--assistant-name", "First"])).toMatchObject({ code: 0 });
  expect(await cli(bootstrap, ["--no-autostart", "--assistant-name", "Replacement"])).toMatchObject({ code: 0 });
  expect(await cli(bootstrap, ["--no-autostart"])).toMatchObject({ code: 0 });
  expect(await cli(join(config, "bin/polar-session.sh"), ["run", "resume"])).toMatchObject({ code: 0 });
  expect(readFileSync(join(config, "assistant-name"), "utf8")).toBe("First\n");
  expect(readFileSync(join(home, "launch.txt"), "utf8")).toContain("First");
});

test.each([
  ["Luna\n", "Luna"],
  ["\n", "Nova"],
])("standalone onboarding stores %j through the shared helper", async (input, name) => {
  const { config, cli } = fixture();
  expect(await cli(naming, ["--stdin"], input)).toMatchObject({ code: 0, out: `${name}\n` });
  expect(await cli(naming, ["--get"])).toMatchObject({ code: 0, out: `${name}\n` });
  expect(readFileSync(join(config, "assistant-name"), "utf8")).toBe(`${name}\n`);
});

test.each(["", "unfinished"])("canceled input %j leaves no identity to resume", async (input) => {
  const { config, cli } = fixture();
  const result = await cli(naming, ["--stdin"], input);
  expect(result.code).toBe(1);
  expect(existsSync(join(config, "assistant-name"))).toBe(false);
});

test.each([
  ["Aurora\n", "Aurora", 0, false],
  ["\n", "Nova", 0, false],
  ["\x04", "", 1, false],
  ["\x03", "", 130, false],
  ["Piped\n", "Piped", 0, true],
  ["\n", "Nova", 0, true],
  ["\x04", "", 1, true],
  ["\x03", "", 130, true],
])(
  "terminal input %j saves only a completed answer (piped bootstrap: %j)",
  async (input, name, expectedCode, piped) => {
    const { home, config, env } = fixture();
    const stdinFile = piped ? join(home, "script-input") : "";
    if (piped) writeFileSync(stdinFile, readFileSync(bootstrap));
    const child = Bun.spawn(
      [
        "python3",
        "-c",
        `
import errno, os, pty, sys
pid, fd = pty.fork()
if pid == 0:
    if sys.argv[3]:
        source = os.open(sys.argv[3], os.O_RDONLY)
        os.dup2(source, 0)
        os.close(source)
        os.execv("/bin/bash", ["bash", "-s", "--", "--no-autostart"])
    os.execv("/bin/bash", ["bash", sys.argv[1]])
output = b""
while not output.endswith(b": "):
    output += os.read(fd, 4096)
os.write(fd, sys.argv[2].encode())
try:
    while os.read(fd, 4096):
        pass
except OSError as error:
    if error.errno != errno.EIO:
        raise
os.close(fd)
_, status = os.waitpid(pid, 0)
code = os.waitstatus_to_exitcode(status)
sys.exit(code if code >= 0 else 128 - code)
`,
        naming,
        input,
        stdinFile,
      ],
      { env, stdin: "ignore", stdout: "pipe", stderr: "pipe" },
    );
    const [code, err] = await Promise.all([child.exited, new Response(child.stderr).text()]);
    expect({ code, err }).toEqual({ code: expectedCode, err: "" });
    if (expectedCode === 0) {
      expect(readFileSync(join(config, "assistant-name"), "utf8")).toBe(`${name}\n`);
      if (piped) expect(readFileSync(join(home, "launch.txt"), "utf8")).toContain(name);
    } else expect(existsSync(join(config, "assistant-name"))).toBe(false);
  },
);

test("rejects multiline names without saving executable config", async () => {
  const { config, cli } = fixture();
  const result = await cli(naming, ["--name", "Nova\nOther"]);
  expect(result.code).toBe(1);
  expect(existsSync(join(config, "assistant-name"))).toBe(false);
});

test("dry run previews without asking or storing a name", async () => {
  const { config, cli } = fixture();
  expect(await cli(bootstrap, ["--dry-run", "--no-autostart"])).toMatchObject({ code: 0 });
  expect(existsSync(join(config, "assistant-name"))).toBe(false);
});

test("curl-piped bootstrap leaves its script input intact", async () => {
  const { home, env } = fixture();
  const script = readFileSync(bootstrap, "utf8");
  const child = Bun.spawn(["/bin/bash", "-s", "--", "--no-autostart", "--assistant-name", "Piped"], {
    env,
    stdin: new Response(script),
    stdout: "pipe",
    stderr: "pipe",
  });
  const [code, err] = await Promise.all([child.exited, new Response(child.stderr).text()]);
  expect({ code, err }).toEqual({ code: 0, err: "" });
  expect(readFileSync(join(home, ".polar/assistant-name"), "utf8")).toBe("Piped\n");
  expect(readFileSync(join(home, "launch.txt"), "utf8")).toContain("Piped");
});
