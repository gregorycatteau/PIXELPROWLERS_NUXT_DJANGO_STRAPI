<template>
  <JourneyLayout>
    <PPQuestionnaireShell
      density="default"
      align="center"
      role="region"
      aria-labelledby="journey-step-heading-E1_panorama"
    >
      <template #header>
        <JourneyStepHeader
          :title="copy.title"
          :subtitle="copy.subtitle"
          heading-id="journey-step-heading-E1_panorama"
        />
      </template>

      <div class="pp-journey-section space-y-4">
        <p class="pp-journey-meta">{{ copy.meta }}</p>
        <div class="pp-journey-global-notice mt-4 md:mt-5" :id="skipNoticeId">
          <span aria-hidden="true">🛡️</span>
          <span>{{ skipHelper }}</span>
        </div>
        <div class="space-y-4">
          <JourneyQuestionBlock
            v-for="item in questions"
            :id="item.id"
            :key="item.id"
            :title="item.label"
            :question-id="item.id"
            :theme-key="item.axisId"
            :status="getStatus(answers[item.id])"
            :question-index="item.order ?? questions.indexOf(item) + 1"
            :total-questions="questions.length"
            :helper-text="feelHint"
            :model-value="answers[item.id] ?? null"
            :name="`panorama-${item.id}`"
            :described-by="skipNoticeId"
            @update:model-value="(val) => handleAnswer(item.id, val as LikertValue | null)"
          >
          </JourneyQuestionBlock>
        </div>
      </div>

      <template #footer>
        <PPQuestionNav
          :prev-label="copy.back"
          :next-label="copy.validate"
          @prev="goToStep('E0_intro')"
          @next="handleValidate"
        />
        <p v-if="validationError" class="pp-journey-body text-sm text-[color:var(--color-accent-strong)]">
          {{ validationError }}
        </p>
      </template>
    </PPQuestionnaireShell>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import JourneyQuestionBlock from '~/components/journey/JourneyQuestionBlock.vue';
import { useJourneyDiagnostics, type LikertValue } from '~/composables/useJourneyDiagnostics';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { p1Copy, p1PanoramaQuestions, type P1PanoramaAxisId } from '~/config/journeys/p1QuestionsConfig';
import { P1_SKIP_COPY } from '@/config/journeys/p1CopyV1_3';

const props = defineProps<{
  goToStep: (stepId: string) => void;
}>();

const questions = p1PanoramaQuestions;

const panoramaAxisMap = questions.reduce<Record<string, P1PanoramaAxisId>>(
  (acc, q) => {
    acc[q.id] = q.axisId;
    return acc;
  },
  {}
);

const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', panoramaAxisMap });
const storage = useDiagnosticStorage({ journeyId: 'p1' });
const validationError = ref<string | null>(null);
const skipHelper = P1_SKIP_COPY.helperText;
const skipNoticeId = 'p1-skip-notice-panorama';

const answers = computed(() => diagnostics.panoramaAnswers.value);
const copy = computed(() => p1Copy.panorama);
const feelHint = 'Réponds au ressenti : il n’y a pas de bonne ou de mauvaise réponse.';

const getStatus = (value: LikertValue | null | undefined): 'answered' | 'skipped' | 'empty' => {
  if (typeof value === 'number') return 'answered';
  if (value === null) return 'skipped';
  return 'empty';
};

const handleAnswer = (questionId: string, value: LikertValue | null) => {
  validationError.value = null;
  diagnostics.setPanoramaAnswer(questionId, value);
};


const handleValidate = () => {
  const hasAnswered = Object.values(answers.value).some((v) => v !== null && v !== undefined);
  if (!hasAnswered) {
    validationError.value = 'Réponds à au moins une question (tu peux en passer d’autres).';
    return;
  }
  const scores = diagnostics.computePanoramaScores();
  storage.saveScores({ panorama: scores });
  storage.saveMeta({ panoramaCompleted: true, lastStepId: 'E2_panorama_bilan' });
  props.goToStep('E2_panorama_bilan');
};
</script>
