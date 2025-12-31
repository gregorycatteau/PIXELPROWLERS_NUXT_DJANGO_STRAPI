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

    <!-- Default navigation -->
    <div
      v-if="showDefaultNav"
      class="pp-step-shell__nav"
      data-step-shell-nav="default"
    >
      <button
        v-if="prevStepId"
        type="button"
        class="pp-cta-secondary"
        @click="goToStep(prevStepId)"
      >
        {{ prevLabel }}
      </button>
      <button
        v-if="nextStepId"
        type="button"
        class="pp-cta-primary"
        @click="goToStep(nextStepId)"
      >
        {{ nextLabel }}
      </button>
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
import { computed, inject, onMounted, useSlots } from 'vue';
import { useRoute, useRouter } from '#imports';
import PPCard from '~/components/PPCard.vue';
import { getManifestBySlug } from '~/config/journeys/manifests/registry';
import { getJourneySchemaById } from '~/config/journeys/schemaRegistry';
import { journeyNavigationKey } from '~/composables/journeyNavigation';

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
  /** Affiche la navigation par defaut (prev/next) si disponible */
  showNav?: boolean;
  /** Label CTA next (optionnel) */
  nextLabel?: string;
  /** Label CTA prev (optionnel) */
  prevLabel?: string;
}

const props = withDefaults(defineProps<PPJourneyStepShellProps>(), {
  density: 'default',
  align: 'center',
  as: 'section',
  ariaLabelledby: undefined,
  focusTargetId: undefined,
  withCard: false,
  showNav: true,
  nextLabel: undefined,
  prevLabel: 'Retour',
});

const slots = useSlots();
const route = useRoute();
const router = useRouter();
const injectedNavigate = inject(journeyNavigationKey, null);

// Classes DS
const shellClasses = computed(() => [
  'pp-step-shell',
  `pp-step-shell--${props.density}`,
  `pp-step-shell--${props.align}`,
]);

const bodyClasses = computed(() => [
  'pp-step-shell__body',
]);

const journeyId = computed(() => {
  const slug = typeof route.params.journeySlug === 'string' ? route.params.journeySlug : '';
  const manifest = slug ? getManifestBySlug(slug) : null;
  return manifest?.id ?? null;
});

const schema = computed(() => {
  if (!journeyId.value) return null;
  return getJourneySchemaById(journeyId.value);
});

const stepIds = computed(() => schema.value?.steps.map((step) => step.stepId) ?? []);
const allowedSet = computed(() => new Set(stepIds.value));
const currentStepId = computed(() => {
  const stepParam = typeof route.query.step === 'string' ? route.query.step : null;
  if (stepParam && allowedSet.value.has(stepParam)) return stepParam;
  return stepIds.value[0] ?? null;
});

const stepMeta = computed(() =>
  schema.value?.steps.find((step) => step.stepId === currentStepId.value) ?? null
);

const resolveByOrder = (offset: number) => {
  const index = stepIds.value.indexOf(currentStepId.value ?? '');
  if (index === -1) return null;
  return stepIds.value[index + offset] ?? null;
};

const prevStepId = computed(() => {
  const candidate = stepMeta.value?.prev;
  if (candidate && allowedSet.value.has(candidate)) return candidate;
  return resolveByOrder(-1);
});

const nextStepId = computed(() => {
  const candidate = stepMeta.value?.next;
  if (candidate && allowedSet.value.has(candidate)) return candidate;
  return resolveByOrder(1);
});

const hasFooterSlot = computed(() => Boolean(slots.footer));
const showDefaultNav = computed(
  () => props.showNav && !hasFooterSlot.value && (prevStepId.value || nextStepId.value)
);

const nextLabel = computed(() => {
  if (props.nextLabel) return props.nextLabel;
  if (currentStepId.value?.startsWith('E0')) return 'Commencer';
  return 'Continuer';
});

const prevLabel = computed(() => props.prevLabel);

const goToStep = (stepId: string) => {
  if (!stepId) return;
  if (injectedNavigate) {
    injectedNavigate(stepId);
    return;
  }
  if (!allowedSet.value.has(stepId)) return;
  router.push({ path: route.path, query: { ...route.query, step: stepId } });
};

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

.pp-step-shell__nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--pp-step-shell-footer-gap, 0.75rem);
  justify-content: center;
}
</style>
