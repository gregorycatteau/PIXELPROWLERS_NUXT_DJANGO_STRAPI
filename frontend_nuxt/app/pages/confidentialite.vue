<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <PPPageHeader as="h1" density="comfort" align="left">
          <template #eyebrow>
            Confidentialité
          </template>
          <template #title>
            Politique de confidentialité
          </template>
          <template #lead>
            Les données collectées via le formulaire de contact servent uniquement à répondre à ta demande.
            Nous ne partageons rien avec des tiers. Cette page sera enrichie avec les mentions RGPD détaillées
            avant mise en production.
          </template>
        </PPPageHeader>
      </PPCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports';

const canonicalUrl = 'https://pixelprowlers.io/confidentialite';

useHead({
  title: 'Confidentialité · PixelProwlers',
  meta: [
    {
      name: 'description',
      content:
        'Politique de confidentialité : données utilisées uniquement pour répondre aux demandes, sans partage à des tiers.'
    },
    { name: 'robots', content: 'noindex,follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: 'Confidentialité · PixelProwlers' },
    {
      property: 'og:description',
      content:
        'Politique de confidentialité : données utilisées uniquement pour répondre aux demandes, sans partage à des tiers.'
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Confidentialité · PixelProwlers' },
    {
      name: 'twitter:description',
      content:
        'Politique de confidentialité : données utilisées uniquement pour répondre aux demandes, sans partage à des tiers.'
    },
    { name: 'twitter:image', content: '/mainhero.webp' }
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }]
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-6xl mx-auto px-6 space-y-12 pb-16;
}

</style>
