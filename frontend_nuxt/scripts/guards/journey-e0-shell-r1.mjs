import fs from 'node:fs';
import path from 'node:path';

// journey-e0-shell-r1:guard
//
// OBJECTIF : garantir que l'intro E0 utilise bien PPJourneyStepShell
// et que la navigation par defaut reste presente dans le shell.

const ROOT = process.cwd();
const INTRO_PATH = path.join(ROOT, 'app/components/journey/p1/P1IntroE0.vue');
const SHELL_PATH = path.join(ROOT, 'app/components/journey/PPJourneyStepShell.vue');

const REQUIRED_TAG = /<PPJourneyStepShell/;
const REQUIRED_IMPORT = /import\s+PPJourneyStepShell\s+from\s+['"]~\/components\/journey\/PPJourneyStepShell\.vue['"]/;
const REQUIRED_NAV_MARKER = /data-step-shell-nav=\"default\"/;

function main() {
  console.log('🔍 journey-e0-shell-r1:guard — Checking P1 intro shell + nav...\n');

  if (!fs.existsSync(INTRO_PATH)) {
    console.log('❌ journey-e0-shell-r1:guard — FAIL');
    console.log('   Missing P1IntroE0.vue');
    process.exit(1);
  }

  if (!fs.existsSync(SHELL_PATH)) {
    console.log('❌ journey-e0-shell-r1:guard — FAIL');
    console.log('   Missing PPJourneyStepShell.vue');
    process.exit(1);
  }

  const introContent = fs.readFileSync(INTRO_PATH, 'utf8');
  const shellContent = fs.readFileSync(SHELL_PATH, 'utf8');

  const violations = [];

  if (!REQUIRED_TAG.test(introContent)) {
    violations.push('P1IntroE0 missing <PPJourneyStepShell>');
  }
  if (!REQUIRED_IMPORT.test(introContent)) {
    violations.push('P1IntroE0 missing explicit PPJourneyStepShell import');
  }
  if (!REQUIRED_NAV_MARKER.test(shellContent)) {
    violations.push('PPJourneyStepShell missing default nav marker');
  }

  if (violations.length > 0) {
    console.log('❌ journey-e0-shell-r1:guard — FAIL');
    violations.forEach((item) => console.log(`   - ${item}`));
    process.exit(1);
  }

  console.log('✅ journey-e0-shell-r1:guard — OK');
  console.log('   └── E0 uses PPJourneyStepShell and default nav is present');
  console.log('');
}

main();
