<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <PPPageHeader as="h1" density="comfort" align="left">
          <template #eyebrow>
            Accompagnement & formation
          </template>
          <template #title>
            Formats courts pour avancer vite
          </template>
          <template #lead>
            Choisis un format adapté à ta maturité : diagnostic express, sprint d’alignement ou
            accompagnement sur 6 semaines pour livrer et documenter.
          </template>
        </PPPageHeader>
      </PPCard>
      <div class="OffersGrid">
        <article v-for="(offer, index) in offers" :key="index" class="SecondaryCard OfferCard">
          <h2 class="OfferTitle">{{ offer.title }}</h2>
          <p class="OfferText">{{ offer.body }}</p>
          <p class="OfferDuration">{{ offer.duration }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports';

const offers = [
  { title: 'Diagnostic rapide', body: 'Cartographie des irritants, priorisation immédiate.', duration: '1 semaine' },
  { title: 'Sprint cadrage', body: 'Formaliser proposition de valeur, messages et parcours visiteurs.', duration: '2 semaines' },
  { title: 'Accompagnement', body: 'Sprints + transfert de compétences, documentation et suivi des métriques.', duration: '4-6 semaines' }
];

const canonicalUrl = 'https://pixelprowlers.io/accompagnement-formation';

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
  name: 'Accompagnement & formation',
  provider: { '@type': 'Organization', name: 'PixelProwlers', url: 'https://pixelprowlers.io/' },
  areaServed: { '@type': 'Country', name: 'France' },
  audience: { '@type': 'Audience', audienceType: ['Collectifs', 'Associations', 'SCIC'] },
  url: canonicalUrl,
  description: 'Diagnostic rapide, sprint de cadrage, accompagnement 4–6 semaines.'
};

useHead({
  title: 'Accompagnement & Formation · Diagnostics, sprints et transfert PixelProwlers',
  meta: [
    {
      name: 'description',
      content: 'Diagnostic rapide, sprint de cadrage ou accompagnement 4–6 semaines pour clarifier messages, pages clés et outils.'
    },
    { name: 'robots', content: 'index,follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: 'Accompagnement & Formation · Diagnostics, sprints et transfert PixelProwlers' },
    {
      property: 'og:description',
      content: 'Diagnostic rapide, sprint de cadrage ou accompagnement 4–6 semaines pour clarifier messages, pages clés et outils.'
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Accompagnement & Formation · Diagnostics, sprints et transfert PixelProwlers' },
    {
      name: 'twitter:description',
      content: 'Diagnostic rapide, sprint de cadrage ou accompagnement 4–6 semaines pour clarifier messages, pages clés et outils.'
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

.OffersGrid {
  @apply grid gap-4 md:grid-cols-3;
}

.OfferCard {
  @apply space-y-2;
}

.OfferTitle {
  @apply text-xl font-semibold;
}

.OfferText {
  @apply text-sm text-slate-300;
}

.OfferDuration {
  @apply text-sm text-orange-300 font-semibold;
}
</style>
