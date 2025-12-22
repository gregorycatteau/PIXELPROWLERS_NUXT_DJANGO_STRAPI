<template>
  <div class="space-y-4">
    <div
      v-if="resumePromptStep"
      class="pp-card p-4 sm:p-5 space-y-2 border border-[color:var(--color-accent-border)] bg-[color:var(--color-accent-quiet)]"
      role="status"
    >
      <p class="text-sm font-semibold">On a retrouve un parcours commence sur cet appareil.</p>
      <p class="text-sm text-[color:var(--color-text-muted)]">
        Tu peux reprendre a l etape suggeree ou repartir de zero.
      </p>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="pp-cta-primary" @click="handleResume">
          Reprendre
        </button>
        <button type="button" class="pp-cta-secondary" @click="handleRestart">
          Recommencer
        </button>
      </div>
    </div>

    <Transition name="journey-step" mode="out-in">
      <component
        :is="currentComponent"
        :key="currentStepId"
        v-bind="stepProps"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from '#imports';
import { useJourneyEngine } from '~/composables/useJourneyEngine';
import { useCoreJourneyStorage } from '~/composables/useCoreJourneyStorage';
import { p2JourneySchema } from '~/config/journeys/p2JourneySchema';
import P2IntroE0 from '~/components/journey/p2/P2IntroE0.vue';
import P2PanoramaE1 from '~/components/journey/p2/P2PanoramaE1.vue';
import P2PanoramaBilanE2 from '~/components/journey/p2/P2PanoramaBilanE2.vue';
import P2GlobalBilan from '~/components/journey/p2/P2GlobalBilan.vue';

const props = defineProps<{
  initialStepId?: string | null;
}>();

const route = useRoute();
const router = useRouter();
const { currentStepId, goToStep } = useJourneyEngine({ journeyId: 'p2' });
const { meta, scores, loadFromStorage, clearAll, saveMeta } = useCoreJourneyStorage({ journeyId: 'p2' });

const allowedSteps = computed(() => p2JourneySchema.steps.map((step) => step.stepId));
const allowedSet = computed(() => new Set(allowedSteps.value));
const resumePromptStep = ref<string | null>(null);

const hasPanoramaScores = computed(() => Boolean(scores.value?.panorama) || Boolean(meta.value?.panoramaCompleted));

const componentsMap: Record<string, any> = {
  E0_intro: P2IntroE0,
  E1_panorama: P2PanoramaE1,
  E2_panorama_bilan: P2PanoramaBilanE2,
  E_global_bilan: P2GlobalBilan
};

const currentComponent = computed(() => componentsMap[currentStepId.value] ?? P2IntroE0);

const normalizeStep = (value?: string | null) => {
  if (!value) return null;
  return allowedSet.value.has(value) ? value : null;
};

const recommendedStep = computed(() => {
  const candidate = meta.value?.lastStepId;
  if (candidate && allowedSet.value.has(candidate)) return candidate;
  return allowedSteps.value[0] ?? null;
});

const safeGoToStep = (stepId: string) => {
  if (!stepId) return;
  if (stepId === 'E2_panorama_bilan' && !hasPanoramaScores.value) {
    goToStep('E1_panorama');
    return;
  }
  if (stepId === 'E_global_bilan' && !hasPanoramaScores.value) {
    goToStep('E2_panorama_bilan');
    return;
  }
  if (!allowedSet.value.has(stepId)) {
    const first = allowedSteps.value[0];
    if (first) goToStep(first);
    return;
  }
  goToStep(stepId);
};

const stepProps = computed(() => ({ goToStep: safeGoToStep }));

const applyInitialStep = () => {
  const requested = normalizeStep(props.initialStepId ?? (typeof route.query.step === 'string' ? route.query.step : null));
  if (requested) {
    resumePromptStep.value = null;
    safeGoToStep(requested);
    return;
  }

  const rec = recommendedStep.value;
  const first = allowedSteps.value[0];
  if (rec && first && rec !== first) {
    resumePromptStep.value = rec;
    safeGoToStep(first);
  } else if (first) {
    resumePromptStep.value = null;
    safeGoToStep(first);
  }
};

const handleResume = () => {
  if (resumePromptStep.value) {
    safeGoToStep(resumePromptStep.value);
  }
  resumePromptStep.value = null;
};

const handleRestart = () => {
  clearAll();
  resumePromptStep.value = null;
  const first = allowedSteps.value[0];
  if (first) safeGoToStep(first);
};

watch(
  () => currentStepId.value,
  async (step) => {
    saveMeta({ lastStepId: step });
    const query = { ...route.query, step };
    await router.replace({ query });
    if (typeof document !== 'undefined') {
      const heading = document.getElementById(`journey-step-heading-${step}`);
      heading?.focus?.();
    }
  },
  { immediate: true }
);

onMounted(() => {
  try {
    loadFromStorage();
  } catch {
    clearAll();
  }
  applyInitialStep();
});
</script>
