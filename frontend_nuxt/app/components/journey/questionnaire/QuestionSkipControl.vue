<script setup lang="ts">
const emit = defineEmits<{
  (e: 'skip'): void;
}>();

const props = defineProps<{
  label?: string;
  isSkipped?: boolean;
  disabled?: boolean;
  describedBy?: string;
}>();

const handleClick = () => {
  if (props.disabled) return;
  emit('skip');
};
</script>

<template>
  <button
    type="button"
    class="pp-likert-skip-button"
    :class="{ 'pp-likert-skip-button--active': isSkipped }"
    :disabled="disabled"
    :aria-pressed="isSkipped ? 'true' : 'false'"
    :aria-describedby="describedBy"
    @click="handleClick"
  >
    <span aria-hidden="true">🛡</span>
    <span>{{ label || 'Ignorer cette question' }}</span>
  </button>
</template>
