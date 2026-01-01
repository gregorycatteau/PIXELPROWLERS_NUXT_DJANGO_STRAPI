#!/usr/bin/env tsx
/**
 * Guard RES-RELATED-GRAPH-R1 — relatedResourceSlugs graph integrity
 */

import { listResources } from '../../app/config/resources/registryV0';

const errors: string[] = [];
const resources = listResources();
const slugSet = new Set(resources.map((resource) => resource.slug));
const graph = new Map<string, string[]>();

resources.forEach((resource) => {
  const related = resource.relatedResourceSlugs ?? [];
  if (related.length > 6) {
    errors.push(`❌ relatedResourceSlugs fan-out > 6 for ${resource.slug}`);
  }
  graph.set(resource.slug, related.filter((slug) => slugSet.has(slug)));
});

const visitState = new Map<string, 'visiting' | 'visited'>();
const stack: string[] = [];

function visit(slug: string): void {
  const state = visitState.get(slug);
  if (state === 'visiting') {
    const cycleStartIndex = stack.indexOf(slug);
    const cyclePath = [...stack.slice(cycleStartIndex), slug].join(' -> ');
    errors.push(`❌ relatedResourceSlugs cycle detected: ${cyclePath}`);
    return;
  }
  if (state === 'visited') return;

  visitState.set(slug, 'visiting');
  stack.push(slug);

  const next = graph.get(slug) ?? [];
  next.forEach((neighbor) => visit(neighbor));

  stack.pop();
  visitState.set(slug, 'visited');
}

resources.forEach((resource) => visit(resource.slug));

console.log('🔍 RES-RELATED-GRAPH-R1 Guard — related resources graph integrity\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-RELATED-GRAPH-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-RELATED-GRAPH-R1 PASSED');
process.exit(0);
