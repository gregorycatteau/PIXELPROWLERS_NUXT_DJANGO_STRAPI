import fs from 'node:fs';
import path from 'node:path';
import { RESOURCE_REGISTRY_V0 } from '../../app/config/resources/registryV0.data.mjs';

// resources-filter-by-journey-r1:guard
//
// OBJECTIF : S'assurer que StepResourcesE3 et les recommandations filtrent par journey.

const ROOT = process.cwd();
const STEP_FILE = 'app/components/journey/steps/StepResourcesE3.vue';
const RECO_FILE = 'app/utils/resources/recommendResourcesFromBilan.ts';

const readFile = (relPath) => {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return { path: relPath, content: null };
  return { path: relPath, content: fs.readFileSync(abs, 'utf8') };
};

function main() {
  console.log('🔍 resources-filter-by-journey-r1:guard — Checking journey filter...\n');

  const step = readFile(STEP_FILE);
  const reco = readFile(RECO_FILE);
  const errors = [];

  if (!step.content) {
    errors.push(`Missing file: ${STEP_FILE}`);
  } else {
    if (!/relatedJourneys/.test(step.content) || !/manifest\.id/.test(step.content)) {
      errors.push('StepResourcesE3 must filter resources by relatedJourneys + manifest.id');
    }
  }

  if (!reco.content) {
    errors.push(`Missing file: ${RECO_FILE}`);
  } else {
    if (!/journeyId/.test(reco.content) || !/relatedJourneys/.test(reco.content)) {
      errors.push('recommendResourcesFromBilan must filter by journeyId + relatedJourneys');
    }
  }

  const published = RESOURCE_REGISTRY_V0.filter((resource) => resource.status === 'published');
  published.forEach((resource) => {
    if (!Array.isArray(resource.relatedJourneys) || resource.relatedJourneys.length === 0) {
      errors.push(`Published resource missing relatedJourneys: ${resource.slug}`);
    }
  });

  if (errors.length) {
    console.log('❌ resources-filter-by-journey-r1:guard — FAIL\n');
    errors.forEach((err) => console.log(`   ❌ ${err}`));
    process.exit(1);
  }

  console.log('✅ resources-filter-by-journey-r1:guard — OK');
  console.log('');
}

main();
