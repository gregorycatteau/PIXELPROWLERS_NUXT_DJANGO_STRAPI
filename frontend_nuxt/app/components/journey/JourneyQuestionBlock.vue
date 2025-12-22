<template>
<section
  :class="[
    'JourneyQuestionBlock pp-card pp-journey-soft-scale pp-journey-reveal pp-journey-question-card',
    status === 'answered' ? 'pp-journey-question-card--answered' : '',
    status === 'skipped' ? 'pp-journey-question-card--skipped' : ''
  ]"
  role="group"
  :aria-labelledby="labelId"
  :aria-describedby="description ? descriptionId : undefined"
  :data-question-id="questionId || title"
>
  <div class="pp-journey-question-layout">
    <div class="pp-journey-question-text">
      <div class="JourneyQuestionHeaderTop">
        <div class="JourneyQuestionBadges">
          <span v-if="questionIndex && totalQuestions" class="pp-journey-question-chip">
            Question {{ questionIndex }} / {{ totalQuestions }}
          </span>
          <span v-if="themeLabel" :class="['pp-journey-theme-badge', themeClass]">
            {{ themeLabel }}
          </span>
          <span
            v-if="status && status !== 'empty'"
            :class="['pp-journey-status-badge', statusClass]"
          >
            {{ status === 'answered' ? 'Réponse enregistrée' : 'Mis de côté' }}
          </span>
        </div>
        <p :id="labelId" class="JourneyQuestionLabel">{{ title }}</p>
      </div>
      <p v-if="description" :id="descriptionId" class="JourneyQuestionDescription">
        {{ description }}
      </p>
      <p v-if="helperText" :id="helperTextId" class="pp-journey-feel-hint">
        {{ helperText }}
      </p>
    </div>
    <div class="pp-journey-question-controls">
      <slot
        v-if="hasDefaultSlot"
        :label-id="labelId"
        :description-id="descriptionId"
        :helper-text-id="helperTextId"
      />
      <template v-else>
        <LikertScaleFiveSteps
          :name="controlName"
          :model-value="modelValue ?? null"
          :disabled="disabled"
          :aria-labelled-by="labelId"
          :aria-described-by="describedById"
          @update:model-value="(val) => emit('update:modelValue', val)"
        />
        <QuestionSkipControl
          v-if="allowSkip"
          :is-skipped="modelValue === null"
          :disabled="disabled"
          :described-by="describedById"
          @skip="() => emit('update:modelValue', null)"
        />
      </template>
    </div>
  </div>
</section>
</template>

<script setup lang="ts">
import { Comment, Text, computed, toRefs, useSlots } from 'vue';
import type { LikertValue } from '~/composables/useJourneyDiagnostics';
import LikertScaleFiveSteps from '~/components/journey/questionnaire/LikertScaleFiveSteps.vue';
import QuestionSkipControl from '~/components/journey/questionnaire/QuestionSkipControl.vue';

const props = defineProps<{
  title: string;
  description?: string;
  helperText?: string;
  questionId?: string;
  questionIndex?: number;
  totalQuestions?: number;
  themeKey?: string;
  status?: 'answered' | 'skipped' | 'empty';
  modelValue?: LikertValue | null;
  name?: string;
  allowSkip?: boolean;
  disabled?: boolean;
  describedBy?: string;
}>();

const { title, description, questionId } = toRefs(props);
const slots = useSlots();

const emit = defineEmits<{
  (e: 'update:modelValue', value: LikertValue | null): void;
}>();

const labelId = computed(() => `${questionId?.value || title.value}-label`);
const descriptionId = computed(() => `${questionId?.value || title.value}-desc`);
const helperTextId = computed(() => `${questionId?.value || title.value}-helper`);
const allowSkip = computed(() => props.allowSkip ?? true);
const controlName = computed(() => props.name ?? `question-${questionId?.value || title.value}`);
const describedById = computed(() => {
  const ids = [description.value ? descriptionId.value : null, props.helperText ? helperTextId.value : null, props.describedBy ?? null]
    .filter(Boolean)
    .join(' ');
  return ids || undefined;
});

const hasDefaultSlot = computed(() => {
  const content = slots.default?.() ?? [];
  return content.some((node) => {
    if (node.type === Comment) return false;
    if (node.type === Text) return String(node.children ?? '').trim().length > 0;
    if (typeof node.children === 'string') return node.children.trim().length > 0;
    return true;
  });
});

const themeLabelMap: Record<string, string> = {
  human: 'Humain / coopération',
  governance: 'Gouvernance / décisions',
  organization: 'Organisation / process',
  resources: 'Ressources / soutenabilité',
  movement: 'Mouvement / dynamique',
  decisions: 'Décisions / clarté',
  structure: 'Structure / robustesse'
};

const themeClass = computed(() => {
  switch (props.themeKey) {
    case 'human':
      return 'pp-journey-theme-badge--human';
    case 'governance':
      return 'pp-journey-theme-badge--governance';
    case 'organization':
      return 'pp-journey-theme-badge--organization';
    case 'resources':
      return 'pp-journey-theme-badge--resources';
    case 'movement':
      return 'pp-journey-theme-badge--organization';
    case 'decisions':
      return 'pp-journey-theme-badge--governance';
    case 'structure':
      return 'pp-journey-theme-badge--resources';
    default:
      return '';
  }
});

const themeLabel = computed(() => (props.themeKey ? themeLabelMap[props.themeKey] ?? props.themeKey : ''));

const statusClass = computed(() => {
  if (props.status === 'answered') return 'pp-journey-status-badge--answered';
  if (props.status === 'skipped') return 'pp-journey-status-badge--skipped';
  return '';
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.JourneyQuestionBlock {
  @apply w-full max-w-5xl mx-auto space-y-4 border border-[color:var(--color-stroke)]/70 bg-[color:var(--color-bg-card)]/90 p-4 sm:p-6;
}

.JourneyQuestionBlock:hover {
  @apply border-[color:var(--color-accent-border)] bg-[color:var(--color-bg-card)] shadow-[var(--shadow-soft)];
}

.JourneyQuestionBlock:focus-visible {
  @apply outline-none border-[color:var(--color-accent-border)] shadow-[0_0_0_4px_rgba(249,115,22,0.12)];
}

.JourneyQuestionHeader {
  @apply space-y-1;
}

.JourneyQuestionLabel {
  @apply text-lg font-semibold;
}

.JourneyQuestionDescription {
  @apply text-sm text-[color:var(--color-text-muted)];
}

.JourneyQuestionContent {
  @apply space-y-4;
}

.JourneyQuestionHeaderTop {
  @apply flex flex-col gap-2;
}
</style>
