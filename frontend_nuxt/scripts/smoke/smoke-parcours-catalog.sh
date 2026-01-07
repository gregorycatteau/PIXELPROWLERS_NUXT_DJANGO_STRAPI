#!/usr/bin/env bash
# Usage: bash frontend_nuxt/scripts/smoke/smoke-parcours-catalog.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

HOST=127.0.0.1
PORT=3013
BASE_URL="http://${HOST}:${PORT}"
TARGET_PATH="/parcours"
OUTPUT_FILE="/tmp/pp-smoke-parcours.html"

cleanup() {
  if [[ -n "${PROD_PID:-}" ]]; then
    kill "$PROD_PID" >/dev/null 2>&1 || true
    wait "$PROD_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

NODE_ENV=production npm run build >/tmp/pp-smoke-parcours-build.log 2>&1
NITRO_PORT="$PORT" node .output/server/index.mjs >/tmp/pp-smoke-parcours-prod.log 2>&1 &
PROD_PID=$!

status="000"
for _ in {1..30}; do
  status=$(curl -s -o "$OUTPUT_FILE" -w "%{http_code}" "${BASE_URL}${TARGET_PATH}" || true)
  if [[ "$status" != "000" ]]; then
    break
  fi
  sleep 1
done

if [[ "$status" != "200" ]]; then
  echo "❌ smoke-parcours-catalog: expected 200 for ${TARGET_PATH}, got ${status}"
  exit 1
fi

required_slugs=(
  "ma-structure-dysfonctionne"
  "parcours-p2"
  "parcours-p3"
  "parcours-p4"
  "parcours-p5"
)

for slug in "${required_slugs[@]}"; do
  if ! rg -q "${slug}" "$OUTPUT_FILE"; then
    echo "❌ smoke-parcours-catalog: missing slug ${slug} in catalog"
    exit 1
  fi
  echo "✅ smoke-parcours-catalog: found ${slug}"
done

echo "✅ smoke-parcours-catalog: ${TARGET_PATH} -> ${status}"
