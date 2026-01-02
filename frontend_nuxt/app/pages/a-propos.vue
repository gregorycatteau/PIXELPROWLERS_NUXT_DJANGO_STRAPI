<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <PPPageHeader as="h1" density="comfort" align="left">
          <template #eyebrow>
            À propos
          </template>
          <template #title>
            À propos · PixelProwlers
          </template>
          <template #lead>
            Découvre qui nous sommes, nos valeurs et comment nous pouvons t’accompagner.
          </template>
        </PPPageHeader>
      </PPCard>
      <div class="AboutSections">
        <PPCard
          v-for="section in aboutSections"
          :key="section.title"
          as="section"
          variant="default"
          class="AboutSection"
        >
          <h2 class="AboutTitle">{{ section.title }}</h2>
          <div class="AboutTextGroup">
            <p v-for="(paragraph, index) in section.paragraphs" :key="`${section.title}-p-${index}`" class="AboutText">
              {{ paragraph }}
            </p>
            <ul v-if="section.items.length" class="AboutList">
              <li v-for="(item, index) in section.items" :key="`${section.title}-l-${index}`" class="AboutListItem">
                <span class="AboutListLabel">{{ item.label }}</span>
                <span v-if="item.value">: {{ item.value }}</span>
              </li>
            </ul>
          </div>
        </PPCard>
        <PPCard as="section" variant="default" class="AboutSection">
          <h2 class="AboutTitle">Envie d’en parler ?</h2>
          <p class="AboutText">
            Tu peux nous partager ton contexte, tes contraintes et tes priorités. On prendra le temps de clarifier
            ensemble la suite.
          </p>
          <PPButton to="/contact" variant="primary" class="AboutCta">Contacter PixelProwlers</PPButton>
        </PPCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports';
import { useAbout } from '~/composables/useAbout';

const { quiNousSommes, valeurs, approche, histoire, pourquoiChoisir, nextSteps, noteAuthenticite } = useAbout();

const canonicalUrl = 'https://pixelprowlers.io/a-propos';
const metaDescription =
  quiNousSommes.paragraphs[0] ??
  'Studio pluriactif pour collectifs engagés : clarté éditoriale, sobriété numérique et transmission.';

const aboutSections = [
  quiNousSommes,
  valeurs,
  approche,
  histoire,
  pourquoiChoisir,
  nextSteps,
  noteAuthenticite
];

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PixelProwlers',
  url: 'https://pixelprowlers.io/',
  logo: 'https://pixelprowlers.io/logo.png',
  sameAs: [],
  description: metaDescription
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  url: canonicalUrl,
  name: 'À propos · PixelProwlers',
  description: metaDescription
};

useHead({
  title: 'À propos · PixelProwlers',
  meta: [
    {
      name: 'description',
      content: metaDescription
    },
    { name: 'robots', content: 'index,follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: 'À propos · PixelProwlers' },
    {
      property: 'og:description',
      content: metaDescription
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'À propos · PixelProwlers' },
    {
      name: 'twitter:description',
      content: metaDescription
    },
    { name: 'twitter:image', content: '/mainhero.webp' }
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(organizationJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(webPageJsonLd) }
  ]
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-6xl mx-auto px-6 space-y-12 pb-16;
}

.AboutSections {
  @apply mt-6 space-y-6;
}

.AboutSection {
  @apply space-y-3;
}

.AboutTitle {
  @apply text-base font-semibold text-slate-100;
}

.AboutTextGroup {
  @apply space-y-3;
}

.AboutText {
  @apply text-sm text-slate-300;
}

.AboutList {
  @apply list-disc pl-5 text-sm text-slate-300;
}

.AboutListItem {
  @apply mt-1;
}

.AboutListLabel {
  @apply font-semibold text-slate-100;
}

.AboutCta {
  @apply mt-4 inline-flex w-fit;
}
</style>
