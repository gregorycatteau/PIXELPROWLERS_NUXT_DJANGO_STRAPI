#!/usr/bin/env tsx
/**
 * Guard RES-LINT-R1 — Resources text lint
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
const forbiddenSchemes = [
  'javascript:',
  'data:',
  'file:',
  'blob:',
  'mailto:',
  'tel:',
  'ws:',
  'wss:',
];
const zeroWidthChars = new Set(['\u200B', '\u200C', '\u200D', '\u200E', '\u200F', '\u2060', '\uFEFF']);
const allowedControlChars = new Set([0x09, 0x0a, 0x0d]);

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

function findZeroWidth(value: string): string | null {
  for (const char of value) {
    if (zeroWidthChars.has(char)) return char;
  }
  return null;
}

function findControlChar(value: string): number | null {
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (allowedControlChars.has(code)) continue;
    if (code <= 0x1f || code === 0x7f) return code;
  }
  return null;
}

function checkLength(value: string, max: number, slug: string, field: string): void {
  if (value.length > max) {
    pushError(slug, field, `length ${value.length} exceeds ${max}`, value);
  }
}

function checkString(value: string, slug: string, field: string): void {
  if (value.includes('<')) {
    pushError(slug, field, 'contains "<"', value);
  }
  if (value.includes('>')) {
    pushError(slug, field, 'contains ">"', value);
  }
  if (value.includes('//')) {
    pushError(slug, field, 'contains protocol-relative "//"', value);
  }

  const lowered = value.toLowerCase();
  forbiddenSchemes.forEach((scheme) => {
    if (lowered.includes(scheme)) {
      pushError(slug, field, `contains scheme "${scheme}"`, value);
    }
  });

  const zeroWidth = findZeroWidth(value);
  if (zeroWidth) {
    const code = zeroWidth.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
    pushError(slug, field, `contains zero-width U+${code}`, value);
  }

  const controlChar = findControlChar(value);
  if (controlChar !== null) {
    const code = controlChar.toString(16).toUpperCase().padStart(4, '0');
    pushError(slug, field, `contains control U+${code}`, value);
  }
}

const resources = listResources();

resources.forEach((resource) => {
  checkString(resource.title, resource.slug, 'title');
  checkLength(resource.title, 80, resource.slug, 'title');

  checkString(resource.summary, resource.slug, 'summary');

  if (typeof resource.outcome === 'string') {
    checkString(resource.outcome, resource.slug, 'outcome');
    checkLength(resource.outcome, 160, resource.slug, 'outcome');
  }

  const blocks = resource.contentBlocks ?? [];
  blocks.forEach((block, index) => {
    const blockField = `contentBlocks[${index}].title`;
    checkString(block.title, resource.slug, blockField);
    checkLength(block.title, 2000, resource.slug, blockField);

    block.bullets.forEach((bullet, bulletIndex) => {
      const bulletField = `contentBlocks[${index}].bullets[${bulletIndex}]`;
      checkString(bullet, resource.slug, bulletField);
      checkLength(bullet, 2000, resource.slug, bulletField);
    });
  });
});

console.log('🔍 RES-LINT-R1 Guard — Resources text lint\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-LINT-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-LINT-R1 PASSED');
process.exit(0);
