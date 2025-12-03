<template>
  <section class="pp-section">
    <header class="pp-section-header">
      <p class="pp-section-label">Ce qu’on fait ensemble</p>
      <h2 class="pp-section-title">Trois axes pour rendre ta situation lisible</h2>
      <p class="pp-section-desc">
        On ne te propose pas un «&nbsp;plan parfait&nbsp;» qui explose au premier imprévu.
        On part de ce que tu vis vraiment&nbsp;: règles qui changent en cours de route,
        financements aléatoires, engagement en dents de scie. À partir de là, on dessine
        une trajectoire assez solide pour tenir… et assez souple pour encaisser les
        secousses.
      </p>
    </header>
    <div class="AxisGrid">
      <article
        v-for="(axis, index) in axes"
        :key="index"
        ref="axisCards"
        class="pp-card pp-card-hover AxisCard pp-reveal"
        :style="{ transitionDelay: `${index * 80}ms` }"
      >
        <div class="AxisTop">
          <span class="pp-badge-pill">{{ axis.badge }}</span>
          <span class="AxisIcon">{{ axis.icon }}</span>
        </div>
        <h3 class="AxisTitle">{{ axis.title }}</h3>
        <p class="AxisDescription">{{ axis.body }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type Axis = {
  title: string;
  body: string;
  badge: string;
  icon: string;
};

defineProps<{
  axes: Axis[];
}>();

const axisCards = ref<(HTMLElement | null)[]>([]);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  axisCards.value.forEach((el) => {
    if (!el) return;
    el.classList.add('pp-reveal');
    observer?.observe(el);
  });
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.AxisGrid {
  @apply grid gap-4 md:grid-cols-3;
}

.AxisCard {
  @apply space-y-3 p-5;
}

.AxisTop {
  @apply flex items-center justify-between;
}

.AxisIcon {
  @apply text-lg;
}

.AxisTitle {
  @apply text-xl font-semibold leading-snug;
}

.AxisDescription {
  @apply text-base leading-relaxed text-slate-300 mt-2;
}
</style>
