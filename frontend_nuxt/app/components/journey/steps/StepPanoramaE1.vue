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
        <p v-if="copy.meta" class="pp-journey-meta">{{ copy.meta }}</p>
        <div class="pp-journey-global-notice mt-4 md:mt-5" :id="skipNoticeId">
          <span aria-hidden="true">🛡️</span>
          <span>Tu peux ignorer une question si elle ne s applique pas.</span>
        </div>
        <div v-if="questions.length" class="space-y-4">
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
            :name="`${manifest.id}-${question.id}`"
            :described-by="skipNoticeId"
            @update:model-value="(val) => handleAnswer(question.id, val as LikertValue | null)"
          />
        </div>
        <div v-else>
          <p class="pp-journey-body">Aucune question n est disponible pour ce panorama.</p>
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
import type { JourneyManifestV1 } from '~/config/journeys/manifests/types';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import JourneyQuestionBlock from '~/components/journey/JourneyQuestionBlock.vue';
import type { LikertValue } from '~/composables/useJourneyDiagnostics';
import { useCoreJourneyStorage, type CorePanoramaScores } from '~/composables/useCoreJourneyStorage';
import { getJourneyCopy, getJourneyPanoramaQuestions, type PanoramaQuestion } from '~/config/journeys/journeyDataRegistry';

const props = defineProps<{
  manifest: JourneyManifestV1;
  goToStep: (stepId: string) => void;
}>();

const fallbackCopy = {
  title: 'Panorama',
  subtitle: 'Reponses locales uniquement.',
  meta: 'Reponds selon ton ressenti actuel. Tu peux ignorer des questions.',
  validate: 'Voir le bilan',
  back: 'Retour'
};

const copy = computed(() => {
  const bundle = getJourneyCopy(props.manifest);
  return bundle?.panorama ? { ...fallbackCopy, ...bundle.panorama } : fallbackCopy;
});

const feelHint = 'Reponds au ressenti : il n y a pas de bonne ou de mauvaise reponse.';
const skipNoticeId = `journey-${props.manifest.id}-skip-notice-panorama`;

const storage = useCoreJourneyStorage({ journeyId: props.manifest.id });
const validationError = ref<string | null>(null);
const answers = ref<Record<string, LikertValue | null>>({});

const questionsBundle = computed(() => getJourneyPanoramaQuestions(props.manifest));
const questions = computed<PanoramaQuestion[]>(() => questionsBundle.value?.questions ?? []);

const axisOrder = computed(() => {
  if (questionsBundle.value?.axisOrder?.length) return questionsBundle.value.axisOrder;
  const axisFromManifest = props.manifest.axes?.map((axis) => axis.axisId) ?? [];
  if (axisFromManifest.length) return axisFromManifest;
  const seen = new Set<string>();
  const order: string[] = [];
  questions.value.forEach((question) => {
    if (!seen.has(question.axisId)) {
      seen.add(question.axisId);
      order.push(question.axisId);
    }
  });
  return order;
});

const axisTotals = computed(() =>
  axisOrder.value.reduce<Record<string, number>>((acc, axisId) => {
    acc[axisId] = questions.value.filter((q) => q.axisId === axisId).length;
    return acc;
  }, {} as Record<string, number>)
);

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

  axisOrder.value.forEach((axisId) => {
    const axisQuestions = questions.value.filter((q) => q.axisId === axisId);
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

    const totalCount = axisTotals.value[axisId] ?? axisQuestions.length;
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
