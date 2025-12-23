<template>
  <PPQuestionCard
    as="section"
    density="default"
    :title="title"
    :context="description"
    :index="questionIndex ?? null"
    :total="totalQuestions ?? null"
    :id-base="questionId || title"
    role="group"
    :aria-labelledby="titleId"
    :aria-describedby="describedById"
    :data-question-id="questionId || title"
  >
    <template #meta>
      <PPProgress
        v-if="questionIndex && totalQuestions"
        :current="questionIndex"
        :total="totalQuestions"
        mode="ratio"
      />
      <PPBadge v-if="themeLabel" variant="outline" size="sm" :class="themeClass">
        {{ themeLabel }}
      </PPBadge>
      <PPBadge
        v-if="status && status !== 'empty'"
        variant="success"
        size="sm"
        :class="statusClass"
      >
        {{ status === 'answered' ? 'Réponse enregistrée' : 'Mis de côté' }}
      </PPBadge>
    </template>

    <template #default>
      <slot
        v-if="hasDefaultSlot"
        :label-id="titleId"
        :description-id="contextId"
        :helper-text-id="helperTextId"
      />
      <template v-else>
        <p v-if="helperText" :id="helperTextId" class="pp-journey-feel-hint">
          {{ helperText }}
        </p>
        <LikertScaleFiveSteps
          :name="controlName"
          :model-value="modelValue ?? null"
          :disabled="disabled"
          :aria-labelled-by="titleId"
          :aria-described-by="describedById"
          @update:model-value="(val) => emit('update:modelValue', val)"
        />
      </template>
    </template>

    <template v-if="!hasDefaultSlot && !disabled" #skip>
      <QuestionSkipControl
        :is-skipped="modelValue === null"
        :disabled="disabled"
        :described-by="describedById"
        @skip="() => emit('update:modelValue', null)"
      />
    </template>
  </PPQuestionCard>
</template>

<script setup lang="ts">
import { Comment, Fragment, Text, computed, useSlots } from 'vue';
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
  disabled?: boolean;
  describedBy?: string;
}>();

const slots = useSlots();

const emit = defineEmits<{
  (e: 'update:modelValue', value: LikertValue | null): void;
}>();

/**
 * Normalise une base d'id pour éviter collisions DOM / focus hijack / ids bizarres.
 * NFKC si dispo + suppression zero-width + allowlist + prefix + maxlen.
 * NOTE: doit rester aligné avec PPQuestionCard.
 */
function normalizeIdBase(raw: string): string {
  let s = String(raw ?? '');
  try {
    if (typeof s.normalize === 'function') s = s.normalize('NFKC');
  } catch {
    // ignore
  }
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, '');
  s = s.replace(/[^a-zA-Z0-9_-]/g, '-');
  s = s.replace(/-+/g, '-').replace(/^[-_]+|[-_]+$/g, '');
  if (!s) s = 'q';
  if (s.length > 48) s = s.slice(0, 48);
  return `ppq_${s}`;
}

const baseId = computed(() => normalizeIdBase(props.questionId ?? props.title ?? 'q'));
const titleId = computed(() => `${baseId.value}__title`);
const contextId = computed(() => `${baseId.value}__context`);
const helperTextId = computed(() => `${baseId.value}__helper`);

const controlName = computed(() => props.name ?? `question-${props.questionId ?? props.title}`);

const describedById = computed(() => {
  const ids = [
    props.description ? contextId.value : null,
    props.helperText ? helperTextId.value : null,
    props.describedBy ?? null
  ]
    .filter(Boolean)
    .join(' ');

  return ids || undefined;
});

const isMeaningfulNode = (node: unknown): boolean => {
  if (!node || typeof node !== 'object') return false;
  const vnode = node as { type?: unknown; children?: unknown };
  if (vnode.type === Comment) return false;
  if (vnode.type === Text) return String(vnode.children ?? '').trim().length > 0;
  if (vnode.type === Fragment) {
    const children = Array.isArray(vnode.children) ? (vnode.children as unknown[]) : [];
    return children.some((child: unknown) => isMeaningfulNode(child));
  }
  if (typeof vnode.children === 'string') return vnode.children.trim().length > 0;
  return true;
};

const hasDefaultSlot = computed(() => {
  const content = slots.default?.() ?? [];
  return content.some((node) => isMeaningfulNode(node));
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

const THEME_BADGE_PREFIX = ['pp', 'journey', 'theme', 'badge'].join('-');
const STATUS_BADGE_PREFIX = ['pp', 'journey', 'status', 'badge'].join('-');

const themeClass = computed(() => {
  switch (props.themeKey) {
    case 'human':
      return `${THEME_BADGE_PREFIX}--human`;
    case 'governance':
      return `${THEME_BADGE_PREFIX}--governance`;
    case 'organization':
      return `${THEME_BADGE_PREFIX}--organization`;
    case 'resources':
      return `${THEME_BADGE_PREFIX}--resources`;
    case 'movement':
      return `${THEME_BADGE_PREFIX}--organization`;
    case 'decisions':
      return `${THEME_BADGE_PREFIX}--governance`;
    case 'structure':
      return `${THEME_BADGE_PREFIX}--resources`;
    default:
      return '';
  }
});

const themeLabel = computed(() => (props.themeKey ? themeLabelMap[props.themeKey] ?? props.themeKey : ''));

const statusClass = computed(() => {
  if (props.status === 'answered') return `${STATUS_BADGE_PREFIX}--answered`;
  if (props.status === 'skipped') return `${STATUS_BADGE_PREFIX}--skipped`;
  return '';
});
</script>
