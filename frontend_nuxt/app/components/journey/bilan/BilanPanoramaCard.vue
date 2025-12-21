<template>
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
              Répondu : {{ answeredCount }} · Non répondu : {{ skippedCount }}
            </p>
          </div>
          <span
            class="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] px-3 py-1 text-[11px] font-semibold text-[color:var(--color-text)]"
          >
            {{ completenessLabel }}
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
            v-for="axis in axes"
            :key="axis.id"
            class="pp-globalbilan-axe-card h-full w-full min-w-0 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span aria-hidden="true" class="shrink-0 text-base leading-none">{{ axis.emoji }}</span>
              <div class="font-semibold whitespace-normal break-words leading-snug">
                {{ axis.label }}
              </div>
            </div>
            <div class="flex items-center justify-end gap-2 min-w-0 min-h-[24px]">
              <span
                v-if="axis.isPriority"
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
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
type Axis = {
  id: string;
  label: string;
  emoji: string;
  score: number;
  isPriority: boolean;
};

const props = defineProps<{
  answeredCount: number;
  skippedCount: number;
  completenessLabel: string;
  axes: Axis[];
}>();

const filledSegments = (score: number) => Math.max(0, Math.min(5, Math.round(score)));
const priorityLabel = (score: number) => {
  if (score >= 4) return 'Prioritaire';
  if (score >= 2) return 'À surveiller';
  return 'Secondaire';
};
</script>
