#!/usr/bin/env tsx
/**
 * Guard RES-CONTENT-SAFETY-R1 — Resource content safety
 */

import { listResources } from '../../app/config/resources/registryV0';

const errors: string[] = [];
const resources = listResources();
const slugPattern = /^[a-z0-9-]+$/;
const forbiddenTokens = [
  '<',
  '>',
  'javascript:',
  'data:',
  'onerror',
  'onload',
  'src=',
  'href=',
];

function checkValue(value: string, context: string): void {
  const lowered = value.toLowerCase();
  for (const token of forbiddenTokens) {
    if (token === '<' || token === '>') {
      if (value.includes(token)) {
        errors.push(`❌ Forbidden token "${token}" in ${context}`);
      }
      continue;
    }
    if (lowered.includes(token)) {
      errors.push(`❌ Forbidden token "${token}" in ${context}`);
    }
  }
}

resources.forEach((resource) => {
  if (!slugPattern.test(resource.slug)) {
    errors.push(`❌ Invalid slug format: ${resource.slug}`);
  }

  checkValue(resource.title, `title ${resource.slug}`);
  checkValue(resource.summary, `summary ${resource.slug}`);

  const blocks = resource.contentBlocks ?? [];
  blocks.forEach((block, index) => {
    checkValue(block.title, `contentBlocks[${index}].title ${resource.slug}`);
    block.bullets.forEach((bullet, bulletIndex) => {
      checkValue(bullet, `contentBlocks[${index}].bullets[${bulletIndex}] ${resource.slug}`);
    });
  });
});

console.log('🔍 RES-CONTENT-SAFETY-R1 Guard — Resource content safety\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-CONTENT-SAFETY-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-CONTENT-SAFETY-R1 PASSED');
process.exit(0);
