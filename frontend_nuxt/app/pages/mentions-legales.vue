<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <PPPageHeader as="h1" density="comfort" align="left">
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
        <div class="LegalSections">
          <section v-for="section in legalSections" :key="section.title" class="LegalSection">
            <h2 class="LegalTitle">{{ section.title }}</h2>
            <div class="LegalTextGroup">
              <p v-for="(paragraph, index) in section.paragraphs" :key="`${section.title}-p-${index}`" class="LegalText">
                <span v-if="paragraph.linkText && paragraph.linkTo">
                  {{ paragraph.textBefore }}
                  <NuxtLink :to="paragraph.linkTo" class="LegalLink">{{ paragraph.linkText }}</NuxtLink>
                  {{ paragraph.textAfter }}
                </span>
                <span v-else>
                  {{ paragraph.text }}
                </span>
              </p>
              <ul v-if="section.bullets.length" class="LegalList">
                <li v-for="(item, index) in section.bullets" :key="`${section.title}-b-${index}`" class="LegalListItem">
                  {{ item }}
                </li>
              </ul>
            </div>
          </section>
        </div>
      </PPCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports';
import { useLegalMentions } from '~/composables/useLegalMentions';

const canonicalUrl = 'https://pixelprowlers.io/mentions-legales';
const { status, sections: legalSections } = useLegalMentions();

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

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-6xl mx-auto px-6 space-y-12 pb-16;
}

.LegalSections {
  @apply mt-6 space-y-6;
}

.LegalSection {
  @apply rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6;
}

.LegalTitle {
  @apply text-base font-semibold text-slate-100;
}

.LegalText {
  @apply mt-2 text-sm text-slate-300;
}

.LegalTextGroup {
  @apply mt-2 space-y-3;
}

.LegalList {
  @apply list-disc pl-5 text-sm text-slate-300;
}

.LegalListItem {
  @apply mt-1;
}

.LegalLink {
  @apply text-orange-200 underline underline-offset-4 hover:text-orange-100;
}
</style>
