#!/usr/bin/env bash
# Usage: bash frontend_nuxt/scripts/smoke/smoke-journey-dev-allowlist.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

export NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST=p2

HOST=127.0.0.1
PORT=3011
BASE_URL="http://${HOST}:${PORT}"
TARGET_PATH="/parcours/parcours-p2"

cleanup() {
  if [[ -n "${DEV_PID:-}" ]]; then
    kill "$DEV_PID" >/dev/null 2>&1 || true
    wait "$DEV_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

npm run dev -- --host "$HOST" --port "$PORT" >/tmp/pp-smoke-dev.log 2>&1 &
DEV_PID=$!

# Wait until the dev server responds (avoid race on cold start).
status="000"
for _ in {1..30}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${TARGET_PATH}" || true)
  if [[ "$status" != "000" ]]; then
    break
  fi
  sleep 1
 done

if [[ "$status" == "404" || "$status" == "000" ]]; then
  echo "❌ smoke-journey-dev-allowlist: unexpected status $status for ${TARGET_PATH}"
  exit 1
fi

echo "✅ smoke-journey-dev-allowlist: ${TARGET_PATH} -> ${status}"
