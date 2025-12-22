<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-E0_intro">
      <JourneyStepHeader
        :title="copy.title"
        :subtitle="copy.subtitle"
        heading-id="journey-step-heading-E0_intro"
      />
      <div class="space-y-3">
        <p class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">
          Ce parcours est en version core. Tu peux deja poser un panorama rapide et obtenir un bilan global.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="pp-journey-cta-primary" @click="goToStep('E1_panorama')">
          {{ copy.cta }}
        </button>
        <NuxtLink class="pp-journey-cta-secondary" to="/contact">
          Parler avec nous
        </NuxtLink>
      </div>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import { p2Copy } from '~/config/journeys/p2CopyV1_0';

defineProps<{
  goToStep: (stepId: string) => void;
}>();

const copy = p2Copy.intro;
</script>
