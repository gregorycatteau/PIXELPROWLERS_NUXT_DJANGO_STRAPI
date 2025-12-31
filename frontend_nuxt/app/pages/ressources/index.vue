<!--
  ressources/index.vue — Page /ressources (Registry V0)

  Page légère : SEO + montage du composant racine PPResourcesLibraryShell.
  Toute la logique et les styles sont dans les CELLS components.

  @see app/components/resources/library/PPResourcesLibraryShell.vue
  @see docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_LIBRARY_SPEC.md
-->
<template>
  <main class="pp-page">
    <!-- Header -->
    <PPPageHeader as="h1" density="comfort" align="left">
      <template #eyebrow>Bibliotheque</template>
      <template #title>Ressources</template>
      <template #lead>
        Explorez notre pack de ressources sur le diagnostic, la securite, l'UX,
        la gouvernance et l'outillage.
      </template>
    </PPPageHeader>

    <!-- Library Shell (toute la logique) -->
    <PPResourcesLibraryShell />
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Ressources — PixelProwlers',
  meta: [
    {
      name: 'description',
      content:
        "Explorez notre pack de ressources sur le diagnostic, la securite, l'UX, la gouvernance et l'outillage.",
    },
  ],
});
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
