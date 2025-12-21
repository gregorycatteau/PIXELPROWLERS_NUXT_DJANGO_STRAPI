<template>
  <JourneyLayout>
    <div class="pp-journey-panel space-y-6" role="region" aria-labelledby="journey-step-heading-E6">
      <JourneyStepHeader
        title="Et maintenant ?"
        heading-id="journey-step-heading-E6"
      />
      <div class="space-y-2">
        <p
          v-for="paragraph in introParagraphs"
          :key="paragraph"
          class="text-sm text-[color:var(--color-text-muted)]"
        >
          {{ paragraph }}
        </p>
      </div>
      <CarrefourChoices :options="optionsResolved" @select="(id) => $emit('selectOption', id)" />
    </div>
  </JourneyLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CarrefourChoices from '~/components/journey/CarrefourChoices.vue';
import JourneyLayout from '~/components/journey/JourneyLayout.vue';
import JourneyStepHeader from '~/components/journey/JourneyStepHeader.vue';
import type { CarrefourChoiceCardProps } from '~/components/journey/CarrefourChoices.vue';
import { p1EngagementCopy } from '~/config/journeys/p1EngagementCopy';

const props = defineProps<{
  options?: CarrefourChoiceCardProps[];
}>();

defineEmits<{
  (e: 'selectOption', id: CarrefourChoiceCardProps['id']): void;
}>();

const introParagraphs = computed(() => p1EngagementCopy.carrefour.intro.split('\n\n').filter(Boolean));

const defaultOptions = computed<CarrefourChoiceCardProps[]>(() => [
  {
    id: 'n1',
    title: 'N1',
    description: p1EngagementCopy.carrefour.n1.description,
    ctaLabel: p1EngagementCopy.carrefour.n1.ctaLabel,
    to: '#'
  },
  {
    id: 'n2',
    title: 'N2',
    description: p1EngagementCopy.carrefour.n2.description,
    ctaLabel: p1EngagementCopy.carrefour.n2.ctaLabel,
    to: '/contact'
  },
  {
    id: 'n3',
    title: 'N3',
    description: p1EngagementCopy.carrefour.n3.description,
    ctaLabel: p1EngagementCopy.carrefour.n3.ctaLabel,
    to: '/contact'
  },
  {
    id: 'n4',
    title: 'N4',
    description: p1EngagementCopy.carrefour.n4.description,
    ctaLabel: p1EngagementCopy.carrefour.n4.ctaLabel,
    to: '/contact'
  }
]);

const optionsResolved = computed(() => props.options ?? defaultOptions.value);
</script>
