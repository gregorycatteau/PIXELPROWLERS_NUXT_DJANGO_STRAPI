<template>
  <main class="pp-page space-y-8">
    <PPPageHeader as="h1" density="comfort" align="left">
      <template #eyebrow>
        Contact
      </template>
      <template #title>
        Nous écrire
      </template>
      <template #lead>
        Utilise le formulaire de contact pour nous écrire. Tu peux aussi nous joindre via contact@pixelprowlers.io.
      </template>
    </PPPageHeader>

    <p class="text-sm text-[color:var(--color-text-muted)]">
      Les infos envoyées via ce formulaire sont traitées pour répondre, avec conservation limitée.
      Voir <NuxtLink to="/confidentialite">Confidentialité</NuxtLink>.
    </p>

    <PPCard as="section" variant="default" class="p-6">
      <form class="grid gap-4 md:grid-cols-2" novalidate @submit.prevent="submitForm">
        <label class="flex flex-col gap-2 text-sm text-slate-200">
          <span class="text-sm font-semibold text-slate-200">Prénom (optionnel)</span>
          <input
            ref="firstNameRef"
            v-model.trim="form.firstName"
            type="text"
            autocomplete="given-name"
            class="pp-form-field"
            :aria-invalid="Boolean(fieldErrors.firstName)"
            :aria-describedby="fieldErrors.firstName ? 'firstName-error' : undefined"
            placeholder="Prénom"
          />
          <span v-if="fieldErrors.firstName" id="firstName-error" class="text-xs text-rose-300">{{ fieldErrors.firstName }}</span>
        </label>

        <label class="flex flex-col gap-2 text-sm text-slate-200">
          <span class="text-sm font-semibold text-slate-200">Nom (optionnel)</span>
          <input
            ref="lastNameRef"
            v-model.trim="form.lastName"
            type="text"
            autocomplete="family-name"
            class="pp-form-field"
            :aria-invalid="Boolean(fieldErrors.lastName)"
            :aria-describedby="fieldErrors.lastName ? 'lastName-error' : undefined"
            placeholder="Nom"
          />
          <span v-if="fieldErrors.lastName" id="lastName-error" class="text-xs text-rose-300">{{ fieldErrors.lastName }}</span>
        </label>

        <label class="flex flex-col gap-2 text-sm text-slate-200 md:col-span-2">
          <span class="text-sm font-semibold text-slate-200">Email</span>
          <input
            ref="emailRef"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            class="pp-form-field"
            :aria-invalid="Boolean(fieldErrors.email)"
            :aria-describedby="fieldErrors.email ? 'email-error' : undefined"
            placeholder="ton@email.fr"
            required
          />
          <span v-if="fieldErrors.email" id="email-error" class="text-xs text-rose-300">{{ fieldErrors.email }}</span>
        </label>

        <label class="flex flex-col gap-2 text-sm text-slate-200 md:col-span-2">
          <span class="text-sm font-semibold text-slate-200">Message</span>
          <textarea
            ref="messageRef"
            v-model.trim="form.message"
            rows="5"
            class="pp-form-field resize-none"
            :aria-invalid="Boolean(fieldErrors.message)"
            :aria-describedby="fieldErrors.message ? 'message-error' : undefined"
            placeholder="Contexte, blocages, attentes"
            required
          />
          <span v-if="fieldErrors.message" id="message-error" class="text-xs text-rose-300">{{ fieldErrors.message }}</span>
        </label>

        <label class="hidden">
          <input
            v-model="form.company"
            type="text"
            tabindex="-1"
            autocomplete="off"
          />
        </label>

        <label class="md:col-span-2 flex items-start gap-3 text-sm text-slate-200">
          <input
            ref="consentRef"
            v-model="form.consent"
            type="checkbox"
            class="mt-1"
            :aria-invalid="Boolean(fieldErrors.consent)"
            :aria-describedby="fieldErrors.consent ? 'consent-error' : undefined"
            required
          />
          <span>
            J’accepte que mes informations soient utilisées uniquement pour me recontacter.
          </span>
        </label>
        <span v-if="fieldErrors.consent" id="consent-error" class="text-xs text-rose-300 md:col-span-2">
          {{ fieldErrors.consent }}
        </span>

        <div class="md:col-span-2 flex flex-col gap-3">
          <PPButton type="submit" variant="primary" :loading="isSubmitting" :disabled="isSubmitting">
            Envoyer
          </PPButton>
          <p class="text-sm text-[color:var(--color-text-muted)]">
            Pas de spam, pas de tracking. Conservation limitée.
          </p>
        </div>

        <p
          v-if="statusMessage"
          class="md:col-span-2 text-sm"
          :class="statusTone === 'success' ? 'text-emerald-300' : 'text-amber-300'"
          role="status"
        >
          {{ statusMessage }}
          <span v-if="ticketId" class="block text-xs text-[color:var(--color-text-muted)]">Référence : {{ ticketId }}</span>
        </p>

        <p v-if="formError" class="md:col-span-2 text-sm text-rose-300" role="alert">
          {{ formError }}
        </p>
      </form>
    </PPCard>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  message: '',
  consent: false,
  company: ''
});

const fieldErrors = reactive<Record<string, string>>({});
const formError = ref('');
const statusMessage = ref('');
const statusTone = ref<'success' | 'neutral'>('neutral');
const ticketId = ref<string | null>(null);
const isSubmitting = ref(false);
const formStartTs = ref(0);

const firstNameRef = ref<HTMLInputElement | null>(null);
const lastNameRef = ref<HTMLInputElement | null>(null);
const emailRef = ref<HTMLInputElement | null>(null);
const messageRef = ref<HTMLTextAreaElement | null>(null);
const consentRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  formStartTs.value = Date.now();
});

const resetErrors = () => {
  formError.value = '';
  statusMessage.value = '';
  ticketId.value = null;
  statusTone.value = 'neutral';
  Object.keys(fieldErrors).forEach((key) => {
    delete fieldErrors[key];
  });
};

const focusFirstError = () => {
  if (fieldErrors.firstName) return firstNameRef.value?.focus();
  if (fieldErrors.lastName) return lastNameRef.value?.focus();
  if (fieldErrors.email) return emailRef.value?.focus();
  if (fieldErrors.message) return messageRef.value?.focus();
  if (fieldErrors.consent) return consentRef.value?.focus();
};

const submitForm = async () => {
  resetErrors();
  isSubmitting.value = true;
  try {
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - formStartTs.value) / 1000));
    const response = await $fetch<{ status: string; message?: string; ticketId?: string | null }>(
      `${config.public.apiBase}/api/v1/contact/`,
      {
        method: 'POST',
        body: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          message: form.message,
          consent: form.consent,
          honeypot: form.company,
          clientTimeOnPageSeconds: elapsedSeconds
        }
      }
    );

    if (response.status === 'ok') {
      statusTone.value = 'success';
      statusMessage.value = 'Message reçu. Si besoin, nous reviendrons vers toi.';
      ticketId.value = response.ticketId ?? null;
      form.firstName = '';
      form.lastName = '';
      form.email = '';
      form.message = '';
      form.consent = false;
      form.company = '';
      formStartTs.value = Date.now();
      return;
    }

    statusTone.value = 'neutral';
    statusMessage.value = response.message || 'Réessaie plus tard.';
  } catch (error: any) {
    const data = error?.data;
    if (data?.errors) {
      Object.entries(data.errors).forEach(([key, value]) => {
        fieldErrors[key] = String(value);
      });
      formError.value = 'Certains champs sont à corriger.';
      focusFirstError();
    } else {
      formError.value = data?.message || 'Une erreur est survenue. Réessaie plus tard.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
