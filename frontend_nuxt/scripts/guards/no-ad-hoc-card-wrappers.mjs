import fs from "node:fs/promises";
import path from "node:path";

const SCAN_DIRS = ["app", "components", "pages", "layouts"];
const EXTENSIONS = [".vue"];

/**
 * Heuristique strict++ (anti-bruit) :
 * On cherche dans une même ligne de template une combinaison de classes typiques d’un wrapper card “fait main”.
 * - rounded-*
 * - border / border-* / border-[...]
 * - bg-[color:var(--color-panel-soft)] ou bg-[color:var(--color-panel)] ou bg-[color:var(--color-panel-alt)]
 *
 * But : empêcher la réintroduction de “wrappers card” non DS.
 * Les cas complexes/multilignes seront gérés lors des migrations ultérieures.
 */
const roundedRe = /\brounded-(sm|md|lg|xl|2xl|3xl|full)\b/;
const borderRe = /\bborder\b|\bborder-\S+\b|\bborder-\[.+?\]\b/;
const bgPanelRe = /\bbg-\[color:var\(--color-panel-soft\)\]\b|\bbg-\[color:var\(--color-panel\)\]\b|\bbg-\[color:var\(--color-panel-alt\)\]\b/;

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

    // Ignore obvious PPCard usage lines to reduce noise
    if (line.includes("<PPCard")) continue;

    if (roundedRe.test(line) && borderRe.test(line) && bgPanelRe.test(line)) {
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

        // quick skip
        if (!content.includes("rounded-") || !content.includes("border") || !content.includes("bg-[color:var(--color-panel")) {
          continue;
        }

        const lines = findOffendingLines(content);
        if (lines.length > 0) {
          offenders.push({ file: rel, lines });
        }
      }
    } catch {
      // Ignore missing directories
    }
  }

  if (offenders.length === 0) {
    console.log("✅ card:guard — OK (no ad-hoc card wrappers found).");
    process.exit(0);
  }

  console.error("❌ card:guard — Ad-hoc card wrapper detected (use <PPCard> instead).");
  for (const off of offenders) {
    console.error(`\n- ${off.file}`);
    for (const l of off.lines) {
      console.error(`  L${l.lineNo}: ${l.line}`);
    }
  }

  process.exit(1);
}

main();
