<template>
  <div>
    <template v-if="journeyId === 'p1'">
      <main v-if="showLanding" class="pp-page space-y-10">
        <section class="space-y-3">
          <p class="pp-section-label">Parcours P1</p>
          <h1 class="pp-section-title">Ma structure dysfonctionne (ou fatigue)</h1>
          <p class="pp-section-desc">
            Tu sens que la structure tient grâce au bricolage et à l’héroïsme. Ce parcours t’aide à éclairer les points mortels, décider quoi couper et sécuriser la gouvernance.
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              class="pp-journey-cta-primary"
              :to="startLink"
            >
              Commencer le diagnostic
            </NuxtLink>
            <NuxtLink class="pp-journey-cta-secondary" to="/contact">
              Parler avec nous
            </NuxtLink>
          </div>
        </section>

        <section class="space-y-3">
          <h2 class="pp-section-title text-lg">Ce que tu obtiens</h2>
          <ul class="list-disc list-inside space-y-2 text-sm text-[color:var(--color-text-muted)]">
            <li>Une lecture système de tes tensions (mission/cash, gouvernance, dépendances, capacité).</li>
            <li>Un plan d’action court, généré depuis tes réponses, exportable en Markdown.</li>
            <li>Des kits gratuits pour lancer une première vérif avec ton équipe.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="pp-section-title text-lg">Ressources gratuites</h2>
          <p class="pp-section-desc">
            Prends un kit et lance une première vérif en autonomie, sans compte ni friction.
          </p>
          <ResourceList :resources="resourcePreview" variant="compact" />
          <div class="flex flex-wrap gap-2">
            <NuxtLink class="pp-journey-cta-secondary inline-flex w-auto text-xs" :to="p1ResourcesLink">
              Voir toutes les ressources P1
            </NuxtLink>
            <NuxtLink class="pp-btn-ghost text-xs" :to="startLink">
              Passer directement au diagnostic
            </NuxtLink>
          </div>
        </section>
      </main>
      <P1JourneyOrchestrator v-else :initial-step-id="initialStepId" />
    </template>
    <JourneyEngineUniversal
      v-else-if="manifest?.engine === 'universal'"
      :manifest="manifest"
      :initial-step-id="initialStepId"
    />
    <div v-else class="pp-card p-6 space-y-3">
      <p class="text-lg font-semibold">{{ manifest ? 'Parcours indisponible' : 'Parcours introuvable' }}</p>
      <p class="text-sm text-[color:var(--color-text-muted)]">
        {{ manifest ? 'Le parcours demandé n’existe pas encore.' : 'Le parcours demandé est introuvable.' }}
      </p>
      <PPButton to="/" class="inline-flex w-auto" variant="secondary">Retour à l’accueil</PPButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { buildResourcesDeepLink } from '~/utils/deeplinks/resourcesDeepLink';
import ResourceList from '@/components/resources/ResourceList.vue';
import P1JourneyOrchestrator from '~/components/journey/p1/P1JourneyOrchestrator.vue';
import JourneyEngineUniversal from '~/components/journey/JourneyEngineUniversal.vue';
import { P1_RESOURCES_V1_3, type P1Resource, type P1ResourceId } from '@/config/resources/p1ResourcesV1_3';
import { p1JourneySchema } from '~/config/journeys/p1JourneySchema';
import { p2JourneySchema } from '~/config/journeys/p2JourneySchema';
import { p3JourneySchema } from '~/config/journeys/p3JourneySchema';
import { getManifestBySlug } from '~/config/journeys/manifests/registry';

const normalizeJourneySlug = (raw: unknown) => (typeof raw === 'string' ? raw.trim() : '');
const isValidJourneySlug = (slug: string) => {
  if (slug.length < 1 || slug.length > 80) {
    return false;
  }
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

definePageMeta({
  layout: 'journey',
  validate: (route) => {
    const slug = normalizeJourneySlug(route.params.journeySlug);
    if (!isValidJourneySlug(slug)) {
      return false;
    }
    return Boolean(getManifestBySlug(slug));
  }
});

const route = useRoute();

const journeySlug = computed(() => normalizeJourneySlug(route.params.journeySlug));
const manifest = computed(() => getManifestBySlug(journeySlug.value));

if (!isValidJourneySlug(journeySlug.value) || !manifest.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' });
}

const journeyId = computed(() => manifest.value?.id ?? null);

const journeySchemas: Record<string, { steps: { stepId: string }[] }> = {
  p1: p1JourneySchema,
  p2: p2JourneySchema,
  p3: p3JourneySchema
};
const allowedSteps = computed(() => journeySchemas[journeyId.value ?? '']?.steps.map((s) => s.stepId) ?? []);
const stepParam = computed(() => (typeof route.query.step === 'string' ? route.query.step : null));
const landingRequested = computed(() => journeyId.value === 'p1' && route.query.landing === '1');
const defaultStepId = computed(() => allowedSteps.value[0] ?? null);
const initialStepId = computed(() => {
  const steps = allowedSteps.value;
  if (stepParam.value && steps.includes(stepParam.value)) {
    return stepParam.value;
  }
  if (landingRequested.value) {
    return null;
  }
  return defaultStepId.value;
});

const showLanding = computed(() => landingRequested.value && !initialStepId.value);

const resourcePreview = computed<P1Resource[]>(() => {
  const ids: P1ResourceId[] = ['kit_p1_demarrage', 'kit_mission_cash', 'kit_gouvernance_veto'];
  return ids.flatMap((id) => {
    const res = P1_RESOURCES_V1_3.find((r) => r.id === id);
    return res ? [res] : [];
  });
});

const startLink = computed(() => `/parcours/${manifest.value?.slug ?? 'ma-structure-dysfonctionne'}?step=E0_intro`);

/** Deep link sécurisé vers /ressources filtré P1 (SafeDeepLinkKit) */
const p1ResourcesLink = buildResourcesDeepLink({ tags: ['p1'] });
</script>
