<template>
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
      <button type="button" class="pp-journey-cta-primary" @click="onCopy">
        {{ copy.copyCta }}
      </button>
      <button type="button" class="pp-journey-cta-secondary" @click="onPrint">{{ copy.printCta }}</button>
      <button type="button" class="pp-journey-cta-secondary" @click="onBackToHub">
        {{ copy.backToHub }}
      </button>
      <button type="button" class="pp-journey-cta-secondary" @click="onClear">
        {{ eraseCopyLabel }}
      </button>
      <span v-if="copied" class="text-sm text-[color:var(--color-text-muted)]">Copié dans le presse-papier.</span>
    </div>
    <p v-if="globalSkipText" class="text-sm text-[color:var(--color-text-muted)]">
      {{ globalSkipText }}
    </p>
    <p v-if="hasGlobalMissing" class="text-sm text-[color:var(--color-text-muted)]">
      {{ missingInfo }}
    </p>
    <p v-if="clearMessage" class="text-sm text-[color:var(--color-text-muted)]">
      {{ clearMessage }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { JourneyManifestV1 } from '~/config/journeys/manifests/types';
import type { GlobalBilanViewModel } from '~/types/bilan';
import type { RecommendationResult } from '~/utils/reco/types';
import { buildUniversalBilanMarkdown } from '~/utils/export/buildUniversalBilanMarkdown';

type GlobalCopy = {
  exportHeading: string;
  exportNotice: string;
  sovereigntyNote: string;
  copyCta: string;
  printCta: string;
  backToHub: string;
};

const props = defineProps<{
  copy: GlobalCopy;
  manifest: JourneyManifestV1 | null;
  vm: GlobalBilanViewModel;
  recommendations?: RecommendationResult | null;
  focusDetails: boolean;
  eraseCopyLabel: string;
  copied: boolean;
  globalSkipText: string;
  hasGlobalMissing: boolean;
  missingInfo: string;
  clearMessage: string;
}>();

const exportText = computed(() =>
  buildUniversalBilanMarkdown({
    manifest: props.manifest,
    vm: props.vm,
    recommendations: props.recommendations ?? null
  })
);

const emit = defineEmits<{
  (e: 'copy'): void;
  (e: 'print'): void;
  (e: 'backToHub'): void;
  (e: 'clear'): void;
}>();

const onCopy = () => emit('copy');
const onPrint = () => emit('print');
const onBackToHub = () => emit('backToHub');
const onClear = () => emit('clear');
</script>
