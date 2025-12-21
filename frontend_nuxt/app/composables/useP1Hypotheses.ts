import { computed } from 'vue';
import { useP1GlobalNarrative } from '@/composables/useP1GlobalNarrative';
import { P1_HYPOTHESES, type P1Hypothesis, type P1HypothesisTrigger } from '@/config/journeys/p1HypothesesCopyV1_3';
import { toCanonicalThemeId } from '@/config/journeys/p1ThemeIdAliases';

type Band = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
type Confidence = 'confirmed' | 'clarified' | 'protected' | 'unclear';

const bandRank: Record<Band, number> = {
  very_low: 0,
  low: 1,
  medium: 2,
  high: 3,
  very_high: 4
};

const bandLabel: Record<Band, string> = {
  very_low: 'Très bas',
  low: 'Plutôt bas',
  medium: 'À surveiller',
  high: 'Forte tension',
  very_high: 'Très forte tension'
};

const confidenceLabel: Record<Confidence, string> = {
  confirmed: 'Confirmé',
  clarified: 'Affiné',
  protected: 'Protégé',
  unclear: 'À confirmer'
};

type ThemeCard = {
  themeId: string;
  band: Band;
  confidenceHint?: Confidence;
  priorityScore?: number;
  isCritical?: boolean;
  label?: string;
};

export function useP1Hypotheses() {
  const globalNarrative = useP1GlobalNarrative();

  const themesByBlock = computed(() => {
    const base = globalNarrative.themesByBlock?.value ?? globalNarrative.themesByBlock ?? {};
    const toIndex = (list: ThemeCard[] = []) =>
      list.reduce<Record<string, ThemeCard>>((acc, t) => {
        const id = toCanonicalThemeId(t.themeId) ?? t.themeId;
        acc[id] = t;
        return acc;
      }, {});
    return {
      B1: toIndex((base as any).B1 ?? []),
      B3: toIndex((base as any).B3 ?? [])
    };
  });

  const satisfyTrigger = (trigger: P1HypothesisTrigger): ThemeCard | null => {
    const blockThemes = trigger.blockId === 'B1' ? themesByBlock.value.B1 : themesByBlock.value.B3;
    const theme = blockThemes[toCanonicalThemeId(trigger.themeId) ?? trigger.themeId];
    if (!theme) return null;
    if (bandRank[theme.band] < bandRank[trigger.minBand]) return null;
    if (trigger.confidence && (!theme.confidenceHint || !trigger.confidence.includes(theme.confidenceHint))) return null;
    return theme;
  };

  const evaluateHypothesis = (hypo: P1Hypothesis) => {
    let score = 0;
    const satisfied: { trigger: P1HypothesisTrigger; theme: ThemeCard }[] = [];
    hypo.triggers.forEach((trigger) => {
      const theme = satisfyTrigger(trigger);
      if (!theme) return;
      satisfied.push({ trigger, theme });
      score += trigger.weight;
    });
    if (!satisfied.length) return null;
    if (satisfied.some((s) => s.theme.confidenceHint === 'confirmed')) score += 0.25;
    if (satisfied.length >= 2) score += 0.1;
    score = Math.min(10, Number(score.toFixed(2)));
    const evidence = satisfied.map(({ trigger, theme }) => {
      const conf = theme.confidenceHint ? ` — ${confidenceLabel[theme.confidenceHint]}` : '';
      return `${trigger.themeId} : ${bandLabel[theme.band]}${conf}`;
    });
    const rationaleLines: string[] = [];
    satisfied.slice(0, 4).forEach(({ trigger, theme }) => {
      const domain = trigger.blockId === 'B1' ? 'Climat' : 'Décisions';
      const hint =
        theme.confidenceHint === 'confirmed'
          ? ' (confirmé)'
          : theme.confidenceHint === 'protected'
            ? ' (zone protégée)'
            : theme.confidenceHint === 'unclear'
              ? ' (à confirmer)'
              : theme.confidenceHint === 'clarified'
                ? ' (affiné)'
                : '';
      const critical = theme.isCritical ? ' — signal critique' : '';
      const label = theme.label ?? trigger.themeId;
      rationaleLines.push(`${domain} : tension forte sur ${label}${hint}${critical}.`);
    });
    return {
      ...hypo,
      score,
      evidence,
      rationaleLines
    };
  };

  const evaluated = computed(() =>
    P1_HYPOTHESES.map((h) => evaluateHypothesis(h)).filter(Boolean) as Array<
      P1Hypothesis & { score: number; evidence: string[]; rationaleLines: string[] }
    >
  );

  const sorted = computed(() =>
    [...evaluated.value].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.id.localeCompare(b.id);
    })
  );

  const mainHypotheses = computed(() => sorted.value.slice(0, 4));
  const secondaryHypotheses = computed(() => sorted.value.slice(4).filter((h) => h.score > 0));

  const toMarkdownHypotheses = () => {
    const list = sorted.value;
    if (!list.length) return '';
    const lines: string[] = [];
    lines.push('## Hypothèses structurantes');
    lines.push('');
    list.forEach((h) => {
      lines.push(`### ${h.title}`);
      lines.push(h.body);
      lines.push('');
      lines.push('**Première vérif :**');
      lines.push(h.firstCheck);
      if (h.evidence?.length) {
        lines.push('');
        lines.push('**Ce qui l’appuie :**');
        h.evidence.forEach((e) => lines.push(`- ${e}`));
      }
      if (h.rationaleLines?.length) {
        lines.push('');
        lines.push('**Lecture synthétique :**');
        h.rationaleLines.forEach((r) => lines.push(`- ${r}`));
      }
      lines.push('');
    });
    return lines.join('\n');
  };

  return {
    mainHypotheses,
    secondaryHypotheses,
    toMarkdownHypotheses
  };
}
