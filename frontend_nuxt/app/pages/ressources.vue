<!--
  ressources.vue — Page /ressources (thin, NO MENHIR)
  
  Page légère : SEO + montage du composant racine PPResourcesLibraryShell.
  Toute la logique et les styles sont dans les CELLS components.
  
  @see app/components/resources/library/PPResourcesLibraryShell.vue
  @see docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_LIBRARY_SPEC.md
-->
<template>
  <main class="pp-page">
    <!-- Header -->
    <PPPageHeader as="h1" density="comfort" align="left">
      <template #eyebrow>Bibliothèque</template>
      <template #title>Ressources</template>
      <template #lead>
        Explorez notre catalogue d'outils, lectures et templates pour accompagner
        votre projet.
      </template>
    </PPPageHeader>

    <!-- Library Shell (toute la logique) -->
    <PPResourcesLibraryShell />
  </main>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// SEO (page-level only)
// -----------------------------------------------------------------------------

useHead({
  title: 'Ressources — PixelProwlers',
  meta: [
    {
      name: 'description',
      content:
        'Explorez notre catalogue d\'outils, lectures, vidéos et templates pour accompagner votre projet startup.',
    },
  ],
});
</script>

<style scoped>
@reference "@/assets/css/pp.components.css";
</style>
