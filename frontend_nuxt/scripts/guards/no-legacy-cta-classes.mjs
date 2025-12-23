import fs from "node:fs/promises";
import path from "node:path";

const SCAN_DIRS = ["app", "components", "pages", "layouts"];
const EXTENSIONS = [".vue"];
const EXCLUDE_FILES = new Set([
  path.normalize("app/components/PPButton.vue"),
]);

const PATTERN = /\b(pp-cta-|home-cta-)/;

async function listFilesRecursive(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(fullPath)));
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name);
    if (!EXTENSIONS.includes(ext)) continue;

    files.push(fullPath);
  }

  return files;
}

function toRel(p) {
  return path.relative(process.cwd(), p).replaceAll("\\", "/");
}

function findMatchingLines(content) {
  const lines = content.split("\n");
  const matches = [];

  for (let i = 0; i < lines.length; i += 1) {
    if (PATTERN.test(lines[i])) {
      matches.push({ lineNo: i + 1, line: lines[i] });
    }
  }

  return matches;
}

async function main() {
  const offenders = [];

  for (const dir of SCAN_DIRS) {
    const root = path.resolve(process.cwd(), dir);

    try {
      const files = await listFilesRecursive(root);

      for (const file of files) {
        const rel = toRel(file);

        if (EXCLUDE_FILES.has(path.normalize(rel))) continue;

        const content = await fs.readFile(file, "utf-8");
        if (!PATTERN.test(content)) continue;

        const lines = findMatchingLines(content);

        if (lines.length > 0) {
          offenders.push({ file: rel, lines });
        }
      }
    } catch {
      // Ignore missing directories
    }
  }

  if (offenders.length === 0) {
    console.log("✅ cta:guard — OK (no legacy CTA classes found in .vue files).");
    process.exit(0);
  }

  console.error("❌ cta:guard — Legacy CTA classes detected (pp-cta- / home-cta-).");
  for (const off of offenders) {
    console.error(`\n- ${off.file}`);
    for (const l of off.lines) {
      console.error(`  L${l.lineNo}: ${l.line}`);
    }
  }

  process.exit(1);
}

main();
