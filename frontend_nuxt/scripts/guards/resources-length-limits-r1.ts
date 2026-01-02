#!/usr/bin/env tsx
/**
 * Guard RES-LENGTH-LIMITS-R1 - Resource length limits
 */

import { listResources } from '../../app/config/resources/registryV0';

const errors: string[] = [];
const resources = listResources();

const LIMITS = {
  title: 80,
  summary: 180,
  outcome: 120,
  blockTitle: 80,
  bullet: 180,
  bulletsPerBlock: 12,
};

function checkLength(slug: string, field: string, value: string, limit: number): void {
  const length = value.length;
  if (length > limit) {
    errors.push(`ERROR ${slug} ${field} length ${length} exceeds ${limit}`);
  }
}

resources.forEach((resource) => {
  checkLength(resource.slug, 'title', resource.title, LIMITS.title);
  checkLength(resource.slug, 'summary', resource.summary, LIMITS.summary);

  const outcome = typeof resource.outcome === 'string' ? resource.outcome.trim() : '';
  if (outcome) {
    checkLength(resource.slug, 'outcome', outcome, LIMITS.outcome);
  }

  const blocks = resource.contentBlocks ?? [];
  blocks.forEach((block, index) => {
    if (block.title) {
      checkLength(
        resource.slug,
        `contentBlocks[${index}].title`,
        block.title,
        LIMITS.blockTitle
      );
    }

    if (block.bullets.length > LIMITS.bulletsPerBlock) {
      errors.push(
        `ERROR ${resource.slug} contentBlocks[${index}].bullets count ${block.bullets.length} exceeds ${LIMITS.bulletsPerBlock}`
      );
    }

    block.bullets.forEach((bullet, bulletIndex) => {
      checkLength(
        resource.slug,
        `contentBlocks[${index}].bullets[${bulletIndex}]`,
        bullet,
        LIMITS.bullet
      );
    });
  });
});

console.log('RES-LENGTH-LIMITS-R1 Guard - Resource length limits\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\nGuard RES-LENGTH-LIMITS-R1 FAILED');
  process.exit(1);
}

console.log('Guard RES-LENGTH-LIMITS-R1 PASSED');
process.exit(0);
