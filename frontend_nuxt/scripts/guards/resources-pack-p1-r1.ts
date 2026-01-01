#!/usr/bin/env tsx
/**
 * Guard RES-PACK-P1-R1 — Pack P1 v1 publication report
 */

import { listResources } from '../../app/config/resources/registryV0';

const PACK_P1_SLUGS = [
  'reunion-30min-sans-noyade',
  'decision-log-minimal',
  'compte-rendu-utile-1page',
  'matrice-responsabilites-raci-lite',
  'charte-canaux-3-couleurs',
  'rituel-hebdo-15min',
  'tableau-bord-3-signaux',
  'inventaire-acces-30min',
  'mfa-partout-en-20min',
  'backups-test-15min',
];

const errors: string[] = [];
const resources = listResources();
const resourcesBySlug = new Map(resources.map((resource) => [resource.slug, resource]));
const publishedResources = resources.filter((resource) => resource.status === 'published');
const packSlugSet = new Set(PACK_P1_SLUGS);
const seenPackSlugs = new Set<string>();

PACK_P1_SLUGS.forEach((slug) => {
  if (seenPackSlugs.has(slug)) {
    errors.push(`❌ ${slug}: duplicate slug in pack list`);
  }
  seenPackSlugs.add(slug);
});

PACK_P1_SLUGS.forEach((slug) => {
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

const packPublishedCount = publishedResources.filter((resource) =>
  packSlugSet.has(resource.slug)
).length;

if (packPublishedCount !== 10) {
  errors.push(`❌ pack: published count ${packPublishedCount} !== 10`);
}

console.log('🔍 RES-PACK-P1-R1 Guard — Pack P1 v1 publication report\n');
if (errors.length) {
  console.log('❌ RES-PACK-P1-R1 FAILED:');
  errors.forEach((err) => console.log(err));
  process.exit(1);
}

console.log('✅ RES-PACK-P1-R1 PASSED (10/10)');
process.exit(0);
