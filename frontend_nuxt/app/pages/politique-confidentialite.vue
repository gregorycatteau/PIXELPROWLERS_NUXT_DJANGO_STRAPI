<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <PPPageHeader as="h1" density="comfort" align="left">
          <template #eyebrow>
            Confidentialite
          </template>
          <template #title>
            Politique de confidentialite
          </template>
          <template #lead>
            Contenu en cours de finalisation. Besoin d'une version immediate : contactez-nous via la page Contact.
          </template>
        </PPPageHeader>
        <div class="PolicySections">
          <section class="PolicySection">
            <h2 class="PolicyTitle">Donnees traitees</h2>
            <p class="PolicyText">
              Les informations transmises via le formulaire de contact sont utilisees uniquement pour repondre a votre
              demande et assurer le suivi des echanges.
            </p>
          </section>
          <section class="PolicySection">
            <h2 class="PolicyTitle">Finalites</h2>
            <p class="PolicyText">
              Les donnees servent a organiser la prise de contact, clarifier votre besoin et convenir d'une suite
              si cela est pertinent.
            </p>
          </section>
          <section class="PolicySection">
            <h2 class="PolicyTitle">Vos droits</h2>
            <p class="PolicyText">
              Vous pouvez demander l'acces, la rectification ou la suppression de vos informations a tout moment,
              via la page Contact.
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

.PolicySections {
  @apply mt-6 space-y-6;
}

.PolicySection {
  @apply rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6;
}

.PolicyTitle {
  @apply text-base font-semibold text-slate-100;
}

.PolicyText {
  @apply mt-2 text-sm text-slate-300;
}
</style>
