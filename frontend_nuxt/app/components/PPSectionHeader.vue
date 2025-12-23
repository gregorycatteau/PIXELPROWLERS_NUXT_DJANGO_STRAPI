<template>
  <!--
    PPSectionHeader — Design System ENFORCED
    Objectif :
    - Standardiser tous les en-têtes de sections (titre, lead, meta, actions)
    - Améliorer lisibilité (scan) + a11y (hiérarchie)
    - Éviter les variations de styles “à la main” dans chaque page
  -->
  <header class="pp-section-header" :class="densityClass">
    <div class="pp-section-header__main">
      <p v-if="eyebrow" class="pp-section-header__eyebrow">
        {{ eyebrow }}
      </p>

      <component :is="as" class="pp-section-header__title">
        <slot name="title">{{ title }}</slot>
      </component>

      <p v-if="lead" class="pp-section-header__lead">
        {{ lead }}
      </p>

      <div v-if="$slots.meta" class="pp-section-header__meta">
        <slot name="meta" />
      </div>
    </div>

    <div v-if="$slots.actions" class="pp-section-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";

type PPSectionHeaderAs = "h2" | "h3" | "h4";
type PPSectionHeaderDensity = "compact" | "comfort";

interface PPSectionHeaderProps {
  /**
   * Niveau du titre (ENFORCED)
   * - h2 : sections majeures
   * - h3 : sous-sections
   * - h4 : micro-sections
   */
  as?: PPSectionHeaderAs;

  /**
   * Titre simple (sinon utiliser slot title)
   */
  title?: string;

  /**
   * Petit libellé au-dessus du titre (optionnel)
   */
  eyebrow?: string;

  /**
   * Texte d’intro/lead (optionnel)
   */
  lead?: string;

  /**
   * Densité de lecture
   * - compact : listes/écrans denses
   * - comfort : bilan/lecture humaine
   */
  density?: PPSectionHeaderDensity;
}

const props = withDefaults(defineProps<PPSectionHeaderProps>(), {
  as: "h2",
  title: "",
  eyebrow: "",
  lead: "",
  density: "comfort",
});

const densityClass = computed(() => {
  return props.density === "compact" ? "pp-section-header--compact" : "pp-section-header--comfort";
});
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
