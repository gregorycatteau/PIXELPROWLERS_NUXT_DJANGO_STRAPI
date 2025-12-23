<template>
  <section class="pp-section ContactSection">
    <div class="ContactHeader">
      <div class="ContactIntro">
        <p class="pp-section-label">On en parle calmement ?</p>
        <h2 class="pp-section-title">Tu peux nous écrire sans avoir tout ficelé</h2>
        <p class="pp-section-desc">
          Tu peux nous raconter où tu en es, sans avoir un plan parfait, ni un cahier des charges ficelé.
          On va lire ton message comme on écoute quelqu’un en vrai, et on te répondra en te disant clairement
          si on pense être les bonnes personnes pour toi.
        </p>
      </div>
      <PPButton
        to="/accompagnement-formation"
        variant="secondary"
      >
        Voir les formats possibles
      </PPButton>
    </div>
    <form
      class="ContactForm"
      :class="{
        'pp-pulse-once': !!statusMessage,
        'pp-shake': !!errorMessage
      }"
      @submit.prevent="submitForm"
    >
      <label class="FormField">
        <span class="FormLabel">Nom complet</span>
        <input
          v-model="form.name"
          type="text"
          required
          class="pp-form-field"
          placeholder="Nom et prénom"
        />
      </label>
      <label class="FormField">
        <span class="FormLabel">Email</span>
        <input
          v-model="form.email"
          type="email"
          pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
          required
          class="pp-form-field"
          placeholder="ton@email.fr"
        />
      </label>
      <label class="FormField">
        <span class="FormLabel">Organisation (optionnel)</span>
        <input
          v-model="form.organisation"
          type="text"
          class="pp-form-field"
          placeholder="Collectif / coop / structure"
        />
      </label>
      <label class="FormField FormFieldFull">
        <span class="FormLabel">Message</span>
        <textarea
          v-model="form.message"
          rows="4"
          required
          class="pp-form-field resize-none"
          placeholder="Contexte, blocages, attentes"
        />
      </label>
      <label class="HiddenField">
        <input
          v-model="form.honeypot"
          type="text"
          tabindex="-1"
          autocomplete="off"
        />
      </label>
      <div class="FormFooter">
        <p class="FormHelper">
          On garde seulement ce qu’il faut pour te répondre. Aucune donnée n’est
          revendue, aucun ajout automatique à une liste.
        </p>
        <p class="FormHelper">
          Pas de newsletter cachée, pas de spam. Si ce n’est pas le bon moment, on pourra juste se le dire.
        </p>
        <button
          type="submit"
          class="FormButton"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Envoi...</span>
          <span v-else>Envoyer mon message pour faire le point</span>
        </button>
      </div>
      <p class="FormHelper">
        On utilise tes informations uniquement pour te répondre.
        Pas de newsletter cachée, pas de partage à des tiers, pas de suivi publicitaire derrière ton dos.
      </p>
      <div
        v-if="statusMessage"
        class="FormStatusSuccess pp-status-success"
        role="status"
        aria-live="polite"
      >
        Merci, c’est bien arrivé. {{ statusMessage }}
        On va prendre le temps de lire ton message et de te répondre sans script commercial, en te disant franchement
        si et comment on peut t’aider.
      </div>
      <div
        v-if="errorMessage"
        class="FormStatusError pp-status-error"
        role="status"
        aria-live="polite"
      >
        Oups, quelque chose a coincé.
        Le formulaire n’a pas pu partir. Vérifie ta connexion ou réessaie dans quelques minutes.
        Si le problème persiste, tu peux aussi nous écrire directement à contact@pixelprowlers.io.
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useAnalytics } from '~/composables/useAnalytics';
import { useCurrentJourney } from '~/composables/useCurrentJourney';

const config = useRuntimeConfig();

const form = reactive({
  name: '',
  email: '',
  organisation: '',
  message: '',
  honeypot: ''
});

const statusMessage = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);
const { trackEvent } = useAnalytics();
const { selectedJourney } = useCurrentJourney();

const submitForm = async () => {
  statusMessage.value = '';
  errorMessage.value = '';
  isSubmitting.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/contact/`, {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        organisation: form.organisation,
        message: form.message,
        honeypot: form.honeypot
        // Évolution possible : envoyer aussi selectedJourneyId
        // pour pré-qualifier la demande côté backend.
      }
    });
    statusMessage.value = 'Merci ! Ton message est bien transmis.';
    trackEvent('contact_submit_success', {
      journey_id: selectedJourney.value?.id ?? 'none',
      journey_label: selectedJourney.value?.label,
      from_section: 'contact'
    });
    form.name = '';
    form.email = '';
    form.organisation = '';
    form.message = '';
    form.honeypot = '';
  } catch (error: any) {
    const details = error?.data;
    errorMessage.value = details?.message || 'Une erreur est survenue. Réessaie plus tard.';
    trackEvent('contact_submit_error', {
      journey_id: selectedJourney.value?.id ?? 'none',
      journey_label: selectedJourney.value?.label,
      from_section: 'contact'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.ContactSection {
  @apply rounded-3xl border border-orange-500/30 bg-[var(--color-panel-alt)] p-6 shadow-xl shadow-orange-900/20 space-y-6;
}

.ContactHeader {
  @apply flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between;
}

.ContactIntro {
  @apply space-y-1;
}

.ContactForm {
  @apply grid gap-4 md:grid-cols-2;
}

.FormField {
  @apply flex flex-col gap-2 text-sm text-slate-200;
}

.FormFieldFull {
  @apply md:col-span-2;
}

.FormLabel {
  @apply text-sm font-semibold text-slate-200;
}

.HiddenField {
  @apply hidden;
}

.FormFooter {
  @apply flex flex-col gap-2 md:col-span-2 md:flex-row md:items-center md:justify-between;
}

.FormHelper {
  @apply text-sm text-slate-400;
}

.FormButton {
  @apply bg-orange-500 text-slate-900 shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 hover:shadow-orange-400/40 disabled:opacity-60 rounded-full px-5 py-3 font-semibold transition;
}

.FormStatusSuccess {
  @apply md:col-span-2;
}

.FormStatusError {
  @apply md:col-span-2;
}
</style>
