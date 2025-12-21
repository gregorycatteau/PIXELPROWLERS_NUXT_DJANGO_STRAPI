<template>
  <JourneyLayout>
    <div
      class="pp-journey-layout-wide"
      role="region"
      aria-labelledby="journey-step-heading-E2_panorama_bilan"
    >
      <header class="space-y-4 pp-bilan-intro">
        <JourneyStepHeader
          :title="copy.title"
          :subtitle="copy.subtitle"
          heading-id="journey-step-heading-E2_panorama_bilan"
        />
        <p class="pp-bilan-subtext">
          {{ copy.panoramaSummarySubtitle || copy.panoramaSummaryTitle }}
        </p>
      </header>

      <div class="pp-bilan-wrapper pp-bilan-layout">
        <div class="pp-bilan-main">
          <template v-if="hasPanoramaScores">
            <section class="pp-bilan-by-axis-intro">
              <div class="space-y-2">
                <p class="pp-journey-subtitle text-sm sm:text-base">
                  {{ copy.panoramaSummarySubtitle || copy.panoramaSummaryTitle }}
                </p>
                <div class="space-y-2">
                  <p
                    v-for="paragraph in panoramaIntroParagraphs"
                    :key="paragraph"
                    class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </div>
              <div class="pp-bilan-axis-summary-row">
                <button
                  v-for="axis in axes"
                  :key="axis.id"
                  type="button"
                  class="pp-bilan-axis-summary-chip"
                  :aria-label="`Voir l’axe ${axis.label}`"
                  @click="scrollToAxis(axis.id)"
                >
                  <span class="pp-bilan-axe-icon" aria-hidden="true">{{ axis.icon }}</span>
                  <span class="text-xs font-semibold">{{ axis.labelShort }}</span>
                  <span class="text-[11px] text-slate-300/80">Score {{ axis.score ?? 0 }}</span>
                  <span class="text-[11px] text-slate-200/90 flex items-center gap-1">
                    <span aria-hidden="true">{{ axis.toneEmoji }}</span>{{ axis.tone }}
                  </span>
                </button>
              </div>
            </section>

            <section
              v-for="axis in axes"
              :key="axis.id"
              :id="axis.id"
              :ref="(el) => setAxisRef(axis.id, el as HTMLElement | null)"
              class="pp-bilan-axis-section"
            >
              <div class="pp-bilan-axis-shell">
                <header class="pp-bilan-axis-header">
                  <div class="pp-bilan-axis-header-main">
                    <span class="pp-bilan-axe-icon" aria-hidden="true">{{ axis.icon }}</span>
                    <span class="pp-bilan-axis-label">{{ axis.label }}</span>
                  </div>
                  <div class="pp-bilan-axis-header-score">
                    <span class="pp-bilan-axis-score-chip">
                      Score {{ axis.score ?? 0 }}
                    </span>
                    <span class="pp-bilan-axis-meteo">
                      <span aria-hidden="true">{{ axis.toneEmoji }}</span> {{ axis.tone }}
                    </span>
                  </div>
                </header>

                <div class="pp-bilan-axis-grid">
                  <article class="pp-bilan-axis-card pp-bilan-axis-card-tensions">
                    <p class="pp-bilan-axis-card-label">Ce que tu viens de poser</p>
                    <p class="pp-bilan-axis-card-text">
                      {{ axis.tensionText }}
                    </p>
                  </article>

                    <article class="pp-bilan-axis-card pp-bilan-axis-card-interpretation">
                      <p class="pp-bilan-axis-card-label">Ce qu’on peut en comprendre</p>
                      <p class="pp-bilan-axis-card-text">
                        {{ axis.interpretationText }}
                      </p>
                    </article>
                  </div>

                <footer v-if="axis.suggestedBlock" class="pp-bilan-axis-actions">
                  <div class="pp-bilan-axis-actions-text">
                    <p class="pp-bilan-axis-actions-label">
                      Priorité suggérée
                    </p>
                    <p class="pp-bilan-axis-actions-title">
                      {{ axis.suggestedBlock.title }}
                    </p>
                    <p
                      v-if="axis.suggestedBlock.note"
                      class="pp-bilan-axis-actions-note"
                    >
                      {{ axis.suggestedBlock.note }}
                    </p>
                  </div>

                  <div class="pp-bilan-axis-actions-ctas">
                    <button
                      type="button"
                      class="pp-btn-primary"
                      @click="axis.suggestedBlock.step && goToStep(axis.suggestedBlock.step)"
                    >
                      Explorer ce bloc
                    </button>

                    <button
                      v-if="axis.suggestedBlock.hasBilan && axis.suggestedBlock.bilanStep"
                      type="button"
                      class="pp-btn-ghost"
                      @click="goToStep(axis.suggestedBlock.bilanStep)"
                    >
                      Voir le bilan du bloc
                    </button>
                  </div>
                </footer>
              </div>
            </section>

            <section class="pp-bilan-step" aria-labelledby="next-steps-heading">
              <h2 id="next-steps-heading" class="sr-only">Explorer les blocs</h2>
              <div class="space-y-2">
                <p class="pp-journey-subtitle text-sm sm:text-base">
                  {{ copy.panoramaNextStepsSubtitle || copy.panoramaNextStepsTitle }}
                </p>
              </div>

              <P1BlocksHub
                :recommendations="narrative"
                :blocks="blockStates"
                :copy="copy"
                @explore="goToStep"
              />

              <div class="mt-8 grid gap-4 md:grid-cols-2">
                <article class="pp-journey-card-soft space-y-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                    Continuer en solo pour l’instant (Niveau 1)
                  </p>
                  <div class="space-y-2">
                    <p
                      v-for="paragraph in n1BlockParagraphs"
                      :key="paragraph"
                      class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                    >
                      {{ paragraph }}
                    </p>
                  </div>
                </article>

                <article class="pp-journey-card-soft space-y-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                    Envie d’un miroir sur ce panorama ? (Niveau 2)
                  </p>
                  <div class="space-y-2">
                    <p
                      v-for="paragraph in n2BlockParagraphs"
                      :key="paragraph"
                      class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                    >
                      {{ paragraph }}
                    </p>
                  </div>
                  <NuxtLink class="pp-journey-cta-secondary" to="/contact">
                    Demander un miroir externe
                  </NuxtLink>
                </article>
              </div>
            </section>

            <footer class="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                class="pp-bilan-cta-ghost"
                @click="goToStep('E1_panorama')"
              >
                {{ copy.backToPanorama }}
              </button>
              <button
                v-if="canAccessGlobalBilan"
                type="button"
                class="pp-journey-cta-primary"
                @click="handleGoToGlobal"
              >
                {{ copy.globalCta }}
              </button>
              <p v-else class="text-sm text-[color:var(--color-text-muted)] text-center">
                {{ copy.globalLocked }}
              </p>
            </footer>
          </template>

          <template v-else>
            <section class="pp-journey-card-soft space-y-3">
              <p class="pp-journey-body">
                On a besoin du panorama pour afficher ce bilan.
              </p>
              <button
                type="button"
                class="pp-journey-cta-primary"
                @click="goToStep('E1_panorama')"
              >
                {{ copy.backToPanorama }}
              </button>
            </section>
          </template>
        </div>

        <aside class="pp-bilan-timeline-shell" aria-label="Navigation par axe">
          <div class="pp-bilan-timeline">
            <nav aria-label="Navigation par axe">
              <ol class="pp-bilan-timeline-list">
                <li v-for="(axis, index) in axes" :key="axis.id">
                  <button
                    type="button"
                    class="pp-bilan-timeline-item"
                    :class="{ 'pp-bilan-timeline-item--active': activeAxisId === axis.id }"
                    :aria-current="activeAxisId === axis.id ? 'step' : undefined"
                    @click="scrollToAxis(axis.id)"
                  >
                    <span class="pp-bilan-timeline-dot" aria-hidden="true" />
                    <span class="pp-bilan-timeline-label">
                      {{ index + 1 }}. {{ axis.labelShort || axis.label }}
                    </span>
                  </button>
                </li>
              </ol>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import P1BlocksHub from './P1BlocksHub.vue';
import { useJourneyDiagnostics, type P1PanoramaScores } from '~/composables/useJourneyDiagnostics';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { useP1PanoramaNarrative } from '~/composables/useP1PanoramaNarrative';
import {
  P1_BLOCK_IDS,
  p1BlockContent,
  p1Copy,
  p1PanoramaAxesMeta,
  p1PanoramaQuestions,
  p1PanoramaSuggestions,
  p1PanoramaText,
  type P1BlockId,
  type P1PanoramaAxisId
} from '~/config/journeys/p1QuestionsConfig';
import { p1EngagementCopy } from '~/config/journeys/p1EngagementCopy';
import { getP1PanoramaScoresFromStored } from '~/utils/p1PanoramaStorage';
import { hasP1GlobalBilanAccess } from '~/utils/p1GlobalBilanAccess';

const props = defineProps<{
  goToStep: (stepId: string) => void;
  goToGlobalBilan?: () => void;
}>();

const storage = useDiagnosticStorage({ journeyId: 'p1' });
const panoramaAxisMap = p1PanoramaQuestions.reduce<Record<string, P1PanoramaAxisId>>(
  (acc, q) => {
    acc[q.id] = q.axisId;
    return acc;
  },
  {}
);
const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', panoramaAxisMap });
const axisOrder = ['human', 'movement', 'decisions', 'structure'] as const;
type AxisId = (typeof axisOrder)[number];
type Bucket = 'low' | 'medium' | 'high';

const storedPanoramaScores = computed<P1PanoramaScores | null>(() => getP1PanoramaScoresFromStored(storage.scores.value));
const runtimePanoramaScores = computed<P1PanoramaScores | null>(() => diagnostics.getPanoramaScoresOrNull());
const panoramaScores = computed<P1PanoramaScores | null>(() => storedPanoramaScores.value ?? runtimePanoramaScores.value ?? null);

const hasPanoramaScores = computed(() => {
  const s = panoramaScores.value;
  if (!s) return false;
  const hasAxisScore = axisOrder.some((axisId) => typeof s[axisId] === 'number' && s[axisId] > 0);
  const hasCounts = (s.answeredCount ?? 0) + (s.skippedCount ?? 0) > 0;
  return hasAxisScore || hasCounts;
});

const scores = computed<P1PanoramaScores>(() => {
  return (
    panoramaScores.value ?? {
      human: 0,
      movement: 0,
      decisions: 0,
      structure: 0,
      answeredCount: 0,
      skippedCount: 0
    }
  );
});
const axesMeta = p1PanoramaAxesMeta;
const completedBlocks = computed(() => storage.meta.value?.completedBlocks ?? []);

const { buildNarrative } = useP1PanoramaNarrative();
const narrativeRaw = computed(() => buildNarrative(panoramaScores.value, completedBlocks.value));
const narrative = computed(() =>
  narrativeRaw.value.suggestions.map((suggestion) => {
    const blockId = suggestion.blockId as P1BlockId;
    return {
      ...suggestion,
      blockId,
      title: p1BlockContent[blockId]?.title ?? blockId,
      questionStep: `${blockId.toUpperCase()}_questions`
    };
  })
);

const blockStates = computed(() =>
  P1_BLOCK_IDS.map((id) => {
    const completed = completedBlocks.value.includes(id);
    const hasScores = Boolean(storage.scores.value?.blocks?.[id]);
    const statusLabel = completed ? 'Terminé' : hasScores ? 'En cours' : 'Non commencé';
    return {
      id,
      title: p1BlockContent[id]?.title ?? id,
      statusLabel,
      hasScores,
      questionStep: `${id.toUpperCase()}_questions`,
      bilanStep: `${id.toUpperCase()}_bilan`
    };
  })
);

const canAccessGlobalBilan = computed(() => hasP1GlobalBilanAccess(storage.meta.value, storage.scores.value));
const bucketCopy: Record<Bucket, { tone: string; emoji: string }> = {
  low: { tone: 'plutôt posé', emoji: '🌤️' },
  medium: { tone: 'quelques frottements', emoji: '🌥️' },
  high: { tone: 'sous tension', emoji: '⚡' }
};
const axisIcons: Record<AxisId, string> = {
  human: '👥',
  movement: '🌀',
  decisions: '🧭',
  structure: '🏗️'
};

const getBucket = (score: number | null | undefined): Bucket => {
  if (score == null) return 'low';
  if (score < 2) return 'low';
  if (score < 3.5) return 'medium';
  return 'high';
};

const summaryCards = computed(() =>
  axisOrder.map((axisId: AxisId, index) => ({
    axisId,
    label: axesMeta[axisId].shortLabel,
    text: narrativeRaw.value.summaryBlocks[index]?.text ?? ''
  }))
);

const interpretationCards = computed(() =>
  axisOrder.map((axisId: AxisId, index) => ({
    axisId,
    label: axesMeta[axisId].shortLabel,
    title: axesMeta[axisId].label,
    text: narrativeRaw.value.interpretationBlocks[index]?.text ?? ''
  }))
);

const panoramaIntroParagraphs = computed(() => p1EngagementCopy.panoramaE2.intro.split('\n\n').filter(Boolean));
const n1BlockParagraphs = computed(() => p1EngagementCopy.panoramaE2.n1Block.split('\n\n').filter(Boolean));
const n2BlockParagraphs = computed(() => p1EngagementCopy.panoramaE2.n2Block.split('\n\n').filter(Boolean));

const copy = computed(() => ({
  ...p1Copy.hub,
  panoramaSummaryTitle: p1Copy.panorama?.bilan?.summaryTitle ?? 'Ce que tu viens de poser',
  panoramaSummarySubtitle: p1Copy.panorama?.bilan?.summarySubtitle ?? '',
  panoramaInterpretationTitle: p1Copy.panorama?.bilan?.interpretationTitle ?? 'Ce qu’on peut en comprendre',
  panoramaInterpretationSubtitle: p1Copy.panorama?.bilan?.interpretationSubtitle ?? '',
  panoramaNextStepsTitle: p1Copy.panorama?.bilan?.nextStepsTitle ?? 'Ce qu’on te propose d’explorer maintenant',
  panoramaNextStepsSubtitle: p1Copy.panorama?.bilan?.nextStepsSubtitle ?? '',
  panoramaSovereigntyReminder: p1Copy.panorama?.bilan?.sovereigntyReminder ?? ''
}));

const buildAxisSuggestion = (axisId: AxisId) => {
  const suggestionConfig = p1PanoramaSuggestions[axisId];
  if (!suggestionConfig) return null;
  const score = scores.value[axisId] ?? 0;
  const bucket = getBucket(score);
  const reasonKey = suggestionConfig.reasonKeyByIntensity?.[
    bucket as keyof typeof suggestionConfig.reasonKeyByIntensity
  ];
  if (!reasonKey) return null;
  const blockId = suggestionConfig.mainBlockId as P1BlockId;
  const blockState = blockStates.value.find((b) => b.id === blockId);
  return {
    id: blockId,
    title: p1BlockContent[blockId]?.title ?? blockId,
    note: p1PanoramaText[reasonKey] ?? reasonKey,
    step: blockState?.questionStep,
    bilanStep: blockState?.bilanStep,
    hasBilan: Boolean(blockState?.bilanStep)
  };
};

const axes = computed(() =>
  axisOrder.map((axisId: AxisId, index) => {
    const bucket = getBucket(scores.value[axisId]);
    const badge = {
      score: scores.value[axisId],
      tone: bucketCopy[bucket].tone,
      emoji: bucketCopy[bucket].emoji
    };
    const summary = summaryCards.value[index]?.text ?? '';
    const interpretation = interpretationCards.value[index]?.text ?? '';
    return {
      id: `p1-axis-${axisId}`,
      key: axisId,
      label: axesMeta[axisId].label,
      labelShort: axesMeta[axisId].shortLabel,
      icon: axisIcons[axisId],
      score: badge.score,
      tone: badge.tone,
      toneEmoji: badge.emoji,
      tensionText: summary,
      interpretationText: interpretation,
      suggestedBlock: buildAxisSuggestion(axisId)
    };
  })
);

const axisSectionRefs = ref<Record<string, HTMLElement | null>>({});
const activeAxisId = ref<string | null>(null);
let observer: IntersectionObserver | null = null;

const setAxisRef = (axisId: string, el: HTMLElement | null) => {
  axisSectionRefs.value[axisId] = el;
};

const scrollToAxis = (axisId: string) => {
  if (typeof window === 'undefined') return;
  const SCROLL_OFFSET = 104;
  const target = axisSectionRefs.value[axisId];
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const scrollTop = window.scrollY + rect.top - SCROLL_OFFSET;
  window.scrollTo({ top: scrollTop, behavior: 'smooth' });
};

onMounted(() => {
  try {
    storage.loadFromStorage();
  } catch {
    // Ignore storage read errors; runtime scores will still be used if present.
  }

  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const match = Object.entries(axisSectionRefs.value).find(([, el]) => el === visible.target);
      if (match) activeAxisId.value = match[0];
    },
    { root: null, threshold: 0.4 }
  );

  Object.values(axisSectionRefs.value).forEach((section) => {
    if (section) observer?.observe(section);
  });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

const handleGoToGlobal = () => {
  if (props.goToGlobalBilan) {
    props.goToGlobalBilan();
    return;
  }
  props.goToStep('E_global_bilan');
};
</script>
