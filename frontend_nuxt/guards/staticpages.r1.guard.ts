import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'app/pages');
const TARGET_PAGES = ['a-propos.vue', 'mentions-legales.vue', 'confidentialite.vue', 'accessibilite.vue'];
const ALLOWED_CLASS_PREFIX = 'pp-';
const ALLOWED_CLASS_TOKENS = new Set(['sr-only']);

// Extrait le contenu du template d'un fichier Vue.
const extractTemplate = (content: string): string => {
  const match = content.match(/<template>([\s\S]*?)<\/template>/);
  return match?.[1] ?? '';
};

// Vérifie la présence des composants DS obligatoires.
const hasRequiredComponents = (template: string): { missing: string[] } => {
  const missing: string[] = [];
  if (!template.includes('<PPStaticPageShell')) missing.push('PPStaticPageShell');
  if (!template.includes('<PPPageHeader')) missing.push('PPPageHeader');
  return { missing };
};

// Récupère les violations de classes non-DS (sans préfixe pp-).
const findClassViolations = (template: string): string[] => {
  const violations: string[] = [];
  const classAttrRe = /\bclass\s*=\s*["']([^"']+)["']/g;
  let match: RegExpExecArray | null;

  while ((match = classAttrRe.exec(template))) {
    const tokens = match[1].split(/\s+/).filter(Boolean);
    for (const token of tokens) {
      if (token.startsWith(ALLOWED_CLASS_PREFIX)) continue;
      if (ALLOWED_CLASS_TOKENS.has(token)) continue;
      violations.push(token);
    }
  }

  if (template.includes(':class=')) {
    violations.push('class:dynamic');
  }

  return violations;
};

// Détecte des couleurs hardcodées dans le template.
const hasHardcodedColors = (template: string): boolean => {
  return /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(/.test(template);
};

// Normalise un chemin pour l'affichage dans la console.
const toRel = (filePath: string): string => path.relative(process.cwd(), filePath).replaceAll('\\', '/');

// Exécute la validation complète des pages statiques ciblées.
const runGuard = async (): Promise<void> => {
  const violations: string[] = [];

  for (const page of TARGET_PAGES) {
    const filePath = path.join(ROOT, page);
    const content = await fs.readFile(filePath, 'utf8');
    const template = extractTemplate(content);

    const { missing } = hasRequiredComponents(template);
    if (missing.length) {
      violations.push(`❌ ${toRel(filePath)} missing: ${missing.join(', ')}`);
    }

    if (content.includes('<style')) {
      violations.push(`❌ ${toRel(filePath)} contains <style> (classes locales interdites)`);
    }

    const classViolations = findClassViolations(template);
    if (classViolations.length) {
      violations.push(`❌ ${toRel(filePath)} class tokens non DS: ${Array.from(new Set(classViolations)).join(', ')}`);
    }

    if (hasHardcodedColors(template)) {
      violations.push(`❌ ${toRel(filePath)} contains hardcoded colors in template`);
    }
  }

  if (violations.length) {
    console.error('❌ staticpages:r1:guard — FAIL');
    for (const violation of violations) {
      console.error(violation);
    }
    process.exit(1);
  }

  console.log('✅ staticpages:r1:guard — OK');
};

runGuard().catch((error) => {
  console.error('❌ staticpages:r1:guard — FAIL');
  console.error(error);
  process.exit(1);
});
