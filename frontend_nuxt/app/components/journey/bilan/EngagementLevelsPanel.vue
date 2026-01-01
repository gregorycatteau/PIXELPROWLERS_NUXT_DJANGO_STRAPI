<template>
  <section id="gb_engagement" class="pp-globalbilan-section space-y-3">
    <PPSectionHeader
      as="h2"
      density="comfort"
      title="Options de suite (N1-N4)"
      :lead="introParagraphs.join(' ')"
    />

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
          <PPChip
            :as="ctaComponent(level)"
            v-bind="ctaProps(level)"
            variant="outline"
            size="sm"
            :selected="false"
            :disabled="level.ctaTarget === 'none' || !isCtaAllowed(level)"
            @click="onCtaClick(level)"
          >
            {{ level.ctaLabel }}
          </PPChip>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CtaTarget, EngagementLevelId } from '~/config/engagement/types';
import { buildResourcesDeepLink } from '~/utils/deeplinks/resourcesDeepLink';
import { safeRoutePath } from '~/utils/cta/safeCta';

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

const CONTACT_ROUTE = safeRoutePath('/contact');
const RESOURCES_ROUTE = buildResourcesDeepLink({});

const safeRouteTarget = (target?: string | null) => {
  if (!target) return null;
  try {
    return safeRoutePath(target);
  } catch {
    return null;
  }
};

const isCtaAllowed = (level: EngagementLevel) => {
  if (level.ctaTarget === 'route') {
    return Boolean(safeRouteTarget(level.routePath));
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
  if (level.ctaTarget === 'contact') return { to: CONTACT_ROUTE };
  if (level.ctaTarget === 'resources') return { to: RESOURCES_ROUTE };
  if (level.ctaTarget === 'route' && isCtaAllowed(level)) {
    const to = safeRouteTarget(level.routePath);
    if (!to) return { type: 'button' };
    return { to };
  }
  return { type: 'button' };
};

const onCtaClick = (level: EngagementLevel) => {
  if (level.ctaTarget === 'export') {
    emit('go-export');
  }
};
</script>
