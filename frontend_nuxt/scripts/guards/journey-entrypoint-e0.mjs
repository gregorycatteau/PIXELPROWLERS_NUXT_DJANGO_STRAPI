import fs from 'node:fs';
import path from 'node:path';

// journey-entrypoint-e0:guard
//
// OBJECTIF : Garantir que chaque schema de parcours commence par E0_intro
// et que la page /parcours/ a un fallback explicite vers le premier step.

const ROOT = process.cwd();

const SCHEMA_FILES = [
  'app/config/journeys/p1JourneySchema.ts',
  'app/config/journeys/p2JourneySchema.ts',
  'app/config/journeys/p3JourneySchema.ts',
  'app/config/journeys/p4JourneySchema.ts',
];

const ENTRYPOINT_FILE = 'app/pages/parcours/[journeySlug].vue';
const STEP_REGEX = /steps\s*:\s*\[\s*\{\s*stepId\s*:\s*'([^']+)'/s;

function readFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    return { path: relPath, content: null };
  }
  return { path: relPath, content: fs.readFileSync(abs, 'utf8') };
}

function checkSchema(file) {
  if (!file.content) {
    return { file: file.path, ok: false, reason: 'missing file' };
  }
  const match = file.content.match(STEP_REGEX);
  if (!match) {
    return { file: file.path, ok: false, reason: 'no stepId found' };
  }
  const firstStep = match[1];
  if (firstStep !== 'E0_intro') {
    return { file: file.path, ok: false, reason: `first step is ${firstStep}` };
  }
  return { file: file.path, ok: true };
}

function checkEntrypoint(file) {
  if (!file.content) {
    return { ok: false, reason: 'missing entrypoint file' };
  }
  const hasDefaultStep = /defaultStepId/.test(file.content);
  const returnsDefault = /return\s+defaultStepId(?:\.value)?/s.test(file.content);
  if (!hasDefaultStep || !returnsDefault) {
    return { ok: false, reason: 'missing default step fallback' };
  }
  return { ok: true };
}

function main() {
  console.log('🔍 journey-entrypoint-e0:guard — Checking journey entrypoints...\n');

  const schemaResults = SCHEMA_FILES.map((rel) => checkSchema(readFile(rel)));
  const entrypointResult = checkEntrypoint(readFile(ENTRYPOINT_FILE));

  const schemaErrors = schemaResults.filter((res) => !res.ok);
  const hasEntryError = !entrypointResult.ok;

  if (schemaErrors.length || hasEntryError) {
    console.log('❌ journey-entrypoint-e0:guard — FAIL\n');
    schemaErrors.forEach((err) => {
      console.log(`   ❌ ${err.file}: ${err.reason}`);
    });
    if (hasEntryError) {
      console.log(`   ❌ ${ENTRYPOINT_FILE}: ${entrypointResult.reason}`);
    }
    console.log('\n📌 Fix: Ensure each journey schema starts with E0_intro');
    console.log('   and /parcours entrypoint defaults to the first step.');
    process.exit(1);
  }

  console.log('✅ journey-entrypoint-e0:guard — OK');
  console.log('   ├── All schemas start with E0_intro');
  console.log('   └── Entrypoint defaults to first step');
  console.log('');
  process.exit(0);
}

main();
