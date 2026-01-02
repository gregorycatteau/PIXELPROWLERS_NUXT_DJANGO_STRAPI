<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <PPPageHeader as="h1" density="comfort" align="left">
          <template #eyebrow>
            Offre
          </template>
          <template #title>
            Ce que nous faisons
          </template>
          <template #lead>
            Une offre courte et lisible, centrée sur l'essentiel. Rien de plus, rien de moins.
          </template>
        </PPPageHeader>
        <div class="OfferGrid">
          <div class="OfferCard">
            <p class="OfferTitle">On fait</p>
            <ul class="OfferList">
              <li>Clarifier une situation complexe et poser les bonnes questions.</li>
              <li>Structurer un parcours sobre pour aider a decider.</li>
              <li>Donner un cadre de travail et des livrables reutilisables.</li>
            </ul>
          </div>
          <div class="OfferCard">
            <p class="OfferTitle">On ne fait pas</p>
            <ul class="OfferList">
              <li>Promettre des resultats irrealisables ou des delais intenables.</li>
              <li>Gerer des demandes sans objectif clair ni arbitrages.</li>
              <li>Remplacer un collectif dans ses choix structurants.</li>
            </ul>
          </div>
        </div>
      </PPCard>
    </section>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-6xl mx-auto px-6 space-y-12 pb-16;
}

.OfferGrid {
  @apply mt-6 grid gap-4 md:grid-cols-2;
}

.OfferCard {
  @apply rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 space-y-3;
}

.OfferTitle {
  @apply text-sm font-semibold text-orange-300;
}

.OfferList {
  @apply space-y-2 text-sm text-slate-200/90;
}
</style>
