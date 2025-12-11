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
      <div class="space-y-4">
        <JourneyQuestionBlock
          v-for="question in questions"
          :key="question.id"
          :title="question.label"
          :description="axisLabels[question.axis]"
          :question-id="question.id"
        >
          <LikertScale
            :model-value="getAnswer(question.id)"
            :name="`p1-q2-${question.id}`"
            :question-id="question.id"
            :labels="likertLabels"
            :describedBy="question.id + '-desc'"
            @update:model-value="onUpdate(question.id, $event)"
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
import LikertScale from '~/components/journey/LikertScale.vue';
import P1SovereigntyNotice from '~/components/journey/p1/P1SovereigntyNotice.vue';
import type { VucaAnswer, LikertValue } from '~/composables/useJourneyDiagnostics';
import { P1_SCALE_COPY } from '@/config/journeys/p1CopyV1_3';

export type P1Questionnaire2Item = {
  id: string;
  axis: 'vuca' | 'values';
  label: string;
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

const likertLabels = {
  min: `1 = ${P1_SCALE_COPY.valueLabels[1]}`,
  max: `5 = ${P1_SCALE_COPY.valueLabels[5]}`
};

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
</script>
