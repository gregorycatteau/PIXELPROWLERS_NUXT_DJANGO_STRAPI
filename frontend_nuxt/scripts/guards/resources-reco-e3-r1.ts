#!/usr/bin/env tsx
/**
 * Guard RES-RECO-E3-R1 — StepResourcesE3 recommendation contract
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { listResources } from '../../app/config/resources/registryV0';
import { createEmptyUniversalBilanViewModel } from '../../app/types/bilan';
import { recommendResourcesFromBilan } from '../../app/utils/resources/recommendResourcesFromBilan';

const TARGET_FILE = resolve(process.cwd(), 'app/utils/resources/recommendResourcesFromBilan.ts');

const FORBIDDEN_IMPORTS = [
  'useRoute',
  'useRouter',
  '$fetch',
  'fetch(',
  'useAsyncData',
  'useLazyAsyncData',
  'useFetch',
  'Math.random',
  'Date(',
  'Date.now',
  'new Date',
  'performance.now',
  'crypto'
];

const FORBIDDEN_KEYS = [
  'rawAnswers',
  'answersBy',
  'perQuestion'
];

const errors: string[] = [];

const content = readFileSync(TARGET_FILE, 'utf8');

FORBIDDEN_IMPORTS.forEach((pattern) => {
  if (content.includes(pattern)) {
    errors.push(`❌ Forbidden pattern found: ${pattern}`);
  }
});

FORBIDDEN_KEYS.forEach((pattern) => {
  if (content.includes(pattern)) {
    errors.push(`❌ Forbidden key reference found: ${pattern}`);
  }
});

const resourceSlugs = new Set(listResources().map((resource) => resource.slug));
const emptyVm = createEmptyUniversalBilanViewModel();

const recommendations = recommendResourcesFromBilan({
  panorama: emptyVm.panorama,
  sections: emptyVm.sections,
  modules: emptyVm.modules,
});

if (recommendations.length < 2 || recommendations.length > 3) {
  errors.push('❌ Recommendations must return between 2 and 3 items');
}

const seen = new Set<string>();
recommendations.forEach((item) => {
  if (!item.slug || !resourceSlugs.has(item.slug)) {
    errors.push(`❌ Unknown slug in recommendations: ${item.slug}`);
  }
  if (seen.has(item.slug)) {
    errors.push(`❌ Duplicate slug in recommendations: ${item.slug}`);
  }
  seen.add(item.slug);
  if (!item.reason || item.reason.trim().length === 0) {
    errors.push(`❌ Missing reason for slug: ${item.slug}`);
  }
});

const deterministicVm = createEmptyUniversalBilanViewModel({
  panorama: {
    axes: [
      { id: 'b_xxx', label: 'communication', score: 5 },
      { id: 'a_xxx', label: 'SEO', score: 5 }
    ]
  }
});

const deterministicRecommendations = recommendResourcesFromBilan({
  panorama: deterministicVm.panorama,
  sections: deterministicVm.sections,
  modules: deterministicVm.modules,
});

const expectedDeterministicOrder = [
  'mini-plan-seo-local',
  'audit-communication-flux'
];

const deterministicOrder = deterministicRecommendations.map((item) => item.slug);
const deterministicMatches = expectedDeterministicOrder.every(
  (slug, index) => deterministicOrder[index] === slug
);

if (!deterministicMatches) {
  errors.push(
    `❌ Deterministic ordering failed: expected ${expectedDeterministicOrder.join(
      ', '
    )}, got ${deterministicOrder.join(', ')}`
  );
}

console.log('🔍 RES-RECO-E3-R1 Guard — StepResourcesE3 recommendations\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-RECO-E3-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-RECO-E3-R1 PASSED');
process.exit(0);
