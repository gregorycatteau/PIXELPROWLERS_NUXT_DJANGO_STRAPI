#!/usr/bin/env tsx
/**
 * Guard RES-PACK-P1-R1 — Pack P1 v1 publication report
 */

import { listResources } from '../../app/config/resources/registryV0';
import { P1_PACK_V1_SLUGS } from '../../app/config/resources/packs/p1PackV1';

const errors: string[] = [];
const resources = listResources();
const resourcesBySlug = new Map(resources.map((resource) => [resource.slug, resource]));
const publishedResources = resources.filter((resource) => resource.status === 'published');
const packSlugSet = new Set(P1_PACK_V1_SLUGS);
const seenPackSlugs = new Set<string>();

P1_PACK_V1_SLUGS.forEach((slug) => {
  if (seenPackSlugs.has(slug)) {
    errors.push(`❌ ${slug}: duplicate slug in pack list`);
  }
  seenPackSlugs.add(slug);
});

P1_PACK_V1_SLUGS.forEach((slug) => {
  const resource = resourcesBySlug.get(slug);
  if (!resource) {
    errors.push(`❌ ${slug}: missing from registry`);
    return;
  }
  if (resource.status !== 'published') {
    errors.push(`❌ ${slug}: not published`);
  }
  const outcome = typeof resource.outcome === 'string' ? resource.outcome.trim() : '';
  if (outcome.length < 10) {
    errors.push(`❌ ${slug}: outcome too short`);
  }
  const blocks = resource.contentBlocks ?? [];
  if (blocks.length < 2) {
    errors.push(`❌ ${slug}: contentBlocks < 2`);
  }
  const hasAction = blocks.some((block) => block.kind === 'action');
  if (!hasAction) {
    errors.push(`❌ ${slug}: missing action contentBlock`);
  }
  if ((resource.relatedResourceSlugs ?? []).length > 3) {
    errors.push(`❌ ${slug}: relatedResourceSlugs > 3`);
  }
});

const extraPublishedCount = publishedResources.filter(
  (resource) => !packSlugSet.has(resource.slug)
).length;

console.log('🔍 RES-PACK-P1-R1 Guard — Pack P1 v1 publication report\n');
if (errors.length) {
  console.log('❌ RES-PACK-P1-R1 FAILED:');
  errors.forEach((err) => console.log(err));
  process.exit(1);
}

if (extraPublishedCount > 0) {
  console.log(`ℹ️ Extra published resources not in pack: ${extraPublishedCount}`);
}
console.log(`✅ RES-PACK-P1-R1 PASSED (${P1_PACK_V1_SLUGS.length}/${P1_PACK_V1_SLUGS.length})`);
process.exit(0);
