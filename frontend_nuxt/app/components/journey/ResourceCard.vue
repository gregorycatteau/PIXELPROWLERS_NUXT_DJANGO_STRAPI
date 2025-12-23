<template>
<PPCard as="article" variant="soft" hoverable class="ResourceCard">
    <div class="ResourceHeader">
      <p class="ResourceLevel">{{ levelLabel }}</p>
      <p class="ResourceTitle">{{ title }}</p>
    </div>
    <p class="ResourceDescription">{{ description }}</p>
    <PPButton
      class="inline-flex w-auto"
      :href="href"
      target="_blank"
      variant="secondary"
      :aria-label="`Ouvrir la ressource ${title}`"
    >
      Ouvrir la ressource
    </PPButton>
  </PPCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits<{
  (e: 'select', payload: { id: string; level: 'debutant' | 'intermediaire' | 'avance' }): void;
}>();

const props = defineProps<{
  id: string;
  title: string;
  description: string;
  level: 'debutant' | 'intermediaire' | 'avance';
  href: string;
}>();

const levelLabel = computed(() => {
  if (props.level === 'debutant') return 'Débutant';
  if (props.level === 'intermediaire') return 'Intermédiaire';
  return 'Avancé';
});

const handleClick = () => {
  emit('select', { id: props.id, level: props.level });
  if (typeof window !== 'undefined') {
    window.open(props.href, '_blank', 'noopener,noreferrer');
  }
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.ResourceCard {
  @apply flex flex-col gap-3 rounded-2xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] p-4 shadow-[var(--shadow-soft)];
}

.ResourceHeader {
  @apply space-y-1;
}

.ResourceLevel {
  @apply inline-flex items-center rounded-full bg-[color:var(--color-accent-quiet)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-accent-strong)];
}

.ResourceTitle {
  @apply text-lg font-semibold;
}

.ResourceDescription {
  @apply text-sm text-[color:var(--color-text-muted)];
}
</style>
