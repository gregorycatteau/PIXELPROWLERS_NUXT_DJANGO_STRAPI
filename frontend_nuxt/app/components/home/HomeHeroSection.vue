<template>
  <section :id="sectionId" class="home-section home-hero">
    <div class="home-hero-grid">
      <div class="home-section-header space-y-4">
        <PPPageHeader as="h1" align="center" density="comfort">
          <template #title>
            {{ title }}
          </template>

          <template #lead>
            <p>
              {{ subtitlePrimaryValue }}
            </p>
            <p v-if="subtitleSecondaryValue">
              {{ subtitleSecondaryValue }}
            </p>
          </template>

          <template #actions>
            <div class="home-hero-actions">
              <PPButton type="button" variant="primary" @click="emitPrimaryClick">
                {{ primaryCtaLabel }}
              </PPButton>
              <PPButton
                v-if="secondaryCtaLabel"
                type="button"
                variant="secondary"
                @click="emitSecondaryClick"
              >
                {{ secondaryCtaLabel }}
              </PPButton>
            </div>
          </template>
        </PPPageHeader>

        <p v-if="microcopy" class="home-hero-microcopy">
          {{ microcopy }}
        </p>
      </div>

      <div class="home-hero-visual" aria-hidden="true">
        <div class="home-hero-image-wrapper">
          <picture>
            <source srcset="/mainhero.avif" type="image/avif" />
            <source srcset="/mainhero.webp" type="image/webp" />
            <img
              :src="imageSrcValue"
              :alt="imageAltValue"
              class="home-hero-image"
              loading="lazy"
            />
          </picture>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  subtitlePrimary?: string;
  subtitle?: string;
  subtitleSecondary?: string;
  primaryCtaLabel: string;
  secondaryCtaLabel?: string;
  microcopy?: string;
  sectionId?: string;
  imageSrc?: string;
  imageAlt?: string;
}>();

const emit = defineEmits<{
  (e: 'cta-primary-click'): void;
  (e: 'cta-secondary-click'): void;
}>();

const emitPrimaryClick = () => emit('cta-primary-click');
const emitSecondaryClick = () => emit('cta-secondary-click');

const imageSrcValue = computed(() => props.imageSrc ?? '/mainhero.webp');
const imageAltValue = computed(
  () => props.imageAlt ?? 'Illustration de projet calme devant un ordinateur, moment de clarté'
);
const subtitlePrimaryValue = computed(() => props.subtitlePrimary ?? props.subtitle ?? '');
const subtitleSecondaryValue = computed(() => props.subtitleSecondary);
</script>

<style scoped>
@reference "@/assets/css/main.css";

.home-hero {
  @apply w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16 rounded-3xl border border-slate-800/60 bg-[color:var(--color-bg-hero)]/80 shadow-[var(--shadow-elevated)] relative overflow-hidden;
}

.home-section-kicker {
  @apply text-xs font-semibold uppercase tracking-[0.2em] text-orange-300/90;
}

.home-hero-actions {
  @apply flex flex-col sm:flex-row gap-3 sm:items-center;
}

.home-hero-microcopy {
  @apply text-sm text-[color:var(--color-text-muted)];
}

.home-hero-grid {
  @apply grid gap-8 lg:gap-12 lg:grid-cols-2 items-center;
}

.home-hero-visual {
  @apply relative;
}

.home-hero-image-wrapper {
  @apply relative w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-slate-800/60 bg-slate-900/60 shadow-[0_24px_80px_rgba(15,23,42,0.9)] aspect-[4/3];
}

.home-hero-image {
  @apply w-full h-full object-cover block;
}
</style>
