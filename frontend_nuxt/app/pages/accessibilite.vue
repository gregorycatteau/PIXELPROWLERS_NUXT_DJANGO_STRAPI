<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <PPPageHeader as="h1" density="comfort" align="left">
          <template #eyebrow>
            Accessibilite
          </template>
          <template #title>
            Engagement accessibilite
          </template>
          <template #lead>
            Nous cherchons a rendre le site lisible, navigable et utilisable pour tous. Si un obstacle est rencontre,
            merci de nous le signaler via la page Contact.
          </template>
        </PPPageHeader>
        <div class="A11ySections">
          <section class="A11ySection">
            <h2 class="A11yTitle">Etat de conformite</h2>
            <p class="A11yText">
              Une evaluation complete sera publiee une fois le site stabilise. En attendant, nous corrigeons les points
              bloquants au fil des retours.
            </p>
          </section>
          <section class="A11ySection">
            <h2 class="A11yTitle">Ameliorations en cours</h2>
            <p class="A11yText">
              Nous priorisons la lisibilite des contenus, les contrastes et la navigation au clavier sur les pages
              les plus consultees.
            </p>
          </section>
          <section class="A11ySection">
            <h2 class="A11yTitle">Nous contacter</h2>
            <p class="A11yText">
              Pour toute difficulte d'acces, utilisez la page Contact et precisez le contexte.
            </p>
          </section>
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

.A11ySections {
  @apply mt-6 space-y-6;
}

.A11ySection {
  @apply rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6;
}

.A11yTitle {
  @apply text-base font-semibold text-slate-100;
}

.A11yText {
  @apply mt-2 text-sm text-slate-300;
}
</style>
