#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-http://127.0.0.1:3011}"

failures=()

head_request() {
  local path="$1"
  local url="${BASE}${path}"
  local headers
  headers=$(curl -sS -I "$url" | tr -d '\r')
  local status
  status=$(printf '%s\n' "$headers" | head -n1 | awk '{print $2}')
  local location
  location=$(printf '%s\n' "$headers" | awk 'tolower($1)=="location:"{print $2; exit}')
  printf '%s|%s' "$status" "$location"
}

head_headers() {
  local path="$1"
  local url="${BASE}${path}"
  curl -sS -I "$url" | tr -d '\r'
}

expect_status_and_location() {
  local label="$1"
  local path="$2"
  local expected_status="$3"
  local expected_location="$4"
  local result
  result=$(head_request "$path")
  local status="${result%%|*}"
  local location="${result#*|}"

  local ok=true
  if [[ "$status" != "$expected_status" ]]; then
    ok=false
  fi
  if [[ -n "$expected_location" && "$location" != "$expected_location" ]]; then
    ok=false
  fi
  if [[ -z "$expected_location" && -n "$location" ]]; then
    ok=false
  fi

  if [[ "$ok" == true ]]; then
    echo "✅ ${label} -> ${status} ${location}"
  else
    echo "❌ ${label} -> ${status} ${location}"
    failures+=("${label}")
  fi
}

expect_status_and_q_clamped() {
  local label="$1"
  local path="$2"
  local expected_status="$3"
  local result
  result=$(head_request "$path")
  local status="${result%%|*}"
  local location="${result#*|}"

  local ok=true
  if [[ "$status" != "$expected_status" ]]; then
    ok=false
  fi

  if [[ "$location" != /ressources\?q=* ]]; then
    ok=false
  else
    local q_value
    q_value=$(printf '%s' "$location" | sed -n 's@^/ressources?q=@@p')
    local q_len=${#q_value}
    if (( q_len == 0 || q_len > 120 )); then
      ok=false
    fi
  fi

  if [[ "$ok" == true ]]; then
    echo "✅ ${label} -> ${status} ${location}"
  else
    echo "❌ ${label} -> ${status} ${location}"
    failures+=("${label}")
  fi
}

q_700=$(python3 - <<'PY'
print('a' * 700)
PY
)
q_5000=$(python3 - <<'PY'
print('a' * 5000)
PY
)

slug="scan-structurel-express"

echo "🔍 ressources-canon-smoke-r1 — Checks"
echo "Base URL: ${BASE}"

expect_status_and_location "utm+gclid preserved q" "/ressources?utm_source=evil&gclid=1&q=test" "307" "/ressources?q=test"
expect_status_and_location "sort dropped" "/ressources?sort=recent&q=test" "307" "/ressources?q=test"
expect_status_and_location "unknown param dropped" "/ressources?category=diagnostic&lol=1" "307" "/ressources?category=diagnostic"
expect_status_and_location "duplicate q dropped" "/ressources?q=clean&q=evil" "307" "/ressources"
expect_status_and_q_clamped "q clamped" "/ressources?q=${q_700}" "307"
expect_status_and_location "q oversize => 404" "/ressources?q=${q_5000}" "404" ""
expect_status_and_location "slug canonical" "/ressources/${slug}?utm_source=evil" "307" "/ressources/${slug}"

headers_404=$(head_headers "/ressources?q=${q_5000}")
if echo "$headers_404" | grep -iq '^cache-control:.*no-store'; then
  echo "✅ 404 cache-control no-store -> OK"
else
  echo "❌ 404 cache-control no-store -> MISSING"
  failures+=("404 cache-control no-store")
fi

if (( ${#failures[@]} > 0 )); then
  echo ""
  echo "❌ ressources-canon-smoke-r1 — FAIL"
  for item in "${failures[@]}"; do
    echo "   - ${item}"
  done
  exit 1
fi

echo ""
echo "✅ ressources-canon-smoke-r1 — OK"
