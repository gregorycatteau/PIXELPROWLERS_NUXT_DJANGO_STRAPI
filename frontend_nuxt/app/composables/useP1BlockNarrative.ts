// Génère des clés narratives pour les bilans de blocs P1.
import type { P1BlockScores } from '@/composables/useJourneyDiagnostics';
import {
  P1_BLOCK_B1_THEME_NARRATIVES,
  P1_BLOCK_B1_SKIP_MICROCOPY,
  P1_BLOCK_B1_TENSION_NARRATIVES,
  P1_BLOCK_B3_SKIP_MICROCOPY,
  P1_BLOCK_B3_TENSION_NARRATIVES,
  P1_BLOCK_B3_THEME_NARRATIVES
} from '@/config/journeys/p1NarrativesV1_3';
import type { P1BlockId } from '@/config/journeys/p1QuestionsConfig';
import { p1BlockNarratives, p1BlockThemes } from '@/config/journeys/p1QuestionsConfig';
import { P1_QUESTIONS_V1_3 } from '@/config/journeys/p1QuestionsV1_3';
import { toCanonicalThemeId } from '@/config/journeys/p1ThemeIdAliases';
import type { P1FollowupOverallStatus, P1FollowupPackStatus, P1TensionBand } from '@/types/p1Meta';

type Bucket = 'low' | 'medium' | 'high';

function mapTensionToBand(avgTension: number): P1TensionBand {
  if (avgTension <= 0) return 'very_low';
  if (avgTension === 1) return 'low';
  if (avgTension === 2) return 'medium';
  if (avgTension === 3) return 'high';
  return 'very_high';
}

const getBucket = (score: number | null | undefined): Bucket => {
  // Seuils : < 2 = low, [2; 3.5) = medium, >= 3.5 = high
  if (score == null) return 'low';
  if (score < 2) return 'low';
  if (score < 3.5) return 'medium';
  return 'high';
};

export interface P1BlockNarrativeResult {
  summaryKeys: string[];
  interpretationKeys: string[];
  summary?: { key: string; text: string }[];
  interpretation?: { key: string; text: string }[];
  skipCopy?: string | null;
  themes?: ThemeCard[];
  themesByBand?: Record<P1TensionBand, ThemeCard[]>;
  themesAll?: ThemeCard[];
}

export type ThemeCard = {
  themeId: string;
  label: string;
  band: P1TensionBand;
  summary: string;
  interpretation: string;
  followupStatus?: P1FollowupOverallStatus;
  isCritical?: boolean;
  confidenceHint?: 'confirmed' | 'clarified' | 'protected' | 'unclear';
  answeredCount: number;
  skippedIntentionalCount: number;
  missingCount: number;
  totalCount: number;
  priorityScore: number;
};

const toBand = (tension: number): P1TensionBand => {
  if (tension <= 0) return 'very_low';
  if (tension === 1) return 'low';
  if (tension === 2) return 'medium';
  if (tension === 3) return 'high';
  return 'very_high';
};

export function useP1BlockNarrative() {
  const buildBandNarrative = (
    blockId: P1BlockId,
    blockScores: P1BlockScores | null | undefined,
    narratives: Record<P1TensionBand, { summary: string; interpretation: string }>,
    microcopy: { fewSkips: string; manySkips: string }
  ): P1BlockNarrativeResult => {
    const answeredCount = blockScores?.answeredCount ?? 0;
    const skippedIntentionalCount = blockScores?.skippedCount ?? 0;
    const missingCount = blockScores?.unseenCount ?? 0;
    const totals = Object.values(blockScores?.themes ?? {}).reduce(
      (acc, theme) => {
        acc.total += (theme.average ?? 0) * (theme.count ?? 0);
        acc.count += theme.count ?? 0;
        return acc;
      },
      { total: 0, count: 0 }
    );
    const averageValue = totals.count ? totals.total / totals.count : 0;
    const avgTension = Number(Math.min(4, Math.max(0, averageValue - 1)).toFixed(2));
    const tensionBand = mapTensionToBand(Math.round(avgTension));
    const totalQuestions = answeredCount + skippedIntentionalCount + missingCount;
    const skipRatio = totalQuestions > 0 ? skippedIntentionalCount / totalQuestions : 0;
    const skipCopy = skipRatio >= 0.3 ? microcopy.manySkips : microcopy.fewSkips;
    const keyPrefix = blockId.toLowerCase();

    return {
      summaryKeys: [],
      interpretationKeys: [],
      summary: [
        {
          key: `p1.${keyPrefix}.band.${tensionBand}.summary`,
          text: narratives[tensionBand].summary
        }
      ],
      interpretation: [
        {
          key: `p1.${keyPrefix}.band.${tensionBand}.interpretation`,
          text: narratives[tensionBand].interpretation
        },
        {
          key: `p1.${keyPrefix}.skips`,
          text: skipCopy
        }
      ],
      skipCopy
    };
  };

  type B1ThemeAggregate = {
    themeId: string;
    label: string;
    averageTension: number; // 0..4
    answeredCount: number;
    hasCriticalQuestion: boolean;
  };

  const buildB1ThemeAggregates = (blockScores: P1BlockScores): B1ThemeAggregate[] => {
    const labelToId: Record<string, string> = {
      'Sécurité psychologique': 'securite_psy',
      'Non-dits': 'non_dits',
      'Gestion des conflits': 'conflits',
      'Charge et fatigue': 'charge_fatigue',
      'Sens et alignement': 'sens_alignement',
      'Justice / équité': 'justice',
      Reconnaissance: 'reconnaissance',
      Isolement: 'isolement',
      'Prévisibilité du quotidien': 'previsibilite_quotidien',
      'Ambiance globale': 'ambiance_globale'
    };

    const criticalLabels = new Set<string>();
    const blockThemeMap = p1BlockThemes.b1 ?? {};
    P1_QUESTIONS_V1_3
      .filter((q) => q.blockId === 'B1')
      .forEach((q) => {
        if (!q.critical) return;
        const label = blockThemeMap[q.id];
        if (label) criticalLabels.add(label);
      });

    return Object.entries(blockScores.themes ?? {})
      .map(([label, data]) => {
        const themeId = labelToId[label];
        if (!themeId) return null;
        const average = data.average ?? 0;
        const averageTension = Math.max(0, Math.min(4, average - 1));
        return {
          themeId,
          label,
          averageTension,
          answeredCount: data.count ?? 0,
          hasCriticalQuestion: criticalLabels.has(label)
        };
      })
      .filter(Boolean) as B1ThemeAggregate[];
  };

  const defaultSupportNarrative = (label: string, band: P1TensionBand) => {
    const isVeryLow = band === 'very_low';
    return {
      summary: isVeryLow
        ? `${label} semble plutôt robuste en ce moment.`
        : `${label} paraît globalement tenir, avec quelques frictions légères.`,
      interpretation: isVeryLow
        ? 'C’est un appui possible pour sécuriser des sujets plus sensibles.'
        : 'Cette zone reste utilisable comme point d’appui, en gardant un œil sur les petites alertes.'
    };
  };

  const mapAggregateToCard = (
    theme: B1ThemeAggregate | B3ThemeAggregate,
    narratives: Record<string, Record<P1TensionBand, { summary: string; interpretation: string }>>,
    followups?: Record<string, P1FollowupPackStatus>
  ): ThemeCard | null => {
    const band = toBand(Math.round(theme.averageTension));
    const narrative = narratives[theme.themeId]?.[band];
    const followupStatus =
      followups?.[theme.themeId]?.overall ??
      followups?.[toCanonicalThemeId(theme.themeId) ?? theme.themeId]?.overall;
    if (!narrative) {
      if (band === 'low' || band === 'very_low') {
        const fallback = defaultSupportNarrative(theme.label, band);
        return {
          themeId: theme.themeId,
          label: theme.label,
          band,
          summary: fallback.summary,
          interpretation: fallback.interpretation,
          followupStatus,
          answeredCount: 0,
          skippedIntentionalCount: 0,
          missingCount: 0,
          totalCount: 0,
          priorityScore: 0
        };
      }
      return {
        themeId: theme.themeId,
        label: theme.label,
        band,
        summary: `${theme.label} semble générer des tensions à surveiller.`,
        interpretation: 'Cette zone mérite d’être éclairée avec prudence pour éviter une montée de tension.',
        followupStatus,
        answeredCount: 0,
        skippedIntentionalCount: 0,
        missingCount: 0,
        totalCount: 0,
        priorityScore: 0
      };
    }
    return {
      themeId: theme.themeId,
      label: theme.label,
      band,
      summary: narrative.summary,
      interpretation: narrative.interpretation,
      followupStatus,
      answeredCount: 0,
      skippedIntentionalCount: 0,
      missingCount: 0,
      totalCount: 0,
      priorityScore: 0
    };
  };

  const buildConfidenceHint = (card: ThemeCard): ThemeCard => {
    if (!card.followupStatus) return card;
    if (card.band === 'very_high' && card.followupStatus === 'answered') {
      return { ...card, confidenceHint: 'confirmed' };
    }
    if (card.band === 'very_high' && card.followupStatus === 'skipped') {
      return { ...card, confidenceHint: 'protected' };
    }
    if (card.band === 'high' && card.followupStatus === 'answered') {
      return { ...card, confidenceHint: 'clarified' };
    }
    if (card.band === 'high' && card.followupStatus === 'skipped') {
      return { ...card, confidenceHint: 'unclear' };
    }
    return card;
  };

  const buildPriorityScore = (card: ThemeCard): number => {
    const bandBase: Record<P1TensionBand, number> = {
      very_low: 0,
      low: 1,
      medium: 2,
      high: 3,
      very_high: 4
    };
    let score = bandBase[card.band];
    if (card.isCritical) score += 0.5;
    if (card.confidenceHint === 'confirmed') score += 0.5;
    if (card.confidenceHint === 'clarified') score += 0.2;
    if (card.answeredCount === 1) score -= 0.5;
    if (card.missingCount > 0) score -= 0.3;
    return Number(Math.max(0, Math.min(5, score)).toFixed(1));
  };

  const groupByBand = (cards: ThemeCard[]): Record<P1TensionBand, ThemeCard[]> => {
    const base: Record<P1TensionBand, ThemeCard[]> = {
      very_low: [],
      low: [],
      medium: [],
      high: [],
      very_high: []
    };
    cards.forEach((card) => {
      base[card.band]?.push(card);
    });
    return base;
  };

  const countQuestionsByTheme = (blockId: 'b1' | 'b3', themeId: string) => {
    const questions = P1_QUESTIONS_V1_3.filter((q) => q.blockId.toLowerCase() === blockId);
    const mapLabelToId: Record<string, string> =
      blockId === 'b1'
        ? {
            'Sécurité psychologique': 'securite_psy',
            'Non-dits': 'non_dits',
            'Gestion des conflits': 'conflits',
            'Charge et fatigue': 'charge_fatigue',
            'Sens et alignement': 'sens_alignement',
            'Justice / équité': 'justice',
            Reconnaissance: 'reconnaissance',
            Isolement: 'isolement',
            'Prévisibilité du quotidien': 'previsibilite_quotidien',
            'Ambiance globale': 'ambiance_globale'
          }
        : {
            'Rôles décisionnels': 'roles_decisionnels',
            'Décisions en coulisses': 'coulisses',
            'Règles écrites': 'regles_ecrites',
            'Equité des règles': 'equite_regles',
            Participation: 'participation',
            'Désaccord et contestation': 'desaccord',
            'Suivi des décisions': 'suivi_decisions',
            'Changements de règles': 'changements_regles',
            'Responsabilité politique': 'responsabilite',
            Recours: 'recours',
            'Entorses aux règles': 'entorses_regles',
            'Opacité décisionnelle': 'opacite'
          };
    return questions.filter((q) => {
      const label = (p1BlockThemes as any)[blockId]?.[q.id];
      return label && mapLabelToId[label] === themeId;
    }).length;
  };

  const enrichCounts = (blockId: 'b1' | 'b3', aggregates: Array<B1ThemeAggregate | B3ThemeAggregate>) =>
    aggregates.map((agg) => {
      const totalCount = countQuestionsByTheme(blockId, agg.themeId);
      const answeredCount = agg.answeredCount ?? 0;
      const skippedIntentionalCount = 0; // non disponible via les scores agrégés
      const missingCount = Math.max(totalCount - answeredCount - skippedIntentionalCount, 0);
      return { answeredCount, skippedIntentionalCount, missingCount, totalCount };
    });

  const pickB1Themes = (aggregates: B1ThemeAggregate[], followups?: Record<string, P1FollowupPackStatus>) => {
    const sorted = [...aggregates].sort((a, b) => b.averageTension - a.averageTension);
    const counts = enrichCounts('b1', aggregates);
    const cards = sorted
      .map((theme, idx) => {
        const base = mapAggregateToCard(theme, P1_BLOCK_B1_THEME_NARRATIVES, followups ? followups : undefined);
        if (!base) return null;
        const countMeta = counts[idx] ?? { answeredCount: 0, skippedIntentionalCount: 0, missingCount: 0, totalCount: 0 };
        const enriched: ThemeCard = {
          ...base,
          isCritical: theme.hasCriticalQuestion,
          answeredCount: countMeta.answeredCount,
          skippedIntentionalCount: countMeta.skippedIntentionalCount,
          missingCount: countMeta.missingCount,
          totalCount: countMeta.totalCount,
          priorityScore: 0
        };
        const withConfidence = buildConfidenceHint(enriched);
        return { ...withConfidence, priorityScore: buildPriorityScore(withConfidence) };
      })
      .filter(Boolean) as ThemeCard[];
    const themesByBand = groupByBand(cards);
    const bandOrder: P1TensionBand[] = ['very_high', 'high', 'medium', 'low', 'very_low'];
    bandOrder.forEach((band) => {
      themesByBand[band] = (themesByBand[band] ?? []).sort((a, b) => b.priorityScore - a.priorityScore);
    });
    const themesAll = bandOrder.flatMap((band) => themesByBand[band]);
    return { themesByBand, themesAll };
  };

  type B3ThemeAggregate = {
    themeId: string;
    label: string;
    averageTension: number;
    answeredCount: number;
    hasCriticalQuestion: boolean;
  };

  const buildB3ThemeAggregates = (blockScores: P1BlockScores): B3ThemeAggregate[] => {
    const labelToId: Record<string, string> = {
      'Rôles décisionnels': 'roles_decisionnels',
      'Décisions en coulisses': 'coulisses',
      'Règles écrites': 'regles_ecrites',
      'Equité des règles': 'equite_regles',
      Participation: 'participation',
      'Désaccord et contestation': 'desaccord',
      'Suivi des décisions': 'suivi_decisions',
      'Changements de règles': 'changements_regles',
      'Responsabilité politique': 'responsabilite',
      Recours: 'recours',
      'Entorses aux règles': 'entorses_regles',
      'Opacité décisionnelle': 'opacite'
    };

    const criticalLabels = new Set<string>();
    const blockThemeMap = p1BlockThemes.b3 ?? {};
    P1_QUESTIONS_V1_3
      .filter((q) => q.blockId === 'B3' && q.critical)
      .forEach((q) => {
        const label = blockThemeMap[q.id];
        if (label) criticalLabels.add(label);
      });

    return Object.entries(blockScores.themes ?? {})
      .map(([label, data]) => {
        const themeId = labelToId[label];
        if (!themeId) return null;
        const average = data.average ?? 0;
        const averageTension = Math.max(0, Math.min(4, average - 1));
        return {
          themeId,
          label,
          averageTension,
          answeredCount: data.count ?? 0,
          hasCriticalQuestion: criticalLabels.has(label)
        };
      })
      .filter(Boolean) as B3ThemeAggregate[];
  };

  const pickB3Themes = (aggregates: B3ThemeAggregate[], followups?: Record<string, P1FollowupPackStatus>) => {
    const sorted = [...aggregates].sort((a, b) => b.averageTension - a.averageTension);
    const counts = enrichCounts('b3', aggregates as any);
    const cards = sorted
      .map((theme, idx) => {
        const base = mapAggregateToCard(theme, P1_BLOCK_B3_THEME_NARRATIVES, followups ? followups : undefined);
        if (!base) return null;
        const countMeta = counts[idx] ?? { answeredCount: 0, skippedIntentionalCount: 0, missingCount: 0, totalCount: 0 };
        const enriched: ThemeCard = {
          ...base,
          isCritical: theme.hasCriticalQuestion,
          answeredCount: countMeta.answeredCount,
          skippedIntentionalCount: countMeta.skippedIntentionalCount,
          missingCount: countMeta.missingCount,
          totalCount: countMeta.totalCount,
          priorityScore: 0
        };
        const withConfidence = buildConfidenceHint(enriched);
        return { ...withConfidence, priorityScore: buildPriorityScore(withConfidence) };
      })
      .filter(Boolean) as ThemeCard[];
    const themesByBand = groupByBand(cards);
    const bandOrder: P1TensionBand[] = ['very_high', 'high', 'medium', 'low', 'very_low'];
    bandOrder.forEach((band) => {
      themesByBand[band] = (themesByBand[band] ?? []).sort((a, b) => b.priorityScore - a.priorityScore);
    });
    const themesAll = bandOrder.flatMap((band) => themesByBand[band]);
    return { themesByBand, themesAll };
  };

  const getBlockNarrative = (
    blockId: P1BlockId,
    blockScores: P1BlockScores | null | undefined,
    followups?: Record<string, { overall?: 'answered' | 'skipped' | 'missing' }>
  ): P1BlockNarrativeResult => {
    if (!blockScores) {
      return { summaryKeys: [], interpretationKeys: [] };
    }
    if (blockId === 'b1') {
      const base = buildBandNarrative(blockId, blockScores, P1_BLOCK_B1_TENSION_NARRATIVES, P1_BLOCK_B1_SKIP_MICROCOPY);
      const aggregates = buildB1ThemeAggregates(blockScores);
      const { themesByBand, themesAll } = pickB1Themes(aggregates, followups);
      return { ...base, themesByBand, themesAll, themes: themesAll };
    }
    if (blockId === 'b3') {
      const base = buildBandNarrative(blockId, blockScores, P1_BLOCK_B3_TENSION_NARRATIVES, P1_BLOCK_B3_SKIP_MICROCOPY);
      const aggregates = buildB3ThemeAggregates(blockScores);
      const { themesByBand, themesAll } = pickB3Themes(aggregates, followups);
      return { ...base, themesByBand, themesAll, themes: themesAll };
    }
    const blockConfig = p1BlockNarratives[blockId];
    if (!blockConfig) {
      return { summaryKeys: [], interpretationKeys: [] };
    }

    const summaryKeys: string[] = [];
    const interpretationKeys: string[] = [];

    const themes = blockScores.themes ?? {};
    const themeEntries = Object.entries(themes);
    const globalAverage = themeEntries.length
      ? themeEntries.reduce((acc, [, t]) => acc + (t.average ?? 0), 0) / themeEntries.length
      : null;

    const globalBucket = getBucket(globalAverage);
    const globalConfig = blockConfig.global?.[globalBucket];
    if (globalConfig?.summaryKey) summaryKeys.push(globalConfig.summaryKey);
    if (globalConfig?.interpretationKey) interpretationKeys.push(globalConfig.interpretationKey);

    // Buckets par sous-thème : on ne prend en compte que les "high" pour limiter le bruit
    type ThemeBuckets = Partial<Record<Bucket, { summaryKey: string; interpretationKey: string }>>;
    const themesConfig = blockConfig.themes as unknown as Record<string, ThemeBuckets> | undefined;
    Object.entries(themes).forEach(([themeName, data]) => {
      const themeBucket = getBucket(data.average);
      if (themeBucket !== 'high') return;
      const themeConfig = themesConfig?.[themeName]?.[themeBucket];
      if (!themeConfig) return;
      if (themeConfig.summaryKey) summaryKeys.push(themeConfig.summaryKey);
      if (themeConfig.interpretationKey) interpretationKeys.push(themeConfig.interpretationKey);
    });

    return { summaryKeys, interpretationKeys };
  };

  return { getBlockNarrative };
}
