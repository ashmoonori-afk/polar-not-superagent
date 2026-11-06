#!/usr/bin/env bash
# Type into Polar's hidden terminal.
# Usage: send.sh "<text>"                       types the text, then presses Enter
#        send.sh --key <Enter|Escape|Down|Up>   presses one key, for menus
# Session name: $POLAR_SESSION, default polar.
set -euo pipefail

SESSION="${POLAR_SESSION:-polar}"
usage() { echo 'usage: send.sh "<text>" | send.sh --key <Enter|Escape|Down|Up>' >&2; exit 2; }

[ "$#" -ge 1 ] || usage
KEY=""
TEXT=""
if [ "$1" = "--key" ]; then
  [ "$#" -eq 2 ] || usage
  case "$2" in Enter|Escape|Down|Up) KEY="$2" ;; *) usage ;; esac
else
  [ "$#" -eq 1 ] || usage
  TEXT="$1"
fi

if command -v tmux >/dev/null 2>&1 && tmux has-session -t "=$SESSION" 2>/dev/null; then
  target="=$SESSION:"
  if [ -n "$KEY" ]; then
    tmux send-keys -t "$target" "$KEY"
  else
    tmux send-keys -t "$target" -l -- "$TEXT"
    sleep 0.3
    tmux send-keys -t "$target" Enter
  fi
elif command -v screen >/dev/null 2>&1 && screen -ls 2>/dev/null | grep -q "[.]${SESSION}[[:space:]]"; then
  if [ -n "$KEY" ]; then
    case "$KEY" in
      Enter) seq='\015' ;;
      Escape) seq='\033' ;;
      Up) seq='\033[A' ;;
      Down) seq='\033[B' ;;
    esac
    screen -S "$SESSION" -p 0 -X stuff "$seq"
  else
    # readbuf + paste keeps the text literal; `stuff` would interpret ^ and backslash escapes in it.
    buf="$(mktemp)"
    trap 'rm -f "$buf"' EXIT
    printf '%s' "$TEXT" >"$buf"
    screen -S "$SESSION" -p 0 -X readbuf "$buf"
    screen -S "$SESSION" -p 0 -X paste .
    sleep 0.3
    screen -S "$SESSION" -p 0 -X stuff '\015'
  fi
else
  echo "polar: no hidden session named $SESSION is running; run bootstrap.sh to start it" >&2
  exit 1
fi
