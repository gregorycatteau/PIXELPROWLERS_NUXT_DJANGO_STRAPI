#!/usr/bin/env tsx
/**
 * Guard RES-DETAIL-SLUG-R1 — Resources detail slug contract
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { listResources } from '../../app/config/resources/registryV0';
import { normalizeResourceSlug } from '../../app/utils/resources/normalizeResourceSlug';

const TARGET_FILE = resolve(process.cwd(), 'app/pages/ressources/[slug].vue');

const errors: string[] = [];

const content = readFileSync(TARGET_FILE, 'utf8');
if (!content.includes('definePageMeta')) {
  errors.push('❌ definePageMeta is missing from resources detail page');
}
if (!content.includes('validate:')) {
  errors.push('❌ validate is missing from resources detail page meta');
}
if (!content.includes('normalizeResourceSlug')) {
  errors.push('❌ normalizeResourceSlug is missing from resources detail page');
}

if (normalizeResourceSlug('rgpd-accessibilite-starter') !== 'rgpd-accessibilite-starter') {
  errors.push('❌ normalizeResourceSlug should accept rgpd-accessibilite-starter');
}

if (normalizeResourceSlug('___nope___') !== null) {
  errors.push('❌ normalizeResourceSlug should reject underscores');
}

if (normalizeResourceSlug('../etc/passwd') !== null) {
  errors.push('❌ normalizeResourceSlug should reject traversal patterns');
}

if (normalizeResourceSlug('a'.repeat(500)) !== null) {
  errors.push('❌ normalizeResourceSlug should reject overly long slugs');
}

if (!listResources().some((resource) => resource.slug === 'rgpd-accessibilite-starter')) {
  errors.push('❌ Registry V0 must include rgpd-accessibilite-starter');
}

console.log('🔍 RES-DETAIL-SLUG-R1 Guard — Resources detail slug contract\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-DETAIL-SLUG-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-DETAIL-SLUG-R1 PASSED');
process.exit(0);
