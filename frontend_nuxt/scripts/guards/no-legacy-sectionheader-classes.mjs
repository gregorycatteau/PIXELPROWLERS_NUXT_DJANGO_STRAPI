import fs from "node:fs";
import path from "node:path";

/**
 * Guard DS — SectionHeader
 * Objectif : empêcher la réintroduction des wrappers/header classes legacy.
 * Les en-têtes de section doivent être rendus via <PPSectionHeader />.
 *
 * Tolérance :
 * - On n'interdit PAS "SectionIntro"/"PrimaryCard" ici (Lot C pas encore migré).
 * - On ignore le fichier PPSectionHeader.vue (il contient naturellement "pp-section-header").
 */

const ROOT = path.resolve(process.cwd(), "frontend_nuxt");

const SCAN_DIRS = [
  path.join(ROOT, "app"),
  path.join(ROOT, "components"),
  path.join(ROOT, "pages"),
  path.join(ROOT, "layouts"),
];

const IGNORE_FILES = new Set([
  path.join(ROOT, "app", "components", "PPSectionHeader.vue"),
]);

const FORBIDDEN = [
  "pp-globalbilan-section-header",
  "pp-globalbilan-header",
  "home-section-header",
  // legacy “manual section header” usage in templates
  'class="pp-section-header',
  "pp-section-label",
  "pp-section-title",
  "pp-section-desc",
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function isVueFile(p) {
  return p.endsWith(".vue");
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const hits = [];
  for (const token of FORBIDDEN) {
    if (content.includes(token)) hits.push(token);
  }
  return hits;
}

const violations = [];

for (const d of SCAN_DIRS) {
  if (!fs.existsSync(d)) continue;
  const files = walk(d).filter(isVueFile);
  for (const f of files) {
    if (IGNORE_FILES.has(f)) continue;
    const hits = scanFile(f);
    if (hits.length) violations.push({ file: path.relative(ROOT, f), hits });
  }
}

if (violations.length) {
  console.error("❌ sectionheader:guard — FAIL (legacy section header classes found)");
  for (const v of violations) {
    console.error(`- ${v.file}: ${v.hits.join(", ")}`);
  }
  process.exit(1);
}

console.log("✅ sectionheader:guard — OK (no legacy section header classes found).");
