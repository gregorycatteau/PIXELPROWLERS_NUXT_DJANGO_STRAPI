<template>
  <JourneyLayout>
    <PPJourneyStepShell
      as="section"
      align="center"
      density="default"
      aria-labelledby="journey-step-heading-E0_intro"
      focus-target-id="journey-step-heading-E0_intro"
    >
      <template #header>
        <h1
          id="journey-step-heading-E0_intro"
          class="pp-step-shell__title"
        >
          {{ p1EngagementCopy.introE0.title }}
        </h1>
        <p class="pp-step-shell__subtitle">
          {{ headerSubtitle }}
        </p>
      </template>

      <!-- Body -->
      <div class="space-y-4">
        <div class="space-y-3">
          <p
            v-for="paragraph in bodyParagraphs"
            :key="paragraph"
            class="pp-journey-body"
          >
            {{ paragraph }}
          </p>
        </div>

        <aside class="pp-card pp-card--soft space-y-2" aria-labelledby="p1-intro-sovereignty">
          <h2 id="p1-intro-sovereignty" class="text-base font-semibold flex items-center gap-2">
            <span>🛡️</span>
            <span>Souveraineté</span>
          </h2>
          <p class="text-sm text-[color:var(--pp-color-text-muted)]">
            {{ sovereignty }}
          </p>
          <p class="text-sm text-[color:var(--pp-color-text-muted)]">
            {{ sharedDeviceWarning }}
          </p>
        </aside>
      </div>

      <p class="text-sm text-[color:var(--pp-color-text-muted)] text-center">
        {{ footerHint }}
      </p>
    </PPJourneyStepShell>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import PPJourneyStepShell from '~/components/journey/PPJourneyStepShell.vue';
import { p1Copy } from '~/config/journeys/p1QuestionsConfig';
import { p1EngagementCopy } from '~/config/journeys/p1EngagementCopy';
import { P1_INTRO_COPY } from '@/config/journeys/p1CopyV1_3';

defineProps<{
  goToStep: (stepId: string) => void;
}>();

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
