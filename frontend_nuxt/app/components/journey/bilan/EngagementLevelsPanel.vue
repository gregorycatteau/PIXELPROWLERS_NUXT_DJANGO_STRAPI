<template>
  <section id="gb_engagement" class="pp-globalbilan-section space-y-3">
    <div class="pp-globalbilan-section-header">
      <h2 class="pp-globalbilan-section-title">Options de suite (N1-N4)</h2>
      <p v-if="introParagraphs.length" class="text-sm text-[color:var(--color-text-muted)]">
        <span v-for="paragraph in introParagraphs" :key="paragraph" class="block">
          {{ paragraph }}
        </span>
      </p>
    </div>

    <div class="pp-globalbilan-options-grid">
      <article v-for="level in levels" :key="level.id" class="pp-globalbilan-option-card">
        <div class="space-y-2">
          <p class="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
            {{ level.title }}
          </p>
          <p class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
            {{ level.body }}
          </p>
        </div>
        <div class="pt-2">
          <component
            :is="ctaComponent(level)"
            v-bind="ctaProps(level)"
            class="pp-globalbilan-summary-chip"
            :disabled="level.ctaTarget === 'none' || !isCtaAllowed(level)"
            @click="onCtaClick(level)"
          >
            {{ level.ctaLabel }}
          </component>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CtaTarget, EngagementLevelId } from '~/config/engagement/types';
import { isAllowlistedEngagementRoute } from '~/config/engagement/allowlist';

type EngagementLevel = {
  id: EngagementLevelId;
  title: string;
  body: string;
  ctaLabel: string;
  ctaTarget: CtaTarget;
  routePath?: string;
  tags?: string[];
  isRecommended?: boolean;
};

const props = defineProps<{
  intro?: string;
  levels: EngagementLevel[];
}>();

const emit = defineEmits<{
  (e: 'go-export'): void;
}>();

const introParagraphs = computed(() => (props.intro ?? '').split(/\n\n+/).filter(Boolean));

const isCtaAllowed = (level: EngagementLevel) => {
  if (level.ctaTarget === 'route') {
    return Boolean(level.routePath && isAllowlistedEngagementRoute(level.routePath));
  }
  return true;
};

const ctaComponent = (level: EngagementLevel) => {
  if (level.ctaTarget === 'contact') return 'NuxtLink';
  if (level.ctaTarget === 'resources') return 'NuxtLink';
  if (level.ctaTarget === 'route' && isCtaAllowed(level)) return 'NuxtLink';
  return 'button';
};

const ctaProps = (level: EngagementLevel) => {
  if (level.ctaTarget === 'contact') return { to: '/contact' };
  if (level.ctaTarget === 'resources') return { to: '/ressources' };
  if (level.ctaTarget === 'route' && isCtaAllowed(level)) return { to: level.routePath };
  return { type: 'button' };
};

const onCtaClick = (level: EngagementLevel) => {
  if (level.ctaTarget === 'export') {
    emit('go-export');
  }
};
</script>
