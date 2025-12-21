<template>
  <JourneyLayout>
    <section
      class="pp-journey-intro-shell"
      role="region"
      aria-labelledby="journey-step-heading-E0_intro"
    >
      <div class="pp-journey-intro-header">
        <h1
          id="journey-step-heading-E0_intro"
          class="pp-journey-intro-title"
        >
          {{ p1EngagementCopy.introE0.title }}
        </h1>
        <p class="pp-journey-intro-subtitle">
          {{ headerSubtitle }}
        </p>
      </div>

      <div class="pp-journey-intro-body">
        <div class="pp-journey-intro-text">
          <p
            v-for="paragraph in bodyParagraphs"
            :key="paragraph"
            class="pp-journey-body"
          >
            {{ paragraph }}
          </p>
        </div>

        <aside class="pp-journey-intro-sovereignty" aria-labelledby="p1-intro-sovereignty">
          <h2 id="p1-intro-sovereignty" class="pp-journey-intro-sovereignty-title">
            <span class="pp-journey-intro-sovereignty-icon">🛡️</span>
            <span>Souveraineté</span>
          </h2>
          <p class="pp-journey-intro-sovereignty-text">
            {{ sovereignty }}
          </p>
          <p class="pp-journey-intro-sovereignty-text">
            {{ sharedDeviceWarning }}
          </p>
        </aside>
      </div>

      <div class="pp-journey-intro-footer">
        <p class="pp-journey-intro-footer-hint">
          {{ footerHint }}
        </p>
        <button
          type="button"
          class="pp-journey-cta-primary pp-journey-cta-pulse-once pp-journey-intro-cta"
          style="animation-delay: 320ms"
          @click="goToStep('E1_panorama')"
        >
          {{ ctaLabel }}
        </button>
      </div>
    </section>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import { p1Copy } from '~/config/journeys/p1QuestionsConfig';
import { p1EngagementCopy } from '~/config/journeys/p1EngagementCopy';
import { P1_INTRO_COPY } from '@/config/journeys/p1CopyV1_3';

defineProps<{
  goToStep: (stepId: string) => void;
}>();

const ctaLabel = computed(() => p1Copy.intro.cta);
const footerHint = computed(() => p1Copy.intro.meta || P1_INTRO_COPY.stopAnytime);

const mainParagraphs = computed(() => p1EngagementCopy.introE0.main.split('\n\n').filter(Boolean));
const secondaryParagraphs = computed(() => p1EngagementCopy.introE0.secondary.split('\n\n').filter(Boolean));

const headerSubtitle = computed(() => mainParagraphs.value[0] ?? '');
const bodyParagraphs = computed(() => {
  const withoutHeader = mainParagraphs.value.slice(1);
  return [...withoutHeader, ...secondaryParagraphs.value];
});

const sovereignty = P1_INTRO_COPY.sovereignty;
const sharedDeviceWarning = P1_INTRO_COPY.sharedDeviceWarning;
</script>
