import fs from 'node:fs';
import path from 'node:path';
import { NO_V_HTML_ALLOWLIST } from './guard_allowlist/no_v_html_allowlist';

const TARGETS = ['app/components', 'app/pages', 'app/layouts', 'app'];
const PATTERN = /v-html/;

const collectFiles = (dir: string, files: string[] = []) => {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (fullPath.includes(`${path.sep}.nuxt${path.sep}`)) continue;
    if (entry.isDirectory()) {
      collectFiles(fullPath, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
};

const main = () => {
  try {
    const cwd = process.cwd();
    const files = TARGETS.flatMap((target) => collectFiles(path.join(cwd, target)));
    const violations = files.filter((file) => {
      if (NO_V_HTML_ALLOWLIST.includes(file)) return false;
      const content = fs.readFileSync(file, 'utf8');
      return PATTERN.test(content);
    });

    if (violations.length > 0) {
      throw new Error('No v-html guard failed.');
    }

    console.log('No v-html guard OK');
  } catch {
    console.error('No v-html guard failed.');
    process.exit(1);
  }
};

main();
