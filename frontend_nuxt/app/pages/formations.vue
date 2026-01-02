<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <PPPageHeader as="h1" density="comfort" align="left">
          <template #eyebrow>
            Formations
          </template>
          <template #title>
            Catalogue en construction
          </template>
          <template #lead>
            Les formations seront presentes ici une fois le cadre finalise. Aucun calendrier n'est publie a ce stade.
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
