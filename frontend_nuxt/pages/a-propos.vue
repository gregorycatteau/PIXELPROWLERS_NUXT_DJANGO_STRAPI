<template>
  <div class="PageContainer">
    <section class="PageSection">
      <div class="PrimaryCard SectionIntro">
        <p class="SectionLabel">À propos</p>
        <h1 class="SectionTitle">PixelProwlers, studio pluriactif</h1>
        <p class="SectionDescription">
          Nous aidons les collectifs et organisations à clarifier leur posture, à rendre leurs offres lisibles et
          à mettre en place des expériences numériques sobres qui filtrent les bonnes demandes.
        </p>
      </div>
      <div class="PillarsGrid">
        <div class="SecondaryCard PillarCard" v-for="(item, index) in pillars" :key="index">
          <p class="PillarLabel">Pilier {{ index + 1 }}</p>
          <h2 class="PillarTitle">{{ item.title }}</h2>
          <p class="PillarText">{{ item.body }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const pillars = [
  { title: 'Clarté éditoriale', body: 'Rendre visibles les décisions, choix et renoncements.' },
  { title: 'Produit léger', body: 'Des interfaces sobres, rapides, prêtes à évoluer.' },
  { title: 'Transmission', body: 'Documenter ce qui est construit pour rester autonome.' }
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

.PillarsGrid {
  @apply grid gap-4 md:grid-cols-3;
}

.PillarCard {
  @apply space-y-2;
}

.PillarLabel {
  @apply text-sm text-orange-300;
}

.PillarTitle {
  @apply text-xl font-semibold;
}

.PillarText {
  @apply text-sm text-slate-300;
}
</style>
