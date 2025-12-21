<template>
  <section class="pp-journey-section space-y-4" aria-labelledby="p1-systemic-landing">
    <div class="space-y-2">
      <h2 id="p1-systemic-landing" class="pp-journey-title text-lg">
        {{ title || 'Atterrissage systémique' }}
      </h2>
      <p class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">
        Les tensions humaines sont souvent le symptôme. Voici 2–3 vérifications système qui valent le coup.
      </p>
    </div>

    <div v-if="mainCards && mainCards.length" class="grid gap-4 md:grid-cols-2">
      <article
        v-for="card in mainCards"
        :key="card.id"
        class="pp-journey-card-soft space-y-2"
      >
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-semibold">
            {{ card.title }}
          </h3>
          <p class="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
            {{ displayStatus(card.id) }}
          </p>
        </div>
        <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
          {{ card.body }}
        </p>
        <div v-if="card.firstChecks?.length" class="space-y-1">
          <p class="text-sm font-semibold text-[color:var(--color-text)]">
            Première vérif
          </p>
          <ul class="list-disc list-inside text-sm text-[color:var(--color-text-muted)] space-y-0.5">
            <li v-for="check in card.firstChecks" :key="check">
              {{ check }}
            </li>
          </ul>
        </div>

        <div v-if="followupPacks?.[card.id]" class="space-y-3">
          <p class="text-xs text-[color:var(--color-text-muted)] font-semibold">
            Première vérif (optionnel)
          </p>
          <div
            v-for="question in followupPacks[card.id]"
            :key="question.id"
            class="space-y-2"
          >
            <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
              {{ question.assertion }}
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                class="pp-btn-ghost text-xs"
                :class="answers[question.id] === n ? 'border border-[color:var(--color-primary)]' : ''"
                @click="$emit('answer', { cardId: card.id, questionId: question.id, value: n })"
              >
                {{ n }}
              </button>
              <button
                type="button"
                class="pp-btn-ghost text-xs"
                @click="$emit('answer', { cardId: card.id, questionId: question.id, value: null })"
              >
                Passer
              </button>
            </div>
          </div>
          <button
            type="button"
            class="pp-btn-ghost text-xs"
            @click="$emit('skip-card', card.id)"
          >
            Passer cette vérif
          </button>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="pp-btn-ghost text-xs" @click="$emit('persist')">
              Enregistrer ces vérifs
            </button>
            <button type="button" class="pp-btn-ghost text-xs" @click="$emit('reset-card', card.id)">
              Effacer
            </button>
          </div>
        </div>

        <div class="space-y-2 border border-neutral-800 rounded-md p-3">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-semibold text-[color:var(--color-text)]">
              {{ P1_SYSTEM_SHIFT_COPY.title }}
            </p>
          </div>
          <p class="text-xs text-[color:var(--color-text-muted)]">
            {{ P1_SYSTEM_SHIFT_COPY.prompt }}
          </p>
          <p class="text-[11px] text-[color:var(--color-text-muted)]">
            {{ P1_SYSTEM_SHIFT_COPY.helperText }}
          </p>
          <div class="grid grid-cols-1 gap-2">
            <label
              v-for="option in P1_SYSTEM_SHIFT_COPY.options"
              :key="option.id"
              class="flex items-center gap-2 text-sm text-[color:var(--color-text)]"
            >
              <input
                type="radio"
                :name="`system-shift-${card.id}`"
                class="accent-[color:var(--color-primary)]"
                :value="option.id"
                v-model="shiftModel[card.id]"
                @change="$emit('shift-change', { cardId: card.id, optionId: option.id })"
              />
              <span>{{ option.id }} — {{ option.label }}</span>
            </label>
          </div>
        </div>

        <div v-if="scalpelCopy[card.id]" class="space-y-2 rounded-md border border-neutral-800 p-3">
          <p class="text-sm font-semibold text-[color:var(--color-text)]">Question scalpel</p>
          <p class="text-sm text-[color:var(--color-text)] leading-relaxed">
            {{ scalpelCopy[card.id]?.scalpelQuestion }}
          </p>
          <p class="text-xs text-[color:var(--color-text-muted)]">
            {{ scalpelCopy[card.id]?.whyItChangesEverything }}
          </p>
          <div class="space-y-0.5">
            <p class="text-xs font-semibold text-[color:var(--color-text)]">
              Première vérif
            </p>
            <p class="text-xs text-[color:var(--color-text-muted)]">
              {{ scalpelCopy[card.id]?.firstCheck }}
            </p>
          </div>
          <div v-if="scalpelCopy[card.id]?.counterHypothesis" class="space-y-0.5">
            <p class="text-xs font-semibold text-[color:var(--color-text)]">
              Contre-hypothèse
            </p>
            <p class="text-xs text-[color:var(--color-text-muted)]">
              {{ scalpelCopy[card.id]?.counterHypothesis }}
            </p>
          </div>
        </div>
      </article>
    </div>
    <p v-else class="pp-journey-body text-sm text-[color:var(--color-text-muted)]">
      À ce stade, aucune vérification système évidente ne ressort.
    </p>

    <div v-if="secondaryCards && secondaryCards.length" class="space-y-2">
      <button
        type="button"
        class="pp-btn-ghost text-xs"
        @click="showSecondary = !showSecondary"
      >
        {{ showSecondary ? 'Masquer les autres vérifications' : 'Voir d’autres vérifications' }}
      </button>
      <div v-if="showSecondary" class="grid gap-3 md:grid-cols-2">
        <article
          v-for="card in secondaryCards"
          :key="card.id"
          class="pp-journey-card-soft space-y-2"
        >
          <h3 class="text-base font-semibold">
            {{ card.title }}
          </h3>
          <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
            {{ card.body }}
          </p>
          <div v-if="card.firstChecks?.length" class="space-y-1">
            <p class="text-sm font-semibold text-[color:var(--color-text)]">
              Première vérif
            </p>
            <ul class="list-disc list-inside text-sm text-[color:var(--color-text-muted)] space-y-0.5">
              <li v-for="check in card.firstChecks" :key="check">
                {{ check }}
              </li>
            </ul>
          </div>
          <div v-if="scalpelCopy[card.id]" class="space-y-2 rounded-md border border-neutral-800 p-3">
            <p class="text-sm font-semibold text-[color:var(--color-text)]">Question scalpel</p>
            <p class="text-sm text-[color:var(--color-text)] leading-relaxed">
              {{ scalpelCopy[card.id]?.scalpelQuestion }}
            </p>
            <p class="text-xs text-[color:var(--color-text-muted)]">
              {{ scalpelCopy[card.id]?.whyItChangesEverything }}
            </p>
            <div class="space-y-0.5">
              <p class="text-xs font-semibold text-[color:var(--color-text)]">
                Première vérif
              </p>
              <p class="text-xs text-[color:var(--color-text-muted)]">
                {{ scalpelCopy[card.id]?.firstCheck }}
              </p>
            </div>
            <div v-if="scalpelCopy[card.id]?.counterHypothesis" class="space-y-0.5">
              <p class="text-xs font-semibold text-[color:var(--color-text)]">
                Contre-hypothèse
              </p>
              <p class="text-xs text-[color:var(--color-text-muted)]">
                {{ scalpelCopy[card.id]?.counterHypothesis }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { P1_SYSTEM_SHIFT_COPY } from '@/config/journeys/p1SystemShiftCopyV1_3';
import { P1_SYSTEM_SCALPELS_COPY } from '@/config/journeys/p1SystemScalpelsCopyV1_3';

type Card = {
  id: string;
  title: string;
  body: string;
  firstChecks: string[];
  confidenceHint?: 'confirmed' | 'protected' | 'unclear';
};

type FollowupQuestion = {
  id: string;
  assertion: string;
};

type ScalpelCopy = {
  title: string;
  scalpelQuestion: string;
  whyItChangesEverything: string;
  firstCheck: string;
  counterHypothesis?: string;
};

const props = defineProps<{
  title?: string;
  mainCards: Card[];
  secondaryCards?: Card[];
  followupPacks?: Record<string, FollowupQuestion[]>;
  answers: Record<string, number | null | undefined>;
  statuses?: Record<string, 'answered' | 'skipped' | 'missing'>;
  persistedStatuses?: Record<string, 'answered' | 'skipped' | 'missing'>;
  shiftSelections?: Record<string, string | undefined>;
}>();

const statusLabel = (status: 'answered' | 'skipped' | 'missing') => {
  if (status === 'answered') return 'Vérif faite';
  if (status === 'skipped') return 'Vérif passée';
  return 'Vérif non faite';
};

const displayStatus = (cardId: string) => {
  const runtimeStatus = props.statuses?.[cardId] ?? 'missing';
  const persistedStatus = props.persistedStatuses?.[cardId];
  if (persistedStatus === 'answered') return 'Confirmé';
  if (persistedStatus === 'skipped') return 'Zone protégée';
  if (runtimeStatus === 'answered') return 'À confirmer';
  return 'Manquant';
};

const showSecondary = ref(false);
const shiftModel = ref<Record<string, string | undefined>>({ ...(props.shiftSelections ?? {}) });
const scalpelCopy = P1_SYSTEM_SCALPELS_COPY as Record<string, ScalpelCopy>;
</script>

<style scoped>
</style>
