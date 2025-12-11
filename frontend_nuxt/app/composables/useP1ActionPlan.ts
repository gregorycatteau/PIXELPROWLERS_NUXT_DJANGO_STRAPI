// Génération de plan d’action P1 à partir des bands de tension par bloc.
// Ne lit jamais les réponses brutes ni le storage ; consomme uniquement des agrégats.
// Sortie pensée pour être affichée et/ou exportée côté utilisateur (Markdown).

import { computed } from 'vue';
import type { P1ActionItem, P1ActionPlan } from '@/types/journeys/p1';
import type { P1BlockBands } from '@/composables/useJourneyDiagnostics';
import {
  P1_ACTIONS_B1_MEDIUM,
  P1_ACTIONS_B1_HIGH,
  P1_ACTIONS_B1_VERY_HIGH,
  P1_ACTIONS_B3_HIGH,
  P1_ACTIONS_B3_VERY_HIGH
} from '@/config/journeys/p1ActionPlansV1_0';

type P1TensionBand = 'low' | 'medium' | 'high' | 'very_high';

export function useP1ActionPlan(blockBands: P1BlockBands) {
  const plan = computed<P1ActionPlan | null>(() => {
    const items: P1ActionItem[] = [];

    if (blockBands.B1 === 'medium') {
      items.push(...P1_ACTIONS_B1_MEDIUM);
    }
    if (blockBands.B1 === 'high') {
      items.push(...P1_ACTIONS_B1_HIGH);
    }
    if (blockBands.B1 === 'very_high') {
      items.push(...P1_ACTIONS_B1_VERY_HIGH);
    }
    if (blockBands.B3 === 'high') {
      items.push(...P1_ACTIONS_B3_HIGH);
    }
    if (blockBands.B3 === 'very_high') {
      items.push(...P1_ACTIONS_B3_VERY_HIGH);
    }

    if (!items.length) {
      return null;
    }

    return {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      bands: {
        B1: blockBands.B1,
        B3: blockBands.B3
      },
      items
    };
  });

  const actionsByHorizon = computed(() => {
    const base = {
      now: [] as P1ActionItem[],
      soon: [] as P1ActionItem[],
      later: [] as P1ActionItem[]
    };

    if (!plan.value) {
      return base;
    }

    for (const item of plan.value.items) {
      if (item.horizon === 'now') {
        base.now.push(item);
      } else if (item.horizon === 'soon') {
        base.soon.push(item);
      } else if (item.horizon === 'later') {
        base.later.push(item);
      }
    }

    return base;
  });

  const hasActions = computed(() => {
    return !!(
      actionsByHorizon.value.now.length ||
      actionsByHorizon.value.soon.length ||
      actionsByHorizon.value.later.length
    );
  });

  function toMarkdown(): string | null {
    if (!plan.value || !hasActions.value) {
      return null;
    }

    const lines: string[] = [];

    lines.push('# Plan d’action P1');
    lines.push('');
    lines.push(`Version : ${plan.value.version}`);
    lines.push(`Généré le : ${plan.value.generatedAt}`);
    lines.push('');

    if (plan.value.bands.B1) {
      lines.push(`- Climat & ressenti (B1) : ${plan.value.bands.B1}`);
    }
    if (plan.value.bands.B3) {
      lines.push(`- Règles & décisions (B3) : ${plan.value.bands.B3}`);
    }
    lines.push('');

    const mapHorizonLabel: Record<'now' | 'soon' | 'later', string> = {
      now: 'Ce que tu peux faire maintenant',
      soon: 'Ce que tu pourras envisager bientôt',
      later: 'À garder en réserve pour plus tard'
    };

    (['now', 'soon', 'later'] as const).forEach((horizonKey) => {
      const actions = actionsByHorizon.value[horizonKey];
      if (!actions.length) return;

      lines.push(`## ${mapHorizonLabel[horizonKey]}`);
      lines.push('');

      for (const action of actions) {
        const modeLabel = action.mode;
        const effortLabel = action.effort;
        const blockLabel = action.blockId;

        lines.push(`- [${blockLabel}] ${action.label} (mode : ${modeLabel}, effort : ${effortLabel}/3)`);
        lines.push(`  - ${action.description}`);

        if (action.safetyNote) {
          lines.push(`  - ⚠️ ${action.safetyNote}`);
        }

        lines.push('');
      }
    });

    return lines.join('\n');
  }

  return {
    plan,
    actionsByHorizon,
    hasActions,
    toMarkdown
  };
}
