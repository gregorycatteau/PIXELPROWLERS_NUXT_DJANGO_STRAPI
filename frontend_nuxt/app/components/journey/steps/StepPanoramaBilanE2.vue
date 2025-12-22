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
          <p v-if="copy.summarySubtitle" class="text-sm text-[color:var(--color-text-muted)]">{{ copy.summarySubtitle }}</p>
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
import type { JourneyManifestV1 } from '~/config/journeys/manifests/types';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import { useCoreJourneyStorage } from '~/composables/useCoreJourneyStorage';
import { BILAN_SKIP_SIGNAL_COPY } from '~/config/bilan/bilanSkipSignalCopy';
import { getJourneyCopy, getJourneyPanoramaQuestions } from '~/config/journeys/journeyDataRegistry';

const props = defineProps<{
  manifest: JourneyManifestV1;
  goToStep: (stepId: string) => void;
}>();

const fallbackCopy = {
  title: 'Bilan panorama',
  subtitle: 'Synthese par axe et prochain pas.',
  summaryTitle: 'Ce que tu viens de poser',
  summarySubtitle: 'Panorama rapide, base sur tes reponses.',
  backToPanorama: 'Retour au panorama',
  globalCta: 'Voir le bilan global',
  globalLocked: 'Le bilan global est accessible apres le panorama.'
};

const copy = computed(() => {
  const bundle = getJourneyCopy(props.manifest);
  return bundle?.panoramaBilan ? { ...fallbackCopy, ...bundle.panoramaBilan } : fallbackCopy;
});

const storage = useCoreJourneyStorage({ journeyId: props.manifest.id });

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

const questionsBundle = computed(() => getJourneyPanoramaQuestions(props.manifest));
const axisOrder = computed(() => {
  if (questionsBundle.value?.axisOrder?.length) return questionsBundle.value.axisOrder;
  const manifestAxes = props.manifest.axes?.map((axis) => axis.axisId) ?? [];
  if (manifestAxes.length) return manifestAxes;
  const seen = new Set<string>();
  const order: string[] = [];
  questionsBundle.value?.questions.forEach((question) => {
    if (!seen.has(question.axisId)) {
      seen.add(question.axisId);
      order.push(question.axisId);
    }
  });
  return order;
});

const axisMeta = computed<Record<string, { label: string }>>(() => {
  const meta: Record<string, { label: string }> = {};
  const fromQuestions = questionsBundle.value?.axesMeta ?? {};
  Object.entries(fromQuestions).forEach(([axisId, info]) => {
    meta[axisId] = { label: info.label };
  });
  props.manifest.axes?.forEach((axis) => {
    if (!meta[axis.axisId]) {
      meta[axis.axisId] = { label: axis.label };
    }
  });
  return meta;
});

const axes = computed(() =>
  axisOrder.value.map((axisId) => {
    const stats = panoramaScores.value?.byAxis?.[axisId];
    const totalCount = stats?.totalCount ?? 0;
    return {
      axisId,
      label: axisMeta.value[axisId]?.label ?? axisId,
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
