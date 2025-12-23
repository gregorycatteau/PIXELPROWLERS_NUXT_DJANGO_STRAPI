<template>
  <JourneyLayout>
    <PPQuestionnaireShell
      density="default"
      align="center"
      role="region"
      aria-labelledby="journey-step-heading-B2_questions"
    >
      <template #header>
        <JourneyStepHeader
          :title="blockCopy.questionnaireTitle"
          :subtitle="blockCopy.questionnaireSubtitle || blockCopy.subtitle"
          heading-id="journey-step-heading-B2_questions"
        />
      </template>

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
          :data-journey-question-index="`b2-${question.id}`"
          :question-index="questions.indexOf(question) + 1"
          :total-questions="questions.length"
          :theme-key="question.axisId"
          :status="getStatus(answers[question.id])"
          :helper-text="feelHint"
          :model-value="answers[question.id] ?? null"
          :name="`b2-${question.id}`"
          :described-by="skipNoticeId"
          @update:model-value="(val) => handleAnswer(question.id, val as LikertValue | null)"
        >
        </JourneyQuestionBlock>
      </div>

      <template #footer>
        <PPQuestionNav
          :prev-label="copy.backToHub"
          :next-label="blockCopy.bilanTitle"
          @prev="goToStep('E2_panorama_bilan')"
          @next="handleValidate"
        />
        <div class="pp-journey-body text-sm text-[color:var(--color-text-muted)] flex flex-wrap items-center gap-2">
          <span>{{ copy.progressAnsweredLabel }} :</span>
          <PPProgress :current="answeredCount" :total="totalQuestions" mode="ratio" />
          <span>· {{ copy.progressSkippedLabel }} :</span>
          <span>{{ skippedCount }}</span>
        </div>
      </template>
    </PPQuestionnaireShell>
  </JourneyLayout>
</template>

<script setup lang="ts">
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import JourneyQuestionBlock from '~/components/journey/JourneyQuestionBlock.vue';
import { computed } from 'vue';
import { useJourneyDiagnostics, type LikertValue } from '~/composables/useJourneyDiagnostics';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { p1BlockContent, p1BlocksQuestions, p1BlockThemes, p1Copy } from '~/config/journeys/p1QuestionsConfig';
import { P1_SKIP_COPY } from '@/config/journeys/p1CopyV1_3';

const props = defineProps<{
  goToStep: (stepId: string) => void;
}>();

const blockId = 'b2';
const questions = p1BlocksQuestions[blockId];
const blockCopy = computed(() => p1BlockContent[blockId]);
const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', blockThemeMap: p1BlockThemes });
const storage = useDiagnosticStorage({ journeyId: 'p1' });
const copy = computed(() => p1Copy.blockQuestionnaire);
const skipHelper = P1_SKIP_COPY.helperText;
const skipNoticeId = 'p1-skip-notice-b2';
const feelHint = 'Réponds au ressenti : il n’y a pas de bonne ou de mauvaise réponse.';

const answers = computed(() => diagnostics.blockAnswers.value[blockId] ?? {});
const totalQuestions = questions.length;
const answeredCount = computed(() => Object.values(answers.value).filter((v) => v !== null && v !== undefined).length);
const skippedCount = computed(() => Object.values(answers.value).filter((v) => v === null).length);

const handleAnswer = (questionId: string, value: LikertValue | null) => {
  diagnostics.setBlockAnswer(blockId, questionId, value);
};


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
  storage.saveMeta({ lastStepId: 'B2_bilan', completedBlocks: Array.from(completed) });
  props.goToStep('B2_bilan');
};
</script>
