<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <PPPageHeader as="h1" density="comfort" align="left">
          <template #eyebrow>
            Erreur 404
          </template>
          <template #title>
            Page introuvable
          </template>
          <template #lead>
            La page demandee n'existe pas ou n'est plus disponible. Vous pouvez reprendre la navigation ici.
          </template>
        </PPPageHeader>
        <div class="CtaGrid" aria-label="Raccourcis de navigation">
          <NuxtLink to="/" class="CtaLink">Accueil</NuxtLink>
          <NuxtLink to="/offre" class="CtaLink">Offre</NuxtLink>
          <NuxtLink :to="p1Link" class="CtaLink">Parcours (P1)</NuxtLink>
          <NuxtLink :to="resourcesLink" class="CtaLink">Ressources</NuxtLink>
        </div>
      </PPCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { setResponseStatus } from 'h3';
import { buildResourcesDeepLink } from '@/utils/deeplinks/resourcesDeepLink';

const p1Link = '/parcours/ma-structure-dysfonctionne';
const resourcesLink = buildResourcesDeepLink({});

// Force un 404 SSR propre pour toutes les routes inconnues.
const requestEvent = useRequestEvent();
if (requestEvent) {
  setResponseStatus(requestEvent, 404);
}
</script>

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-6xl mx-auto px-6 space-y-12 pb-16;
}

.CtaGrid {
  @apply mt-6 grid gap-3 sm:grid-cols-2;
}

.CtaLink {
  @apply rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-orange-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950;
}
</style>
