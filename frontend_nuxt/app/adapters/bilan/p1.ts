import { computed, ref } from 'vue';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { useP1Export } from '~/composables/useP1Export';
import { useJourneyDiagnostics } from '~/composables/useJourneyDiagnostics';
import type { P1BlockScores, P1BlockBands, P1TensionBand } from '~/composables/useJourneyDiagnostics';
import { useP1ActionPlan } from '@/composables/useP1ActionPlan';
import { useP1GlobalNarrative } from '@/composables/useP1GlobalNarrative';
import { P1_BLOCK_IDS, p1BlockContent, p1BlockThemes, p1Copy } from '~/config/journeys/p1QuestionsConfig';
import { p1EngagementCopy } from '~/config/journeys/p1EngagementCopy';
import {
  P1_ERASE_COPY,
  P1_GLOBAL_SKIP_SUMMARY,
  P1_MISSING_COPY
} from '@/config/journeys/p1CopyV1_3';
import { P1_ACTION_PLAN_COPY, P1_GLOBAL_ISSUES_COPY, P1_GLOBAL_SUPPORTS_COPY } from '@/config/journeys/p1NarrativesV1_3';
import { useP1Hypotheses } from '@/composables/useP1Hypotheses';
import { useP1SystemicLanding } from '@/composables/useP1SystemicLanding';
import { useP1SystemicFollowups } from '@/composables/useP1SystemicFollowups';
import { P1_SYSTEMIC_FOLLOWUPS } from '@/config/journeys/p1SystemicFollowupsV1_3';
import { P1_EXPORT_COPY } from '@/config/journeys/p1ExportCopyV1_3';
import { useP1Resources } from '@/composables/useP1Resources';
import { P1_SYSTEM_SCALPELS_COPY } from '@/config/journeys/p1SystemScalpelsCopyV1_3';
import type { JourneyBilanAdapter } from './types';
import type { GlobalBilanViewModel, BilanIssueBullet } from '@/types/bilan';

type SystemicScalpelCopy = (typeof P1_SYSTEM_SCALPELS_COPY)[keyof typeof P1_SYSTEM_SCALPELS_COPY];
type AxisId = 'human' | 'movement' | 'decisions' | 'structure';
type BlockSummary = {
  id: string;
  title: string;
  answeredCount: number;
  skippedCount: number;
  unseenCount: number;
  themes: { name: string; average: number; count: number }[];
};
type Hypothesis = ReturnType<typeof useP1Hypotheses>['mainHypotheses']['value'][number] & { whyItMatters?: string };
type Issue = {
  id: string;
  label: string;
  summary?: string;
  interpretation?: string;
  band?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
};

const axisOrder: AxisId[] = ['human', 'movement', 'decisions', 'structure'];
const axisEmojis: Record<AxisId, string> = {
  human: '🤝',
  movement: '🔄',
  decisions: '🧭',
  structure: '🧱'
};
const axisDisplayLabels: Record<AxisId, string> = {
  human: 'Humain',
  movement: 'Mouvement',
  decisions: 'Décisions',
  structure: 'Structure'
};
const issueIconMap: Record<string, string> = {
  'Sécurité psychologique': '🤝',
  'Charge et fatigue': '🔋',
  'Prévisibilité du quotidien': '🧾',
  'Justice / équité': '⚖️'
};

const issueIcon = (label: string) => issueIconMap[label] ?? '📌';
const splitSentences = (text?: string) => {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
};
const issueSummaryShort = (issue: Issue) => splitSentences(issue.summary)[0] || issue.summary || '';
const issueEffects = (issue: Issue) => {
  const parts = splitSentences(issue.interpretation);
  return parts.slice(0, 3).length ? parts.slice(0, 3) : parts;
};
const issueSignals = (issue: Issue) => {
  const parts = splitSentences(issue.summary);
  return parts.slice(0, 2).length ? parts.slice(0, 2) : parts;
};
const toBullet = (text: string): BilanIssueBullet => {
  const separators = [':', '—', '–', ' - '];
  for (const sep of separators) {
    const idx = text.indexOf(sep);
    if (idx > 0) {
      const lead = text.slice(0, idx).trim();
      const detail = text.slice(idx + sep.length).trim();
      return { lead, detail };
    }
  }
  const words = text.split(' ');
  if (words.length > 2) {
    return { lead: words.slice(0, 2).join(' '), detail: words.slice(2).join(' ') };
  }
  return { lead: text };
};
const issueEffectsBullets = (issue: Issue): BilanIssueBullet[] => issueEffects(issue).map((p) => toBullet(p));
const issueSignalsBullets = (issue: Issue): BilanIssueBullet[] => issueSignals(issue).map((p) => toBullet(p));
const issueImpactScore = (issue: Issue) => {
  if (issue.band === 'very_high') return 5;
  if (issue.band === 'high') return 4;
  if (issue.band === 'medium') return 3;
  if (issue.band === 'very_low') return 1;
  return 2;
};
const hypothesisWhyItMatters = (hypo: Hypothesis) => (hypo as any).whyItMatters ?? '';
const hypothesisSummary = (hypo: Hypothesis) => splitSentences(hypo.body)[0] || hypo.body || '';
const hypothesisSignalsBullets = (hypo: Hypothesis): BilanIssueBullet[] =>
  (hypo.rationaleLines ?? []).slice(0, 2).map((line) => toBullet(line));
const hypothesisCostBullets = (hypo: Hypothesis): BilanIssueBullet[] => {
  const first = splitSentences(hypothesisWhyItMatters(hypo))[0];
  return first ? [toBullet(first)] : [];
};
const hypothesisTestBullets = (hypo: Hypothesis): BilanIssueBullet[] => (hypo.firstCheck ? [toBullet(hypo.firstCheck)] : []);
const verificationPlan = (hypo: Hypothesis) => [
  `Relire les signaux typiques de "${hypo.title}" dans ton contexte`,
  `Test rapide : ${hypo.firstCheck ?? 'faire une observation de 15 min sur ce point'}`,
  'Noter ce qui change et décider si tu confirmes ou infirme cette hypothèse'
];

const landingPlans: Record<
  string,
  { title: string; timeEstimate: string; steps: string[]; expectedOutcome: string }
> = {
  mission_cash_arbitrage: {
    title: 'Mission vs cash : clarifier un arbitrage',
    timeEstimate: '20–40 min',
    steps: [
      'Choisir une décision récente où mission et cash ont divergé',
      'Écrire qui tranche et selon quels critères minimalistes',
      'Tester l’annonce de cet arbitrage sur 1 périmètre restreint'
    ],
    expectedOutcome: 'Tu sauras si un arbitrage explicite stabilise la charge et la cohérence.'
  },
  gouvernance_floue: {
    title: 'Rendre visible qui décide quoi',
    timeEstimate: '20–30 min',
    steps: [
      'Lister 2 décisions sensibles et leurs pilotes',
      'Rendre visibles les règles minimales (qui décide, sur quoi, comment contester)',
      'Tester cette fiche auprès de l’équipe concernée'
    ],
    expectedOutcome: 'Tu sauras si la clarté réduit les contournements et la tension.'
  },
  coulisses_et_opacite: {
    title: 'Tracer une décision “coulisses”',
    timeEstimate: '20–30 min',
    steps: [
      'Choisir une décision opaque récente',
      'Documenter qui a proposé, tranché, et sur quels critères',
      'Partager et collecter 2 retours sur la lisibilité'
    ],
    expectedOutcome: 'Tu sauras si rendre la trace apaise les doutes ou révèle un blocage.'
  },
  dependance_mortelle: {
    title: 'Sécuriser une dépendance critique',
    timeEstimate: '20–30 min',
    steps: [
      'Identifier la dépendance la plus risquée',
      'Définir un plan B minimal (doublon, doc, relais)',
      'Tester le relais sur un cas simple'
    ],
    expectedOutcome: 'Tu sauras si le plan B tient et réduit le risque immédiat.'
  }
};

const computeBlockAverage = (block?: P1BlockScores | null) => {
  if (!block) return null;
  const totals = Object.values(block.themes ?? {}).reduce(
    (acc, theme) => {
      acc.total += (theme.average ?? 0) * (theme.count ?? 0);
      acc.count += theme.count ?? 0;
      return acc;
    },
    { total: 0, count: 0 }
  );
  if (!totals.count) return null;
  return totals.total / totals.count;
};
const mapAverageToBand = (avg: number | null): P1TensionBand | undefined => {
  if (avg === null) return undefined;
  const tensionScore = Math.min(4, Math.max(0, avg - 1));
  const rounded = Math.round(tensionScore);
  if (rounded <= 1) return 'low';
  if (rounded === 2) return 'medium';
  if (rounded === 3) return 'high';
  return 'very_high';
};
const blockCompletion = (block: BlockSummary) => {
  const total = (block.answeredCount ?? 0) + (block.skippedCount ?? 0) + (block.unseenCount ?? 0);
  if (!total) return 0;
  return Math.round(((block.answeredCount ?? 0) / total) * 100);
};
const isBlockComplete = (block: BlockSummary) =>
  (block.skippedCount ?? 0) === 0 && (block.unseenCount ?? 0) === 0 && (block.answeredCount ?? 0) > 0;

export const p1BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p1',
  buildViewModel(): GlobalBilanViewModel {
    const storage = useDiagnosticStorage({ journeyId: 'p1' });
    const scores = computed(() => storage.scores.value ?? {});
    const { buildExportText } = useP1Export();
    const { mainHypotheses, secondaryHypotheses, toMarkdownHypotheses } = useP1Hypotheses();
    const { mainCards, secondaryCards, toMarkdownSystemic } = useP1SystemicLanding();
    const { recommendedResources } = useP1Resources();
    const systemicFollowups = useP1SystemicFollowups(() => mainCards.value.map((c) => c.id));
    const { mainIssues, mainSupports } = useP1GlobalNarrative();
    const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', blockThemeMap: p1BlockThemes });
    const exportMode = ref<'minimal' | 'full'>('minimal');
    const focusDetails = ref(false);

    const axisSummary = computed(() =>
      axisOrder.map((axisId) => ({
        id: axisId,
        label: axisDisplayLabels[axisId],
        value: scores.value.panorama?.[axisId] ?? 0
      }))
    );
    const axisScore = (axisId: AxisId) => scores.value.panorama?.[axisId] ?? 0;
    const panoramaAxesSorted = computed(() =>
      axisOrder
        .map((axisId, order) => ({ id: axisId, score: axisScore(axisId), order }))
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.order - b.order;
        })
    );
    const panoramaMaxScore = computed(() =>
      panoramaAxesSorted.value.reduce((acc, axis) => Math.max(acc, axis.score), 0)
    );
    const priorityAxisIds = computed(() =>
      panoramaAxesSorted.value
        .filter((axis) => axis.score === panoramaMaxScore.value && panoramaMaxScore.value >= 4)
        .map((axis) => axis.id)
    );
    const filledSegments = (score: number) => Math.max(0, Math.min(5, Math.round(score)));
    const priorityLabel = (score: number) => {
      if (score >= 4) return 'Prioritaire';
      if (score >= 2) return 'À surveiller';
      return 'Secondaire';
    };
    const panoramaAxesForCard = computed(() =>
      panoramaAxesSorted.value.map((axis) => ({
        id: axis.id,
        label: axisDisplayLabels[axis.id],
        emoji: axisEmojis[axis.id],
        score: axis.score,
        isPriority: priorityAxisIds.value.includes(axis.id),
        priorityLabel: priorityLabel(axis.score),
        filledSegments: filledSegments(axis.score)
      }))
    );
    const computeBlockBands = computed<P1BlockBands>(() => {
      const blocks = scores.value.blocks ?? {};
      const bandsFromStorage: P1BlockBands = {
        B1: mapAverageToBand(computeBlockAverage(blocks.b1)),
        B3: mapAverageToBand(computeBlockAverage(blocks.b3))
      };
      const runtimeBands = diagnostics.getP1BlockBands();
      return {
        B1: bandsFromStorage.B1 ?? runtimeBands.B1,
        B3: bandsFromStorage.B3 ?? runtimeBands.B3
      };
    });
    const actionPlan = computed(() => useP1ActionPlan(computeBlockBands.value));
    const actionsByHorizon = computed(() => actionPlan.value.actionsByHorizon.value);
    const filteredActionsByHorizon = computed<Record<string, any[]>>(() => {
      const horizons = actionsByHorizon.value ?? {};
      return Object.fromEntries(
        Object.entries(horizons).filter(([, list]) => Array.isArray(list) && (list as any).length > 0)
      );
    });
    const blockSummaries = computed<BlockSummary[]>(() =>
      P1_BLOCK_IDS.filter((id) => scores.value.blocks?.[id]).map((id) => {
        const data = scores.value.blocks?.[id];
        const themes = Object.entries(data?.themes ?? {}).map(([name, stats]) => ({
          name,
          average: stats.average,
          count: stats.count
        }));
        return {
          id,
          title: p1BlockContent[id]?.title ?? id,
          answeredCount: data?.answeredCount ?? 0,
          skippedCount: data?.skippedCount ?? 0,
          unseenCount: data?.unseenCount ?? 0,
          themes
        };
      })
    );
    const blockSummariesForCard = computed(() =>
      blockSummaries.value.map((block) => ({
        ...block,
        completion: blockCompletion(block),
        isComplete: isBlockComplete(block),
        detailsOpen: false
      }))
    );
    const completedBlocksLabel = computed(() => {
      const list = storage.meta.value?.completedBlocks ?? [];
      return list.length ? list.join(', ') : 'aucun';
    });
    const blocksList = computed(() => Object.values(scores.value.blocks ?? {}));
    const panoramaAnsweredCount = computed(() => scores.value.panorama?.answeredCount ?? 0);
    const panoramaSkippedCount = computed(() => scores.value.panorama?.skippedCount ?? 0);
    const panoramaTotalCount = computed(() => panoramaAnsweredCount.value + panoramaSkippedCount.value);
    const panoramaCompletenessLabel = computed(() => {
      const answered = panoramaAnsweredCount.value;
      const skipped = panoramaSkippedCount.value;
      const total = panoramaTotalCount.value;
      if (!total) return 'Panorama partiel (0/0)';
      if (skipped === 0) return `Panorama complet ✅ (${answered}/${total})`;
      return `Panorama partiel (${answered}/${total})`;
    });
    const axisSummaryLabel = computed(() => axisSummary.value.map((a) => `${a.label}:${a.value}`).join(' · '));
    const panoramaAnsweredLabel = computed(
      () => `R ${panoramaAnsweredCount.value} / NR ${panoramaSkippedCount.value}`
    );
    const alerts = computed(() =>
      mainIssues.value.filter((issue) => issue.band === 'very_high' || issue.band === 'high')
    );
    const watchlist = computed(() => mainIssues.value.filter((issue) => issue.band === 'medium'));
    const issuesForCard = computed(() =>
      alerts.value.map((issue) => ({
        id: issue.id,
        label: issue.label,
        icon: issueIcon(issue.label),
        summary: issue.summary ?? '',
        summaryShort: issueSummaryShort(issue),
        interpretation: issue.interpretation ?? '',
        impactScore: issueImpactScore(issue),
        effects: issueEffectsBullets(issue),
        signals: issueSignalsBullets(issue),
        expanded: false
      }))
    );
    const watchlistForCard = computed(() =>
      watchlist.value.map((issue) => ({
        id: issue.id,
        label: issue.label,
        icon: issueIcon(issue.label),
        summary: issue.summary ?? '',
        summaryShort: issueSummaryShort(issue),
        interpretation: issue.interpretation ?? '',
        impactScore: issueImpactScore(issue),
        effects: issueEffectsBullets(issue),
        signals: issueSignalsBullets(issue),
        expanded: false
      }))
    );
    const hypothesesForCard = computed(() =>
      mainHypotheses.value.map((hypo, idx) => ({
        id: hypo.id,
        index: idx + 1,
        title: hypo.title,
        summary: hypothesisSummary(hypo),
        signals: hypothesisSignalsBullets(hypo),
        costs: hypothesisCostBullets(hypo),
        tests: hypothesisTestBullets(hypo),
        rationaleLines: hypo.rationaleLines,
        firstCheck: hypo.firstCheck,
        body: hypo.body,
        whyItMatters: hypothesisWhyItMatters(hypo),
        detailsOpen: false,
        selected: false,
        disabled: false
      }))
    );
    const secondaryHypothesesForCard = computed(() =>
      secondaryHypotheses.value.map((hypo) => ({ id: hypo.id, title: hypo.title }))
    );
    const verificationPlansForHypotheses = computed(() =>
      mainHypotheses.value.map((hypo) => ({
        id: hypo.id,
        title: hypo.title,
        steps: verificationPlan(hypo)
      }))
    );
    const landingPlansForPanel = computed(() =>
      mainHypotheses.value.map((hypo) => {
        const plan = landingPlans[hypo.id] ?? {
          title: hypo.title,
          timeEstimate: '20–40 min',
          steps: verificationPlan(hypo),
          expectedOutcome: 'Tu sauras si cette hypothèse tient face aux faits.'
        };
        return { ...plan, id: hypo.id, done: false };
      })
    );
    const exportText = computed(() => {
      const base = buildExportText();
      const segments: string[] = [base];
      const hypoMd = toMarkdownHypotheses();
      if (hypoMd) {
        segments.push(hypoMd);
      }
      const systemicMd = toMarkdownSystemic();
      if (systemicMd) {
        segments.push(systemicMd);
      }
      const statuses = systemicFollowups.statuses.value;
      if (Object.keys(statuses).length) {
        const lines: string[] = [];
        lines.push('## Vérifs systémiques (optionnelles)');
        lines.push('');
        mainCards.value.concat(secondaryCards.value ?? []).forEach((card) => {
          const st = statuses[card.id] ?? 'missing';
          const label = st === 'answered' ? 'faite' : st === 'skipped' ? 'passée' : 'non faite';
          lines.push(`- ${card.title} : ${label}`);
        });
        segments.push(lines.join('\n'));
      }
      return segments.join('\n\n');
    });
    const blocksListValue = blocksList.value;
    const panorama = scores.value.panorama ?? ({} as any);
    const globalSkipSummary = computed(() => {
      const skipped =
        (panorama.skippedCount ?? 0) +
        blocksListValue.reduce((acc, b) => acc + (b?.skippedCount ?? 0), 0);

      if (skipped <= 0) {
        return { ratio: 0, text: '', missing: 0 };
      }

      const answered =
        (panorama.answeredCount ?? 0) +
        blocksListValue.reduce((acc, b) => acc + (b?.answeredCount ?? 0), 0);
      const missing = blocksListValue.reduce((acc, b) => acc + ((b as any)?.missingCount ?? 0), 0);
      const total = answered + skipped + missing;
      const ratio = total > 0 ? skipped / total : 0;
      const text = ratio >= 0.3 ? P1_GLOBAL_SKIP_SUMMARY.manySkips : P1_GLOBAL_SKIP_SUMMARY.fewSkips;
      return { ratio, text, missing };
    });
    const hasGlobalMissing = computed(() => {
      const byAxis = panorama?.byAxis as any | undefined;
      const panoramaMissing = byAxis
        ? (byAxis.human?.missingCount ?? 0) +
          (byAxis.movement?.missingCount ?? 0) +
          (byAxis.decisions?.missingCount ?? 0) +
          (byAxis.structure?.missingCount ?? 0)
        : 0;
      const blocksMissing = blocksListValue.reduce((acc, b) => acc + ((b as any)?.missingCount ?? 0), 0);
      return panoramaMissing + blocksMissing;
    });
    const summaryNav = [
      { id: 'gb_reperes', label: 'Repères' },
      { id: 'gb_panorama', label: 'Panorama & blocs' },
      { id: 'gb_tensions', label: 'Ce qui pèse le plus' },
      { id: 'gb_hypotheses', label: 'Hypothèses' },
      { id: 'gb_atterrissage', label: 'Atterrissage' },
      { id: 'gb_ressources', label: 'Ressources & pistes' },
      { id: 'gb_export', label: 'Export' },
      { id: 'gb_options', label: 'Choisir la suite' }
    ];
    const splitParagraphs = (text: string) => text.split('\n\n').filter(Boolean);

    return {
      copy: p1Copy.global,
      axisSummaryLabel: axisSummaryLabel.value,
      completedBlocksLabel: completedBlocksLabel.value,
      panoramaAnsweredLabel: panoramaAnsweredLabel.value,
      summaryNav,
      blocksSummaryHeading: p1Copy.global.blocksHeading,
      completedBlocks: completedBlocksLabel.value,
      panorama: {
        answeredCount: panoramaAnsweredCount.value,
        skippedCount: panoramaSkippedCount.value,
        completenessLabel: panoramaCompletenessLabel.value,
        axes: panoramaAxesForCard.value,
        blocks: blockSummariesForCard.value,
        completedLabel: completedBlocksLabel.value
      },
      issues: {
        list: issuesForCard.value,
        watchlist: watchlistForCard.value,
        focusDetails: focusDetails.value,
        title: P1_GLOBAL_ISSUES_COPY.mainTitle,
        intro: P1_GLOBAL_ISSUES_COPY.intro,
        emptyText: P1_GLOBAL_ISSUES_COPY.noStrongIssues
      },
      supports: {
        main: mainSupports.value,
        copy: P1_GLOBAL_SUPPORTS_COPY
      },
      hypotheses: {
        list: hypothesesForCard.value,
        secondary: secondaryHypothesesForCard.value,
        selectionCount: '0/2',
        verificationPlans: verificationPlansForHypotheses.value
      },
      landing: {
        plans: landingPlansForPanel.value,
        highlightTarget: null
      },
      resources: recommendedResources.value,
      exportPanel: {
        exportText: exportText.value,
        clearMessage: '',
        copied: false,
        missingInfo: P1_MISSING_COPY.info,
        eraseCopyLabel: P1_ERASE_COPY.buttonLabel,
        focusDetails: focusDetails.value,
        hasGlobalMissing: hasGlobalMissing.value > 0,
        globalSkipText: globalSkipSummary.value.text,
        globalMissing: hasGlobalMissing.value
      },
      actions: {
        hasAnyAction: Object.keys(filteredActionsByHorizon.value ?? {}).length > 0,
        filteredActionsByHorizon: filteredActionsByHorizon.value,
        copy: P1_ACTION_PLAN_COPY
      },
      engagement: {
        intro: splitParagraphs(p1EngagementCopy.globalBilan.intro),
        synthesis: splitParagraphs(p1EngagementCopy.globalBilan.synthesis),
        levelN1: splitParagraphs(p1EngagementCopy.globalBilan.levelN1),
        levelN2: splitParagraphs(p1EngagementCopy.globalBilan.levelN2),
        levelN3: splitParagraphs(p1EngagementCopy.globalBilan.levelN3),
        levelN4: splitParagraphs(p1EngagementCopy.globalBilan.levelN4)
      },
      meta: {
        exportMode: exportMode.value
      }
    } as GlobalBilanViewModel;
  }
};
