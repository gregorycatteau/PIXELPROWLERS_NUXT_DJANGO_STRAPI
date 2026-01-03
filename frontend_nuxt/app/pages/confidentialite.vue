<template>
  <PPStaticPageShell header-id="privacy-title">
    <PPCard as="section" variant="default" class="pp-static-page__header-card">
      <PPPageHeader as="h1" density="comfort" align="left" title-id="privacy-title">
        <template #eyebrow>
          Confidentialité
        </template>
        <template #title>
          Confidentialité
        </template>
        <template #lead>
          Nous collectons le strict minimum, sans tracking tiers ni profilage. Le formulaire de contact sert
          uniquement à répondre, avec conservation limitée, purge automatique et logs anonymisés. P1 reste front-only.
        </template>
      </PPPageHeader>
    </PPCard>

    <div class="pp-static-page__stack">
      <PPCard
        v-for="section in privacySections"
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
          <p v-for="(paragraph, index) in section.paragraphs" :key="`${section.title}-p-${index}`" class="pp-static-page__text">
            <span v-if="'linkTo' in paragraph">
              {{ paragraph.textBefore }}
              <NuxtLink :to="paragraph.linkTo">{{ paragraph.linkText }}</NuxtLink>
              {{ paragraph.textAfter }}
            </span>
            <span v-else>
              {{ paragraph.text }}
            </span>
          </p>
          <ul v-if="section.items.length" class="pp-static-page__list">
            <li v-for="(item, index) in section.items" :key="`${section.title}-l-${index}`">
              {{ item }}
            </li>
          </ul>
        </div>
      </PPCard>
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

const canonicalUrl = 'https://pixelprowlers.io/confidentialite';

type PrivacyParagraph =
  | { text: string }
  | { textBefore: string; linkText: string; linkTo: string; textAfter: string };

type PrivacySection = {
  title: string;
  lead: string;
  paragraphs: PrivacyParagraph[];
  items: string[];
};

const privacySections: PrivacySection[] = [
  {
    title: 'Collecte minimale',
    lead: 'Le diagnostic est accessible sans compte. Nous ne demandons que ce qui est utile pour te répondre.',
    paragraphs: [
      {
        text:
          'Quand tu nous contactes, nous utilisons tes informations uniquement pour répondre à ta demande, avec rétention courte et purge automatique.'
      }
    ],
    items: []
  },
  {
    title: 'Ce que nous ne faisons pas',
    lead: 'Aucun profilage caché et aucune surprise.',
    paragraphs: [
      {
        text:
          'Nous privilégions des outils sobres, locaux et transparents pour éviter toute collecte involontaire.'
      }
    ],
    items: [
      'Pas de tracking tiers ni de reciblage publicitaire.',
      'Pas de profilage nominatif.',
      'Pas de revente ni de partage non consenti.'
    ]
  },
  {
    title: 'Pour aller plus loin',
    lead: 'La politique complète détaille les finalités, durées de conservation et droits associés.',
    paragraphs: [
      {
        textBefore: 'Consulte la ',
        linkText: 'politique de confidentialité',
        linkTo: '/politique-confidentialite',
        textAfter: ' pour le détail.'
      }
    ],
    items: []
  }
];

useHead({
  title: 'Confidentialité · PixelProwlers',
  meta: [
    {
      name: 'description',
      content:
        'Résumé de la politique de confidentialité PixelProwlers : collecte minimale, contact avec rétention courte, logs anonymisés, lien vers la politique complète.'
    },
    { name: 'robots', content: 'index,follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: 'Confidentialité · PixelProwlers' },
    {
      property: 'og:description',
      content:
        'Résumé de la politique de confidentialité PixelProwlers : collecte minimale, contact avec rétention courte, logs anonymisés, lien vers la politique complète.'
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Confidentialité · PixelProwlers' },
    {
      name: 'twitter:description',
      content:
        'Résumé de la politique de confidentialité PixelProwlers : collecte minimale, contact avec rétention courte, logs anonymisés, lien vers la politique complète.'
    },
    { name: 'twitter:image', content: '/mainhero.webp' }
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }]
});
</script>
