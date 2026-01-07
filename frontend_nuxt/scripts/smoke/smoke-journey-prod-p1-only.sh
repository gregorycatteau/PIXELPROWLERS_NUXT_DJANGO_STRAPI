#!/usr/bin/env bash
# Usage: bash frontend_nuxt/scripts/smoke/smoke-journey-prod-p1-only.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

HOST=127.0.0.1
PORT=3012
BASE_URL="http://${HOST}:${PORT}"
TARGET_PATH="/parcours/parcours-p2"

cleanup() {
  if [[ -n "${PROD_PID:-}" ]]; then
    kill "$PROD_PID" >/dev/null 2>&1 || true
    wait "$PROD_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

NODE_ENV=production npm run build >/tmp/pp-smoke-build.log 2>&1
NITRO_PORT="$PORT" node .output/server/index.mjs >/tmp/pp-smoke-prod.log 2>&1 &
PROD_PID=$!

# Wait until the prod server responds (avoid race on cold start).
status="000"
for _ in {1..30}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${TARGET_PATH}" || true)
  if [[ "$status" != "000" ]]; then
    break
  fi
  sleep 1
 done

if [[ "$status" != "404" ]]; then
  echo "❌ smoke-journey-prod-p1-only: expected 404 for ${TARGET_PATH}, got ${status}"
  exit 1
fi

echo "✅ smoke-journey-prod-p1-only: ${TARGET_PATH} -> ${status}"
