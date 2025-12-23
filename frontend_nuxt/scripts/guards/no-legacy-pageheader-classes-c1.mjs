import fs from "node:fs";
import path from "node:path";

/**
 * Guard DS — PageHeader (Lot C1)
 * Objectif : verrouiller la migration page-level sur un périmètre réduit (pages statiques).
 * On interdit le retour des patterns legacy (SectionIntro/PrimaryCard + <h1> en dur).
 *
 * Scope : uniquement les 6 fichiers Lot C1.
 * (Les lots C2/C3 seront guardés plus tard.)
 */

const cwd = process.cwd();
const ROOT = path.basename(cwd) === "frontend_nuxt" ? cwd : path.resolve(cwd, "frontend_nuxt");

const FILES = [
  "app/pages/accompagnement-formation.vue",
  "app/pages/a-propos.vue",
  "app/pages/relinium.vue",
  "app/pages/contact.vue",
  "app/pages/blog.vue",
  "app/pages/ressources.vue",
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
  console.error("❌ pageheaderC1:guard — FAIL (legacy page header patterns found in Lot C1)");
  for (const v of violations) {
    console.error(`- ${v.file}: ${v.hits.join(", ")}`);
  }
  process.exit(1);
}

console.log("✅ pageheaderC1:guard — OK (Lot C1 is clean).");
