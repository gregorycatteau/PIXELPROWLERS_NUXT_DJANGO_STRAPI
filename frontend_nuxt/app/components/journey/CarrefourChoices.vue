<template>
  <div class="CarrefourChoices">
    <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-4" role="list">
      <li
        v-for="(option, index) in options"
        :key="option.id"
        role="listitem"
        class="pp-journey-reveal"
        :style="{ '--pp-stagger-delay': `${index * 80}ms` }"
      >
        <CarrefourChoiceCard
          v-bind="option"
          @select="$emit('select', $event)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import CarrefourChoiceCard from './CarrefourChoiceCard.vue';

export interface CarrefourChoiceCardProps {
  id: 'n1' | 'n2' | 'n3' | 'n4';
  title: string;
  description: string;
  ctaLabel: string;
  to: string;
}

defineProps({
  options: {
    type: Array as PropType<CarrefourChoiceCardProps[]>,
    required: true
  }
});

defineEmits<{
  (e: 'select', id: CarrefourChoiceCardProps['id']): void;
}>();
</script>

<style scoped>
@reference "@/assets/css/main.css";

.CarrefourChoices {
  @apply space-y-4;
}
</style>
