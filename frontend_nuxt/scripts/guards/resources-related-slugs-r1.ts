#!/usr/bin/env tsx
/**
 * Guard RES-RELATED-SLUGS-R1 — relatedResourceSlugs integrity
 */

import { listResources } from '../../app/config/resources/registryV0';

const errors: string[] = [];
const resources = listResources();
const slugSet = new Set(resources.map((resource) => resource.slug));

let hasRelated = false;

resources.forEach((resource) => {
  const related = resource.relatedResourceSlugs ?? [];
  if (related.length > 0) {
    hasRelated = true;
  }
  const seen = new Set<string>();
  related.forEach((slug) => {
    if (typeof slug !== 'string') {
      errors.push(`❌ relatedResourceSlugs contains non-string slug in ${resource.slug}`);
      return;
    }
    if (!slugSet.has(slug)) {
      errors.push(`❌ relatedResourceSlugs contains unknown slug ${slug} in ${resource.slug}`);
    }
    if (slug === resource.slug) {
      errors.push(`❌ relatedResourceSlugs self-reference in ${resource.slug}`);
    }
    if (seen.has(slug)) {
      errors.push(`❌ relatedResourceSlugs duplicate ${slug} in ${resource.slug}`);
    }
    seen.add(slug);
  });
});

if (!hasRelated) {
  errors.push('❌ Registry V0 must include at least one relatedResourceSlugs entry');
}

console.log('🔍 RES-RELATED-SLUGS-R1 Guard — related resources integrity\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-RELATED-SLUGS-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-RELATED-SLUGS-R1 PASSED');
process.exit(0);
