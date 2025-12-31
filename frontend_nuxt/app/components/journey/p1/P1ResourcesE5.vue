<template>
  <JourneyLayout>
    <PPJourneyStepShell role="region" aria-labelledby="journey-step-heading-E5">
      <template #header>
        <JourneyStepHeader
          title="Ressources open source"
          subtitle="Prioritaires maintenant, et une sélection pour plus tard. Utilisables sans compte, sans retour obligatoire ici."
          heading-id="journey-step-heading-E5"
        />
      </template>

      <div class="space-y-5">
        <ResourcesList
          title="Prioritaire pour toi maintenant"
          :resources="primaryResources"
          @select="handleSelect"
        />
        <ResourcesList
          title="Pour explorer plus tard"
          :resources="secondaryResources"
          @select="handleSelect"
        />
      </div>

      <p class="text-sm text-[color:var(--color-text-muted)]">
        Ces ressources sont externes ; rien n'est renvoyé vers PixelProwlers lorsque tu les ouvres. Tu peux t'en servir sans jamais revenir ici, et c'est parfaitement ok.
      </p>

      <template #footer>
        <div class="flex flex-wrap gap-3">
          <button type="button" class="pp-cta-primary" @click="$emit('goToCarrefour')">
            Aller au carrefour final
          </button>
        </div>
      </template>
    </PPJourneyStepShell>
  </JourneyLayout>
</template>

<script setup lang="ts">
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import PPJourneyStepShell from '~/components/journey/PPJourneyStepShell.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import ResourcesList, { type ResourceCardProps } from '~/components/journey/ResourcesList.vue';
import { useAnalytics } from '~/composables/useAnalytics';

const emit = defineEmits<{
  (e: 'goToCarrefour'): void;
}>();

defineProps<{
  primaryResources: ResourceCardProps[];
  secondaryResources: ResourceCardProps[];
}>();

const { trackEvent } = useAnalytics();

const handleSelect = (payload: { id: string; level: 'debutant' | 'intermediaire' | 'avance' }) => {
  trackEvent('resource_click', { resource_id: payload.id, resource_level: payload.level, journey_id: 'p1' });
};
</script>
