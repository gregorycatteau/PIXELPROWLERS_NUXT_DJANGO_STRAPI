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
        <PPButton type="button" variant="primary" @click="handleResume">
          Reprendre
        </PPButton>
        <PPButton type="button" variant="secondary" @click="handleRestart">
          Recommencer
        </PPButton>
      </div>
    </div>

    <Transition name="journey-step" mode="out-in">
      <JourneyStepRenderer
        :key="currentStepId"
        :manifest="manifest"
        :step-id="currentStepId"
        :go-to-step="safeGoToStep"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from '#imports';
import type { JourneyManifestV1 } from '~/config/journeys/manifests/types';
import { useJourneyEngine } from '~/composables/useJourneyEngine';
import { useCoreJourneyStorage } from '~/composables/useCoreJourneyStorage';
import { getJourneySchemaById } from '~/config/journeys/schemaRegistry';
import { journeyNavigationKey } from '~/composables/journeyNavigation';
import JourneyStepRenderer from '~/components/journey/JourneyStepRenderer.vue';
import { parseStepParam } from '~/utils/journeys/stepParam';

const props = defineProps<{
  manifest: JourneyManifestV1;
  initialStepId?: string | null;
}>();

const route = useRoute();
const router = useRouter();
const journeyId = props.manifest.id;
const schema = computed(() => getJourneySchemaById(journeyId));

const { currentStepId, goToStep } = useJourneyEngine({ journeyId });
const { meta, scores, loadFromStorage, clearAll, saveMeta } = useCoreJourneyStorage({ journeyId });

const allowedSteps = computed(() => schema.value?.steps.map((step) => step.stepId) ?? []);
const allowedSet = computed(() => new Set(allowedSteps.value));
const resumePromptStep = ref<string | null>(null);

const hasPanoramaScores = computed(() => Boolean(scores.value?.panorama) || Boolean(meta.value?.panoramaCompleted));

// Helper pour resoudre les steps standards selon le schema.
const resolveCanonicalSteps = () => {
  const stepIds = allowedSteps.value;
  const panorama = stepIds.includes('E_panorama') ? 'E_panorama' : 'E1_panorama';
  const bilan = stepIds.includes('E_bilan') ? 'E_bilan' : stepIds.includes('E_global_bilan') ? 'E_global_bilan' : 'E2_panorama_bilan';
  return { panorama, bilan };
};

const normalizeStep = (value?: unknown) => {
  const parsed = parseStepParam(value);
  if (!parsed) return null;
  return allowedSet.value.has(parsed) ? parsed : null;
};

const recommendedStep = computed(() => {
  const candidate = meta.value?.lastStepId;
  if (candidate && allowedSet.value.has(candidate)) return candidate;
  return allowedSteps.value[0] ?? null;
});

const safeGoToStep = (stepId: string) => {
  if (!stepId) return;
  const { panorama, bilan } = resolveCanonicalSteps();
  if (stepId === bilan && !hasPanoramaScores.value) {
    goToStep(panorama);
    return;
  }
  if (!allowedSet.value.has(stepId)) {
    const first = allowedSteps.value[0];
    if (first) goToStep(first);
    return;
  }
  goToStep(stepId);
};

provide(journeyNavigationKey, safeGoToStep);

const applyInitialStep = () => {
  const requested = normalizeStep(props.initialStepId ?? route.query.step);
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
