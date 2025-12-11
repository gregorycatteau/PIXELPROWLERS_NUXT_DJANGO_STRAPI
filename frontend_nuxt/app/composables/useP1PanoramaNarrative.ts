// Génère un bilan narratif à partir des scores agrégés du panorama P1 (aucune réponse brute, pas de storage direct).
import type { P1PanoramaScores } from '~/composables/useJourneyDiagnostics';
import type { P1AxisId, P1BlockId } from '~/config/journeys/p1QuestionsConfig';
import { p1PanoramaNarratives, p1PanoramaSuggestions, p1PanoramaText } from '~/config/journeys/p1QuestionsConfig';

type Bucket = 'low' | 'medium' | 'high';

export interface P1PanoramaNarrative {
  summaryBlocks: { key: string; text: string }[];
  interpretationBlocks: { key: string; text: string }[];
  suggestions: {
    blockId: P1BlockId;
    intensity: Bucket;
    reasonKey: string;
    reasonText: string;
  }[];
}

const AXIS_ORDER: P1AxisId[] = ['human', 'governance', 'organization', 'resources'];

const getBucket = (score: number | null | undefined): Bucket => {
  if (score == null) return 'low';
  if (score < 2) return 'low';
  if (score < 3.5) return 'medium';
  return 'high';
};

export function useP1PanoramaNarrative() {
  const buildNarrative = (
    panoramaScores: P1PanoramaScores | null | undefined,
    completedBlocks: string[]
  ): P1PanoramaNarrative => {
    if (!panoramaScores) {
      return { summaryBlocks: [], interpretationBlocks: [], suggestions: [] };
    }

    const summaryBlocks: { key: string; text: string }[] = [];
    const interpretationBlocks: { key: string; text: string }[] = [];
    const suggestions: P1PanoramaNarrative['suggestions'] = [];

    // Génère des clés narratives par axe/bucket
    AXIS_ORDER.forEach((axisId) => {
      const bucket = getBucket(panoramaScores[axisId]);
      const axisConfig = (p1PanoramaNarratives as any)[axisId]?.[bucket];
      if (axisConfig?.summaryKey) {
        summaryBlocks.push({
          key: axisConfig.summaryKey,
          text: p1PanoramaText[axisConfig.summaryKey] ?? axisConfig.summaryKey
        });
      }
      if (axisConfig?.interpretationKey) {
        interpretationBlocks.push({
          key: axisConfig.interpretationKey,
          text: p1PanoramaText[axisConfig.interpretationKey] ?? axisConfig.interpretationKey
        });
      }

      const suggestionConfig = (p1PanoramaSuggestions as any)[axisId];
      if (!suggestionConfig) return;
      const { mainBlockId, reasonKeyByIntensity } = suggestionConfig;
      const reasonKey = reasonKeyByIntensity?.[bucket];
      if (!reasonKey) return;
      // évite de proposer un bloc déjà complété
      if (completedBlocks?.includes(mainBlockId)) return;
      suggestions.push({
        blockId: mainBlockId as P1BlockId,
        intensity: bucket,
        reasonKey,
        reasonText: p1PanoramaText[reasonKey] ?? reasonKey
      });
    });

    // On ordonne les suggestions par bucket (fort > moyen > faible) et on déduplique les blockId
    const weight: Record<Bucket, number> = { high: 3, medium: 2, low: 1 };
    const uniqueSuggestions = suggestions
      .sort((a, b) => weight[b.intensity] - weight[a.intensity])
      .reduce<P1PanoramaNarrative['suggestions']>((acc, item) => {
        if (acc.find((s) => s.blockId === item.blockId)) return acc;
        acc.push(item);
        return acc;
      }, [])
      .slice(0, 3);

    return {
      summaryBlocks,
      interpretationBlocks,
      suggestions: uniqueSuggestions
    };
  };

  return { buildNarrative };
}
