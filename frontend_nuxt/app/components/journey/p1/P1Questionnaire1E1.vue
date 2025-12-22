<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-E1">
      <JourneyStepHeader
        title="Questionnaire 1 — symptômes"
        subtitle="Echelle 1–5, pas de stockage serveur. Réponds rapidement, sans chercher la perfection."
        heading-id="journey-step-heading-E1"
      />
      <JourneyProgressBar :current="answeredCount" :total="questions.length" label="Avancement" />
      <div class="pp-journey-global-notice mt-4 md:mt-5" :id="skipNoticeId">
        <span aria-hidden="true">🛡️</span>
        <span>{{ skipHelper }}</span>
      </div>
      <div class="space-y-4">
        <JourneyQuestionBlock
          v-for="question in questions"
          :key="question.id"
          :title="question.label"
          :description="axisLabels[question.axis]"
          :question-id="question.id"
          :data-journey-question-index="`q1-${question.id}`"
          :question-index="question.order ?? questions.indexOf(question) + 1"
          :total-questions="questions.length"
          :theme-key="question.axis"
          :status="getStatus(getAnswer(question.id))"
          v-slot="{ labelId, descriptionId }"
        >
          <p class="pp-journey-feel-hint">
            Réponds au ressenti : il n’y a pas de bonne ou de mauvaise réponse.
          </p>
          <LikertScaleFiveSteps
            :model-value="getAnswer(question.id)"
            :name="`p1-q1-${question.id}`"
            :aria-labelled-by="labelId"
            :aria-described-by="buildDescribedBy(descriptionId)"
            @update:model-value="onUpdate(question.id, $event)"
          />
          <QuestionSkipControl
            :is-skipped="getAnswer(question.id) === null"
            :described-by="skipNoticeId"
            @skip="onUpdate(question.id, null)"
          />
        </JourneyQuestionBlock>
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="pp-journey-cta-primary"
          :class="{ 'pp-journey-cta-pulse-once': allAnswered }"
          :disabled="!allAnswered"
          @click="$emit('completed')"
        >
          Continuer vers le premier bilan
        </button>
        <button type="button" class="pp-journey-cta-secondary" @click="$emit('abort')">
          Faire une pause et revenir plus tard
        </button>
      </div>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyProgressBar from '~/components/journey/JourneyProgressBar.vue';
import JourneyQuestionBlock from '~/components/journey/JourneyQuestionBlock.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import LikertScaleFiveSteps from '~/components/journey/questionnaire/LikertScaleFiveSteps.vue';
import QuestionSkipControl from '~/components/journey/questionnaire/QuestionSkipControl.vue';
import type { SymptomAnswer, LikertValue } from '~/composables/useJourneyDiagnostics';
import { P1_SKIP_COPY } from '@/config/journeys/p1CopyV1_3';

export type P1Questionnaire1Item = {
  id: string;
  axis: 'human' | 'governance' | 'organization' | 'resources';
  label: string;
  order?: number;
};

const props = defineProps<{
  questions: P1Questionnaire1Item[];
  answers: SymptomAnswer[];
}>();

const emit = defineEmits<{
  (e: 'update-answer', payload: { questionId: string; value: LikertValue | null }): void;
  (e: 'completed'): void;
  (e: 'abort'): void;
}>();

const axisLabels: Record<P1Questionnaire1Item['axis'], string> = {
  human: 'Humain / coopération',
  governance: 'Gouvernance / décision',
  organization: 'Organisation / process',
  resources: 'Ressources / soutenabilité'
};

const skipHelper = P1_SKIP_COPY.helperText;
const skipNoticeId = 'p1-skip-notice-q1';

const getAnswer = (questionId: string): LikertValue | null => {
  const found = props.answers.find((a) => a.questionId === questionId);
  return found ? found.value : null;
};

const answeredCount = computed(() => props.answers.filter((a) => typeof a.value === 'number').length);
const allAnswered = computed(() => answeredCount.value === props.questions.length && props.questions.length > 0);

const emitAnswer = (questionId: string, value: LikertValue | null) => {
  emit('update-answer', { questionId, value });
};

const onUpdate = (questionId: string, value: LikertValue | null) => {
  emitAnswer(questionId, value);
};

const buildDescribedBy = (descriptionId?: string) =>
  [descriptionId, skipNoticeId].filter(Boolean).join(' ') || undefined;

const getStatus = (value: LikertValue | null): 'answered' | 'skipped' | 'empty' => {
  if (typeof value === 'number') return 'answered';
  if (value === null) return 'skipped';
  return 'empty';
};
</script>
