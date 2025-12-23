<template>
  <!--
    PPButton — Design System ENFORCED
    - Rend un <button> par défaut
    - Rend un <NuxtLink> si `to` est défini (et non disabled/loading)
    - Rend un <a> si `href` est défini (et non disabled/loading)
    - En cas de disabled/loading, rend toujours un <button> pour éviter toute navigation accidentelle
  -->
  <NuxtLink
    v-if="isLinkTo"
    :to="to"
    :class="computedClass"
    :aria-busy="loading ? 'true' : 'false'"
  >
    <span v-if="$slots.leading" class="pp-btn-slot" aria-hidden="true">
      <slot name="leading" />
    </span>

    <span class="pp-btn-label">
      <slot />
    </span>

    <span v-if="loading" class="pp-btn-loading" aria-hidden="true">
      <svg class="pp-btn-spinner" viewBox="0 0 24 24" fill="none">
        <circle class="pp-btn-spinner-track" cx="12" cy="12" r="10" />
        <path class="pp-btn-spinner-head" d="M22 12a10 10 0 0 1-10 10" />
      </svg>
      <span class="sr-only">Chargement…</span>
    </span>

    <span v-if="$slots.trailing" class="pp-btn-slot" aria-hidden="true">
      <slot name="trailing" />
    </span>
  </NuxtLink>

  <a
    v-else-if="isLinkHref"
    :href="href"
    :target="target"
    :rel="computedRel"
    :class="computedClass"
    :aria-busy="loading ? 'true' : 'false'"
  >
    <span v-if="$slots.leading" class="pp-btn-slot" aria-hidden="true">
      <slot name="leading" />
    </span>

    <span class="pp-btn-label">
      <slot />
    </span>

    <span v-if="loading" class="pp-btn-loading" aria-hidden="true">
      <svg class="pp-btn-spinner" viewBox="0 0 24 24" fill="none">
        <circle class="pp-btn-spinner-track" cx="12" cy="12" r="10" />
        <path class="pp-btn-spinner-head" d="M22 12a10 10 0 0 1-10 10" />
      </svg>
      <span class="sr-only">Chargement…</span>
    </span>

    <span v-if="$slots.trailing" class="pp-btn-slot" aria-hidden="true">
      <slot name="trailing" />
    </span>
  </a>

  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    :class="computedClass"
    :aria-busy="loading ? 'true' : 'false'"
  >
    <span v-if="$slots.leading" class="pp-btn-slot" aria-hidden="true">
      <slot name="leading" />
    </span>

    <span class="pp-btn-label">
      <slot />
    </span>

    <span v-if="loading" class="pp-btn-loading" aria-hidden="true">
      <svg class="pp-btn-spinner" viewBox="0 0 24 24" fill="none">
        <circle class="pp-btn-spinner-track" cx="12" cy="12" r="10" />
        <path class="pp-btn-spinner-head" d="M22 12a10 10 0 0 1-10 10" />
      </svg>
      <span class="sr-only">Chargement…</span>
    </span>

    <span v-if="$slots.trailing" class="pp-btn-slot" aria-hidden="true">
      <slot name="trailing" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";

type PPButtonVariant = "primary" | "secondary" | "ghost";

interface PPButtonProps {
  /**
   * Variant DS (ENFORCED)
   * - primary : CTA principal
   * - secondary : CTA secondaire
   * - ghost : CTA discret (sans fond)
   */
  variant?: PPButtonVariant;

  /**
   * Navigation interne Nuxt (si défini et non disabled/loading)
   */
  to?: RouteLocationRaw;

  /**
   * Lien externe (si défini et non disabled/loading)
   */
  href?: string;

  /**
   * Target pour <a> (par défaut _self)
   */
  target?: "_self" | "_blank" | "_parent" | "_top";

  /**
   * Rel optionnel pour <a>. Si target="_blank", noopener+noreferrer seront ajoutés automatiquement.
   */
  rel?: string;

  /**
   * Type du bouton (sécurité : default = "button" pour éviter submit involontaire)
   */
  type?: "button" | "submit" | "reset";

  /**
   * Désactive l’action
   */
  disabled?: boolean;

  /**
   * Affiche un état chargement (désactive l’action)
   */
  loading?: boolean;

  /**
   * Pleine largeur (utile mobile)
   */
  full?: boolean;

  /**
   * Classe additionnelle optionnelle (usage rare)
   */
  class?: string;
}

const props = withDefaults(defineProps<PPButtonProps>(), {
  variant: "primary",
  target: "_self",
  type: "button",
  disabled: false,
  loading: false,
  full: false,
});

/**
 * Calcule le rel sécurisé (défense en profondeur).
 * - Si target="_blank", force toujours "noopener noreferrer"
 * - Si props.rel est fourni, on le conserve et on ajoute les tokens requis
 */
const computedRel = computed(() => {
  const userRel = props.rel?.trim();

  if (props.target === "_blank") {
    const required = ["noopener", "noreferrer"];
    const extra = userRel ? userRel.split(/\s+/).filter(Boolean) : [];
    const merged = Array.from(new Set([...required, ...extra]));
    return merged.join(" ");
  }

  return userRel || undefined;
});

/**
 * Empêche les cibles ambiguës : to XOR href.
 * Si les deux sont fournis, on désactive la navigation (rend un <button>).
 */
const hasAmbiguousTarget = computed(() => Boolean(props.to && props.href));

/**
 * Détermine si on rend un NuxtLink (et seulement si l’action est possible et non ambiguë).
 */
const isLinkTo = computed(() => Boolean(props.to) && !props.disabled && !props.loading && !hasAmbiguousTarget.value);

/**
 * Détermine si on rend un <a> (et seulement si l’action est possible et non ambiguë).
 */
const isLinkHref = computed(() => Boolean(props.href) && !props.to && !props.disabled && !props.loading && !hasAmbiguousTarget.value);

/**
 * Map variant → classe DS (ENFORCED).
 */
const variantClass = computed((): string => {
  switch (props.variant) {
    case "secondary":
      return "pp-cta-secondary";
    case "ghost":
      return "pp-cta-ghost";
    case "primary":
    default:
      return "pp-cta-primary";
  }
});

/**
 * Classes finales du composant (sans inline styles).
 */
const computedClass = computed(() => {
  const classes: string[] = [variantClass.value];

  if (props.full) classes.push("w-full");
  if (props.disabled || props.loading) classes.push("opacity-60 cursor-not-allowed");

  if (props.class) classes.push(props.class);

  return classes.join(" ");
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

/* Slots */
.pp-btn-slot {
  @apply inline-flex items-center;
}

.pp-btn-label {
  @apply inline-flex items-center;
}

/* Loading spinner */
.pp-btn-loading {
  @apply inline-flex items-center;
}

.pp-btn-spinner {
  @apply h-4 w-4 animate-spin;
}

.pp-btn-spinner-track {
  stroke: var(--pp-color-border-soft);
  stroke-width: 3;
  opacity: 0.35;
}

.pp-btn-spinner-head {
  stroke: var(--pp-color-text-invert);
  stroke-width: 3;
  stroke-linecap: round;
}
</style>
