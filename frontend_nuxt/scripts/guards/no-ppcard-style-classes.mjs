import fs from "node:fs/promises";
import path from "node:path";

const SCAN_DIRS = ["app", "components", "pages", "layouts"];
const EXTENSIONS = [".vue"];

/**
 * Interdit sur <PPCard ... class="..."> :
 * - rounded-*
 * - border / border-*
 * - bg-*
 * - shadow-*
 * - ring-*
 *
 * On autorise les classes layout (p-*, px-*, py-*, space-y-*, flex, gap, grid...).
 * Le rendu card doit venir des classes DS + tokens.
 */
const forbiddenRe = /\b(rounded-\S+|border\b|border-\S+|bg-\S+|shadow-\S+|ring-\S+)\b/;

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

function findOffendingLines(content) {
  const lines = content.split("\n");
  const offenders = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.includes("<PPCard")) continue;

    // Quick check: only flag if PPCard line has a class attribute AND contains forbidden tokens
    if (!line.includes("class=")) continue;
    if (forbiddenRe.test(line)) {
      offenders.push({ lineNo: i + 1, line: line.trim() });
    }
  }

  return offenders;
}

async function main() {
  const offenders = [];

  for (const dir of SCAN_DIRS) {
    const root = path.resolve(process.cwd(), dir);

    try {
      const files = await listFilesRecursive(root);

      for (const file of files) {
        const rel = toRel(file);
        const content = await fs.readFile(file, "utf-8");

        if (!content.includes("<PPCard")) continue;

        const lines = findOffendingLines(content);
        if (lines.length > 0) offenders.push({ file: rel, lines });
      }
    } catch {
      // Ignore missing dirs
    }
  }

  if (offenders.length === 0) {
    console.log("✅ ppcard:guard — OK (no forbidden style classes on <PPCard>).");
    process.exit(0);
  }

  console.error("❌ ppcard:guard — Forbidden style classes detected on <PPCard> (use variants/tokens).");
  for (const off of offenders) {
    console.error(`\n- ${off.file}`);
    for (const l of off.lines) {
      console.error(`  L${l.lineNo}: ${l.line}`);
    }
  }

  process.exit(1);
}

main();
