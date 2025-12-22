import fs from 'node:fs';
import path from 'node:path';

const ALLOW_TOKEN = 'no-console-guard:allow';
const CONSOLE_PATTERN = /console\./;

const targets = [
  'app/adapters',
  'app/components/journey/bilan',
  'app/composables',
  'app/utils/bilan',
  'app/utils/reco',
  'app/utils/export'
];

const collectFiles = (dir: string, files: string[] = []) => {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
};

const scanFile = (filePath: string) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const violations: string[] = [];

  lines.forEach((line, index) => {
    if (line.includes(ALLOW_TOKEN)) return;
    if (CONSOLE_PATTERN.test(line)) {
      violations.push(`${filePath}:${index + 1}`);
    }
  });

  return violations;
};

const main = () => {
  const cwd = process.cwd();
  const files = targets.flatMap((target) => collectFiles(path.join(cwd, target)));
  const violations = files.flatMap((file) => scanFile(file));

  if (violations.length > 0) {
    console.error('No-console guard failed.');
    violations.forEach((entry) => console.error(entry));
    process.exit(1);
  }

  console.log('No-console guard OK');
};

main();
