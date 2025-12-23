<template>
  <section id="gb_atterrissage" class="pp-globalbilan-section">
    <PPSectionHeader
      :id="'p1-atterrissage'"
      as="h2"
      density="comfort"
      title="Atterrissage systémique"
      lead="Objectif : vérifier et stabiliser, pas « tout résoudre » en une fois."
    />

    <div class="space-y-4">
      <!-- Empty state: no plans yet -->
      <PPCard v-if="!plans.length" as="div" variant="soft" class="space-y-3 max-w-3xl">
        <p class="text-sm text-[color:var(--color-text-muted)]">
          Choisis 1–2 hypothèses structurantes pour générer un protocole d'atterrissage ciblé.
        </p>
        <button type="button" class="pp-journey-cta-secondary text-xs w-fit" @click="emit('backToHypotheses')">
          Revenir aux hypothèses
        </button>
      </PPCard>

      <!-- Plans present -->
      <div v-else class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-semibold text-[color:var(--color-text)]">Protocole basé sur tes hypothèses gardées</p>
          <button type="button" class="pp-journey-cta-secondary text-xs" @click="emit('backToHypotheses')">
            Revenir aux hypothèses
          </button>
        </div>

        <!-- Suggested order when multiple plans -->
        <PPCard v-if="plans.length > 1" as="div" variant="soft" class="text-sm text-[color:var(--color-text-muted)] space-y-1 max-w-3xl">
          <p class="font-semibold text-[color:var(--color-text)]">Ordre suggéré</p>
          <ol class="list-decimal list-inside space-y-0.5">
            <li v-for="(plan, idx) in plans" :key="plan.id">{{ idx + 1 }} — {{ plan.title }}</li>
          </ol>
        </PPCard>

        <!-- Landing plans using PPAtterrissagePlan -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <PPAtterrissagePlan
            v-for="plan in plans"
            :key="plan.id"
            :ref="(el) => setPlanRef(plan.id, el)"
            :title="plan.title"
            :description="`Temps estimé : ${plan.timeEstimate}`"
            :steps="mapSteps(plan.steps)"
            :expected-outcome="plan.expectedOutcome"
            :highlight="highlight && plan.id === highlightedPlanId"
            :heading-id="`atterrissage-plan-${plan.id}`"
            outcome-label="Résultat attendu"
          >
            <template #actions>
              <button
                type="button"
                class="pp-journey-cta-secondary text-[11px]"
                @click="emit('toggleDone', plan.id)"
              >
                {{ plan.done ? 'Marqué fait' : 'Marquer fait' }}
              </button>
              <button type="button" class="pp-journey-cta-secondary text-xs font-medium" @click="emit('goResources')">
                Voir ressources liées
              </button>
            </template>
          </PPAtterrissagePlan>
        </div>
      </div>
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';

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

// Track refs for each plan
const planRefs = ref<Map<string, any>>(new Map());

const setPlanRef = (id: string, el: any) => {
  if (el) {
    planRefs.value.set(id, el);
  }
};

// First plan gets highlighted when highlight prop is true
const highlightedPlanId = computed(() => props.plans[0]?.id ?? null);

// Map steps array to PPAtterrissagePlan format
const mapSteps = (steps: string[]) => 
  steps.map((step) => ({
    title: step
  }));

// When highlight changes, trigger highlight on first plan
watch(
  () => props.highlight,
  async (newVal) => {
    const planId = highlightedPlanId.value;
    if (newVal && planId) {
      await nextTick();
      const firstPlanRef = planRefs.value.get(planId);
      if (firstPlanRef?.triggerHighlight) {
        firstPlanRef.triggerHighlight();
      }
    }
  }
);
</script>
