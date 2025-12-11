<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-E1_panorama">
      <JourneyStepHeader
        :title="copy.title"
        :subtitle="copy.subtitle"
        heading-id="journey-step-heading-E1_panorama"
      />

      <div class="pp-journey-section space-y-3">
        <p class="pp-journey-meta">{{ copy.meta }}</p>
        <div class="space-y-3">
          <JourneyQuestionBlock
            v-for="item in questions"
            :id="item.id"
            :key="item.id"
            :title="item.label"
            :question-id="item.id"
          >
            <LikertScale
              :question-id="item.id"
              :name="`panorama-${item.id}`"
              :model-value="answers[item.id] ?? null"
              :labels="scaleLabels"
              @update:model-value="(val) => handleAnswer(item.id, val as LikertValue | null)"
              @skip="() => handleAnswer(item.id, null)"
            />
          </JourneyQuestionBlock>
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
import { computed, ref } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import JourneyQuestionBlock from '~/components/journey/JourneyQuestionBlock.vue';
import LikertScale from '~/components/journey/LikertScale.vue';
import { useJourneyDiagnostics, type LikertValue } from '~/composables/useJourneyDiagnostics';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { p1Copy, p1PanoramaQuestions } from '~/config/journeys/p1QuestionsConfig';
import { P1_SCALE_COPY } from '@/config/journeys/p1CopyV1_3';

const props = defineProps<{
  goToStep: (stepId: string) => void;
}>();

const questions = p1PanoramaQuestions;

const panoramaAxisMap = questions.reduce<Record<string, 'human' | 'governance' | 'organization' | 'resources'>>(
  (acc, q) => {
    acc[q.id] = q.axisId;
    return acc;
  },
  {}
);

const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', panoramaAxisMap });
const storage = useDiagnosticStorage({ journeyId: 'p1' });
const validationError = ref<string | null>(null);
const scaleLabels = {
  min: `1 = ${P1_SCALE_COPY.valueLabels[1]}`,
  max: `5 = ${P1_SCALE_COPY.valueLabels[5]}`
};

const answers = computed(() => diagnostics.panoramaAnswers.value);
const copy = computed(() => p1Copy.panorama);

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
