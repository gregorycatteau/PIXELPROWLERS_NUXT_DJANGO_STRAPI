<template>
  <div>
    <P1JourneyOrchestrator v-if="journeyId === 'p1'" :initial-step-id="initialStepId" />
    <div v-else class="pp-card p-6 space-y-3">
      <p class="text-lg font-semibold">Parcours indisponible</p>
      <p class="text-sm text-[color:var(--color-text-muted)]">Le parcours demandé n’existe pas encore.</p>
      <NuxtLink to="/" class="pp-cta-secondary inline-flex w-auto">Retour à l’accueil</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import P1JourneyOrchestrator from '~/components/journey/p1/P1JourneyOrchestrator.vue';
import { p1JourneySchema } from '~/config/journeys/p1JourneySchema';

definePageMeta({
  layout: 'journey'
});

const route = useRoute();

const journeySlug = computed(() => route.params.journeySlug as string);
const journeyId = computed(() => {
  if (journeySlug.value === 'ma-structure-dysfonctionne') return 'p1';
  return null;
});

const allowedSteps = p1JourneySchema.steps.map((s) => s.stepId);
const initialStepId = computed(() => {
  const stepParam = typeof route.query.step === 'string' ? route.query.step : null;
  if (stepParam && allowedSteps.includes(stepParam)) {
    return stepParam;
  }
  return null;
});
</script>
