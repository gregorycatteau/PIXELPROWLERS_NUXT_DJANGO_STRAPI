<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-E1_panorama">
      <JourneyStepHeader
        :title="copy.title"
        :subtitle="copy.subtitle"
        heading-id="journey-step-heading-E1_panorama"
      />

      <div class="pp-journey-section space-y-4">
        <p class="pp-journey-meta">{{ copy.meta }}</p>
        <div class="pp-journey-global-notice mt-4 md:mt-5" :id="skipNoticeId">
          <span aria-hidden="true">🛡️</span>
          <span>Tu peux ignorer une question si elle ne s'applique pas.</span>
        </div>
        <div class="space-y-4">
          <JourneyQuestionBlock
            v-for="question in questions"
            :key="question.id"
            :title="question.label"
            :question-id="question.id"
            :theme-key="question.axisId"
            :status="getStatus(answers[question.id])"
            :question-index="question.order ?? questions.indexOf(question) + 1"
            :total-questions="questions.length"
            :helper-text="feelHint"
            :model-value="answers[question.id] ?? null"
            :name="`p3-${question.id}`"
            :described-by="skipNoticeId"
            @update:model-value="(val) => handleAnswer(question.id, val as LikertValue | null)"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <button type="button" class="pp-journey-cta-primary" @click="handleValidate">
          {{ copy.validate }}
        </button>
        <button type="button" class="pp-journey-cta-secondary" @click="goToStep('E0_intro')">
          {{ copy.back }}
        </button>
      </div>
      <p v-if="validationError" class="pp-journey-body text-sm text-[color:var(--color-accent-strong)]">
        {{ validationError }}
      </p>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import JourneyQuestionBlock from '~/components/journey/JourneyQuestionBlock.vue';
import type { LikertValue } from '~/composables/useJourneyDiagnostics';
import { useCoreJourneyStorage, type CorePanoramaScores } from '~/composables/useCoreJourneyStorage';
import { p3Copy } from '~/config/journeys/p3CopyV1_0';
import { p3PanoramaQuestions, P3_PANORAMA_AXIS_ORDER, type P3PanoramaAxisId } from '~/config/journeys/p3QuestionsV1_0';

const props = defineProps<{
  goToStep: (stepId: string) => void;
}>();

const copy = p3Copy.panorama;
const questions = p3PanoramaQuestions;
const axisOrder = P3_PANORAMA_AXIS_ORDER;
const skipNoticeId = 'p3-skip-notice-panorama';
const feelHint = 'Reponds au ressenti : il n y a pas de bonne ou de mauvaise reponse.';

const storage = useCoreJourneyStorage({ journeyId: 'p3' });
const validationError = ref<string | null>(null);
const answers = ref<Record<string, LikertValue | null>>({});

const axisTotals = axisOrder.reduce<Record<P3PanoramaAxisId, number>>((acc, axisId) => {
  acc[axisId] = questions.filter((q) => q.axisId === axisId).length;
  return acc;
}, {} as Record<P3PanoramaAxisId, number>);

const getStatus = (value: LikertValue | null | undefined): 'answered' | 'skipped' | 'empty' => {
  if (typeof value === 'number') return 'answered';
  if (value === null) return 'skipped';
  return 'empty';
};

const handleAnswer = (questionId: string, value: LikertValue | null) => {
  validationError.value = null;
  answers.value = { ...answers.value, [questionId]: value };
};

const buildScores = (): CorePanoramaScores => {
  const byAxis: CorePanoramaScores['byAxis'] = {};
  let answeredCount = 0;
  let skippedCount = 0;

  axisOrder.forEach((axisId) => {
    const axisQuestions = questions.filter((q) => q.axisId === axisId);
    let axisAnswered = 0;
    let axisSkipped = 0;
    let axisSum = 0;

    axisQuestions.forEach((q) => {
      const val = answers.value[q.id];
      if (typeof val === 'number') {
        axisAnswered += 1;
        answeredCount += 1;
        axisSum += val;
      } else if (val === null) {
        axisSkipped += 1;
        skippedCount += 1;
      }
    });

    const totalCount = axisTotals[axisId] ?? axisQuestions.length;
    const missingCount = Math.max(totalCount - axisAnswered - axisSkipped, 0);
    const score = axisAnswered > 0 ? Number((axisSum / axisAnswered).toFixed(1)) : 0;

    byAxis[axisId] = {
      answeredCount: axisAnswered,
      skippedCount: axisSkipped,
      missingCount,
      totalCount,
      score
    };
  });

  return {
    answeredCount,
    skippedCount,
    byAxis
  };
};

const handleValidate = () => {
  const hasAnswered = Object.values(answers.value).some((v) => typeof v === 'number');
  if (!hasAnswered) {
    validationError.value = 'Reponds a au moins une question (tu peux en passer d autres).';
    return;
  }
  const scores = buildScores();
  storage.saveScores({ panorama: scores });
  storage.saveMeta({ panoramaCompleted: true, lastStepId: 'E2_panorama_bilan' });
  props.goToStep('E2_panorama_bilan');
};
</script>
