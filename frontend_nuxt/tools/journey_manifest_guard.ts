import fs from 'node:fs';
import path from 'node:path';
import { listManifests } from '../app/config/journeys/manifests/registry';
import type { JourneyManifestV1, JourneyManifestModules, JourneyManifestPointers, JourneyManifestAdapters } from '../app/config/journeys/manifests/types';

const forbiddenPatterns = [
  /answersByQuestionId/i,
  /questionId/i,
  /answers/i,
  /responses/i,
  /^p[0-9]+_q/i,
  /journeyAnswers/i,
  /raw/i
];

const allowedRootKeys = new Set(['id', 'slug', 'engine', 'maturity', 'axes', 'modules', 'pointers', 'adapters', 'storage']);
const allowedEngineValues = new Set(['legacy', 'universal']);
const allowedModulesKeys = new Set([
  'panorama',
  'blocks',
  'issues',
  'hypotheses',
  'landing',
  'actions',
  'resources',
  'engagement',
  'export'
]);
const allowedPointersKeys = new Set(['questions', 'copy', 'resources', 'actions']);
const allowedAdaptersKeys = new Set(['globalBilanAdapterId']);
const allowedStorageKeys = new Set(['schemaVersion', 'scoresKey', 'metaKey', 'ttlPolicy']);
const allowedAxisKeys = new Set(['axisId', 'label', 'description', 'renderHint']);

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isVersionedKey = (value: string) => /v\d/i.test(value);
const skipDisablePatterns = [
  /allowSkip\s*:\s*false/,
  /:allowSkip\s*=\s*["']false["']/,
  /allowSkip\s*=\s*["']false["']/,
  /allowSkip/
];

const assertValidRootKeys = (manifest: Record<string, unknown>) => {
  for (const key of Object.keys(manifest)) {
    if (!allowedRootKeys.has(key)) {
      throw new Error('Journey manifest guard failed.');
    }
  }
};

const assertValidModules = (modules: JourneyManifestModules) => {
  for (const [key, value] of Object.entries(modules)) {
    if (!allowedModulesKeys.has(key) || typeof value !== 'boolean') {
      throw new Error('Journey manifest guard failed.');
    }
  }
};

const assertValidPointers = (pointers: JourneyManifestPointers) => {
  for (const [key, value] of Object.entries(pointers)) {
    if (!allowedPointersKeys.has(key) || !isNonEmptyString(value)) {
      throw new Error('Journey manifest guard failed.');
    }
  }
};

const assertValidAdapters = (adapters: JourneyManifestAdapters) => {
  for (const [key, value] of Object.entries(adapters)) {
    if (!allowedAdaptersKeys.has(key) || !isNonEmptyString(value)) {
      throw new Error('Journey manifest guard failed.');
    }
  }
};

const assertValidAxes = (axes: JourneyManifestV1['axes']) => {
  if (!axes) return;
  for (const axis of axes) {
    for (const key of Object.keys(axis)) {
      if (!allowedAxisKeys.has(key)) {
        throw new Error('Journey manifest guard failed.');
      }
    }
    if (!isNonEmptyString(axis.axisId) || !isNonEmptyString(axis.label)) {
      throw new Error('Journey manifest guard failed.');
    }
  }
};

const assertValidStorage = (storage: JourneyManifestV1['storage']) => {
  for (const key of Object.keys(storage)) {
    if (!allowedStorageKeys.has(key)) {
      throw new Error('Journey manifest guard failed.');
    }
  }
  if (!isNonEmptyString(storage.schemaVersion) || !isVersionedKey(storage.schemaVersion)) {
    throw new Error('Journey manifest guard failed.');
  }
  if (!isNonEmptyString(storage.scoresKey) || !isVersionedKey(storage.scoresKey)) {
    throw new Error('Journey manifest guard failed.');
  }
  if (!isNonEmptyString(storage.metaKey) || !isVersionedKey(storage.metaKey)) {
    throw new Error('Journey manifest guard failed.');
  }
  if (storage.ttlPolicy !== 'unchanged') {
    throw new Error('Journey manifest guard failed.');
  }
};

const scanForbiddenPatterns = (node: unknown) => {
  if (node === null || node === undefined) return;
  if (Array.isArray(node)) {
    node.forEach((child) => scanForbiddenPatterns(child));
    return;
  }
  if (typeof node === 'object') {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (forbiddenPatterns.some((re) => re.test(key))) {
        throw new Error('Journey manifest guard failed.');
      }
      scanForbiddenPatterns(value);
    }
    return;
  }
  if (typeof node === 'string' && forbiddenPatterns.some((re) => re.test(node))) {
    throw new Error('Journey manifest guard failed.');
  }
};

const collectFiles = (dir: string, files: string[] = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
};

const assertSkipAlwaysOn = () => {
  const appDir = path.join(process.cwd(), 'app');
  const files = collectFiles(appDir);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (skipDisablePatterns.some((re) => re.test(content))) {
      throw new Error('Journey manifest guard failed.');
    }
  }
};

const assertManifestShape = (manifest: JourneyManifestV1) => {
  const raw = manifest as unknown as Record<string, unknown>;
  assertValidRootKeys(raw);

  if (!isNonEmptyString(manifest.id)) throw new Error('Journey manifest guard failed.');
  if (!isNonEmptyString(manifest.slug)) throw new Error('Journey manifest guard failed.');
  if (!manifest.maturity) throw new Error('Journey manifest guard failed.');
  if (manifest.engine && !allowedEngineValues.has(manifest.engine)) {
    throw new Error('Journey manifest guard failed.');
  }

  assertValidModules(manifest.modules);
  assertValidAxes(manifest.axes);
  assertValidPointers(manifest.pointers);
  assertValidAdapters(manifest.adapters);
  assertValidStorage(manifest.storage);

  scanForbiddenPatterns(manifest);
};

async function main() {
  try {
    const manifests = listManifests();
    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const manifest of manifests) {
      if (ids.has(manifest.id) || slugs.has(manifest.slug)) {
        throw new Error('Journey manifest guard failed.');
      }
      ids.add(manifest.id);
      slugs.add(manifest.slug);
      assertManifestShape(manifest);
    }
    assertSkipAlwaysOn();

    console.log('Journey manifest guard OK');
  } catch {
    console.error('Journey manifest guard failed.');
    process.exit(1);
  }
}

main();
