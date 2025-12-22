<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-E3">
      <JourneyStepHeader
        title="Questionnaire 2 — VUCA & valeurs"
        subtitle="Echelle 1–5, pas de stockage serveur. Concentre-toi sur ton ressenti actuel."
        heading-id="journey-step-heading-E3"
      />
      <P1SovereigntyNotice />
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
          :data-journey-question-index="`q2-${question.id}`"
          :question-index="question.order ?? questions.indexOf(question) + 1"
          :total-questions="questions.length"
          :theme-key="question.axis"
          :status="getStatus(getAnswer(question.id))"
          :helper-text="feelHint"
          :model-value="getAnswer(question.id)"
          :name="`p1-q2-${question.id}`"
          :described-by="skipNoticeId"
          @update:model-value="onUpdate(question.id, $event)"
        >
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
          Continuer vers le bilan VUCA
        </button>
        <button type="button" class="pp-journey-cta-secondary" @click="$emit('abort')">
          Revenir au bilan précédent
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
import P1SovereigntyNotice from '~/components/journey/p1/P1SovereigntyNotice.vue';
import type { VucaAnswer, LikertValue } from '~/composables/useJourneyDiagnostics';
import { P1_SKIP_COPY } from '@/config/journeys/p1CopyV1_3';

export type P1Questionnaire2Item = {
  id: string;
  axis: 'vuca' | 'values';
  label: string;
  order?: number;
};

const props = defineProps<{
  questions: P1Questionnaire2Item[];
  answers: VucaAnswer[];
}>();

const emit = defineEmits<{
  (e: 'update-answer', payload: { questionId: string; value: LikertValue | null }): void;
  (e: 'completed'): void;
  (e: 'abort'): void;
}>();

const axisLabels: Record<P1Questionnaire2Item['axis'], string> = {
  vuca: 'Adaptabilité / Feedback / Autonomie / Vision',
  values: 'Valeurs & alignement perçu'
};

const skipHelper = P1_SKIP_COPY.helperText;
const skipNoticeId = 'p1-skip-notice-q2';
const feelHint = 'Réponds au ressenti : il n’y a pas de bonne ou de mauvaise réponse.';

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


const getStatus = (value: LikertValue | null): 'answered' | 'skipped' | 'empty' => {
  if (typeof value === 'number') return 'answered';
  if (value === null) return 'skipped';
  return 'empty';
};
</script>
