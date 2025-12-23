<template>
  <div
    class="pp-bilan-shell"
    :class="shellClass"
    :role="role"
    :aria-labelledby="ariaLabelledby || undefined"
  >
    <div class="pp-bilan-shell__grid">
      <div class="pp-bilan-shell__main">
        <div v-if="$slots.header" class="pp-bilan-shell__header">
          <slot name="header" />
        </div>

        <div class="pp-bilan-shell__body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="pp-bilan-shell__footer">
          <slot name="footer" />
        </div>
      </div>

      <aside v-if="withAside && $slots.aside" class="pp-bilan-shell__aside">
        <slot name="aside" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Density = 'compact' | 'default' | 'comfort'
type Align = 'left' | 'center'

/**
 * PPBilanShell (DS pattern unique)
 * 
 * Wrapper layout UNIQUE pour tous les bilans de parcours.
 * - Structure : main + aside (optionnel)
 * - Props simples : density, align, withAside
 * - A11y : role + aria-labelledby
 * - Zéro logique métier : layout pur
 */
const props = withDefaults(
  defineProps<{
    density?: Density
    align?: Align
    withAside?: boolean
    role?: string
    ariaLabelledby?: string | null
  }>(),
  {
    density: 'default',
    align: 'center',
    withAside: true,
    role: 'region',
    ariaLabelledby: null
  }
)

const shellClass = computed(() => {
  const classes: string[] = []
  
  classes.push(`pp-bilan-shell--density-${props.density}`)
  classes.push(`pp-bilan-shell--align-${props.align}`)
  
  if (!props.withAside) {
    classes.push('pp-bilan-shell--no-aside')
  }
  
  return classes
})
</script>

<style scoped>
@reference "@/assets/css/main.css";
/* DS pattern : styles dans pp.components.css */
</style>
