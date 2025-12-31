import fs from 'node:fs';
import path from 'node:path';

// journey-manifest-registry-completeness-r1:guard
//
// OBJECTIF : vérifier que chaque *Manifest importé est présent dans registry[].

const ROOT = process.cwd();
const REGISTRY_FILE = 'app/config/journeys/manifests/registry.ts';

const stripComments = (content) => {
  const withoutBlock = content.replace(/\/\*[\s\S]*?\*\//g, '');
  return withoutBlock.replace(/(^|[^:])\/\/.*$/gm, '$1');
};

const extractImportedManifests = (content) => {
  const imports = [];
  const importRegex = /import\s+\{\s*([^}]+)\}\s+from\s+['"][^'"]+['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const full = match[0];
    if (/^\s*import\s+type\s+\{/.test(full)) {
      continue;
    }
    const names = match[1]
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);
    names.forEach((name) => {
      const base = name.split(/\n/)[0].trim();
      const cleaned = base.replace(/\s+as\s+.+$/i, '').trim();
      if (/Manifest$/.test(cleaned)) {
        imports.push(cleaned);
      }
    });
  }
  return imports;
};

const extractRegistryManifests = (content) => {
  const registryRegex = /const\s+registry\s*:[^=]*=\s*\[([\s\S]*?)\]/m;
  const match = content.match(registryRegex);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((item) => item.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((item) => item.replace(/\s+as\s+.+$/i, '').trim());
};

function main() {
  console.log('🔍 journey-manifest-registry-completeness:guard — Checking registry completeness...\n');

  const abs = path.join(ROOT, REGISTRY_FILE);
  if (!fs.existsSync(abs)) {
    console.log('❌ journey-manifest-registry-completeness:guard — FAIL\n');
    console.log(`   ❌ Missing file: ${REGISTRY_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(abs, 'utf8');
  const content = stripComments(raw);
  const imported = extractImportedManifests(content);
  const registry = extractRegistryManifests(content);

  const missing = imported.filter((name) => !registry.includes(name));

  if (missing.length) {
    console.log('❌ journey-manifest-registry-completeness:guard — FAIL\n');
    console.log('   Missing manifests in registry[]:');
    missing.forEach((name) => console.log(`   - ${name}`));
    process.exit(1);
  }

  console.log('✅ journey-manifest-registry-completeness:guard — OK');
  console.log(`   └── ${imported.length} manifest(s) verified`);
  console.log('');
}

main();
