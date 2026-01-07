import fs from 'node:fs';
import path from 'node:path';

// journey-schema-integrity-r1:guard
//
// OBJECTIF : verifier l'integrite minimaliste des journeys (manifests + schemas + renderer).

const ROOT = process.cwd();
const MANIFEST_REGISTRY_FILE = 'app/config/journeys/manifests/registry.ts';
const SCHEMA_REGISTRY_FILE = 'app/config/journeys/schemaRegistry.ts';
const RENDERER_FILE = 'app/components/journey/JourneyStepRenderer.vue';
const JOURNEY_DIR = 'app/config/journeys';

const STEP_ID_PATTERN = /^E[0-9]*_[a-z0-9_]+$/;
const STEP_ID_BLOCK_PATTERN = /^B[0-9]+_(questions|bilan)$/;

const readFile = (relPath) => {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return { path: relPath, content: null };
  return { path: relPath, content: fs.readFileSync(abs, 'utf8') };
};

const extractRegistryImports = (content) => {
  const imports = [];
  const regex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"](\.[^'"]+)['"];?/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const names = match[1].split(',').map((n) => n.trim()).filter(Boolean);
    const modulePath = match[2];
    names.forEach((name) => {
      if (name.endsWith('Manifest')) {
        const file = modulePath.replace('./', 'app/config/journeys/manifests/') + '.ts';
        imports.push({ name, file });
      }
    });
  }
  return imports;
};

const extractSchemaRegistryKeys = (content) => {
  const match = content.match(/const\s+schemaRegistry\s*:[^=]*=\s*\{([\s\S]*?)\};/m);
  if (!match) return [];
  const body = match[1];
  const keys = [];
  const regex = /['"]?([a-z0-9_]+)['"]?\s*:\s*[A-Za-z0-9_]+/gi;
  let item;
  while ((item = regex.exec(body)) !== null) {
    keys.push(item[1]);
  }
  return keys;
};

const extractManifestFields = (content) => {
  const id = content.match(/id:\s*['"]([^'"]+)['"]/);
  const slug = content.match(/slug:\s*['"]([^'"]+)['"]/);
  const visibility = content.match(/visibility:\s*['"]([^'"]+)['"]/);
  return {
    id: id?.[1] ?? null,
    slug: slug?.[1] ?? null,
    visibility: visibility?.[1] ?? null
  };
};

const collectSchemaFiles = () => {
  const dir = path.join(ROOT, JOURNEY_DIR);
  const entries = fs.readdirSync(dir);
  return entries
    .filter((name) => name.endsWith('JourneySchema.ts'))
    .map((name) => path.join(dir, name));
};

const extractStepIds = (content) => {
  const ids = [];
  const regex = /stepId:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  return ids;
};

function main() {
  console.log('🔍 journey-schema-integrity-r1:guard — Checking journey schemas...\n');

  const errors = [];

  const registryFile = readFile(MANIFEST_REGISTRY_FILE);
  if (!registryFile.content) {
    errors.push(`Missing manifest registry: ${MANIFEST_REGISTRY_FILE}`);
  }

  const manifestImports = registryFile.content ? extractRegistryImports(registryFile.content) : [];
  const manifests = manifestImports.map((item) => ({
    ...item,
    ...extractManifestFields(readFile(item.file).content ?? '')
  }));

  const ids = new Set();
  const slugs = new Set();

  manifests.forEach((manifest) => {
    if (!manifest.id) {
      errors.push(`Missing id in manifest: ${manifest.file}`);
      return;
    }
    if (!manifest.slug) {
      errors.push(`Missing slug in manifest: ${manifest.file}`);
      return;
    }
    if (!manifest.visibility || !['prod', 'dev'].includes(manifest.visibility)) {
      errors.push(`Invalid visibility in manifest: ${manifest.file}`);
    }
    if (ids.has(manifest.id)) {
      errors.push(`Duplicate manifest id: ${manifest.id}`);
    }
    if (slugs.has(manifest.slug)) {
      errors.push(`Duplicate manifest slug: ${manifest.slug}`);
    }
    ids.add(manifest.id);
    slugs.add(manifest.slug);
  });

  const schemaRegistry = readFile(SCHEMA_REGISTRY_FILE);
  const schemaKeys = schemaRegistry.content ? extractSchemaRegistryKeys(schemaRegistry.content) : [];
  if (!schemaRegistry.content) {
    errors.push(`Missing schema registry: ${SCHEMA_REGISTRY_FILE}`);
  }

  manifests.forEach((manifest) => {
    if (!manifest.id) return;
    if (!schemaKeys.includes(manifest.id)) {
      errors.push(`Schema missing in registry for journey: ${manifest.id}`);
    }
  });

  const schemaFiles = collectSchemaFiles();
  schemaFiles.forEach((schemaFile) => {
    const rel = path.relative(ROOT, schemaFile);
    const content = fs.readFileSync(schemaFile, 'utf8');
    const stepIds = extractStepIds(content);
    if (stepIds.length === 0) {
      errors.push(`No steps found in schema: ${rel}`);
      return;
    }
    const uniq = new Set(stepIds);
    if (uniq.size !== stepIds.length) {
      errors.push(`Duplicate stepId in schema: ${rel}`);
    }
    const hasE0 = stepIds.some((id) => id.startsWith('E0_'));
    if (!hasE0) {
      errors.push(`Schema missing E0 entrypoint: ${rel}`);
    }
    stepIds.forEach((stepId) => {
      const isEventStep = stepId.startsWith('E') && STEP_ID_PATTERN.test(stepId);
      const isBlockStep = stepId.startsWith('B') && STEP_ID_BLOCK_PATTERN.test(stepId);
      if (!isEventStep && !isBlockStep) {
        errors.push(`Invalid stepId format (${stepId}) in schema: ${rel}`);
      }
    });
  });

  const renderer = readFile(RENDERER_FILE);
  if (!renderer.content) {
    errors.push(`Missing renderer: ${RENDERER_FILE}`);
  } else {
    const required = [
      'E0_intro',
      'E_panorama',
      'E1_panorama',
      'E_bilan',
      'E2_panorama_bilan',
      'E_resources',
      'E_exit',
      'E_global_bilan'
    ];
    required.forEach((step) => {
      if (!renderer.content.includes(step)) {
        errors.push(`Renderer missing step mapping for ${step}: ${RENDERER_FILE}`);
      }
    });
  }

  if (errors.length) {
    console.log('❌ journey-schema-integrity-r1:guard — FAIL\n');
    errors.forEach((err) => console.log(`   ❌ ${err}`));
    process.exit(1);
  }

  console.log('✅ journey-schema-integrity-r1:guard — OK');
  console.log('');
}

main();
