import { spawnSync } from 'node:child_process';

// journey-scaffold-cli-syntax-r1:guard
//
// OBJECTIF : verifier que le CLI scaffold parse sans erreur.

const result = spawnSync('node', ['--check', 'scripts/journey/scaffold.mjs'], {
  stdio: 'inherit'
});

if (result.status !== 0) {
  console.error('❌ journey-scaffold-cli-syntax-r1:guard — FAIL');
  process.exit(1);
}

console.log('✅ journey-scaffold-cli-syntax-r1:guard — OK');
