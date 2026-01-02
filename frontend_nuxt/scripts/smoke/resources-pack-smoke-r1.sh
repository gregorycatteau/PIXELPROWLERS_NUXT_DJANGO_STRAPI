#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-http://127.0.0.1:3011}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY_PATH="${SCRIPT_DIR}/../../app/config/resources/registryV0.data.mjs"

if ! slug_payload=$(
  node -e '
    const { pathToFileURL } = require("node:url");
    const path = process.argv[1];
    import(pathToFileURL(path).href).then((m) => {
      const data = Object.values(m).find((v) => v && typeof v === "object" && Array.isArray(v.resources));
      const resources = data?.resources ?? Object.values(m).find((v) => Array.isArray(v)) ?? [];
      if (!Array.isArray(resources) || resources.length === 0) {
        console.error("NO_RESOURCES");
        process.exit(2);
      }
      const published = resources.find((r) => r && r.status === "published" && r.slug);
      if (!published || !published.slug) {
        console.error("NO_PUBLISHED");
        process.exit(3);
      }
      const draft = resources.find((r) => r && r.status === "draft" && r.slug);
      const draftSlug = draft?.slug ?? "";
      process.stdout.write(`${published.slug}|${draftSlug}`);
    }).catch(() => {
      console.error("IMPORT_FAIL");
      process.exit(1);
    });
  ' "$REGISTRY_PATH"
); then
  echo "FAIL registry read"
  exit 1
fi

published_slug="${slug_payload%%|*}"
draft_slug="${slug_payload#*|}"

if [[ -z "$published_slug" ]]; then
  echo "FAIL no published slug"
  exit 1
fi

head_status() {
  local path="$1"
  local url="${BASE}${path}"
  curl -sS -I "$url" | tr -d '\r' | head -n1 | awk '{print $2}'
}

expect_status() {
  local label="$1"
  local path="$2"
  local expected="$3"
  local status
  status=$(head_status "$path")
  if [[ "$status" == "$expected" ]]; then
    echo "PASS ${label} -> ${status}"
    return
  fi
  echo "FAIL ${label} -> ${status} (expected ${expected})"
  exit 1
}

echo "resources-pack-smoke-r1"
echo "BASE: ${BASE}"

expect_status "published ${published_slug}" "/ressources/${published_slug}" "200"

if [[ -n "$draft_slug" ]]; then
  expect_status "draft ${draft_slug}" "/ressources/${draft_slug}" "404"
else
  echo "NO_DRAFT_TO_TEST"
  unknown_slug="unknown-smoke-draft-404"
  expect_status "unknown ${unknown_slug}" "/ressources/${unknown_slug}" "404"
fi

echo "PASS resources-pack-smoke-r1"
