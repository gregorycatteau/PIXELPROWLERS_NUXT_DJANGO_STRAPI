<template>
  <section :id="sectionId" class="home-section">
    <PPSectionHeader
      as="h2"
      density="comfort"
      :title="title"
      :lead="subtitle"
    />

    <div class="home-now-grid">
      <article
        v-for="item in items"
        :key="item.id"
        class="home-now-card"
        tabindex="0"
        @click="emitBlockClick(item.id)"
        @keypress.enter.prevent="emitBlockClick(item.id)"
      >
        <h3 class="home-now-title">{{ item.title }}</h3>
        <p class="home-now-body">{{ item.body }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
export type HomeNowBlockId = 'now-words' | 'now-clarity' | 'now-action';

export type HomeNowBlock = {
  id: HomeNowBlockId;
  title: string;
  body: string;
};

const props = defineProps<{
  title: string;
  subtitle?: string;
  items: HomeNowBlock[];
  sectionId?: string;
}>();

const emit = defineEmits<{
  (e: 'block-click', payload: { blockId: HomeNowBlockId }): void;
}>();

const emitBlockClick = (blockId: HomeNowBlockId) => {
  emit('block-click', { blockId });
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.home-now-grid {
  @apply grid gap-4 md:grid-cols-3;
}

.home-now-card {
  @apply rounded-2xl border border-[color:var(--color-stroke)] bg-[color:var(--color-bg-card)]/90 p-5 shadow-[var(--shadow-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950;
}

.home-now-title {
  @apply text-xl font-semibold leading-snug text-slate-50;
}

.home-now-body {
  @apply mt-2 text-sm leading-relaxed text-[color:var(--color-text-muted)];
}
</style>
