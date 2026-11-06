#!/usr/bin/env bash
# Print the last N non-blank lines of Polar's hidden terminal (default 40).
# Usage: screen.sh [lines]    Session name: $POLAR_SESSION, default polar.
set -euo pipefail

SESSION="${POLAR_SESSION:-polar}"
LINES_WANTED="${1:-40}"
case "$LINES_WANTED" in
  ''|*[!0-9]*) echo "usage: screen.sh [lines]" >&2; exit 2 ;;
esac

if command -v tmux >/dev/null 2>&1 && tmux has-session -t "=$SESSION" 2>/dev/null; then
  tmux capture-pane -p -J -t "=$SESSION:" -S -2000 | awk 'NF' | tail -n "$LINES_WANTED"
elif command -v screen >/dev/null 2>&1 && screen -ls 2>/dev/null | grep -q "[.]${SESSION}[[:space:]]"; then
  copy="$(mktemp)"
  trap 'rm -f "$copy"' EXIT
  screen -S "$SESSION" -p 0 -X hardcopy -h "$copy"
  tries=0
  while [ ! -s "$copy" ] && [ "$tries" -lt 20 ]; do
    sleep 0.1
    tries=$((tries + 1))
  done
  awk 'NF' "$copy" | tail -n "$LINES_WANTED"
else
  echo "polar: no hidden session named $SESSION is running; run bootstrap.sh to start it" >&2
  exit 1
fi
