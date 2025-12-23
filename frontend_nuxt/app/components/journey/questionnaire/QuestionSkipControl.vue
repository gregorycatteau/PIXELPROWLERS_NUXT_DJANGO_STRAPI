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
  <PPSkipAction
    :label="label || 'Ignorer cette question'"
    :disabled="disabled"
    @skip="handleClick"
  />
</template>
