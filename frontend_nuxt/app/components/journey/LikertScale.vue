<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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
const showSkip = computed(() => props.showSkip ?? true);
const hasInteracted = ref(false);
const isSkipped = computed(() => hasInteracted.value && currentValue.value === null);
const contextId = computed(() => `likert-context-${props.questionId}`);

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue !== undefined) {
      hasInteracted.value = true;
    }
  }
);

const handleSelect = (value: LikertValue) => {
  hasInteracted.value = true;
  emit('update:modelValue', value);
  emit('select', value);
};

const handleSkip = () => {
  hasInteracted.value = true;
  emit('update:modelValue', null);
  emit('skip');
};
</script>

<template>
  <fieldset class="pp-likert-scale">
    <legend class="sr-only">{{ prompt }}</legend>

    <p v-if="resolvedLabels?.min || resolvedLabels?.max" :id="contextId" class="sr-only">
      1 signifie « {{ resolvedLabels?.min }} », 5 signifie « {{ resolvedLabels?.max }} ». L’échelle va de plus léger à plus lourd au quotidien.
    </p>

    <!--
      Échelle 1 → 5, accessible au clavier.
      On utilise des radios natifs pour bénéficier de la navigation clavier et des états aria implicites.
    -->
    <div
      class="pp-likert-track"
      role="radiogroup"
      :aria-label="prompt"
      :aria-describedby="describedBy || contextId"
    >
      <label
        v-for="value in scale"
        :key="value"
        class="pp-likert-step"
        :class="{ 'pp-likert-step--active': currentValue === value && !isSkipped }"
      >
        <input
          type="radio"
          class="sr-only"
          :name="name"
          :value="value"
          :checked="currentValue === value"
          :aria-label="valueLabels[value]"
          @change="handleSelect(value)"
        />
        <span class="pp-likert-step__number" aria-hidden="true">{{ value }}</span>
        <span class="pp-likert-step__label" aria-hidden="true">{{ valueLabels[value] }}</span>
        <span class="sr-only">Note {{ valueLabels[value] }}</span>
        <span v-if="currentValue === value && !isSkipped" class="sr-only">Ta réponse actuelle</span>
      </label>
    </div>
    <button
      v-if="showSkip"
      type="button"
      class="pp-likert-skip-button"
      :class="{ 'pp-likert-skip-button--active': isSkipped }"
      @click="handleSkip"
    >
      <span aria-hidden="true">🛡</span>
      <span>{{ skipLabel }}</span>
    </button>
  </fieldset>
</template>
