<template>
  <JourneyLayout>
    <div class="pp-globalbilan-page" role="region" aria-labelledby="journey-step-heading-E_global_bilan">
      <section class="pp-globalbilan-header">
        <JourneyStepHeader
          :title="vm.copy.title"
          :subtitle="vm.copy.subtitle"
          heading-id="journey-step-heading-E_global_bilan"
        />
        <div class="pp-globalbilan-summary-chips">
          <div
            v-for="chip in axisSummary"
            :key="chip.id"
            class="pp-globalbilan-summary-chip"
          >
            <span class="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">{{ chip.label }}</span>
            <span class="text-sm font-semibold">{{ chip.value }}</span>
          </div>
          <div class="pp-globalbilan-summary-chip">
            <span class="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">Blocs</span>
            <span class="text-sm font-semibold">{{ vm.completedBlocksLabel }}</span>
          </div>
        </div>
      </section>

      <div class="pp-globalbilan-layout lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:items-start">
        <div class="space-y-12 min-w-0">
          <section id="gb_reperes" class="pp-globalbilan-section">
            <div class="pp-globalbilan-section-header">
              <h2 class="pp-globalbilan-section-title">
                Repères (version publique)
              </h2>
            </div>

            <div class="pp-globalbilan-card pp-globalbilan-card--primary space-y-5 max-w-3xl mx-auto">
              <div class="space-y-2 text-left">
                <p class="text-sm uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                  COMMENT LIRE CE BILAN
                </p>
                <p class="text-base font-semibold text-[color:var(--color-text)] leading-relaxed">
                  1/ Commence par lire ci dessous les repères que tu as posés.
                </p>
                <ul class="space-y-1 text-sm text-[color:var(--color-text)] leading-relaxed">
                  <li>2) Dans la section Panorama: Tu pourras explorer les 4 axes de l'analyse.</li>
                  <li>3) Ensuite regarde Ce qui pèse le plus : tes signaux prioritaires.</li>
                  <li>4) Puis explore Hypothèses / Atterrissage / Ressources selon ton besoin.</li>
                </ul>
                <p class="text-xs text-[color:var(--color-text-muted)]">Utilise le sommaire à droite pour naviguer.</p>
              </div>

              <div class="space-y-3 text-center">
                <button
                  type="button"
                  class="pp-journey-cta-primary w-fit text-sm mx-auto"
                  :aria-expanded="repereOpen"
                  aria-controls="gb-reperes-content"
                  @click="repereOpen = !repereOpen"
                >
                  {{ repereOpen ? 'Masquer les repères' : 'Lire les repères (10s)' }}
                </button>

                <div class="space-y-2">
                  <p class="text-sm font-semibold text-[color:var(--color-text)]">Raccourcis (optionnel)</p>
                  <div class="pp-globalbilan-reperes-ctas justify-center">
                    <button type="button" class="pp-btn-ghost text-xs" @click="scrollToSection('gb_panorama')">
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
                      v-if="vm.resources.length"
                      type="button"
                      class="pp-btn-ghost text-xs"
                      @click="scrollToSection('gb_ressources')"
                    >
                      Ressources
                    </button>
                  </div>
                </div>

                <div v-if="hasSupports || hasWatch || hasHeavy" class="space-y-2">
                  <p class="text-sm font-semibold text-[color:var(--color-text)]">Ce que tu vas trouver</p>
                  <div class="pp-globalbilan-reperes-pills justify-center">
                    <button
                      v-if="hasSupports"
                      type="button"
                      class="pp-globalbilan-reperes-pill"
                      @click="scrollToSection('supports_anchor')"
                    >
                      ✅ Soutiens / appuis
                    </button>
                    <button
                      v-if="hasWatch"
                      type="button"
                      class="pp-globalbilan-reperes-pill"
                      @click="scrollToSection('tensions_autres')"
                    >
                      ⚠️ Points à surveiller
                    </button>
                    <button
                      v-if="hasHeavy"
                      type="button"
                      class="pp-globalbilan-reperes-pill"
                      @click="scrollToSection('tensions_poids')"
                    >
                      🔥 Ce qui pèse le plus
                    </button>
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
                    v-for="paragraph in vm.engagement?.intro || []"
                    :key="paragraph"
                    class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                  >
                    {{ paragraph }}
                  </p>
                </div>
                <div class="space-y-2">
                  <p
                    v-for="paragraph in vm.engagement?.synthesis || []"
                    :key="paragraph"
                    class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </div>
            </div>
          </section>

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
            id="gb_tensions"
            :title="vm.issues.title"
            :intro="vm.issues.intro"
            :issues="issuesForCard"
            :watchlist="watchlistForCard"
            :focus-details="focusDetails"
            :empty-text="vm.issues.emptyText"
            @set-all="setAllIssuesExpanded"
            @toggle="toggleIssue"
            @go-resources="scrollToSection('gb_ressources')"
            @go-hypotheses="scrollToSection('gb_hypotheses')"
          />

          <section
            v-if="vm.supports.main && vm.supports.main.length"
            class="pp-globalbilan-section"
            aria-labelledby="p1-global-supports"
          >
            <div class="pp-globalbilan-section-header">
              <h2 id="p1-global-supports" class="pp-globalbilan-section-title">
                {{ vm.supports.copy.mainTitle }}
              </h2>
              <p class="text-sm text-[color:var(--color-text-muted)]">
                {{ vm.supports.copy.intro }}
              </p>
              <p class="text-xs text-[color:var(--color-text-muted)]">
                Ce sont des points d’appui. Les protéger aide souvent à stabiliser le reste.
              </p>
            </div>

            <div class="pp-globalbilan-theme-grid" id="supports_anchor">
              <article
                v-for="support in vm.supports.main"
                :key="support.id"
                class="pp-globalbilan-theme-card space-y-2"
              >
                <h3 class="text-base font-semibold">
                  {{ support.label }}
                </h3>
                <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
                  {{ support.summary }}
                </p>
                <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
                  {{ support.interpretation }}
                </p>
              </article>
            </div>
          </section>

          <BilanHypothesesSection
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
              <button type="button" class="pp-btn-ghost text-xs" @click="finalizeSystemicFollowups">
                Marquer ces vérifs comme faites
              </button>
            </div>
          </BilanLandingPanel>

          <section id="gb_ressources" class="pp-globalbilan-section space-y-3">
            <div class="pp-globalbilan-section-header">
              <h2 class="pp-globalbilan-section-title">
                Ressources à télécharger
              </h2>
              <p class="text-sm text-[color:var(--color-text-muted)]">
                Tu peux agir sans attendre : prends un kit et teste une première vérif.
              </p>
            </div>
            <ResourceList :resources="vm.resources" variant="compact" />
            <NuxtLink to="/ressources?focus=p1" class="pp-journey-cta-secondary inline-flex w-auto text-xs">
              Voir toutes les ressources
            </NuxtLink>
          </section>

          <section id="gb_actions" class="pp-globalbilan-section space-y-4">
            <div class="pp-globalbilan-section-header">
              <h2 class="pp-globalbilan-section-title">
                {{ vm.actions?.copy.sectionTitle }}
              </h2>
              <p class="text-sm text-[color:var(--color-text-muted)]">
                {{ vm.actions?.copy.intro }}
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="pp-globalbilan-summary-chip"
                  @click="focusDetails = false"
                >
                  Mode focus
                </button>
                <button
                  type="button"
                  class="pp-globalbilan-summary-chip"
                  @click="focusDetails = true"
                >
                  Mode détails
                </button>
              </div>
            </div>

            <div v-if="vm.actions?.hasAnyAction" class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="(actionList, horizonKey) in vm.actions?.filteredActionsByHorizon"
                :key="horizonKey"
                class="pp-globalbilan-card space-y-3"
              >
                <h3 class="text-base font-semibold">
                  {{
                    vm.actions?.copy.horizonLabels[
                      horizonKey as keyof typeof vm.actions.copy.horizonLabels
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
                    <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
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
              </div>
            </div>
            <p v-else class="text-sm text-[color:var(--color-text-muted)]">
              {{ vm.actions?.copy.empty }}
            </p>

            <div class="pp-globalbilan-card space-y-3">
              <div class="space-y-1 rounded-md border border-neutral-800 p-3">
                <p class="text-xs font-semibold text-[color:var(--color-text)]">
                  {{ P1_EXPORT_COPY.helper }}
                </p>
                <div class="flex flex-wrap gap-3 text-sm text-[color:var(--color-text)]">
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
                {{ vm.actions?.copy.exportButtonLabel }}
              </button>
            </div>
          </section>

          <GlobalBilanExportPanel
            :copy="vm.copy"
            :export-text="exportText"
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

          <section id="gb_options" class="pp-globalbilan-section">
            <div class="pp-globalbilan-section-header">
              <h2 class="pp-globalbilan-section-title">
                Ce que tu peux choisir maintenant
              </h2>
            </div>
            <div class="pp-globalbilan-options-grid">
              <article class="pp-globalbilan-option-card">
                <div class="space-y-2">
                  <p class="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                    Niveau 1 — Auto-défense solo
                  </p>
                  <p
                    v-for="paragraph in vm.engagement?.levelN1 || []"
                    :key="paragraph"
                    class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                  >
                    {{ paragraph }}
                  </p>
                </div>
                <span class="pp-globalbilan-summary-chip">Option possible</span>
              </article>
              <article class="pp-globalbilan-option-card">
                <div class="space-y-2">
                  <p class="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                    Niveau 2 — Miroir sécurisé
                  </p>
                  <p
                    v-for="paragraph in vm.engagement?.levelN2 || []"
                    :key="paragraph"
                    class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                  >
                    {{ paragraph }}
                  </p>
                </div>
                <span class="pp-globalbilan-summary-chip">Option possible</span>
              </article>
              <article class="pp-globalbilan-option-card">
                <div class="space-y-2">
                  <p class="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                    Niveau 3 — Atelier tactique
                  </p>
                  <p
                    v-for="paragraph in vm.engagement?.levelN3 || []"
                    :key="paragraph"
                    class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                  >
                    {{ paragraph }}
                  </p>
                </div>
                <span class="pp-globalbilan-summary-chip">Option possible</span>
              </article>
              <article class="pp-globalbilan-option-card">
                <div class="space-y-2">
                  <p class="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                    Niveau 4 — Re-architecture accompagnée
                  </p>
                  <p
                    v-for="paragraph in vm.engagement?.levelN4 || []"
                    :key="paragraph"
                    class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
                  >
                    {{ paragraph }}
                  </p>
                </div>
                <span class="pp-globalbilan-summary-chip">Option possible</span>
              </article>
            </div>
          </section>
        </div>
        <div class="pp-globalbilan-aside hidden lg:block lg:sticky lg:top-24">
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
        </div>
      </div>

      <div class="pp-globalbilan-aside--mobile lg:hidden">
        <details class="pp-globalbilan-aside-card">
          <summary class="text-sm font-semibold text-[color:var(--color-text)] cursor-pointer">
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
        </details>
      </div>
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import P1GlobalBilanAside from '@/components/journey/p1/P1GlobalBilanAside.vue';
import P1SystemicLandingSection from '@/components/journey/p1/P1SystemicLandingSection.vue';
import GlobalBilanExportPanel from '@/components/journey/bilan/GlobalBilanExportPanel.vue';
import BilanPanoramaCard from '@/components/journey/bilan/BilanPanoramaCard.vue';
import BilanBlocksSummary from '@/components/journey/bilan/BilanBlocksSummary.vue';
import BilanIssuesList from '@/components/journey/bilan/BilanIssuesList.vue';
import BilanHypothesesSection from '@/components/journey/bilan/BilanHypothesesSection.vue';
import BilanLandingPanel from '@/components/journey/bilan/BilanLandingPanel.vue';
import { useBilanHypothesesState } from '@/composables/bilan/useBilanHypothesesState';
import ResourceList from '@/components/resources/ResourceList.vue';
import { P1_EXPORT_COPY } from '@/config/journeys/p1ExportCopyV1_3';
import { P1_ERASE_COPY } from '@/config/journeys/p1CopyV1_3';
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { getBilanAdapter } from '@/adapters/bilan/registry';
import { useP1SystemicFollowups } from '@/composables/useP1SystemicFollowups';
import { useP1SystemicLanding } from '@/composables/useP1SystemicLanding';
import { P1_SYSTEMIC_FOLLOWUPS } from '@/config/journeys/p1SystemicFollowupsV1_3';

const props = defineProps<{
  journeyId: string;
  goToStep: (stepId: string) => void;
}>();

const adapter = getBilanAdapter(props.journeyId);
const vm = computed(() => adapter.buildViewModel());

const storage = useDiagnosticStorage({ journeyId: props.journeyId });
const axisSummary = computed(() =>
  vm.value.panorama.axes.map((axis) => ({ id: axis.id, label: axis.label, value: axis.score }))
);
const panoramaAxes = computed(() =>
  vm.value.panorama.axes.map((axis) => ({
    ...axis,
    emoji: axis.emoji ?? '',
    isPriority: axis.isPriority ?? false,
    priorityLabel: axis.priorityLabel ?? '',
    filledSegments: axis.filledSegments ?? 0
  }))
);

const { mainCards, secondaryCards } = useP1SystemicLanding();
const systemicFollowups = useP1SystemicFollowups(() => mainCards.value.map((c) => c.id));
const systemicFollowupPacks = computed(() => {
  const ids = new Set(mainCards.value.map((c) => c.id));
  return P1_SYSTEMIC_FOLLOWUPS.filter((p) => ids.has(p.cardId)).reduce<Record<string, typeof P1_SYSTEMIC_FOLLOWUPS[number]['questions']>>(
    (acc, pack) => {
      acc[pack.cardId] = pack.questions;
      return acc;
    },
    {}
  );
});
const systemicFollowupAnswers = computed(() => systemicFollowups.answers.value);
const systemicFollowupStatuses = computed(() => systemicFollowups.statuses.value);
const systemicPersistedStatuses = computed(() => systemicFollowups.persistedStatuses.value);
const onSystemicAnswer = (payload: { cardId: string; questionId: string; value: number | null }) => {
  systemicFollowups.setAnswer(payload.cardId, payload.questionId, payload.value);
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

const focusDetails = ref(vm.value.issues.focusDetails);
const repereOpen = ref(false);
const exportMode = ref<'minimal' | 'full'>('minimal');

function scrollToSection(id: string) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  selectionCountLabel
} = useBilanHypothesesState({
  maxSelected: 2,
  scrollToSection
});

const selectedHypotheses = computed(() =>
  vm.value.hypotheses.list.filter((h) => selectedHypothesisIds.value.includes(h.id))
);

const expandedIssueIds = ref<Set<string>>(new Set());
const isIssueExpanded = (issueId: string) => expandedIssueIds.value.has(issueId);
const setAllIssuesExpanded = (expanded: boolean) => {
  const next = new Set<string>();
  if (expanded) {
    vm.value.issues.list.forEach((issue) => next.add(issue.id));
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

const issuesForCard = computed(() =>
  vm.value.issues.list.map((issue) => ({
    ...issue,
    icon: issue.icon ?? '',
    expanded: isIssueExpanded(issue.id)
  }))
);
const watchlistForCard = computed(() =>
  vm.value.issues.watchlist.map((issue) => ({ ...issue, icon: issue.icon ?? '' }))
);

const blocksForCard = computed(() =>
  vm.value.panorama.blocks.map((block) => ({
    ...block,
    detailsOpen: isBlockDetailsOpen(block.id),
    themes: block.themes ?? []
  }))
);

const hypothesesForCard = computed(() =>
  vm.value.hypotheses.list.map((hypo) => ({
    ...hypo,
    selected: isHypothesisSelected(hypo.id),
    disabled: isHypothesisDisabled(hypo.id),
    detailsOpen: isHypothesisExpanded(hypo.id)
  }))
);

const secondaryHypothesesForCard = computed(() => vm.value.hypotheses.secondary);

const verificationPlansForCard = computed(() =>
  selectedHypotheses.value.map((hypo) => ({
    id: hypo.id,
    title: hypo.title,
    steps: vm.value.hypotheses.verificationPlans.find((p) => p.id === hypo.id)?.steps ?? []
  }))
);

const landingPlansForPanel = computed(() =>
  selectedHypotheses.value
    .map((hypo) => {
      const plan = vm.value.landing.plans.find((p) => p.id === hypo.id);
      if (!plan) return null;
      return { ...plan, done: isLandingDone(hypo.id) };
    })
    .filter(
      (plan): plan is (typeof vm.value.landing.plans)[number] => Boolean(plan)
    )
);

const expandedBlockIds = ref<Set<string>>(new Set());
const isBlockDetailsOpen = (blockId: string) => expandedBlockIds.value.has(blockId);
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

const hasHeavy = computed(() => vm.value.issues.list.length > 0);
const hasWatch = computed(() => vm.value.issues.watchlist.length > 0);
const hasSupports = computed(() => vm.value.supports.main.length > 0);

const exportText = computed(() => vm.value.exportPanel.exportText);
const copied = ref(false);
const clearMessage = ref('');
const exportModeWarning = computed(() =>
  exportMode.value === 'minimal' ? P1_EXPORT_COPY.warningMinimal : P1_EXPORT_COPY.warningFull
);

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
  if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
    (navigator as any).clipboard.writeText(exportText.value).catch(() => {});
  }
};
</script>
