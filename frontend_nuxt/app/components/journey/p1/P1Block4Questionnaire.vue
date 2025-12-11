<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-4" role="region" aria-labelledby="journey-step-heading-B4_questions">
      <JourneyStepHeader
        :title="blockCopy.questionnaireTitle"
        :subtitle="blockCopy.questionnaireSubtitle || blockCopy.subtitle"
        heading-id="journey-step-heading-B4_questions"
      />
      <div class="space-y-3">
        <JourneyQuestionBlock
          v-for="question in questions"
          :id="question.id"
          :key="question.id"
          :title="question.label"
          :question-id="question.id"
        >
          <LikertScale
            :question-id="question.id"
            :name="`b4-${question.id}`"
            :model-value="answers[question.id] ?? null"
            :labels="scaleLabels"
            @update:model-value="(val) => handleAnswer(question.id, val as LikertValue | null)"
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
import LikertScale from '~/components/journey/LikertScale.vue';
import { computed } from 'vue';
import { useJourneyDiagnostics, type LikertValue } from '~/composables/useJourneyDiagnostics';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { p1BlockContent, p1BlocksQuestions, p1BlockThemes, p1Copy } from '~/config/journeys/p1QuestionsConfig';
import { P1_SCALE_COPY } from '@/config/journeys/p1CopyV1_3';

const props = defineProps<{
  goToStep: (stepId: string) => void;
}>();

const blockId = 'b4';
const questions = p1BlocksQuestions[blockId];
const blockCopy = computed(() => p1BlockContent[blockId]);
const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', blockThemeMap: p1BlockThemes });
const storage = useDiagnosticStorage({ journeyId: 'p1' });
const copy = computed(() => p1Copy.blockQuestionnaire);
const scaleLabels = {
  min: `1 = ${P1_SCALE_COPY.valueLabels[1]}`,
  max: `5 = ${P1_SCALE_COPY.valueLabels[5]}`
};

const answers = computed(() => diagnostics.blockAnswers.value[blockId] ?? {});
const totalQuestions = questions.length;
const answeredCount = computed(() => Object.values(answers.value).filter((v) => v !== null && v !== undefined).length);
const skippedCount = computed(() => Object.values(answers.value).filter((v) => v === null).length);

const handleAnswer = (questionId: string, value: LikertValue | null) => {
  diagnostics.setBlockAnswer(blockId, questionId, value);
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
