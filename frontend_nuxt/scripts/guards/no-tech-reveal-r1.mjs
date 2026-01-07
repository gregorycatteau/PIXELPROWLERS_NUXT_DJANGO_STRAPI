import fs from 'node:fs';
import path from 'node:path';

// no-tech-reveal-r1:guard
//
// OBJECTIF : Empêcher l'exposition de termes techniques dans le rendu public.
// SOURCE : docs/55-qa/PX_QA_NO_TECH_REVEAL_R1.md (SSOT).

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'app');
const DOC_PATH = path.join(ROOT, '..', 'docs', '55-qa', 'PX_QA_NO_TECH_REVEAL_R1.md');

const EXCLUDED_DIRS = new Set(['.nuxt', 'node_modules', '.output', 'dist', 'scripts', 'tests']);
const ALLOWLIST_FILES = new Set([
  // Explicit exceptions (path relative to frontend_nuxt)
  'app/components/PPScale5.vue',
  'app/components/ds/catalog/PPDsCatalogAtoms.vue',
  'app/components/ds/catalog/PPDsCatalogCells.vue',
  'app/components/journey/p1/P1Bilan1E2.vue',
  'app/components/journey/p1/P1Questionnaire1E1.vue',
  'app/components/journey/p1/P1Questionnaire2E3.vue',
  'app/config/journeys/p1CopyV1_3.ts',
  'app/config/journeys/p1NarrativesV1_3.ts',
  'app/config/journeys/p1QuestionsConfig.ts',
  'app/config/journeys/p2CopyV1_0.ts',
  'app/config/journeys/p2_stubCopyV1_0.ts',
  'app/config/journeys/p3CopyV1_0.ts',
  'app/config/journeys/p3_stubCopyV1_0.ts',
  'app/config/journeys/p4CopyV1_0.ts',
  'app/config/journeys/p4_stubCopyV1_0.ts',
  'app/config/journeys/p5CopyV1_0.ts'
]);

const INLINE_ALLOW_TOKEN = 'TECH_REVEAL_OK';
const DOC_MARKER_START = '<!-- SSOT_FORBIDDEN_TERMS:START -->';
const DOC_MARKER_END = '<!-- SSOT_FORBIDDEN_TERMS:END -->';

const FALLBACK_FORBIDDEN_TERMS = [
  'api',
  'endpoint',
  'json',
  'stack trace',
  'stacktrace',
  'traceback',
  'exception',
  'typeerror',
  'referenceerror',
  'token',
  'node',
  'nuxt'
];

const isCi = () => {
  const value = String(process.env.CI || '').toLowerCase();
  return value === 'true' || value === '1' || value === 'yes';
};

const parseForbiddenTerms = (docContent) => {
  const start = docContent.indexOf(DOC_MARKER_START);
  const end = docContent.indexOf(DOC_MARKER_END);
  if (start === -1 || end === -1 || end <= start) {
    return [];
  }
  const block = docContent.slice(start + DOC_MARKER_START.length, end);
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
};

const loadForbiddenTerms = () => {
  if (!fs.existsSync(DOC_PATH)) {
    if (isCi()) {
      console.error(`❌ no-tech-reveal-r1:guard — SSOT doc missing: ${DOC_PATH}`);
      process.exit(1);
    }
    return {
      terms: FALLBACK_FORBIDDEN_TERMS,
      source: 'fallback'
    };
  }

  const docContent = fs.readFileSync(DOC_PATH, 'utf8');
  const terms = parseForbiddenTerms(docContent);
  if (!terms.length) {
    console.error('❌ no-tech-reveal-r1:guard — SSOT terms list missing or empty');
    process.exit(1);
  }
  return { terms, source: 'ssot' };
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const shouldUseBoundaries = (term) => /^[a-z0-9][a-z0-9\s-]*$/i.test(term);

const buildTermRegexes = (terms) =>
  terms.map((term) => {
    const normalized = term.trim();
    const escaped = escapeRegex(normalized).replace(/\s+/g, '\\s+');
    const withBoundaries = shouldUseBoundaries(normalized) ? `\\b${escaped}\\b` : escaped;
    return { term: normalized, regex: new RegExp(withBoundaries, 'i') };
  });

const listFiles = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        listFiles(fullPath, out);
      }
      continue;
    }
    if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (ext === '.vue' || ext === '.ts') {
        out.push(fullPath);
      }
    }
  }
  return out;
};

const extractTemplateBlocks = (content) => {
  const blocks = [];
  const regex = /<template\b[^>]*>([\s\S]*?)<\/template>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      content: match[1],
      startIndex: match.index + match[0].indexOf(match[1])
    });
  }
  return blocks;
};

const extractStringLiterals = (content) => {
  const literals = [];
  const regex = /(["'`])(?:\\.|(?!\1)[^\\])*?\1/gs;
  let match;
  while ((match = regex.exec(content)) !== null) {
    literals.push({
      content: match[0],
      startIndex: match.index
    });
  }
  return literals;
};

const lineNumberForIndex = (content, index) => {
  return content.slice(0, index).split('\n').length;
};

const scanContent = (fullContent, segmentContent, segmentStart, relPath, violations, termRegexes) => {
  for (const { term, regex } of termRegexes) {
    let match;
    const local = new RegExp(regex.source, regex.flags + 'g');
    while ((match = local.exec(segmentContent)) !== null) {
      const absoluteIndex = segmentStart + match.index;
      const line = lineNumberForIndex(fullContent, absoluteIndex);
      const lineText = fullContent.split('\n')[line - 1] ?? '';
      if (lineText.includes('xmlns=')) continue;
      if (lineText.includes(INLINE_ALLOW_TOKEN)) continue;
      const snippet = lineText.trim().slice(0, 160);
      violations.push({
        file: relPath,
        line,
        term,
        snippet
      });
    }
  }
};

const scanFile = (filePath, violations, termRegexes) => {
  const relPath = path.relative(ROOT, filePath);
  if (ALLOWLIST_FILES.has(relPath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath);

  if (ext === '.vue') {
    const blocks = extractTemplateBlocks(content);
    blocks.forEach((block) => {
      scanContent(content, block.content, block.startIndex, relPath, violations, termRegexes);
    });
    return;
  }

  if (relPath.includes(`${path.sep}config${path.sep}`) || relPath.includes(`${path.sep}data${path.sep}`)) {
    const literals = extractStringLiterals(content);
    literals.forEach((literal) => {
      scanContent(content, literal.content, literal.startIndex, relPath, violations, termRegexes);
    });
  }
};

function main() {
  const { terms, source } = loadForbiddenTerms();
  const termRegexes = buildTermRegexes(terms);
  console.log('🔍 no-tech-reveal-r1:guard — Checking public UI copy...\n');
  console.log(`   └── terms source: ${source}`);
  const files = listFiles(APP_DIR);
  const violations = [];

  files.forEach((file) => scanFile(file, violations, termRegexes));

  if (violations.length) {
    console.log('❌ no-tech-reveal-r1:guard — FAIL\n');
    violations.forEach((v) => {
      console.log(`   ❌ ${v.file}:${v.line} -> term="${v.term}"`);
      if (v.snippet) {
        console.log(`      ${v.snippet}`);
      }
    });
    process.exit(1);
  }

  console.log('✅ no-tech-reveal-r1:guard — OK');
  console.log(`   └── ${files.length} file(s) scanned`);
  console.log('');
}

main();
