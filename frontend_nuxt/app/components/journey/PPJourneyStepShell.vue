<template>
  <component
    :is="as"
    :class="shellClasses"
    :role="ariaLabelledby ? 'region' : undefined"
    :aria-labelledby="ariaLabelledby"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" class="pp-step-shell__header">
      <slot name="header" />
    </div>

    <!-- Body (default slot) -->
    <component
      :is="withCard ? 'PPCard' : 'div'"
      :variant="withCard ? 'soft' : undefined"
      :class="bodyClasses"
    >
      <slot />
    </component>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="pp-step-shell__footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup lang="ts">
/**
 * PPJourneyStepShell
 * 
 * Cellule DS générique pour tous les écrans "step" de parcours
 * (hors Questionnaire, Bilan, Ressources qui ont leurs propres shells).
 * 
 * Fournit :
 * - Layout standardisé (max-width, spacing, slots header/body/footer)
 * - Landmarks a11y (section/main/article + role="region")
 * - Focus management optionnel (focusTargetId)
 * - Zéro logique métier
 * 
 * @example
 * <PPJourneyStepShell
 *   density="default"
 *   align="center"
 *   aria-labelledby="my-heading"
 *   focus-target-id="my-heading"
 * >
 *   <template #header>
 *     <JourneyStepHeader title="Mon step" heading-id="my-heading" />
 *   </template>
 *   
 *   <!-- Body content -->
 *   <p>Contenu du step</p>
 *   
 *   <template #footer>
 *     <PPButton @click="next">Continuer</PPButton>
 *   </template>
 * </PPJourneyStepShell>
 */
import { computed, onMounted } from 'vue';
import PPCard from '~/components/PPCard.vue';

export interface PPJourneyStepShellProps {
  /** Densité d'espacement */
  density?: 'compact' | 'default' | 'comfort';
  /** Alignement horizontal */
  align?: 'center' | 'wide';
  /** Élément sémantique racine */
  as?: 'section' | 'main' | 'article';
  /** ID de l'élément heading pour aria-labelledby (active role="region") */
  ariaLabelledby?: string;
  /** ID d'un élément à focus au mount (a11y - ex: heading) */
  focusTargetId?: string;
  /** Si true, wrap le body dans PPCard variant="soft" */
  withCard?: boolean;
}

const props = withDefaults(defineProps<PPJourneyStepShellProps>(), {
  density: 'default',
  align: 'center',
  as: 'section',
  ariaLabelledby: undefined,
  focusTargetId: undefined,
  withCard: false,
});

// Classes DS
const shellClasses = computed(() => [
  'pp-step-shell',
  `pp-step-shell--${props.density}`,
  `pp-step-shell--${props.align}`,
]);

const bodyClasses = computed(() => [
  'pp-step-shell__body',
]);

// Focus management a11y
onMounted(() => {
  if (props.focusTargetId) {
    try {
      const el = document.getElementById(props.focusTargetId);
      if (el) {
        el.focus({ preventScroll: true });
      }
    } catch {
      // Silently ignore focus errors (SSR, missing element, etc.)
    }
  }
});
</script>

<style scoped>
/* 
 * Styles DS pour PPJourneyStepShell
 * Utilise tokens définis dans pp.tokens.css
 */

.pp-step-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: var(--pp-step-shell-maxw, 48rem);
  margin-inline: auto;
  gap: var(--pp-step-shell-gap, 1.5rem);
  padding-block: var(--pp-step-shell-padding-block, 1rem);
}

/* Density variants */
.pp-step-shell--compact {
  gap: var(--pp-step-shell-gap-compact, 1rem);
}

.pp-step-shell--comfort {
  gap: var(--pp-step-shell-gap-comfort, 2rem);
}

/* Align variants */
.pp-step-shell--center {
  max-width: var(--pp-step-shell-maxw, 48rem);
}

.pp-step-shell--wide {
  max-width: var(--pp-step-shell-maxw-wide, 64rem);
}

/* Header section */
.pp-step-shell__header {
  display: flex;
  flex-direction: column;
  gap: var(--pp-step-shell-header-gap, 0.5rem);
}

/* Body section */
.pp-step-shell__body {
  display: flex;
  flex-direction: column;
  gap: var(--pp-step-shell-body-gap, 1rem);
}

/* Footer section */
.pp-step-shell__footer {
  display: flex;
  flex-direction: column;
  gap: var(--pp-step-shell-footer-gap, 0.75rem);
  margin-top: auto;
}
</style>
