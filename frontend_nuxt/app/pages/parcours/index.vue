<template>
  <PPStaticPageShell header-id="journeys-catalog-title">
    <PPCard as="section" variant="default" class="pp-static-page__header-card">
      <PPPageHeader as="h1" density="comfort" align="left" title-id="journeys-catalog-title">
        <template #eyebrow>
          Parcours
        </template>
        <template #title>
          Parcours disponibles
        </template>
        <template #lead>
          Retrouvez ici les parcours actuellement accessibles en production.
        </template>
      </PPPageHeader>
    </PPCard>

    <div class="pp-static-page__stack">
      <PPCard
        v-for="journey in journeyCards"
        :key="journey.id"
        as="section"
        variant="default"
        class="pp-static-page__card"
      >
        <PPSectionHeader as="h2" density="comfort" :lead="journey.lead">
          <template #title>
            {{ journey.title }}
          </template>
        </PPSectionHeader>
        <div class="pp-static-page__section-body">
          <p class="pp-static-page__text">
            {{ journey.summary }}
          </p>
          <PPButton
            :to="journey.href"
            variant="primary"
            class="pp-static-page__cta"
            :aria-label="journey.ariaLabel"
          >
            Commencer le parcours
          </PPButton>
        </div>
      </PPCard>
    </div>
  </PPStaticPageShell>
</template>

<script setup lang="ts">
import { useHead } from '#imports';
import { listManifests } from '~/config/journeys/manifests/registry';

const canonicalUrl = 'https://pixelprowlers.io/parcours';

const journeyOrder = ['p1', 'p2', 'p3', 'p4', 'p5'];
const journeyTitleMap: Record<string, string> = {
  p1: 'Parcours P1',
  p2: 'Parcours P2',
  p3: 'Parcours P3',
  p4: 'Parcours P4',
  p5: 'Parcours P5'
};

const orderIndex = (id: string) => {
  const idx = journeyOrder.indexOf(id);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
};

const journeyCards = listManifests()
  .filter((manifest) => manifest.visibility === 'prod')
  .slice()
  .sort((a, b) => orderIndex(a.id) - orderIndex(b.id))
  .map((manifest) => {
    const title = journeyTitleMap[manifest.id] ?? `Parcours ${manifest.id.toUpperCase()}`;
    const href = `/parcours/${manifest.slug}`;
    return {
      id: manifest.id,
      href,
      title,
      lead: 'Disponible en production',
      summary: 'Ce parcours est actuellement accessible et peut etre explore des maintenant.',
      ariaLabel: `Ouvrir ${title}`
    };
  });

useHead({
  title: 'Parcours · PixelProwlers',
  meta: [
    {
      name: 'description',
      content: 'Catalogue des parcours PixelProwlers actuellement accessibles en production.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Parcours · PixelProwlers' },
    {
      property: 'og:description',
      content: 'Catalogue des parcours PixelProwlers actuellement accessibles en production.'
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Parcours · PixelProwlers' },
    {
      name: 'twitter:description',
      content: 'Catalogue des parcours PixelProwlers actuellement accessibles en production.'
    },
    { name: 'twitter:image', content: '/mainhero.webp' }
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }]
});
</script>
