<!--
  PPErrorState.vue — DS ATOM (V1.STATES-R1)
  
  État d'erreur neutre. IMPORTANT: Ne jamais afficher error.message brute.
  L'UI doit rester neutre pour éviter les fuites d'information.
  
  @props
    title       - Titre (défaut: "Une erreur est survenue")
    description - Description neutre (optionnel)
    retryLabel  - Label du bouton retry (défaut: "Réessayer")
    tone        - 'neutral' | 'warning' (défaut: neutral)
  
  @events
    retry - Émis quand l'utilisateur clique sur retry
  
  @slots
    default - Contenu additionnel
    action  - CTA personnalisé
  
  @usage
  <PPErrorState
    description="Impossible de charger les données."
    @retry="handleRetry"
  />
-->
<template>
  <div
    :class="['pp-state pp-state--error', `pp-state--${tone}`]"
    role="alert"
    aria-live="polite"
  >
    <!-- Icon -->
    <div class="pp-state__icon pp-state__icon--error" aria-hidden="true">
      <svg
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
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
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
    <div v-if="$slots.action || retryLabel" class="pp-state__action">
      <slot name="action">
        <button
          type="button"
          class="pp-cta-secondary"
          @click="$emit('retry')"
        >
          {{ retryLabel }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface PPErrorStateProps {
  title?: string;
  description?: string;
  retryLabel?: string;
  tone?: 'neutral' | 'warning';
}

withDefaults(defineProps<PPErrorStateProps>(), {
  title: 'Une erreur est survenue',
  retryLabel: 'Réessayer',
  tone: 'neutral',
});

defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
