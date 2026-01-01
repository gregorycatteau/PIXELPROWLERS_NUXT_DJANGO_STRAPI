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
        <p class="pp-stepresources__disclaimer">
          Aucun contenu n'est partage. Tout reste local.
        </p>

        <div class="grid gap-3">
          <PPCard v-for="item in resourceItems" :key="item.id" variant="soft" class="p-4 space-y-2">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold">{{ item.title }}</p>
                <p class="pp-stepresources__summary">{{ item.summary }}</p>
                <p class="pp-stepresources__meta">
                  {{ item.categoryLabel }}
                </p>
                <p class="pp-stepresources__reason">{{ item.reason }}</p>
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
import { getBilanAdapter } from '~/adapters/bilan/registry';
import { createEmptyUniversalBilanViewModel, withUniversalBilanDefaults } from '~/types/bilan';
import { recommendResourcesFromBilan } from '@/utils/resources/recommendResourcesFromBilan';
import { safeRoutePath } from '@/utils/cta/safeCta';

const props = defineProps<{
  manifest: JourneyManifestV1;
  goToStep?: (stepId: string) => void;
}>();

const allResources = listResources();
const resourcesBySlug = new Map(allResources.map((resource) => [resource.slug, resource]));

const emptyVm = createEmptyUniversalBilanViewModel();
const adapter = computed(() => getBilanAdapter(props.manifest.id));
const vm = computed(() => withUniversalBilanDefaults(adapter.value?.buildViewModel() ?? emptyVm));

const resourceItems = computed(() => {
  const recommendations = recommendResourcesFromBilan({
    panorama: vm.value.panorama,
    sections: vm.value.sections,
    modules: vm.value.modules,
  });

  return recommendations.flatMap((reco) => {
    const resource = resourcesBySlug.get(reco.slug);
    if (!resource) return [];
    return [{
      id: resource.id,
      title: resource.title,
      summary: resource.summary,
      categoryLabel: RESOURCE_CATEGORY_LABELS[resource.category],
      reason: reco.reason,
      link: safeRoutePath(`/ressources/${resource.slug}`),
    }];
  });
});

const resourcesLink = buildResourcesDeepLink({});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.pp-stepresources__disclaimer {
  @apply text-sm;
  color: var(--color-text-muted);
}

.pp-stepresources__summary {
  @apply text-xs;
  color: var(--color-text-muted);
}

.pp-stepresources__meta {
  @apply uppercase tracking-wide;
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.pp-stepresources__reason {
  @apply text-xs;
  color: var(--color-text-muted);
}
</style>
