<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-E0_intro">
      <JourneyStepHeader
        :title="copy.title"
        :subtitle="copy.subtitle"
        heading-id="journey-step-heading-E0_intro"
      />

      <button type="button" class="pp-journey-cta-primary" @click="handleStart">
        {{ copy.cta }}
      </button>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { JourneyManifestV1 } from '~/config/journeys/manifests/types';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import { getJourneyCopy } from '~/config/journeys/journeyDataRegistry';
import { getJourneySchemaById } from '~/config/journeys/schemaRegistry';

const props = defineProps<{
  manifest: JourneyManifestV1;
  goToStep: (stepId: string) => void;
}>();

const fallbackCopy = {
  title: `Parcours ${props.manifest.id.toUpperCase()}`,
  subtitle: 'Panorama rapide, reponses locales uniquement.',
  cta: 'Commencer le panorama'
};

const copy = computed(() => {
  const bundle = getJourneyCopy(props.manifest);
  return bundle?.intro ? { ...fallbackCopy, ...bundle.intro } : fallbackCopy;
});

const journeySchema = computed(() => getJourneySchemaById(props.manifest.id));

// Helper pour trouver le prochain step depuis le schema (fallback neutre si absent).
const resolveNextStepId = () => {
  const steps = journeySchema.value?.steps ?? [];
  const stepIds = steps.map((step) => step.stepId);
  if (stepIds.includes('E_panorama')) return 'E_panorama';
  if (stepIds.includes('E1_panorama')) return 'E1_panorama';
  return stepIds[1] ?? 'E_panorama';
};

const handleStart = () => {
  props.goToStep(resolveNextStepId());
};
</script>
