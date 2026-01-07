#!/usr/bin/env bash
# Usage: bash frontend_nuxt/scripts/smoke/smoke-journey-prod-p1-only.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

HOST=127.0.0.1
PORT=3012
BASE_URL="http://${HOST}:${PORT}"
MANIFEST_DIR="app/config/journeys/manifests"
MANIFEST_GLOB="${MANIFEST_DIR}/*.manifest.ts"

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

extract_field() {
  local field="$1"
  local file="$2"
  rg -n "${field}:" "$file" -m 1 | sed -E "s/.*${field}:\\s*'([^']+)'.*/\\1/"
}

collect_manifests() {
  rg --files -g "*.manifest.ts" "$MANIFEST_DIR" \
    | rg -v "_template\\.manifest\\.ts$" \
    | rg -v "_stub\\.manifest\\.ts$"
}

mapfile -t manifest_files < <(collect_manifests)
if [[ "${#manifest_files[@]}" -eq 0 ]]; then
  echo "❌ smoke-journey-prod-p1-only: no manifest files found"
  exit 1
fi

# Wait until the prod server responds (avoid race on cold start).
status="000"
for _ in {1..30}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/" || true)
  if [[ "$status" != "000" ]]; then
    break
  fi
  sleep 1
done

failures=0
for manifest in "${manifest_files[@]}"; do
  slug="$(extract_field "slug" "$manifest")"
  visibility="$(extract_field "visibility" "$manifest")"
  if [[ -z "${slug}" || -z "${visibility}" ]]; then
    echo "❌ smoke-journey-prod-p1-only: missing slug/visibility in ${manifest}"
    failures=$((failures + 1))
    continue
  fi
  target="/parcours/${slug}"
  expected="200"
  if [[ "${visibility}" == "dev" ]]; then
    expected="404"
  fi
  got="$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${target}" || true)"
  if [[ "${got}" == "${expected}" ]]; then
    echo "✅ smoke-journey-prod-p1-only: ${target} visibility=${visibility} expected=${expected} got=${got}"
  else
    echo "❌ smoke-journey-prod-p1-only: ${target} visibility=${visibility} expected=${expected} got=${got}"
    failures=$((failures + 1))
  fi
done

if [[ "${failures}" -gt 0 ]]; then
  exit 1
fi
