import fs from 'node:fs';
import path from 'node:path';

// step-shell-nav-r1:guard
//
// OBJECTIF : S'assurer que PPJourneyStepShell expose une navigation par defaut
// lorsque des steps prev/next existent, pour eviter un step sans CTA.

const ROOT = process.cwd();
const SHELL_PATH = path.join(ROOT, 'app/components/journey/PPJourneyStepShell.vue');

function main() {
  console.log('🔍 step-shell-nav-r1:guard — Checking default nav in PPJourneyStepShell...\n');

  if (!fs.existsSync(SHELL_PATH)) {
    console.log('❌ step-shell-nav-r1:guard — FAIL');
    console.log('   Missing PPJourneyStepShell.vue');
    process.exit(1);
  }

  const content = fs.readFileSync(SHELL_PATH, 'utf8');
  const hasNavMarker = content.includes('data-step-shell-nav="default"');
  const hasGoToStep = content.includes('goToStep(');

  if (!hasNavMarker || !hasGoToStep) {
    console.log('❌ step-shell-nav-r1:guard — FAIL');
    console.log('   Default nav not detected in PPJourneyStepShell.vue');
    process.exit(1);
  }

  console.log('✅ step-shell-nav-r1:guard — OK');
  console.log('   └── Default navigation is present');
  console.log('');
}

main();
