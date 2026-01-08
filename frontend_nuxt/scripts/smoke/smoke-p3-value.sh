#!/usr/bin/env bash
# Usage: bash frontend_nuxt/scripts/smoke/smoke-p3-value.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

HOST=127.0.0.1
PORT=3015
BASE_URL="http://${HOST}:${PORT}"
TARGET_PATH="/parcours/parcours-p3"

cleanup() {
  if [[ -n "${PROD_PID:-}" ]]; then
    kill "$PROD_PID" >/dev/null 2>&1 || true
    wait "$PROD_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

NODE_ENV=production npm run build >/tmp/pp-smoke-p3-build.log 2>&1
NITRO_PORT="$PORT" node .output/server/index.mjs >/tmp/pp-smoke-p3-prod.log 2>&1 &
PROD_PID=$!

status="000"
for _ in {1..30}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${TARGET_PATH}" || true)
  if [[ "$status" != "000" ]]; then
    break
  fi
  sleep 1
done

if [[ "$status" != "200" ]]; then
  echo "❌ smoke-p3-value: expected 200 for ${TARGET_PATH}, got ${status}"
  exit 1
fi

TSX_CODE=$(cat <<'NODE'
import { p3BilanAdapter } from './app/adapters/bilan/p3';
import { recommendResourcesFromBilan } from './app/utils/resources/recommendResourcesFromBilan';
import { listResources } from './app/config/resources/registryV0';

const vm = p3BilanAdapter.buildViewModel();
const axes = vm.panorama?.axes ?? [];
if (axes.length !== 3) {
  throw new Error(`expected 3 axes, got ${axes.length}`);
}
axes.forEach((axis) => {
  if (typeof axis.label !== 'string' || axis.label.length < 2) {
    throw new Error('axis label missing');
  }
  if (typeof axis.score !== 'number' || axis.score < 0 || axis.score > 100) {
    throw new Error('axis score out of bounds');
  }
});

const completeness = vm.panorama?.completenessLabel ?? '';
const match = /Score global:\s*(\d{1,3})\/100/.exec(completeness);
if (!match) {
  throw new Error('global score missing');
}
const globalScore = Number(match[1]);
if (Number.isNaN(globalScore) || globalScore < 0 || globalScore > 100) {
  throw new Error('global score out of bounds');
}

const prioritiesCount = vm.sections?.risques?.itemsCount ?? 0;
if (prioritiesCount < 2) {
  throw new Error(`expected >=2 priorities, got ${prioritiesCount}`);
}

const actionCards = vm.modules?.resourcesActions?.recommended ?? [];
if (actionCards.length < 3 || actionCards.length > 5) {
  throw new Error(`expected 3-5 action cards, got ${actionCards.length}`);
}

const recommendations = recommendResourcesFromBilan({
  panorama: vm.panorama,
  sections: vm.sections,
  modules: vm.modules,
  journeyId: 'p3'
});
if (recommendations.length < 1) {
  throw new Error(`expected >=1 resource recommendation, got ${recommendations.length}`);
}

const resources = listResources();
const bySlug = new Map(resources.map((resource) => [resource.slug, resource]));
recommendations.forEach((reco) => {
  const resource = bySlug.get(reco.slug);
  if (!resource) throw new Error(`missing resource ${reco.slug}`);
  const journeys = resource.relatedJourneys ?? [];
  if (!journeys.includes('p3')) {
    throw new Error(`resource ${reco.slug} not tagged p3`);
  }
  if (resource.status !== 'published') {
    throw new Error(`resource ${reco.slug} not published`);
  }
});
NODE
)

npx tsx -e "$TSX_CODE"

echo "✅ smoke-p3-value: ${TARGET_PATH} -> OK"
