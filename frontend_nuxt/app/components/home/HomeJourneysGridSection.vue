<template>
  <section :id="sectionId" class="home-section">
    <header class="home-section-header">
      <h2 class="home-section-title">{{ title }}</h2>
      <p class="home-section-subtitle">{{ subtitle }}</p>
    </header>

    <div class="home-journeys-grid">
      <HomeJourneyCard
        v-for="journey in journeys"
        :key="journey.id"
        :id="journey.id"
        :title="journey.title"
        :situation="journey.situation"
        :outcome="journey.outcome"
        :cta-label="journey.ctaLabel"
        :badge-label="journey.badgeLabel"
        :is-available="journey.isAvailable"
        :is-emphasized="journey.isEmphasized"
        @select="emitJourneyClick"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import HomeJourneyCard from './HomeJourneyCard.vue';
import type { HomeJourneyConfig, HomeJourneyId } from '~/config/homeJourneysConfig';

const props = defineProps<{
  journeys: HomeJourneyConfig[];
  title: string;
  subtitle: string;
  sectionId?: string;
}>();

const emit = defineEmits<{
  (e: 'journey-click', payload: { journeyId: HomeJourneyId }): void;
}>();

const emitJourneyClick = (journeyId: string) => {
  emit('journey-click', { journeyId: journeyId as HomeJourneyId });
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.home-journeys-grid {
  @apply grid gap-4 md:grid-cols-2 xl:grid-cols-3;
}
</style>
