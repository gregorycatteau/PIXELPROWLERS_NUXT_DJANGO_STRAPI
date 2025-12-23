import fs from "node:fs";
import path from "node:path";

/**
 * Guard DS — Badge (Lot B)
 * Objectif : empêcher la réintroduction de classes legacy migrées vers <PPBadge>.
 * IMPORTANT : ne couvre PAS le Lot C (chips/boutons) volontairement.
 */

const ROOT = path.resolve(process.cwd(), "frontend_nuxt");
const SCAN_DIRS = [
  path.join(ROOT, "app"),
  path.join(ROOT, "components"),
  path.join(ROOT, "pages"),
  path.join(ROOT, "layouts"),
];

const FORBIDDEN = [
  "JourneyStepBadge",
  "pp-journey-question-chip",
  "pp-journey-theme-badge",
  "pp-journey-status-badge",
  "pp-journey-status-chip",
  "BilanPill",
  "pp-bilan-axis-score-chip",
  "home-journey-badge",
  "pp-journey-card-title-chip",
  "pp-emoji-badge",
  "pp-manifesto-badge",
  "home-how-badge",
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
    const hits = scanFile(f);
    if (hits.length) violations.push({ file: path.relative(ROOT, f), hits });
  }
}

if (violations.length) {
  console.error("❌ badgeB:guard — FAIL (legacy badge classes found)");
  for (const v of violations) {
    console.error(`- ${v.file}: ${v.hits.join(", ")}`);
  }
  process.exit(1);
}

console.log("✅ badgeB:guard — OK (no legacy Lot B badge classes found).");
