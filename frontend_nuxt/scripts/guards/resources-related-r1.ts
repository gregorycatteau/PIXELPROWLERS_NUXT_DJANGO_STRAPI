#!/usr/bin/env tsx
/**
 * Guard RES-RELATED-R1 — Related resources sanity
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { listResources } from '../../app/config/resources/registryV0';

const REGISTRY_FILE_REL = 'app/config/resources/registryV0.data.mjs';
const REGISTRY_FILE = resolve(process.cwd(), REGISTRY_FILE_REL);
const registryContent = readFileSync(REGISTRY_FILE, 'utf8');
const registryLines = registryContent.split(/\r?\n/);

const slugLineMap = new Map<string, { line: number; text: string }>();

registryLines.forEach((line, index) => {
  const match = line.match(/slug:\s*'([^']+)'/);
  if (match) {
    slugLineMap.set(match[1], { line: index + 1, text: line.trim() });
  }
});

const errors: string[] = [];

function findLineForValue(value: string | null, slug: string): { line: number; text: string } {
  if (value) {
    const lineIndex = registryLines.findIndex((line) => line.includes(value));
    if (lineIndex !== -1) {
      return { line: lineIndex + 1, text: registryLines[lineIndex].trim() };
    }
  }
  return slugLineMap.get(slug) ?? { line: 1, text: registryLines[0]?.trim() ?? '' };
}

function pushError(slug: string, field: string, message: string, value: string | null): void {
  const { line, text } = findLineForValue(value, slug);
  const context = text ? ` | ${text}` : '';
  errors.push(`❌ ${REGISTRY_FILE_REL}:${line} slug=${slug} field=${field} ${message}${context}`);
}

const resources = listResources();
const bySlug = new Map(resources.map((resource) => [resource.slug, resource]));
const slugSet = new Set(bySlug.keys());
const graph = new Map<string, string[]>();

resources.forEach((resource) => {
  const related = resource.relatedResourceSlugs ?? [];

  if (related.length > 6) {
    pushError(
      resource.slug,
      'relatedResourceSlugs',
      `fan-out ${related.length} exceeds 6`,
      null
    );
  }

  related.forEach((relatedSlug) => {
    if (!slugSet.has(relatedSlug)) {
      pushError(
        resource.slug,
        'relatedResourceSlugs',
        `unknown related slug ${relatedSlug}`,
        relatedSlug
      );
      return;
    }
    const target = bySlug.get(relatedSlug);
    if (target && target.status === 'draft') {
      pushError(
        resource.slug,
        'relatedResourceSlugs',
        `references draft resource ${relatedSlug}`,
        relatedSlug
      );
    }
  });

  graph.set(resource.slug, related.filter((slug) => slugSet.has(slug)));
});

const visitState = new Map<string, 'visiting' | 'visited'>();
const stack: string[] = [];

function visit(slug: string): void {
  const state = visitState.get(slug);
  if (state === 'visiting') {
    const cycleStartIndex = stack.indexOf(slug);
    const cyclePath = [...stack.slice(cycleStartIndex), slug].join(' -> ');
    pushError(slug, 'relatedResourceSlugs', `cycle detected: ${cyclePath}`, null);
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

console.log('🔍 RES-RELATED-R1 Guard — Related resources sanity\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-RELATED-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-RELATED-R1 PASSED');
process.exit(0);
