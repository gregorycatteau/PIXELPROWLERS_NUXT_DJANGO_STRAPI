#!/usr/bin/env node
/**
 * BILAN-R4 Guard — DS SectionHeader: Bilan/Hypothèses/Atterrissage/Resources
 *
 * Scope: fichiers bilan utilisant des headers
 * Règles:
 * - DOIT avoir <PPSectionHeader OU <JourneyStepHeader OU <PPBilanSection dans template
 *   (GlobalBilanEngine utilise JourneyStepHeader/PPBilanSection car c'est un orchestrateur)
 * - NE DOIT PAS avoir les classes legacy:
 *   - pp-globalbilan-section-header
 *   - pp-section-header (usage direct, pas la classe DS)
 *   - home-section-header
 * - pp-globalbilan-header est EXEMPTÉ pour GlobalBilanEngine.vue (layout wrapper DS-compatible)
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const TARGET_FILES = [
  "app/components/journey/bilan/GlobalBilanEngine.vue",
  "app/components/journey/bilan/BilanPanoramaCard.vue",
  "app/components/journey/bilan/EngagementLevelsPanel.vue",
  "app/components/journey/bilan/BilanLandingPanel.vue",
  "app/components/journey/bilan/ResourcesActionsPanel.vue",
  "app/components/journey/bilan/BilanIssuesList.vue",
  "app/components/journey/bilan/GlobalBilanExportPanel.vue",
  "app/components/journey/bilan/BilanHypothesesSection.vue",
  "app/components/journey/p1/P1HypothesesSection.vue",
];

const LEGACY_CLASSES = [
  "pp-globalbilan-section-header",
  "home-section-header",
];

// pp-globalbilan-header is exempted for GlobalBilanEngine.vue (layout wrapper)
const LEGACY_HEADER_CLASS = "pp-globalbilan-header";
const EXEMPT_FILE_FOR_HEADER_CLASS = "GlobalBilanEngine.vue";

// Regex for pp-section-header in class attribute (not BEM children like pp-section-header__title)
const LEGACY_PP_SECTION_HEADER = /class="[^"]*\bpp-section-header\b(?![-_])/;

/**
 * Extract template section from .vue file
 * Uses greedy match to capture the LAST </template> (handles nested slot templates)
 */
function extractTemplate(content) {
  // Match from first <template> to last </template>
  const templateMatch = content.match(/<template[^>]*>([\s\S]*)<\/template>/);
  return templateMatch ? templateMatch[1] : "";
}

function checkFile(filePath) {
  const fullPath = resolve(process.cwd(), filePath);
  const fileName = filePath.split("/").pop();
  
  if (!existsSync(fullPath)) {
    return { status: "skip", reason: "File not found" };
  }
  
  const content = readFileSync(fullPath, "utf-8");
  const template = extractTemplate(content);
  
  if (!template) {
    return { status: "error", reason: "No template found" };
  }
  
  const errors = [];
  
  // Check for DS header components
  // GlobalBilanEngine uses JourneyStepHeader/PPBilanSection (orchestrator pattern)
  // Other files must use PPSectionHeader
  const hasPPSectionHeader = template.includes("<PPSectionHeader");
  const hasJourneyStepHeader = template.includes("<JourneyStepHeader");
  const hasPPBilanSection = template.includes("<PPBilanSection");
  
  const hasDSHeader = hasPPSectionHeader || hasJourneyStepHeader || hasPPBilanSection;
  if (!hasDSHeader) {
    errors.push("Missing DS header component (PPSectionHeader, JourneyStepHeader, or PPBilanSection)");
  }
  
  // Check for legacy classes
  for (const legacyClass of LEGACY_CLASSES) {
    if (template.includes(legacyClass)) {
      errors.push(`Legacy class found: ${legacyClass}`);
    }
  }
  
  // Check pp-globalbilan-header (exempted for GlobalBilanEngine.vue)
  if (template.includes(LEGACY_HEADER_CLASS) && fileName !== EXEMPT_FILE_FOR_HEADER_CLASS) {
    errors.push(`Legacy class found: ${LEGACY_HEADER_CLASS}`);
  }
  
  // Check for pp-section-header (not BEM children)
  if (LEGACY_PP_SECTION_HEADER.test(template)) {
    errors.push("Legacy class found: pp-section-header (direct usage)");
  }
  
  if (errors.length > 0) {
    return { status: "fail", errors };
  }
  
  return { status: "pass" };
}

// Main
console.log("\n🛡️  BILAN-R4 Guard: Checking PPSectionHeader migration...\n");

let passed = 0;
let failed = 0;
let skipped = 0;

for (const file of TARGET_FILES) {
  console.log(`📄 Checking: ${file}`);
  const result = checkFile(file);
  
  if (result.status === "pass") {
    console.log("   ✅ PPSectionHeader present, no legacy classes");
    passed++;
  } else if (result.status === "skip") {
    console.log(`   ⏭️  Skipped: ${result.reason}`);
    skipped++;
  } else if (result.status === "error") {
    console.log(`   ⚠️  Error: ${result.reason}`);
    skipped++;
  } else {
    console.log(`   ❌ FAIL:`);
    for (const err of result.errors) {
      console.log(`      - ${err}`);
    }
    failed++;
  }
}

console.log("\n" + "─".repeat(60) + "\n");

if (failed > 0) {
  console.log(`❌ BILAN-R4 Guard FAILED — ${failed}/${TARGET_FILES.length} files non-compliant`);
  console.log("\nFix: Replace legacy header classes with <PPSectionHeader />");
  process.exit(1);
} else {
  console.log(`✅ BILAN-R4 Guard PASSED — ${passed}/${TARGET_FILES.length} files compliant`);
  if (skipped > 0) {
    console.log(`   (${skipped} skipped)`);
  }
  process.exit(0);
}
