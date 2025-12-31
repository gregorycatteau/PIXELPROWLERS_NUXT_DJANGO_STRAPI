import type { GlobalBilanViewModel } from '@/types/bilan';
import type { RecommendationResult } from '@/utils/reco/types';
import { normalizeForSecurityScan } from '@/utils/security/normalizeForSecurityScan';

const suspiciousKeyPatterns = [
  /answers/i,
  /responses/i,
  /questionId/i,
  /answersBy/i,
  /\bperQuestion\b/i,
  /rawAnswers/i,
  /\bp\d+_q\d+\b/i,
  /\bq\d+_/i,
  /^p[0-9]+_q/i,
  /journeyAnswers/i,
  /raw/i
];
const suspiciousValuePatterns = [
  /questionId/i,
  /\banswersBy\b/i,
  /\bperQuestion\b/i,
  /\brawAnswers\b/i,
  /\bp\d+_q\d+\b/i,
  /\bq\d+_/i,
  /"p\\d+_q\\d+"\\s*:/i,
  /p\\d+_q\\d+\\s*=/i
];

const allowedRootKeys = new Set([
  'copy',
  'axisSummaryLabel',
  'completedBlocksLabel',
  'panoramaAnsweredLabel',
  'summaryNav',
  'blocksSummaryHeading',
  'completedBlocks',
  'panorama',
  'sections',
  'modules',
  'exportPanel',
  'meta'
]);

const allowedPanoramaKeys = new Set([
  'answeredCount',
  'skippedCount',
  'completenessLabel',
  'axes',
  'blocks',
  'completedLabel'
]);

const allowedAxisKeys = new Set(['id', 'label', 'emoji', 'score', 'isPriority', 'priorityLabel', 'filledSegments']);
const allowedBlockKeys = new Set([
  'id',
  'title',
  'answeredCount',
  'skippedCount',
  'unseenCount',
  'completion',
  'isComplete',
  'detailsOpen',
  'themes'
]);
const allowedBlockThemeKeys = new Set(['name', 'average', 'count']);
const allowedIssueKeys = new Set([
  'id',
  'label',
  'icon',
  'summary',
  'summaryShort',
  'interpretation',
  'impactScore',
  'effects',
  'signals',
  'expanded'
]);
const allowedBulletKeys = new Set(['lead', 'detail']);
const allowedHypothesisKeys = new Set([
  'id',
  'index',
  'title',
  'summary',
  'signals',
  'costs',
  'tests',
  'rationaleLines',
  'firstCheck',
  'body',
  'whyItMatters',
  'detailsOpen',
  'selected',
  'disabled'
]);
const allowedLandingPlanKeys = new Set(['id', 'title', 'timeEstimate', 'steps', 'expectedOutcome', 'done']);
const allowedExportPanelKeys = new Set([
  'exportText',
  'clearMessage',
  'copied',
  'missingInfo',
  'eraseCopyLabel',
  'focusDetails',
  'hasGlobalMissing',
  'globalSkipText',
  'globalMissing'
]);
const allowedModulesKeys = new Set([
  'issues',
  'supports',
  'hypotheses',
  'landing',
  'resources',
  'actions',
  'engagement',
  'resourcesActions',
  'skipSignal'
]);
const allowedMetaKeys = new Set(['isEmpty', 'partial', 'maturity', 'exportMode']);
const allowedSectionKeys = new Set(['id', 'title', 'summary', 'state', 'itemsCount']);

function isQuestionPattern(key: string) {
  return /^p[0-9]+_q/i.test(key) || /questionId/i.test(key);
}

function validateObjectKeys(obj: Record<string, unknown>, path: string) {
  const keys = Object.keys(obj);
  const normalizedKeys = keys.map((key) => ({
    raw: key,
    normalized: normalizeForSecurityScan(key)
  }));
  if (normalizedKeys.some(({ normalized }) => suspiciousKeyPatterns.some((re) => re.test(normalized)))) {
    throw new Error('Invalid bilan VM shape.');
  }
  if (normalizedKeys.length > 1 && normalizedKeys.every(({ normalized }) => isQuestionPattern(normalized))) {
    throw new Error('Invalid bilan VM shape.');
  }

  const enforceKeys = (allowed: Set<string>) => {
    for (const k of keys) {
      if (!allowed.has(k)) {
        throw new Error('Invalid bilan VM shape.');
      }
    }
  };

  switch (path) {
    case 'root':
      enforceKeys(allowedRootKeys);
      break;
    case 'panorama':
      enforceKeys(allowedPanoramaKeys);
      break;
    case 'panorama.axes[]':
      enforceKeys(allowedAxisKeys);
      break;
    case 'panorama.blocks[]':
      enforceKeys(allowedBlockKeys);
      break;
    case 'panorama.blocks[].themes[]':
      enforceKeys(allowedBlockThemeKeys);
      break;
    case 'sections':
      enforceKeys(new Set(['reperes', 'risques', 'recommandations', 'actions']));
      break;
    case 'sections.reperes':
    case 'sections.risques':
    case 'sections.recommandations':
    case 'sections.actions':
      enforceKeys(allowedSectionKeys);
      break;
    case 'modules':
      enforceKeys(allowedModulesKeys);
      break;
    case 'modules.issues':
      enforceKeys(new Set(['list', 'watchlist', 'focusDetails', 'title', 'intro', 'emptyText']));
      break;
    case 'modules.supports':
      enforceKeys(new Set(['main', 'copy']));
      break;
    case 'modules.hypotheses':
      enforceKeys(new Set(['list', 'secondary', 'selectionCount', 'verificationPlans']));
      break;
    case 'modules.landing':
      enforceKeys(new Set(['plans', 'highlightTarget']));
      break;
    case 'modules.actions':
      enforceKeys(new Set(['hasAnyAction', 'filteredActionsByHorizon', 'copy']));
      break;
    case 'modules.engagement':
      enforceKeys(new Set(['intro', 'levels']));
      break;
    case 'modules.resourcesActions':
      enforceKeys(new Set(['recommended', 'library', 'tags']));
      break;
    case 'modules.resourcesActions.recommended[]':
    case 'modules.resourcesActions.library[]':
      enforceKeys(new Set(['id', 'kind', 'title', 'description', 'tags', 'horizon', 'effort', 'format', 'cta', 'reason']));
      break;
    case 'modules.resourcesActions.recommended[].cta':
    case 'modules.resourcesActions.library[].cta':
      enforceKeys(new Set(['type', 'label', 'target']));
      break;
    case 'modules.engagement.levels[]':
      enforceKeys(new Set(['id', 'title', 'body', 'ctaLabel', 'ctaTarget', 'routePath', 'tags', 'isRecommended']));
      break;
    case 'modules.skipSignal':
      enforceKeys(new Set(['globalSkippedCount', 'byAxis', 'copy']));
      break;
    case 'modules.skipSignal.byAxis[]':
      enforceKeys(new Set(['axisId', 'skippedCount', 'totalCount', 'show']));
      break;
    case 'exportPanel':
      enforceKeys(allowedExportPanelKeys);
      break;
    case 'meta':
      for (const k of keys) {
        if (!allowedMetaKeys.has(k)) {
          throw new Error('Invalid bilan VM shape.');
        }
      }
      break;
    case 'modules.issues.list[]':
    case 'modules.issues.watchlist[]':
      enforceKeys(allowedIssueKeys);
      break;
    case 'modules.hypotheses.list[]':
      enforceKeys(allowedHypothesisKeys);
      break;
    case 'modules.hypotheses.verificationPlans[]':
      enforceKeys(new Set(['id', 'title', 'steps']));
      break;
    case 'modules.landing.plans[]':
      enforceKeys(allowedLandingPlanKeys);
      break;
  }
}

function walk(node: unknown, path: string) {
  if (node === null || node === undefined) return;
  if (typeof node === 'string') {
    const normalized = normalizeForSecurityScan(node);
    if (suspiciousValuePatterns.some((re) => re.test(normalized))) {
      throw new Error('Invalid VM shape.');
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, `${path}[]`));
    return;
  }
  if (typeof node === 'object') {
    const record = node as Record<string, unknown>;
    validateObjectKeys(record, path);
    for (const [key, value] of Object.entries(record)) {
      const nextPath = path === 'root' ? key : `${path}.${key}`;
      walk(value, nextPath);
    }
  } else if (typeof node === 'string') {
    const normalized = normalizeForSecurityScan(node);
    if (suspiciousKeyPatterns.some((re) => re.test(normalized))) {
      throw new Error('Invalid bilan VM shape.');
    }
  }
}

export function assertNoRawAnswers(
  vm: GlobalBilanViewModel,
  extras?: { recommendations?: RecommendationResult | null; exportMarkdown?: string | null }
) {
  walk(vm, 'root');
  if (extras?.recommendations) {
    walk(extras.recommendations, 'recommendations');
  }
  if (extras?.exportMarkdown) {
    walk(extras.exportMarkdown, 'exportMarkdown');
  }
}
