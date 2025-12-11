<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-6" role="region" aria-labelledby="journey-step-heading-E0_intro">
      <JourneyStepHeader
        :title="introCopy.title"
        :subtitle="introCopy.lead"
        heading-id="journey-step-heading-E0_intro"
        class="pp-journey-reveal"
      />
      <div class="pp-journey-section pp-journey-reveal pp-journey-stagger-1">
        <p class="pp-journey-meta">{{ introCopy.stopAnytime }}</p>
        <P1SovereigntyNotice />
      </div>
      <div class="pp-journey-section pp-journey-reveal pp-journey-stagger-2">
        <p class="pp-journey-title text-xl sm:text-2xl">{{ copy.whatToExpectTitle }}</p>
        <div class="pp-journey-body space-y-2">
          <p v-for="line in copy.whatToExpectBody" :key="line">{{ line }}</p>
        </div>
      </div>
      <div class="pp-journey-section pp-journey-reveal pp-journey-stagger-3">
        <p class="pp-journey-title text-xl sm:text-2xl">{{ copy.recognitionTitle }}</p>
        <ul class="pp-journey-body list-disc list-inside space-y-1">
          <li v-for="item in copy.recognitionList" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div class="flex gap-3">
        <button
          type="button"
          class="pp-journey-cta-primary pp-journey-cta-pulse-once"
          style="animation-delay: 320ms"
          @click="goToStep('E1_panorama')"
        >
          {{ copy.cta }}
        </button>
      </div>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import P1SovereigntyNotice from '~/components/journey/p1/P1SovereigntyNotice.vue';
import { p1Copy } from '~/config/journeys/p1QuestionsConfig';
import { P1_INTRO_COPY } from '@/config/journeys/p1CopyV1_3';

defineProps<{
  goToStep: (stepId: string) => void;
}>();

const copy = computed(() => p1Copy.intro);
const introCopy = P1_INTRO_COPY;
</script>
