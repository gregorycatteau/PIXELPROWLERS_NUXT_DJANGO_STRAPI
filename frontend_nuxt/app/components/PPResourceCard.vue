<template>
  <PPCard as="article" variant="soft" class="pp-resource-card">
    <!-- Header: title + badge -->
    <div class="pp-resource-card__header">
      <span class="pp-resource-card__title">{{ title }}</span>
      <PPBadge
        v-if="badge"
        :variant="badge.variant"
        size="sm"
        :aria-label="badge.ariaLabel"
      >
        {{ badge.label }}
      </PPBadge>
    </div>

    <!-- Description -->
    <p v-if="description" class="pp-resource-card__description">
      {{ description }}
    </p>

    <!-- Meta row: chips (kind, effort, impact) -->
    <div v-if="hasMetaOrChips" class="pp-resource-card__meta">
      <PPChip v-if="meta?.kind" variant="tag" size="sm">
        {{ kindLabel }}
      </PPChip>
      <PPChip v-if="meta?.effort" variant="stat" size="sm">
        {{ meta.effort }}
      </PPChip>
      <PPChip v-if="meta?.impact" variant="stat" size="sm">
        {{ meta.impact }}
      </PPChip>
      <PPChip
        v-for="(chip, idx) in chips"
        :key="idx"
        :variant="chip.variant"
        size="sm"
      >
        {{ chip.label }}
      </PPChip>
    </div>

    <!-- CTA row -->
    <div class="pp-resource-card__cta">
      <!-- External link -->
      <a
        v-if="sanitizedHref"
        :href="sanitizedHref"
        target="_blank"
        rel="noopener noreferrer"
        class="pp-journey-cta-secondary text-xs"
        :aria-label="ctaAriaLabel"
      >
        <slot name="cta-label">Voir la ressource</slot>
        <span class="sr-only">(ouvre un nouvel onglet)</span>
      </a>
      <!-- Internal link -->
      <NuxtLink
        v-else-if="to"
        :to="to"
        class="pp-journey-cta-secondary text-xs"
        :aria-label="ctaAriaLabel"
      >
        <slot name="cta-label">Continuer</slot>
      </NuxtLink>
      <!-- Default slot for custom CTA -->
      <slot v-else name="cta" />
    </div>
  </PPCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export type ResourceKind = 'tool' | 'read' | 'watch' | 'template';
export type ChipVariant = 'stat' | 'tag' | 'action';
export type BadgeVariant = 'status' | 'risk' | 'info';

export interface ResourceMeta {
  kind?: ResourceKind;
  effort?: string;
  impact?: string;
}

export interface ResourceBadge {
  variant: BadgeVariant;
  label: string;
  ariaLabel?: string;
}

export interface ResourceChip {
  variant: ChipVariant;
  label: string;
}

export interface PPResourceCardProps {
  /** Resource title */
  title: string;
  /** Optional description */
  description?: string;
  /** External URL (mutually exclusive with `to`) */
  href?: string;
  /** Internal route (mutually exclusive with `href`) */
  to?: string | RouteLocationRaw;
  /** Metadata: kind, effort, impact */
  meta?: ResourceMeta;
  /** Badge display */
  badge?: ResourceBadge;
  /** Additional chips */
  chips?: ResourceChip[];
  /** Aria label for CTA */
  ctaAriaLabel?: string;
}

const props = withDefaults(defineProps<PPResourceCardProps>(), {
  description: undefined,
  href: undefined,
  to: undefined,
  meta: undefined,
  badge: undefined,
  chips: () => [],
  ctaAriaLabel: undefined,
});

// Kind label mapping
const KIND_LABELS: Record<ResourceKind, string> = {
  tool: 'Outil',
  read: 'Lecture',
  watch: 'Vidéo',
  template: 'Template',
};

const kindLabel = computed(() =>
  props.meta?.kind ? KIND_LABELS[props.meta.kind] : ''
);

const hasMetaOrChips = computed(() =>
  props.meta?.kind || props.meta?.effort || props.meta?.impact || (props.chips?.length ?? 0) > 0
);

/**
 * Sanitize external href:
 * - Only allow http:// and https:// protocols
 * - Strip UTM parameters silently
 * - Block javascript:, data:, etc.
 */
const sanitizedHref = computed(() => {
  if (!props.href) return null;

  const href = props.href.trim();

  // Allowlist: only http/https
  if (!href.startsWith('http://') && !href.startsWith('https://')) {
    return null; // Block javascript:, data:, file:, etc.
  }

  try {
    const url = new URL(href);

    // Strip UTM parameters silently
    const paramsToRemove: string[] = [];
    url.searchParams.forEach((_, key) => {
      if (key.toLowerCase().startsWith('utm_')) {
        paramsToRemove.push(key);
      }
    });
    paramsToRemove.forEach((key) => url.searchParams.delete(key));

    return url.toString();
  } catch {
    return null; // Invalid URL
  }
});
</script>

<style scoped>
.pp-resource-card {
  display: flex;
  flex-direction: column;
  gap: var(--pp-spacing-2, 0.5rem);
}

.pp-resource-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--pp-spacing-2, 0.5rem);
}

.pp-resource-card__title {
  font-size: var(--pp-font-size-sm, 0.875rem);
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
}

.pp-resource-card__description {
  font-size: var(--pp-font-size-sm, 0.875rem);
  color: var(--color-text-muted);
  line-height: 1.5;
}

.pp-resource-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--pp-spacing-1, 0.25rem);
}

.pp-resource-card__cta {
  margin-top: auto;
  padding-top: var(--pp-spacing-1, 0.25rem);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
