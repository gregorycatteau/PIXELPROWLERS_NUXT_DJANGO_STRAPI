import { computed } from 'vue';
import { useDiagnosticStorage } from '@/composables/useDiagnosticStorage';
import { useP1BlockNarrative } from '@/composables/useP1BlockNarrative';
import type { P1FollowupsMeta, P1TensionBand } from '@/types/p1Meta';

type P1GlobalIssue = {
  id: string;
  blockId: 'B1' | 'B3';
  axisId: 'humain' | 'decisions';
  themeId: string;
  label: string;
  band: P1TensionBand;
  priorityScore: number;
  summary: string;
  interpretation: string;
};

type P1GlobalSupport = {
  id: string;
  blockId: 'B1' | 'B3';
  axisId: 'humain' | 'decisions';
  themeId: string;
  label: string;
  band: 'very_low' | 'low';
  priorityScore: number;
  summary: string;
  interpretation: string;
};

const BAND_PRIORITY: Record<P1TensionBand, number> = {
  very_low: 0,
  low: 0,
  medium: 1,
  high: 2,
  very_high: 3
};

const SUPPORT_PRIORITY: Record<P1GlobalSupport['band'], number> = {
  very_low: 0,
  low: 1
};

export function useP1GlobalNarrative() {
  const storage = useDiagnosticStorage({ journeyId: 'p1' });
  const { getBlockNarrative } = useP1BlockNarrative();
  const followups = computed<P1FollowupsMeta>(() => (storage.meta.value?.followups as P1FollowupsMeta) ?? {});

  const allIssues = computed<P1GlobalIssue[]>(() => {
    const blocks = storage.scores.value?.blocks ?? {};
    const b1Narrative = getBlockNarrative('b1', blocks.b1, followups.value?.b1);
    const b3Narrative = getBlockNarrative('b3', blocks.b3, followups.value?.b3);

    const mapThemes = (
      themes: NonNullable<typeof b1Narrative.themesByBand>[keyof NonNullable<typeof b1Narrative.themesByBand>],
      blockId: P1GlobalIssue['blockId'],
      axisId: P1GlobalIssue['axisId']
    ): P1GlobalIssue[] =>
      (themes ?? [])
        .filter((theme) => theme.band === 'medium' || theme.band === 'high' || theme.band === 'very_high')
        .map((theme) => ({
          id: `${blockId.toLowerCase()}_${theme.themeId}`,
          blockId,
          axisId,
          themeId: theme.themeId,
          label: theme.label,
          band: theme.band as P1GlobalIssue['band'],
          priorityScore: BAND_PRIORITY[theme.band as keyof typeof BAND_PRIORITY],
          summary: theme.summary,
          interpretation: theme.interpretation
        }));

    const issues: P1GlobalIssue[] = [
      ...mapThemes(
        [
          ...(b1Narrative.themesByBand?.very_high ?? []),
          ...(b1Narrative.themesByBand?.high ?? []),
          ...(b1Narrative.themesByBand?.medium ?? [])
        ],
        'B1',
        'humain'
      ),
      ...mapThemes(
        [
          ...(b3Narrative.themesByBand?.very_high ?? []),
          ...(b3Narrative.themesByBand?.high ?? []),
          ...(b3Narrative.themesByBand?.medium ?? [])
        ],
        'B3',
        'decisions'
      )
    ];

    return issues
      .map((issue) => ({
        ...issue,
        priorityScore: issue.priorityScore ?? BAND_PRIORITY[issue.band]
      }))
      .sort((a, b) => {
        if (b.priorityScore !== a.priorityScore) {
          return b.priorityScore - a.priorityScore;
        }
        if (a.blockId === b.blockId) {
          return 0;
        }
        return a.blockId === 'B1' ? -1 : 1;
      });
  });

  const mainIssues = computed(() => allIssues.value.slice(0, 4));
  const secondaryIssues = computed(() => allIssues.value.slice(4));

  const allSupports = computed<P1GlobalSupport[]>(() => {
    const blocks = storage.scores.value?.blocks ?? {};
    const b1Narrative = getBlockNarrative('b1', blocks.b1, followups.value?.b1);
    const b3Narrative = getBlockNarrative('b3', blocks.b3, followups.value?.b3);

    const mapSupports = (
      themes: NonNullable<typeof b1Narrative.themesByBand>[keyof NonNullable<typeof b1Narrative.themesByBand>],
      blockId: P1GlobalSupport['blockId'],
      axisId: P1GlobalSupport['axisId']
    ): P1GlobalSupport[] =>
      (themes ?? [])
        .filter((theme) => theme.band === 'very_low' || theme.band === 'low')
        .map((theme) => ({
          id: `${blockId.toLowerCase()}_${theme.themeId}`,
          blockId,
          axisId,
          themeId: theme.themeId,
          label: theme.label,
          band: theme.band as P1GlobalSupport['band'],
          priorityScore: SUPPORT_PRIORITY[theme.band as keyof typeof SUPPORT_PRIORITY],
          summary: theme.summary,
          interpretation: theme.interpretation
        }));

    const supports: P1GlobalSupport[] = [
      ...mapSupports(
        [...(b1Narrative.themesByBand?.low ?? []), ...(b1Narrative.themesByBand?.very_low ?? [])],
        'B1',
        'humain'
      ),
      ...mapSupports(
        [...(b3Narrative.themesByBand?.low ?? []), ...(b3Narrative.themesByBand?.very_low ?? [])],
        'B3',
        'decisions'
      )
    ];

    return supports
      .filter((s) => s.band === 'very_low' || s.band === 'low')
      .sort((a, b) => {
        if (a.priorityScore !== b.priorityScore) {
          return a.priorityScore - b.priorityScore;
        }
        if (a.blockId === b.blockId) {
          return 0;
        }
        return a.blockId === 'B1' ? -1 : 1;
      });
  });

  const mainSupports = computed(() => allSupports.value.slice(0, 4));
  const secondarySupports = computed(() => allSupports.value.slice(4));
  const themesByBlock = computed(() => ({
    B1: (getBlockNarrative('b1', storage.scores.value?.blocks?.b1, followups.value?.b1).themesAll ?? []) as any[],
    B3: (getBlockNarrative('b3', storage.scores.value?.blocks?.b3, followups.value?.b3).themesAll ?? []) as any[]
  }));

  return {
    mainIssues,
    secondaryIssues,
    mainSupports,
    secondarySupports,
    themesByBlock
  };
}
