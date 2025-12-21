import { computed } from 'vue';
import { useP1GlobalNarrative } from '@/composables/useP1GlobalNarrative';
import { useP1Hypotheses } from '@/composables/useP1Hypotheses';
import { P1_SYSTEMIC_CARDS, type P1SystemicCard, type P1SystemicTriggerTheme } from '@/config/journeys/p1SystemicLandingCopyV1_3';
import { toCanonicalThemeId } from '@/config/journeys/p1ThemeIdAliases';
import type { P1TensionBand } from '@/types/p1Meta';
import { useDiagnosticStorage } from './useDiagnosticStorage';

type Band = P1TensionBand;
type Confidence = 'confirmed' | 'clarified' | 'protected' | 'unclear';

type ThemeSnapshot = {
  themeId: string;
  band: Band;
  confidenceHint?: Confidence;
  priorityScore?: number;
  label?: string;
};

type SystemicCardResolved = P1SystemicCard & {
  score: number;
  confidenceHint?: 'confirmed' | 'protected' | 'unclear';
  evidenceLines: string[];
};

const bandRank: Record<Band, number> = {
  very_low: 0,
  low: 1,
  medium: 2,
  high: 3,
  very_high: 4
};

const triggerWeight = (minBand: P1SystemicTriggerTheme['minBand']) => {
  if (minBand === 'very_high') return 2;
  if (minBand === 'high') return 1;
  return 0.5;
};

export function useP1SystemicLanding() {
  const globalNarrative = useP1GlobalNarrative();
  const { mainHypotheses, secondaryHypotheses } = useP1Hypotheses();
  const storage = useDiagnosticStorage({ journeyId: 'p1' });

  const themesIndex = computed(() => {
    const base = (globalNarrative.themesByBlock?.value ?? globalNarrative.themesByBlock) as any;
    const index: Record<'B1' | 'B3', Record<string, ThemeSnapshot>> = { B1: {}, B3: {} };
    const indexBlock = (block: 'B1' | 'B3', list: ThemeSnapshot[] = []) => {
      list.forEach((t) => {
        const id = toCanonicalThemeId(t.themeId) ?? t.themeId;
        index[block][id] = t;
      });
    };
    indexBlock('B1', base?.B1 ?? []);
    indexBlock('B3', base?.B3 ?? []);
    return index;
  });

  const hypothesisIds = computed(() => {
    const all = [...(mainHypotheses.value ?? []), ...(secondaryHypotheses.value ?? [])];
    return new Set(all.map((h) => h.id));
  });

  const satisfyThemeTrigger = (trigger: P1SystemicTriggerTheme): ThemeSnapshot | null => {
    const blockThemes = themesIndex.value[trigger.blockId];
    const theme = blockThemes[toCanonicalThemeId(trigger.themeId) ?? trigger.themeId];
    if (!theme) return null;
    if (bandRank[theme.band] < bandRank[trigger.minBand]) return null;
    return theme;
  };

  const evaluateCard = (card: P1SystemicCard): SystemicCardResolved | null => {
    const metaStatus = storage.meta.value?.followups?.systemic?.[card.id as keyof typeof storage.meta.value.followups.systemic];
    let score = 0;
    let matched = false;
    const evidenceLines: string[] = [];
    const satisfiedThemes: { trigger: P1SystemicTriggerTheme; theme: ThemeSnapshot }[] = [];

    (card.triggers.anyThemes ?? []).forEach((trigger) => {
      const theme = satisfyThemeTrigger(trigger);
      if (!theme) return;
      matched = true;
      satisfiedThemes.push({ trigger, theme });
      let weight = triggerWeight(trigger.minBand);
      if (theme.confidenceHint === 'confirmed') weight += 0.5;
      if (typeof theme.priorityScore === 'number') {
        weight += Math.min(1, Math.max(0, theme.priorityScore / 10));
      }
      score += weight;
    });

    if (card.triggers.anyHypotheses?.length) {
      const hasHypo = card.triggers.anyHypotheses.some((h) => hypothesisIds.value.has(h));
      if (hasHypo) {
        matched = true;
        score += 1;
      }
    }

    if (metaStatus === 'answered') score += 0.5;
    if (metaStatus === 'skipped') score -= 0.25;

    if (!matched) return null;
    const confidenceHint =
      metaStatus === 'answered' ? 'confirmed' : metaStatus === 'skipped' ? 'protected' : 'unclear';
    if (satisfiedThemes.length) {
      const list = satisfiedThemes
        .map(({ theme }) => `${theme.label ?? theme.themeId} (${theme.band})`)
        .join(', ');
      evidenceLines.push(`Signaux sur : ${list}.`);
    }
    if (metaStatus === 'answered') evidenceLines.push('Vérif enregistrée : confirmé.');
    if (metaStatus === 'skipped') evidenceLines.push('Vérif passée : zone protégée à respecter.');
    if (!metaStatus && satisfiedThemes.length) {
      evidenceLines.push('Vérif à confirmer.');
    }
    return { ...card, score: Number(score.toFixed(2)), confidenceHint, evidenceLines };
  };

  const evaluated = computed(() =>
    P1_SYSTEMIC_CARDS.map((c) => evaluateCard(c)).filter(Boolean) as SystemicCardResolved[]
  );

  const sorted = computed(() =>
    [...evaluated.value].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.id.localeCompare(b.id);
    })
  );

  const mainCards = computed(() => sorted.value.slice(0, 3));
  const secondaryCards = computed(() => sorted.value.slice(3, 6));

  const toMarkdownSystemic = () => {
    if (!sorted.value.length) return '';
    const lines: string[] = [];
    lines.push('## Atterrissage systémique');
    lines.push('Les tensions humaines sont souvent le symptôme. Voici des vérifications système.');
    lines.push('');
    sorted.value.forEach((c) => {
      lines.push(`### ${c.title}`);
      lines.push(c.body);
      if (c.firstChecks?.length) {
        lines.push('');
        lines.push('**Première vérif :**');
        c.firstChecks.forEach((fc) => lines.push(`- ${fc}`));
      }
      if (c.confidenceHint) {
        const label =
          c.confidenceHint === 'confirmed'
            ? 'Confirmé'
            : c.confidenceHint === 'protected'
              ? 'Zone protégée'
              : 'À confirmer';
        lines.push('');
        lines.push(`Statut : ${label}`);
      }
      lines.push('');
    });
    return lines.join('\n');
  };

  return {
    mainCards,
    secondaryCards,
    toMarkdownSystemic
  };
}
