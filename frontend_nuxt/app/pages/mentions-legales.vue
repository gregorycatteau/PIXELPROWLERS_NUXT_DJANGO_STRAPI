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
            Ce projet est en phase de préfiguration. Les informations légales et coordonnées seront complétées
            lors du déploiement public. Merci de ne pas considérer ces pages comme définitives.
          </template>
        </PPPageHeader>
        <div class="LegalSections">
          <section class="LegalSection">
            <h2 class="LegalTitle">Éditeur du site</h2>
            <p class="LegalText">
              Les informations d’édition sont en cours de finalisation. Pour toute question immédiate, merci de passer
              par la page Contact.
            </p>
          </section>
          <section class="LegalSection">
            <h2 class="LegalTitle">Hébergement</h2>
            <p class="LegalText">
              Les détails d’hébergement seront communiqués dès stabilisation de la publication publique.
            </p>
          </section>
          <section class="LegalSection">
            <h2 class="LegalTitle">Contact</h2>
            <p class="LegalText">
              Pour un échange rapide, utilisez la page Contact et précisez le sujet de votre demande.
            </p>
          </section>
        </div>
      </PPCard>
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
</style>
