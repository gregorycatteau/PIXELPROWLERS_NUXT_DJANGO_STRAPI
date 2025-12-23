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
      :description="resource.description"
      :href="resource.href"
      :to="resource.to"
      :meta="{
        kind: resource.kind,
        effort: EFFORT_LABELS[resource.effort],
        impact: IMPACT_LABELS[resource.impact],
      }"
      :badge="getResourceBadge(resource)"
      :chips="getResourceChips(resource)"
      :cta-aria-label="`Voir la ressource ${resource.title}`"
    >
      <template #cta-label>
        {{ resource.href ? `Voir sur ${resource.sourceDomain || 'le site'}` : 'Consulter' }}
      </template>
    </PPResourceCard>
  </PPResourcesShell>
</template>

<script setup lang="ts">
import {
  EFFORT_LABELS,
  IMPACT_LABELS,
  STATUS_LABELS,
  type ResourceItem,
  type ResourceStatus,
} from '@/data/resourcesData';

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

defineProps<{
  resources: ResourceItem[];
}>();

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function getResourceBadge(
  resource: ResourceItem
): { variant: 'status' | 'info'; label: string; ariaLabel?: string } | undefined {
  if (resource.status && resource.status !== null) {
    return {
      variant: 'status',
      label: STATUS_LABELS[resource.status as Exclude<ResourceStatus, null>],
      ariaLabel: `Statut: ${STATUS_LABELS[resource.status as Exclude<ResourceStatus, null>]}`,
    };
  }
  return undefined;
}

function getResourceChips(resource: ResourceItem): { variant: 'tag'; label: string }[] {
  // Show first 2 tags as chips
  return resource.tags.slice(0, 2).map((tag) => ({
    variant: 'tag' as const,
    label: tag,
  }));
}
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
