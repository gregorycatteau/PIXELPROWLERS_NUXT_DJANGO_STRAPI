<template>
  <PPStaticPageShell header-id="about-title">
    <PPCard as="section" variant="default" class="pp-static-page__header-card">
      <PPPageHeader as="h1" density="comfort" align="left" title-id="about-title">
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

    <div class="pp-static-page__stack">
      <div class="pp-static-page__grid pp-static-page__grid--pillars">
        <PPCard
          v-for="section in pillarSections"
          :key="section.title"
          as="section"
          variant="default"
          class="pp-static-page__card"
        >
          <PPSectionHeader as="h2" density="comfort" :lead="section.lead">
            <template #title>
              {{ section.title }}
            </template>
          </PPSectionHeader>
          <div class="pp-static-page__section-body">
            <p v-for="(paragraph, index) in section.body" :key="`${section.title}-p-${index}`" class="pp-static-page__text">
              {{ paragraph }}
            </p>
            <ul v-if="section.items.length" class="pp-static-page__list">
              <li v-for="(item, index) in section.items" :key="`${section.title}-l-${index}`">
                <span class="pp-static-page__list-label">{{ item.label }}</span>
                <span v-if="item.value">: {{ item.value }}</span>
              </li>
            </ul>
          </div>
        </PPCard>
      </div>

      <div class="pp-static-page__stack">
        <PPCard
          v-for="section in detailSections"
          :key="section.title"
          as="section"
          variant="default"
          class="pp-static-page__card"
        >
          <PPSectionHeader as="h2" density="comfort" :lead="section.lead">
            <template #title>
              {{ section.title }}
            </template>
          </PPSectionHeader>
          <div class="pp-static-page__section-body">
            <p v-for="(paragraph, index) in section.body" :key="`${section.title}-p-${index}`" class="pp-static-page__text">
              {{ paragraph }}
            </p>
            <ol v-if="section.ordered && section.items.length" class="pp-static-page__list pp-static-page__list--ordered">
              <li v-for="(item, index) in section.items" :key="`${section.title}-o-${index}`">
                <span class="pp-static-page__list-label">{{ item.label }}</span>
                <span v-if="item.value">: {{ item.value }}</span>
              </li>
            </ol>
            <ul v-else-if="section.items.length" class="pp-static-page__list">
              <li v-for="(item, index) in section.items" :key="`${section.title}-l-${index}`">
                <span class="pp-static-page__list-label">{{ item.label }}</span>
                <span v-if="item.value">: {{ item.value }}</span>
              </li>
            </ul>
          </div>
        </PPCard>

        <PPCard as="section" variant="default" class="pp-static-page__card">
          <PPSectionHeader
            as="h2"
            density="comfort"
            lead="Tu peux nous partager ton contexte, tes contraintes et tes priorités. On prendra le temps de clarifier ensemble la suite."
          >
            <template #title>
              Envie d’en parler ?
            </template>
          </PPSectionHeader>
          <PPButton to="/contact" variant="primary" class="pp-static-page__cta">Discutons de ton projet</PPButton>
        </PPCard>
      </div>
    </div>

    <div class="pp-static-page__cta-row">
      <PPButton to="/" variant="primary" class="pp-static-page__cta">Retour à l’accueil</PPButton>
      <PPButton to="/parcours/ma-structure-dysfonctionne?step=E0_intro" variant="secondary" class="pp-static-page__cta">
        Commencer le parcours
      </PPButton>
    </div>
  </PPStaticPageShell>
</template>

<script setup lang="ts">
import { useHead } from '#imports';
import { useAbout } from '~/composables/useAbout';

const {
  quiNousSommes,
  valeurs,
  approche,
  histoire,
  methodologie,
  reglesDuJeu,
  deroulement,
  pourquoiConfiance,
  garanties,
  valeursIncarnees,
  pourquoiChoisir,
  nextSteps,
  noteAuthenticite
} = useAbout();

const canonicalUrl = 'https://pixelprowlers.io/a-propos';
const metaDescription = 'Découvre nos méthodes d’accompagnement, nos valeurs et nos garanties de sécurité.';

type AboutSectionView = {
  title: string;
  lead: string;
  body: string[];
  items: { label: string; value: string }[];
  ordered?: boolean;
};

// Transforme une section éditoriale en structure affichable (lead + body).
const toSectionView = (section: { title: string; paragraphs: string[]; items: { label: string; value: string }[] }, ordered = false): AboutSectionView => ({
  title: section.title,
  lead: section.paragraphs[0] ?? '',
  body: section.paragraphs.slice(1),
  items: section.items,
  ordered
});

const pillarSections = [
  toSectionView(quiNousSommes),
  toSectionView(valeurs),
  toSectionView(approche)
];

const detailSections = [
  toSectionView(histoire),
  toSectionView(methodologie),
  toSectionView(reglesDuJeu),
  toSectionView(deroulement, true),
  toSectionView(pourquoiConfiance),
  toSectionView(garanties),
  toSectionView(valeursIncarnees),
  toSectionView(pourquoiChoisir),
  toSectionView(nextSteps),
  toSectionView(noteAuthenticite)
];

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
  link: [{ rel: 'canonical', href: canonicalUrl }]
});
</script>
