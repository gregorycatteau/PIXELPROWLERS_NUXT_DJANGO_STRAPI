<template>
  <PPProgress
    :current="effectiveCurrent"
    :total="effectiveTotal"
    :label="label"
    mode="both"
    :showHeader="true"
  />
</template>

<script setup lang="ts">
/**
 * Adapter legacy → DS atom.
 * Important : API stable (zéro surprise) : on accepte plusieurs noms de props si existants.
 */
const props = defineProps<{
  current?: number
  total?: number
  value?: number
  max?: number
  label?: string
}>()

const effectiveCurrent = computed(() => {
  if (typeof props.current === 'number') return props.current
  if (typeof props.value === 'number') return props.value
  return 0
})

const effectiveTotal = computed(() => {
  if (typeof props.total === 'number') return props.total
  if (typeof props.max === 'number') return props.max
  return 0
})
</script>
