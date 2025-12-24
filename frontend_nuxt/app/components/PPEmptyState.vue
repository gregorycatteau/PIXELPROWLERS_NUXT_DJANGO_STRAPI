<!--
  PPEmptyState.vue — DS ATOM (V1.STATES-R1)
  
  État vide / aucun résultat. Réutilisable partout.
  
  @props
    title       - Titre principal (requis)
    description - Description secondaire (optionnel)
    icon        - Icône (optionnel, défaut: search)
    actionLabel - Label du CTA (optionnel)
    actionTo    - NuxtLink destination (optionnel)
    tone        - 'neutral' | 'info' (défaut: neutral)
  
  @slots
    default - Contenu additionnel
    action  - CTA personnalisé (remplace actionLabel/actionTo)
  
  @usage
  <PPEmptyState
    title="Aucun résultat"
    description="Essayez d'élargir vos filtres."
    action-label="Effacer les filtres"
    @action="clearFilters"
  />
-->
<template>
  <div
    :class="['pp-state pp-state--empty', `pp-state--${tone}`]"
    role="status"
    aria-live="polite"
  >
    <!-- Icon -->
    <div v-if="icon" class="pp-state__icon" aria-hidden="true">
      <svg
        v-if="icon === 'search'"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <svg
        v-else-if="icon === 'folder'"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      </svg>
      <svg
        v-else-if="icon === 'inbox'"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    </div>

    <!-- Title -->
    <p class="pp-state__title">{{ title }}</p>

    <!-- Description -->
    <p v-if="description" class="pp-state__description">
      {{ description }}
    </p>

    <!-- Extra content slot -->
    <div v-if="$slots.default" class="pp-state__content">
      <slot />
    </div>

    <!-- Action -->
    <div v-if="$slots.action || actionLabel" class="pp-state__action">
      <slot name="action">
        <NuxtLink
          v-if="actionTo"
          :to="actionTo"
          class="pp-cta-primary"
        >
          {{ actionLabel }}
        </NuxtLink>
        <button
          v-else
          type="button"
          class="pp-cta-secondary"
          @click="$emit('action')"
        >
          {{ actionLabel }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface PPEmptyStateProps {
  title: string;
  description?: string;
  icon?: 'search' | 'folder' | 'inbox';
  actionLabel?: string;
  actionTo?: string;
  tone?: 'neutral' | 'info';
}

withDefaults(defineProps<PPEmptyStateProps>(), {
  icon: 'search',
  tone: 'neutral',
});

defineEmits<{
  (e: 'action'): void;
}>();
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
