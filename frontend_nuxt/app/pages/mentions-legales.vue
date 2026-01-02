<template>
  <PPStaticPageShell header-id="legal-title">
    <PPCard as="section" variant="default" class="pp-static-page__header-card">
      <PPPageHeader as="h1" density="comfort" align="left" title-id="legal-title">
        <template #eyebrow>
          Mentions légales
        </template>
        <template #title>
          Mentions légales
        </template>
        <template #lead>
          Cette page présente les informations légales essentielles liées au site PixelProwlers.
        </template>
      </PPPageHeader>
    </PPCard>

    <div class="pp-static-page__stack">
      <PPCard
        v-for="section in legalSections"
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
          <p v-for="(paragraph, index) in section.bodyParagraphs" :key="`${section.title}-p-${index}`" class="pp-static-page__text">
            <span v-if="paragraph.linkText && paragraph.linkTo">
              {{ paragraph.textBefore }}
              <NuxtLink :to="paragraph.linkTo">{{ paragraph.linkText }}</NuxtLink>
              {{ paragraph.textAfter }}
            </span>
            <span v-else>
              {{ paragraph.text }}
            </span>
          </p>
          <ul v-if="section.listItems.length" class="pp-static-page__list">
            <li v-for="(item, index) in section.listItems" :key="`${section.title}-l-${index}`">
              <span v-if="item.label && item.value">
                <span class="pp-static-page__list-label">{{ item.label }}</span>
                <span>: {{ item.value }}</span>
              </span>
              <span v-else>
                {{ item.text }}
              </span>
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
import { useLegalMentions } from '~/composables/useLegalMentions';

const canonicalUrl = 'https://pixelprowlers.io/mentions-legales';
const { status, sections } = useLegalMentions();

type LegalParagraph = {
  text: string;
  textBefore?: string;
  textAfter?: string;
  linkText?: string;
  linkTo?: string;
};

type LegalListItem = {
  text: string;
  label?: string;
  value?: string;
};

type LegalSectionView = {
  title: string;
  lead: string;
  bodyParagraphs: LegalParagraph[];
  listItems: LegalListItem[];
};

// Extrait un lead simple si le premier paragraphe ne contient pas de lien.
const toLegalSectionView = (section: { title: string; paragraphs: LegalParagraph[]; listItems: LegalListItem[] }): LegalSectionView => {
  const first = section.paragraphs[0];
  const hasLink = Boolean(first?.linkText || first?.linkTo || first?.textBefore || first?.textAfter);
  if (!first || hasLink) {
    return {
      title: section.title,
      lead: '',
      bodyParagraphs: section.paragraphs,
      listItems: section.listItems
    };
  }
  return {
    title: section.title,
    lead: first.text,
    bodyParagraphs: section.paragraphs.slice(1),
    listItems: section.listItems
  };
};

const legalSections = sections.map((section) => toLegalSectionView(section));

useHead({
  title: 'Mentions légales · PixelProwlers',
  meta: [
    {
      name: 'description',
      content:
        'Mentions légales PixelProwlers. Ce projet est en phase de préfiguration, informations complètes à venir avant déploiement public.'
    },
    // TODO: retirer noindex quand le document passe en status=active.
    { name: 'robots', content: status === 'draft' ? 'noindex,follow' : 'index,follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: 'Mentions légales · PixelProwlers' },
    {
      property: 'og:description',
      content:
        'Mentions légales PixelProwlers. Ce projet est en phase de préfiguration, informations complètes à venir avant déploiement public.'
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Mentions légales · PixelProwlers' },
    {
      name: 'twitter:description',
      content:
        'Mentions légales PixelProwlers. Ce projet est en phase de préfiguration, informations complètes à venir avant déploiement public.'
    },
    { name: 'twitter:image', content: '/mainhero.webp' }
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }]
});
</script>
