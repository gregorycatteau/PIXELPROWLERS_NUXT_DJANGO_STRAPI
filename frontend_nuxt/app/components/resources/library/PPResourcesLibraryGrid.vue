<!--
  PPResourcesLibraryGrid.vue — DS CELL (V1.R2)
  
  Grille de ressources utilisant PPResourcesShell et PPResourceCard.
  
  @props
  - resources: ResourceItem[] — liste des ressources à afficher
-->
<template>
  <PPResourcesShell
    title=""
    density="comfort"
    section-id="resources-grid"
  >
    <PPResourceCard
      v-for="resource in resources"
      :key="resource.id"
      :title="resource.title"
      :description="resource.summary"
      :to="resourceLink(resource)"
      :meta="{
        kind: resource.type,
      }"
      :chips="getResourceChips(resource)"
      :cta-aria-label="`Voir la ressource ${resource.title}`"
    >
      <template #cta-label>
        Consulter
      </template>
    </PPResourceCard>
  </PPResourcesShell>
</template>

<script setup lang="ts">
import {
  RESOURCE_CATEGORY_LABELS,
  RESOURCE_LEVEL_LABELS,
  type ResourceItem,
} from '@/data/resourcesData';
import { safeRoutePath } from '@/utils/cta/safeCta';

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

defineProps<{
  resources: ResourceItem[];
}>();

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function getResourceChips(resource: ResourceItem): { variant: 'tag' | 'stat'; label: string }[] {
  const chips: { variant: 'tag' | 'stat'; label: string }[] = [];

  chips.push({
    variant: 'stat',
    label: RESOURCE_LEVEL_LABELS[resource.level],
  });

  chips.push({
    variant: 'stat',
    label: RESOURCE_CATEGORY_LABELS[resource.category],
  });

  for (const tag of resource.tags.slice(0, 2)) {
    chips.push({ variant: 'tag', label: tag });
  }

  return chips;
}

function resourceLink(resource: ResourceItem): string {
  try {
    return safeRoutePath(resource.path);
  } catch {
    return '/ressources';
  }
}
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
