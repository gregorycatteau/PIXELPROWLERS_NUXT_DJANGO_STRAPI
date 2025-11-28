<template>
  <div class="PageContainer">
    <section class="PageSection">
      <div class="PrimaryCard SectionIntro">
        <p class="SectionLabel">Confidentialité</p>
        <h1 class="SectionTitle">Politique de confidentialité</h1>
        <p class="SectionDescription">
          Les données collectées via le formulaire de contact servent uniquement à répondre à ta demande.
          Nous ne partageons rien avec des tiers. Cette page sera enrichie avec les mentions RGPD détaillées
          avant mise en production.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

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
