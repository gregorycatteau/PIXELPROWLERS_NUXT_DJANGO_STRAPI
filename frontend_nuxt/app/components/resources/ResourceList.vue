<template>
  <section class="space-y-3">
    <header v-if="title" class="space-y-1">
      <h3 class="text-base font-semibold text-[color:var(--color-text)]">{{ title }}</h3>
    </header>
    <div class="grid gap-3 md:grid-cols-2" :class="variant === 'full' ? 'lg:grid-cols-3' : ''">
      <article
        v-for="resource in resources"
        :key="resource.id"
        class="pp-journey-card-soft space-y-2"
      >
        <div class="space-y-1">
          <p class="text-sm font-semibold text-[color:var(--color-text)]">
            {{ resource.title }}
          </p>
          <p class="text-xs text-[color:var(--color-text-muted)] leading-relaxed">
            {{ resource.summary }}
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in resource.tags"
            :key="tag"
            class="px-2 py-1 rounded-full bg-[color:var(--color-surface-strong)] text-[11px] text-[color:var(--color-text-muted)]"
          >
            {{ tag }}
          </span>
          <span
            v-if="resource.timeToUse"
            class="px-2 py-1 rounded-full bg-[color:var(--color-surface-strong)] text-[11px] text-[color:var(--color-text-muted)]"
          >
            {{ resource.timeToUse }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-[11px] text-[color:var(--color-text-muted)]">
            {{ resource.format || 'Markdown' }}
          </p>
          <a :href="resource.filePath" download class="pp-btn-ghost text-xs">
            Télécharger
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { P1Resource } from '@/config/resources/p1ResourcesV1_3';

withDefaults(
  defineProps<{
    title?: string;
    resources: P1Resource[];
    variant?: 'compact' | 'full';
  }>(),
  {
    title: undefined,
    variant: 'full'
  }
);
</script>
