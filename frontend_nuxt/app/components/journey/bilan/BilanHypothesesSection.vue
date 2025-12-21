<template>
  <section id="gb_hypotheses" class="pp-globalbilan-section">
    <div class="pp-globalbilan-section-header space-y-1">
      <h2 class="pp-globalbilan-section-title">
        Hypothèses structurantes
      </h2>
      <p class="text-sm text-[color:var(--color-text-muted)]">
        On passe de ce que tu ressens à ce qui tient ton système. Choisis 1–2 hypothèses à vérifier en premier.
      </p>
      <p class="text-xs font-semibold text-[color:var(--color-text)]">Sélection : {{ selectionCount }}</p>
    </div>

    <div v-if="hypotheses.length" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <article
          v-for="hypo in hypotheses"
          :key="hypo.id"
          class="pp-globalbilan-theme-card flex flex-col gap-4 rounded-xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] p-4"
          :class="hypo.selected ? 'border-[color:var(--color-primary)] ring-1 ring-[color:var(--color-primary)]' : ''"
        >
          <div class="flex items-start justify-between gap-3">
            <span class="pp-globalbilan-summary-chip">Hypothèse {{ hypo.index }}</span>
            <button
              type="button"
              class="pp-journey-cta-secondary text-xs"
              :class="[
                hypo.selected ? 'border-[color:var(--color-primary)] text-[color:var(--color-text)]' : '',
                hypo.disabled ? 'opacity-60 cursor-not-allowed' : ''
              ]"
              :disabled="hypo.disabled"
              @click="emit('toggle', hypo.id)"
            >
              {{ hypo.selected ? 'Gardée' : 'Je la garde' }}
            </button>
          </div>
          <div class="space-y-3 max-w-[60ch] text-left">
            <h3 class="text-base font-semibold text-[color:var(--color-text)] leading-snug">
              {{ hypo.title }}
            </h3>
            <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed line-clamp-2">
              Ce que ça explique : <span class="text-[color:var(--color-text)]">{{ hypo.summary }}</span>
            </p>
          </div>
          <div class="max-w-[60ch] text-left space-y-5 leading-relaxed">
            <div class="mt-5 pt-4 border-t border-white/10">
              <p class="text-[11px] uppercase tracking-[0.12em] opacity-60 text-[color:var(--color-text-muted)]">
                Signaux typiques
              </p>
              <ul class="mt-3 space-y-2 text-sm text-[color:var(--color-text)] leading-relaxed">
                <li v-for="item in hypo.signals" :key="item.lead">
                  <strong class="font-medium">{{ item.lead }}</strong><span v-if="item.detail" class="line-clamp-2"> : {{ item.detail }}</span>
                </li>
                <li v-if="!hypo.signals.length" class="text-[color:var(--color-text-muted)]">
                  À préciser lors des échanges.
                </li>
              </ul>
            </div>
            <div class="mt-5 pt-4 border-t border-white/10">
              <p class="text-[11px] uppercase tracking-[0.12em] opacity-60 text-[color:var(--color-text-muted)]">
                Ce que ça coûte
              </p>
              <ul class="mt-3 space-y-2 text-sm text-[color:var(--color-text)] leading-relaxed">
                <li v-for="item in hypo.costs" :key="item.lead">
                  <strong class="font-medium">{{ item.lead }}</strong><span v-if="item.detail" class="line-clamp-2"> : {{ item.detail }}</span>
                </li>
                <li v-if="!hypo.costs.length" class="text-[color:var(--color-text-muted)]">
                  Non renseigné ici — à discuter.
                </li>
              </ul>
            </div>
            <div class="mt-5 pt-4 border-t border-white/10">
              <p class="text-[11px] uppercase tracking-[0.12em] opacity-60 text-[color:var(--color-text-muted)]">
                Test rapide
              </p>
              <ul class="mt-3 space-y-2 text-sm text-[color:var(--color-text)] leading-relaxed">
                <li v-for="item in hypo.tests" :key="item.lead">
                  <strong class="font-medium">{{ item.lead }}</strong><span v-if="item.detail" class="line-clamp-2"> : {{ item.detail }}</span>
                </li>
                <li v-if="!hypo.tests.length" class="text-[color:var(--color-text-muted)]">
                  À définir ensemble.
                </li>
              </ul>
            </div>
          </div>
          <div class="mt-auto max-w-[60ch] w-full text-left pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="pp-btn-ghost text-xs inline-flex items-center gap-1"
              :aria-expanded="hypo.detailsOpen"
              :aria-controls="`hypo-card-${hypo.id}`"
              @click="emit('toggleDetails', hypo.id)"
            >
              <span aria-hidden="true">{{ hypo.detailsOpen ? '▾' : '▸' }}</span>
              {{ hypo.detailsOpen ? 'Réduire les détails' : 'Détails' }}
            </button>
            <span
              v-if="hypo.disabled && !hypo.selected"
              class="text-[10px] text-[color:var(--color-text-muted)]"
            >
              Max 2 sélectionnées
            </span>
          </div>
          <div
            v-if="hypo.detailsOpen"
            :id="`hypo-card-${hypo.id}`"
            class="max-w-[60ch] text-left space-y-2 text-sm text-[color:var(--color-text-muted)] leading-relaxed"
          >
            <p>{{ hypo.body }}</p>
            <p v-if="hypo.whyItMatters">{{ hypo.whyItMatters }}</p>
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
          <p class="text-xs text-[color:var(--color-text-muted)]">Sélection : {{ selectionCount }}</p>
        </div>
        <div v-if="!verificationPlans.length" class="text-sm text-[color:var(--color-text-muted)]">
          Sélectionne 1–2 hypothèses pour générer un plan de vérification léger.
        </div>
        <div v-else class="space-y-3">
          <article
            v-for="plan in verificationPlans"
            :key="plan.id"
            class="rounded-lg border border-white/20 bg-[color:var(--color-panel-soft)] p-4 space-y-3"
          >
            <p class="text-sm font-semibold text-[color:var(--color-text)]">{{ plan.title }}</p>
            <ol class="list-decimal list-inside space-y-1 text-sm text-[color:var(--color-text-muted)]">
              <li v-for="step in plan.steps" :key="step">{{ step }}</li>
            </ol>
            <button type="button" class="pp-journey-cta-secondary text-xs font-medium" @click="emit('goAtterrissage')">
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
</template>

<script setup lang="ts">
type IssueBullet = { lead: string; detail?: string };
type HypothesisCard = {
  id: string;
  index: number;
  title: string;
  summary: string;
  signals: IssueBullet[];
  costs: IssueBullet[];
  tests: IssueBullet[];
  rationaleLines?: string[];
  firstCheck?: string;
  body?: string;
  whyItMatters?: string;
  detailsOpen: boolean;
  selected: boolean;
  disabled: boolean;
};

type SecondaryHypothesis = { id: string; title: string };

const props = defineProps<{
  hypotheses: HypothesisCard[];
  secondaryHypotheses: SecondaryHypothesis[];
  selectionCount: string;
  verificationPlans: { id: string; title: string; steps: string[] }[];
}>();

const emit = defineEmits<{
  (e: 'toggle', id: string): void;
  (e: 'toggleDetails', id: string): void;
  (e: 'goAtterrissage'): void;
}>();
</script>
