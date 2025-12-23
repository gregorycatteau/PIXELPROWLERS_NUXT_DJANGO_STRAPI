import fs from 'node:fs';
import path from 'node:path';
import { NO_V_HTML_ALLOWLIST } from './guard_allowlist/no_v_html_allowlist';

/**
 * no_v_html_guard.ts
 * 
 * Détecte les utilisations de v-html dans les templates Vue.
 * 
 * RÈGLES:
 * - Interdit: v-html="..." dans les templates .vue
 * - Interdit: innerHTML dans les fichiers .ts/.js (manipulation DOM directe)
 * 
 * EXCLUSIONS AUTOMATIQUES:
 * - Commentaires JSDoc/bloc (mentions documentaires de "v-html")
 * - Strings contenant "v-html" (ex: messages d'erreur)
 * - Fichiers dans NO_V_HTML_ALLOWLIST
 * 
 * @see docs/40-security/ARCHITECTURE_SECURITE.md
 */

const TARGETS = ['app/components', 'app/pages', 'app/layouts', 'app'];

// Pattern pour détecter VRAI usage de v-html dans templates Vue
// Match: v-html= ou v-html = (avec espaces optionnels avant le =)
const PATTERN_V_HTML_DIRECTIVE = /v-html\s*=/;

// Pattern pour détecter innerHTML (manipulation DOM directe)
const PATTERN_INNER_HTML = /\.innerHTML\s*=/;

// Exclure les fichiers non-runtime
const EXCLUDED_EXTENSIONS = ['.md', '.json', '.css', '.scss', '.txt', '.yml', '.yaml'];

const collectFiles = (dir: string, files: string[] = []) => {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    
    // Skip .nuxt, node_modules, dist, .output
    if (
      fullPath.includes(`${path.sep}.nuxt${path.sep}`) ||
      fullPath.includes(`${path.sep}node_modules${path.sep}`) ||
      fullPath.includes(`${path.sep}dist${path.sep}`) ||
      fullPath.includes(`${path.sep}.output${path.sep}`)
    ) {
      continue;
    }
    
    if (entry.isDirectory()) {
      collectFiles(fullPath, files);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (!EXCLUDED_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
};

/**
 * Extrait le <template> d'un fichier .vue
 * Pour les .vue, on ne veut scanner que le template, pas les commentaires JS
 */
const extractVueTemplate = (content: string): string | null => {
  // Greedy match pour capturer tout jusqu'au dernier </template>
  const match = content.match(/<template[^>]*>([\s\S]*)<\/template>/);
  return match ? match[1] : null;
};

/**
 * Vérifie si un fichier contient des usages dangereux
 */
const checkFile = (filePath: string): { hasViolation: boolean; line?: number; pattern?: string } => {
  const content = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath);
  
  // Pour les fichiers .vue, scanner uniquement le template
  if (ext === '.vue') {
    const template = extractVueTemplate(content);
    if (template && PATTERN_V_HTML_DIRECTIVE.test(template)) {
      // Trouver la ligne
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (PATTERN_V_HTML_DIRECTIVE.test(lines[i])) {
          return { hasViolation: true, line: i + 1, pattern: 'v-html=' };
        }
      }
      return { hasViolation: true, pattern: 'v-html=' };
    }
  }
  
  // Pour les fichiers .ts/.js, vérifier innerHTML
  if (ext === '.ts' || ext === '.js') {
    if (PATTERN_INNER_HTML.test(content)) {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (PATTERN_INNER_HTML.test(lines[i])) {
          return { hasViolation: true, line: i + 1, pattern: '.innerHTML=' };
        }
      }
      return { hasViolation: true, pattern: '.innerHTML=' };
    }
  }
  
  return { hasViolation: false };
};

const main = () => {
  console.log('🔍 no-v-html Guard — Checking for unsafe HTML directives...\n');
  
  const cwd = process.cwd();
  const files = TARGETS.flatMap((target) => collectFiles(path.join(cwd, target)));
  
  const violations: Array<{ file: string; line?: number; pattern?: string }> = [];
  
  for (const file of files) {
    // Check allowlist (relative path)
    const relativePath = path.relative(cwd, file);
    if (NO_V_HTML_ALLOWLIST.includes(relativePath) || NO_V_HTML_ALLOWLIST.includes(file)) {
      continue;
    }
    
    const result = checkFile(file);
    if (result.hasViolation) {
      violations.push({
        file: relativePath,
        line: result.line,
        pattern: result.pattern,
      });
    }
  }

  if (violations.length > 0) {
    console.log('❌ no-v-html Guard FAILED — Violations found:\n');
    for (const v of violations) {
      const location = v.line ? `:${v.line}` : '';
      console.log(`   • ${v.file}${location} — ${v.pattern}`);
    }
    console.log('\n📚 Fix: Remove v-html directive and use safe alternatives:');
    console.log('   - Text content: {{ variable }} or v-text');
    console.log('   - Line breaks: whitespace-pre-line + plain text');
    console.log('   - Rich text: decompose into structured data + components');
    console.log('');
    process.exit(1);
  }

  console.log(`✅ no-v-html Guard PASSED — ${files.length} files scanned, no violations`);
  console.log('   ├── No v-html= in Vue templates');
  console.log('   ├── No .innerHTML= in TypeScript');
  console.log('   └── Comments/docs with "v-html" mentions are allowed');
  console.log('');
  process.exit(0);
};

main();
