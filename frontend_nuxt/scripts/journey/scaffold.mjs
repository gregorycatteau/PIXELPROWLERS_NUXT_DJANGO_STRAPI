import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const USAGE = `
Usage:
  npm run journey:scaffold -- --id p2 --slug parcours-p2 --label "Parcours P2" [--dry-run] [--force]
`;

const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(name);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
};

const hasFlag = (name) => args.includes(name);

const journeyId = (getArg('--id') ?? '').trim();
const slug = (getArg('--slug') ?? '').trim();
const labelRaw = (getArg('--label') ?? '').trim();
const dryRun = hasFlag('--dry-run');
const force = hasFlag('--force');

if (hasFlag('--help') || !journeyId || !slug || !labelRaw) {
  console.log(USAGE.trim());
  process.exit(journeyId && slug && labelRaw ? 0 : 1);
}

const ID_PATTERN = /^p[2-9]$|^[a-z0-9_]{2,12}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (!ID_PATTERN.test(journeyId)) {
  console.error('Invalid --id. Expected ^p[2-9]$ or ^[a-z0-9_]{2,12}$.');
  process.exit(1);
}
if (!SLUG_PATTERN.test(slug)) {
  console.error('Invalid --slug. Expected kebab-case: ^[a-z0-9]+(?:-[a-z0-9]+)*$.');
  process.exit(1);
}

const label = labelRaw.slice(0, 80);
if (!label) {
  console.error('Invalid --label. Non-empty required.');
  process.exit(1);
}

const ensureInside = (baseDir, targetPath) => {
  const resolvedBase = path.resolve(ROOT, baseDir);
  const resolvedTarget = path.resolve(ROOT, targetPath);
  if (!resolvedTarget.startsWith(resolvedBase)) {
    throw new Error('Path traversal detected.');
  }
  return resolvedTarget;
};

const upperId = journeyId.toUpperCase();
const copyVar = `${journeyId}Copy`;
const manifestVar = `${journeyId}Manifest`;
const schemaVar = `${journeyId}JourneySchema`;
const adapterVar = `${journeyId}BilanAdapter`;
const axisOrderConst = `${upperId}_PANORAMA_AXIS_ORDER`;

const files = [
  {
    path: `app/config/journeys/${journeyId}CopyV1_0.ts`,
    content: `export const ${copyVar} = {
  intro: {
    title: '${label} (stub)',
    subtitle: 'Panorama rapide, reponses locales uniquement.',
    cta: 'Commencer le panorama'
  },
  panorama: {
    title: 'Panorama ${upperId}',
    subtitle: 'Questions de base pour poser le contexte.',
    meta: 'Tu peux ignorer des questions.',
    validate: 'Voir le bilan',
    back: 'Retour'
  },
  panoramaBilan: {
    title: 'Bilan ${upperId}',
    subtitle: 'Synthese par axe.',
    summaryTitle: 'Ce que tu viens de poser',
    summarySubtitle: 'Panorama rapide, base sur tes reponses.',
    nextStepsTitle: 'Prochaine etape',
    nextStepsSubtitle: 'Explorer le bilan global pour un export.',
    backToPanorama: 'Retour au panorama',
    globalCta: 'Voir le bilan global',
    globalLocked: 'Le bilan global est accessible apres le panorama.'
  },
  global: {
    title: 'Bilan global ${upperId}',
    subtitle: 'Synthese publique, basee sur des agregats.',
    panoramaHeading: 'Panorama',
    blocksHeading: 'Blocs exploratoires',
    exportHeading: 'Export (client-side)',
    exportNotice: 'Le texte ci-dessus est genere cote client.',
    copyCta: 'Copier le bilan',
    printCta: 'Imprimer',
    clearCta: 'Effacer mes reponses de cet appareil',
    backToHub: 'Retour au panorama',
    sovereigntyNote: 'Ce bilan reste sur cet appareil.'
  },
  export: {
    title: '=== Bilan ${upperId} (panorama) ===',
    panoramaHeading: '--- Panorama ---',
    blocksHeading: '--- Bloc exploratoire ---',
    globalHeading: '--- Bilan global (agrege) ---',
    metaHeading: '--- Metadonnees ---',
    closingLine: 'Bilan genere cote client.'
  }
};
`
  },
  {
    path: `app/config/journeys/${journeyId}QuestionsV1_0.ts`,
    content: `export type ${upperId}PanoramaAxisId = 'clarity' | 'capacity';

export const ${axisOrderConst} = ['clarity', 'capacity'];

export const ${journeyId}PanoramaAxesMeta = {
  clarity: { label: 'Clarte', shortLabel: 'Clarte' },
  capacity: { label: 'Capacite', shortLabel: 'Capacite' }
};

export const ${journeyId}PanoramaQuestions = [
  { id: '${journeyId}_panorama_clarity_q1', axisId: 'clarity', label: 'Je peux exprimer la priorite principale.' },
  { id: '${journeyId}_panorama_capacity_q1', axisId: 'capacity', label: 'La capacite actuelle est lisible.' }
];
`
  },
  {
    path: `app/config/journeys/${journeyId}JourneySchema.ts`,
    content: `import type { JourneySchema } from './p1JourneySchema';

export const ${schemaVar}: JourneySchema = {
  id: '${journeyId}',
  slug: '${slug}',
  label: '${label}',
  entrypoint: 'E0_intro',
  modules: { panorama: true, bilan: true, resources: true, exit: true },
  copyPack: 'app/config/journeys/${journeyId}CopyV1_0',
  steps: [
    { stepId: 'E0_intro', type: 'intro', componentName: 'StepIntroE0', next: 'E1_panorama' },
    { stepId: 'E1_panorama', type: 'questionnaire', componentName: 'StepPanoramaE1', prev: 'E0_intro', next: 'E_global_bilan' },
    { stepId: 'E_global_bilan', type: 'bilan', componentName: 'GlobalBilanEngine', prev: 'E1_panorama', next: 'E_resources' },
    { stepId: 'E_resources', type: 'resources', componentName: 'StepResourcesE3', prev: 'E_global_bilan', next: 'E_exit' },
    { stepId: 'E_exit', type: 'carrefour', componentName: 'StepExitE4', prev: 'E_resources', isTerminal: true }
  ],
  gatingRules: []
};
`
  },
  {
    path: `app/config/journeys/manifests/${journeyId}.manifest.ts`,
    content: `import type { JourneyManifestV1 } from './types';

export const ${manifestVar}: JourneyManifestV1 = {
  id: '${journeyId}',
  slug: '${slug}',
  engine: 'universal',
  maturity: 'stub',
  axes: [
    { axisId: 'clarity', label: 'Clarte' },
    { axisId: 'capacity', label: 'Capacite' }
  ],
  modules: {
    panorama: true,
    blocks: false,
    issues: false,
    hypotheses: false,
    landing: false,
    actions: false,
    resources: true,
    engagement: false,
    export: true,
    recommendations: false
  },
  pointers: {
    questions: 'app/config/journeys/${journeyId}QuestionsV1_0',
    copy: 'app/config/journeys/${journeyId}CopyV1_0'
  },
  adapters: {
    globalBilanAdapterId: '${journeyId}'
  },
  storage: {
    schemaVersion: '${journeyId}_v1.0',
    scoresKey: 'pp_journey_${journeyId}_scores_v1_0',
    metaKey: 'pp_journey_${journeyId}_meta_v1_0',
    ttlPolicy: 'unchanged'
  }
};
`
  },
  {
    path: `app/adapters/bilan/${journeyId}.ts`,
    content: `import type { JourneyBilanAdapter } from './types';
import { createEmptyUniversalBilanViewModel } from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';

export const ${adapterVar}: JourneyBilanAdapter = {
  journeyId: '${journeyId}',
  buildViewModel() {
    const vm = createEmptyUniversalBilanViewModel({
      copy: { title: 'Bilan ${upperId}', subtitle: 'Synthese locale (stub).' },
      summaryNav: [
        { id: 'gb_panorama', label: 'Panorama' },
        { id: 'gb_export', label: 'Export' }
      ],
      meta: { isEmpty: true, partial: true, maturity: 'stub' }
    });
    assertNoRawAnswers(vm);
    return vm;
  }
};
`
  }
];

const registryPaths = {
  manifest: 'app/config/journeys/manifests/registry.ts',
  schema: 'app/config/journeys/schemaRegistry.ts',
  adapters: 'app/adapters/bilan/registry.ts',
  dataRegistry: 'app/config/journeys/journeyDataRegistry.ts'
};

const listPath = 'scripts/guards/journey-scaffold-r1.list.json';

const updateFile = (filePath, updater) => {
  const fullPath = path.join(ROOT, filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const next = updater(content);
  if (next !== content && !dryRun) {
    fs.writeFileSync(fullPath, next, 'utf8');
  }
};

const insertImport = (content, statement) => {
  // Idempotent: don't add duplicates
  if (content.includes(statement)) return content;

  const lines = content.split("\n");

  // Preferred anchor: insert before the first exported type block
  const anchorIdx = lines.findIndex((l) => l.startsWith("export type JourneyCopyIntro"));
  if (anchorIdx !== -1) {
    lines.splice(anchorIdx, 0, statement, "");
    return lines.join("\n");
  }

  // Fallback: insert after the last top-level import line
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].startsWith("import ")) lastImportIdx = i;
    if (lastImportIdx !== -1 && !lines[i].startsWith("import ") && lines[i].trim() !== "") break;
  }

  const insertAt = lastImportIdx === -1 ? 0 : lastImportIdx + 1;
  lines.splice(insertAt, 0, statement, "");
  return lines.join("\n");
};

const appendToArrayLiteral = (content, marker, item) => {
  if (content.includes(item)) return content;
  const idx = content.indexOf(marker);
  if (idx === -1) return content;
  const endIdx = content.indexOf('];', idx);
  if (endIdx === -1) return content;
  const before = content.slice(0, endIdx);
  const after = content.slice(endIdx);
  return `${before.trimEnd()},\n  ${item}\n${after}`;
};

const appendToObjectLiteral = (content, marker, entry) => {
  if (content.includes(entry)) return content;
  const idx = content.indexOf(marker);
  if (idx === -1) return content;
  const endIdx = content.indexOf('};', idx);
  if (endIdx === -1) return content;
  const before = content.slice(0, endIdx);
  const after = content.slice(endIdx);
  return `${before.trimEnd()},\n  ${entry}\n${after}`;
};

const ensureFiles = () => {
  for (const file of files) {
    const resolved = ensureInside('app', file.path);
    if (fs.existsSync(resolved) && !force) {
      throw new Error(`File exists: ${file.path}`);
    }
  }
};

const writeFiles = () => {
  for (const file of files) {
    const full = path.join(ROOT, file.path);
    const dir = path.dirname(full);
    if (!dryRun) fs.mkdirSync(dir, { recursive: true });
    if (!dryRun) fs.writeFileSync(full, file.content, 'utf8');
  }
};

const updateRegistries = () => {
  updateFile(registryPaths.manifest, (content) => {
    let next = insertImport(content, `import { ${manifestVar} } from './${journeyId}.manifest';`);
    next = appendToArrayLiteral(next, 'const registry: JourneyManifestV1[] = [', manifestVar);
    return next;
  });

  updateFile(registryPaths.schema, (content) => {
    let next = insertImport(content, `import { ${schemaVar} } from './${journeyId}JourneySchema';`);
    next = appendToObjectLiteral(next, 'const schemaRegistry: Record<string, JourneySchema> = {', `${journeyId}: ${schemaVar}`);
    return next;
  });

  updateFile(registryPaths.adapters, (content) => {
    let next = insertImport(content, `import { ${adapterVar} } from './${journeyId}';`);
    next = appendToObjectLiteral(next, 'const registry: Record<string, JourneyBilanAdapter> = {', `${journeyId}: ${adapterVar}`);
    return next;
  });

  updateFile(registryPaths.dataRegistry, (content) => {
    let next = insertImport(content, `import { ${copyVar} } from './${journeyId}CopyV1_0';`);
    next = insertImport(
      next,
      `import { ${journeyId}PanoramaAxesMeta, ${journeyId}PanoramaQuestions, ${axisOrderConst} } from './${journeyId}QuestionsV1_0';`
    );
    next = appendToObjectLiteral(
      next,
      'const copyRegistry: Record<string, JourneyCopyBundle> = {',
      `'app/config/journeys/${journeyId}CopyV1_0': ${copyVar}`
    );
    next = appendToObjectLiteral(
      next,
      'const questionsRegistry: Record<string, PanoramaQuestionsBundle> = {',
      `'app/config/journeys/${journeyId}QuestionsV1_0': { questions: ${journeyId}PanoramaQuestions, axisOrder: ${axisOrderConst}, axesMeta: ${journeyId}PanoramaAxesMeta }`
    );
    return next;
  });
};

const updateScaffoldList = () => {
  const listFile = path.join(ROOT, listPath);
  const entry = {
    journeyId,
    slug,
    manifestVar,
    schemaVar,
    adapterVar,
    copyPointer: `app/config/journeys/${journeyId}CopyV1_0`,
    questionsPointer: `app/config/journeys/${journeyId}QuestionsV1_0`,
    requiredSteps: ['E0_intro', 'E1_panorama', 'E_global_bilan', 'E_resources', 'E_exit'],
    files: files.map((file) => file.path)
  };

  let list = { journeys: [] };
  if (fs.existsSync(listFile)) {
    list = JSON.parse(fs.readFileSync(listFile, 'utf8'));
  }
  const existing = list.journeys.find((j) => j.journeyId === journeyId);
  if (existing) {
    Object.assign(existing, entry);
  } else {
    list.journeys.push(entry);
  }

  if (!dryRun) {
    fs.mkdirSync(path.dirname(listFile), { recursive: true });
    fs.writeFileSync(listFile, JSON.stringify(list, null, 2), 'utf8');
  }
};

try {
  ensureFiles();
  if (dryRun) {
    console.log('Dry run. Files to create:');
    files.forEach((file) => console.log(`- ${file.path}`));
    console.log(`- ${registryPaths.manifest}`);
    console.log(`- ${registryPaths.schema}`);
    console.log(`- ${registryPaths.adapters}`);
    console.log(`- ${registryPaths.dataRegistry}`);
    console.log(`- ${listPath}`);
    process.exit(0);
  }
  writeFiles();
  updateRegistries();
  updateScaffoldList();
  console.log(`✅ Journey scaffolded: ${journeyId} (${slug})`);
} catch (error) {
  console.error('❌ Scaffold failed.');
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}
