import fs from 'node:fs';
import path from 'node:path';

// bilan-vm-forbidden-keys-r1:guard
//
// OBJECTIF : bloquer l'introduction de cles interdites dans le code
// qui produit le UniversalBilanViewModel.

const ROOT = process.cwd();
const TARGETS = [
  'app/adapters/bilan',
  'app/types/bilan.ts'
];

const FORBIDDEN_PATTERNS = [
  /\b(rawAnswers|answersByQuestionId|answersByQuestion|perQuestion|responses|answersBy)\b\s*:/i,
  /['"]p\d+_q\d+['"]\s*:/i,
  /['"]q\d+_[^'"]+['"]\s*:/i
];

const readFiles = (targetPath) => {
  const fullPath = path.join(ROOT, targetPath);
  if (!fs.existsSync(fullPath)) return [];
  const stats = fs.statSync(fullPath);
  if (stats.isFile()) return [fullPath];
  const files = [];
  for (const entry of fs.readdirSync(fullPath)) {
    const entryPath = path.join(fullPath, entry);
    const entryStats = fs.statSync(entryPath);
    if (entryStats.isDirectory()) {
      files.push(...readFiles(path.relative(ROOT, entryPath)));
    } else if (entryPath.endsWith('.ts') || entryPath.endsWith('.vue')) {
      files.push(entryPath);
    }
  }
  return files;
};

function main() {
  console.log('🔍 bilan-vm-forbidden-keys-r1:guard — Scanning bilan VM sources...\n');

  const files = TARGETS.flatMap((target) => readFiles(target));
  const violations = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(content)) {
        violations.push({ filePath, pattern: pattern.toString() });
      }
    }
  }

  if (violations.length) {
    console.log('❌ bilan-vm-forbidden-keys-r1:guard — FAIL');
    violations.forEach(({ filePath, pattern }) => {
      console.log(`   - ${filePath} matches ${pattern}`);
    });
    process.exit(1);
  }

  console.log('✅ bilan-vm-forbidden-keys-r1:guard — OK');
  console.log(`   └── ${files.length} file(s) scanned`);
  console.log('');
}

main();
