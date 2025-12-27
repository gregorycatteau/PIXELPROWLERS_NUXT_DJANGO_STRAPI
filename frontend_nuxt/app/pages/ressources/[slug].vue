<!--
  ressources/[slug].vue — Page detail ressource (API-backed)

  Charge une ressource via /api/v1/resources/ et affiche un rendu neutre.
  Aucune injection HTML/Markdown, contenu plain text uniquement.
-->
<template>
  <main class="pp-page">
    <PPPageHeader as="h1" density="comfort" align="left">
      <template #eyebrow>Ressource</template>
      <template #title>{{ resource?.title || 'Ressource' }}</template>
      <template #lead>
        {{ resource?.summary || 'Consultez les details de cette ressource.' }}
      </template>
    </PPPageHeader>

    <PPLoadingState
      v-if="isLoading"
      label="Chargement de la ressource…"
      variant="skeleton"
      :count="3"
    />

    <PPErrorState
      v-else-if="hasError"
      :description="errorMessage || undefined"
      @retry="reload"
    />

    <PPEmptyState
      v-else-if="!resource"
      icon="inbox"
      title="Ressource introuvable"
      description="La ressource demandee n'est pas disponible."
      action-label="Retour aux ressources"
      action-to="/ressources"
    />

    <section v-else class="pp-resource-detail">
      <div class="pp-resource-detail__meta">
        <PPChip variant="tag" size="sm">{{ typeLabel }}</PPChip>
        <PPChip variant="stat" size="sm">{{ levelLabel }}</PPChip>
        <PPChip variant="stat" size="sm">{{ categoryLabel }}</PPChip>
        <PPChip variant="stat" size="sm">{{ journeyLabel }}</PPChip>
        <PPChip
          v-for="tag in resource.tags"
          :key="tag"
          variant="tag"
          size="sm"
        >
          {{ tag }}
        </PPChip>
      </div>

      <div class="pp-resource-detail__cta">
        <PPButton variant="primary" disabled>
          Telecharger (bientot)
        </PPButton>
        <NuxtLink class="pp-journey-cta-secondary text-xs" to="/ressources">
          Retour au catalogue
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useHead, useRoute, useRuntimeConfig } from '#imports';
import {
  RESOURCE_CATEGORY_LABELS,
  RESOURCE_JOURNEY_LABELS,
  RESOURCE_LEVEL_LABELS,
  RESOURCE_TYPE_LABELS,
  type ResourceItem,
  type ResourcesResponse,
} from '@/data/resourcesData';

const route = useRoute();
const config = useRuntimeConfig();

const resource = ref<ResourceItem | null>(null);
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref<string | null>(null);

const slugParam = computed(() => String(route.params.slug ?? ''));

const typeLabel = computed(() =>
  resource.value ? RESOURCE_TYPE_LABELS[resource.value.type] : 'Ressource'
);
const levelLabel = computed(() =>
  resource.value ? RESOURCE_LEVEL_LABELS[resource.value.level] : 'Intro'
);
const categoryLabel = computed(() =>
  resource.value ? RESOURCE_CATEGORY_LABELS[resource.value.category] : 'Guide'
);
const journeyLabel = computed(() =>
  resource.value ? RESOURCE_JOURNEY_LABELS[resource.value.journey] : 'P1'
);

watch(
  slugParam,
  () => {
    void fetchResource();
  },
  { immediate: true }
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

async function fetchResource(): Promise<void> {
  const slug = sanitizeSlug(slugParam.value);
  if (!slug) {
    resource.value = null;
    isLoading.value = false;
    hasError.value = false;
    errorMessage.value = null;
    return;
  }

  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = null;

  try {
    const limit = 50;
    let offset = 0;
    let total = 0;
    let attempts = 0;

    while (attempts < 5) {
      const response = await $fetch<ResourcesResponse>(
        `${config.public.apiBase}/api/v1/resources/`,
        { query: { limit, offset } }
      );

      const match = response.resources.find((item) => item.slug === slug);
      if (match) {
        resource.value = match;
        isLoading.value = false;
        return;
      }

      total = response.total;
      offset += limit;
      attempts += 1;

      if (offset >= total) break;
    }

    resource.value = null;
  } catch (err) {
    hasError.value = true;
    errorMessage.value = 'Impossible de charger la ressource.';
  } finally {
    isLoading.value = false;
  }
}

function reload(): void {
  void fetchResource();
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
