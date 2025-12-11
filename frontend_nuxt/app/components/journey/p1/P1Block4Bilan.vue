<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-4" role="region" aria-labelledby="journey-step-heading-B4_bilan">
      <JourneyStepHeader
        :title="blockCopy.bilanTitle"
        :subtitle="blockCopy.bilanSubtitle || blockCopy.subtitle"
        heading-id="journey-step-heading-B4_bilan"
      />
      <div v-if="hasScores" class="pp-journey-section space-y-3">
        <section class="space-y-2" aria-labelledby="b4-summary-heading">
          <h2 id="b4-summary-heading" class="pp-journey-title text-lg">
            {{ narrativeCopy.summaryTitle }}
          </h2>
          <ul class="pp-journey-body list-disc list-inside space-y-1">
            <li v-for="item in narrative.summary" :key="item.key">
              {{ item.text }}
            </li>
          </ul>
        </section>

        <section class="space-y-2" aria-labelledby="b4-interpretation-heading">
          <h2 id="b4-interpretation-heading" class="pp-journey-title text-lg">
            {{ narrativeCopy.interpretationTitle }}
          </h2>
          <ul class="pp-journey-body list-disc list-inside space-y-1">
            <li v-for="item in narrative.interpretation" :key="item.key">
              {{ item.text }}
            </li>
          </ul>
        </section>

        <details class="pp-journey-panel pp-journey-panel-alt space-y-2">
          <summary class="cursor-pointer text-sm font-semibold">
            {{ narrativeCopy.detailsTitle }}
          </summary>
          <p class="pp-journey-meta">{{ copy.statsLabel }}</p>
          <ul class="pp-journey-body list-disc list-inside space-y-1">
            <li>Répondu : {{ blockScores?.answeredCount ?? 0 }}</li>
            <li>Non répondu : {{ blockScores?.skippedCount ?? 0 }}</li>
            <li>Non vu : {{ blockScores?.unseenCount ?? 0 }}</li>
          </ul>
          <div class="pp-journey-panel pp-journey-panel-alt space-y-1">
            <p class="pp-journey-title text-sm">{{ copy.themesLabel }}</p>
            <ul class="pp-journey-body list-disc list-inside text-sm text-[color:var(--color-text-muted)]">
              <li v-for="theme in themeList" :key="theme.name">
                {{ theme.name }} : {{ theme.average }} ({{ theme.count }} items)
              </li>
            </ul>
          </div>
        </details>
        <p v-if="blockCopy.dignityNote" class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">
          {{ blockCopy.dignityNote }}
        </p>
      </div>
      <div v-else class="pp-journey-section space-y-2">
        <p class="pp-journey-body">Bilan non disponible pour ce bloc, retourne au hub.</p>
        <button type="button" class="pp-journey-cta-secondary" @click="goToStep('E2_panorama_bilan')">
          {{ copy.ctaHub }}
        </button>
      </div>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="pp-journey-cta-secondary" @click="goToStep('E2_panorama_bilan')">
          {{ copy.ctaHub }}
        </button>
        <button type="button" class="pp-journey-cta-secondary" @click="goToStep(nextBlockStep)">
          {{ copy.ctaAnother }}
        </button>
        <button
          v-if="canAccessGlobalBilan"
          type="button"
          class="pp-journey-cta-secondary"
          @click="handleGoToGlobal"
        >
          {{ copy.ctaGlobal }}
        </button>
        <button type="button" class="pp-journey-cta-secondary" @click="handleClear">
          {{ copy.ctaClear }}
        </button>
      </div>
      <p v-if="!canAccessGlobalBilan" class="text-sm text-[color:var(--color-text-muted)]">
        {{ copy.globalLocked }}
      </p>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import { computed } from 'vue';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { useP1BlockNarrative } from '~/composables/useP1BlockNarrative';
import { P1_BLOCK_IDS, p1BlockContent, p1Copy, p1PanoramaText } from '~/config/journeys/p1QuestionsConfig';
import { hasP1GlobalBilanAccess } from '~/utils/p1GlobalBilanAccess';

const props = defineProps<{
  goToStep: (stepId: string) => void;
  goToGlobalBilan?: () => void;
}>();

const storage = useDiagnosticStorage({ journeyId: 'p1' });
const blockId = 'b4';
const blockCopy = computed(() => p1BlockContent[blockId]);
const copy = computed(() => p1Copy.blockBilan);
const blockScores = computed(() => storage.scores.value?.blocks?.[blockId] ?? null);
const hasScores = computed(() => Boolean(blockScores.value));
const completedBlocks = computed(() => storage.meta.value?.completedBlocks ?? []);
const nextBlockId = computed(() => P1_BLOCK_IDS.find((id) => id !== blockId && !completedBlocks.value.includes(id)) ?? P1_BLOCK_IDS.find((id) => id !== blockId) ?? 'b1');
const nextBlockStep = computed(() => `${nextBlockId.value.toUpperCase()}_questions`);
const canAccessGlobalBilan = computed(() => hasP1GlobalBilanAccess(storage.meta.value, storage.scores.value));
const { getBlockNarrative } = useP1BlockNarrative();
const narrativeKeys = computed(() => getBlockNarrative(blockId, blockScores.value));
const narrative = computed(() => ({
  summary: narrativeKeys.value.summaryKeys.map((key) => ({
    key,
    text: p1PanoramaText[key] ?? key
  })),
  interpretation: narrativeKeys.value.interpretationKeys.map((key) => ({
    key,
    text: p1PanoramaText[key] ?? key
  }))
}));
const narrativeCopy = computed(
  () =>
    p1Copy.blocks?.[blockId]?.bilan ??
    p1Copy.blockNarrative?.[blockId] ?? {
      summaryTitle: 'Ce que tu viens de poser',
      interpretationTitle: 'Ce qu’on peut en comprendre',
      detailsTitle: 'Détail des scores'
    }
);
const themeList = computed(() =>
  Object.entries(blockScores.value?.themes ?? {}).map(([name, data]) => ({
    name,
    average: data.average,
    count: data.count
  }))
);

const handleClear = () => {
  storage.clearAll();
  props.goToStep('E0_intro');
};

const handleGoToGlobal = () => {
  if (props.goToGlobalBilan) {
    props.goToGlobalBilan();
    return;
  }
  props.goToStep('E_global_bilan');
};
</script>
