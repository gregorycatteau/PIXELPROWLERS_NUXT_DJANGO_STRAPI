<template>
  <!--
    DS Catalog — DEV ONLY
    - Page de visualisation du Design System (atomes + cells)
    - 404 en production pour éviter toute fuite d'infos
  -->
  <div class="pp-ds-catalog-page">
    <PPDsCatalogShell />
  </div>
</template>

<script setup lang="ts">
/**
 * DS Catalog Page — DEV ONLY
 * En production, cette page retourne un 404.
 */

// ─────────────────────────────────────────────────────────────────────────────
// GUARD DEV-ONLY (P0 Sécurité)
// ─────────────────────────────────────────────────────────────────────────────
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

// ─────────────────────────────────────────────────────────────────────────────
// HEAD MINIMAL
// ─────────────────────────────────────────────────────────────────────────────
useHead({
  title: 'DS Catalog',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
@reference "@/assets/css/main.css";

.pp-ds-catalog-page {
  @apply min-h-screen;
}
</style>
