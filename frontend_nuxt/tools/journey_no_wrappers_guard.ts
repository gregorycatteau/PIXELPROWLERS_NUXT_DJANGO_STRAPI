import fs from 'node:fs';
import path from 'node:path';

const forbiddenDirs = [
  'app/components/journey/p2',
  'app/components/journey/p3',
  'app/components/journey/p4'
];

const forbiddenNamePatterns = [/\/P2[^/]*\.vue$/, /\/P3[^/]*\.vue$/, /\/P4[^/]*\.vue$/];

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

const assertForbiddenDirs = (root: string) => {
  for (const dir of forbiddenDirs) {
    const fullPath = path.join(root, dir);
    if (!fs.existsSync(fullPath)) continue;
    const files = collectFiles(fullPath);
    if (files.length > 0) {
      throw new Error(`Forbidden journey wrappers found in ${dir}`);
    }
  }
};

const assertForbiddenNames = (root: string) => {
  const journeyRoot = path.join(root, 'app/components/journey');
  const files = collectFiles(journeyRoot).filter((file) => file.endsWith('.vue'));
  const violations = files.filter((file) => forbiddenNamePatterns.some((re) => re.test(file)));
  if (violations.length > 0) {
    throw new Error(`Forbidden journey wrapper files: ${violations.join(', ')}`);
  }
};

const main = () => {
  try {
    const root = process.cwd();
    assertForbiddenDirs(root);
    assertForbiddenNames(root);
    console.log('Journey no-wrapper guard OK');
  } catch (error) {
    console.error('Journey no-wrapper guard failed.');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
};

main();
