import fs from 'node:fs';
import path from 'node:path';

// journey-unknown-slug-404-r1:guard
//
// OBJECTIF : Garantir que /parcours/[journeySlug] renvoie un 404
// si le manifest est introuvable (pas de fallback silencieux).

const ROOT = process.cwd();
const ENTRYPOINT_FILE = 'app/pages/parcours/[journeySlug].vue';

const MANIFEST_404_PATTERN = /getManifestBySlug\([^)]*\)[\s\S]*throw\s+createError\(\{[^}]*statusCode\s*:\s*404/;
const MANIFEST_VALIDATE_PATTERN = /validate\s*:\s*\([^)]*\)\s*=>\s*\{[\s\S]*getManifestBySlug\([^)]*\)/;

function readFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    return { path: relPath, content: null };
  }
  return { path: relPath, content: fs.readFileSync(abs, 'utf8') };
}

function checkManifest404(file) {
  if (!file.content) {
    return { ok: false, reason: 'missing entrypoint file' };
  }
  if (!MANIFEST_404_PATTERN.test(file.content) && !MANIFEST_VALIDATE_PATTERN.test(file.content)) {
    return { ok: false, reason: 'missing manifest-not-found 404 branch or validate guard' };
  }
  return { ok: true };
}

function main() {
  console.log('🔍 journey-unknown-slug-404:guard — Checking 404 for unknown journeys...\n');

  const result = checkManifest404(readFile(ENTRYPOINT_FILE));

  if (!result.ok) {
    console.log('❌ journey-unknown-slug-404:guard — FAIL\n');
    console.log(`   ❌ ${ENTRYPOINT_FILE}: ${result.reason}`);
    console.log('\n📌 Fix: Ensure missing manifests throw createError({ statusCode: 404 }).');
    process.exit(1);
  }

  console.log('✅ journey-unknown-slug-404:guard — OK');
  console.log('   └── Missing manifests throw 404');
  console.log('');
  process.exit(0);
}

main();
