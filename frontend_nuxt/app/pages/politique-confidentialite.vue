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
            Cette page décrit les traitements de données personnelles, leurs finalités et vos droits.
          </template>
        </PPPageHeader>
        <div class="PolicySections">
          <section v-for="section in policySections" :key="section.title" class="PolicySection">
            <h2 class="PolicyTitle">{{ section.title }}</h2>
            <div class="PolicyTextGroup">
              <p v-for="(paragraph, index) in section.paragraphs" :key="`${section.title}-p-${index}`" class="PolicyText">
                {{ paragraph }}
              </p>
              <ul v-if="section.listItems.length" class="PolicyList">
                <li v-for="(item, index) in section.listItems" :key="`${section.title}-l-${index}`" class="PolicyListItem">
                  <span v-if="item.label && item.value">
                    <span class="PolicyListLabel">{{ item.label }}</span>
                    <span v-if="item.linkTo">
                      :
                      <a
                        :href="item.linkTo"
                        class="PolicyLink"
                        target="_blank"
                        rel="noopener noreferrer"
                      >{{ item.linkText ?? item.value }}</a>
                    </span>
                    <span v-else>
                      : {{ item.value }}
                    </span>
                  </span>
                  <span v-else>
                    {{ item.text }}
                  </span>
                </li>
              </ul>
              <div v-if="section.table" class="PolicyTableWrapper">
                <div class="PolicyTableStack md:hidden">
                  <div v-for="(row, rowIndex) in section.table.rows" :key="`${section.title}-stack-${rowIndex}`" class="PolicyTableStackRow">
                    <div v-for="(cell, cellIndex) in row" :key="`${section.title}-stack-${rowIndex}-${cellIndex}`" class="PolicyTableStackItem">
                      <span class="PolicyTableStackLabel">{{ section.table.headers[cellIndex] }}</span>
                      <span class="PolicyTableStackValue">{{ cell }}</span>
                    </div>
                  </div>
                </div>
                <table class="PolicyTable hidden md:table">
                  <thead>
                    <tr>
                      <th v-for="(header, index) in section.table.headers" :key="`${section.title}-h-${index}`">
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in section.table.rows" :key="`${section.title}-r-${rowIndex}`">
                      <td v-for="(cell, cellIndex) in row" :key="`${section.title}-c-${rowIndex}-${cellIndex}`">
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </PPCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports';
import { usePrivacyPolicy } from '~/composables/usePrivacyPolicy';

const canonicalUrl = 'https://pixelprowlers.io/politique-confidentialite';
const {
  status,
  identite,
  finalites,
  donnees,
  destinataires,
  durees,
  droits,
  cookies,
  securite,
  misesAJour,
  dpo,
  contact
} = usePrivacyPolicy();

const policySections = [
  identite,
  finalites,
  donnees,
  destinataires,
  durees,
  droits,
  cookies,
  securite,
  misesAJour,
  dpo,
  contact
];

useHead({
  title: 'Politique de confidentialité · PixelProwlers',
  meta: [
    {
      name: 'description',
      content:
        'Politique de confidentialité PixelProwlers : finalités, bases légales, données traitées, durées de conservation et droits.'
    },
    // TODO: retirer noindex quand le document passe en status=active.
    { name: 'robots', content: status === 'draft' ? 'noindex,follow' : 'index,follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: 'Politique de confidentialité · PixelProwlers' },
    {
      property: 'og:description',
      content:
        'Politique de confidentialité PixelProwlers : finalités, bases légales, données traitées, durées de conservation et droits.'
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Politique de confidentialité · PixelProwlers' },
    {
      name: 'twitter:description',
      content:
        'Politique de confidentialité PixelProwlers : finalités, bases légales, données traitées, durées de conservation et droits.'
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

.PolicySections {
  @apply mt-6 space-y-6;
}

.PolicySection {
  @apply rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6;
}

.PolicyTitle {
  @apply text-base font-semibold text-slate-100;
}

.PolicyText {
  @apply mt-2 text-sm text-slate-300;
}

.PolicyTextGroup {
  @apply mt-2 space-y-3;
}

.PolicyList {
  @apply list-disc pl-5 text-sm text-slate-300;
}

.PolicyListItem {
  @apply mt-1;
}

.PolicyListLabel {
  @apply font-semibold text-slate-100;
}

.PolicyLink {
  @apply text-orange-200 underline underline-offset-4 hover:text-orange-100;
}

.PolicyTableWrapper {
  @apply overflow-x-auto rounded-xl border border-slate-800/60;
}

.PolicyTable {
  @apply w-full text-left text-sm text-slate-300;
}

.PolicyTableStack {
  @apply space-y-4 p-3 text-sm text-slate-300;
}

.PolicyTableStackRow {
  @apply flex flex-col gap-3 rounded-lg border border-slate-800/60 bg-slate-950/40 p-3;
}

.PolicyTableStackItem {
  @apply flex flex-col gap-1;
}

.PolicyTableStackLabel {
  @apply text-xs font-semibold uppercase tracking-wide text-slate-200;
}

.PolicyTableStackValue {
  @apply text-sm text-slate-100;
}

.PolicyTable thead th {
  @apply bg-slate-950/60 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200;
}

.PolicyTable tbody td {
  @apply px-3 py-2 align-top;
}
</style>
