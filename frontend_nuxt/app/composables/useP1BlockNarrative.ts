// Génère des clés narratives pour les bilans de blocs P1.
import type { P1BlockScores } from '@/composables/useJourneyDiagnostics';
import {
  P1_BLOCK_B1_SKIP_MICROCOPY,
  P1_BLOCK_B1_TENSION_NARRATIVES,
  P1_BLOCK_B3_SKIP_MICROCOPY,
  P1_BLOCK_B3_TENSION_NARRATIVES,
  type P1TensionBand
} from '@/config/journeys/p1NarrativesV1_3';
import type { P1BlockId } from '@/config/journeys/p1QuestionsConfig';
import { p1BlockNarratives } from '@/config/journeys/p1QuestionsConfig';

type Bucket = 'low' | 'medium' | 'high';

function mapTensionToBand(avgTension: number): P1TensionBand {
  if (avgTension <= 1) return 'low';
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
}

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

  const getBlockNarrative = (
    blockId: P1BlockId,
    blockScores: P1BlockScores | null | undefined
  ): P1BlockNarrativeResult => {
    if (!blockScores) {
      return { summaryKeys: [], interpretationKeys: [] };
    }
    if (blockId === 'b1') {
      return buildBandNarrative(blockId, blockScores, P1_BLOCK_B1_TENSION_NARRATIVES, P1_BLOCK_B1_SKIP_MICROCOPY);
    }
    if (blockId === 'b3') {
      return buildBandNarrative(blockId, blockScores, P1_BLOCK_B3_TENSION_NARRATIVES, P1_BLOCK_B3_SKIP_MICROCOPY);
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
