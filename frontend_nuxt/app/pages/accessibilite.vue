<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <PPPageHeader as="h1" density="comfort" align="left">
          <template #eyebrow>
            Accessibilité
          </template>
          <template #title>
            Accessibilité
          </template>
          <template #lead>
            Cette page présente notre engagement en matière d’accessibilité et l’état de conformité du site.
          </template>
        </PPPageHeader>
        <div class="A11ySections">
          <section v-for="section in a11ySections" :key="section.title" class="A11ySection">
            <h2 class="A11yTitle">{{ section.title }}</h2>
            <div class="A11yTextGroup">
              <p v-for="(paragraph, index) in section.paragraphs" :key="`${section.title}-p-${index}`" class="A11yText">
                {{ paragraph }}
              </p>
              <ul v-if="section.items.length" class="A11yList">
                <li v-for="(item, index) in section.items" :key="`${section.title}-l-${index}`" class="A11yListItem">
                  <span class="A11yListLabel">{{ item.label }}</span>
                  <span v-if="item.value">: {{ item.value }}</span>
                </li>
              </ul>
              <div v-if="section.table" class="A11yTableWrapper">
                <div class="A11yTableStack md:hidden">
                  <div v-for="(row, rowIndex) in section.table.rows" :key="`${section.title}-stack-${rowIndex}`" class="A11yTableStackRow">
                    <div v-for="(cell, cellIndex) in row" :key="`${section.title}-stack-${rowIndex}-${cellIndex}`" class="A11yTableStackItem">
                      <span class="A11yTableStackLabel">{{ cell.label }}</span>
                      <span class="A11yTableStackValue">{{ cell.value }}</span>
                    </div>
                  </div>
                </div>
                <table class="A11yTable hidden md:table">
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
                        {{ cell.value }}
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
import { useAccessibility } from '~/composables/useAccessibility';

const canonicalUrl = 'https://pixelprowlers.io/accessibilite';
const {
  status,
  engagement,
  etatConformite,
  resultats,
  contenusNonAccessibles,
  environnements,
  schema,
  retourContact,
  voiesRecours,
  misesAJour
} = useAccessibility();

const a11ySections = [
  engagement,
  etatConformite,
  resultats,
  contenusNonAccessibles,
  environnements,
  schema,
  retourContact,
  voiesRecours,
  misesAJour
];

useHead({
  title: 'Accessibilité · PixelProwlers',
  meta: [
    {
      name: 'description',
      content: "Déclaration d’accessibilité PixelProwlers et informations RGAA."
    },
    // TODO: retirer noindex quand le document passe en status=active.
    { name: 'robots', content: status === 'draft' ? 'noindex,follow' : 'index,follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: 'Accessibilité · PixelProwlers' },
    {
      property: 'og:description',
      content: "Déclaration d’accessibilité PixelProwlers et informations RGAA."
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Accessibilité · PixelProwlers' },
    {
      name: 'twitter:description',
      content: "Déclaration d’accessibilité PixelProwlers et informations RGAA."
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

.A11ySections {
  @apply mt-6 space-y-6;
}

.A11ySection {
  @apply rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6;
}

.A11yTitle {
  @apply text-base font-semibold text-slate-100;
}

.A11yText {
  @apply mt-2 text-sm text-slate-300;
}

.A11yTextGroup {
  @apply mt-2 space-y-3;
}

.A11yList {
  @apply list-disc pl-5 text-sm text-slate-300;
}

.A11yListItem {
  @apply mt-1;
}

.A11yListLabel {
  @apply font-semibold text-slate-100;
}

.A11yTableWrapper {
  @apply overflow-x-auto rounded-xl border border-slate-800/60;
}

.A11yTableStack {
  @apply space-y-4 p-3 text-sm text-slate-300;
}

.A11yTableStackRow {
  @apply flex flex-col gap-3 rounded-lg border border-slate-800/60 bg-slate-950/40 p-3;
}

.A11yTableStackItem {
  @apply flex flex-col gap-1;
}

.A11yTableStackLabel {
  @apply text-xs font-semibold uppercase tracking-wide text-slate-200;
}

.A11yTableStackValue {
  @apply text-sm text-slate-100;
}

.A11yTable {
  @apply w-full text-left text-sm text-slate-300;
}

.A11yTable thead th {
  @apply bg-slate-950/60 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200;
}

.A11yTable tbody td {
  @apply px-3 py-2 align-top;
}
</style>
