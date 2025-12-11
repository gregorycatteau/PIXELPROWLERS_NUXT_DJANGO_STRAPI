<template>
  <fieldset class="LikertScale">
    <legend class="sr-only">{{ prompt }}</legend>
    <p class="LikertPrompt">{{ prompt }}</p>
    <div class="LikertScaleHeader" v-if="resolvedLabels?.min || resolvedLabels?.max">
      <span class="LikertLabel">{{ resolvedLabels?.min }}</span>
      <span class="LikertLabel text-right">{{ resolvedLabels?.max }}</span>
    </div>
    <div
      class="LikertOptions"
      role="radiogroup"
      :aria-label="prompt"
      :aria-describedby="describedBy"
    >
      <label
        v-for="value in scale"
        :key="value"
        class="LikertOption"
        :class="{ 'LikertOption--active': currentValue === value }"
      >
        <span class="sr-only">Note {{ valueLabels[value] }}</span>
        <input
          type="radio"
          class="sr-only"
          :name="name"
          :value="value"
          :aria-label="valueLabels[value]"
          :checked="currentValue === value"
          @change="handleSelect(value)"
        />
        <span aria-hidden="true">{{ value }}</span>
      </label>
    </div>
    <button
      v-if="showSkip"
      type="button"
      class="LikertSkip"
      @click="handleSkip"
    >
      {{ skipLabel }}
    </button>
    <p v-if="showSkip" class="LikertSkipHelp">{{ skipHelper }}</p>
  </fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LikertValue } from '~/composables/useJourneyDiagnostics';
import { P1_SCALE_COPY, P1_SKIP_COPY } from '@/config/journeys/p1CopyV1_3';

const emit = defineEmits<{
  (e: 'update:modelValue', value: LikertValue | null): void;
  (e: 'select', value: LikertValue): void;
  (e: 'skip'): void;
}>();

const props = defineProps<{
  modelValue?: LikertValue | null;
  selectedValue?: LikertValue | null; // compat avec anciennes props
  name: string;
  questionId: string;
  labels?: {
    min?: string;
    max?: string;
  };
  describedBy?: string;
  showSkip?: boolean;
  skipLabel?: string;
}>();

const scale = computed<LikertValue[]>(() => [1, 2, 3, 4, 5]);
const currentValue = computed<LikertValue | null>(() => props.modelValue ?? props.selectedValue ?? null);
const valueLabels = P1_SCALE_COPY.valueLabels;
const prompt = P1_SCALE_COPY.questionPrompt;
const resolvedLabels = computed(() => props.labels ?? { min: `${valueLabels[1]}`, max: `${valueLabels[5]}` });
const skipLabel = computed(() => props.skipLabel ?? P1_SKIP_COPY.buttonLabel);
const skipHelper = computed(() => P1_SKIP_COPY.helperText);
const showSkip = computed(() => props.showSkip ?? true);

const handleSelect = (value: LikertValue) => {
  emit('update:modelValue', value);
  emit('select', value);
};

const handleSkip = () => {
  emit('update:modelValue', null);
  emit('skip');
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.LikertScale {
  @apply space-y-3;
}

.LikertScaleHeader {
  @apply flex items-center justify-between text-xs text-[color:var(--color-text-muted)];
}

.LikertPrompt {
  @apply text-sm font-medium text-[color:var(--color-text-primary)];
}

.LikertOptions {
  @apply grid grid-cols-5 gap-2;
}

.LikertOption {
  @apply inline-flex h-10 items-center justify-center rounded-xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] text-sm font-semibold text-[color:var(--color-text-primary)] transition hover:border-[color:var(--color-accent-border)];
  transition: transform 140ms ease, border-color 140ms ease, color 140ms ease, background-color 140ms ease;
}

.LikertOption--active {
  @apply border-[color:var(--color-accent-border)] bg-[color:var(--color-accent-quiet)] text-[color:var(--color-accent-strong)] shadow-[0_0_0_3px_rgba(249,115,22,0.12)];
  transform: scale(1.03);
}

.LikertSkip {
  @apply inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-[color:var(--color-border-soft)] px-3 py-2 text-xs text-[color:var(--color-text-muted)] hover:border-[color:var(--color-accent-border)] transition;
}

.LikertSkipHelp {
  @apply text-xs text-[color:var(--color-text-muted)];
}
</style>
