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
            Nous privilegions une approche sobre et respectueuse. Cette page sera completee avec les informations
            legales et pratiques avant la mise en ligne publique.
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
