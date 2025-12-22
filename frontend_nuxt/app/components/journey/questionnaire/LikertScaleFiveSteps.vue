<script setup lang="ts">
import { computed } from 'vue';
import type { LikertValue } from '~/composables/useJourneyDiagnostics';

const emit = defineEmits<{
  (e: 'update:modelValue', value: LikertValue | null): void;
}>();

const props = defineProps<{
  modelValue: LikertValue | null;
  name: string;
  disabled?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  labels?: Partial<Record<LikertValue, string>>;
}>();

const scale = computed<LikertValue[]>(() => [1, 2, 3, 4, 5]);
const defaultLabels: Record<LikertValue, string> = {
  1: "Pas du tout d'accord",
  2: "Plutôt pas d'accord",
  3: 'Mitigé',
  4: "Plutôt d'accord",
  5: "Tout à fait d'accord"
};

const resolvedLabels = computed<Record<LikertValue, string>>(
  () =>
    ({
      ...defaultLabels,
      ...(props.labels ?? {})
    } as Record<LikertValue, string>)
);

const handleSelect = (value: LikertValue) => {
  if (props.disabled) return;
  emit('update:modelValue', value);
};
</script>

<template>
  <fieldset class="pp-likert-scale">
    <legend class="sr-only">Echelle de reponse</legend>

    <div
      class="pp-likert-track"
      role="radiogroup"
      :aria-labelledby="ariaLabelledBy"
      :aria-describedby="ariaDescribedBy"
      :aria-label="ariaLabelledBy ? undefined : 'Echelle de reponse'"
    >
      <label
        v-for="value in scale"
        :key="value"
        class="pp-likert-step focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-300/70"
        :class="{ 'pp-likert-step--active': modelValue === value }"
      >
        <input
          type="radio"
          class="sr-only"
          :name="name"
          :value="value"
          :checked="modelValue === value"
          :disabled="disabled"
          :aria-label="resolvedLabels[value]"
          @change="handleSelect(value)"
        />
        <span class="pp-likert-step__number" aria-hidden="true">{{ value }}</span>
        <span class="pp-likert-step__label" aria-hidden="true">{{ resolvedLabels[value] }}</span>
        <span class="sr-only">{{ resolvedLabels[value] }}</span>
        <span v-if="modelValue === value" class="sr-only">Ta reponse actuelle</span>
      </label>
    </div>
  </fieldset>
</template>
