<template>
  <div class="space-y-4">
    <div
      v-if="resumePromptStep"
      class="pp-card p-4 sm:p-5 space-y-2 border border-[color:var(--color-accent-border)] bg-[color:var(--color-accent-quiet)]"
      role="status"
    >
      <p class="text-sm font-semibold">On a retrouvé un parcours commencé sur cet appareil.</p>
      <p class="text-sm text-[color:var(--color-text-muted)]">
        Tu peux reprendre à l’étape suggérée ou repartir de zéro : dans tous les cas, c’est toi qui décides.
      </p>
      <div class="flex flex-wrap gap-3">
        <PPButton type="button" variant="primary" @click="handleResume">
          Reprendre
        </PPButton>
        <PPButton type="button" variant="secondary" @click="handleRestart">
          Recommencer
        </PPButton>
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
import { computed, onMounted, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from '#imports';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { useJourneyEngine } from '~/composables/useJourneyEngine';
import { journeyNavigationKey } from '~/composables/journeyNavigation';
import { p1JourneySchema } from '~/config/journeys/p1JourneySchema';
import { hasP1GlobalBilanAccess } from '~/utils/p1GlobalBilanAccess';
import P1Block1Bilan from '~/components/journey/p1/P1Block1Bilan.vue';
import P1Block1Questionnaire from '~/components/journey/p1/P1Block1Questionnaire.vue';
import P1Block2Bilan from '~/components/journey/p1/P1Block2Bilan.vue';
import P1Block2Questionnaire from '~/components/journey/p1/P1Block2Questionnaire.vue';
import P1Block3Bilan from '~/components/journey/p1/P1Block3Bilan.vue';
import P1Block3Questionnaire from '~/components/journey/p1/P1Block3Questionnaire.vue';
import P1Block4Bilan from '~/components/journey/p1/P1Block4Bilan.vue';
import P1Block4Questionnaire from '~/components/journey/p1/P1Block4Questionnaire.vue';
import P1GlobalBilan from '~/components/journey/p1/P1GlobalBilan.vue';
import P1IntroE0 from '~/components/journey/p1/P1IntroE0.vue';
import P1PanoramaBilanE2 from '~/components/journey/p1/P1PanoramaBilanE2.vue';
import P1PanoramaE1 from '~/components/journey/p1/P1PanoramaE1.vue';

const props = defineProps<{
  initialStepId?: string | null;
}>();

const route = useRoute();
const router = useRouter();
const { currentStepId, goToStep } = useJourneyEngine({ journeyId: 'p1' });
const { meta, scores, loadFromStorage, clearAll, saveMeta } = useDiagnosticStorage({ journeyId: 'p1' });

const canAccessGlobalBilan = computed(() => hasP1GlobalBilanAccess(meta.value, scores.value));
const allowedSteps = computed(() => {
  const base = p1JourneySchema.steps.map((step) => step.stepId);
  if (!canAccessGlobalBilan.value) {
    return base.filter((stepId) => stepId !== 'E_global_bilan');
  }
  return base;
});
const allowedSet = computed(() => new Set(allowedSteps.value));

const normalizeStep = (value?: string | null) => {
  if (!value) return null;
  return allowedSet.value.has(value) ? value : null;
};

const recommendedStep = computed(() => {
  const candidate = meta.value?.lastStepId;
  if (candidate && allowedSet.value.has(candidate)) return candidate;
  return allowedSteps.value[0] ?? null;
});

const resumePromptStep = ref<string | null>(null);

const componentsMap: Record<string, any> = {
  E0_intro: P1IntroE0,
  E1_panorama: P1PanoramaE1,
  E2_panorama_bilan: P1PanoramaBilanE2,
  B1_questions: P1Block1Questionnaire,
  B1_bilan: P1Block1Bilan,
  B2_questions: P1Block2Questionnaire,
  B2_bilan: P1Block2Bilan,
  B3_questions: P1Block3Questionnaire,
  B3_bilan: P1Block3Bilan,
  B4_questions: P1Block4Questionnaire,
  B4_bilan: P1Block4Bilan,
  E_global_bilan: P1GlobalBilan
};

const currentComponent = computed(() => {
  return componentsMap[currentStepId.value] ?? P1IntroE0;
});

const hasPanoramaScores = computed(() => Boolean(scores.value?.panorama) || Boolean(meta.value?.panoramaCompleted));

const safeGoToStep = (stepId: string) => {
  if (!stepId) return;
  if (stepId === 'E2_panorama_bilan' && !hasPanoramaScores.value) {
    goToStep('E1_panorama');
    return;
  }
  if (stepId === 'E_global_bilan' && !canAccessGlobalBilan.value) {
    goToStep('E2_panorama_bilan');
    return;
  }
  const allowed = allowedSteps.value;
  if (allowed.length === 0) return;
  if (!allowed.includes(stepId)) {
    const first = allowed[0];
    if (first) {
      goToStep(first);
    }
    return;
  }
  goToStep(stepId);
};

provide(journeyNavigationKey, safeGoToStep);

const goToGlobalBilan = () => {
  safeGoToStep('E_global_bilan');
};

const stepProps = computed(() => {
  const base: Record<string, any> = { goToStep: safeGoToStep };
  if (['B1_bilan', 'B2_bilan', 'B3_bilan', 'B4_bilan', 'E2_panorama_bilan'].includes(currentStepId.value)) {
    base.goToGlobalBilan = goToGlobalBilan;
  }
  return base;
});

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
