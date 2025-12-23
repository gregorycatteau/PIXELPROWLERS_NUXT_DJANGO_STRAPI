<script setup lang="ts">
import { computed } from 'vue';
import type { LikertValue } from '~/composables/useJourneyDiagnostics';
import PPScale5 from '~/components/PPScale5.vue';

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

const minLabel = computed(() => resolvedLabels.value[(scale.value[0] ?? 1) as LikertValue]);
const maxLabel = computed(
  () => resolvedLabels.value[(scale.value[scale.value.length - 1] ?? 5) as LikertValue]
);
const stepLabels = computed(() => scale.value.map((value) => resolvedLabels.value[value]));
const prompt = computed(() => props.ariaLabelledBy || 'Echelle de reponse');
const context = computed(() => props.ariaDescribedBy ?? null);

const handleUpdate = (value: number | null) => {
  if (value === null) {
    emit('update:modelValue', null);
    return;
  }
  if (scale.value.includes(value as LikertValue)) {
    emit('update:modelValue', value as LikertValue);
  }
};
</script>

<template>
  <!-- Wrapper mince : conserve le contrat public, délègue 100% du rendu à PPScale5 -->
  <PPScale5
    :model-value="modelValue"
    :question-id="name"
    :disabled="disabled"
    :min-label="minLabel"
    :max-label="maxLabel"
    :prompt="prompt"
    :context="context"
    :step-labels="stepLabels"
    @update:model-value="handleUpdate"
  />
</template>
