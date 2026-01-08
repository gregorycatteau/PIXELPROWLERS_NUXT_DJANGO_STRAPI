#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3015}"
BASE="${BASE:-http://127.0.0.1:${PORT}}"

if [[ -z "${BASE:-}" && -n "${PORT:-}" ]]; then
  BASE="http://127.0.0.1:${PORT}"
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

cleanup() {
  if [[ -n "${PROD_PID:-}" ]]; then
    kill "$PROD_PID" >/dev/null 2>&1 || true
    wait "$PROD_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

NODE_ENV=production npm run build >/tmp/pp-smoke-p5-build.log 2>&1
NITRO_PORT="$PORT" node .output/server/index.mjs >/tmp/pp-smoke-p5-prod.log 2>&1 &
PROD_PID=$!

status="000"
OUTPUT_FILE="/tmp/pp-smoke-p5.html"
for _ in {1..30}; do
  status=$(curl -s -o "$OUTPUT_FILE" -w "%{http_code}" "${BASE}/parcours/parcours-p5" || true)
  if [[ "$status" != "000" ]]; then
    break
  fi
  sleep 1
done

if [[ "$status" != "200" ]]; then
  echo "FAIL smoke-p5-value: expected 200 for /parcours/parcours-p5, got ${status}"
  exit 1
fi

if ! npx tsx -e '
  import { p5BilanAdapter } from "./app/adapters/bilan/p5";
  import { recommendResourcesFromBilan } from "./app/utils/resources/recommendResourcesFromBilan";
  import { RESOURCE_REGISTRY_V0 } from "./app/config/resources/registryV0.data.mjs";

  const vm = p5BilanAdapter.buildViewModel();
  const label = vm.panorama?.completenessLabel ?? "";
  const match = label.match(/(\d{1,3})/);
  const score = match ? Number(match[1]) : NaN;

  if (!Number.isFinite(score) || score < 0 || score > 100) {
    console.error("FAIL smoke-p5-value: invalid global score", label);
    process.exit(1);
  }

  const prioritiesCount = vm.sections?.reperes?.itemsCount ?? 0;
  if (prioritiesCount < 2) {
    console.error("FAIL smoke-p5-value: expected at least 2 priorities");
    process.exit(1);
  }

  const recos = recommendResourcesFromBilan({
    panorama: vm.panorama,
    sections: vm.sections,
    modules: vm.modules,
    journeyId: "p5"
  });

  if (!recos.length) {
    console.error("FAIL smoke-p5-value: no resource recommendations");
    process.exit(1);
  }

  const published = RESOURCE_REGISTRY_V0.filter((r) => r.status === "published");
  const publishedBySlug = new Map(published.map((r) => [r.slug, r]));

  for (const reco of recos) {
    const res = publishedBySlug.get(reco.slug);
    if (!res || !res.relatedJourneys?.includes("p5")) {
      console.error(`FAIL smoke-p5-value: reco ${reco.slug} not tagged p5`);
      process.exit(1);
    }
  }

  const actionsCount = vm.modules?.resourcesActions?.recommended?.length ?? 0;
  if (actionsCount < 3) {
    console.error("FAIL smoke-p5-value: expected at least 3 action cards");
    process.exit(1);
  }
' >/tmp/pp-smoke-p5-vm.log 2>&1; then
  cat /tmp/pp-smoke-p5-vm.log
  exit 1
fi

echo "PASS smoke-p5-value: /parcours/parcours-p5 -> ${status}"
