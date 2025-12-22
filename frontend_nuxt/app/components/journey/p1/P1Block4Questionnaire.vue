<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-B4_questions">
      <JourneyStepHeader
        :title="blockCopy.questionnaireTitle"
        :subtitle="blockCopy.questionnaireSubtitle || blockCopy.subtitle"
        heading-id="journey-step-heading-B4_questions"
      />
      <div class="pp-journey-global-notice mt-4 md:mt-5" :id="skipNoticeId">
        <span aria-hidden="true">🛡️</span>
        <span>{{ skipHelper }}</span>
      </div>
      <div class="space-y-4">
        <JourneyQuestionBlock
          v-for="question in questions"
          :id="question.id"
          :key="question.id"
          :title="question.label"
          :question-id="question.id"
          :data-journey-question-index="`b4-${question.id}`"
          :question-index="questions.indexOf(question) + 1"
          :total-questions="questions.length"
          :theme-key="question.axisId"
          :status="getStatus(answers[question.id])"
          v-slot="{ labelId, descriptionId }"
        >
          <p class="pp-journey-feel-hint">
            Réponds au ressenti : il n’y a pas de bonne ou de mauvaise réponse.
          </p>
          <LikertScaleFiveSteps
            :name="`b4-${question.id}`"
            :model-value="answers[question.id] ?? null"
            :aria-labelled-by="labelId"
            :aria-described-by="buildDescribedBy(descriptionId)"
            @update:model-value="(val) => handleAnswer(question.id, val as LikertValue | null)"
          />
          <QuestionSkipControl
            :is-skipped="answers[question.id] === null"
            :described-by="skipNoticeId"
            @skip="() => handleAnswer(question.id, null)"
          />
        </JourneyQuestionBlock>
      </div>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="pp-journey-cta-primary" @click="handleValidate">
          {{ blockCopy.bilanTitle }}
        </button>
        <button type="button" class="pp-journey-cta-secondary" @click="goToStep('E2_panorama_bilan')">
          {{ copy.backToHub }}
        </button>
      </div>
      <p class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">
        {{ copy.progressAnsweredLabel }} : {{ answeredCount }} / {{ totalQuestions }} · {{ copy.progressSkippedLabel }} :
        {{ skippedCount }}
      </p>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import JourneyQuestionBlock from '~/components/journey/JourneyQuestionBlock.vue';
import LikertScaleFiveSteps from '~/components/journey/questionnaire/LikertScaleFiveSteps.vue';
import QuestionSkipControl from '~/components/journey/questionnaire/QuestionSkipControl.vue';
import { computed } from 'vue';
import { useJourneyDiagnostics, type LikertValue } from '~/composables/useJourneyDiagnostics';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { p1BlockContent, p1BlocksQuestions, p1BlockThemes, p1Copy } from '~/config/journeys/p1QuestionsConfig';
import { P1_SKIP_COPY } from '@/config/journeys/p1CopyV1_3';

const props = defineProps<{
  goToStep: (stepId: string) => void;
}>();

const blockId = 'b4';
const questions = p1BlocksQuestions[blockId];
const blockCopy = computed(() => p1BlockContent[blockId]);
const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', blockThemeMap: p1BlockThemes });
const storage = useDiagnosticStorage({ journeyId: 'p1' });
const copy = computed(() => p1Copy.blockQuestionnaire);
const skipHelper = P1_SKIP_COPY.helperText;
const skipNoticeId = 'p1-skip-notice-b4';

const answers = computed(() => diagnostics.blockAnswers.value[blockId] ?? {});
const totalQuestions = questions.length;
const answeredCount = computed(() => Object.values(answers.value).filter((v) => v !== null && v !== undefined).length);
const skippedCount = computed(() => Object.values(answers.value).filter((v) => v === null).length);

const handleAnswer = (questionId: string, value: LikertValue | null) => {
  diagnostics.setBlockAnswer(blockId, questionId, value);
};

const buildDescribedBy = (descriptionId?: string) =>
  [descriptionId, skipNoticeId].filter(Boolean).join(' ') || undefined;

const getStatus = (value: LikertValue | null | undefined): 'answered' | 'skipped' | 'empty' => {
  if (typeof value === 'number') return 'answered';
  if (value === null) return 'skipped';
  return 'empty';
};

const handleValidate = () => {
  const scores = diagnostics.computeBlockScores(blockId);
  storage.saveScores({ blocks: { ...(storage.scores.value?.blocks ?? {}), [blockId]: scores } });
  const completed = new Set(storage.meta.value?.completedBlocks ?? []);
  completed.add(blockId);
  storage.saveMeta({ lastStepId: 'B4_bilan', completedBlocks: Array.from(completed) });
  props.goToStep('B4_bilan');
};
</script>
