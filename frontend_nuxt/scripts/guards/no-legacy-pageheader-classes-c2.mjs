import fs from "node:fs";
import path from "node:path";

/**
 * Guard DS — PageHeader (Lot C2 Home hero)
 * Objectif : s'assurer que le hero Home n'utilise plus de <h1> legacy et passe par PPPageHeader.
 */

const cwd = process.cwd();
const ROOT = path.basename(cwd) === "frontend_nuxt" ? cwd : path.resolve(cwd, "frontend_nuxt");
const FILE = path.join(ROOT, "app/components/home/HomeHeroSection.vue");

if (!fs.existsSync(FILE)) {
  console.error("❌ pageheaderC2:guard — FAIL (HomeHeroSection.vue missing)");
  process.exit(1);
}

const content = fs.readFileSync(FILE, "utf8");

// Ce guard est volontairement minimaliste : on verrouille l'essentiel.
const MUST_HAVE = ["<PPPageHeader", 'as="h1"'];
const FORBIDDEN = ["<h1"];

const missing = MUST_HAVE.filter((t) => !content.includes(t));
const hits = FORBIDDEN.filter((t) => content.includes(t));

if (missing.length || hits.length) {
  console.error("❌ pageheaderC2:guard — FAIL (Home hero page header not DS-compliant)");
  if (missing.length) console.error(`- Missing: ${missing.join(", ")}`);
  if (hits.length) console.error(`- Forbidden: ${hits.join(", ")}`);
  process.exit(1);
}

console.log("✅ pageheaderC2:guard — OK (Home hero uses PPPageHeader and no legacy <h1>).");
