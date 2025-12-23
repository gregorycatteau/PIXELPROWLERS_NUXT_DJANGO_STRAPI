<template>
  <div class="space-y-8">
    <section class="space-y-3">
      <div class="space-y-1">
        <p class="text-sm font-semibold text-[color:var(--color-text-primary)]">
          Priorités suggérées
        </p>
      </div>

      <div v-if="recommendations.length" class="space-y-3">
        <article
          v-for="(suggestion, index) in recommendations"
          :key="suggestion.blockId"
          :class="[
            'pp-bilan-card-accent',
            'md:flex md:items-center md:justify-between md:gap-5 space-y-3 md:space-y-0',
            index === 0 ? 'pp-bilan-card-priority' : ''
          ]"
        >
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
              Priorité {{ index + 1 }}
            </p>
            <p class="text-base font-semibold text-[color:var(--color-text-primary)]">
              {{ suggestion.title }}
            </p>
            <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
              {{ suggestion.reasonText }}
            </p>
          </div>
          <div class="flex flex-wrap gap-3 md:gap-4 md:items-center">
            <button
              type="button"
              class="pp-bilan-cta-primary !px-5"
              @click="emit('explore', suggestion.questionStep)"
            >
              {{ copy.exploreCta }}
            </button>
          </div>
        </article>
      </div>

      <p v-else class="text-sm text-[color:var(--color-text-muted)]">
        Pas de priorité suggérée pour l’instant, tu peux explorer librement les blocs ci-dessous.
      </p>
    </section>

    <section class="space-y-3">
      <div class="space-y-1">
        <p class="text-sm font-semibold text-[color:var(--color-text-primary)]">
          Tous les blocs d’exploration
        </p>
      </div>

      <div class="pp-journey-block-grid">
        <PPCard
          v-for="block in blocks"
          :key="block.id"
          as="article"
          variant="soft"
          class="space-y-3"
        >
          <div class="flex items-start justify-between gap-3">
            <p class="text-base font-semibold text-[color:var(--color-text-primary)]">
              {{ block.title }}
            </p>
            <PPBadge variant="neutral" size="sm">
              {{ block.statusLabel }}
            </PPBadge>
          </div>
          <div class="flex flex-wrap gap-3 md:gap-4 md:items-center">
            <button
              type="button"
              class="pp-bilan-cta-primary !px-4"
              @click="emit('explore', block.questionStep)"
            >
              {{ copy.exploreCta }}
            </button>
            <button
              type="button"
              class="pp-bilan-cta-ghost !px-4"
              :disabled="!block.hasScores"
              @click="emit('explore', block.bilanStep)"
            >
              {{ copy.blockBilanCta }}
            </button>
          </div>
        </PPCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import type { P1BlockId } from '~/config/journeys/p1QuestionsConfig';

const props = defineProps<{
  recommendations: Array<{
    blockId: P1BlockId;
    intensity: 'low' | 'medium' | 'high';
    reasonText: string;
    title: string;
    questionStep: string;
  }>;
  blocks: Array<{
    id: string;
    title: string;
    statusLabel: string;
    hasScores: boolean;
    questionStep: string;
    bilanStep: string;
  }>;
  copy: {
    exploreCta: string;
    blockBilanCta: string;
  };
}>();

const { recommendations, blocks, copy } = toRefs(props);

const emit = defineEmits<{
  (e: 'explore', stepId: string): void;
}>();
</script>
