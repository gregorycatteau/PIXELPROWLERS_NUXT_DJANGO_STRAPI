<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-6" role="region" aria-labelledby="journey-step-heading-E6">
      <JourneyStepHeader
        title="Et maintenant ?"
        subtitle="Trois portes possibles. Tu choisis celle qui te convient, sans transmettre tes réponses."
        heading-id="journey-step-heading-E6"
      />
      <p class="text-sm text-[color:var(--color-text-muted)]">
        Tu viens de faire un travail que beaucoup repoussent pendant des années. Merci d’avoir pris ce temps-là pour toi et pour ta structure. Rien n’est envoyé au serveur : ce que tu as partagé reste sur cet appareil. À partir de maintenant, tu choisis la suite qui te semble la plus juste pour toi.
      </p>
      <CarrefourChoices :options="options" @select="(id) => $emit('selectOption', id)" />
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import CarrefourChoices from '~/components/journey/CarrefourChoices.vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import type { CarrefourChoiceCardProps } from '~/components/journey/CarrefourChoices.vue';

defineProps<{
  options: CarrefourChoiceCardProps[];
}>();

defineEmits<{
  (e: 'selectOption', id: 'autonomie' | 'relinium' | 'fit'): void;
}>();
</script>
