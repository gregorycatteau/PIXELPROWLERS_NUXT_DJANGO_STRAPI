<template>
  <section :id="sectionId" class="home-section">
    <PPSectionHeader
      as="h2"
      density="comfort"
      :title="title"
      :lead="subtitle"
    />

    <div class="home-fit-grid">
      <article class="home-fit-card home-fit-card-highlight" aria-labelledby="fit-for-title">
        <h3 id="fit-for-title" class="home-fit-title">C’est pour toi si…</h3>
        <ul class="home-fit-list">
          <li v-for="(item, idx) in fitList" :key="idx">{{ item }}</li>
        </ul>
      </article>
      <article class="home-fit-card" aria-labelledby="fit-not-title">
        <h3 id="fit-not-title" class="home-fit-title">Ce n’est pas notre cadre si…</h3>
        <ul class="home-fit-list">
          <li v-for="(item, idx) in notForList" :key="idx">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
  fitList: string[];
  notForList: string[];
  sectionId?: string;
}>();
</script>

<style scoped>
@reference "@/assets/css/main.css";

.home-fit-grid {
  @apply grid gap-4 md:grid-cols-2;
}

.home-fit-card {
  @apply rounded-2xl border border-[color:var(--color-stroke)] bg-[color:var(--color-bg-card)]/90 p-5 shadow-[var(--shadow-soft)];
}

.home-fit-title {
  @apply text-xl font-semibold leading-snug text-slate-50;
}

.home-fit-list {
  @apply mt-3 space-y-2 text-sm leading-relaxed text-[color:var(--color-text-muted)];
}

.home-fit-card-highlight {
  @apply border-[color:var(--color-accent-border)] bg-[color:var(--color-accent-quiet)]/80 shadow-[var(--shadow-accent)];
}
</style>
