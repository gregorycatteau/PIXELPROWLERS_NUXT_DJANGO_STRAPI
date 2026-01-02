<template>
  <div class="PageContainer">
    <section class="PageSection">
      <PPCard as="section" variant="default">
        <p class="PolicyText">Redirection vers la politique de confidentialité…</p>
      </PPCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#imports';

await navigateTo('/politique-confidentialite', { redirectCode: 301 });
</script>

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-6xl mx-auto px-6 space-y-12 pb-16;
}

.PolicyText {
  @apply text-sm text-slate-300;
}
</style>
