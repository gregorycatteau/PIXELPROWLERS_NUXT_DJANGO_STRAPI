<template>
  <section class="pp-globalbilan-card space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-[color:var(--color-text)]">{{ heading }}</p>
      <p class="text-xs text-[color:var(--color-text-muted)]">Blocs complétés : {{ completedLabel }}</p>
    </div>
    <div class="space-y-3">
      <article
        v-for="block in blocks"
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
              {{ block.completion }}%
            </span>
          </div>
          <div class="h-1.5 w-full rounded-full bg-[color:var(--color-panel)] overflow-hidden">
            <div
              class="h-full rounded-full bg-[color:var(--color-text)] transition-all"
              :style="{ width: `${block.completion}%` }"
              aria-hidden="true"
            ></div>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="pp-journey-cta-secondary text-xs sm:text-sm"
            @click="emit('open', block.id)"
          >
            {{ block.isComplete ? 'Voir le détail' : 'Continuer ce bloc' }}
          </button>
          <details
            :open="block.detailsOpen"
            class="w-full"
            @toggle="emit('toggle', { id: block.id, event: $event })"
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
  </section>
</template>

<script setup lang="ts">
type BlockTheme = { name: string; average: number; count: number };
type Block = {
  id: string;
  title: string;
  answeredCount: number;
  skippedCount: number;
  unseenCount: number;
  completion: number;
  isComplete: boolean;
  detailsOpen: boolean;
  themes: BlockTheme[];
};

const props = defineProps<{
  heading: string;
  completedLabel: string;
  blocks: Block[];
}>();

const emit = defineEmits<{
  (e: 'open', id: string): void;
  (e: 'toggle', payload: { id: string; event: Event }): void;
}>();
</script>
