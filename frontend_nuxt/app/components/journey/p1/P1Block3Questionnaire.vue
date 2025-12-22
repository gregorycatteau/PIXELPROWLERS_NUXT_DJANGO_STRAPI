<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-B3_questions">
      <JourneyStepHeader
        :title="blockCopy.questionnaireTitle"
        :subtitle="blockCopy.questionnaireSubtitle || blockCopy.subtitle"
        heading-id="journey-step-heading-B3_questions"
      />
      <div class="pp-journey-global-notice mt-4 md:mt-5" :id="skipNoticeId">
        <span aria-hidden="true">🛡️</span>
        <span>{{ skipHelper }}</span>
      </div>
      <div class="space-y-6">
        <div class="space-y-4">
          <JourneyQuestionBlock
            v-for="(question, index) in questions"
            :id="question.id"
            :key="question.id"
            :title="question.label"
            :question-id="question.id"
            :data-journey-question-index="`b3-${question.id}`"
            :question-index="index + 1"
            :total-questions="totalQuestions"
            :theme-key="question.axisId"
            :status="getStatus(answers[question.id])"
            v-slot="{ labelId, descriptionId }"
          >
            <p class="pp-journey-feel-hint">
              Réponds au ressenti : il n’y a pas de bonne ou de mauvaise réponse.
            </p>
            <LikertScaleFiveSteps
              :name="`b3-${question.id}`"
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

        <div v-if="eligibleFollowupCount > 2" class="space-y-2 border border-neutral-800 rounded-md p-4">
          <p class="text-sm text-[color:var(--color-text)] font-semibold">
            Tu peux approfondir, mais ce n’est pas nécessaire partout. Choisis 1 ou 2 thèmes : ceux qui te pèsent le plus.
          </p>
          <button
            type="button"
            class="pp-btn-ghost text-xs"
            @click="showAllFollowups = !showAllFollowups"
          >
            {{ showAllFollowups ? 'Masquer les autres thèmes' : 'Voir aussi les autres thèmes à approfondir' }}
          </button>
        </div>

        <div
          v-for="pack in visibleFollowupPacks"
          :key="pack.subAxisId"
          class="space-y-3 border border-neutral-800 rounded-md p-4"
        >
          <header class="space-y-2">
            <p class="text-sm font-semibold text-[color:var(--color-text)]">
              {{ pack.label }}
            </p>
            <p class="text-xs text-[color:var(--color-text-muted)]">
              Tu as signalé une forte tension ici. Deux questions pour préciser (facultatif).
            </p>
          </header>
          <div v-if="pack.showPrecision" class="space-y-3">
            <JourneyQuestionBlock
              v-for="question in pack.precision"
              :id="question.id"
              :key="question.id"
              :title="question.assertion"
              :question-id="question.id"
              :data-journey-question-index="`b3-${question.id}`"
              :question-index="relevantQuestionIds.indexOf(question.id) + 1"
              :total-questions="totalQuestions"
              :theme-key="question.subAxis || pack.subAxisId"
              :status="getStatus(answers[question.id])"
              v-slot="{ labelId, descriptionId }"
            >
              <LikertScaleFiveSteps
                :name="`b3-${question.id}`"
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

          <div v-if="pack.showDeep" class="space-y-3">
            <p class="text-xs text-[color:var(--color-text-muted)] font-semibold">
              Aller plus loin (optionnel)
            </p>
            <JourneyQuestionBlock
              v-for="question in pack.deep"
              :id="question.id"
              :key="question.id"
              :title="question.assertion"
              :question-id="question.id"
              :data-journey-question-index="`b3-${question.id}`"
              :question-index="relevantQuestionIds.indexOf(question.id) + 1"
              :total-questions="totalQuestions"
              :theme-key="question.subAxis || pack.subAxisId"
              :status="getStatus(answers[question.id])"
              v-slot="{ labelId, descriptionId }"
            >
              <LikertScaleFiveSteps
                :name="`b3-${question.id}`"
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

          <div class="flex flex-wrap gap-2">
            <button type="button" class="pp-btn-ghost text-xs" @click="skipPack(pack)">
              Passer ce thème
            </button>
          </div>
        </div>
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
import { computed, ref } from 'vue';
import { useJourneyDiagnostics, type LikertValue } from '~/composables/useJourneyDiagnostics';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { p1BlockContent, p1BlocksQuestions, p1BlockThemes, p1Copy } from '~/config/journeys/p1QuestionsConfig';
import { P1_SKIP_COPY } from '@/config/journeys/p1CopyV1_3';
import { P1_B3_FOLLOWUPS } from '@/config/journeys/p1FollowupsV1_3';
import { P1_QUESTIONS_V1_3 } from '@/config/journeys/p1QuestionsV1_3';
import { toCanonicalThemeId } from '@/config/journeys/p1ThemeIdAliases';

const props = defineProps<{
  goToStep: (stepId: string) => void;
}>();

const blockId = 'b3';
const questions = p1BlocksQuestions[blockId];
const blockCopy = computed(() => p1BlockContent[blockId]);
const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', blockThemeMap: p1BlockThemes });
const storage = useDiagnosticStorage({ journeyId: 'p1' });
const copy = computed(() => p1Copy.blockQuestionnaire);
const skipHelper = P1_SKIP_COPY.helperText;
const skipNoticeId = 'p1-skip-notice-b3';
const showAllFollowups = ref(false);

const answers = computed(() => diagnostics.blockAnswers.value[blockId] ?? {});
const baseQuestionBySubAxis = computed(() =>
  P1_QUESTIONS_V1_3.filter((q) => q.blockId === 'B3').reduce<Record<string, string[]>>((acc, q) => {
    const subAxis = q.subAxis;
    if (!subAxis) return acc;
    acc[subAxis] = acc[subAxis] ?? [];
    acc[subAxis].push(q.id);
    return acc;
  }, {})
);

const computeTensionScore = (value: LikertValue, polarity: 'positive' | 'negative') => {
  const max = 5;
  return polarity === 'positive' ? max - value : value - 1;
};

const subAxisTension = computed<Record<string, number | null>>(() => {
  const map: Record<string, number | null> = {};
  Object.entries(baseQuestionBySubAxis.value).forEach(([subAxisId, ids]) => {
    let maxTension: number | null = null;
    ids.forEach((id) => {
      const question = P1_QUESTIONS_V1_3.find((q) => q.id === id);
      const val = answers.value[id];
      if (typeof val !== 'number' || !question) return;
      const tension = computeTensionScore(val as LikertValue, question.polarity);
      if (maxTension === null || tension > maxTension) {
        maxTension = tension;
      }
    });
    map[subAxisId] = maxTension;
  });
  return map;
});

const eligibleFollowupPacks = computed(() => {
  return Object.values(P1_B3_FOLLOWUPS)
    .map((pack) => {
      const tension = subAxisTension.value[pack.subAxisId] ?? null;
      const showPrecision = tension !== null && tension >= 3;
      const showDeep = tension === 4;
      return {
        ...pack,
        tension,
        showPrecision,
        showDeep
      };
    })
    .filter((pack) => pack.showPrecision || pack.showDeep);
});

const sortedEligibleFollowupPacks = computed(() => {
  const hasCritical = (pack: (typeof eligibleFollowupPacks.value)[number]) =>
    [...pack.precision, ...pack.deep].some((q) => q.critical);
  return [...eligibleFollowupPacks.value].sort((a, b) => {
    const tA = a.tension ?? -1;
    const tB = b.tension ?? -1;
    if (tB !== tA) return tB - tA;
    const cA = hasCritical(a);
    const cB = hasCritical(b);
    if (cA !== cB) return Number(cB) - Number(cA);
    return a.subAxisId.localeCompare(b.subAxisId);
  });
});

const eligibleFollowupCount = computed(() => sortedEligibleFollowupPacks.value.length);

const visibleFollowupPacks = computed(() => {
  if (showAllFollowups.value || sortedEligibleFollowupPacks.value.length <= 2) {
    return sortedEligibleFollowupPacks.value;
  }
  return sortedEligibleFollowupPacks.value.slice(0, 2);
});

const followupQuestions = computed(() =>
  visibleFollowupPacks.value.flatMap((pack) => [
    ...(pack.showPrecision ? pack.precision : []),
    ...(pack.showDeep ? pack.deep : [])
  ])
);

const relevantQuestionIds = computed(() => [...questions.map((q) => q.id), ...followupQuestions.value.map((q) => q.id)]);

const totalQuestions = computed(() => relevantQuestionIds.value.length);
const answeredCount = computed(() =>
  relevantQuestionIds.value.reduce((acc, id) => {
    const val = answers.value[id];
    if (val !== null && val !== undefined) return acc + 1;
    return acc;
  }, 0)
);
const skippedCount = computed(() => relevantQuestionIds.value.filter((id) => answers.value[id] === null).length);

const handleAnswer = (questionId: string, value: LikertValue | null) => {
  diagnostics.setBlockAnswer(blockId, questionId, value);
};

const buildDescribedBy = (descriptionId?: string) =>
  [descriptionId, skipNoticeId].filter(Boolean).join(' ') || undefined;

const skipPack = (pack: (typeof visibleFollowupPacks.value)[number]) => {
  const ids = [...(pack.showPrecision ? pack.precision : []), ...(pack.showDeep ? pack.deep : [])].map((q) => q.id);
  ids.forEach((id) => handleAnswer(id, null));
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
  const followupsStatus = Object.values(P1_B3_FOLLOWUPS).reduce<Record<string, { precision: string; deep: string; overall: string }>>((acc, pack) => {
    const packVisible = visibleFollowupPacks.value.find((p) => p.subAxisId === pack.subAxisId);
    const computeStatus = (questions: typeof pack.precision, visible: boolean) => {
      if (!visible) return 'missing';
      const vals = questions.map((q) => answers.value[q.id]);
      const hasAnswer = vals.some((v) => typeof v === 'number');
      const hasSkip = vals.every((v) => v === null);
      if (hasAnswer) return 'answered';
      if (hasSkip) return 'skipped';
      return 'missing';
    };
    const precisionStatus = computeStatus(pack.precision, Boolean(packVisible?.showPrecision));
    const deepStatus = computeStatus(pack.deep, Boolean(packVisible?.showDeep));
    let overall: string = 'missing';
    if (precisionStatus === 'answered' || deepStatus === 'answered') overall = 'answered';
    else if (precisionStatus === 'skipped' && (deepStatus === 'skipped' || deepStatus === 'missing')) {
      overall = 'skipped';
    } else {
      overall = 'missing';
    }
    const canonical = toCanonicalThemeId(pack.subAxisId) ?? pack.subAxisId;
    acc[canonical] = {
      precision: precisionStatus,
      deep: deepStatus,
      overall
    };
    return acc;
  }, {});
  const newMeta = {
    ...(storage.meta.value ?? {}),
    lastStepId: 'B3_bilan',
    completedBlocks: Array.from(completed)
  } as Partial<typeof storage.meta.value> & Record<string, any>;
  newMeta.followups = {
    ...(((storage.meta.value as Record<string, any>)?.followups) ?? {}),
    b3: followupsStatus,
    completedBlocks: Array.from(completed)
  };
  storage.saveMeta(newMeta);
  props.goToStep('B3_bilan');
};
</script>
