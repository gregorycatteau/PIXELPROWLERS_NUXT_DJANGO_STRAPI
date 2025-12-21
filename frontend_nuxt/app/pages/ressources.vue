<template>
  <main class="pp-page space-y-8">
    <header class="pp-section-header">
      <p class="pp-section-label">Ressources</p>
      <h1 class="pp-section-title">Ressources</h1>
      <p class="pp-section-desc">
        Kits prêts à l’emploi, en téléchargement direct. Pas de compte, pas de tunnel : tu choisis et tu testes.
      </p>
    </header>

    <section class="space-y-4">
      <div class="flex flex-wrap gap-2 items-center">
        <p class="text-sm text-[color:var(--color-text-muted)]">Filtrer par tag :</p>
        <button
          v-for="tag in availableTags"
          :key="tag"
          type="button"
          class="px-3 py-1 rounded-full border text-xs"
          :class="selectedTag === tag ? 'border-[color:var(--color-primary)] text-[color:var(--color-primary)]' : 'border-[color:var(--color-text-muted)] text-[color:var(--color-text)]'"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
        <button
          v-if="selectedTag"
          type="button"
          class="px-3 py-1 rounded-full border text-xs border-[color:var(--color-text-muted)] text-[color:var(--color-text)]"
          @click="clearTag"
        >
          Réinitialiser
        </button>
      </div>

      <section class="space-y-3">
        <h2 class="pp-section-title text-lg">P1 — Ma structure dysfonctionne</h2>
        <ResourceList :resources="filteredResources" variant="full" />
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from '#imports';
import ResourceList from '@/components/resources/ResourceList.vue';
import { useP1Resources } from '@/composables/useP1Resources';

const { allResources } = useP1Resources();
const selectedTag = ref<string | null>(null);
const route = useRoute();

watchEffect(() => {
  if (route.query.focus === 'p1') {
    selectedTag.value = 'p1';
  }
});

const availableTags = computed(() => {
  const tags = new Set<string>();
  allResources.value.forEach((res) => res.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
});

const filteredResources = computed(() => {
  if (!selectedTag.value) return allResources.value;
  return allResources.value.filter((res) => res.tags.includes(selectedTag.value as string));
});

const toggleTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag;
};

const clearTag = () => {
  selectedTag.value = null;
};
</script>
