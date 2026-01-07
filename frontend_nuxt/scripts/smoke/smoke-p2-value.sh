#!/usr/bin/env bash
# Usage: bash frontend_nuxt/scripts/smoke/smoke-p2-value.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

HOST=127.0.0.1
PORT=3014
BASE_URL="http://${HOST}:${PORT}"
BILAN_PATH="/parcours/parcours-p2?step=E2_bilan"
RESOURCES_PATH="/parcours/parcours-p2?step=E3_resources"

cleanup() {
  if [[ -n "${PROD_PID:-}" ]]; then
    kill "$PROD_PID" >/dev/null 2>&1 || true
    wait "$PROD_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

NODE_ENV=production npm run build >/tmp/pp-smoke-p2-build.log 2>&1
NITRO_PORT="$PORT" node .output/server/index.mjs >/tmp/pp-smoke-p2-prod.log 2>&1 &
PROD_PID=$!

status="000"
for _ in {1..30}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/" || true)
  if [[ "$status" != "000" ]]; then
    break
  fi
  sleep 1
done

status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${BILAN_PATH}" || true)
if [[ "$status" != "200" ]]; then
  echo "❌ smoke-p2-value: expected 200 for ${BILAN_PATH}, got ${status}"
  exit 1
fi

status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${RESOURCES_PATH}" || true)
if [[ "$status" != "200" ]]; then
  echo "❌ smoke-p2-value: expected 200 for ${RESOURCES_PATH}, got ${status}"
  exit 1
fi

TSX_CODE=$(cat <<'NODE'
import { p2BilanAdapter } from './app/adapters/bilan/p2';
import { recommendResourcesFromBilan } from './app/utils/resources/recommendResourcesFromBilan';
import { listResources } from './app/config/resources/registryV0';

const vm = p2BilanAdapter.buildViewModel();
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

const resourcesActions = vm.modules?.resourcesActions;
if (!resourcesActions || resourcesActions.recommended.length !== 3) {
  throw new Error('expected 3 action cards');
}

const recommendations = recommendResourcesFromBilan({
  panorama: vm.panorama,
  sections: vm.sections,
  modules: vm.modules,
  journeyId: 'p2'
});
if (recommendations.length < 3) {
  throw new Error(`expected >=3 resource recommendations, got ${recommendations.length}`);
}

const resources = listResources();
const bySlug = new Map(resources.map((resource) => [resource.slug, resource]));
recommendations.forEach((reco) => {
  const resource = bySlug.get(reco.slug);
  if (!resource) throw new Error(`missing resource ${reco.slug}`);
  const journeys = resource.relatedJourneys ?? [];
  if (!journeys.includes('p2')) {
    throw new Error(`resource ${reco.slug} not tagged p2`);
  }
  if (resource.status !== 'published') {
    throw new Error(`resource ${reco.slug} not published`);
  }
});
NODE
)

npx tsx -e "$TSX_CODE"

echo "✅ smoke-p2-value: ${BILAN_PATH} + ${RESOURCES_PATH} -> OK"
