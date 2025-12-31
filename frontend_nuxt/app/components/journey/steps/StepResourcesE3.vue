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
                <p class="text-[0.7rem] uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  {{ item.categoryLabel }}
                </p>
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
import { listResources } from '@/config/resources/registryV0';
import { RESOURCE_CATEGORY_LABELS } from '@/data/resourcesData';

const props = defineProps<{
  manifest: JourneyManifestV1;
  goToStep?: (stepId: string) => void;
}>();

const allResources = listResources();

const resourceItems = computed(() => {
  const journeyId = props.manifest.id;
  const matched = allResources.filter((resource) =>
    resource.relatedJourneys.includes(journeyId)
  );
  const source = matched.length > 0 ? matched : allResources;
  return source.slice(0, 3).map((resource) => ({
    id: resource.id,
    title: resource.title,
    summary: resource.summary,
    categoryLabel: RESOURCE_CATEGORY_LABELS[resource.category],
    link: buildResourcesDeepLink({
      category: resource.category,
      q: resource.title,
    }),
  }));
});

const resourcesLink = buildResourcesDeepLink({});
</script>
