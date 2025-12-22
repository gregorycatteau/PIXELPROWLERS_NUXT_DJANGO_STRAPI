<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-E2_panorama_bilan">
      <JourneyStepHeader
        :title="copy.title"
        :subtitle="copy.subtitle"
        heading-id="journey-step-heading-E2_panorama_bilan"
      />

      <div v-if="hasPanoramaScores" class="space-y-6">
        <section class="space-y-3">
          <p class="pp-journey-subtitle text-sm sm:text-base">{{ copy.summaryTitle }}</p>
          <p class="text-sm text-[color:var(--color-text-muted)]">{{ copy.summarySubtitle }}</p>
          <div v-if="hasGlobalSkipSignal" class="pp-journey-card-soft space-y-2">
            <p class="text-sm text-[color:var(--color-text-muted)]">{{ skipSignalCopy.globalNotice }}</p>
            <p class="text-sm text-[color:var(--color-text-muted)]">{{ skipSignalCopy.optionalDetail }}</p>
            <ul v-if="axisSkipSignals.length" class="space-y-1 text-xs text-[color:var(--color-text-muted)]">
              <li v-for="axis in axisSkipSignals" :key="axis.axisId">
                Axe {{ axis.label }} : {{ axis.skippedCount }} / {{ axis.totalCount }} questions laissees de cote.
              </li>
            </ul>
          </div>
        </section>

        <section class="grid gap-3 md:grid-cols-3">
          <article v-for="axis in axes" :key="axis.axisId" class="pp-journey-card-soft space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
              {{ axis.label }}
            </p>
            <p class="text-sm">Score moyen: {{ axis.score }}</p>
            <p class="text-xs text-[color:var(--color-text-muted)]">
              Reponses: {{ axis.answeredCount }} / {{ axis.totalCount }}
            </p>
          </article>
        </section>

        <div class="flex flex-wrap gap-3">
          <button type="button" class="pp-journey-cta-primary" @click="goToStep('E_global_bilan')">
            {{ copy.globalCta }}
          </button>
          <button type="button" class="pp-journey-cta-secondary" @click="goToStep('E1_panorama')">
            {{ copy.backToPanorama }}
          </button>
        </div>
      </div>

      <section v-else class="pp-journey-card-soft space-y-3">
        <p class="pp-journey-body">On a besoin du panorama pour afficher ce bilan.</p>
        <button type="button" class="pp-journey-cta-primary" @click="goToStep('E1_panorama')">
          Retour au panorama
        </button>
      </section>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import { useCoreJourneyStorage } from '~/composables/useCoreJourneyStorage';
import { p2Copy } from '~/config/journeys/p2CopyV1_0';
import { p2PanoramaAxesMeta, P2_PANORAMA_AXIS_ORDER, type P2PanoramaAxisId } from '~/config/journeys/p2QuestionsV1_0';
import { BILAN_SKIP_SIGNAL_COPY } from '~/config/bilan/bilanSkipSignalCopy';

const props = defineProps<{
  goToStep: (stepId: string) => void;
}>();

const copy = p2Copy.panoramaBilan;
const storage = useCoreJourneyStorage({ journeyId: 'p2' });
const axisOrder = P2_PANORAMA_AXIS_ORDER;

onMounted(() => {
  try {
    storage.loadFromStorage();
  } catch {
    // ignore
  }
});

const panoramaScores = computed(() => storage.scores.value?.panorama ?? null);
const hasPanoramaScores = computed(() => {
  const scores = panoramaScores.value;
  if (!scores) return false;
  return (scores.answeredCount ?? 0) + (scores.skippedCount ?? 0) > 0;
});

const axes = computed(() =>
  axisOrder.map((axisId: P2PanoramaAxisId) => {
    const stats = panoramaScores.value?.byAxis?.[axisId];
    const totalCount = stats?.totalCount ?? 0;
    return {
      axisId,
      label: p2PanoramaAxesMeta[axisId].label,
      score: stats?.score ?? 0,
      answeredCount: stats?.answeredCount ?? 0,
      skippedCount: stats?.skippedCount ?? 0,
      totalCount
    };
  })
);

const skipSignalCopy = BILAN_SKIP_SIGNAL_COPY;
const hasGlobalSkipSignal = computed(() => (panoramaScores.value?.skippedCount ?? 0) > 0);
const axisSkipSignals = computed(() =>
  axes.value.filter((axis) => {
    const ratio = axis.totalCount > 0 ? axis.skippedCount / axis.totalCount : 0;
    return axis.skippedCount >= 2 || ratio >= 0.2;
  })
);
</script>
