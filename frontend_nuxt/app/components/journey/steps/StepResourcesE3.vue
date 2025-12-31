<template>
  <JourneyLayout>
    <PPJourneyStepShell
      as="section"
      align="center"
      density="default"
      aria-labelledby="journey-step-heading-E_resources"
      focus-target-id="journey-step-heading-E_resources"
    >
      <template #header>
        <JourneyStepHeader
          title="Ressources utiles"
          subtitle="Selection ouverte, sans compte. Liens internes uniquement."
          heading-id="journey-step-heading-E_resources"
        />
      </template>

      <div class="space-y-4">
        <p class="pp-journey-body">
          Cette section regroupe des ressources publiques pour continuer a ton rythme.
        </p>
        <p class="text-sm text-[color:var(--color-text-muted)]">
          Aucun contenu n'est partage. Tout reste local.
        </p>

        <div class="grid gap-3">
          <PPCard v-for="item in resourceItems" :key="item.id" variant="soft" class="p-4 space-y-2">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold">{{ item.title }}</p>
                <p class="text-xs text-[color:var(--color-text-muted)]">{{ item.summary }}</p>
              </div>
              <NuxtLink class="pp-cta-secondary text-xs" :to="item.link">
                Voir
              </NuxtLink>
            </div>
          </PPCard>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-wrap gap-3 justify-center">
          <NuxtLink class="pp-cta-primary" :to="resourcesLink">
            Acceder aux ressources
          </NuxtLink>
        </div>
      </template>
    </PPJourneyStepShell>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { JourneyManifestV1 } from '~/config/journeys/manifests/types';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import PPJourneyStepShell from '~/components/journey/PPJourneyStepShell.vue';
import PPCard from '~/components/PPCard.vue';
import { buildResourcesDeepLink } from '~/utils/deeplinks/resourcesDeepLink';

const props = defineProps<{
  manifest: JourneyManifestV1;
  goToStep?: (stepId: string) => void;
}>();

// Helper pour generer une liste courte de ressources placeholder par parcours.
const buildPlaceholderResources = (journeyId: string) => {
  return [
    {
      id: `${journeyId}-resource-1`,
      title: 'Kit de demarrage',
      summary: 'Un recap simple pour lancer un premier test.',
      link: buildResourcesDeepLink({ tags: [journeyId] })
    },
    {
      id: `${journeyId}-resource-2`,
      title: 'Guide rapide',
      summary: 'Une lecture express pour cadrer la suite.',
      link: buildResourcesDeepLink({ tags: [journeyId] })
    },
    {
      id: `${journeyId}-resource-3`,
      title: 'Check-list d action',
      summary: '3 actions simples pour avancer sans friction.',
      link: buildResourcesDeepLink({ tags: [journeyId] })
    }
  ];
};

const resourcesLink = buildResourcesDeepLink({ tags: [props.manifest.id] });
const resourceItems = computed(() => buildPlaceholderResources(props.manifest.id));
</script>
