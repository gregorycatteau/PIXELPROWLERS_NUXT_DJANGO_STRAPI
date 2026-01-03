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
            Les données collectées via le formulaire de contact servent à répondre à ta demande, avec conservation
            limitée et purge automatique. Les logs techniques sont anonymisés. Le diagnostic P1 reste front-only.
          </template>
        </PPPageHeader>
      </PPCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports';

const canonicalUrl = 'https://pixelprowlers.io/confidentialite';

useHead({
  title: 'Confidentialité · PixelProwlers',
  meta: [
    {
      name: 'description',
      content:
        'Politique de confidentialité : contact pour répondre, conservation limitée, logs anonymisés, diagnostic P1 front-only.'
    },
    { name: 'robots', content: 'noindex,follow' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: 'Confidentialité · PixelProwlers' },
    {
      property: 'og:description',
      content:
        'Politique de confidentialité : contact pour répondre, conservation limitée, logs anonymisés, diagnostic P1 front-only.'
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Confidentialité · PixelProwlers' },
    {
      name: 'twitter:description',
      content:
        'Politique de confidentialité : contact pour répondre, conservation limitée, logs anonymisés, diagnostic P1 front-only.'
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

</style>
