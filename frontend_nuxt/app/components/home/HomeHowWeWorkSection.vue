<template>
  <section :id="sectionId" class="home-section">
    <PPSectionHeader
      as="h2"
      density="comfort"
      :title="title"
      :lead="subtitle"
    />

    <div class="home-how-grid">
      <article
        v-for="(step, idx) in steps"
        :key="step.title"
        class="home-how-card"
      >
        <PPBadge as="div" variant="neutral" size="sm">{{ idx + 1 }}</PPBadge>
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

.home-how-title {
  @apply text-xl font-semibold leading-snug text-slate-50;
}

.home-how-body {
  @apply text-sm leading-relaxed text-[color:var(--color-text-muted)];
}
</style>
