<template>
  <!--
    PPCard — Design System ENFORCED
    - Atome container pour tous les “card-like wrappers”
    - Variants fermés (enum)
    - Autorise uniquement l’ajout de classes "layout" via class="" (padding/spacing/grid/etc).
      Les styles card (rounded/border/bg/shadow) doivent rester dans les classes DS + tokens.
      Un guard CI dédié empêchera les dérives.
  -->
  <component :is="resolvedTag" :class="mergedClass" v-bind="forwardedAttrs">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

type PPCardVariant = "default" | "soft" | "accent" | "indicator" | "journey";
type PPCardTag = "div" | "article" | "section" | "aside" | "details";

interface PPCardProps {
  /**
   * Variant DS (ENFORCED)
   * - default   : carte standard
   * - soft      : carte “soft” (utile bilans / sections)
   * - accent    : carte mise en avant (accent)
   * - indicator : carte “signal / aside / status”
   * - journey   : carte de sélection parcours (peut être active)
   */
  variant?: PPCardVariant;

  /**
   * Rend la carte “hoverable” (effets de survol).
   */
  hoverable?: boolean;

  /**
   * État actif (principalement pour variant="journey").
   */
  active?: boolean;

  /**
   * Tag HTML (structure sémantique)
   */
  as?: PPCardTag;
}

const props = withDefaults(defineProps<PPCardProps>(), {
  variant: "default",
  hoverable: false,
  active: false,
  as: "div",
});

const attrs = useAttrs();

/**
 * Forward attrs sans “class” (les classes DS + layout sont gérées dans `mergedClass`).
 */
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

const resolvedTag = computed(() => props.as);

/**
 * Map variant → classes DS existantes (et/ou à standardiser progressivement).
 * IMPORTANT : on privilégie les classes déjà présentes dans pp.components.css pour limiter les régressions.
 */
const variantClass = computed(() => {
  switch (props.variant) {
    case "soft":
      return "pp-journey-card-soft";
    case "accent":
      return "pp-card pp-card-accent";
    case "indicator":
      return "pp-card pp-card-indicator";
    case "journey":
      return "pp-card-journey";
    case "default":
    default:
      return "pp-card";
  }
});

/**
 * Classes finales :
 * - DS classes (canon)
 * - classes layout fournies par l’appelant (ex: p-4, space-y-3, flex, gap-*)
 */
const mergedClass = computed(() => {
  const classes: string[] = [variantClass.value];

  if (props.hoverable) classes.push("pp-card-hover");
  if (props.active) classes.push("pp-card-journey-active");

  const extra = (attrs.class as string | undefined)?.trim();
  if (extra) classes.push(extra);

  return classes.join(" ");
});
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
