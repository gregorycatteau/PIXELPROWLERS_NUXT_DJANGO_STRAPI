<template>
  <aside :class="['pp-globalbilan-aside', variant === 'desktop' ? 'pp-globalbilan-aside--sticky' : 'pp-globalbilan-aside--mobile']" aria-label="Navigation bilan global P1">
    <nav class="pp-globalbilan-aside-nav" aria-label="Sommaire">
      <p class="pp-globalbilan-aside-title">Sommaire</p>
      <ul class="space-y-2">
        <li v-for="section in sections" :key="section.id">
          <button
            type="button"
            class="pp-globalbilan-aside-link"
            :class="activeSectionId === section.id ? 'pp-globalbilan-aside-link--active' : ''"
            :aria-current="activeSectionId === section.id ? 'true' : 'false'"
            @click="onNav(section.id)"
          >
            <span class="pp-globalbilan-aside-dot" :class="activeSectionId === section.id ? 'bg-[color:var(--color-accent-strong)]' : 'bg-slate-600'"></span>
            <span>{{ section.label }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <div class="pp-globalbilan-aside-card">
      <p class="pp-globalbilan-aside-title">Repères rapides</p>
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-[color:var(--color-text-muted)]">Axes</span>
          <span class="font-semibold">{{ axisSummaryLabel }}</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-[color:var(--color-text-muted)]">Blocs complétés</span>
          <span class="font-semibold">{{ blocksCompletedLabel }}</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-[color:var(--color-text-muted)]">Panorama</span>
          <span class="font-semibold">{{ panoramaAnsweredLabel }}</span>
        </div>
      </div>
    </div>

    <div class="pp-globalbilan-aside-actions">
      <button type="button" class="pp-journey-cta-secondary text-xs w-full justify-center" @click="$emit('go-hub')">
        Revenir au hub
      </button>
      <button type="button" class="pp-btn-ghost text-xs w-full justify-center" @click="$emit('go-export')">
        Aller à l’export
      </button>
      <button type="button" class="pp-btn-ghost text-[11px] w-full justify-center" @click="$emit('clear')">
        Effacer le diagnostic
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type SectionLink = { id: string; label: string };

const props = withDefaults(
  defineProps<{
    sections: SectionLink[];
    axisSummaryLabel: string;
    blocksCompletedLabel: string;
    panoramaAnsweredLabel: string;
    variant?: 'desktop' | 'mobile';
  }>(),
  {
    variant: 'desktop'
  }
);

const emit = defineEmits<{
  (e: 'navigate', id: string): void;
  (e: 'go-hub'): void;
  (e: 'go-export'): void;
  (e: 'clear'): void;
}>();

const activeSectionId = ref<string>(props.sections?.[0]?.id ?? '');
let observer: IntersectionObserver | null = null;

const onNav = (id: string) => {
  activeSectionId.value = id;
  emit('navigate', id);
};

onMounted(() => {
  if (typeof window === 'undefined' || !props.sections?.length) return;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSectionId.value = entry.target.id;
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0.1 }
  );
  props.sections.forEach((section) => {
    const el = document.getElementById(section.id);
    if (el) {
      observer?.observe(el);
    }
  });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>
