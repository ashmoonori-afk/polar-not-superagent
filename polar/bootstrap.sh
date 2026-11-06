#!/usr/bin/env bash
# Polar bootstrap: install what Polar needs and start it in a hidden terminal session.
#
# Meant to be run by an app agent (the Claude or ChatGPT desktop app) on the user's behalf,
# or once by hand from Terminal:
#   curl -fsSL https://raw.githubusercontent.com/ashmoonori-afk/polar-not-superagent/main/polar/bootstrap.sh | bash
#
# Flags:
#   --dry-run       print every step and change nothing
#   --no-autostart  do not install the login-time autostart
#   --uninstall     stop the hidden session and remove the autostart; keeps ~/.polar
#
# Safe to run again: every step checks what is already there first.
set -euo pipefail

SESSION="${POLAR_SESSION:-polar}"
POLAR_DIR="${POLAR_DIR:-$HOME/.polar}"
HOME_DIR="$POLAR_DIR/home"
BIN_DIR="$POLAR_DIR/bin"
NODE_DIR="$POLAR_DIR/node"
NPM_PREFIX="$POLAR_DIR/npm"
NODE_MAJOR=24
OMO_SESSION_ID="polar"
LABEL="local.polar-not-superagent.polar"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
UNIT_NAME="polar.service"
UNIT="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user/$UNIT_NAME"
RAW_BASE="https://raw.githubusercontent.com/ashmoonori-afk/polar-not-superagent/main"
SETUP_PROMPT="Read $RAW_BASE/SETUP.md and set yourself up exactly as it says, step by step, asking me only where it tells you to."
# Subscription providers whose /login state `omo auth check` can report.
LOGIN_PROVIDERS=(anthropic-subscription chatgpt-subscription github-copilot cursor kimi-coding openrouter meta)

DRY_RUN=0
AUTOSTART=1
UNINSTALL=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --no-autostart) AUTOSTART=0 ;;
    --uninstall) UNINSTALL=1 ;;
    -h|--help) sed -n '2,14p' "$0" 2>/dev/null || true; exit 0 ;;
    *) printf 'polar: unknown option %s (use --dry-run, --no-autostart or --uninstall)\n' "$arg" >&2; exit 2 ;;
  esac
done

say() { printf 'polar: %s\n' "$*"; }
die() { printf 'polar: %s\n' "$*" >&2; exit 1; }
dry() { [ "$DRY_RUN" -eq 1 ]; }
have() { command -v "$1" >/dev/null 2>&1; }

run() {
  if dry; then
    printf 'polar: [dry-run] would run:'
    printf ' %q' "$@"
    printf '\n'
  else
    "$@"
  fi
}

write_file() {
  local path="$1"
  if dry; then
    cat >/dev/null
    say "[dry-run] would write $path"
  else
    mkdir -p "$(dirname "$path")"
    cat >"$path"
  fi
}

case "$(uname -s)" in
  Darwin) OS=darwin ;;
  Linux) OS=linux ;;
  *) die "this script runs on macOS or Linux (including WSL); this system is $(uname -s)." ;;
esac
case "$(uname -m)" in
  x86_64|amd64) ARCH=x64 ;;
  arm64|aarch64) ARCH=arm64 ;;
  *) die "unsupported CPU type $(uname -m)." ;;
esac

# App terminals often start without the Homebrew and user tool paths.
for d in /opt/homebrew/bin /usr/local/bin "$HOME/.bun/bin" "$NPM_PREFIX/bin" "$NODE_DIR/bin"; do
  if [ -d "$d" ]; then
    case ":$PATH:" in *":$d:"*) ;; *) PATH="$d:$PATH" ;; esac
  fi
done
export PATH

MUX=""
session_running() {
  if [ "$MUX" = tmux ] || { [ -z "$MUX" ] && have tmux; }; then
    tmux has-session -t "=$SESSION" 2>/dev/null && return 0
  fi
  if [ "$MUX" = screen ] || { [ -z "$MUX" ] && have screen; }; then
    screen -ls 2>/dev/null | grep -q "[.]${SESSION}[[:space:]]" && return 0
  fi
  return 1
}

uninstall() {
  say "uninstall: stopping the hidden session and removing the autostart"
  if have tmux && tmux has-session -t "=$SESSION" 2>/dev/null; then
    run tmux kill-session -t "=$SESSION"
  elif have screen && screen -ls 2>/dev/null | grep -q "[.]${SESSION}[[:space:]]"; then
    run screen -S "$SESSION" -X quit
  else
    say "no hidden session named $SESSION is running"
  fi
  if [ "$OS" = darwin ] && [ -f "$PLIST" ]; then
    run launchctl bootout "gui/$(id -u)/$LABEL" || true
    run rm -f "$PLIST"
  fi
  if [ "$OS" = linux ] && [ -f "$UNIT" ]; then
    run systemctl --user disable "$UNIT_NAME" || true
    run rm -f "$UNIT"
    run systemctl --user daemon-reload || true
  fi
  say "kept $POLAR_DIR (profile, memory and settings). Delete that folder yourself if you want everything gone."
}

if [ "$UNINSTALL" -eq 1 ]; then
  uninstall
  exit 0
fi

dry && say "dry run: nothing will be installed, started or written"

node_major() { node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }

sha256_of() {
  if have sha256sum; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi
}

install_node() {
  have curl || die "curl is needed to download Node.js; install curl, then run this again."
  local base="https://nodejs.org/dist/latest-v${NODE_MAJOR}.x"
  if dry; then
    say "[dry-run] would download the official Node.js $NODE_MAJOR tarball ($OS-$ARCH) from $base, check its SHA-256 and unpack it into $NODE_DIR"
    return
  fi
  local line sum file tmp
  line="$(curl -fsSL "$base/SHASUMS256.txt" | grep " node-v[0-9.]*-$OS-$ARCH.tar.gz\$" | head -n 1)" ||
    die "could not find a Node.js $NODE_MAJOR download for $OS-$ARCH at $base."
  sum="${line%% *}"
  file="${line##* }"
  tmp="$(mktemp -d)"
  curl -fsSL -o "$tmp/$file" "$base/$file"
  [ "$(sha256_of "$tmp/$file")" = "$sum" ] || { rm -rf "$tmp"; die "the Node.js download failed its checksum; nothing was installed."; }
  rm -rf "$NODE_DIR"
  mkdir -p "$NODE_DIR"
  tar -xzf "$tmp/$file" -C "$NODE_DIR" --strip-components=1
  rm -rf "$tmp"
  PATH="$NODE_DIR/bin:$PATH"
  say "installed Node.js $(node -v) into $NODE_DIR"
}

ensure_node() {
  if have node && [ "$(node_major)" -ge "$NODE_MAJOR" ]; then
    say "step 1/4: node $(node -v) found"
  else
    if have node; then
      say "step 1/4: node $(node -v) is older than $NODE_MAJOR, which omo needs; installing a private copy (no sudo)"
    else
      say "step 1/4: node not found; installing a private copy (no sudo)"
    fi
    install_node
  fi
}

prefix_writable() {
  [ -n "$1" ] && [ -w "$1" ] &&
    { [ ! -d "$1/lib" ] || [ -w "$1/lib" ]; } &&
    { [ ! -d "$1/bin" ] || [ -w "$1/bin" ]; }
}

ensure_omo() {
  if have omo; then
    say "step 1/4: omo found at $(command -v omo)"
    return
  fi
  if ! have npm; then
    dry && { say "[dry-run] would install omo with: npm install -g omo-ai"; return; }
    die "npm is missing even though node is installed; reinstall Node.js, then run this again."
  fi
  local prefix
  prefix="$(npm config get prefix 2>/dev/null || true)"
  if prefix_writable "$prefix"; then
    say "step 1/4: installing omo into the npm global prefix $prefix"
    run npm install -g omo-ai
  else
    say "step 1/4: the npm global prefix ${prefix:-(unknown)} is not writable; installing omo into $NPM_PREFIX instead (no sudo)"
    run mkdir -p "$NPM_PREFIX"
    run npm install -g --prefix "$NPM_PREFIX" omo-ai
    PATH="$NPM_PREFIX/bin:$PATH"
  fi
  dry || have omo || die "omo did not install; run 'npm install -g omo-ai' by hand to see the error."
}

ensure_mux() {
  if have tmux; then
    MUX=tmux
    say "step 1/4: tmux found"
  elif have brew; then
    MUX=tmux
    say "step 1/4: tmux not found; installing it with Homebrew"
    run brew install tmux
  elif have screen; then
    MUX=screen
    say "step 1/4: tmux not found; using GNU screen"
  else
    die "Polar needs tmux or GNU screen to run hidden: install one of them (on macOS 'brew install tmux' after installing Homebrew from brew.sh, on Linux 'sudo apt install tmux'), then run this again."
  fi
}

install_helpers() {
  local self src="" d f
  self="${BASH_SOURCE[0]:-}"
  if [ -n "$self" ] && [ -f "$self" ]; then
    d="$(cd "$(dirname "$self")" && pwd)"
    if [ -f "$d/screen.sh" ] && [ -f "$d/send.sh" ]; then src="$d"; fi
  fi
  run mkdir -p "$BIN_DIR" "$HOME_DIR"
  for f in screen.sh send.sh; do
    if [ -n "$src" ]; then
      run cp "$src/$f" "$BIN_DIR/$f"
    else
      run curl -fsSL -o "$BIN_DIR/$f" "$RAW_BASE/polar/$f"
    fi
    run chmod +x "$BIN_DIR/$f"
  done
  printf '%s\n' "$SETUP_PROMPT" | write_file "$POLAR_DIR/setup-prompt.txt"
}

write_session_script() {
  local omo_bin run_path
  omo_bin="$(command -v omo || echo "$NPM_PREFIX/bin/omo")"
  run_path="$(dirname "$omo_bin"):$(dirname "$(command -v node || echo "$NODE_DIR/bin/node")")"
  run_path="$run_path:$HOME/.bun/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
  {
    echo '#!/usr/bin/env bash'
    echo '# Generated by polar/bootstrap.sh: starts Polar in its hidden terminal session.'
    echo '# Usage: polar-session.sh start <setup|resume>'
    echo 'set -euo pipefail'
    printf 'export PATH=%q\n' "$run_path"
    printf 'SESSION=%q\n' "$SESSION"
    printf 'MUX=%q\n' "$MUX"
    printf 'POLAR_DIR=%q\n' "$POLAR_DIR"
    printf 'OMO_SESSION_ID=%q\n' "$OMO_SESSION_ID"
    printf 'SELF=%q\n' "$BIN_DIR/polar-session.sh"
    cat <<'EOF'
HOME_DIR="$POLAR_DIR/home"
action="${1:-start}"
mode="${2:-resume}"

running() {
  if [ "$MUX" = tmux ]; then
    tmux has-session -t "=$SESSION" 2>/dev/null
  else
    screen -ls 2>/dev/null | grep -q "[.]${SESSION}[[:space:]]"
  fi
}

case "$action" in
  start)
    if running; then
      echo "polar: hidden session $SESSION is already running"
      exit 0
    fi
    mkdir -p "$HOME_DIR"
    if [ "$MUX" = tmux ]; then
      tmux new-session -d -s "$SESSION" -x 200 -y 50 -c "$HOME_DIR" /bin/bash "$SELF" run "$mode"
    else
      (cd "$HOME_DIR" && screen -dmS "$SESSION" /bin/bash "$SELF" run "$mode")
    fi
    echo "polar: started hidden $MUX session $SESSION"
    ;;
  run)
    cd "$HOME_DIR"
    if [ "$mode" = setup ]; then
      exec omo --session-id "$OMO_SESSION_ID" "$(cat "$POLAR_DIR/setup-prompt.txt")"
    fi
    exec omo --session-id "$OMO_SESSION_ID"
    ;;
  *)
    echo "usage: polar-session.sh start <setup|resume>" >&2
    exit 2
    ;;
esac
EOF
  } | write_file "$BIN_DIR/polar-session.sh"
  run chmod +x "$BIN_DIR/polar-session.sh"
}

ensure_node
ensure_omo
ensure_mux
install_helpers
write_session_script

# The model login is omo's interactive /login command; there is no separate shell command for it.
# `omo login` signs in to an OmO account, which is a different thing; this script does not run it.
LOGGED_IN=0
LOGIN_PROVIDER=""
if have omo; then
  for p in "${LOGIN_PROVIDERS[@]}"; do
    out="$(omo auth check --provider "$p" --json --no-refresh 2>/dev/null)" || true
    case "$out" in
      *'"status":"ready"'*|*'"signIn":"signed_in"'*) LOGGED_IN=1; LOGIN_PROVIDER="$p"; break ;;
    esac
  done
fi
if [ "$LOGGED_IN" -eq 1 ]; then
  say "step 2/4: model login found ($LOGIN_PROVIDER); skipping login"
elif have omo; then
  say "step 2/4: no model login yet; it runs inside the hidden session with /login (see the last lines below)"
else
  say "[dry-run] step 2/4: would check the model login with 'omo auth check' once omo is installed"
fi

if session_running; then
  say "step 3/4: hidden session $SESSION is already running; left as it is"
elif [ "$LOGGED_IN" -eq 1 ]; then
  say "step 3/4: starting Polar in a hidden $MUX session named $SESSION, with the setup line"
  run /bin/bash "$BIN_DIR/polar-session.sh" start setup
else
  say "step 3/4: starting omo in a hidden $MUX session named $SESSION, waiting for the model login"
  run /bin/bash "$BIN_DIR/polar-session.sh" start resume
fi

install_launch_agent() {
  write_file "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$BIN_DIR/polar-session.sh</string>
    <string>start</string>
    <string>resume</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>AbandonProcessGroup</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$POLAR_DIR/autostart.log</string>
  <key>StandardErrorPath</key>
  <string>$POLAR_DIR/autostart.log</string>
</dict>
</plist>
EOF
  run launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
  run launchctl bootstrap "gui/$(id -u)" "$PLIST"
  say "step 4/4: LaunchAgent $PLIST starts the hidden session at every login if it is missing"
}

install_systemd_unit() {
  write_file "$UNIT" <<EOF
[Unit]
Description=Polar hidden terminal session

[Service]
Type=oneshot
RemainAfterExit=yes
KillMode=process
ExecStart=/bin/bash $BIN_DIR/polar-session.sh start resume

[Install]
WantedBy=default.target
EOF
  run systemctl --user daemon-reload
  run systemctl --user enable "$UNIT_NAME"
  say "step 4/4: systemd user unit $UNIT starts the hidden session at every login if it is missing"
}

if [ "$AUTOSTART" -eq 0 ]; then
  say "step 4/4: --no-autostart given; no autostart installed"
elif [ "$OS" = darwin ]; then
  install_launch_agent
elif have systemctl && systemctl --user show-environment >/dev/null 2>&1; then
  install_systemd_unit
else
  say "step 4/4: systemd is not running for this user, so Polar will not start by itself after a restart. Run this script again after each restart, or on WSL turn systemd on ([boot] systemd=true in /etc/wsl.conf) and run it once more."
fi

if [ "$MUX" = tmux ]; then
  watch_cmd="tmux attach -t $SESSION (leave it running with Ctrl-b d)"
else
  watch_cmd="screen -r $SESSION (leave it running with Ctrl-a d)"
fi
say "read its screen:  $BIN_DIR/screen.sh 40"
say "type into it:     $BIN_DIR/send.sh \"text\"   (menu keys: $BIN_DIR/send.sh --key Enter|Escape|Down|Up)"
say "look at it yourself: $watch_cmd"
if [ "$LOGGED_IN" -eq 0 ]; then
  say "next: model login. Run $BIN_DIR/send.sh /login, pick a provider from the menu shown by screen.sh, and pass the sign-in link to the user."
  say "after the login: $BIN_DIR/send.sh \"\$(cat $POLAR_DIR/setup-prompt.txt)\""
fi
dry && say "dry run finished: nothing was changed"
exit 0
