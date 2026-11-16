#!/usr/bin/env bash
# Shared identity storage for bootstrap, app bridges and SETUP.md-only onboarding.
# Usage: bash name.sh [--name <name> | --stdin | --get]
# No arguments asks through /dev/tty, never the downloaded bootstrap's stdin.
set -euo pipefail

CONFIG="${POLAR_DIR:-$HOME/.polar}/assistant-name"
mode="${1:-}"
case "$mode" in
  '') [ "$#" -eq 0 ] ;;
  --name) [ "$#" -eq 2 ] ;;
  --stdin|--get) [ "$#" -eq 1 ] ;;
  *) false ;;
esac || { echo 'usage: name.sh [--name <name> | --stdin | --get]' >&2; exit 2; }

validate() {
  case "$name" in *$'\n'*) return 1 ;; esac
  [ -n "$name" ] && ! LC_ALL=C printf '%s' "$name" | LC_ALL=C grep -q '[[:cntrl:]]'
}

if [ -f "$CONFIG" ]; then
  name="$(cat "$CONFIG")"
  validate || { echo 'assistant: invalid saved name; expected one nonempty line' >&2; exit 1; }
else
  case "$mode" in
    --get) echo 'assistant: no saved name; run name.sh first' >&2; exit 1 ;;
    --name) name="$2" ;;
    --stdin)
      IFS= read -r name || { echo 'assistant: naming canceled; nothing saved' >&2; exit 1; }
      ;;
    '')
      printf 'What should your assistant be called? [Nova]: ' >&2
      if ! { IFS= read -r name </dev/tty; } 2>/dev/null; then
        echo 'assistant: naming canceled or no terminal; supply --assistant-name to bootstrap or --name to name.sh' >&2
        exit 1
      fi
      ;;
  esac
  name="${name:-Nova}"
  validate || { echo 'assistant: use a single line without control characters' >&2; exit 1; }
  umask 077
  mkdir -p "$(dirname "$CONFIG")"
  printf '%s\n' "$name" >"$CONFIG"
fi
printf '%s\n' "$name"
