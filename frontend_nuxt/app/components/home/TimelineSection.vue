<template>
  <section class="pp-section">
    <header class="pp-section-header">
      <p class="pp-section-label">Étape 3 · Comment on travaille ensemble (si tu veux aller plus loin)</p>
      <h2 class="pp-section-title">Quatre étapes, pas plus</h2>
      <p class="pp-section-desc">
        On ne vient pas retourner la table. On commence par regarder ensemble, sans promesse
        magique et sans t’obliger à tout changer. Quatre étapes posées pour passer de
        «&nbsp;on subit&nbsp;» à «&nbsp;on sait ce qu’on teste dans les prochaines semaines&nbsp;».
      </p>
    </header>
    <div class="TimelineWrapper">
      <div
        v-for="(step, index) in steps"
        :key="index"
        ref="stepCards"
        class="TimelineStep pp-reveal"
        :style="{ transitionDelay: `${index * 90}ms` }"
      >
        <div class="TimelineBadge pp-badge-accent">{{ index + 1 }}</div>
        <div
          class="TimelineLine"
          :class="{ last: index === steps.length - 1 }"
        />
        <div class="TimelineContent pp-card">
          <h3 class="TimelineTitle">{{ step.title }}</h3>
          <p class="TimelineText">{{ step.body }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type Step = {
  title: string;
  body: string;
};

defineProps<{
  steps: Step[];
}>();

const stepCards = ref<(HTMLElement | null)[]>([]);
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

  stepCards.value.forEach((el) => {
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

.TimelineWrapper {
  @apply relative flex flex-col gap-6;
}

.TimelineWrapper::before {
  content: "";
  @apply absolute left-[19px] top-5 bottom-5 w-px bg-gradient-to-b from-orange-400/60 via-orange-500/30 to-transparent;
}

.TimelineStep {
  @apply relative grid grid-cols-[auto,1fr] items-start gap-4 pl-2;
}

.TimelineBadge {
  @apply flex h-10 w-10 items-center justify-center font-bold shadow-lg shadow-orange-500/30;
}

.TimelineLine {
  @apply hidden;
}

.TimelineLine.last {
  @apply bg-transparent;
}

.TimelineContent {
  @apply space-y-1 p-4 border border-[var(--color-stroke)] shadow-md;
}

.TimelineTitle {
  @apply text-xl font-semibold leading-snug;
}

.TimelineText {
  @apply text-base leading-relaxed text-slate-300 mt-1;
}
</style>
