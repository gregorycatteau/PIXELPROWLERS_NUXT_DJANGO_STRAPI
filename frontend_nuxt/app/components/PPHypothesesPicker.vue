<template>
  <div class="pp-hypotheses-picker" role="group" :aria-label="groupLabel">
    <!-- Counter -->
    <div class="pp-hypotheses-picker__counter">
      <span class="pp-hypotheses-picker__counter-text">{{ counterLabel }}</span>
    </div>

    <!-- Max reached message (aria-live polite) -->
    <div
      v-if="showMaxMessage"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      class="pp-hypotheses-picker__max-message"
    >
      {{ maxReachedMessage }}
    </div>

    <!-- Items grid -->
    <div class="pp-hypotheses-picker__grid">
      <PPCard
        v-for="item in items"
        :key="item.id"
        as="article"
        :variant="isSelected(item.id) ? 'accent' : 'soft'"
        class="pp-hypotheses-picker__item"
        :class="{
          'pp-hypotheses-picker__item--selected': isSelected(item.id),
          'pp-hypotheses-picker__item--at-max': isAtMax && !isSelected(item.id)
        }"
      >
        <div class="pp-hypotheses-picker__item-header">
          <PPBadge v-if="item.index" variant="neutral" size="sm">
            Hypothèse {{ item.index }}
          </PPBadge>
          <button
            type="button"
            class="pp-hypotheses-picker__toggle"
            :aria-pressed="isSelected(item.id)"
            :aria-describedby="isAtMax && !isSelected(item.id) ? 'pp-hyp-max-hint' : undefined"
            @click="handleToggle(item.id)"
          >
            {{ isSelected(item.id) ? deselectLabel : selectLabel }}
          </button>
        </div>

        <h3 class="pp-hypotheses-picker__item-title">{{ item.title }}</h3>
        
        <p v-if="item.description" class="pp-hypotheses-picker__item-description">
          {{ item.description }}
        </p>

        <!-- Slot for additional content per item -->
        <slot :name="`item-${item.id}`" :item="item" :selected="isSelected(item.id)" />
      </PPCard>
    </div>

    <!-- Hidden hint for screen readers -->
    <span id="pp-hyp-max-hint" class="sr-only">
      {{ maxReachedMessage }}
    </span>

    <!-- CTA to go to Atterrissage -->
    <div v-if="showGoToAtterrissage && selectedCount > 0" class="pp-hypotheses-picker__cta">
      <button
        type="button"
        class="pp-journey-cta-primary"
        @click="handleGoToAtterrissage"
      >
        {{ goToAtterrissageLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

export type HypothesisItem = {
  id: string;
  title: string;
  description?: string;
  index?: number;
};

const props = withDefaults(
  defineProps<{
    items: HypothesisItem[];
    modelValue: string[];
    maxSelected?: number;
    groupLabel?: string;
    selectLabel?: string;
    deselectLabel?: string;
    maxReachedMessage?: string;
    goToAtterrissageLabel?: string;
    showGoToAtterrissage?: boolean;
  }>(),
  {
    maxSelected: 2,
    groupLabel: 'Sélection des hypothèses',
    selectLabel: 'Je la garde',
    deselectLabel: 'Gardée',
    maxReachedMessage: 'Maximum 2 hypothèses. Désélectionne-en une pour en choisir une autre.',
    goToAtterrissageLabel: 'Aller à Atterrissage',
    showGoToAtterrissage: true
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
  (e: 'go-to-atterrissage'): void;
}>();

// Local state for max message display
const showMaxMessage = ref(false);
let maxMessageTimeout: ReturnType<typeof setTimeout> | null = null;

const selectedCount = computed(() => props.modelValue.length);
const isAtMax = computed(() => selectedCount.value >= props.maxSelected);
const counterLabel = computed(() => `${selectedCount.value}/${props.maxSelected} sélectionnées`);

const isSelected = (id: string) => props.modelValue.includes(id);

const handleToggle = (id: string) => {
  // If already selected, deselect
  if (isSelected(id)) {
    emit('update:modelValue', props.modelValue.filter((v) => v !== id));
    return;
  }

  // If at max, show message but don't change selection
  if (isAtMax.value) {
    showMaxMessage.value = true;
    if (maxMessageTimeout) clearTimeout(maxMessageTimeout);
    maxMessageTimeout = setTimeout(() => {
      showMaxMessage.value = false;
    }, 3000);
    return;
  }

  // Add to selection
  emit('update:modelValue', [...props.modelValue, id]);
};

const handleGoToAtterrissage = () => {
  emit('go-to-atterrissage');
};

// Clear timeout on unmount
import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (maxMessageTimeout) clearTimeout(maxMessageTimeout);
});
</script>

<style scoped>
.pp-hypotheses-picker {
  display: flex;
  flex-direction: column;
  gap: var(--pp-hyp-gap, 1rem);
}

.pp-hypotheses-picker__counter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pp-hypotheses-picker__counter-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.pp-hypotheses-picker__max-message {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-panel-soft);
  border: 1px solid var(--color-stroke);
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.pp-hypotheses-picker__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: var(--pp-hyp-gap, 1rem);
}

.pp-hypotheses-picker__item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.pp-hypotheses-picker__item--selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.pp-hypotheses-picker__item--at-max {
  opacity: 0.7;
}

.pp-hypotheses-picker__item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.pp-hypotheses-picker__toggle {
  flex-shrink: 0;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: 1px solid var(--color-stroke);
  background-color: var(--color-panel);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.pp-hypotheses-picker__toggle:hover {
  background-color: var(--color-panel-soft);
}

.pp-hypotheses-picker__toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.pp-hypotheses-picker__item--selected .pp-hypotheses-picker__toggle {
  border-color: var(--color-primary);
  color: var(--color-text);
}

.pp-hypotheses-picker__item-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
  margin: 0;
}

.pp-hypotheses-picker__item-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin: 0;
}

.pp-hypotheses-picker__cta {
  display: flex;
  justify-content: flex-start;
  padding-top: 0.5rem;
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .pp-hypotheses-picker__item {
    transition: none;
  }
  .pp-hypotheses-picker__toggle {
    transition: none;
  }
}
</style>
