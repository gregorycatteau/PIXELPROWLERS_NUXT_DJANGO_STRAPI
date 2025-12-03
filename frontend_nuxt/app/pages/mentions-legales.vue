<template>
  <div class="PageContainer">
    <section class="PageSection">
      <div class="PrimaryCard SectionIntro">
        <p class="SectionLabel">Mentions légales</p>
        <h1 class="SectionTitle">Mentions légales</h1>
        <p class="SectionDescription">
          Ce projet est en phase de préfiguration. Les informations légales et coordonnées seront complétées
          lors du déploiement public. Merci de ne pas considérer ces pages comme définitives.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports';

const canonicalUrl = 'https://pixelprowlers.io/mentions-legales';

useHead({
  title: 'Mentions légales · PixelProwlers',
  meta: [
    {
      name: 'description',
      content:
        'Mentions légales PixelProwlers. Ce projet est en phase de préfiguration, informations complètes à venir avant déploiement public.'
    },
    { name: 'robots', content: 'noindex,follow' },
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
</style>
