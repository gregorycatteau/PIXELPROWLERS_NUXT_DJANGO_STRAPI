<template>
  <section id="gb_atterrissage" class="pp-globalbilan-section">
    <div
      :id="'p1-atterrissage'"
      class="pp-globalbilan-section-header"
      :class="highlight ? 'ring-2 ring-[color:var(--color-primary)] rounded-lg' : ''"
    >
      <h2 class="pp-globalbilan-section-title">Atterrissage systémique</h2>
      <p class="text-sm text-[color:var(--color-text-muted)]">
        Objectif : vérifier et stabiliser, pas “tout résoudre” en une fois.
      </p>
    </div>
    <div class="space-y-4">
      <div v-if="!plans.length" class="pp-globalbilan-card space-y-3 max-w-3xl">
        <p class="text-sm text-[color:var(--color-text-muted)]">
          Choisis 1–2 hypothèses structurantes pour générer un protocole d’atterrissage ciblé.
        </p>
        <button type="button" class="pp-journey-cta-secondary text-xs w-fit" @click="emit('backToHypotheses')">
          Revenir aux hypothèses
        </button>
      </div>
      <div v-else class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-semibold text-[color:var(--color-text)]">Protocole basé sur tes hypothèses gardées</p>
          <button type="button" class="pp-journey-cta-secondary text-xs" @click="emit('backToHypotheses')">
            Revenir aux hypothèses
          </button>
        </div>
        <div v-if="plans.length > 1" class="pp-globalbilan-card text-sm text-[color:var(--color-text-muted)] space-y-1 max-w-3xl">
          <p class="font-semibold text-[color:var(--color-text)]">Ordre suggéré</p>
          <ol class="list-decimal list-inside space-y-0.5">
            <li v-for="(plan, idx) in plans" :key="plan.id">{{ idx + 1 }} — {{ plan.title }}</li>
          </ol>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <article
            v-for="plan in plans"
            :key="plan.id"
            class="flex flex-col gap-3 rounded-xl border border-white/20 bg-[color:var(--color-panel-soft)] p-4"
            :class="plan.done ? 'border-[color:var(--color-primary)] ring-1 ring-[color:var(--color-primary)]' : ''"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="space-y-1 max-w-[56ch]">
                <p class="text-sm font-semibold text-[color:var(--color-text)] leading-snug">{{ plan.title }}</p>
                <p class="text-xs text-[color:var(--color-text-muted)]">Temps estimé : {{ plan.timeEstimate }}</p>
              </div>
              <button
                type="button"
                class="pp-journey-cta-secondary text-[11px]"
                @click="emit('toggleDone', plan.id)"
              >
                {{ plan.done ? 'Marqué fait' : 'Marquer fait' }}
              </button>
            </div>
            <ol class="list-decimal list-inside space-y-1.5 text-sm text-[color:var(--color-text)] leading-relaxed max-w-[60ch]">
              <li v-for="step in plan.steps" :key="step" class="line-clamp-2">
                {{ step }}
              </li>
            </ol>
            <div class="text-sm text-[color:var(--color-text-muted)]">
              Résultat attendu : <span class="text-[color:var(--color-text)]">{{ plan.expectedOutcome }}</span>
            </div>
            <div class="flex flex-wrap items-center gap-2 pt-2">
              <button type="button" class="pp-journey-cta-secondary text-xs font-medium" @click="emit('goResources')">
                Voir ressources liées
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
type LandingPlanCard = {
  id: string;
  title: string;
  timeEstimate: string;
  steps: string[];
  expectedOutcome: string;
  done: boolean;
};

const props = defineProps<{
  plans: LandingPlanCard[];
  highlight: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggleDone', id: string): void;
  (e: 'goResources'): void;
  (e: 'backToHypotheses'): void;
}>();
</script>
