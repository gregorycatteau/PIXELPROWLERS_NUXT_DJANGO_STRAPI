import fs from "node:fs";
import path from "node:path";

/**
 * Guard DS — PageHeader (Lot C3)
 * Objectif : verrouiller les pages légales sur PPPageHeader (page-level) et éviter
 * le retour des patterns legacy.
 */

const cwd = process.cwd();
const ROOT = path.basename(cwd) === "frontend_nuxt" ? cwd : path.resolve(cwd, "frontend_nuxt");

const FILES = [
  "app/pages/confidentialite.vue",
  "app/pages/mentions-legales.vue",
].map((p) => path.join(ROOT, p));

const FORBIDDEN = [
  "SectionIntro",
  "PrimaryCard",
  "<h1",
];

const violations = [];

for (const f of FILES) {
  if (!fs.existsSync(f)) {
    violations.push({ file: path.relative(ROOT, f), hits: ["FILE_MISSING"] });
    continue;
  }
  const content = fs.readFileSync(f, "utf8");
  const hits = [];
  for (const token of FORBIDDEN) {
    if (content.includes(token)) hits.push(token);
  }
  if (hits.length) violations.push({ file: path.relative(ROOT, f), hits });
}

if (violations.length) {
  console.error("❌ pageheaderC3:guard — FAIL (legacy page header patterns found in Lot C3)");
  for (const v of violations) {
    console.error(`- ${v.file}: ${v.hits.join(", ")}`);
  }
  process.exit(1);
}

console.log("✅ pageheaderC3:guard — OK (Lot C3 is clean).");
