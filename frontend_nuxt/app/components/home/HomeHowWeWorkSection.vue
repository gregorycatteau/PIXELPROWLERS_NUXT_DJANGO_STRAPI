<template>
  <section :id="sectionId" class="home-section">
    <header class="home-section-header">
      <h2 class="home-section-title">{{ title }}</h2>
      <p v-if="subtitle" class="home-section-subtitle">{{ subtitle }}</p>
    </header>

    <div class="home-how-grid">
      <article
        v-for="(step, idx) in steps"
        :key="step.title"
        class="home-how-card"
      >
        <div class="home-how-badge">{{ idx + 1 }}</div>
        <div class="home-how-content">
          <h3 class="home-how-title">{{ step.title }}</h3>
          <p class="home-how-body">{{ step.body }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
export type HomeHowStep = {
  title: string;
  body: string;
};

const props = defineProps<{
  title: string;
  subtitle?: string;
  steps: ReadonlyArray<HomeHowStep>;
  sectionId?: string;
}>();
</script>

<style scoped>
@reference "@/assets/css/main.css";

.home-how-grid {
  @apply grid gap-4 md:grid-cols-3;
}

.home-how-card {
  @apply relative rounded-2xl border border-[color:var(--color-stroke)] bg-[color:var(--color-bg-card)]/90 p-5 shadow-[var(--shadow-soft)] space-y-3;
}

.home-how-badge {
  @apply flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-accent-quiet)] text-[color:var(--color-accent-strong)] font-bold;
}

.home-how-title {
  @apply text-xl font-semibold leading-snug text-slate-50;
}

.home-how-body {
  @apply text-sm leading-relaxed text-[color:var(--color-text-muted)];
}
</style>
