<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-E0_intro">
      <JourneyStepHeader
        :title="copy.title"
        :subtitle="copy.subtitle"
        heading-id="journey-step-heading-E0_intro"
      />

      <button type="button" class="pp-journey-cta-primary" @click="goToStep('E1_panorama')">
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
</script>
