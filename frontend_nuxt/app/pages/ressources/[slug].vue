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
        {{ resource.summary }}
      </template>
    </PPPageHeader>

    <section class="pp-resource-detail">
      <div class="pp-resource-detail__meta">
        <PPChip variant="tag" size="sm">{{ categoryLabel }}</PPChip>
        <PPChip variant="stat" size="sm">{{ levelLabel }}</PPChip>
        <PPChip variant="stat" size="sm">{{ effortLabel }}</PPChip>
      </div>

      <div class="pp-resource-detail__cta">
        <PPButton variant="primary" disabled>Telecharger (bientot)</PPButton>
        <NuxtLink class="pp-journey-cta-secondary text-xs" to="/ressources">
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
import { getResourceBySlug, type ResourceV0 } from '@/config/resources/registryV0';

const route = useRoute();

const slugParam = computed(() => String(route.params.slug ?? ''));

const resource = computed<ResourceV0>(() => {
  const slug = sanitizeSlug(slugParam.value);
  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }
  const found = getResourceBySlug(slug);
  if (!found) {
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

function sanitizeSlug(value: string): string | null {
  const normalized = value.normalize('NFKC').trim().toLowerCase();
  if (!normalized) return null;
  if (!/^[a-z0-9-]{3,64}$/.test(normalized)) return null;
  return normalized;
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

.pp-resource-detail__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--pp-spacing-3, 0.75rem);
  align-items: center;
}
</style>
