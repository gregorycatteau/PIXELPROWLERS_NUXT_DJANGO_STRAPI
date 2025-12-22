<template>
  <GlobalBilanEngine journey-id="p3" :go-to-step="goToStep" />
</template>

<script setup lang="ts">
import GlobalBilanEngine from '@/components/journey/bilan/GlobalBilanEngine.vue';

defineProps<{
  goToStep: (stepId: string) => void;
}>();
</script>
