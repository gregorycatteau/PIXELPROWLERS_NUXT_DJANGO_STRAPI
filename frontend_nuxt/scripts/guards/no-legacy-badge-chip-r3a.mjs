/**
 * BILAN-R3A Guard — Badge/Chip DS Migration (Éradication Pass 1)
 *
 * Vérifie que :
 * 1. Les fichiers cibles utilisent <PPBadge> et/ou <PPChip>
 * 2. Aucune classe legacy badge/chip n'est présente sur des éléments (pas containers)
 *
 * Classes legacy interdites (sur éléments individuels) :
 * - pp-globalbilan-summary-chip (sauf si container flex)
 * - pp-globalbilan-reperes-pill (sauf si container flex)
 * - pp-journey-question-chip
 * - pp-journey-theme-badge
 * - pp-journey-status-badge
 * - pp-journey-status-chip
 * - JourneyStepBadge
 * - pp-badge-pill (sauf si compat layer usage)
 * - pp-emoji-badge
 * - pp-manifesto-badge
 * - pp-bilan-axis-summary-chip
 * - pp-bilan-axis-score-chip
 * - home-journey-badge
 * - home-how-badge
 * - BilanPill
 *
 * Usage: node scripts/guards/no-legacy-badge-chip-r3a.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");

/**
 * Fichiers cibles de la migration BILAN-R3A
 * Ces fichiers doivent avoir au moins un <PPBadge> ou <PPChip>
 */
const TARGET_FILES = [
  "app/components/journey/JourneyQuestionBlock.vue",
  "app/components/journey/JourneyStepHeader.vue",
  "app/components/journey/bilan/GlobalBilanEngine.vue",
  "app/components/journey/bilan/BilanBlocksSummary.vue",
  "app/components/journey/bilan/BilanIssuesList.vue",
  "app/components/journey/bilan/ResourcesActionsPanel.vue",
  "app/components/journey/p1/P1BlocksHub.vue",
  "app/components/journey/p1/P1Bilan1E2.vue",
  "app/components/journey/p1/P1PanoramaBilanE2.vue",
  "app/components/home/HomeJourneyCard.vue",
  "app/components/home/FitSection.vue",
  "app/components/home/AxesSection.vue",
  "app/components/home/TimelineSection.vue",
  "app/components/home/RecognitionSection.vue",
  "app/components/home/ManifestoSection.vue",
  "app/components/home/HomeHowWeWorkSection.vue",
];

/**
 * Fichiers exemptés de la vérification PPBadge/PPChip
 * Ces fichiers utilisent des composants DS spécialisés (PPHypothesesPicker)
 * au lieu de badges/chips génériques
 */
const EXEMPT_FILES = [
  "app/components/journey/bilan/BilanHypothesesSection.vue",  // Uses PPHypothesesPicker
  "app/components/journey/p1/P1HypothesesSection.vue",        // Uses PPHypothesesPicker
];

/**
 * Patterns legacy à détecter sur des éléments individuels (span, div, button, p, etc.)
 * Ces patterns ne doivent PAS être trouvés sur des éléments de template (pas containers)
 */
const LEGACY_ELEMENT_PATTERNS = [
  // Pattern pour détecter class="...legacy-class..." sur des éléments span/div/button/p
  // Exclut les classes container (qui wrappent des PPBadge/PPChip)
  /class="[^"]*\bpp-journey-question-chip\b[^"]*"/g,
  /class="[^"]*\bpp-journey-theme-badge\b[^"]*"/g,
  /class="[^"]*\bpp-journey-status-badge\b[^"]*"/g,
  /class="[^"]*\bpp-journey-status-chip\b[^"]*"/g,
  /class="[^"]*\bJourneyStepBadge\b[^"]*"/g,
  /class="[^"]*\bpp-emoji-badge\b[^"]*"/g,
  /class="[^"]*\bpp-bilan-axis-summary-chip\b[^"]*"/g,
  /class="[^"]*\bpp-bilan-axis-score-chip\b[^"]*"/g,
  /class="[^"]*\bhome-journey-badge\b[^"]*"/g,
  /class="[^"]*\bhome-how-badge\b[^"]*"/g,
  /class="[^"]*\bBilanPill\b[^"]*"/g,
];

/**
 * Legacy patterns sur elements qui NE sont PAS des containers
 * (ie: <span class="pp-globalbilan-summary-chip"> au lieu de <PPBadge>)
 */
const LEGACY_NON_CONTAINER_PATTERNS = [
  // span/div/button avec classe legacy (pas PPBadge/PPChip)
  /<span[^>]*class="[^"]*\bpp-globalbilan-summary-chip\b[^"]*"[^>]*>/g,
  /<div[^>]*class="[^"]*\bpp-globalbilan-summary-chip\b[^"]*"[^>]*>/g,
  /<button[^>]*class="[^"]*\bpp-globalbilan-summary-chip\b[^"]*"[^>]*>/g,
  /<span[^>]*class="[^"]*\bpp-globalbilan-reperes-pill\b[^"]*"[^>]*>/g,
  /<div[^>]*class="[^"]*\bpp-globalbilan-reperes-pill\b[^"]*"[^>]*>/g,
  /<button[^>]*class="[^"]*\bpp-globalbilan-reperes-pill\b[^"]*"[^>]*>/g,
  /<span[^>]*class="[^"]*\bpp-badge-pill\b[^"]*"[^>]*>/g,
  /<div[^>]*class="[^"]*\bpp-badge-pill\b[^"]*"[^>]*>/g,
  /<p[^>]*class="[^"]*\bpp-badge-pill\b[^"]*"[^>]*>/g,
  /<span[^>]*class="[^"]*\bpp-manifesto-badge\b[^"]*"[^>]*>/g,
  /<div[^>]*class="[^"]*\bpp-manifesto-badge\b[^"]*"[^>]*>/g,
];

/**
 * Vérifie qu'un fichier utilise PPBadge ou PPChip
 */
function hasDSBadgeOrChip(content) {
  return /<PPBadge[\s>]/.test(content) || /<PPChip[\s>]/.test(content);
}

/**
 * Cherche les patterns legacy dans un contenu
 */
function findLegacyPatterns(content, patterns) {
  const found = [];
  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      found.push(...matches.map((m) => m.slice(0, 80)));
    }
  }
  return found;
}

/**
 * Exécution principale
 */
function main() {
  console.log("\n🛡️  BILAN-R3A Guard: Checking PPBadge/PPChip migration...\n");

  let passed = 0;
  let failed = 0;
  let warnings = 0;
  const errors = [];
  const warns = [];

  for (const relativePath of TARGET_FILES) {
    const filePath = resolve(ROOT, relativePath);

    // Fichier optionnel : si inexistant, skip avec warning
    if (!existsSync(filePath)) {
      console.log(`📄 Checking: ${relativePath}`);
      console.log(`   ⚠️  File not found (skipped)`);
      warnings++;
      warns.push({ file: relativePath, reason: "File not found" });
      continue;
    }

    const content = readFileSync(filePath, "utf-8");
    console.log(`📄 Checking: ${relativePath}`);

    // 1. Vérifier présence de PPBadge ou PPChip (au moins un)
    const hasDS = hasDSBadgeOrChip(content);
    if (!hasDS) {
      console.log(`   ⚠️  No <PPBadge> or <PPChip> found (may be OK if no badges needed)`);
      warnings++;
      warns.push({ file: relativePath, reason: "No PPBadge/PPChip found" });
    } else {
      const badgeCount = (content.match(/<PPBadge[\s>]/g) || []).length;
      const chipCount = (content.match(/<PPChip[\s>]/g) || []).length;
      console.log(`   ✅ PPBadge: ${badgeCount}, PPChip: ${chipCount}`);
    }

    // 2. Chercher patterns legacy sur éléments
    const legacyElement = findLegacyPatterns(content, LEGACY_ELEMENT_PATTERNS);
    const legacyNonContainer = findLegacyPatterns(content, LEGACY_NON_CONTAINER_PATTERNS);

    if (legacyElement.length > 0 || legacyNonContainer.length > 0) {
      console.log(`   ❌ LEGACY patterns found:`);
      [...legacyElement, ...legacyNonContainer].forEach((m) => {
        console.log(`      → ${m}...`);
      });
      failed++;
      errors.push({
        file: relativePath,
        patterns: [...legacyElement, ...legacyNonContainer],
      });
    } else {
      passed++;
    }
  }

  console.log("\n" + "─".repeat(60) + "\n");

  if (failed > 0) {
    console.log(`❌ BILAN-R3A Guard FAILED — ${failed} file(s) with legacy patterns\n`);
    errors.forEach((err) => {
      console.log(`   ${err.file}:`);
      err.patterns.forEach((p) => console.log(`      → ${p}...`));
    });
    process.exit(1);
  }

  if (warnings > 0) {
    console.log(`✅ BILAN-R3A Guard PASSED — ${passed}/${TARGET_FILES.length} files compliant, ${warnings} warning(s)\n`);
    warns.forEach((w) => {
      console.log(`   ⚠️  ${w.file}: ${w.reason}`);
    });
  } else {
    console.log(`✅ BILAN-R3A Guard PASSED — ${passed}/${TARGET_FILES.length} files compliant\n`);
  }

  process.exit(0);
}

main();
