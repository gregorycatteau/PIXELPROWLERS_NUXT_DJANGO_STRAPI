#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )/../.." && pwd)"
cd "$ROOT_DIR"

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <journeyId>"
  exit 1
fi

journeyId="$1"
slug="parcours-${journeyId}"

build() {
  npm run --prefix frontend_nuxt build >/tmp/pp-smoke-journey-build.log 2>&1
}

ensure_port_free() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    local pids
    pids=$(lsof -ti :"$port" || true)
    if [[ -n "$pids" ]]; then
      echo "Cleaning up processes on port ${port}: ${pids}" >&2
      for pid in $pids; do
        kill -9 "$pid" >/dev/null 2>&1 || true
      done
      sleep 1
    fi
  fi
}

start_preview() {
  local port="$1"
  local disable_flag="$2"
  local log_file="$3"
  ensure_port_free "$port"
  NUXT_PUBLIC_PP_JOURNEYS_DISABLED="$disable_flag" npm run --prefix frontend_nuxt start -- --port "$port" >"$log_file" 2>&1 &
  echo $!
}

check_status() {
  local port="$1"
  local expected="$2"
  local code
  for _ in {1..10}; do
    code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${port}/parcours/${slug}" || true)
    if [[ -n "$code" && "$code" != "000" ]]; then
      break
    fi
    sleep 1
  done
  echo "$code"
  if [[ "$code" != "$expected" ]]; then
    echo "Unexpected status for port ${port}: got $code, expected $expected"
    return 1
  fi
}

build

cleanup() {
  if [[ -n "${PREVIEW_PID:-}" ]]; then
    kill "$PREVIEW_PID" >/dev/null 2>&1 || true
    wait "$PREVIEW_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

PREVIEW_PID=$(start_preview 4020 "$journeyId" /tmp/pp-smoke-kill-on.log)
sleep 2
check_status 4020 404
kill "$PREVIEW_PID"
wait "$PREVIEW_PID" >/dev/null 2>&1 || true

PREVIEW_PID=$(start_preview 4021 "" /tmp/pp-smoke-kill-off.log)
sleep 2
check_status 4021 200
kill "$PREVIEW_PID"
wait "$PREVIEW_PID" >/dev/null 2>&1 || true

echo "✅ smoke-journey-killswitch ${journeyId}"
