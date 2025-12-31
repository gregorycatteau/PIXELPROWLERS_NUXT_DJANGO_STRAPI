import fs from 'node:fs';
import path from 'node:path';

// journey-scaffold-r1:guard
//
// OBJECTIF : verifier les parcours scaffoldés via une liste explicite.

const ROOT = process.cwd();
const LIST_PATH = path.join(ROOT, 'scripts/guards/journey-scaffold-r1.list.json');

const registryPaths = {
  manifest: path.join(ROOT, 'app/config/journeys/manifests/registry.ts'),
  schema: path.join(ROOT, 'app/config/journeys/schemaRegistry.ts'),
  adapters: path.join(ROOT, 'app/adapters/bilan/registry.ts'),
  dataRegistry: path.join(ROOT, 'app/config/journeys/journeyDataRegistry.ts')
};

const ensureFile = (filePath) => fs.existsSync(filePath);

const requireStep = (content, stepId) => {
  const pattern = new RegExp(`stepId:\\s*['"]${stepId}['"]`);
  return pattern.test(content);
};

function main() {
  console.log('🔍 journey-scaffold-r1:guard — Checking scaffolded journeys...\n');

  if (!fs.existsSync(LIST_PATH)) {
    console.log('ℹ️  No scaffold list found. Skipping.');
    process.exit(0);
  }

  const payload = JSON.parse(fs.readFileSync(LIST_PATH, 'utf8'));
  const journeys = payload?.journeys ?? [];

  if (!Array.isArray(journeys) || journeys.length === 0) {
    console.log('ℹ️  Scaffold list empty. Skipping.');
    process.exit(0);
  }

  const registryContent = {
    manifest: fs.readFileSync(registryPaths.manifest, 'utf8'),
    schema: fs.readFileSync(registryPaths.schema, 'utf8'),
    adapters: fs.readFileSync(registryPaths.adapters, 'utf8'),
    dataRegistry: fs.readFileSync(registryPaths.dataRegistry, 'utf8')
  };

  const violations = [];

  for (const journey of journeys) {
    const files = journey.files ?? [];
    files.forEach((filePath) => {
      const absolute = path.join(ROOT, filePath);
      if (!ensureFile(absolute)) {
        violations.push(`Missing file: ${filePath}`);
      }
    });

    if (journey.manifestVar && !registryContent.manifest.includes(journey.manifestVar)) {
      violations.push(`Manifest not registered: ${journey.journeyId}`);
    }
    if (journey.schemaVar && !registryContent.schema.includes(journey.schemaVar)) {
      violations.push(`Schema not registered: ${journey.journeyId}`);
    }
    if (journey.adapterVar && !registryContent.adapters.includes(journey.adapterVar)) {
      violations.push(`Adapter not registered: ${journey.journeyId}`);
    }
    if (journey.copyPointer && !registryContent.dataRegistry.includes(journey.copyPointer)) {
      violations.push(`Copy pointer not registered: ${journey.journeyId}`);
    }
    if (journey.questionsPointer && !registryContent.dataRegistry.includes(journey.questionsPointer)) {
      violations.push(`Questions pointer not registered: ${journey.journeyId}`);
    }

    const schemaFile = journey.files?.find((f) => f.endsWith('JourneySchema.ts'));
    if (schemaFile) {
      const schemaContent = fs.readFileSync(path.join(ROOT, schemaFile), 'utf8');
      const requiredSteps = journey.requiredSteps ?? [];
      requiredSteps.forEach((stepId) => {
        if (!requireStep(schemaContent, stepId)) {
          violations.push(`Schema missing step ${stepId}: ${journey.journeyId}`);
        }
      });
    }
  }

  if (violations.length > 0) {
    console.log('❌ journey-scaffold-r1:guard — FAIL');
    violations.forEach((item) => console.log(`   - ${item}`));
    process.exit(1);
  }

  console.log('✅ journey-scaffold-r1:guard — OK');
  console.log(`   └── ${journeys.length} scaffolded journey(ies) verified`);
  console.log('');
}

main();
