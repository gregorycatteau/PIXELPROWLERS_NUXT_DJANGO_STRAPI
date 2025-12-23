<template>
  <div class="pp-questionnaire-shell" :class="shellClass">
    <PPCard as="section" variant="default" class="pp-questionnaire-shell__card">
      <div v-if="$slots.header" class="pp-questionnaire-shell__header">
        <slot name="header" />
      </div>

      <div class="pp-questionnaire-shell__body">
        <slot />
      </div>

      <div v-if="$slots.footer" class="pp-questionnaire-shell__footer">
        <slot name="footer" />
      </div>
    </PPCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Density = "compact" | "default" | "comfort";
type Align = "left" | "center";

/**
 * Props DS : une cellule questionnaire standardisée (layout), sans logique métier.
 * - density : contrôle l’aération (lisibilité)
 * - align : alignement global (centre recommandé)
 */
const props = withDefaults(
  defineProps<{
    density?: Density;
    align?: Align;
  }>(),
  {
    density: "default",
    align: "center",
  }
);

/**
 * Construit les classes DS en évitant les variations ad hoc.
 */
const shellClass = computed(() => {
  const classes: string[] = [];

  classes.push(`pp-questionnaire-shell--density-${props.density}`);
  classes.push(`pp-questionnaire-shell--align-${props.align}`);

  return classes;
});
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
