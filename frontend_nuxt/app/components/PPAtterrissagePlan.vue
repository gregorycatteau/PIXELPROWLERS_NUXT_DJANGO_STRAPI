<template>
  <div
    ref="planRef"
    class="pp-atterrissage-plan"
    :class="{ 'pp-atterrissage-plan--highlight': isHighlighted }"
    role="region"
    :aria-labelledby="headingId"
  >
    <!-- Heading with tabindex for focus after scroll -->
    <h2
      :id="headingId"
      ref="headingRef"
      tabindex="-1"
      class="pp-atterrissage-plan__heading"
    >
      {{ title }}
    </h2>

    <p v-if="description" class="pp-atterrissage-plan__description">
      {{ description }}
    </p>

    <!-- Steps list (max 3 displayed) -->
    <ol v-if="displayedSteps.length" class="pp-atterrissage-plan__steps">
      <li
        v-for="(step, idx) in displayedSteps"
        :key="idx"
        class="pp-atterrissage-plan__step"
      >
        <div class="pp-atterrissage-plan__step-header">
          <span class="pp-atterrissage-plan__step-number">{{ idx + 1 }}</span>
          <h3 class="pp-atterrissage-plan__step-title">{{ step.title }}</h3>
        </div>
        <p v-if="step.details" class="pp-atterrissage-plan__step-details">
          {{ step.details }}
        </p>
      </li>
    </ol>

    <p v-if="hasMoreSteps" class="pp-atterrissage-plan__more-steps">
      {{ moreStepsLabel }}
    </p>

    <!-- Expected outcome -->
    <div v-if="expectedOutcome" class="pp-atterrissage-plan__outcome">
      <h3 class="pp-atterrissage-plan__outcome-label">{{ outcomeLabel }}</h3>
      <p class="pp-atterrissage-plan__outcome-text">{{ expectedOutcome }}</p>
    </div>

    <!-- Optional slot for additional actions -->
    <div v-if="$slots.actions" class="pp-atterrissage-plan__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';

export type AtterrissageStep = {
  title: string;
  details?: string;
};

const props = withDefaults(
  defineProps<{
    steps: AtterrissageStep[];
    expectedOutcome?: string;
    title?: string;
    description?: string;
    maxStepsDisplayed?: number;
    outcomeLabel?: string;
    moreStepsLabel?: string;
    highlight?: boolean;
    headingId?: string;
  }>(),
  {
    title: 'Plan d\'atterrissage',
    maxStepsDisplayed: 3,
    outcomeLabel: 'Résultat attendu',
    moreStepsLabel: '+ étapes supplémentaires disponibles',
    highlight: false,
    headingId: 'pp-atterrissage-heading'
  }
);

const planRef = ref<HTMLElement | null>(null);
const headingRef = ref<HTMLElement | null>(null);

// Compute displayed steps (max 3)
const displayedSteps = computed(() => 
  props.steps.slice(0, props.maxStepsDisplayed)
);

const hasMoreSteps = computed(() => 
  props.steps.length > props.maxStepsDisplayed
);

// Highlight state with auto-clear
const isHighlighted = ref(false);
let highlightTimeout: ReturnType<typeof setTimeout> | null = null;

// Watch for highlight prop changes
watch(
  () => props.highlight,
  async (newVal) => {
    if (newVal) {
      isHighlighted.value = true;
      
      // Focus heading after scroll (preventScroll to avoid double scroll)
      await nextTick();
      if (headingRef.value) {
        headingRef.value.focus({ preventScroll: true });
      }
      
      // Auto-clear highlight after 2s
      if (highlightTimeout) clearTimeout(highlightTimeout);
      highlightTimeout = setTimeout(() => {
        isHighlighted.value = false;
      }, 2000);
    }
  }
);

// Method to programmatically trigger highlight + focus
const triggerHighlight = async () => {
  isHighlighted.value = true;
  
  await nextTick();
  if (headingRef.value) {
    headingRef.value.focus({ preventScroll: true });
  }
  
  if (highlightTimeout) clearTimeout(highlightTimeout);
  highlightTimeout = setTimeout(() => {
    isHighlighted.value = false;
  }, 2000);
};

// Expose method for parent components
defineExpose({
  triggerHighlight,
  headingRef,
  planRef
});

// Cleanup
onUnmounted(() => {
  if (highlightTimeout) clearTimeout(highlightTimeout);
});
</script>

<style scoped>
.pp-atterrissage-plan {
  display: flex;
  flex-direction: column;
  gap: var(--pp-landing-gap, 1rem);
  padding: 1.5rem;
  border-radius: 0.75rem;
  background-color: var(--color-panel-soft);
  border: 1px solid var(--color-stroke);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.pp-atterrissage-plan--highlight {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--pp-landing-highlight-outline, var(--color-primary));
}

.pp-atterrissage-plan__heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  outline: none;
}

.pp-atterrissage-plan__heading:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.pp-atterrissage-plan__description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin: 0;
}

.pp-atterrissage-plan__steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: step;
}

.pp-atterrissage-plan__step {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1rem;
  background-color: var(--color-panel);
  border-radius: 0.5rem;
  border: 1px solid var(--color-stroke);
}

.pp-atterrissage-plan__step-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.pp-atterrissage-plan__step-number {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-text);
}

.pp-atterrissage-plan__step-title {
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
  margin: 0;
}

.pp-atterrissage-plan__step-details {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin: 0;
  padding-left: 2.25rem;
}

.pp-atterrissage-plan__more-steps {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-style: italic;
  margin: 0;
}

.pp-atterrissage-plan__outcome {
  padding-top: 1rem;
  border-top: 1px solid var(--color-stroke);
}

.pp-atterrissage-plan__outcome-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin: 0 0 0.5rem 0;
}

.pp-atterrissage-plan__outcome-text {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--color-text);
  margin: 0;
}

.pp-atterrissage-plan__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .pp-atterrissage-plan {
    transition: none;
  }
  
  .pp-atterrissage-plan--highlight {
    /* Static outline instead of animated */
    box-shadow: 0 0 0 2px var(--pp-landing-highlight-outline, var(--color-primary));
  }
}
</style>
