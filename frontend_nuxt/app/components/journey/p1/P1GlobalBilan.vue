<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-5" role="region" aria-labelledby="journey-step-heading-E_global_bilan">
      <JourneyStepHeader
        :title="copy.title"
        :subtitle="copy.subtitle"
        heading-id="journey-step-heading-E_global_bilan"
      />
      <section class="pp-journey-section space-y-2" aria-labelledby="panorama-global">
        <h2 id="panorama-global" class="pp-journey-title text-lg">{{ copy.panoramaHeading }}</h2>
        <ul class="pp-journey-body list-disc list-inside space-y-1">
          <li v-for="axisId in axisOrder" :key="axisId">
            {{ axesMeta[axisId].shortLabel }} : {{ scores.panorama?.[axisId] ?? 0 }}
          </li>
        </ul>
        <p class="pp-journey-meta text-sm">
          Répondu : {{ scores.panorama?.answeredCount ?? 0 }} · Non répondu : {{ scores.panorama?.skippedCount ?? 0 }}
        </p>
      </section>

      <section class="pp-journey-section space-y-2" aria-labelledby="blocks-global">
        <h2 id="blocks-global" class="pp-journey-title text-lg">{{ copy.blocksHeading }}</h2>
        <ul class="pp-journey-body list-disc list-inside space-y-2">
          <li v-for="block in blockSummaries" :key="block.id">
            <span class="font-semibold">{{ block.title }}</span> — Répondu {{ block.answeredCount }}, non répondu {{ block.skippedCount }}, non vu {{ block.unseenCount }}
            <ul class="list-disc list-inside pl-4 text-sm text-[color:var(--color-text-muted)]">
              <li v-for="theme in block.themes" :key="theme.name">{{ theme.name }} : {{ theme.average }} ({{ theme.count }} items)</li>
            </ul>
          </li>
        </ul>
        <p class="pp-journey-meta text-sm">
          Blocs complétés : {{ completedBlocksLabel }}
        </p>
      </section>

      <section class="pp-journey-section space-y-2" aria-labelledby="export-section">
        <h2 id="export-section" class="pp-journey-title text-lg">{{ copy.exportHeading }}</h2>
        <textarea class="pp-journey-panel pp-journey-panel-alt w-full text-xs p-3 h-40" readonly>{{ exportText }}</textarea>
        <p class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">
          {{ copy.exportNotice }}
        </p>
        <p class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">{{ copy.sovereigntyNote }}</p>
        <div class="flex flex-wrap gap-3">
          <button type="button" class="pp-journey-cta-primary" @click="handleCopy">
            {{ copy.copyCta }}
          </button>
          <button type="button" class="pp-journey-cta-secondary" @click="handlePrint">{{ copy.printCta }}</button>
          <span v-if="copied" class="text-sm text-[color:var(--color-text-muted)]">Copié dans le presse-papier.</span>
        </div>
      </section>

      <div class="flex flex-wrap gap-3">
        <button type="button" class="pp-journey-cta-secondary" @click="goToStep('E2_panorama_bilan')">
          {{ copy.backToHub }}
        </button>
        <button type="button" class="pp-journey-cta-secondary" @click="handleClear">
          {{ P1_ERASE_COPY.buttonLabel }}
        </button>
      </div>
      <p v-if="globalSkipSummary.text" class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">
        {{ globalSkipSummary.text }}
      </p>
      <p v-if="hasGlobalMissing" class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">
        {{ P1_MISSING_COPY.info }}
      </p>
      <p v-if="clearMessage" class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">
        {{ clearMessage }}
      </p>
      <section v-if="hasActions" class="mt-8 border-t border-neutral-800 pt-6 space-y-4">
        <header class="space-y-2">
          <h2 class="text-lg font-semibold">
            {{ P1_ACTION_SECTION_COPY.title }}
          </h2>
          <p class="text-sm text-neutral-300">
            {{ P1_ACTION_SECTION_COPY.intro }}
          </p>
          <p
            v-if="isHighRiskContext"
            class="text-xs text-amber-300"
          >
            {{ P1_ACTION_SAFETY_COPY.highRiskContext }}
          </p>
        </header>

        <div v-if="actionsByHorizon.now.length" class="space-y-2">
          <h3 class="text-base font-semibold">
            {{ P1_ACTION_HORIZON_COPY.nowTitle }}
          </h3>
          <p class="text-xs text-neutral-400">
            {{ P1_ACTION_HORIZON_COPY.nowHelper }}
          </p>
          <ul class="space-y-2">
            <li
              v-for="action in actionsByHorizon.now"
              :key="action.id"
              class="text-sm border border-neutral-800 rounded-md p-3 space-y-1"
            >
              <p class="font-medium">
                {{ action.label }}
              </p>
              <p class="text-neutral-300">
                {{ action.description }}
              </p>
              <p class="text-xs text-neutral-400">
                {{ P1_ACTION_MODE_TAGS[action.mode] }} · effort : {{ action.effort }} / 3
              </p>
              <p
                v-if="action.safetyNote"
                class="text-xs text-amber-300"
              >
                ⚠️ {{ action.safetyNote }}
              </p>
            </li>
          </ul>
        </div>

        <div v-if="actionsByHorizon.soon.length" class="space-y-2">
          <h3 class="text-base font-semibold">
            {{ P1_ACTION_HORIZON_COPY.soonTitle }}
          </h3>
          <p class="text-xs text-neutral-400">
            {{ P1_ACTION_HORIZON_COPY.soonHelper }}
          </p>
          <ul class="space-y-2">
            <li
              v-for="action in actionsByHorizon.soon"
              :key="action.id"
              class="text-sm border border-neutral-800 rounded-md p-3 space-y-1"
            >
              <p class="font-medium">
                {{ action.label }}
              </p>
              <p class="text-neutral-300">
                {{ action.description }}
              </p>
              <p class="text-xs text-neutral-400">
                {{ P1_ACTION_MODE_TAGS[action.mode] }} · effort : {{ action.effort }} / 3
              </p>
              <p
                v-if="action.safetyNote"
                class="text-xs text-amber-300"
              >
                ⚠️ {{ action.safetyNote }}
              </p>
            </li>
          </ul>
        </div>

        <div v-if="actionsByHorizon.later.length" class="space-y-2">
          <h3 class="text-base font-semibold">
            {{ P1_ACTION_HORIZON_COPY.laterTitle }}
          </h3>
          <p class="text-xs text-neutral-400">
            {{ P1_ACTION_HORIZON_COPY.laterHelper }}
          </p>
          <ul class="space-y-2">
            <li
              v-for="action in actionsByHorizon.later"
              :key="action.id"
              class="text-sm border border-neutral-800 rounded-md p-3 space-y-1"
            >
              <p class="font-medium">
                {{ action.label }}
              </p>
              <p class="text-neutral-300">
                {{ action.description }}
              </p>
              <p class="text-xs text-neutral-400">
                {{ P1_ACTION_MODE_TAGS[action.mode] }} · effort : {{ action.effort }} / 3
              </p>
              <p
                v-if="action.safetyNote"
                class="text-xs text-amber-300"
              >
                ⚠️ {{ action.safetyNote }}
              </p>
            </li>
          </ul>
        </div>

        <div class="pt-4 flex flex-col gap-2">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium border border-neutral-700 hover:border-neutral-500"
            @click="onExportMarkdown"
          >
            {{ P1_ACTION_SECTION_COPY.exportLabel }}
          </button>
          <p class="text-xs text-neutral-400">
            {{ P1_ACTION_SECTION_COPY.exportHelper }}
          </p>
          <p class="mt-2 text-xs text-neutral-400">
            {{ P1_ACTION_SAFETY_COPY.genericReminder }}
          </p>
        </div>
      </section>

      <section v-else class="mt-8 border-t border-neutral-800 pt-6">
        <h2 class="text-base font-semibold">
          {{ P1_ACTION_SECTION_COPY.emptyTitle }}
        </h2>
        <p class="mt-2 text-sm text-neutral-300">
          {{ P1_ACTION_SECTION_COPY.emptyBody }}
        </p>
      </section>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { useP1Export } from '~/composables/useP1Export';
import { useJourneyDiagnostics } from '~/composables/useJourneyDiagnostics';
import type { P1BlockScores, P1BlockBands, P1TensionBand } from '~/composables/useJourneyDiagnostics';
import { useP1ActionPlan } from '@/composables/useP1ActionPlan';
import { P1_BLOCK_IDS, p1AxesMeta, p1BlockContent, p1BlockThemes, p1Copy } from '~/config/journeys/p1QuestionsConfig';
import {
  P1_ERASE_COPY,
  P1_GLOBAL_SKIP_SUMMARY,
  P1_MISSING_COPY
} from '@/config/journeys/p1CopyV1_3';
import { P1_ACTION_SECTION_COPY, P1_ACTION_HORIZON_COPY, P1_ACTION_MODE_TAGS, P1_ACTION_SAFETY_COPY } from '@/config/journeys/p1ActionCopyV1_0';

const props = defineProps<{
  goToStep: (stepId: string) => void;
}>();

const storage = useDiagnosticStorage({ journeyId: 'p1' });
const scores = computed(() => storage.scores.value ?? {});
const { buildExportText } = useP1Export();
const exportText = computed(() => buildExportText());
const copied = ref(false);
const clearMessage = ref('');
const copy = computed(() => p1Copy.global);
const axesMeta = p1AxesMeta;
const axisOrder = ['human', 'governance', 'organization', 'resources'] as const;
const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', blockThemeMap: p1BlockThemes });
const computeBlockAverage = (block?: P1BlockScores | null) => {
  if (!block) return null;
  const totals = Object.values(block.themes ?? {}).reduce(
    (acc, theme) => {
      acc.total += (theme.average ?? 0) * (theme.count ?? 0);
      acc.count += theme.count ?? 0;
      return acc;
    },
    { total: 0, count: 0 }
  );
  if (!totals.count) return null;
  return totals.total / totals.count;
};
const mapAverageToBand = (avg: number | null): P1TensionBand | undefined => {
  if (avg === null) return undefined;
  const tensionScore = Math.min(4, Math.max(0, avg - 1));
  const rounded = Math.round(tensionScore);
  if (rounded <= 1) return 'low';
  if (rounded === 2) return 'medium';
  if (rounded === 3) return 'high';
  return 'very_high';
};
const blockBands = computed<P1BlockBands>(() => {
  const blocks = scores.value.blocks ?? {};
  const bandsFromStorage: P1BlockBands = {
    B1: mapAverageToBand(computeBlockAverage(blocks.b1)),
    B3: mapAverageToBand(computeBlockAverage(blocks.b3))
  };
  const runtimeBands = diagnostics.getP1BlockBands();
  return {
    B1: bandsFromStorage.B1 ?? runtimeBands.B1,
    B3: bandsFromStorage.B3 ?? runtimeBands.B3
  };
});
const isHighRiskContext = computed(() => blockBands.value.B1 === 'very_high' || blockBands.value.B3 === 'very_high');
const actionPlan = computed(() => useP1ActionPlan(blockBands.value));
const plan = computed(() => actionPlan.value.plan.value);
const actionsByHorizon = computed(() => actionPlan.value.actionsByHorizon.value);
const hasActions = computed(() => actionPlan.value.hasActions.value);
const toMarkdown = () => actionPlan.value.toMarkdown();

const blockSummaries = computed(() =>
  P1_BLOCK_IDS.filter((id) => scores.value.blocks?.[id]).map((id) => {
    const data = scores.value.blocks?.[id];
    const themes = Object.entries(data?.themes ?? {}).map(([name, stats]) => ({
      name,
      average: stats.average,
      count: stats.count
    }));
    return {
      id,
      title: p1BlockContent[id]?.title ?? id,
      answeredCount: data?.answeredCount ?? 0,
      skippedCount: data?.skippedCount ?? 0,
      unseenCount: data?.unseenCount ?? 0,
      themes
    };
  })
);

const completedBlocksLabel = computed(() => {
  const list = storage.meta.value?.completedBlocks ?? [];
  return list.length ? list.join(', ') : 'aucun';
});

const blocksList = computed(() => Object.values(scores.value.blocks ?? {}));

const globalSkipSummary = computed(() => {
  const panorama = scores.value.panorama ?? ({} as any);
  const skipped =
    (panorama.skippedCount ?? 0) +
    blocksList.value.reduce((acc, b) => acc + (b?.skippedCount ?? 0), 0);

  if (skipped <= 0) {
    return { ratio: 0, text: '', missing: 0 };
  }

  const answered =
    (panorama.answeredCount ?? 0) +
    blocksList.value.reduce((acc, b) => acc + (b?.answeredCount ?? 0), 0);
  const missing = blocksList.value.reduce((acc, b) => acc + ((b as any)?.missingCount ?? 0), 0);
  const total = answered + skipped + missing;
  const ratio = total > 0 ? skipped / total : 0;
  const text = ratio >= 0.3 ? P1_GLOBAL_SKIP_SUMMARY.manySkips : P1_GLOBAL_SKIP_SUMMARY.fewSkips;
  return { ratio, text, missing };
});

const hasGlobalSkips = computed(() => globalSkipSummary.value.ratio > 0);

const globalMissing = computed(() => {
  const panorama = scores.value.panorama ?? ({} as any);
  const byAxis = panorama?.byAxis as any | undefined;
  const panoramaMissing = byAxis
    ? (byAxis.human?.missingCount ?? 0) +
      (byAxis.governance?.missingCount ?? 0) +
      (byAxis.organization?.missingCount ?? 0) +
      (byAxis.resources?.missingCount ?? 0)
    : 0;
  const blocksMissing = blocksList.value.reduce((acc, b) => acc + ((b as any)?.missingCount ?? 0), 0);
  return panoramaMissing + blocksMissing;
});

const hasGlobalMissing = computed(() => globalMissing.value > 0);

const handleClear = () => {
  if (typeof window !== 'undefined') {
    const confirmed = window.confirm(`${P1_ERASE_COPY.confirmTitle}\n\n${P1_ERASE_COPY.confirmBody}`);
    if (!confirmed) return;
  }
  storage.clearAll();
  clearMessage.value = P1_ERASE_COPY.done;
  props.goToStep('E0_intro');
};

const handlePrint = () => {
  if (typeof window !== 'undefined') {
    window.print();
  }
};

const handleCopy = async () => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(exportText.value);
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000);
    }
  } catch {
    copied.value = false;
  }
};

const onExportMarkdown = () => {
  const markdown = toMarkdown();
  if (!markdown) return;

  if (process.client && navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(markdown).catch(() => {});
  }
};
</script>
