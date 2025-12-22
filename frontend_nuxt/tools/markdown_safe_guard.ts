import { bilanAdapterIds, getBilanAdapter } from '../app/adapters/bilan/registry';
import { getManifestById } from '../app/config/journeys/manifests/registry';
import { useUniversalRecommendations } from '../app/composables/reco/useUniversalRecommendations';
import { buildUniversalBilanMarkdown } from '../app/utils/export/buildUniversalBilanMarkdown';
import { normalizeForSecurityScan } from '../app/utils/security/normalizeForSecurityScan';

const FORBIDDEN_SCHEMES: Array<{ scheme: string; pattern: RegExp }> = [
  { scheme: 'javascript', pattern: /javascript\s*:/i },
  { scheme: 'data', pattern: /data\s*:/i },
  { scheme: 'file', pattern: /file\s*:/i },
  { scheme: 'blob', pattern: /blob\s*:/i },
  { scheme: 'mailto', pattern: /mailto\s*:/i },
  { scheme: 'tel', pattern: /tel\s*:/i },
  { scheme: 'ws', pattern: /ws\s*:/i },
  { scheme: 'wss', pattern: /wss\s*:/i }
];

const PROTOCOL_RELATIVE = /(^|[^:])\/\//;
const JSON_DUMP_PATTERN = /\{\s*\"?(p\d+_q\d+|answersBy|rawAnswers|perQuestion)/i;
const EXTERNAL_URL_PATTERN = /https?:\/\//i;

const assertMarkdownSafe = (markdown: string) => {
  const normalized = normalizeForSecurityScan(markdown);
  if (normalized.includes('<')) {
    throw new Error('HTML-like content detected in export markdown.');
  }
  if (EXTERNAL_URL_PATTERN.test(normalized)) {
    throw new Error('External URLs are forbidden in export markdown (http/https).');
  }
  if (PROTOCOL_RELATIVE.test(normalized)) {
    throw new Error('Protocol-relative URLs are forbidden in export markdown.');
  }
  const forbiddenScheme = FORBIDDEN_SCHEMES.find((entry) => entry.pattern.test(normalized));
  if (forbiddenScheme) {
    throw new Error(`Forbidden scheme detected: ${forbiddenScheme.scheme}:.`);
  }
  if (JSON_DUMP_PATTERN.test(normalized)) {
    throw new Error('Potential JSON dump detected in export markdown.');
  }
};

const assertRejects = (value: string, messageIncludes: string) => {
  let passed = false;
  try {
    assertMarkdownSafe(value);
    passed = true;
  } catch (error) {
    if (error instanceof Error && !error.message.includes(messageIncludes)) {
      throw new Error('Markdown safe guard self-test failed.');
    }
  }
  if (passed) {
    throw new Error('Markdown safe guard self-test failed.');
  }
};

async function main() {
  try {
    assertRejects('https://example.com', 'External URLs are forbidden');
    assertRejects('javas\u200Bcript:alert(1)', 'Zero-width/invisible characters');

    for (const journeyId of bilanAdapterIds) {
      const adapter = getBilanAdapter(journeyId);
      const manifest = getManifestById(journeyId);
      if (!adapter || !manifest) continue;
      const vm = adapter.buildViewModel();
      const recommendations = useUniversalRecommendations(vm, manifest);
      const exportMarkdown = buildUniversalBilanMarkdown({ manifest, vm, recommendations });
      assertMarkdownSafe(exportMarkdown);
    }
    console.log('Markdown safe guard OK');
  } catch (error) {
    console.error('Markdown safe guard failed.');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
}

main();
