<template>
  <section class="pp-globalbilan-section" aria-labelledby="p1-global-hypotheses">
    <div class="pp-globalbilan-section-header">
      <h2 id="p1-global-hypotheses" class="pp-globalbilan-section-title">
        {{ title || 'Hypothèses structurantes' }}
      </h2>
      <p class="text-sm text-[color:var(--color-text-muted)]">
        Ce ne sont pas des verdicts. Ce sont des lectures probables du système, à vérifier.
      </p>
    </div>

    <div v-if="hypotheses && hypotheses.length" class="pp-globalbilan-hypothesis-grid">
      <article
        v-for="(hypo, idx) in hypotheses"
        :key="hypo.id"
        class="pp-globalbilan-hypothesis-card space-y-3"
      >
        <div class="flex items-center justify-between">
          <span class="pp-globalbilan-summary-chip">Hypothèse {{ idx + 1 }}</span>
          <button
            type="button"
            class="pp-journey-cta-secondary text-xs"
            :disabled="isDisabled(hypo.id)"
            @click="onToggle(hypo.id)"
          >
            {{ isSelected(hypo.id) ? 'Ne plus retenir' : 'Retenir cette hypothèse' }}
          </button>
        </div>
        <h3 class="text-base font-semibold">
          {{ hypo.title }}
        </h3>
        <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
          {{ hypo.body }}
        </p>
        <p
          v-if="hypo.whyItMatters"
          class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
        >
          {{ hypo.whyItMatters }}
        </p>
        <details v-if="hypo.rationaleLines?.length || hypo.firstCheck" :open="expandDetails" class="space-y-1 text-sm text-[color:var(--color-text-muted)]">
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
        <p
          v-if="!isSelected(hypo.id) && selectedIds.length >= maxSelected"
          class="text-[10px] text-[color:var(--color-text-muted)]"
        >
          Tu peux en retenir jusqu’à {{ maxSelected }}.
        </p>
      </article>
    </div>
    <p v-else class="text-sm text-[color:var(--color-text-muted)]">
      À ce stade, aucune hypothèse structurante ne ressort nettement. Tu peux continuer avec les blocs ou le plan d’action.
    </p>
  </section>
</template>

<script setup lang="ts">
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

const isSelected = (id: string) => props.selectedIds.includes(id);
const isDisabled = (id: string) => props.disabled || (!isSelected(id) && props.selectedIds.length >= props.maxSelected);
const onToggle = (id: string) => {
  if (isDisabled(id)) return;
  emit('toggle', id);
};
</script>

<style scoped>
</style>
