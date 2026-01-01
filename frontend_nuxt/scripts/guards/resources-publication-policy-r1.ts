#!/usr/bin/env tsx
/**
 * Guard RES-PUBLICATION-POLICY-R1 — Draft/Published policy
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { listResources } from '../../app/config/resources/registryV0';

const errors: string[] = [];
const resources = listResources();
const publishedResources = resources.filter((resource) => resource.status === 'published');

if (publishedResources.length < 5) {
  errors.push('❌ Registry V0 must include at least 5 published resources');
}

publishedResources.forEach((resource) => {
  const blocks = resource.contentBlocks ?? [];
  if (blocks.length === 0) {
    errors.push(`❌ Published resource missing contentBlocks: ${resource.slug}`);
    return;
  }
  const hasAction = blocks.some((block) => block.kind === 'action');
  if (blocks.length < 2 && !hasAction) {
    errors.push(`❌ Published resource lacks density: ${resource.slug}`);
  }
});

const DETAIL_PAGE = resolve(process.cwd(), 'app/pages/ressources/[slug].vue');
const detailContent = readFileSync(DETAIL_PAGE, 'utf8').toLowerCase();
const hasRobotsMeta = detailContent.includes('robots');
if (hasRobotsMeta) {
  if (!detailContent.includes('noindex') || !detailContent.includes('nofollow')) {
    errors.push('❌ Draft resources must set robots to noindex, nofollow');
  }
}

console.log('🔍 RES-PUBLICATION-POLICY-R1 Guard — Draft/Published policy\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-PUBLICATION-POLICY-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-PUBLICATION-POLICY-R1 PASSED');
process.exit(0);
