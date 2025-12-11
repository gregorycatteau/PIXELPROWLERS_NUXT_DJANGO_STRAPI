<template>
  <JourneyLayout>
    <div
      class="pp-journey-panel space-y-4"
      role="region"
      aria-labelledby="journey-step-heading-E2_panorama_bilan"
    >
      <JourneyStepHeader
        :title="copy.title"
        :subtitle="copy.subtitle"
        heading-id="journey-step-heading-E2_panorama_bilan"
      />

      <template v-if="hasPanoramaScores">
        <section
          class="pp-journey-section space-y-3"
          aria-labelledby="summary-heading"
        >
          <h2 id="summary-heading" class="pp-journey-title text-lg">
            {{ copy.panoramaSummaryTitle }}
          </h2>
          <p v-if="copy.panoramaSummarySubtitle" class="pp-journey-meta text-sm">
            {{ copy.panoramaSummarySubtitle }}
          </p>
          <ul class="pp-journey-body list-disc list-inside space-y-1">
            <li v-for="item in narrativeRaw.summaryBlocks" :key="item.key">
              {{ item.text }}
            </li>
          </ul>
          <details class="pp-journey-panel pp-journey-panel-alt space-y-2">
            <summary class="cursor-pointer text-sm font-semibold">
              Détail des scores
            </summary>
            <ul class="pp-journey-body list-disc list-inside space-y-1">
              <li v-for="axisId in axisOrder" :key="axisId">
                {{ axesMeta[axisId].shortLabel }} : {{ scores[axisId] ?? 0 }}
              </li>
            </ul>
            <p class="pp-journey-meta text-sm">
              Répondu : {{ scores.answeredCount ?? 0 }} · Non répondu :
              {{ scores.skippedCount ?? 0 }}
            </p>
          </details>
        </section>

        <section
          class="pp-journey-section space-y-3"
          aria-labelledby="interpretation-heading"
        >
          <h2 id="interpretation-heading" class="pp-journey-title text-lg">
            {{ copy.panoramaInterpretationTitle }}
          </h2>
          <p v-if="copy.panoramaInterpretationSubtitle" class="pp-journey-meta text-sm">
            {{ copy.panoramaInterpretationSubtitle }}
          </p>
          <ul class="pp-journey-body list-disc list-inside space-y-1">
            <li v-for="item in narrativeRaw.interpretationBlocks" :key="item.key">
              {{ item.text }}
            </li>
          </ul>
        </section>

        <section
          class="pp-journey-section space-y-3"
          aria-labelledby="next-steps-heading"
        >
          <h2 id="next-steps-heading" class="pp-journey-title text-lg">
            {{ copy.panoramaNextStepsTitle }}
          </h2>
          <p v-if="copy.panoramaNextStepsSubtitle" class="pp-journey-meta text-sm">
            {{ copy.panoramaNextStepsSubtitle }}
          </p>
          <div class="space-y-2">
            <article
              v-for="suggestion in narrative"
              :key="suggestion.blockId"
              class="pp-journey-panel pp-journey-panel-alt space-y-1"
            >
              <p class="pp-journey-title text-base">
                {{
                  p1BlockContent[suggestion.blockId]?.title ||
                  suggestion.blockId
                }}
              </p>
              <p
                class="pp-journey-body text-sm text-[color:var(--color-text-muted)]"
              >
                {{ suggestion.reasonText }}
              </p>
              <button
                type="button"
                class="pp-journey-cta-primary !px-4"
                @click="goToStep(suggestion.questionStep)"
              >
                {{ copy.exploreCta }}
              </button>
            </article>
          </div>
        </section>

        <section
          class="pp-journey-section space-y-3"
          aria-labelledby="blocks-heading"
        >
          <h2 id="blocks-heading" class="pp-journey-title text-lg">
            {{ copy.blocksHeading }}
          </h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <article
              v-for="block in blockStates"
              :key="block.id"
              class="pp-journey-panel pp-journey-panel-alt space-y-2"
            >
              <p class="pp-journey-title text-base">{{ block.title }}</p>
              <p class="pp-journey-meta text-sm">
                Statut : {{ block.statusLabel }}
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="pp-journey-cta-primary !px-4"
                  @click="goToStep(block.questionStep)"
                >
                  {{ copy.exploreCta }}
                </button>
                <button
                  type="button"
                  class="pp-journey-cta-secondary !px-4"
                  :disabled="!block.hasScores"
                  @click="goToStep(block.bilanStep)"
                >
                  {{ copy.blockBilanCta }}
                </button>
              </div>
            </article>
          </div>
        </section>

        <div class="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            class="pp-journey-cta-secondary"
            @click="goToStep('E1_panorama')"
          >
            {{ copy.backToPanorama }}
          </button>
          <button
            type="button"
            class="pp-journey-cta-primary"
            v-if="canAccessGlobalBilan"
            @click="handleGoToGlobal"
          >
            {{ copy.globalCta }}
          </button>
          <p v-else class="text-sm text-[color:var(--color-text-muted)]">
            {{ copy.globalLocked }}
          </p>
        </div>
      </template>

      <template v-else>
        <section class="pp-journey-section space-y-2">
          <p class="pp-journey-body">
            On a besoin du panorama pour afficher ce bilan.
          </p>
          <button
            type="button"
            class="pp-journey-cta-primary"
            @click="goToStep('E1_panorama')"
          >
            {{ copy.backToPanorama }}
          </button>
        </section>
      </template>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
// Génère un bilan panorama narratif à partir des agrégats (scores + blocs complétés).
import { computed, onMounted } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import { useJourneyDiagnostics, type P1PanoramaScores } from '~/composables/useJourneyDiagnostics';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { useP1PanoramaNarrative } from '~/composables/useP1PanoramaNarrative';
import {
  P1_BLOCK_IDS,
  p1AxesMeta,
  p1BlockContent,
  p1Copy,
  p1PanoramaQuestions,
  type P1BlockId
} from '~/config/journeys/p1QuestionsConfig';
import { getP1PanoramaScoresFromStored } from '~/utils/p1PanoramaStorage';
import { hasP1GlobalBilanAccess } from '~/utils/p1GlobalBilanAccess';

const props = defineProps<{
  goToStep: (stepId: string) => void;
  goToGlobalBilan?: () => void;
}>();

const storage = useDiagnosticStorage({ journeyId: 'p1' });
const panoramaAxisMap = p1PanoramaQuestions.reduce<Record<string, 'human' | 'governance' | 'organization' | 'resources'>>(
  (acc, q) => {
    acc[q.id] = q.axisId;
    return acc;
  },
  {}
);
const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', panoramaAxisMap });
const axisOrder = ['human', 'governance', 'organization', 'resources'] as const;

// Scores agrégés panorama P1 (front-only, pas de réponses brutes)
const storedPanoramaScores = computed<P1PanoramaScores | null>(() => getP1PanoramaScoresFromStored(storage.scores.value));
const runtimePanoramaScores = computed<P1PanoramaScores | null>(() => diagnostics.getPanoramaScoresOrNull());
const panoramaScores = computed<P1PanoramaScores | null>(() => storedPanoramaScores.value ?? runtimePanoramaScores.value ?? null);

// True si au moins un axe ou un compteur est présent
const hasPanoramaScores = computed(() => {
  const s = panoramaScores.value;
  if (!s) return false;
  const hasAxisScore = axisOrder.some((axisId) => typeof s[axisId] === 'number' && s[axisId] > 0);
  const hasCounts = (s.answeredCount ?? 0) + (s.skippedCount ?? 0) > 0;
  return hasAxisScore || hasCounts;
});

const scores = computed<P1PanoramaScores>(() => {
  return (
    panoramaScores.value ?? {
      human: 0,
      governance: 0,
      organization: 0,
      resources: 0,
      answeredCount: 0,
      skippedCount: 0
    }
  );
});
const axesMeta = p1AxesMeta;
const completedBlocks = computed(() => storage.meta.value?.completedBlocks ?? []);

const { buildNarrative } = useP1PanoramaNarrative();
const narrativeRaw = computed(() => buildNarrative(panoramaScores.value, completedBlocks.value));
const narrative = computed(() =>
  narrativeRaw.value.suggestions.map((suggestion) => {
    const blockId = suggestion.blockId as P1BlockId;
    return {
      ...suggestion,
      blockId,
      questionStep: `${blockId.toUpperCase()}_questions`
    };
  })
);

const blockStates = computed(() =>
  P1_BLOCK_IDS.map((id) => {
    const completed = completedBlocks.value.includes(id);
    const hasScores = Boolean(storage.scores.value?.blocks?.[id]);
    const statusLabel = completed ? 'Terminé' : hasScores ? 'En cours' : 'Non commencé';
    return {
      id,
      title: p1BlockContent[id]?.title ?? id,
      statusLabel,
      hasScores,
      questionStep: `${id.toUpperCase()}_questions`,
      bilanStep: `${id.toUpperCase()}_bilan`
    };
  })
);

const canAccessGlobalBilan = computed(() => hasP1GlobalBilanAccess(storage.meta.value, storage.scores.value));
const copy = computed(() => ({
  ...p1Copy.hub,
  panoramaSummaryTitle:
    p1Copy.panorama?.bilan?.summaryTitle ?? 'Ce que tu viens de poser',
  panoramaSummarySubtitle: p1Copy.panorama?.bilan?.summarySubtitle ?? '',
  panoramaInterpretationTitle:
    p1Copy.panorama?.bilan?.interpretationTitle ?? 'Ce qu’on peut en comprendre',
  panoramaInterpretationSubtitle: p1Copy.panorama?.bilan?.interpretationSubtitle ?? '',
  panoramaNextStepsTitle:
    p1Copy.panorama?.bilan?.nextStepsTitle ?? 'Ce qu’on te propose d’explorer maintenant',
  panoramaNextStepsSubtitle: p1Copy.panorama?.bilan?.nextStepsSubtitle ?? '',
  panoramaSovereigntyReminder: p1Copy.panorama?.bilan?.sovereigntyReminder ?? ''
}));

onMounted(() => {
  try {
    storage.loadFromStorage();
  } catch {
    // Ignore storage read errors; runtime scores will still be used if present.
  }
});

const handleGoToGlobal = () => {
  if (props.goToGlobalBilan) {
    props.goToGlobalBilan();
    return;
  }
  props.goToStep('E_global_bilan');
};
</script>
