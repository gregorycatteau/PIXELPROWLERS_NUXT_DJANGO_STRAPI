<template>
  <div class="PageContainer">
    <section class="PageSection">
      <div class="PrimaryCard SectionIntro">
        <p class="SectionLabel">Accompagnement & formation</p>
        <h1 class="SectionTitle">Formats courts pour avancer vite</h1>
        <p class="SectionDescription">
          Choisis un format adapté à ta maturité : diagnostic express, sprint d’alignement ou
          accompagnement sur 6 semaines pour livrer et documenter.
        </p>
      </div>
      <div class="OffersGrid">
        <article v-for="(offer, index) in offers" :key="index" class="SecondaryCard OfferCard">
          <h2 class="OfferTitle">{{ offer.title }}</h2>
          <p class="OfferText">{{ offer.body }}</p>
          <p class="OfferDuration">{{ offer.duration }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const offers = [
  { title: 'Diagnostic rapide', body: 'Cartographie des irritants, priorisation immédiate.', duration: '1 semaine' },
  { title: 'Sprint cadrage', body: 'Formaliser proposition de valeur, messages et parcours visiteurs.', duration: '2 semaines' },
  { title: 'Accompagnement', body: 'Sprints + transfert de compétences, documentation et suivi des métriques.', duration: '4-6 semaines' }
];
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

.OffersGrid {
  @apply grid gap-4 md:grid-cols-3;
}

.OfferCard {
  @apply space-y-2;
}

.OfferTitle {
  @apply text-xl font-semibold;
}

.OfferText {
  @apply text-sm text-slate-300;
}

.OfferDuration {
  @apply text-sm text-orange-300 font-semibold;
}
</style>
