<!--
  ressources/[slug].vue — Page detail ressource (Registry V0)

  Charge une ressource locale (registry v0) et affiche un rendu neutre.
  Aucune injection HTML/Markdown, contenu plain text uniquement.
-->
<template>
  <main class="pp-page">
    <PPPageHeader as="h1" density="comfort" align="left">
      <template #eyebrow>Ressource</template>
      <template #title>{{ resource.title }}</template>
      <template #lead>
        <div class="pp-resource-detail__lead">
          <p class="pp-resource-detail__summary">{{ resource.summary }}</p>
          <div v-if="resource.outcome" class="pp-resource-detail__outcome">
            <span class="pp-resource-detail__outcome-label">Resultat / Promesse</span>
            <span class="pp-resource-detail__outcome-text">{{ resource.outcome }}</span>
          </div>
        </div>
      </template>
    </PPPageHeader>

    <section class="pp-resource-detail">
      <div class="pp-resource-detail__meta">
        <PPChip variant="tag" size="sm">{{ categoryLabel }}</PPChip>
        <PPChip variant="stat" size="sm">{{ levelLabel }}</PPChip>
        <PPChip variant="stat" size="sm">{{ effortLabel }}</PPChip>
      </div>

      <div class="pp-resource-detail__content">
        <template v-if="hasContentBlocks">
          <section
            v-for="(block, index) in resource.contentBlocks"
            :key="`${block.title}-${index}`"
            class="pp-resource-detail__block"
          >
            <PPSectionHeader
              as="h2"
              density="compact"
              :title="block.title"
            />
            <ul class="pp-resource-detail__list">
              <li v-for="(item, itemIndex) in block.bullets" :key="itemIndex">
                {{ item }}
              </li>
            </ul>
          </section>
        </template>
        <PPEmptyState
          v-else
          icon="folder"
          title="Contenu en preparation"
          description="Cette ressource arrive bientot."
        />
      </div>

      <div class="pp-resource-detail__cta">
        <PPButton variant="primary" disabled>Telecharger (bientot)</PPButton>
        <NuxtLink class="pp-journey-cta-secondary text-xs" :to="resourcesLibraryLink">
          Retour au catalogue
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createError, useHead, useRoute } from '#imports';
import {
  RESOURCE_CATEGORY_LABELS,
  RESOURCE_EFFORT_LABELS,
  RESOURCE_LEVEL_LABELS,
} from '@/data/resourcesData';
import { listResources, type ResourceV0 } from '@/config/resources/registryV0';
import { buildResourcesDeepLink } from '@/utils/deeplinks/resourcesDeepLink';
import { normalizeResourceSlug } from '@/utils/resources/normalizeResourceSlug';

const route = useRoute();
const resourcesBySlug = new Map(
  listResources().map((resource) => [resource.slug, resource])
);

definePageMeta({
  validate: (route) => {
    const slug = normalizeResourceSlug(getRouteSlugInput(route.params.slug));
    if (!slug) return false;
    const found = resourcesBySlug.get(slug);
    if (!found) return false;
    if (!import.meta.dev && found.status !== 'published') return false;
    return true;
  }
});

const resource = computed<ResourceV0>(() => {
  const slug = normalizeResourceSlug(getRouteSlugInput(route.params.slug));
  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }
  const found = resourcesBySlug.get(slug) ?? null;
  if (!found) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }
  if (!import.meta.dev && found.status !== 'published') {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }
  return found;
});

const levelLabel = computed(() =>
  RESOURCE_LEVEL_LABELS[resource.value.level]
);
const effortLabel = computed(() =>
  RESOURCE_EFFORT_LABELS[resource.value.effort]
);
const categoryLabel = computed(() =>
  RESOURCE_CATEGORY_LABELS[resource.value.category]
);
const resourcesLibraryLink = buildResourcesDeepLink({});
const hasContentBlocks = computed(
  () => (resource.value.contentBlocks?.length ?? 0) > 0
);

useHead(() => ({
  title: resource.value
    ? `${resource.value.title} — Ressources`
    : 'Ressource — PixelProwlers',
  meta: [
    {
      name: 'description',
      content: resource.value
        ? resource.value.summary
        : 'Consultez les details de cette ressource.',
    },
  ],
}));

function getRouteSlugInput(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    if (value.length !== 1) return null;
    return value[0] ?? null;
  }
  return null;
}

</script>

<style scoped>
@reference "@/assets/css/main.css";

.pp-resource-detail {
  display: flex;
  flex-direction: column;
  gap: var(--pp-spacing-4, 1rem);
}

.pp-resource-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--pp-spacing-2, 0.5rem);
}

.pp-resource-detail__lead {
  display: flex;
  flex-direction: column;
  gap: var(--pp-spacing-2, 0.5rem);
}

.pp-resource-detail__summary {
  margin: 0;
}

.pp-resource-detail__outcome {
  display: flex;
  flex-direction: column;
  gap: var(--pp-spacing-1, 0.25rem);
}

.pp-resource-detail__outcome-label {
  font-size: var(--pp-font-size-xs, 0.75rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.pp-resource-detail__outcome-text {
  font-size: var(--pp-font-size-sm, 0.875rem);
  color: var(--color-text);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pp-resource-detail__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--pp-spacing-3, 0.75rem);
  align-items: center;
}

.pp-resource-detail__content {
  @apply flex flex-col gap-4;
}

.pp-resource-detail__block {
  @apply flex flex-col gap-2;
}

.pp-resource-detail__list {
  @apply grid gap-2 pl-5 text-sm;
  list-style: disc;
  color: var(--color-text-muted);
}
</style>
