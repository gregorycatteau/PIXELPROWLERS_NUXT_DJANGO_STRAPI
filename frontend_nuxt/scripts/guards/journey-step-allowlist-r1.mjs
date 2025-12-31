import fs from 'node:fs';
import path from 'node:path';

// journey-step-allowlist-r1:guard
//
// OBJECTIF : garantir un allowlist schema-only + fallback neutre pour ?step.

const ROOT = process.cwd();
const ENTRYPOINT_FILE = 'app/pages/parcours/[journeySlug].vue';
const SHELL_FILE = 'app/components/journey/PPJourneyStepShell.vue';

const REQUIRED_PATTERNS = {
  parseStepParam: /parseStepParam/, 
  allowedSet: /allowedSet/, 
  fallback: /entrypointStepId|stepIds\.value\[0\]|allowedSteps\.value\[0\]/
};

function readFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    return { path: relPath, content: null };
  }
  return { path: relPath, content: fs.readFileSync(abs, 'utf8') };
}

function checkFile(file, label) {
  if (!file.content) {
    return { ok: false, reason: 'missing file' };
  }
  const missing = [];
  for (const [name, pattern] of Object.entries(REQUIRED_PATTERNS)) {
    if (!pattern.test(file.content)) {
      missing.push(name);
    }
  }
  if (missing.length) {
    return { ok: false, reason: `${label} missing: ${missing.join(', ')}` };
  }
  return { ok: true };
}

function main() {
  console.log('🔍 journey-step-allowlist-r1:guard — Checking step allowlist + fallback...\n');

  const entrypoint = checkFile(readFile(ENTRYPOINT_FILE), 'entrypoint');
  const shell = checkFile(readFile(SHELL_FILE), 'step shell');

  const errors = [
    entrypoint.ok ? null : `❌ ${ENTRYPOINT_FILE}: ${entrypoint.reason}`,
    shell.ok ? null : `❌ ${SHELL_FILE}: ${shell.reason}`
  ].filter(Boolean);

  if (errors.length) {
    console.log('❌ journey-step-allowlist-r1:guard — FAIL\n');
    errors.forEach((line) => console.log(`   ${line}`));
    console.log('\n📌 Fix: Ensure parseStepParam + allowlist + fallback to entrypoint.');
    process.exit(1);
  }

  console.log('✅ journey-step-allowlist-r1:guard — OK');
  console.log('   ├── Entrypoint enforces allowlist + fallback');
  console.log('   └── Step shell enforces allowlist + fallback');
  console.log('');
}

main();
