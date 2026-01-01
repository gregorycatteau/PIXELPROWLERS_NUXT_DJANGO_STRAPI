#!/usr/bin/env tsx
/**
 * Guard RES-PUBLISHED-R1 — Published resources completeness
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

resources
  .filter((resource) => resource.status === 'published')
  .forEach((resource) => {
    const outcome = typeof resource.outcome === 'string' ? resource.outcome.trim() : '';
    if (!outcome) {
      pushError(resource.slug, 'outcome', 'missing for published resource', null);
    } else if (outcome.length > 160) {
      pushError(
        resource.slug,
        'outcome',
        `length ${outcome.length} exceeds 160`,
        outcome
      );
    }

    const blocks = resource.contentBlocks ?? [];
    if (blocks.length < 2) {
      pushError(
        resource.slug,
        'contentBlocks',
        `requires at least 2 contentBlocks (found ${blocks.length})`,
        null
      );
    }

    const hasAction = blocks.some((block) => block.kind === 'action');
    if (!hasAction) {
      pushError(resource.slug, 'contentBlocks.kind', 'missing action block', null);
    }

    const related = resource.relatedResourceSlugs ?? [];
    if (related.length > 3) {
      pushError(
        resource.slug,
        'relatedResourceSlugs',
        `exceeds 3 related items (found ${related.length})`,
        null
      );
    }
  });

console.log('🔍 RES-PUBLISHED-R1 Guard — Published resources completeness\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-PUBLISHED-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-PUBLISHED-R1 PASSED');
process.exit(0);
