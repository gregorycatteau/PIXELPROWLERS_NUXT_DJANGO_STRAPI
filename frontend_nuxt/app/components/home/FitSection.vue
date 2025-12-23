<template>
  <section class="pp-section">
    <PPSectionHeader
      as="h2"
      density="comfort"
      eyebrow="Est-ce qu’on est faits pour travailler ensemble ?"
      title="Clarifions vite si on avance ou non"
      lead="On travaille bien quand on peut se dire les choses simplement. Voici ce que tu peux attendre de nous, et aussi quand ce n’est peut-être pas le bon format."
    />
    <div class="FitGrid">
      <article class="pp-card pp-card-hover pp-tilt-card FitCard" tabindex="0">
        <div class="FitCardHeader">
          <PPBadge variant="neutral" size="sm">Ce que tu peux attendre</PPBadge>
        </div>
        <ul class="FitList">
          <li class="FitItem">Un regard extérieur honnête sur ta situation, sans jugement et sans vernis marketing.</li>
          <li class="FitItem">Des propositions concrètes, adaptées à tes moyens et à ton rythme, pas des plans « tout refaire en trois mois ».</li>
          <li class="FitItem">Un travail qui relie le site, les outils et l’organisation, pas juste une couche de design par-dessus.</li>
          <li class="FitItem">Des explications claires, documentées, pour que tu comprennes ce qu’on fait et que tu puisses le transmettre à ton équipe.</li>
          <li class="FitItem">La possibilité de dire « stop » à tout moment si tu sens que ce n’est plus le bon moment pour toi.</li>
        </ul>
      </article>

      <article class="pp-card pp-card-hover pp-tilt-card FitCard" tabindex="0">
        <div class="FitCardHeader">
          <PPBadge variant="neutral" size="sm">Ce n’est pas pour toi si…</PPBadge>
        </div>
        <ul class="FitList">
          <li class="FitItem">Tu cherches une solution miracle « clé en main » sans vouloir regarder ce qui coince dans le fonctionnement actuel.</li>
          <li class="FitItem">Tu veux seulement un site « joli » pour cocher une case, sans te poser de questions sur l’expérience réelle de tes publics.</li>
          <li class="FitItem">Tu préfères garder le contrôle total sur tous les choix, sans accepter la contradiction ou le recul critique.</li>
          <li class="FitItem">Tu n’es pas prêt·e à partager un minimum de contexte (terrain, tensions, contraintes) pour qu’on puisse travailler proprement.</li>
          <li class="FitItem">Tu attends surtout un prestataire qui « exécute » des tâches techniques, sans te challenger sur la cohérence globale.</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
@reference "@/assets/css/main.css";

.FitGrid {
  @apply grid gap-4 md:grid-cols-2;
}

.FitCard {
  @apply space-y-3 p-5;
}

.FitCardHeader {
  @apply flex items-center justify-between;
}

.FitList {
  @apply space-y-2 text-base leading-relaxed text-slate-200;
}

.FitItem {
  @apply pl-1;
}
</style>
