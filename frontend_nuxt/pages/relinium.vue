<template>
  <div class="PageContainer">
    <section class="PageSection">
      <div class="PrimaryCard SectionIntro">
        <p class="SectionLabel">Relinium</p>
        <h1 class="SectionTitle">Relinium — labo interne</h1>
        <p class="SectionDescription">
          Relinium est notre terrain d’expérimentation : outils, modèles de pages, composants éditoriaux
          et protocoles d’ateliers. On y teste avant de déployer dans vos environnements.
        </p>
      </div>
      <div class="LabGrid">
        <article v-for="(item, index) in labItems" :key="index" class="SecondaryCard LabCard">
          <h2 class="LabTitle">{{ item.title }}</h2>
          <p class="LabText">{{ item.body }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const labItems = [
  { title: 'Composants Strapi', body: 'Répertoires de contenus prêts à être déployés pour des landing pages ciblées.' },
  { title: 'Ateliers courts', body: 'Formats testés pour cadrer une offre ou une campagne en 2h.' },
  { title: 'Design system minimal', body: 'Tokens, grilles et composants à décliner dans vos environnements.' },
  { title: 'Automations', body: 'Expériences low-code pour suivre les leads et vos décisions.' }
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

.LabGrid {
  @apply grid gap-4 md:grid-cols-2;
}

.LabCard {
  @apply space-y-2;
}

.LabTitle {
  @apply text-xl font-semibold;
}

.LabText {
  @apply text-sm text-slate-300;
}
</style>
