<template>
  <JourneyLayout>
    <PPJourneyStepShell
      as="section"
      align="center"
      density="default"
      aria-labelledby="journey-step-heading-E_bilan"
      focus-target-id="journey-step-heading-E_bilan"
    >
      <template #header>
        <JourneyStepHeader
          title="Bilan"
          subtitle="Synthese neutre, uniquement des agregats."
          heading-id="journey-step-heading-E_bilan"
        />
      </template>

      <div class="space-y-4">
        <p class="pp-journey-body">
          Voici les sections obligatoires du bilan. Les donnees restent locales.
        </p>

        <div v-if="panoramaAxes.length" class="space-y-3">
          <p class="text-sm font-semibold">Panorama express</p>
          <div class="grid gap-3 sm:grid-cols-3">
            <PPCard
              v-for="axis in panoramaAxes"
              :key="axis.id"
              variant="soft"
              class="p-4 space-y-2"
            >
              <p class="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">
                {{ axis.label }}
              </p>
              <p class="text-2xl font-semibold">{{ axis.score }}</p>
              <p class="text-xs text-[color:var(--color-text-muted)]">Score sur 100</p>
            </PPCard>
          </div>
        </div>

        <div v-if="priorities.length" class="space-y-2">
          <p class="text-sm font-semibold">Priorites immediates</p>
          <ol class="list-decimal space-y-1 pl-5 text-sm text-[color:var(--color-text-muted)]">
            <li v-for="axis in priorities" :key="axis.id">
              {{ axis.label }}
            </li>
          </ol>
        </div>

        <div class="grid gap-3">
          <PPCard
            v-for="section in orderedSections"
            :key="section.id"
            variant="soft"
            class="p-4 space-y-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold">{{ section.title }}</p>
                <p class="text-xs text-[color:var(--color-text-muted)]">{{ section.summary }}</p>
              </div>
              <span class="pp-badge pp-badge--soft text-xs">
                {{ formatStateLabel(section.state, section.itemsCount) }}
              </span>
            </div>

            <PPEmptyState
              v-if="section.state === 'empty'"
              title="Aucun signal pour le moment"
              description="Complete le panorama pour enrichir cette section."
              variant="compact"
            />
          </PPCard>
        </div>

        <ResourcesActionsPanel
          v-if="hasResourcesActions"
          :recommended="resourcesActions.recommended"
          :library="resourcesActions.library"
          :tags="resourcesActions.tags"
        />
      </div>
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
import PPEmptyState from '~/components/PPEmptyState.vue';
import ResourcesActionsPanel from '~/components/journey/bilan/ResourcesActionsPanel.vue';
import { getBilanAdapter } from '~/adapters/bilan/registry';
import { createEmptyUniversalBilanViewModel, withUniversalBilanDefaults } from '~/types/bilan';
import { UNIVERSAL_BILAN_SECTION_IDS } from '~/adapters/bilan/universalBilanViewModel';

const props = defineProps<{
  manifest: JourneyManifestV1;
  goToStep?: (stepId: string) => void;
}>();

const emptyVm = createEmptyUniversalBilanViewModel();
const adapter = computed(() => getBilanAdapter(props.manifest.id));
const vm = computed(() => withUniversalBilanDefaults(adapter.value?.buildViewModel() ?? emptyVm));

const orderedSections = computed(() =>
  UNIVERSAL_BILAN_SECTION_IDS.map((id) => vm.value.sections[id])
);

const panoramaAxes = computed(() => vm.value.panorama.axes ?? []);
const priorities = computed(() =>
  panoramaAxes.value
    .slice()
    .sort((a, b) => (b.score - a.score) || a.label.localeCompare(b.label))
    .slice(0, 3)
);
const resourcesActions = computed(() => vm.value.modules?.resourcesActions ?? {
  recommended: [],
  library: [],
  tags: []
});
const hasResourcesActions = computed(() =>
  Boolean(resourcesActions.value.recommended.length || resourcesActions.value.library.length)
);

// Helper pour afficher un libelle d'etat neutre par section.
const formatStateLabel = (state: string, count: number) => {
  if (state === 'full') return `${count} item(s)`;
  if (state === 'partial') return `${count} item(s) partiel`;
  return 'A completer';
};
</script>
