<template>
  <JourneyLayout>
    <PPJourneyStepShell
      as="section"
      align="center"
      density="default"
      aria-labelledby="journey-step-heading-E4"
      focus-target-id="journey-step-heading-E4"
    >
      <template #header>
        <JourneyStepHeader
          title="Bilan 2 — lecture VUCA & valeurs"
          subtitle="Synthèse courte, exportable côté navigateur."
          heading-id="journey-step-heading-E4"
        />
      </template>

      <!-- Body -->
      <div class="space-y-5">
        <div class="space-y-3">
        <div class="BilanBlock pp-journey-reveal">
          <p class="BilanLabel">Indice VUCA</p>
          <p class="BilanValue">{{ formatScore(vucaProfile.vucaIndex) }}</p>
          <p class="BilanHelper">Plus l’indice est élevé, plus l’environnement est mouvant et demande de l’agilité.</p>
        </div>
        <div class="BilanBlock pp-journey-reveal pp-journey-stagger-1">
          <p class="BilanLabel">Profil valeurs & alignement</p>
          <p class="BilanValue">{{ vucaProfile.valuesProfile || 'À préciser' }}</p>
          <p class="BilanHelper">
            Lecture simple : A = alignement partagé ; B = toi aligné, structure en tension ; C = flou partagé ; D = structure perçue cohérente, toi en décalage.
          </p>
        </div>
      </div>
      <div class="space-y-2 pp-journey-reveal pp-journey-stagger-2">
        <p class="text-sm font-semibold">Questions de sens</p>
        <ul class="list-disc list-inside text-sm text-[color:var(--color-text-muted)] space-y-1">
          <li v-for="question in questionsDeSens" :key="question">{{ question }}</li>
        </ul>
      </div>
      <div class="space-y-3 pp-journey-reveal pp-journey-stagger-3">
        <p class="text-sm font-semibold">Exporter ce bilan (sur ton appareil)</p>
        <textarea
          class="pp-form-field min-h-[140px]"
          readonly
          :value="exportText"
        />
        <button type="button" class="pp-journey-cta-secondary" @click="handlePrint">
          Imprimer ce bilan
        </button>
      </div>
      </div>

      <template #footer>
        <div class="flex flex-wrap gap-3 justify-center">
          <button type="button" class="pp-cta-primary" @click="$emit('continue')">
            Continuer vers les ressources
          </button>
          <button type="button" class="pp-cta-secondary" @click="$emit('clearStorage')">
            Effacer mes réponses de cet appareil
          </button>
        </div>
      </template>
    </PPJourneyStepShell>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import type { VucaProfile } from '~/composables/useJourneyDiagnostics';

const props = defineProps<{
  vucaProfile: VucaProfile;
  questionsDeSens: string[];
  summaryBullets: string[];
}>();

defineEmits<{
  (e: 'continue'): void;
  (e: 'clearStorage'): void;
}>();

const formatScore = (score: number) => `${score.toFixed(2)}/5`;

const exportText = computed(() => {
  const bullets = props.summaryBullets.map((b) => `- ${b}`).join('\n');
  return [
    'Bilan VUCA & valeurs (local, non envoyé)',
    `Indice VUCA : ${formatScore(props.vucaProfile.vucaIndex)}`,
    `Profil valeurs : ${props.vucaProfile.valuesProfile ?? 'À préciser'}`,
    'Résumé :',
    bullets
  ].join('\n');
});

const handlePrint = () => {
  if (typeof window !== 'undefined') {
    window.print();
  }
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.BilanBlock {
  @apply rounded-xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] p-4 space-y-1;
}

.BilanLabel {
  @apply text-sm font-semibold text-[color:var(--color-text-primary)];
}

.BilanValue {
  @apply text-lg font-bold;
}

.BilanHelper {
  @apply text-sm text-[color:var(--color-text-muted)];
}
</style>
