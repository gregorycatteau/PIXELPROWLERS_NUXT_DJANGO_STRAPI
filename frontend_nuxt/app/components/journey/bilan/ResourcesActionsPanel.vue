<template>
  <section id="gb_resources_actions" class="pp-globalbilan-section space-y-4">
    <div class="pp-globalbilan-section-header">
      <h2 class="pp-globalbilan-section-title">Actions & ressources</h2>
      <p class="text-sm text-[color:var(--color-text-muted)]">
        Recommandations et bibliotheque pour avancer a ton rythme.
      </p>
    </div>

    <div v-if="hasRecommended" class="space-y-3">
      <h3 class="text-sm font-semibold">Recommande</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <article v-for="item in recommended" :key="item.id" class="pp-journey-card-soft space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
              {{ item.kind === 'resource' ? 'Ressource' : 'Action' }}
              <span v-if="item.horizon">· {{ item.horizon }}</span>
            </p>
            <span v-if="item.format" class="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
              {{ item.format }}
            </span>
          </div>
          <p class="text-sm font-semibold">{{ item.title }}</p>
          <p v-if="item.description" class="text-sm text-[color:var(--color-text-muted)]">
            {{ item.description }}
          </p>
          <p v-if="item.reason" class="text-xs text-[color:var(--color-text-muted)]">
            {{ item.reason }}
          </p>
          <div class="pt-1">
            <component
              :is="ctaComponent(item)"
              v-bind="ctaProps(item)"
              class="pp-btn-ghost text-xs"
              :disabled="!isCtaEnabled(item)"
              :aria-label="ctaAria(item)"
              @click="onCtaClick(item)"
            >
              {{ item.cta.label }}
            </component>
          </div>
        </article>
      </div>
    </div>

    <div v-if="hasLibrary" class="space-y-3">
      <div class="flex flex-wrap items-center gap-3">
        <h3 class="text-sm font-semibold">Bibliotheque</h3>
        <div v-if="tags.length" class="flex flex-wrap gap-2">
          <button
            type="button"
            class="pp-globalbilan-summary-chip"
            :aria-pressed="activeTag === ''"
            @click="activeTag = ''"
          >
            Tous
          </button>
          <button
            v-for="tag in tags"
            :key="tag"
            type="button"
            class="pp-globalbilan-summary-chip"
            :aria-pressed="activeTag === tag"
            @click="activeTag = tag"
          >
            {{ tag }}
          </button>
        </div>
        <div class="ml-auto w-full sm:w-auto">
          <input
            v-model="query"
            type="search"
            class="pp-input text-xs"
            placeholder="Rechercher"
            aria-label="Rechercher dans la bibliotheque"
          />
        </div>
      </div>

      <div v-if="filteredLibrary.length" class="grid gap-3 md:grid-cols-2">
        <article v-for="item in filteredLibrary" :key="item.id" class="pp-journey-card-soft space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
              {{ item.kind === 'resource' ? 'Ressource' : 'Action' }}
              <span v-if="item.horizon">· {{ item.horizon }}</span>
            </p>
            <span v-if="item.format" class="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
              {{ item.format }}
            </span>
          </div>
          <p class="text-sm font-semibold">{{ item.title }}</p>
          <p v-if="item.description" class="text-sm text-[color:var(--color-text-muted)]">
            {{ item.description }}
          </p>
          <div class="pt-1">
            <component
              :is="ctaComponent(item)"
              v-bind="ctaProps(item)"
              class="pp-btn-ghost text-xs"
              :disabled="!isCtaEnabled(item)"
              :aria-label="ctaAria(item)"
              @click="onCtaClick(item)"
            >
              {{ item.cta.label }}
            </component>
          </div>
        </article>
      </div>
      <p v-else class="text-sm text-[color:var(--color-text-muted)]">Aucun element disponible.</p>
    </div>

    <p v-if="!hasLibrary && !hasRecommended" class="text-sm text-[color:var(--color-text-muted)]">
      Aucune recommandation disponible pour ce parcours.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ResourcesActionsItemVM } from '~/types/bilan';
import { isAllowlistedResourcePath } from '~/config/resources/allowlist';
import { isAllowlistedEngagementRoute } from '~/config/engagement/allowlist';

const props = defineProps<{
  recommended: ResourcesActionsItemVM[];
  library: ResourcesActionsItemVM[];
  tags: string[];
}>();

const emit = defineEmits<{
  (e: 'go-export'): void;
}>();

const query = ref('');
const activeTag = ref('');

const hasRecommended = computed(() => props.recommended.length > 0);
const hasLibrary = computed(() => props.library.length > 0);

const matchesQuery = (item: ResourcesActionsItemVM, q: string) => {
  if (!q) return true;
  const hay = `${item.title} ${item.description ?? ''}`.toLowerCase();
  return hay.includes(q.toLowerCase());
};

const filteredLibrary = computed(() => {
  const q = query.value.trim();
  return props.library.filter((item) => {
    const tagOk = !activeTag.value || (item.tags ?? []).includes(activeTag.value);
    return tagOk && matchesQuery(item, q);
  });
});

const isCtaEnabled = (item: ResourcesActionsItemVM) => {
  if (item.cta.type === 'none') return false;
  if (item.cta.type === 'file') return Boolean(item.cta.target && isAllowlistedResourcePath(item.cta.target));
  if (item.cta.type === 'route') return Boolean(item.cta.target && isAllowlistedEngagementRoute(item.cta.target));
  return true;
};

const ctaComponent = (item: ResourcesActionsItemVM) => {
  if (item.cta.type === 'contact') return 'NuxtLink';
  if (item.cta.type === 'resources') return 'NuxtLink';
  if (item.cta.type === 'route' && isCtaEnabled(item)) return 'NuxtLink';
  if (item.cta.type === 'file' && isCtaEnabled(item)) return 'a';
  return 'button';
};

const ctaProps = (item: ResourcesActionsItemVM) => {
  if (item.cta.type === 'contact') return { to: '/contact' };
  if (item.cta.type === 'resources') return { to: '/ressources' };
  if (item.cta.type === 'route' && isCtaEnabled(item)) return { to: item.cta.target };
  if (item.cta.type === 'file' && isCtaEnabled(item)) {
    return { href: item.cta.target, target: '_blank', rel: 'noopener' };
  }
  return { type: 'button' };
};

const ctaAria = (item: ResourcesActionsItemVM) => `Action: ${item.cta.label}`;

const onCtaClick = (item: ResourcesActionsItemVM) => {
  if (item.cta.type === 'export') emit('go-export');
};
</script>
