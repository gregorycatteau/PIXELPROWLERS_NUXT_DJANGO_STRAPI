<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { LikertValue } from '~/composables/useJourneyDiagnostics';
import { P1_SCALE_COPY, P1_SKIP_COPY } from '@/config/journeys/p1CopyV1_3';
import PPScale5 from '~/components/PPScale5.vue';

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
const stepLabels = computed(() => scale.value.map((value) => valueLabels[value]));
const skipLabel = computed(() => props.skipLabel ?? P1_SKIP_COPY.buttonLabel);
const showSkip = computed(() => props.showSkip ?? true);
const hasInteracted = ref(false);
const isSkipped = computed(() => hasInteracted.value && currentValue.value === null);
const contextId = computed(() => `likert-context-${props.questionId}`);
const context = computed(() => props.describedBy || contextId.value);

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue !== undefined) {
      hasInteracted.value = true;
    }
  }
);

const handleSelect = (value: number | null) => {
  if (value === null) return;
  hasInteracted.value = true;
  emit('update:modelValue', value as LikertValue);
  emit('select', value as LikertValue);
};

const handleSkip = () => {
  hasInteracted.value = true;
  emit('update:modelValue', null);
  emit('skip');
};
</script>

<template>
  <div class="space-y-2">
    <p v-if="resolvedLabels?.min || resolvedLabels?.max" :id="contextId" class="sr-only">
      1 signifie « {{ resolvedLabels?.min }} », 5 signifie « {{ resolvedLabels?.max }} ». L’échelle va de plus léger à plus lourd au quotidien.
    </p>

    <PPScale5
      :model-value="currentValue"
      :question-id="questionId"
      :min-label="resolvedLabels?.min"
      :max-label="resolvedLabels?.max"
      :prompt="prompt"
      :context="context"
      :step-labels="stepLabels"
      @update:model-value="handleSelect"
    />

    <PPSkipAction
      v-if="showSkip"
      :label="skipLabel"
      @skip="handleSkip"
    />
  </div>
</template>
