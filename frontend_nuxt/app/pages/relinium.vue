<template>
  <div class="PageContainer">
    <section class="PageSection">
      <div class="PrimaryCard SectionIntro">
        <p class="SectionLabel">Relinium</p>
        <h1 class="SectionTitle">Relinium — labo interne</h1>
        <p class="SectionDescription">
          Relinium est notre terrain d’expérimentation : outils, modèles de pages, composants éditoriaux
          et protocoles d’ateliers. On y teste avant de déployer dans vos environnements.
        </p>
      </div>
      <div class="LabGrid">
        <article v-for="(item, index) in labItems" :key="index" class="SecondaryCard LabCard">
          <h2 class="LabTitle">{{ item.title }}</h2>
          <p class="LabText">{{ item.body }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports';

const labItems = [
  { title: 'Composants Strapi', body: 'Répertoires de contenus prêts à être déployés pour des landing pages ciblées.' },
  { title: 'Ateliers courts', body: 'Formats testés pour cadrer une offre ou une campagne en 2h.' },
  { title: 'Design system minimal', body: 'Tokens, grilles et composants à décliner dans vos environnements.' },
  { title: 'Automations', body: 'Expériences low-code pour suivre les leads et vos décisions.' }
];

const canonicalUrl = 'https://pixelprowlers.io/relinium';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PixelProwlers',
  url: 'https://pixelprowlers.io/',
  logo: 'https://pixelprowlers.io/logo.png',
  sameAs: [],
  description:
    'Studio pluriactif pour collectifs, associations et SCIC : clarté éditoriale, produit léger, transmission.'
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Relinium',
  provider: { '@type': 'Organization', name: 'PixelProwlers', url: 'https://pixelprowlers.io/' },
  areaServed: { '@type': 'Country', name: 'France' },
  audience: { '@type': 'Audience', audienceType: ['Collectifs', 'Associations', 'SCIC'] },
  url: canonicalUrl,
  description: 'Prototypes Strapi, formats d’ateliers courts, design system minimal et automations pour collectifs.'
};

useHead({
  title: 'Relinium · Labo interne PixelProwlers (composants, ateliers, automations)',
  meta: [
    {
      name: 'description',
      content: 'Prototypes Strapi, formats d’ateliers courts, design system minimal et automations pour collectifs.'
    },
    { name: 'robots', content: 'index,follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: 'Relinium · Labo interne PixelProwlers (composants, ateliers, automations)' },
    {
      property: 'og:description',
      content: 'Prototypes Strapi, formats d’ateliers courts, design system minimal et automations pour collectifs.'
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Relinium · Labo interne PixelProwlers (composants, ateliers, automations)' },
    {
      name: 'twitter:description',
      content: 'Prototypes Strapi, formats d’ateliers courts, design system minimal et automations pour collectifs.'
    },
    { name: 'twitter:image', content: '/mainhero.webp' }
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(organizationJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(serviceJsonLd) }
  ]
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-6xl mx-auto px-6 space-y-12 pb-16;
}

.SectionLabel {
  @apply text-sm uppercase tracking-[0.2em] text-orange-300;
}

.SectionTitle {
  @apply text-3xl font-semibold;
}

.SectionDescription {
  @apply text-base leading-relaxed text-slate-300;
}

.SectionIntro {
  @apply space-y-3;
}

.LabGrid {
  @apply grid gap-4 md:grid-cols-2;
}

.LabCard {
  @apply space-y-2;
}

.LabTitle {
  @apply text-xl font-semibold;
}

.LabText {
  @apply text-sm text-slate-300;
}
</style>
