<template>
  <section class="pp-globalbilan-section" aria-labelledby="p1-global-hypotheses">
    <PPSectionHeader
      as="h2"
      density="comfort"
      lead="Ce ne sont pas des verdicts. Ce sont des lectures probables du système, à vérifier."
    >
      <template #title>
        <span id="p1-global-hypotheses">{{ title || 'Hypothèses structurantes' }}</span>
      </template>
    </PPSectionHeader>

    <PPHypothesesPicker
      v-if="hypotheses && hypotheses.length"
      :items="mappedItems"
      :model-value="selectedIds"
      :max-selected="maxSelected"
      :show-go-to-atterrissage="false"
      select-label="Retenir cette hypothèse"
      deselect-label="Ne plus retenir"
      @update:model-value="handleSelectionChange"
    >
      <!-- Slot for detailed content per hypothesis -->
      <template v-for="hypo in hypotheses" :key="hypo.id" #[`item-${hypo.id}`]="{ selected }">
        <div class="space-y-2 text-sm text-[color:var(--color-text-muted)]">
          <p v-if="hypo.whyItMatters" class="leading-relaxed">
            {{ hypo.whyItMatters }}
          </p>
          <details v-if="hypo.rationaleLines?.length || hypo.firstCheck" :open="expandDetails" class="space-y-1">
            <summary class="font-semibold text-[color:var(--color-text)] cursor-pointer">Détails</summary>
            <div class="space-y-2 mt-1">
              <div v-if="hypo.rationaleLines?.length" class="space-y-1">
                <p class="font-semibold text-[color:var(--color-text)]">Pourquoi ça ressort (lecture synthétique)</p>
                <ul class="list-disc list-inside space-y-0.5">
                  <li v-for="line in hypo.rationaleLines" :key="line">{{ line }}</li>
                </ul>
              </div>
              <div v-if="hypo.firstCheck" class="space-y-1">
                <p class="text-sm font-semibold text-[color:var(--color-text)]">
                  Première vérif
                </p>
                <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
                  {{ hypo.firstCheck }}
                </p>
              </div>
            </div>
          </details>
        </div>
      </template>
    </PPHypothesesPicker>

    <p v-else class="text-sm text-[color:var(--color-text-muted)]">
      À ce stade, aucune hypothèse structurante ne ressort nettement. Tu peux continuer avec les blocs ou le plan d'action.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    hypotheses: Array<{
      id: string;
      title: string;
      body: string;
      whyItMatters?: string;
      firstCheck?: string;
      rationaleLines?: string[];
    }>;
    maxSelected?: number;
    selectedIds: string[];
    disabled?: boolean;
    expandDetails?: boolean;
  }>(),
  {
    title: 'Hypothèses structurantes',
    maxSelected: 4,
    disabled: false,
    expandDetails: true
  }
);

const emit = defineEmits<{
  (e: 'toggle', id: string): void;
}>();

// Map hypotheses to PPHypothesesPicker format
const mappedItems = computed(() => 
  props.hypotheses.map((hypo, idx) => ({
    id: hypo.id,
    title: hypo.title,
    description: hypo.body,
    index: idx + 1
  }))
);

// Handle selection changes from PPHypothesesPicker
const handleSelectionChange = (newSelection: string[]) => {
  // Find the toggled item
  const added = newSelection.find(id => !props.selectedIds.includes(id));
  const removed = props.selectedIds.find(id => !newSelection.includes(id));
  
  if (added) {
    emit('toggle', added);
  } else if (removed) {
    emit('toggle', removed);
  }
};
</script>

<style scoped>
</style>
