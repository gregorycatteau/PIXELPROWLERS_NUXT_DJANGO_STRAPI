<template>
  <JourneyLayout>
    <div
      class="pp-globalbilan-page"
      role="region"
      aria-labelledby="journey-step-heading-E_global_bilan"
    >
      <div
        v-if="engineState !== 'ready' && engineState !== 'partial_vm'"
        class="space-y-3 pt-4"
      >
        <p class="text-sm text-[color:var(--color-text-muted)]">
          <span v-if="engineState === 'missing_adapter'">{{
            BILAN_ENGINE_COPY.missingAdapter.message
          }}</span>
          <span v-else-if="engineState === 'empty_vm'">{{
            BILAN_ENGINE_COPY.emptyVm.message
          }}</span>
        </p>
        <button
          type="button"
          class="pp-journey-cta-secondary text-xs"
          @click="goToStep('E2_panorama_bilan')"
        >
          {{ BILAN_ENGINE_COPY.missingAdapter.cta }}
        </button>
      </div>
      <template v-else>
        <div
          v-if="engineState === 'partial_vm'"
          class="space-y-2 pt-4"
        >
          <p class="text-sm text-[color:var(--color-text-muted)]">
            {{ BILAN_ENGINE_COPY.partialVm.message }}
          </p>
        </div>
        <section class="pp-globalbilan-header">
          <JourneyStepHeader
            :title="vm.copy.title"
            :subtitle="vm.copy.subtitle"
            heading-id="journey-step-heading-E_global_bilan"
          />
          <div class="pp-globalbilan-summary-chips">
            <PPBadge
              v-for="chip in axisSummary"
              :key="chip.id"
              as="div"
              variant="neutral"
              size="sm"
            >
              <span
                class="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]"
                >{{ chip.label }}</span
              >
              <span class="text-sm font-semibold">{{ chip.value }}</span>
            </PPBadge>
            <PPBadge as="div" variant="neutral" size="sm">
              <span
                class="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]"
                >Blocs</span
              >
              <span class="text-sm font-semibold">{{
                vm.completedBlocksLabel
              }}</span>
            </PPBadge>
            <PPBadge v-if="maturityLabel" as="div" variant="neutral" size="sm">
              <span
                class="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]"
                >Maturité</span
              >
              <span class="text-sm font-semibold">{{
                BILAN_ENGINE_COPY.maturityLabel[maturityLabel]
              }}</span>
            </PPBadge>
          </div>
        </section>

        <section
          v-if="skipSignal && skipSignal.globalSkippedCount > 0"
          class="space-y-4 pt-8 border-t border-slate-800/60"
        >
          <PPCard as="div" variant="soft" class="space-y-2">
            <p
              class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
            >
              {{ skipSignalCopy.globalNotice }}
            </p>
            <p
              class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
            >
              {{ skipSignalCopy.optionalDetail }}
            </p>
            <ul
              v-if="skipAxisSignals.length"
              class="space-y-1 text-xs text-[color:var(--color-text-muted)]"
            >
              <li v-for="axis in skipAxisSignals" :key="axis.axisId">
                Axe {{ axisLabelById[axis.axisId] || axis.axisId }} :
                {{ axis.skippedCount }} / {{ axis.totalCount }}
                questions laissees de cote.
              </li>
            </ul>
          </PPCard>
        </section>

        <PPBilanShell
          density="default"
          align="center"
          :with-aside="true"
          aria-labelledby="journey-step-heading-E_global_bilan"
        >
          <template #aside>
            <P1GlobalBilanAside
              :sections="vm.summaryNav"
              :axis-summary-label="vm.axisSummaryLabel"
              :blocks-completed-label="vm.completedBlocksLabel"
              :panorama-answered-label="vm.panoramaAnsweredLabel"
              variant="desktop"
              @navigate="scrollToSection"
              @go-hub="goToStep('E2_panorama_bilan')"
              @go-export="scrollToSection('gb_export')"
              @clear="handleClear"
            />
          </template>
            <PPBilanSection id-base="reperes" title="Repères (version publique)" density="compact">

              <PPCard as="div" variant="accent" class="space-y-5 max-w-3xl mx-auto">
                <div class="space-y-2 text-left">
                  <p
                    class="text-sm uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]"
                  >
                    COMMENT LIRE CE BILAN
                  </p>
                  <p
                    class="text-base font-semibold text-[color:var(--color-text)] leading-relaxed"
                  >
                    1/ Commence par lire ci dessous les repères que tu as posés.
                  </p>
                  <ul
                    class="space-y-1 text-sm text-[color:var(--color-text)] leading-relaxed"
                  >
                    <li>
                      2) Dans la section Panorama: Tu pourras explorer les 4
                      axes de l'analyse.
                    </li>
                    <li>
                      3) Ensuite regarde Ce qui pèse le plus : tes signaux
                      prioritaires.
                    </li>
                    <li>
                      4) Puis explore Hypothèses / Atterrissage / Ressources
                      selon ton besoin.
                    </li>
                  </ul>
                  <p class="text-xs text-[color:var(--color-text-muted)]">
                    Utilise le sommaire à droite pour naviguer.
                  </p>
                </div>

                <div class="space-y-3 text-center">
                  <button
                    type="button"
                    class="pp-journey-cta-primary w-fit text-sm mx-auto"
                    :aria-expanded="repereOpen"
                    aria-controls="gb-reperes-content"
                    @click="repereOpen = !repereOpen"
                  >
                    {{
                      repereOpen
                        ? "Masquer les repères"
                        : "Lire les repères (10s)"
                    }}
                  </button>

                  <div class="space-y-2">
                    <p
                      class="text-sm font-semibold text-[color:var(--color-text)]"
                    >
                      Raccourcis (optionnel)
                    </p>
                    <div class="pp-globalbilan-reperes-ctas justify-center">
                      <button
                        type="button"
                        class="pp-btn-ghost text-xs"
                        @click="scrollToSection('gb_panorama')"
                      >
                        Panorama
                      </button>
                      <button
                        v-if="hasHeavy"
                        type="button"
                        class="pp-btn-ghost text-xs"
                        @click="scrollToSection('tensions_poids')"
                      >
                        Ce qui pèse le plus
                      </button>
                      <button
                        v-if="modules.resources?.length"
                        type="button"
                        class="pp-btn-ghost text-xs"
                        @click="scrollToSection('gb_ressources')"
                      >
                        Ressources
                      </button>
                    </div>
                  </div>

                  <div
                    v-if="hasSupports || hasWatch || hasHeavy"
                    class="space-y-2"
                  >
                    <p
                      class="text-sm font-semibold text-[color:var(--color-text)]"
                    >
                      Ce que tu vas trouver
                    </p>
                    <div class="pp-globalbilan-reperes-pills justify-center">
                      <PPChip
                        v-if="hasSupports"
                        variant="accent"
                        size="sm"
                        :selected="false"
                        @click="scrollToSection('supports_anchor')"
                      >
                        ✅ Soutiens / appuis
                      </PPChip>
                      <PPChip
                        v-if="hasWatch"
                        variant="accent"
                        size="sm"
                        :selected="false"
                        @click="scrollToSection('tensions_autres')"
                      >
                        ⚠️ Points à surveiller
                      </PPChip>
                      <PPChip
                        v-if="hasHeavy"
                        variant="accent"
                        size="sm"
                        :selected="false"
                        @click="scrollToSection('tensions_poids')"
                      >
                        🔥 Ce qui pèse le plus
                      </PPChip>
                    </div>
                  </div>
                </div>

                <div
                  v-show="repereOpen"
                  id="gb-reperes-content"
                  class="space-y-4 max-w-prose transition-all mx-auto text-left"
                >
                  <div class="space-y-2">
                    <p
                      v-for="paragraph in engagementIntroParagraphs"
                      :key="paragraph"
                      class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                    >
                      {{ paragraph }}
                    </p>
                  </div>
                </div>
              </PPCard>
            </PPBilanSection>

            <BilanPanoramaCard
              :answered-count="vm.panorama.answeredCount"
              :skipped-count="vm.panorama.skippedCount"
              :completeness-label="vm.panorama.completenessLabel"
              :axes="panoramaAxes"
            >
              <BilanBlocksSummary
                :heading="vm.blocksSummaryHeading"
                :completed-label="vm.completedBlocksLabel"
                :blocks="blocksForCard"
                @open="toggleBlockDetails($event, true)"
                @toggle="onBlockDetailsToggle($event.id, $event.event)"
              />
            </BilanPanoramaCard>

            <BilanIssuesList
              v-if="modules.issues"
              id="gb_tensions"
              :title="modules.issues?.title || ''"
              :intro="modules.issues?.intro || ''"
              :issues="issuesForCard"
              :watchlist="watchlistForCard"
              :focus-details="focusDetails"
              :empty-text="modules.issues?.emptyText || ''"
              @set-all="setAllIssuesExpanded"
              @toggle="toggleIssue"
              @go-resources="scrollToSection('gb_ressources')"
              @go-hypotheses="scrollToSection('gb_hypotheses')"
            />

            <PPBilanSection
              v-if="modules.supports?.main && modules.supports.main.length"
              id-base="supports"
              :title="modules.supports.copy.mainTitle"
              :description="modules.supports.copy.intro"
              density="default"
            >
              <div class="pp-globalbilan-theme-grid" id="supports_anchor">
                <PPCard
                  v-for="support in modules.supports.main"
                  :key="support.id"
                  as="article"
                  variant="default"
                  class="space-y-2"
                >
                  <h3 class="text-base font-semibold">
                    {{ support.label }}
                  </h3>
                  <p
                    class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                  >
                    {{ support.summary }}
                  </p>
                  <p
                    class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                  >
                    {{ support.interpretation }}
                  </p>
                </PPCard>
              </div>
            </PPBilanSection>

            <BilanHypothesesSection
              v-if="modules.hypotheses"
              id="gb_hypotheses"
              :hypotheses="hypothesesForCard"
              :secondary-hypotheses="secondaryHypothesesForCard"
              :selection-count="selectionCountLabel"
              :verification-plans="verificationPlansForCard"
              @toggle="toggleHypothesis"
              @toggle-details="toggleHypothesisDetails"
              @go-atterrissage="goToAtterrissage"
            />

            <BilanLandingPanel
              v-if="modules.landing"
              id="gb_atterrissage"
              :plans="landingPlansForPanel"
              :highlight="highlightTarget === 'p1-atterrissage'"
              @toggle-done="toggleLandingDone"
              @go-resources="scrollToSection('gb_ressources')"
              @back-to-hypotheses="scrollToSection('gb_hypotheses')"
            >
              <P1SystemicLandingSection
                :main-cards="mainCards"
                :secondary-cards="secondaryCards"
                :followup-packs="systemicFollowupPacks"
                :answers="systemicFollowupAnswers"
                :statuses="systemicFollowupStatuses"
                :persisted-statuses="systemicPersistedStatuses"
                @answer="onSystemicAnswer"
                @skip-card="onSystemicSkip"
                @persist="persistSystemic"
                @reset-card="onSystemicReset"
              />
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="pp-btn-ghost text-xs"
                  @click="finalizeSystemicFollowups"
                >
                  Marquer ces vérifs comme faites
                </button>
              </div>
            </BilanLandingPanel>

            <PPBilanSection
              v-if="actionsPanelEnabled"
              id-base="actions_panel"
              title="Actions prioritaires"
              description="Des actions concretes pour avancer, issues de ton bilan."
              density="default"
            >
              <PPActionsPanel :actions="actionsPanelItems" />
            </PPBilanSection>

            <PPBilanSection
              v-if="modules.actions"
              id-base="actions"
              :title="modules.actions?.copy.sectionTitle"
              :description="modules.actions?.copy.intro"
              density="default"
            >
              <div class="space-y-4">
                <div class="flex flex-wrap gap-2">
                  <PPChip
                    variant="outline"
                    size="sm"
                    :selected="!focusDetails"
                    @click="focusDetails = false"
                  >
                    Mode focus
                  </PPChip>
                  <PPChip
                    variant="outline"
                    size="sm"
                    :selected="focusDetails"
                    @click="focusDetails = true"
                  >
                    Mode détails
                  </PPChip>
                </div>
              </div>

              <div
                v-if="modules.actions?.hasAnyAction"
                class="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
              >
                <PPCard
                  v-for="(actionList, horizonKey) in modules.actions
                    ?.filteredActionsByHorizon"
                  :key="horizonKey"
                  as="div"
                  variant="default"
                  class="space-y-3"
                >
                  <h3 class="text-base font-semibold">
                    {{
                      modules.actions?.copy.horizonLabels[
                        horizonKey as keyof typeof modules.actions.copy.horizonLabels
                      ] || horizonKey
                    }}
                  </h3>
                  <ul class="space-y-3">
                    <li
                      v-for="action in actionList"
                      :key="action.id"
                      class="space-y-2 border-t border-[color:var(--color-stroke)] pt-2 first:border-0 first:pt-0"
                    >
                      <p class="text-sm font-semibold">
                        {{ action.label }}
                      </p>
                      <p
                        class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                      >
                        {{ action.description }}
                      </p>
                      <p
                        v-if="action.safetyNote"
                        class="text-xs text-amber-300"
                      >
                        {{ action.safetyNote }}
                      </p>
                    </li>
                  </ul>
                </PPCard>
              </div>
              <p v-else class="text-sm text-[color:var(--color-text-muted)]">
                {{ modules.actions?.copy.empty }}
              </p>

              <PPCard as="div" variant="default" class="space-y-3">
                <div class="space-y-1 rounded-md border border-neutral-800 p-3">
                  <p
                    class="text-xs font-semibold text-[color:var(--color-text)]"
                  >
                    {{ P1_EXPORT_COPY.helper }}
                  </p>
                  <div
                    class="flex flex-wrap gap-3 text-sm text-[color:var(--color-text)]"
                  >
                    <label class="flex items-center gap-2">
                      <input
                        v-model="exportMode"
                        type="radio"
                        value="minimal"
                        class="accent-[color:var(--color-primary)]"
                      />
                      {{ P1_EXPORT_COPY.modes.minimal }}
                    </label>
                    <label class="flex items-center gap-2">
                      <input
                        v-model="exportMode"
                        type="radio"
                        value="full"
                        class="accent-[color:var(--color-primary)]"
                      />
                      {{ P1_EXPORT_COPY.modes.full }}
                    </label>
                  </div>
                  <p class="text-[11px] text-[color:var(--color-text-muted)]">
                    {{ exportModeWarning }}
                  </p>
                </div>
                <button
                  type="button"
                  class="pp-journey-cta-primary"
                  @click="onExportMarkdown"
                >
                  {{ modules.actions?.copy.exportButtonLabel }}
                </button>
              </PPCard>
            </PPBilanSection>

            <GlobalBilanExportPanel
              :copy="vm.copy"
              :manifest="manifest"
              :vm="vm"
              :recommendations="recommendationsState"
              :focus-details="focusDetails"
              :erase-copy-label="P1_ERASE_COPY.buttonLabel"
              :copied="copied"
              :global-skip-text="vm.exportPanel.globalSkipText"
              :has-global-missing="vm.exportPanel.hasGlobalMissing"
              :missing-info="vm.exportPanel.missingInfo"
              :clear-message="clearMessage"
              @copy="handleCopy"
              @print="handlePrint"
              @back-to-hub="goToStep('E2_panorama_bilan')"
              @clear="handleClear"
            />

            <EngagementLevelsPanel
              v-if="modules.engagement?.levels?.length"
              :intro="modules.engagement?.intro"
              :levels="modules.engagement.levels"
              @go-export="scrollToSection('gb_export')"
            />
        </PPBilanShell>

        <div class="pp-globalbilan-aside--mobile lg:hidden">
          <PPCard as="details" variant="indicator">
            <summary
              class="text-sm font-semibold text-[color:var(--color-text)] cursor-pointer"
            >
              Sommaire & repères
            </summary>
            <div class="mt-3">
              <P1GlobalBilanAside
                :sections="vm.summaryNav"
                :axis-summary-label="vm.axisSummaryLabel"
                :blocks-completed-label="vm.completedBlocksLabel"
                :panorama-answered-label="vm.panoramaAnsweredLabel"
                variant="mobile"
                @navigate="scrollToSection"
                @go-hub="goToStep('E2_panorama_bilan')"
                @go-export="scrollToSection('gb_export')"
                @clear="handleClear"
              />
            </div>
          </PPCard>
        </div>
      </template>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import JourneyLayout from "~/components/journey/JourneyLayout.vue";
import JourneyStepHeader from "~/components/journey/JourneyStepHeader.vue";
import PPBilanShell from "~/components/PPBilanShell.vue";
import PPBilanSection from "~/components/PPBilanSection.vue";
import PPActionsPanel from "@/components/PPActionsPanel.vue";
import P1GlobalBilanAside from "@/components/journey/p1/P1GlobalBilanAside.vue";
import P1SystemicLandingSection from "@/components/journey/p1/P1SystemicLandingSection.vue";
import GlobalBilanExportPanel from "@/components/journey/bilan/GlobalBilanExportPanel.vue";
import BilanPanoramaCard from "@/components/journey/bilan/BilanPanoramaCard.vue";
import BilanBlocksSummary from "@/components/journey/bilan/BilanBlocksSummary.vue";
import BilanIssuesList from "@/components/journey/bilan/BilanIssuesList.vue";
import BilanHypothesesSection from "@/components/journey/bilan/BilanHypothesesSection.vue";
import BilanLandingPanel from "@/components/journey/bilan/BilanLandingPanel.vue";
import EngagementLevelsPanel from "@/components/journey/bilan/EngagementLevelsPanel.vue";
import { useBilanHypothesesState } from "@/composables/bilan/useBilanHypothesesState";
import { P1_EXPORT_COPY } from "@/config/journeys/p1ExportCopyV1_3";
import { P1_ERASE_COPY } from "@/config/journeys/p1CopyV1_3";
import { useDiagnosticStorage } from "~/composables/useDiagnosticStorage";
import { getBilanAdapter } from "@/adapters/bilan/registry";
import { useP1SystemicFollowups } from "@/composables/useP1SystemicFollowups";
import { useP1SystemicLanding } from "@/composables/useP1SystemicLanding";
import { P1_SYSTEMIC_FOLLOWUPS } from "@/config/journeys/p1SystemicFollowupsV1_3";
import type { UniversalBilanViewModel } from "@/types/bilan";
import { createEmptyUniversalBilanViewModel, withUniversalBilanDefaults } from "@/types/bilan";
import { BILAN_ENGINE_COPY } from "@/config/bilan/bilanEngineCopy";
import { BILAN_SKIP_SIGNAL_COPY } from "@/config/bilan/bilanSkipSignalCopy";
import { getManifestById } from "@/config/journeys/manifests/registry";
import { useUniversalRecommendationsState } from "@/composables/reco/useUniversalRecommendations";
import { buildUniversalBilanMarkdown } from "@/utils/export/buildUniversalBilanMarkdown";
import { buildActionsFromBilan } from "@/utils/actions/buildActionsFromBilan";

const props = defineProps<{
  journeyId: string;
  goToStep: (stepId: string) => void;
}>();

const adapter = getBilanAdapter(props.journeyId);
const manifest = computed(() => getManifestById(props.journeyId));
const emptyVm = createEmptyUniversalBilanViewModel();

const vm = computed<UniversalBilanViewModel>(() =>
  withUniversalBilanDefaults(adapter?.buildViewModel() ?? emptyVm)
);
const engineState = computed<
  "missing_adapter" | "empty_vm" | "partial_vm" | "ready"
>(() => {
  if (!adapter) return "missing_adapter";
  if (vm.value.meta?.isEmpty) return "empty_vm";
  if (vm.value.meta?.partial) return "partial_vm";
  return "ready";
});
const modules = computed(() => vm.value.modules ?? {});
const actionsPanelEnabled = computed(() =>
  Boolean(manifest.value?.modules?.recommendations)
);
const maturityLabel = computed(() =>
  vm.value.meta?.maturity && vm.value.meta.maturity !== "prod"
    ? vm.value.meta.maturity
    : null
);
const skipSignal = computed(() => modules.value.skipSignal);
const skipSignalCopy = computed(
  () => skipSignal.value?.copy ?? BILAN_SKIP_SIGNAL_COPY
);
const engagementIntroParagraphs = computed(() =>
  (modules.value.engagement?.intro ?? "").split(/\n\n+/).filter(Boolean)
);
const axisLabelById = computed<Record<string, string>>(() =>
  (vm.value?.panorama.axes ?? []).reduce<Record<string, string>>(
    (acc, axis) => {
      acc[axis.id] = axis.label;
      return acc;
    },
    {}
  )
);
const skipAxisSignals = computed(() =>
  (skipSignal.value?.byAxis ?? []).filter(
    (axis) => axis.show && axis.totalCount > 0
  )
);

const storage = useDiagnosticStorage({ journeyId: props.journeyId });
const recommendationsState = useUniversalRecommendationsState(
  () => vm.value,
  () => manifest.value
);
const actionsPanelItems = computed(() =>
  buildActionsFromBilan({
    vm: vm.value,
    recommendations: recommendationsState.value,
    manifest: manifest.value,
  })
);
const axisSummary = computed(
  () =>
    vm.value?.panorama.axes.map((axis) => ({
      id: axis.id,
      label: axis.label,
      value: axis.score,
    })) ?? []
);
const panoramaAxes = computed(() =>
  vm.value
    ? vm.value.panorama.axes.map((axis) => ({
        ...axis,
        emoji: axis.emoji ?? "",
        isPriority: axis.isPriority ?? false,
        priorityLabel: axis.priorityLabel ?? "",
        filledSegments: axis.filledSegments ?? 0,
      }))
    : []
);

const { mainCards, secondaryCards } = useP1SystemicLanding();
const systemicFollowups = useP1SystemicFollowups(() =>
  mainCards.value.map((c) => c.id)
);
const systemicFollowupPacks = computed(() => {
  const ids = new Set(mainCards.value.map((c) => c.id));
  return P1_SYSTEMIC_FOLLOWUPS.filter((p) => ids.has(p.cardId)).reduce<
    Record<string, (typeof P1_SYSTEMIC_FOLLOWUPS)[number]["questions"]>
  >((acc, pack) => {
    acc[pack.cardId] = pack.questions;
    return acc;
  }, {});
});
const systemicFollowupAnswers = computed(() => systemicFollowups.answers.value);
const systemicFollowupStatuses = computed(
  () => systemicFollowups.statuses.value
);
const systemicPersistedStatuses = computed(
  () => systemicFollowups.persistedStatuses.value
);
const onSystemicAnswer = (payload: {
  cardId: string;
  questionId: string;
  value: number | null;
}) => {
  systemicFollowups.setAnswer(
    payload.cardId,
    payload.questionId,
    payload.value
  );
};
const onSystemicSkip = (cardId: string) => {
  systemicFollowups.skipCard(cardId);
};
const onSystemicReset = (cardId: string) => {
  systemicFollowups.resetCard(cardId);
  systemicFollowups.clearPersistedStatus(cardId);
};
const persistSystemic = () => {
  systemicFollowups.persistStatuses();
};
const finalizeSystemicFollowups = () => {
  systemicFollowups.finalizeAndPersistStatuses();
};

const focusDetails = ref(modules.value.issues?.focusDetails ?? false);
const repereOpen = ref(false);
const exportMode = ref<"minimal" | "full">("minimal");

function scrollToSection(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const {
  selectedHypothesisIds,
  isHypothesisSelected,
  isHypothesisDisabled,
  toggleHypothesis,
  isHypothesisExpanded,
  toggleHypothesisDetails,
  isLandingDone,
  toggleLandingDone,
  highlightTarget,
  goToAtterrissage,
  selectionCountLabel,
} = useBilanHypothesesState({
  maxSelected: 2,
  scrollToSection,
});

const selectedHypotheses = computed(() =>
  (modules.value.hypotheses?.list ?? []).filter((h) =>
    selectedHypothesisIds.value.includes(h.id)
  )
);

const expandedIssueIds = ref<Set<string>>(new Set());
const isIssueExpanded = (issueId: string) =>
  expandedIssueIds.value.has(issueId);
const setAllIssuesExpanded = (expanded: boolean) => {
  const next = new Set<string>();
  if (expanded) {
    (modules.value.issues?.list ?? []).forEach((issue) => next.add(issue.id));
  }
  expandedIssueIds.value = next;
};
const toggleIssue = (issueId: string) => {
  const next = new Set(expandedIssueIds.value);
  if (next.has(issueId)) {
    next.delete(issueId);
  } else {
    next.add(issueId);
  }
  expandedIssueIds.value = next;
};

const issuesForCard = computed(
  () =>
    modules.value.issues?.list.map((issue) => ({
      ...issue,
      icon: issue.icon ?? "",
      expanded: isIssueExpanded(issue.id),
    })) ?? []
);
const watchlistForCard = computed(
  () =>
    modules.value.issues?.watchlist.map((issue) => ({
      ...issue,
      icon: issue.icon ?? "",
    })) ?? []
);

const blocksForCard = computed(
  () =>
    vm.value?.panorama.blocks.map((block) => ({
      ...block,
      detailsOpen: isBlockDetailsOpen(block.id),
      themes: block.themes ?? [],
    })) ?? []
);

const hypothesesForCard = computed(
  () =>
    modules.value.hypotheses?.list.map((hypo) => ({
      ...hypo,
      selected: isHypothesisSelected(hypo.id),
      disabled: isHypothesisDisabled(hypo.id),
      detailsOpen: isHypothesisExpanded(hypo.id),
    })) ?? []
);

const secondaryHypothesesForCard = computed(
  () => modules.value.hypotheses?.secondary ?? []
);

const verificationPlansForCard = computed(() =>
  selectedHypotheses.value.map((hypo) => ({
    id: hypo.id,
    title: hypo.title,
    steps:
      modules.value.hypotheses?.verificationPlans.find((p) => p.id === hypo.id)
        ?.steps ?? [],
  }))
);

const landingPlansForPanel = computed(() =>
  selectedHypotheses.value
    .map((hypo) => {
      const plan = modules.value.landing?.plans.find((p) => p.id === hypo.id);
      if (!plan) return null;
      return { ...plan, done: isLandingDone(hypo.id) };
    })
    .filter((plan): plan is NonNullable<typeof plan> => Boolean(plan))
);

const expandedBlockIds = ref<Set<string>>(new Set());
const isBlockDetailsOpen = (blockId: string) =>
  expandedBlockIds.value.has(blockId);
const onBlockDetailsToggle = (blockId: string, event: Event) => {
  const target = event.target as HTMLDetailsElement;
  toggleBlockDetails(blockId, target?.open);
};
const toggleBlockDetails = (blockId: string, force?: boolean) => {
  const next = new Set(expandedBlockIds.value);
  if (force === true) {
    next.add(blockId);
  } else if (force === false) {
    next.delete(blockId);
  } else if (next.has(blockId)) {
    next.delete(blockId);
  } else {
    next.add(blockId);
  }
  expandedBlockIds.value = next;
};

const hasHeavy = computed(() => (modules.value.issues?.list.length ?? 0) > 0);
const hasWatch = computed(
  () => (modules.value.issues?.watchlist.length ?? 0) > 0
);
const hasSupports = computed(
  () => (modules.value.supports?.main.length ?? 0) > 0
);

const exportText = computed(() =>
  buildUniversalBilanMarkdown({
    manifest: manifest.value,
    vm: vm.value,
    recommendations: recommendationsState.value,
  })
);
const copied = ref(false);
const clearMessage = ref("");
const exportModeWarning = computed(() =>
  exportMode.value === "minimal"
    ? P1_EXPORT_COPY.warningMinimal
    : P1_EXPORT_COPY.warningFull
);

const handleClear = () => {
  if (typeof window !== "undefined") {
    const confirmed = window.confirm(
      `${P1_ERASE_COPY.confirmTitle}\n\n${P1_ERASE_COPY.confirmBody}`
    );
    if (!confirmed) return;
  }
  storage.clearAll();
  clearMessage.value = P1_ERASE_COPY.done;
  props.goToStep("E0_intro");
};

const handlePrint = () => {
  if (typeof window !== "undefined") {
    window.print();
  }
};

const handleCopy = async () => {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(exportText.value);
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000);
    }
  } catch {
    copied.value = false;
  }
};

const onExportMarkdown = () => {
  if (typeof navigator !== "undefined" && "clipboard" in navigator) {
    (navigator as any).clipboard.writeText(exportText.value).catch(() => {});
  }
};
</script>
