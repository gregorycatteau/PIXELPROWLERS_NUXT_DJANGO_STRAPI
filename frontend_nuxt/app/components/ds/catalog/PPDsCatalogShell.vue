<template>
  <!--
    PPDsCatalogShell — Layout principal du catalogue DS
    - Nav interne (ancres)
    - Sections atomes, cells, états
  -->
  <div class="pp-ds-catalog">
    <!-- Header -->
    <header class="pp-ds-catalog__header">
      <PPPageHeader as="h1" density="comfort" align="left">
        <template #eyebrow>
          <span class="text-xs uppercase tracking-wider text-gray-500">DEV ONLY</span>
        </template>
        <template #title>Design System Catalog</template>
        <template #lead>
          <p class="text-base text-gray-600">
            Catalogue vivant des atomes et cells du Design System PixelProwlers.
          </p>
        </template>
      </PPPageHeader>
    </header>

    <!-- Navigation interne (TOC) -->
    <nav class="pp-ds-catalog__nav" aria-label="Table des matières DS">
      <ul class="pp-ds-catalog__nav-list">
        <li><a href="#atoms" class="pp-ds-catalog__nav-link">Atomes</a></li>
        <li><a href="#cells" class="pp-ds-catalog__nav-link">Cells</a></li>
        <li><a href="#states" class="pp-ds-catalog__nav-link">États</a></li>
      </ul>
    </nav>

    <!-- Sections -->
    <main class="pp-ds-catalog__main">
      <PPDsCatalogAtoms id="atoms" />
      <PPDsCatalogCells id="cells" />
      <PPDsCatalogStates id="states" />
    </main>

    <!-- Footer minimal -->
    <footer class="pp-ds-catalog__footer">
      <p class="text-xs text-gray-400">
        DS Catalog — Accessible uniquement en développement.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * PPDsCatalogShell — Shell principal du catalogue DS
 * Contient la structure globale : header, nav, sections, footer.
 */
</script>

<style scoped>
@reference "@/assets/css/main.css";

.pp-ds-catalog {
  @apply max-w-5xl mx-auto px-4 py-8 space-y-8;
}

.pp-ds-catalog__header {
  @apply pb-4 border-b border-gray-200;
}

.pp-ds-catalog__nav {
  @apply sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-3 border-b border-gray-100;
}

.pp-ds-catalog__nav-list {
  @apply flex flex-wrap gap-4;
}

.pp-ds-catalog__nav-link {
  @apply text-sm font-medium text-gray-600 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded px-2 py-1 transition-colors;
}

.pp-ds-catalog__main {
  @apply space-y-12;
}

.pp-ds-catalog__footer {
  @apply pt-8 border-t border-gray-100 text-center;
}
</style>
