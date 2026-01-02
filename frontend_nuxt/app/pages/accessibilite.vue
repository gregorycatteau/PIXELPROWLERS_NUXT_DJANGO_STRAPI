<template>
  <PPStaticPageShell header-id="accessibility-title">
    <PPCard as="section" variant="default" class="pp-static-page__header-card">
      <PPPageHeader as="h1" density="comfort" align="left" title-id="accessibility-title">
        <template #eyebrow>
          Accessibilité
        </template>
        <template #title>
          Accessibilité
        </template>
        <template #lead>
          PixelProwlers s’engage à proposer une expérience inclusive, lisible et utilisable par tous les publics.
        </template>
      </PPPageHeader>
    </PPCard>

    <div class="pp-static-page__stack">
      <PPCard
        v-for="section in accessibilitySections"
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
            {{ paragraph }}
          </p>
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

const canonicalUrl = 'https://pixelprowlers.io/accessibilite';

const accessibilitySections = [
  {
    title: 'Navigation clavier',
    lead: 'Tous les parcours et contenus sont conçus pour être utilisables au clavier.',
    paragraphs: [
      'Les éléments interactifs sont accessibles via la touche Tab et disposent d’un ordre de navigation clair.',
      'Les actions principales restent atteignables sans souris ni geste complexe.'
    ]
  },
  {
    title: 'Focus visible',
    lead: 'Chaque élément actif affiche un focus net et contrasté.',
    paragraphs: [
      'Les indicateurs de focus sont maintenus sur tous les boutons, liens et contrôles essentiels.',
      'Nous évitons les styles qui masquent ou affaiblissent la visibilité du focus.'
    ]
  },
  {
    title: 'Contrastes conformes',
    lead: 'Les couleurs respectent des niveaux de contraste suffisants pour la lecture.',
    paragraphs: [
      'Les textes, icônes et éléments d’interface sont vérifiés pour rester lisibles en conditions standards.',
      'Les zones critiques utilisent des contrastes renforcés pour limiter la fatigue visuelle.'
    ]
  },
  {
    title: 'Animations maîtrisées',
    lead: 'Les transitions sont discrètes et respectent les préférences utilisateur.',
    paragraphs: [
      'Le site limite les animations inutiles et privilégie des mouvements courts et non intrusifs.',
      'La préférence système prefers-reduced-motion est respectée pour réduire les effets si besoin.'
    ]
  },
  {
    title: 'Amélioration continue',
    lead: 'Nous suivons les retours pour corriger rapidement les points bloquants.',
    paragraphs: [
      'Si tu rencontres un obstacle, contacte-nous afin que nous puissions ajuster le site.',
      'Les évolutions d’accessibilité sont documentées et intégrées dans nos cycles de mise à jour.'
    ]
  }
];

useHead({
  title: 'Accessibilité · PixelProwlers',
  meta: [
    {
      name: 'description',
      content: 'Engagement PixelProwlers pour l’accessibilité : navigation clavier, focus visible et contrastes maîtrisés.'
    },
    { name: 'robots', content: 'index,follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: 'Accessibilité · PixelProwlers' },
    {
      property: 'og:description',
      content: 'Engagement PixelProwlers pour l’accessibilité : navigation clavier, focus visible et contrastes maîtrisés.'
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Accessibilité · PixelProwlers' },
    {
      name: 'twitter:description',
      content: 'Engagement PixelProwlers pour l’accessibilité : navigation clavier, focus visible et contrastes maîtrisés.'
    },
    { name: 'twitter:image', content: '/mainhero.webp' }
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }]
});
</script>
