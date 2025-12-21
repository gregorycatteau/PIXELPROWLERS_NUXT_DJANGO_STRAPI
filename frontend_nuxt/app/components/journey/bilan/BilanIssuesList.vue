<template>
  <section id="gb_tensions" class="pp-globalbilan-section">
    <div class="pp-globalbilan-section-header">
      <h2 class="pp-globalbilan-section-title">
        {{ title }}
      </h2>
      <p class="text-sm text-[color:var(--color-text-muted)]">
        {{ intro }}
      </p>
    </div>
    <div v-if="issues.length" class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h3 id="tensions_poids" class="text-sm font-semibold text-[color:var(--color-text)]">Ce qui pèse le plus</h3>
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <button type="button" class="pp-globalbilan-summary-chip" @click="emit('setAll', false)">
            Lecture rapide
          </button>
          <button type="button" class="pp-globalbilan-summary-chip" @click="emit('setAll', true)">
            Tout lire
          </button>
          <button type="button" class="pp-journey-cta-secondary text-xs" @click="emit('goHypotheses')">
            Passer en lecture structure
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <article
          v-for="issue in issues"
          :key="issue.id"
          class="pp-globalbilan-theme-card flex flex-col gap-4 rounded-xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] p-4"
        >
          <div class="space-y-2 max-w-[60ch] w-full mx-auto text-left">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-2">
                <span aria-hidden="true" class="text-lg leading-none shrink-0">{{ issue.icon }}</span>
                <h4 class="text-base font-semibold text-[color:var(--color-text)]">{{ issue.label }}</h4>
              </div>
              <div class="flex items-center gap-1 shrink-0" aria-hidden="true">
                <span
                  v-for="n in 5"
                  :key="`issue-${issue.id}-seg-${n}`"
                  :class="[
                    'h-1.5 w-6 rounded-full border border-[color:var(--color-stroke)]',
                    n <= issue.impactScore ? 'bg-[color:var(--color-text)]' : 'bg-[color:var(--color-panel)]'
                  ]"
                />
              </div>
            </div>
            <p class="text-sm leading-relaxed opacity-90 text-[color:var(--color-text-muted)] line-clamp-2">
              {{ issue.summaryShort }}
            </p>
          </div>
          <div class="max-w-[60ch] w-full mx-auto space-y-5 text-left">
            <div class="mt-5 pt-4 border-t border-white/10">
              <p class="text-[11px] uppercase tracking-[0.12em] opacity-60 text-[color:var(--color-text-muted)]">
                Ce que ça provoque
              </p>
              <ul class="mt-3 space-y-2 text-sm text-[color:var(--color-text)] leading-relaxed">
                <li v-for="item in issue.effects" :key="item.lead">
                  <strong class="font-medium">{{ item.lead }}</strong><span v-if="item.detail"> : {{ item.detail }}</span>
                </li>
              </ul>
            </div>
            <div class="mt-5 pt-4 border-t border-white/10 space-y-1">
              <p class="text-[11px] uppercase tracking-[0.12em] opacity-60 text-[color:var(--color-text-muted)]">
                Signaux fréquents
              </p>
              <ul class="mt-3 space-y-2 text-sm text-[color:var(--color-text)] leading-relaxed">
                <li v-for="item in issue.signals" :key="item.lead">
                  <strong class="font-medium">{{ item.lead }}</strong><span v-if="item.detail"> : {{ item.detail }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="mt-auto max-w-[60ch] w-full mx-auto pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="pp-journey-cta-secondary text-xs sm:text-sm font-medium border border-white/30"
              @click="emit('goResources')"
            >
              Voir ressources liées
            </button>
            <button
              type="button"
              class="pp-btn-ghost text-xs"
              :aria-expanded="issue.expanded"
              :aria-controls="`weight-card-${issue.id}`"
              @click="emit('toggle', issue.id)"
            >
              {{ issue.expanded ? 'Réduire' : 'En savoir plus' }}
            </button>
          </div>
          <div
            v-if="issue.expanded"
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

    <div v-if="!issues.length && !watchlist.length" class="space-y-2">
      <p class="text-sm text-[color:var(--color-text-muted)]">
        {{ emptyText }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
type IssueBullet = { lead: string; detail?: string };
type IssueCard = {
  id: string;
  label: string;
  icon: string;
  summary: string;
  summaryShort: string;
  interpretation?: string;
  impactScore: number;
  effects: IssueBullet[];
  signals: IssueBullet[];
  expanded: boolean;
};

const props = defineProps<{
  title: string;
  intro: string;
  issues: IssueCard[];
  watchlist: IssueCard[];
  focusDetails: boolean;
  emptyText: string;
}>();

const emit = defineEmits<{
  (e: 'setAll', open: boolean): void;
  (e: 'toggle', id: string): void;
  (e: 'goResources'): void;
  (e: 'goHypotheses'): void;
}>();
</script>
