<template>
  <JourneyLayout>
    <div class="pp-globalbilan-page" role="region" aria-labelledby="journey-step-heading-E_global_bilan">
      <section class="pp-globalbilan-header">
        <JourneyStepHeader
          :title="copy.title"
          :subtitle="copy.subtitle"
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
            <span class="text-sm font-semibold">{{ completedBlocksLabel }}</span>
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
                  v-if="recommendedResources.length"
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
                v-for="paragraph in officialIntroParagraphs"
                :key="paragraph"
                class="text-sm text-[color:var(--color-text-muted)] leading-relaxed"
              >
                {{ paragraph }}
              </p>
            </div>
            <div class="space-y-2">
              <p
                v-for="paragraph in officialSynthesisParagraphs"
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
        :answered-count="panoramaAnsweredCount"
        :skipped-count="panoramaSkippedCount"
        :completeness-label="panoramaCompletenessLabel"
        :axes="panoramaAxesForCard"
      >
        <BilanBlocksSummary
          :heading="copy.blocksHeading"
          :completed-label="completedBlocksLabel"
          :blocks="blockSummariesForCard"
          @open="toggleBlockDetails($event, true)"
          @toggle="onBlockDetailsToggle($event.id, $event.event)"
        />
      </BilanPanoramaCard>

      <BilanIssuesList
        id="gb_tensions"
        :title="P1_GLOBAL_ISSUES_COPY.mainTitle"
        :intro="P1_GLOBAL_ISSUES_COPY.intro"
        :issues="issuesForCard"
        :watchlist="watchlistForCard"
        :focus-details="focusDetails"
        :empty-text="P1_GLOBAL_ISSUES_COPY.noStrongIssues"
        @set-all="setAllIssuesExpanded"
        @toggle="toggleIssue"
        @go-resources="scrollToSection('gb_ressources')"
        @go-hypotheses="scrollToSection('gb_hypotheses')"
      />

      <section
        v-if="mainSupports && mainSupports.length"
        class="pp-globalbilan-section"
        aria-labelledby="p1-global-supports"
      >
        <div class="pp-globalbilan-section-header">
          <h2 id="p1-global-supports" class="pp-globalbilan-section-title">
            {{ P1_GLOBAL_SUPPORTS_COPY.mainTitle }}
          </h2>
          <p class="text-sm text-[color:var(--color-text-muted)]">
            {{ P1_GLOBAL_SUPPORTS_COPY.intro }}
          </p>
          <p class="text-xs text-[color:var(--color-text-muted)]">
            Ce sont des points d’appui. Les protéger aide souvent à stabiliser le reste.
          </p>
        </div>

        <div class="pp-globalbilan-theme-grid" id="supports_anchor">
          <article
            v-for="support in mainSupports"
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

      <section id="gb_atterrissage" class="pp-globalbilan-section">
        <div :id="'p1-atterrissage'" class="pp-globalbilan-section-header" :class="highlightTarget === 'p1-atterrissage' ? 'ring-2 ring-[color:var(--color-primary)] rounded-lg' : ''">
          <h2 class="pp-globalbilan-section-title">Atterrissage systémique</h2>
          <p class="text-sm text-[color:var(--color-text-muted)]">
            Objectif : vérifier et stabiliser, pas “tout résoudre” en une fois.
          </p>
        </div>
        <div class="space-y-4">
          <div v-if="!selectedHypotheses.length" class="pp-globalbilan-card space-y-3 max-w-3xl">
            <p class="text-sm text-[color:var(--color-text-muted)]">
              Choisis 1–2 hypothèses structurantes pour générer un protocole d’atterrissage ciblé.
            </p>
            <button type="button" class="pp-journey-cta-secondary text-xs w-fit" @click="scrollToSection('gb_hypotheses')">
              Revenir aux hypothèses
            </button>
          </div>
          <div v-else class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="text-sm font-semibold text-[color:var(--color-text)]">Protocole basé sur tes hypothèses gardées</p>
              <button type="button" class="pp-journey-cta-secondary text-xs" @click="scrollToSection('gb_hypotheses')">
                Revenir aux hypothèses
              </button>
            </div>
            <div v-if="selectedHypotheses.length > 1" class="pp-globalbilan-card text-sm text-[color:var(--color-text-muted)] space-y-1 max-w-3xl">
              <p class="font-semibold text-[color:var(--color-text)]">Ordre suggéré</p>
              <ol class="list-decimal list-inside space-y-0.5">
                <li v-for="(hypo, idx) in selectedHypotheses" :key="hypo.id">{{ idx + 1 }} — {{ hypo.title }}</li>
              </ol>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <article
                v-for="hypo in selectedHypotheses"
                :key="hypo.id"
                class="flex flex-col gap-3 rounded-xl border border-white/20 bg-[color:var(--color-panel-soft)] p-4"
                :class="isLandingDone(hypo.id) ? 'border-[color:var(--color-primary)] ring-1 ring-[color:var(--color-primary)]' : ''"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="space-y-1 max-w-[56ch]">
                    <p class="text-sm font-semibold text-[color:var(--color-text)] leading-snug">{{ landingPlan(hypo).title }}</p>
                    <p class="text-xs text-[color:var(--color-text-muted)]">Temps estimé : {{ landingPlan(hypo).timeEstimate }}</p>
                  </div>
                  <button
                    type="button"
                    class="pp-journey-cta-secondary text-[11px]"
                    @click="toggleLandingDone(hypo.id)"
                  >
                    {{ isLandingDone(hypo.id) ? 'Marqué fait' : 'Marquer fait' }}
                  </button>
                </div>
                <ol class="list-decimal list-inside space-y-1.5 text-sm text-[color:var(--color-text)] leading-relaxed max-w-[60ch]">
                  <li v-for="step in landingPlan(hypo).steps" :key="step" class="line-clamp-2">
                    {{ step }}
                  </li>
                </ol>
                <div class="text-sm text-[color:var(--color-text-muted)]">
                  Résultat attendu : <span class="text-[color:var(--color-text)]">{{ landingPlan(hypo).expectedOutcome }}</span>
                </div>
                <div class="flex flex-wrap items-center gap-2 pt-2">
                  <button type="button" class="pp-journey-cta-secondary text-xs font-medium" @click="scrollToSection('gb_ressources')">
                    Voir ressources liées
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
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
      </section>

      <section id="gb_ressources" class="pp-globalbilan-section space-y-3">
        <div class="pp-globalbilan-section-header">
          <h2 class="pp-globalbilan-section-title">
            Ressources à télécharger
          </h2>
          <p class="text-sm text-[color:var(--color-text-muted)]">
            Tu peux agir sans attendre : prends un kit et teste une première vérif.
          </p>
        </div>
        <ResourceList :resources="recommendedResources" variant="compact" />
        <NuxtLink to="/ressources?focus=p1" class="pp-journey-cta-secondary inline-flex w-auto text-xs">
          Voir toutes les ressources
        </NuxtLink>
      </section>

      <section id="gb_actions" class="pp-globalbilan-section space-y-4">
        <div class="pp-globalbilan-section-header">
          <h2 class="pp-globalbilan-section-title">
            {{ P1_ACTION_PLAN_COPY.sectionTitle }}
          </h2>
          <p class="text-sm text-[color:var(--color-text-muted)]">
            {{ P1_ACTION_PLAN_COPY.intro }}
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

        <div v-if="hasAnyAction" class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(actionList, horizonKey) in filteredActionsByHorizon"
            :key="horizonKey"
            class="pp-globalbilan-card space-y-3"
          >
            <h3 class="text-base font-semibold">
              {{
                P1_ACTION_PLAN_COPY.horizonLabels[
                  horizonKey as keyof typeof P1_ACTION_PLAN_COPY.horizonLabels
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
          {{ P1_ACTION_PLAN_COPY.empty }}
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
            {{ P1_ACTION_PLAN_COPY.exportButtonLabel }}
          </button>
        </div>
      </section>

      <GlobalBilanExportPanel
        :copy="copy"
        :export-text="exportText"
        :focus-details="focusDetails"
        :erase-copy-label="P1_ERASE_COPY.buttonLabel"
        :copied="copied"
        :global-skip-text="globalSkipSummary.text"
        :has-global-missing="hasGlobalMissing"
        :missing-info="P1_MISSING_COPY.info"
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
                v-for="paragraph in levelN1Paragraphs"
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
                v-for="paragraph in levelN2Paragraphs"
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
                v-for="paragraph in levelN3Paragraphs"
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
                v-for="paragraph in levelN4Paragraphs"
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
            :sections="summaryNav"
            :axis-summary-label="axisSummaryLabel"
            :blocks-completed-label="completedBlocksLabel"
            :panorama-answered-label="panoramaAnsweredLabel"
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
              :sections="summaryNav"
              :axis-summary-label="axisSummaryLabel"
              :blocks-completed-label="completedBlocksLabel"
              :panorama-answered-label="panoramaAnsweredLabel"
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
import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { useP1Export } from '~/composables/useP1Export';
import { useJourneyDiagnostics } from '~/composables/useJourneyDiagnostics';
import type { P1BlockScores, P1BlockBands, P1TensionBand } from '~/composables/useJourneyDiagnostics';
import { useP1ActionPlan } from '@/composables/useP1ActionPlan';
import { useP1GlobalNarrative } from '@/composables/useP1GlobalNarrative';
import { P1_BLOCK_IDS, p1BlockContent, p1BlockThemes, p1Copy } from '~/config/journeys/p1QuestionsConfig';
import { p1EngagementCopy } from '~/config/journeys/p1EngagementCopy';
import {
  P1_ERASE_COPY,
  P1_GLOBAL_SKIP_SUMMARY,
  P1_MISSING_COPY
} from '@/config/journeys/p1CopyV1_3';
import { P1_ACTION_PLAN_COPY, P1_GLOBAL_ISSUES_COPY, P1_GLOBAL_SUPPORTS_COPY } from '@/config/journeys/p1NarrativesV1_3';
import { useP1Hypotheses } from '@/composables/useP1Hypotheses';
import { useP1SystemicLanding } from '@/composables/useP1SystemicLanding';
import { useP1SystemicFollowups } from '@/composables/useP1SystemicFollowups';
import { P1_SYSTEMIC_FOLLOWUPS } from '@/config/journeys/p1SystemicFollowupsV1_3';
import { P1_EXPORT_COPY } from '@/config/journeys/p1ExportCopyV1_3';
import { useP1Resources } from '@/composables/useP1Resources';
import { P1_SYSTEM_SCALPELS_COPY } from '@/config/journeys/p1SystemScalpelsCopyV1_3';
import P1GlobalBilanAside from '@/components/journey/p1/P1GlobalBilanAside.vue';
import P1SystemicLandingSection from '@/components/journey/p1/P1SystemicLandingSection.vue';
import GlobalBilanExportPanel from '@/components/journey/bilan/GlobalBilanExportPanel.vue';
import BilanPanoramaCard from '@/components/journey/bilan/BilanPanoramaCard.vue';
import BilanBlocksSummary from '@/components/journey/bilan/BilanBlocksSummary.vue';
import BilanIssuesList from '@/components/journey/bilan/BilanIssuesList.vue';
import BilanHypothesesSection from '@/components/journey/bilan/BilanHypothesesSection.vue';
import { useBilanHypothesesState } from '@/composables/bilan/useBilanHypothesesState';
import ResourceList from '@/components/resources/ResourceList.vue';

type SystemicScalpelCopy = (typeof P1_SYSTEM_SCALPELS_COPY)[keyof typeof P1_SYSTEM_SCALPELS_COPY];

const props = defineProps<{
  goToStep: (stepId: string) => void;
}>();

const storage = useDiagnosticStorage({ journeyId: 'p1' });
const scores = computed(() => storage.scores.value ?? {});
const { buildExportText } = useP1Export();
const { mainHypotheses, secondaryHypotheses, toMarkdownHypotheses } = useP1Hypotheses();
const { mainCards, secondaryCards, toMarkdownSystemic } = useP1SystemicLanding();
const { recommendedResources } = useP1Resources();
const systemicFollowups = useP1SystemicFollowups(() => mainCards.value.map((c) => c.id));
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
const selectedHypotheses = computed(() => {
  const all = [...mainHypotheses.value, ...secondaryHypotheses.value];
  return all.filter((h) => selectedHypothesisIds.value.includes(h.id));
});
const exportText = computed(() => {
  const base = buildExportText();
  const segments: string[] = [base];
  const hypoMd = toMarkdownHypotheses();
  if (hypoMd) {
    segments.push(hypoMd);
  }
  const systemicMd = toMarkdownSystemic();
  if (systemicMd) {
    segments.push(systemicMd);
  }
  const statuses = systemicFollowups.statuses.value;
  if (Object.keys(statuses).length) {
    const lines: string[] = [];
    lines.push('## Vérifs systémiques (optionnelles)');
    lines.push('');
    mainCards.value.concat(secondaryCards.value ?? []).forEach((card) => {
      const st = statuses[card.id] ?? 'missing';
      const label = st === 'answered' ? 'faite' : st === 'skipped' ? 'passée' : 'non faite';
      lines.push(`- ${card.title} : ${label}`);
    });
    segments.push(lines.join('\n'));
  }
  if (selectedHypotheses.value.length) {
    const lines: string[] = [];
    lines.push('## Hypothèses retenues');
    lines.push('');
    selectedHypotheses.value.forEach((h) => {
      lines.push(`- ${h.title}`);
      lines.push(`  - Première vérif : ${h.firstCheck}`);
    });
    segments.push(lines.join('\n'));
  }
  return segments.join('\n\n');
});
const copied = ref(false);
const clearMessage = ref('');
const copy = computed(() => p1Copy.global);
const axisOrder = ['human', 'movement', 'decisions', 'structure'] as const;
type AxisId = (typeof axisOrder)[number];
const axisEmojis: Record<AxisId, string> = {
  human: '🤝',
  movement: '🔄',
  decisions: '🧭',
  structure: '🧱'
};
const axisDisplayLabels: Record<AxisId, string> = {
  human: 'Humain',
  movement: 'Mouvement',
  decisions: 'Décisions',
  structure: 'Structure'
};
const { mainIssues, secondaryIssues, mainSupports, secondarySupports } = useP1GlobalNarrative();
const alerts = computed(() => mainIssues.value.filter((issue) => issue.band === 'very_high' || issue.band === 'high'));
const watchlist = computed(() => mainIssues.value.filter((issue) => issue.band === 'medium'));
const hasHeavy = computed(() => alerts.value.length > 0);
const hasWatch = computed(() => watchlist.value.length > 0);
const hasSupports = computed(() => mainSupports.value.length > 0);
const diagnostics = useJourneyDiagnostics({ journeyId: 'p1', blockThemeMap: p1BlockThemes });
const exportMode = ref<'minimal' | 'full'>('minimal');
const exportModeWarning = computed(() =>
  exportMode.value === 'minimal' ? P1_EXPORT_COPY.warningMinimal : P1_EXPORT_COPY.warningFull
);
const focusDetails = ref(false);
const repereOpen = ref(false);

const summaryNav = [
  { id: 'gb_reperes', label: 'Repères' },
  { id: 'gb_panorama', label: 'Panorama & blocs' },
  { id: 'gb_tensions', label: 'Ce qui pèse le plus' },
  { id: 'gb_hypotheses', label: 'Hypothèses' },
  { id: 'gb_atterrissage', label: 'Atterrissage' },
  { id: 'gb_ressources', label: 'Ressources & pistes' },
  { id: 'gb_export', label: 'Export' },
  { id: 'gb_options', label: 'Choisir la suite' }
];

function scrollToSection(id: string) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const splitParagraphs = (text: string) => text.split('\n\n').filter(Boolean);
const officialIntroParagraphs = computed(() => splitParagraphs(p1EngagementCopy.globalBilan.intro));
const officialSynthesisParagraphs = computed(() => splitParagraphs(p1EngagementCopy.globalBilan.synthesis));
const levelN1Paragraphs = computed(() => splitParagraphs(p1EngagementCopy.globalBilan.levelN1));
const levelN2Paragraphs = computed(() => splitParagraphs(p1EngagementCopy.globalBilan.levelN2));
const levelN3Paragraphs = computed(() => splitParagraphs(p1EngagementCopy.globalBilan.levelN3));
const levelN4Paragraphs = computed(() => splitParagraphs(p1EngagementCopy.globalBilan.levelN4));
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
const actionPlan = computed(() => useP1ActionPlan(blockBands.value));
const actionsByHorizon = computed(() => actionPlan.value.actionsByHorizon.value);
const hasAnyAction = computed(() => {
  const horizons = actionsByHorizon.value;
  if (!horizons) return false;
  const lists = Object.values(horizons);
  return lists.some((list) => Array.isArray(list) && list.length > 0);
});
const axisSummary = computed(() =>
  axisOrder.map((axisId) => ({
    id: axisId,
    label: axisDisplayLabels[axisId],
    value: scores.value.panorama?.[axisId] ?? 0
  }))
);
type BlockSummary = {
  id: string;
  title: string;
  answeredCount: number;
  skippedCount: number;
  unseenCount: number;
  themes: { name: string; average: number; count: number }[];
};
type Issue = {
  id: string;
  label: string;
  summary?: string;
  interpretation?: string;
  band?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
};
type Hypothesis = (typeof mainHypotheses.value)[number] & { whyItMatters?: string };
type BlockSummaryForCard = BlockSummary & {
  completion: number;
  isComplete: boolean;
  detailsOpen: boolean;
};
type PanoramaAxisForCard = {
  id: string;
  label: string;
  emoji: string;
  score: number;
  isPriority: boolean;
};
const issueIconMap: Record<string, string> = {
  'Sécurité psychologique': '🤝',
  'Charge et fatigue': '🔋',
  'Prévisibilité du quotidien': '🧾',
  'Justice / équité': '⚖️'
};
const issueIcon = (label: string) => issueIconMap[label] ?? '📌';
const splitSentences = (text?: string) => {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
};
const issueSummaryShort = (issue: Issue) => splitSentences(issue.summary)[0] || issue.summary || '';
const issueEffects = (issue: Issue) => {
  const parts = splitSentences(issue.interpretation);
  return parts.slice(0, 3).length ? parts.slice(0, 3) : parts;
};
const issueSignals = (issue: Issue) => {
  const parts = splitSentences(issue.summary);
  return parts.slice(0, 2).length ? parts.slice(0, 2) : parts;
};
type IssueBullet = { lead: string; detail?: string };
const toBullet = (text: string): IssueBullet => {
  const separators = [':', '—', '–', ' - '];
  for (const sep of separators) {
    const idx = text.indexOf(sep);
    if (idx > 0) {
      const lead = text.slice(0, idx).trim();
      const detail = text.slice(idx + sep.length).trim();
      return { lead, detail };
    }
  }
  const words = text.split(' ');
  if (words.length > 2) {
    return { lead: words.slice(0, 2).join(' '), detail: words.slice(2).join(' ') };
  }
  return { lead: text };
};
const issueEffectsBullets = (issue: Issue): IssueBullet[] => issueEffects(issue).map((p) => toBullet(p));
const issueSignalsBullets = (issue: Issue): IssueBullet[] => issueSignals(issue).map((p) => toBullet(p));
const issueImpactScore = (issue: Issue) => {
  if (issue.band === 'very_high') return 5;
  if (issue.band === 'high') return 4;
  if (issue.band === 'medium') return 3;
  if (issue.band === 'very_low') return 1;
  return 2;
};
const hypothesisWhyItMatters = (hypo: Hypothesis) => (hypo as any).whyItMatters ?? '';
const hypothesisSummary = (hypo: Hypothesis) => splitSentences(hypo.body)[0] || hypo.body || '';
const hypothesisSignalsBullets = (hypo: Hypothesis): IssueBullet[] => (hypo.rationaleLines ?? []).slice(0, 2).map((line) => toBullet(line));
const hypothesisCostBullets = (hypo: Hypothesis): IssueBullet[] => {
  const first = splitSentences(hypothesisWhyItMatters(hypo))[0];
  return first ? [toBullet(first)] : [];
};
const hypothesisTestBullets = (hypo: Hypothesis): IssueBullet[] => (hypo.firstCheck ? [toBullet(hypo.firstCheck)] : []);
const verificationPlan = (hypo: Hypothesis) => [
  `Relire les signaux typiques de "${hypo.title}" dans ton contexte`,
  `Test rapide : ${hypo.firstCheck ?? 'faire une observation de 15 min sur ce point'}`,
  'Noter ce qui change et décider si tu confirmes ou infirme cette hypothèse'
];
const landingPlans: Record<
  string,
  { title: string; timeEstimate: string; steps: string[]; expectedOutcome: string }
> = {
  mission_cash_arbitrage: {
    title: 'Mission vs cash : clarifier un arbitrage',
    timeEstimate: '20–40 min',
    steps: [
      'Choisir une décision récente où mission et cash ont divergé',
      'Écrire qui tranche et selon quels critères minimalistes',
      'Tester l’annonce de cet arbitrage sur 1 périmètre restreint'
    ],
    expectedOutcome: 'Tu sauras si un arbitrage explicite stabilise la charge et la cohérence.'
  },
  gouvernance_floue: {
    title: 'Rendre visible qui décide quoi',
    timeEstimate: '20–30 min',
    steps: [
      'Lister 2 décisions sensibles et leurs pilotes',
      'Rendre visibles les règles minimales (qui décide, sur quoi, comment contester)',
      'Tester cette fiche auprès de l’équipe concernée'
    ],
    expectedOutcome: 'Tu sauras si la clarté réduit les contournements et la tension.'
  },
  coulisses_et_opacite: {
    title: 'Tracer une décision “coulisses”',
    timeEstimate: '20–30 min',
    steps: [
      'Choisir une décision opaque récente',
      'Documenter qui a proposé, tranché, et sur quels critères',
      'Partager et collecter 2 retours sur la lisibilité'
    ],
    expectedOutcome: 'Tu sauras si rendre la trace apaise les doutes ou révèle un blocage.'
  },
  dependance_mortelle: {
    title: 'Sécuriser une dépendance critique',
    timeEstimate: '20–30 min',
    steps: [
      'Identifier la dépendance la plus risquée',
      'Définir un plan B minimal (doublon, doc, relais)',
      'Tester le relais sur un cas simple'
    ],
    expectedOutcome: 'Tu sauras si le plan B tient et réduit le risque immédiat.'
  }
};
const landingPlan = (hypo: Hypothesis) =>
  landingPlans[hypo.id] ?? {
    title: hypo.title,
    timeEstimate: '20–40 min',
    steps: verificationPlan(hypo),
    expectedOutcome: 'Tu sauras si cette hypothèse tient face aux faits.'
  };
const expandedIssueIds = ref<Set<string>>(new Set());
const isIssueExpanded = (issueId: string) => expandedIssueIds.value.has(issueId);
const setAllIssuesExpanded = (expanded: boolean) => {
  const next = new Set<string>();
  if (expanded) {
    alerts.value.forEach((issue) => next.add(issue.id));
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
  alerts.value.map((issue) => ({
    id: issue.id,
    label: issue.label,
    icon: issueIcon(issue.label),
    summary: issue.summary ?? '',
    summaryShort: issueSummaryShort(issue),
    interpretation: issue.interpretation ?? '',
    impactScore: issueImpactScore(issue),
    effects: issueEffectsBullets(issue),
    signals: issueSignalsBullets(issue),
    expanded: isIssueExpanded(issue.id)
  }))
);
const watchlistForCard = computed(() =>
  watchlist.value.map((issue) => ({
    id: issue.id,
    label: issue.label,
    icon: issueIcon(issue.label),
    summary: issue.summary ?? '',
    summaryShort: issueSummaryShort(issue),
    interpretation: issue.interpretation ?? '',
    impactScore: issueImpactScore(issue),
    effects: issueEffectsBullets(issue),
    signals: issueSignalsBullets(issue),
    expanded: false
  }))
);
const hypothesesForCard = computed(() =>
  mainHypotheses.value.map((hypo, idx) => ({
    id: hypo.id,
    index: idx + 1,
    title: hypo.title,
    summary: hypothesisSummary(hypo),
    signals: hypothesisSignalsBullets(hypo),
    costs: hypothesisCostBullets(hypo),
    tests: hypothesisTestBullets(hypo),
    rationaleLines: hypo.rationaleLines,
    firstCheck: hypo.firstCheck,
    body: hypo.body,
    whyItMatters: hypothesisWhyItMatters(hypo),
    detailsOpen: isHypothesisExpanded(hypo.id),
    selected: isHypothesisSelected(hypo.id),
    disabled: isHypothesisDisabled(hypo.id)
  }))
);
const secondaryHypothesesForCard = computed(() =>
  secondaryHypotheses.value.map((hypo) => ({ id: hypo.id, title: hypo.title }))
);
const verificationPlansForCard = computed(() =>
  selectedHypotheses.value.map((hypo) => ({
    id: hypo.id,
    title: hypo.title,
    steps: verificationPlan(hypo)
  }))
);
const blockCompletion = (block: BlockSummary) => {
  const total = (block.answeredCount ?? 0) + (block.skippedCount ?? 0) + (block.unseenCount ?? 0);
  if (!total) return 0;
  return Math.round(((block.answeredCount ?? 0) / total) * 100);
};
const isBlockComplete = (block: BlockSummary) =>
  (block.skippedCount ?? 0) === 0 && (block.unseenCount ?? 0) === 0 && (block.answeredCount ?? 0) > 0;
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
const axisScore = (axisId: AxisId) => scores.value.panorama?.[axisId] ?? 0;
const panoramaAxesSorted = computed(() =>
  axisOrder
    .map((axisId, order) => ({ id: axisId, score: axisScore(axisId), order }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.order - b.order;
    })
);
const panoramaMaxScore = computed(() =>
  panoramaAxesSorted.value.reduce((acc, axis) => Math.max(acc, axis.score), 0)
);
const priorityAxisIds = computed(() =>
  panoramaAxesSorted.value
    .filter((axis) => axis.score === panoramaMaxScore.value && panoramaMaxScore.value >= 4)
    .map((axis) => axis.id)
);
const panoramaAxesForCard = computed<PanoramaAxisForCard[]>(() =>
  panoramaAxesSorted.value.map((axis) => ({
    id: axis.id,
    label: axisDisplayLabels[axis.id],
    emoji: axisEmojis[axis.id],
    score: axis.score,
    isPriority: priorityAxisIds.value.includes(axis.id)
  }))
);
const filledSegments = (score: number) => Math.max(0, Math.min(5, Math.round(score)));
const priorityLabel = (score: number) => {
  if (score >= 4) return 'Prioritaire';
  if (score >= 2) return 'À surveiller';
  return 'Secondaire';
};
const panoramaAnsweredCount = computed(() => scores.value.panorama?.answeredCount ?? 0);
const panoramaSkippedCount = computed(() => scores.value.panorama?.skippedCount ?? 0);
const panoramaTotalCount = computed(() => panoramaAnsweredCount.value + panoramaSkippedCount.value);
const panoramaCompletenessLabel = computed(() => {
  const answered = panoramaAnsweredCount.value;
  const skipped = panoramaSkippedCount.value;
  const total = panoramaTotalCount.value;
  if (!total) return 'Panorama partiel (0/0)';
  if (skipped === 0) return `Panorama complet ✅ (${answered}/${total})`;
  return `Panorama partiel (${answered}/${total})`;
});
const axisSummaryLabel = computed(() => axisSummary.value.map((a) => `${a.label}:${a.value}`).join(' · '));
const panoramaAnsweredLabel = computed(
  () => `R ${panoramaAnsweredCount.value} / NR ${panoramaSkippedCount.value}`
);
const toMarkdownScalpels = () => {
  const cards = [...mainCards.value, ...(secondaryCards.value ?? [])]
    .map((card) => P1_SYSTEM_SCALPELS_COPY[card.id as keyof typeof P1_SYSTEM_SCALPELS_COPY])
    .filter(Boolean) as SystemicScalpelCopy[];
  if (!cards.length) return '';
  const lines: string[] = [];
  lines.push('## Questions scalpel (lecture système)');
  lines.push('');
  cards.forEach((scalpel) => {
    lines.push(`### ${scalpel.title}`);
    lines.push(`Q: ${scalpel.scalpelQuestion}`);
    lines.push(`Pourquoi: ${scalpel.whyItChangesEverything}`);
    lines.push(`Première vérif: ${scalpel.firstCheck}`);
    if (scalpel.counterHypothesis) {
      lines.push(`Contre-hypothèse: ${scalpel.counterHypothesis}`);
    }
    lines.push('');
  });
  return lines.join('\n');
};
const toMarkdown = () => {
  if (exportMode.value === 'minimal') {
    return actionPlan.value.toMarkdown();
  }

  const sections: string[] = [];
  const planMd = actionPlan.value.toMarkdown();
  if (planMd) {
    sections.push(planMd);
  }
  const hypoMd = toMarkdownHypotheses();
  if (hypoMd) {
    sections.push(hypoMd);
  }
  const systemicMd = toMarkdownSystemic();
  if (systemicMd) {
    sections.push(systemicMd);
  }
  const scalpelMd = toMarkdownScalpels();
  if (scalpelMd) {
    sections.push(scalpelMd);
  }
  return sections.length ? sections.join('\n\n') : null;
};
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

const filteredActionsByHorizon = computed<Record<string, any[]>>(() => {
  const horizons = actionsByHorizon.value ?? {};
  return Object.fromEntries(
    Object.entries(horizons).filter(([, list]) => Array.isArray(list) && (list as any).length > 0)
  );
});

const blockSummaries = computed<BlockSummary[]>(() =>
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
const blockSummariesForCard = computed<BlockSummaryForCard[]>(() =>
  blockSummaries.value.map((block) => ({
    ...block,
    completion: blockCompletion(block),
    isComplete: isBlockComplete(block),
    detailsOpen: isBlockDetailsOpen(block.id)
  }))
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
    (byAxis.movement?.missingCount ?? 0) +
    (byAxis.decisions?.missingCount ?? 0) +
    (byAxis.structure?.missingCount ?? 0)
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
  if (!markdown) {
    return;
  }

  if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
    (navigator as any).clipboard.writeText(markdown).catch(() => {});
  }
};
</script>
