<template>
  <component :is="currentComponent" v-bind="componentProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { JourneyManifestV1 } from '~/config/journeys/manifests/types';
import GlobalBilanEngine from '~/components/journey/bilan/GlobalBilanEngine.vue';
import StepIntroE0 from '~/components/journey/steps/StepIntroE0.vue';
import StepPanoramaE1 from '~/components/journey/steps/StepPanoramaE1.vue';
import StepPanoramaBilanE2 from '~/components/journey/steps/StepPanoramaBilanE2.vue';
import StepBilanE2 from '~/components/journey/steps/StepBilanE2.vue';
import StepResourcesE3 from '~/components/journey/steps/StepResourcesE3.vue';
import StepExitE4 from '~/components/journey/steps/StepExitE4.vue';

const props = defineProps<{
  manifest: JourneyManifestV1;
  stepId: string;
  goToStep: (stepId: string) => void;
}>();

const currentComponent = computed(() => {
  switch (props.stepId) {
    case 'E0_intro':
      return StepIntroE0;
    case 'E_panorama':
    case 'E1_panorama':
      return StepPanoramaE1;
    case 'E2_panorama_bilan':
      return StepPanoramaBilanE2;
    case 'E_bilan':
      return StepBilanE2;
    case 'E_resources':
      return StepResourcesE3;
    case 'E_exit':
      return StepExitE4;
    case 'E_global_bilan':
      return GlobalBilanEngine;
    default:
      return StepIntroE0;
  }
});

const componentProps = computed(() => {
  if (props.stepId === 'E_global_bilan') {
    return { journeyId: props.manifest.id, goToStep: props.goToStep };
  }
  return { manifest: props.manifest, goToStep: props.goToStep };
});
</script>
