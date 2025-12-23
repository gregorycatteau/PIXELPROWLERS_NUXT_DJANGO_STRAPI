/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

/**
 * Extrait le contenu du <template>...</template> d’un SFC Vue.
 * On scanne UNIQUEMENT le template pour éviter les faux positifs (style/script/comments).
 * @param {string} sfc
 * @returns {string|null}
 */
function extractTemplate(sfc) {
  const m = sfc.match(/<template\b[^>]*>([\s\S]*?)<\/template>/i);
  return m ? m[1] : null;
}

/**
 * Calcule un numéro de ligne 1-based à partir d’un index.
 * @param {string} text
 * @param {number} idx
 * @returns {number}
 */
function lineNumberAt(text, idx) {
  return text.slice(0, Math.max(0, idx)).split("\n").length;
}

/**
 * Guard Q1 : interdit toute occurrence de `pp-likert-` dans les templates
 * des composants "scale" (Q1). STRICT++ (pas d’allowlist).
 *
 * Note : on cible volontairement les fichiers de scale pour éviter d’embarquer
 * d’autres patterns (skip/nav) qui seront migrés en Q4.
 */
const TARGET_FILES = [
  "app/components/journey/questionnaire/LikertScaleFiveSteps.vue",
  "app/components/journey/LikertScale.vue",
];

const FORBIDDEN = "pp-likert-";

let violations = [];

for (const rel of TARGET_FILES) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    violations.push({
      file: rel,
      line: 1,
      excerpt: `FILE_MISSING: ${rel}`,
    });
    continue;
  }

  const raw = fs.readFileSync(abs, "utf8");
  const tpl = extractTemplate(raw);

  if (!tpl) {
    violations.push({
      file: rel,
      line: 1,
      excerpt: "NO_TEMPLATE_BLOCK_FOUND",
    });
    continue;
  }

  let idx = 0;
  while (true) {
    const hit = tpl.indexOf(FORBIDDEN, idx);
    if (hit === -1) break;

    const ln = lineNumberAt(tpl, hit);
    const start = Math.max(0, hit - 40);
    const end = Math.min(tpl.length, hit + 80);
    const excerpt = tpl.slice(start, end).replace(/\s+/g, " ").trim();

    violations.push({ file: rel, line: ln, excerpt });
    idx = hit + FORBIDDEN.length;
  }
}

if (violations.length) {
  console.error("❌ scale:guard — FAILED (legacy Likert classes found in templates)");
  for (const v of violations) {
    console.error(`- ${v.file}:${v.line} :: ${v.excerpt}`);
  }
  process.exit(1);
}

console.log("✅ scale:guard — OK (no legacy Likert classes found in scale templates).");
