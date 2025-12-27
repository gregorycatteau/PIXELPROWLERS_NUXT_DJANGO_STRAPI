<template>
  <div class="space-y-4">
    <PPErrorState
      v-if="hasError"
      :title="errorTitle"
      :description="errorDescription"
    />
    <PPEmptyState
      v-else-if="!hasActions"
      :title="emptyTitle"
      :description="emptyDescription"
      icon="inbox"
    />
    <div v-else class="grid gap-4 md:grid-cols-2">
      <PPCard
        v-for="action in actions"
        :key="action.id"
        as="article"
        variant="default"
        class="space-y-3"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
              {{ kindLabel[action.kind] ?? 'Action' }}
            </p>
            <h3 class="text-base font-semibold text-[color:var(--color-text)]">
              {{ action.title }}
            </h3>
          </div>
          <NuxtLink :to="action.to" class="pp-journey-cta-secondary text-xs">
            {{ action.ctaLabel }}
          </NuxtLink>
        </div>
        <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
          {{ action.summary }}
        </p>
      </PPCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PPCard from '@/components/PPCard.vue';
import PPEmptyState from '@/components/PPEmptyState.vue';
import PPErrorState from '@/components/PPErrorState.vue';
import type { ActionItem } from '@/types/actions';

const props = withDefaults(
  defineProps<{
    actions: ActionItem[];
    hasError?: boolean;
    errorTitle?: string;
    errorDescription?: string;
    emptyTitle?: string;
    emptyDescription?: string;
  }>(),
  {
    hasError: false,
    errorTitle: 'Impossible de charger les actions.',
    errorDescription: 'Reessaie dans un instant.',
    emptyTitle: 'Aucune action disponible.',
    emptyDescription: 'Reviens plus tard pour de nouvelles propositions.',
  }
);

const hasActions = computed(() => props.actions.length > 0);

const kindLabel: Record<ActionItem['kind'], string> = {
  resource_filters: 'Ressources',
  resource: 'Ressource',
  action: 'Action',
  export: 'Export',
  info: 'Info',
};
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
