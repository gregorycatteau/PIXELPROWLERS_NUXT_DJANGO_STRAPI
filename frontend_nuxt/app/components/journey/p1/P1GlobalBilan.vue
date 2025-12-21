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

      <section id="gb_panorama" class="pp-globalbilan-section">
        <div class="pp-globalbilan-section-header">
          <h2 class="pp-globalbilan-section-title">Panorama & blocs</h2>
        </div>
        <div class="grid gap-5 lg:grid-cols-2">
          <div class="pp-globalbilan-card space-y-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="space-y-1">
                <p class="text-sm font-semibold text-[color:var(--color-text)]">Panorama (scores P1)</p>
                <p class="text-xs text-[color:var(--color-text-muted)]">
                  Répondu : {{ panoramaAnsweredCount }} · Non répondu : {{ panoramaSkippedCount }}
                </p>
              </div>
              <span
                class="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] px-3 py-1 text-[11px] font-semibold text-[color:var(--color-text)]"
              >
                {{ panoramaCompletenessLabel }}
              </span>
            </div>
            <div class="space-y-2 rounded-lg border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] px-3 py-3">
              <p class="text-sm font-semibold text-[color:var(--color-text)]">Impact perçu : 0 = faible · 5 = fort</p>
              <div class="flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--color-text-muted)]">
                <span class="font-semibold text-[color:var(--color-text)]">Faible</span>
                <div class="flex flex-wrap items-center gap-1" aria-hidden="true">
                  <span
                    v-for="n in 6"
                    :key="`panorama-scale-${n}`"
                    class="flex h-6 w-6 items-center justify-center rounded-md border border-[color:var(--color-stroke)] bg-[color:var(--color-panel)] text-[11px] font-semibold text-[color:var(--color-text)]"
                  >
                    {{ n - 1 }}
                  </span>
                </div>
                <span class="font-semibold text-[color:var(--color-text)]">Fort</span>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              <div
                v-for="axis in panoramaAxesSorted"
                :key="axis.id"
                class="pp-globalbilan-axe-card h-full w-full min-w-0 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span aria-hidden="true" class="shrink-0 text-base leading-none">{{ axisEmojis[axis.id] }}</span>
                  <div class="font-semibold whitespace-normal break-words leading-snug">
                    {{ axisDisplayLabels[axis.id] }}
                  </div>
                </div>
                <div class="flex items-center justify-end gap-2 min-w-0 min-h-[24px]">
                  <span
                    v-if="priorityAxisIds.includes(axis.id)"
                    class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-white/10 bg-white/10 text-[color:var(--color-text)] leading-none shrink-0"
                  >
                    <span aria-hidden="true">⭐</span>
                    Prioritaire
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 text-xs px-2 py-1 opacity-0 shrink-0"
                    aria-hidden="true"
                  >
                    <span aria-hidden="true">⭐</span>
                    Prioritaire
                  </span>
                </div>
                <div class="flex items-center justify-between gap-3 min-w-0" :aria-label="`Impact ${axis.score}/5`">
                  <div class="flex items-center gap-1 min-w-0">
                    <div class="flex items-center gap-1 min-w-0" aria-hidden="true">
                      <span
                        v-for="n in 5"
                        :key="`axis-${axis.id}-segment-${n}`"
                        :class="[
                          'h-2 w-5 rounded-full border border-[color:var(--color-stroke)] shrink-0',
                          n <= filledSegments(axis.score)
                            ? 'bg-[color:var(--color-text)]'
                            : 'bg-[color:var(--color-panel)]'
                        ]"
                      />
                    </div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="text-sm font-semibold tabular-nums text-[color:var(--color-text)]">{{ axis.score }}/5</span>
                    <span class="text-xs text-[color:var(--color-text-muted)] whitespace-nowrap opacity-80">
                      {{ priorityLabel(axis.score) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pp-globalbilan-card space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-[color:var(--color-text)]">{{ copy.blocksHeading }}</p>
              <p class="text-xs text-[color:var(--color-text-muted)]">Blocs complétés : {{ completedBlocksLabel }}</p>
            </div>
            <div class="space-y-3">
              <article
                v-for="block in blockSummaries"
                :key="block.id"
                class="rounded-xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] p-4 space-y-3"
              >
                <div class="flex items-start justify-between gap-3">
                  <p class="text-sm font-semibold text-[color:var(--color-text)] leading-snug">{{ block.title }}</p>
                  <span
                    class="shrink-0 text-[11px] px-2 py-1 rounded-full border border-[color:var(--color-stroke)] bg-[color:var(--color-panel)] text-[color:var(--color-text)]"
                  >
                    Bloc {{ block.id }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-2 text-xs">
                  <span class="pp-globalbilan-summary-chip inline-flex items-center gap-1">
                    <span aria-hidden="true">✅</span> Répondu : {{ block.answeredCount }}
                  </span>
                  <span class="pp-globalbilan-summary-chip inline-flex items-center gap-1">
                    <span aria-hidden="true">⏭</span> Non répondu : {{ block.skippedCount }}
                  </span>
                  <span class="pp-globalbilan-summary-chip inline-flex items-center gap-1">
                    <span aria-hidden="true">👀</span> Non vu : {{ block.unseenCount }}
                  </span>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-xs text-[color:var(--color-text-muted)]">
                    <span>Complétude</span>
                    <span class="tabular-nums text-[color:var(--color-text)] font-semibold">
                      {{ blockCompletion(block) }}%
                    </span>
                  </div>
                  <div class="h-1.5 w-full rounded-full bg-[color:var(--color-panel)] overflow-hidden">
                    <div
                      class="h-full rounded-full bg-[color:var(--color-text)] transition-all"
                      :style="{ width: `${blockCompletion(block)}%` }"
                      aria-hidden="true"
                    ></div>
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    class="pp-journey-cta-secondary text-xs sm:text-sm"
                    @click="toggleBlockDetails(block.id, true)"
                  >
                    {{ isBlockComplete(block) ? 'Voir le détail' : 'Continuer ce bloc' }}
                  </button>
                  <details
                    :open="isBlockDetailsOpen(block.id)"
                    class="w-full"
                    @toggle="onBlockDetailsToggle(block.id, $event)"
                  >
                    <summary class="text-xs text-[color:var(--color-text)] cursor-pointer">
                      Voir tous les sous-thèmes ({{ block.themes?.length ?? 0 }})
                    </summary>
                    <ul class="mt-2 list-disc list-inside text-xs text-[color:var(--color-text-muted)] space-y-0.5">
                      <li
                        v-for="theme in block.themes || []"
                        :key="theme.name"
                      >
                        {{ theme.name }} : {{ theme.average }} ({{ theme.count }})
                      </li>
                    </ul>
                  </details>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="gb_tensions" class="pp-globalbilan-section">
        <div class="pp-globalbilan-section-header">
          <h2 class="pp-globalbilan-section-title">
            {{ P1_GLOBAL_ISSUES_COPY.mainTitle }}
          </h2>
          <p class="text-sm text-[color:var(--color-text-muted)]">
            {{ P1_GLOBAL_ISSUES_COPY.intro }}
          </p>
        </div>
        <div v-if="alerts.length" class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 id="tensions_poids" class="text-sm font-semibold text-[color:var(--color-text)]">Ce qui pèse le plus</h3>
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <button type="button" class="pp-globalbilan-summary-chip" @click="setAllIssuesExpanded(false)">
                Lecture rapide
              </button>
              <button type="button" class="pp-globalbilan-summary-chip" @click="setAllIssuesExpanded(true)">
                Tout lire
              </button>
              <button type="button" class="pp-journey-cta-secondary text-xs" @click="scrollToSection('gb_hypotheses')">
                Passer en lecture structure
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <article
              v-for="issue in alerts"
              :key="issue.id"
              class="pp-globalbilan-theme-card flex flex-col gap-4 rounded-xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] p-4"
            >
              <div class="space-y-2 max-w-[60ch] w-full mx-auto text-left">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <span aria-hidden="true" class="text-lg leading-none shrink-0">{{ issueIcon(issue.label) }}</span>
                    <h4 class="text-base font-semibold text-[color:var(--color-text)]">{{ issue.label }}</h4>
                  </div>
                  <div class="flex items-center gap-1 shrink-0" aria-hidden="true">
                    <span
                      v-for="n in 5"
                      :key="`issue-${issue.id}-seg-${n}`"
                      :class="[
                        'h-1.5 w-6 rounded-full border border-[color:var(--color-stroke)]',
                        n <= issueImpactScore(issue) ? 'bg-[color:var(--color-text)]' : 'bg-[color:var(--color-panel)]'
                      ]"
                    />
                  </div>
                </div>
                <p class="text-sm leading-relaxed opacity-90 text-[color:var(--color-text-muted)] line-clamp-2">
                  {{ issueSummaryShort(issue) }}
                </p>
              </div>
              <div class="max-w-[60ch] w-full mx-auto space-y-5 text-left">
                <div class="mt-5 pt-4 border-t border-white/10">
                  <p class="text-[11px] uppercase tracking-[0.12em] opacity-60 text-[color:var(--color-text-muted)]">
                    Ce que ça provoque
                  </p>
                  <ul class="mt-3 space-y-2 text-sm text-[color:var(--color-text)] leading-relaxed">
                    <li v-for="item in issueEffectsBullets(issue)" :key="item.lead">
                      <strong class="font-medium">{{ item.lead }}</strong><span v-if="item.detail"> : {{ item.detail }}</span>
                    </li>
                  </ul>
                </div>
                <div class="mt-5 pt-4 border-t border-white/10 space-y-1">
                  <p class="text-[11px] uppercase tracking-[0.12em] opacity-60 text-[color:var(--color-text-muted)]">
                    Signaux fréquents
                  </p>
                  <ul class="mt-3 space-y-2 text-sm text-[color:var(--color-text)] leading-relaxed">
                    <li v-for="item in issueSignalsBullets(issue)" :key="item.lead">
                      <strong class="font-medium">{{ item.lead }}</strong><span v-if="item.detail"> : {{ item.detail }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="mt-auto max-w-[60ch] w-full mx-auto pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  class="pp-journey-cta-secondary text-xs sm:text-sm font-medium border border-white/30"
                  @click="scrollToSection('gb_ressources')"
                >
                  Voir ressources liées
                </button>
                <button
                  type="button"
                  class="pp-btn-ghost text-xs"
                  :aria-expanded="isIssueExpanded(issue.id)"
                  :aria-controls="`weight-card-${issue.id}`"
                  @click="toggleIssue(issue.id)"
                >
                  {{ isIssueExpanded(issue.id) ? 'Réduire' : 'En savoir plus' }}
                </button>
              </div>
              <div
                v-if="isIssueExpanded(issue.id)"
                :id="`weight-card-${issue.id}`"
                class="max-w-[60ch] w-full mx-auto space-y-2 text-sm text-[color:var(--color-text-muted)] leading-relaxed"
              >
                <p>{{ issue.summary }}</p>
                <p>{{ issue.interpretation }}</p>
              </div>
            </article>
          </div>
        </div>

        <div v-if="watchlist.length" class="space-y-2">
          <h3 id="tensions_autres" class="text-sm font-semibold text-[color:var(--color-text)]">Autres points à garder en tête</h3>
          <details :open="focusDetails" class="pp-globalbilan-theme-grid">
            <summary class="text-sm text-[color:var(--color-text)] cursor-pointer">Voir / masquer</summary>
            <div class="pp-globalbilan-theme-grid">
              <article
                v-for="issue in watchlist"
                :key="issue.id"
                class="pp-globalbilan-theme-card space-y-2"
              >
                <h4 class="text-base font-semibold">{{ issue.label }}</h4>
                <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
                  {{ issue.summary }}
                </p>
                <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
                  {{ issue.interpretation }}
                </p>
              </article>
            </div>
          </details>
        </div>

        <div v-if="!mainIssues.length && !watchlist.length" class="space-y-2">
          <p class="text-sm text-[color:var(--color-text-muted)]">
            {{ P1_GLOBAL_ISSUES_COPY.noStrongIssues }}
          </p>
        </div>
      </section>

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

      <section id="gb_hypotheses" class="pp-globalbilan-section">
        <div class="pp-globalbilan-section-header space-y-1">
          <h2 class="pp-globalbilan-section-title">
            Hypothèses structurantes
          </h2>
          <p class="text-sm text-[color:var(--color-text-muted)]">
            On passe de ce que tu ressens à ce qui tient ton système. Choisis 1–2 hypothèses à vérifier en premier.
          </p>
          <p class="text-xs font-semibold text-[color:var(--color-text)]">Sélection : {{ selectedHypothesisIds.length }}/2</p>
        </div>

        <div v-if="mainHypotheses.length" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <article
              v-for="(hypo, idx) in mainHypotheses"
              :key="hypo.id"
              class="pp-globalbilan-theme-card flex flex-col gap-4 rounded-xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] p-4"
              :class="isHypothesisSelected(hypo.id) ? 'border-[color:var(--color-primary)] ring-1 ring-[color:var(--color-primary)]' : ''"
            >
              <div class="flex items-start justify-between gap-3">
                <span class="pp-globalbilan-summary-chip">Hypothèse {{ idx + 1 }}</span>
                <button
                  type="button"
                  class="pp-journey-cta-secondary text-xs"
                  :class="[
                    isHypothesisSelected(hypo.id) ? 'border-[color:var(--color-primary)] text-[color:var(--color-text)]' : '',
                    isHypothesisDisabled(hypo.id) ? 'opacity-60 cursor-not-allowed' : ''
                  ]"
                  :disabled="isHypothesisDisabled(hypo.id)"
                  @click="toggleHypothesis(hypo.id)"
                >
                  {{ isHypothesisSelected(hypo.id) ? 'Gardée' : 'Je la garde' }}
                </button>
              </div>
              <div class="space-y-3 max-w-[60ch] text-left">
                <h3 class="text-base font-semibold text-[color:var(--color-text)] leading-snug">
                  {{ hypo.title }}
                </h3>
                <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed line-clamp-2">
                  Ce que ça explique : <span class="text-[color:var(--color-text)]">{{ hypothesisSummary(hypo) }}</span>
                </p>
              </div>
              <div class="max-w-[60ch] text-left space-y-5 leading-relaxed">
                <div class="mt-5 pt-4 border-t border-white/10">
                  <p class="text-[11px] uppercase tracking-[0.12em] opacity-60 text-[color:var(--color-text-muted)]">
                    Signaux typiques
                  </p>
                  <ul class="mt-3 space-y-2 text-sm text-[color:var(--color-text)] leading-relaxed">
                    <li v-for="item in hypothesisSignalsBullets(hypo)" :key="item.lead">
                      <strong class="font-medium">{{ item.lead }}</strong><span v-if="item.detail" class="line-clamp-2"> : {{ item.detail }}</span>
                    </li>
                    <li v-if="!hypothesisSignalsBullets(hypo).length" class="text-[color:var(--color-text-muted)]">
                      À préciser lors des échanges.
                    </li>
                  </ul>
                </div>
                <div class="mt-5 pt-4 border-t border-white/10">
                  <p class="text-[11px] uppercase tracking-[0.12em] opacity-60 text-[color:var(--color-text-muted)]">
                    Ce que ça coûte
                  </p>
                  <ul class="mt-3 space-y-2 text-sm text-[color:var(--color-text)] leading-relaxed">
                    <li v-for="item in hypothesisCostBullets(hypo)" :key="item.lead">
                      <strong class="font-medium">{{ item.lead }}</strong><span v-if="item.detail" class="line-clamp-2"> : {{ item.detail }}</span>
                    </li>
                    <li v-if="!hypothesisCostBullets(hypo).length" class="text-[color:var(--color-text-muted)]">
                      Non renseigné ici — à discuter.
                    </li>
                  </ul>
                </div>
                <div class="mt-5 pt-4 border-t border-white/10">
                  <p class="text-[11px] uppercase tracking-[0.12em] opacity-60 text-[color:var(--color-text-muted)]">
                    Test rapide
                  </p>
                  <ul class="mt-3 space-y-2 text-sm text-[color:var(--color-text)] leading-relaxed">
                    <li v-for="item in hypothesisTestBullets(hypo)" :key="item.lead">
                      <strong class="font-medium">{{ item.lead }}</strong><span v-if="item.detail" class="line-clamp-2"> : {{ item.detail }}</span>
                    </li>
                    <li v-if="!hypothesisTestBullets(hypo).length" class="text-[color:var(--color-text-muted)]">
                      À définir ensemble.
                    </li>
                  </ul>
                </div>
              </div>
              <div class="mt-auto max-w-[60ch] w-full text-left pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  class="pp-btn-ghost text-xs inline-flex items-center gap-1"
                  :aria-expanded="isHypothesisExpanded(hypo.id)"
                  :aria-controls="`hypo-card-${hypo.id}`"
                  @click="toggleHypothesisDetails(hypo.id)"
                >
                  <span aria-hidden="true">{{ isHypothesisExpanded(hypo.id) ? '▾' : '▸' }}</span>
                  {{ isHypothesisExpanded(hypo.id) ? 'Réduire les détails' : 'Détails' }}
                </button>
                <span
                  v-if="isHypothesisDisabled(hypo.id) && !isHypothesisSelected(hypo.id)"
                  class="text-[10px] text-[color:var(--color-text-muted)]"
                >
                  Max 2 sélectionnées
                </span>
              </div>
              <div
                v-if="isHypothesisExpanded(hypo.id)"
                :id="`hypo-card-${hypo.id}`"
                class="max-w-[60ch] text-left space-y-2 text-sm text-[color:var(--color-text-muted)] leading-relaxed"
              >
                <p>{{ hypo.body }}</p>
                <p v-if="hypothesisWhyItMatters(hypo)">{{ hypothesisWhyItMatters(hypo) }}</p>
                <div v-if="hypo.rationaleLines?.length" class="space-y-1">
                  <p class="font-semibold text-[color:var(--color-text)]">Pourquoi ça ressort</p>
                  <ul class="list-disc list-inside space-y-0.5">
                    <li v-for="line in hypo.rationaleLines" :key="line">{{ line }}</li>
                  </ul>
                </div>
                <p v-if="hypo.firstCheck" class="text-sm text-[color:var(--color-text)]">
                  Première vérif : <span class="text-[color:var(--color-text-muted)]">{{ hypo.firstCheck }}</span>
                </p>
              </div>
            </article>
          </div>

          <div class="pp-globalbilan-card space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-[color:var(--color-text)]">Plan de vérification (15–30 min)</h3>
              <p class="text-xs text-[color:var(--color-text-muted)]">Sélection : {{ selectedHypothesisIds.length }}/2</p>
            </div>
            <div v-if="!selectedHypotheses.length" class="text-sm text-[color:var(--color-text-muted)]">
              Sélectionne 1–2 hypothèses pour générer un plan de vérification léger.
            </div>
            <div v-else class="space-y-3">
              <article
                v-for="hypo in selectedHypotheses"
                :key="hypo.id"
                class="rounded-lg border border-white/20 bg-[color:var(--color-panel-soft)] p-4 space-y-3"
              >
                <p class="text-sm font-semibold text-[color:var(--color-text)]">{{ hypo.title }}</p>
                <ol class="list-decimal list-inside space-y-1 text-sm text-[color:var(--color-text-muted)]">
                  <li v-for="step in verificationPlan(hypo)" :key="step">{{ step }}</li>
                </ol>
                <button type="button" class="pp-journey-cta-secondary text-xs font-medium" @click="goToAtterrissage()">
                  Aller à Atterrissage
                </button>
              </article>
            </div>
          </div>
          <div
            v-if="secondaryHypotheses.length"
            class="space-y-2"
            aria-labelledby="p1-global-secondary-hypotheses"
          >
            <h2 id="p1-global-secondary-hypotheses" class="pp-globalbilan-section-title text-base">
              Hypothèses secondaires
            </h2>
            <ul class="list-disc list-inside space-y-1 text-sm text-[color:var(--color-text-muted)]">
              <li v-for="h in secondaryHypotheses" :key="h.id">{{ h.title }}</li>
            </ul>
          </div>
        </div>
        <p v-else class="text-sm text-[color:var(--color-text-muted)]">
          À ce stade, aucune hypothèse structurante ne ressort nettement. Tu peux continuer avec les blocs ou le plan d’action.
        </p>
      </section>

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

      <section id="gb_export" class="pp-globalbilan-section space-y-3">
        <div class="pp-globalbilan-section-header">
          <h2 class="pp-globalbilan-section-title">{{ copy.exportHeading }}</h2>
        </div>
        <div class="pp-globalbilan-card space-y-3">
          <details :open="focusDetails">
            <summary class="text-sm text-[color:var(--color-text)] cursor-pointer">Voir le texte exportable</summary>
            <div class="mt-3 space-y-2">
              <textarea class="w-full text-xs p-3 h-40 rounded-lg border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)]" readonly>{{ exportText }}</textarea>
              <p class="text-sm text-[color:var(--color-text-muted)]">
                {{ copy.exportNotice }}
              </p>
              <p class="text-sm text-[color:var(--color-text-muted)]">{{ copy.sovereigntyNote }}</p>
            </div>
          </details>
        </div>
        <div class="pp-globalbilan-actions-bar">
          <button type="button" class="pp-journey-cta-primary" @click="handleCopy">
            {{ copy.copyCta }}
          </button>
          <button type="button" class="pp-journey-cta-secondary" @click="handlePrint">{{ copy.printCta }}</button>
          <button type="button" class="pp-journey-cta-secondary" @click="goToStep('E2_panorama_bilan')">
            {{ copy.backToHub }}
          </button>
          <button type="button" class="pp-journey-cta-secondary" @click="handleClear">
            {{ P1_ERASE_COPY.buttonLabel }}
          </button>
          <span v-if="copied" class="text-sm text-[color:var(--color-text-muted)]">Copié dans le presse-papier.</span>
        </div>
        <p v-if="globalSkipSummary.text" class="text-sm text-[color:var(--color-text-muted)]">
          {{ globalSkipSummary.text }}
        </p>
        <p v-if="hasGlobalMissing" class="text-sm text-[color:var(--color-text-muted)]">
          {{ P1_MISSING_COPY.info }}
        </p>
        <p v-if="clearMessage" class="text-sm text-[color:var(--color-text-muted)]">
          {{ clearMessage }}
        </p>
      </section>

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
import { P1_SYSTEM_SCALPELS_COPY } from '@/config/journeys/p1SystemScalpelsCopyV1_3';
import { useP1Resources } from '@/composables/useP1Resources';
import P1GlobalBilanAside from '@/components/journey/p1/P1GlobalBilanAside.vue';
import P1SystemicLandingSection from '@/components/journey/p1/P1SystemicLandingSection.vue';
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
const MAX_SELECTED_HYPOTHESES = 2;
const selectedHypothesisIds = ref<string[]>([]);
const isSelected = (id: string) => selectedHypothesisIds.value.includes(id);
const toggleHypothesis = (id: string) => {
  if (isSelected(id)) {
    selectedHypothesisIds.value = selectedHypothesisIds.value.filter((v) => v !== id);
    return;
  }
  if (selectedHypothesisIds.value.length >= MAX_SELECTED_HYPOTHESES) return;
  selectedHypothesisIds.value = [...selectedHypothesisIds.value, id];
};
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

const scrollToSection = (id: string) => {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

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
const highlightTarget = ref<string | null>(null);
const goToAtterrissage = () => {
  highlightTarget.value = 'p1-atterrissage';
  scrollToSection('p1-atterrissage');
  setTimeout(() => {
    highlightTarget.value = null;
  }, 2000);
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
const hypothesisDetailsExpanded = ref<Set<string>>(new Set());
const isHypothesisExpanded = (id: string) => hypothesisDetailsExpanded.value.has(id);
const toggleHypothesisDetails = (id: string) => {
  const next = new Set(hypothesisDetailsExpanded.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  hypothesisDetailsExpanded.value = next;
};
const isHypothesisSelected = (id: string) => selectedHypothesisIds.value.includes(id);
const isHypothesisDisabled = (id: string) => !isHypothesisSelected(id) && selectedHypothesisIds.value.length >= MAX_SELECTED_HYPOTHESES;
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
const landingDone = ref<Set<string>>(new Set());
const isLandingDone = (id: string) => landingDone.value.has(id);
const toggleLandingDone = (id: string) => {
  const next = new Set(landingDone.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  landingDone.value = next;
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
