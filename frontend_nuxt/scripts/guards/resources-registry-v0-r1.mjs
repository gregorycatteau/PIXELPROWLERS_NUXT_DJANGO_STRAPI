#!/usr/bin/env node
/**
 * Guard RES-V0-R1 — Resources Registry V0
 *
 * Verifie :
 * - slugs uniques
 * - slugs ASCII kebab-case
 * - categories allowlist
 * - aucune URL externe (http/https)
 */

import { RESOURCE_REGISTRY_V0 } from '../../app/config/resources/registryV0.data.mjs';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CATEGORY_ALLOWLIST = new Set([
  'diagnostic',
  'securite',
  'ux',
  'gouvernance',
  'outillage',
]);

const errors = [];
const slugs = new Set();

const containsExternalUrl = (value) =>
  typeof value === 'string' && (value.includes('http://') || value.includes('https://'));

const scanObjectForUrls = (resource) => {
  const entries = Object.entries(resource ?? {});
  for (const [key, value] of entries) {
    if (containsExternalUrl(value)) {
      return `${key}`;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (containsExternalUrl(item)) {
          return `${key}[]`;
        }
      }
    }
  }
  return null;
};

RESOURCE_REGISTRY_V0.forEach((resource, index) => {
  const context = `index ${index}`;
  const slug = resource?.slug;
  const category = resource?.category;

  if (!slug || typeof slug !== 'string') {
    errors.push(`❌ ${context}: slug manquant ou invalide`);
  } else {
    if (!SLUG_PATTERN.test(slug)) {
      errors.push(`❌ ${context}: slug invalide (kebab ASCII requis) — ${slug}`);
    }
    if (slugs.has(slug)) {
      errors.push(`❌ ${context}: slug duplique — ${slug}`);
    }
    slugs.add(slug);
  }

  if (!CATEGORY_ALLOWLIST.has(category)) {
    errors.push(`❌ ${context}: category invalide — ${category}`);
  }

  const urlField = scanObjectForUrls(resource);
  if (urlField) {
    errors.push(`❌ ${context}: URL externe detectee dans ${urlField}`);
  }
});

console.log('🔍 RES-V0-R1 Guard — Registry V0\n');

if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-V0-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-V0-R1 PASSED');
process.exit(0);
