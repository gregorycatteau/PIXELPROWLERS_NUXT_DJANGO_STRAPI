<template>
  <!--
    PPChip — Design System ENFORCED (V1.1 — R3B)
    - Atome interactif : métriques, catégories, contrôles
    - Variants sémantiques : stat | tag | action
    - A11y : aria-pressed si toggle, focus-visible renforcé pour action
    - Sécurité : type="button" par défaut
  -->
  <component
    :is="resolvedTag"
    class="pp-chip"
    :class="mergedClass"
    :type="buttonType"
    :aria-pressed="ariaPressed"
    :disabled="disabled"
    v-bind="forwardedAttrs"
    @click="onClick"
  >
    <span v-if="$slots.icon" class="pp-chip__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="pp-chip__label">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

/**
 * PPChip V1.1 (R3B) — Variants sémantiques
 * - stat: métriques/scores (non-interactif, display only)
 * - tag: catégories/labels (interactif léger)
 * - action: contrôles/filtres/toggles (interactif fort, a11y renforcée)
 *
 * Legacy compat: neutral|outline|accent restent supportés pour migration graduelle
 */
type PPChipVariant = "stat" | "tag" | "action" | "neutral" | "outline" | "accent";
type PPChipSize = "sm" | "md";
type PPChipTag = "button" | "div" | "a" | "NuxtLink";

interface PPChipProps {
  /**
   * Variant DS (ENFORCED)
   * - stat: métriques/scores (display only)
   * - tag: catégories/labels
   * - action: contrôles/filtres/toggles (as="button" obligatoire)
   */
  variant?: PPChipVariant;

  /**
   * Size DS (ENFORCED)
   */
  size?: PPChipSize;

  /**
   * Chip sélectionné (état visuel)
   */
  selected?: boolean;

  /**
   * Si true, expose aria-pressed et attend un comportement toggle.
   * Par défaut: true pour action, false pour stat/tag
   */
  toggle?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Render tag
   * - button: défaut (obligatoire pour variant="action")
   * - NuxtLink/a/div: rares cas de navigation ou display
   */
  as?: PPChipTag;
}

const props = withDefaults(defineProps<PPChipProps>(), {
  variant: "tag",
  size: "sm",
  selected: false,
  toggle: undefined, // auto-déterminé selon variant
  disabled: false,
  as: "button",
});

const emit = defineEmits<{
  /**
   * Event d’intention (le parent décide si toggle ou non)
   */
  (e: "click", ev: MouseEvent): void;
}>();

const attrs = useAttrs();

const forwardedAttrs = computed(() => {
  const { class: _class, type: _type, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

const resolvedTag = computed(() => props.as);

/**
 * Si rendu en <button>, impose type="button" par défaut (sauf si l’appelant fournit explicitement type)
 */
const buttonType = computed(() => {
  if (props.as !== "button") return undefined;
  const explicit = (attrs as Record<string, unknown>).type as string | undefined;
  return explicit ?? "button";
});

/**
 * Auto-toggle selon variant si non explicite
 * - action: toggle=true par défaut
 * - stat/tag: toggle=false par défaut
 */
const effectiveToggle = computed(() => {
  if (props.toggle !== undefined) return props.toggle;
  return props.variant === "action";
});

const ariaPressed = computed(() => {
  if (!effectiveToggle.value) return undefined;
  return props.selected ? "true" : "false";
});

const variantClass = computed(() => {
  switch (props.variant) {
    // Nouveaux variants sémantiques (R3B)
    case "stat":
      return "pp-chip--stat";
    case "tag":
      return "pp-chip--tag";
    case "action":
      return "pp-chip--action";
    // Legacy compat (migration progressive)
    case "accent":
      return "pp-chip--accent";
    case "neutral":
      return "pp-chip--neutral";
    case "outline":
    default:
      return "pp-chip--outline";
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "md":
      return "pp-chip--md";
    case "sm":
    default:
      return "pp-chip--sm";
  }
});

const selectedClass = computed(() => (props.selected ? "pp-chip--selected" : "pp-chip--unselected"));

const mergedClass = computed(() => {
  const classes: string[] = [variantClass.value, sizeClass.value, selectedClass.value];
  const extra = (attrs.class as string | undefined)?.trim();
  if (extra) classes.push(extra);
  return classes.join(" ");
});

function onClick(ev: MouseEvent) {
  if (props.disabled) return;
  emit("click", ev);
}
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
