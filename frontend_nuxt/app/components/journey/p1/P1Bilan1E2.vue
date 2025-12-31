<template>
  <JourneyLayout>
    <PPJourneyStepShell
      as="section"
      align="center"
      density="default"
      aria-labelledby="journey-step-heading-E2"
      focus-target-id="journey-step-heading-E2"
    >
      <template #header>
        <JourneyStepHeader
          title="Bilan 1 — où sont les frictions ?"
          subtitle="Lecture rapide par axe. Rien n'est envoyé au serveur."
          heading-id="journey-step-heading-E2"
        />
      </template>

      <!-- Body -->
      <div class="space-y-4">
        <p class="pp-journey-meta">Axes prioritaires</p>
        <div class="grid gap-3 sm:grid-cols-2">
          <PPBadge
            v-for="(axis, index) in axisList"
            :key="axis.key"
            as="div"
            variant="neutral"
            size="sm"
            class="pp-journey-reveal"
            :style="{ '--pp-stagger-delay': `${index * 80}ms` }"
          >
            <span class="font-semibold">{{ axis.label }}</span>
            <span class="text-sm text-[color:var(--pp-color-text-muted)]">{{ formatScore(axis.value) }}</span>
          </PPBadge>
        </div>
        <div class="space-y-2 text-sm text-[color:var(--pp-color-text-muted)]">
          <p>Lecture indicative : plus la valeur est élevée, plus l'axe mérite de l'attention en priorité. Ce n'est pas un verdict, juste un repère pour t'aider à choisir par où commencer.</p>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-wrap gap-3 justify-center">
          <button type="button" class="pp-cta-primary" @click="$emit('continue')">
            Passer à l'étape suivante
          </button>
          <button type="button" class="pp-cta-secondary" @click="$emit('clearStorage')">
            Effacer mes scores enregistrés sur cet appareil
          </button>
        </div>
      </template>
    </PPJourneyStepShell>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import PPJourneyStepShell from '~/components/journey/PPJourneyStepShell.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import type { SymptomScores } from '~/composables/useJourneyDiagnostics';

const props = defineProps<{
  scores: SymptomScores;
}>();

defineEmits<{
  (e: 'continue'): void;
  (e: 'clearStorage'): void;
}>();

const axisLabels: Record<keyof SymptomScores, string> = {
  human: 'Humain / coopération',
  governance: 'Gouvernance / décision',
  organization: 'Organisation / process',
  resources: 'Ressources / soutenabilité'
};

const axisList = computed(() => {
  return (Object.keys(props.scores) as Array<keyof SymptomScores>).map((key) => ({
    key,
    label: axisLabels[key],
    value: props.scores[key]
  }));
});

const formatScore = (score: number) => `${score.toFixed(2)}/5`;
</script>

<style scoped>
@reference "@/assets/css/main.css";

</style>
