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
            Nous travaillons a rendre le site clair, lisible et utilisable pour tous. Si un obstacle est rencontre,
            merci de nous contacter pour corriger au plus vite.
          </template>
        </PPPageHeader>
      </PPCard>
    </section>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-6xl mx-auto px-6 space-y-12 pb-16;
}
</style>
