<template>
  <!--
    PPBadge — Design System ENFORCED (V1.1 — R3B)
    - Atome non-interactif : status, risk (urgence), info (meta)
    - Variants fermés : status (défaut) | risk | info
    - A11y : prop ariaLabel obligatoire pour variant="risk"
    - Sécurité : si rendu en <button>, type="button" par défaut (évite submit accidentel)
  -->
  <component
    :is="resolvedTag"
    :class="mergedClass"
    v-bind="forwardedAttrs"
    :type="buttonType"
    :aria-label="computedAriaLabel"
    :role="computedRole"
  >
    <span v-if="$slots.icon" class="pp-badge__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="pp-badge__label">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

/**
 * PPBadge V1.1 (R3B) — Variants sémantiques
 * - status: état public/interne/bêta (neutre, défaut)
 * - risk: urgence/alerte (danger, a11y renforcée)
 * - info: meta/méthodo (accent léger)
 *
 * Legacy compat: neutral|accent|success|warning|danger|outline restent supportés pour migration graduelle
 */
type PPBadgeVariant = "status" | "risk" | "info" | "neutral" | "accent" | "success" | "warning" | "danger" | "outline";
type PPBadgeSize = "sm" | "md";
type PPBadgeTag = "span" | "div" | "button";

interface PPBadgeProps {
  /**
   * Variant DS (ENFORCED)
   * - status: état/statut (défaut)
   * - risk: urgence/alerte (requiert ariaLabel pour a11y)
   * - info: meta/info contextuelle
   */
  variant?: PPBadgeVariant;

  /**
   * Size DS (ENFORCED)
   */
  size?: PPBadgeSize;

  /**
   * Render tag
   * - span: défaut (badge inline non-interactif)
   * - div : rare (layout)
   * - button: interactif (à utiliser avec prudence)
   */
  as?: PPBadgeTag;

  /**
   * A11y: Label explicite (obligatoire pour variant="risk")
   * Exemple: "Risque : Critique"
   */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<PPBadgeProps>(), {
  variant: "status",
  size: "md",
  as: "span",
  ariaLabel: undefined,
});

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
 * A11y: aria-label explicite pour variants risk (obligatoire)
 */
const computedAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  // Pas de label auto pour risk sans ariaLabel explicite (dev warning en console si DEV)
  return undefined;
});

/**
 * A11y: role="status" pour badges d'alerte/risk
 */
const computedRole = computed(() => {
  if (props.variant === "risk") return "status";
  return undefined;
});

const variantClass = computed(() => {
  switch (props.variant) {
    // Nouveaux variants sémantiques (R3B)
    case "status":
      return "pp-badge pp-badge--status";
    case "risk":
      return "pp-badge pp-badge--risk";
    case "info":
      return "pp-badge pp-badge--info";
    // Legacy compat (migration progressive)
    case "accent":
      return "pp-badge pp-badge--accent";
    case "success":
      return "pp-badge pp-badge--success";
    case "warning":
      return "pp-badge pp-badge--warning";
    case "danger":
      return "pp-badge pp-badge--danger";
    case "outline":
      return "pp-badge pp-badge--outline";
    case "neutral":
    default:
      return "pp-badge pp-badge--neutral";
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "pp-badge--sm";
    case "md":
    default:
      return "pp-badge--md";
  }
});

const mergedClass = computed(() => {
  const classes: string[] = [variantClass.value, sizeClass.value];
  const extra = (attrs.class as string | undefined)?.trim();
  if (extra) classes.push(extra);
  return classes.join(" ");
});
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
