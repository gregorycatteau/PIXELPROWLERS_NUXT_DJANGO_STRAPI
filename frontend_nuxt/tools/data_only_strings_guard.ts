import { listManifests } from '../app/config/journeys/manifests/registry';
import { listResources, listActions } from '../app/config/resources/registry';
import { listEngagementPacks } from '../app/config/engagement/registry';
import { assertSafeDataOnlyString } from '../app/utils/security/safeText';
import { validateFilePath } from '../app/config/resources/allowlist';
import { validateRoutePath } from '../app/config/engagement/allowlist';
import { p2Copy } from '../app/config/journeys/p2CopyV1_0';
import { p3Copy } from '../app/config/journeys/p3CopyV1_0';
import { p4Copy } from '../app/config/journeys/p4CopyV1_0';
import { p1Copy, P1_SKIP_COPY, P1_ERASE_COPY } from '../app/config/journeys/p1CopyV1_3';
import { P1_ACTION_PLAN_COPY, P1_GLOBAL_ISSUES_COPY, P1_GLOBAL_SUPPORTS_COPY } from '../app/config/journeys/p1NarrativesV1_3';
import { p1EngagementCopy } from '../app/config/journeys/p1EngagementCopy';
import { P1_EXPORT_COPY } from '../app/config/journeys/p1ExportCopyV1_3';
import { P1_ACTION_SECTION_COPY, P1_ACTION_HORIZON_COPY, P1_ACTION_MODE_TAGS, P1_ACTION_SAFETY_COPY } from '../app/config/journeys/p1ActionCopyV1_0';
import { p2PanoramaQuestions } from '../app/config/journeys/p2QuestionsV1_0';
import { p3PanoramaQuestions } from '../app/config/journeys/p3QuestionsV1_0';
import { p4PanoramaQuestions } from '../app/config/journeys/p4QuestionsV1_0';

const SELF_TEST_PAYLOADS = [
  '<script>alert(1)</script>',
  'javascript:alert(1)',
  'data:text/html;base64,PHNjcmlwdD4=',
  'mailto:test@example.org',
  'tel:+33600000000',
  'blob:deadbeef',
  'file:///etc/passwd',
  'ws://evil',
  'wss://evil',
  'http://evil',
  'https://evil',
  '//evil.com',
  'text with \u0007 bell'
];

const assertRejects = (value: string) => {
  let passed = false;
  try {
    assertSafeDataOnlyString(value);
    passed = true;
  } catch {
    // expected
  }
  if (passed) {
    throw new Error('Data-only guard self-test failed.');
  }
};

const walk = (node: unknown) => {
  if (node === null || node === undefined) return;
  if (typeof node === 'string') {
    assertSafeDataOnlyString(node);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child));
    return;
  }
  if (typeof node === 'object') {
    Object.values(node as Record<string, unknown>).forEach((value) => walk(value));
  }
};

const main = () => {
  try {
    SELF_TEST_PAYLOADS.forEach(assertRejects);

    const manifests = listManifests();
    const resources = listResources();
    const actions = listActions();
    const engagement = listEngagementPacks();

    manifests.forEach((manifest) => walk(manifest));
    resources.forEach((resource) => {
      walk(resource);
      validateFilePath(resource.filePath);
    });
    actions.forEach((action) => {
      walk(action);
      if (action.filePath) {
        validateFilePath(action.filePath);
      }
    });
    engagement.forEach((entry) => {
      walk(entry);
      Object.values(entry.pack.levels).forEach((level) => {
        if (level.routePath) {
          validateRoutePath(level.routePath);
        }
      });
    });

    [
      p1Copy,
      P1_SKIP_COPY,
      P1_ERASE_COPY,
      P1_ACTION_PLAN_COPY,
      P1_GLOBAL_ISSUES_COPY,
      P1_GLOBAL_SUPPORTS_COPY,
      p1EngagementCopy,
      P1_EXPORT_COPY,
      P1_ACTION_SECTION_COPY,
      P1_ACTION_HORIZON_COPY,
      P1_ACTION_MODE_TAGS,
      P1_ACTION_SAFETY_COPY,
      p2Copy,
      p3Copy,
      p4Copy,
      p2PanoramaQuestions,
      p3PanoramaQuestions,
      p4PanoramaQuestions
    ].forEach((payload) => walk(payload));

    console.log('Data-only guard OK');
  } catch {
    console.error('Data-only guard failed.');
    process.exit(1);
  }
};

main();
